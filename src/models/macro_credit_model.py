"""
Módulo de Modelagem e Backtesting do Pilar 1 (Macro -> Inadimplência e Defasagem).
Compara Baseline Naive (Random Walk) vs Ridge (AR-X) vs LightGBM com lags em validação Walk-Forward.
Calcula testes de Diebold-Mariano e intervalos de confiança de 95% via Block Bootstrap.
"""

import logging
from typing import Dict, Any, List
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
import lightgbm as lgb

from src.features.macro_lags import (
    compute_cross_correlation,
    test_granger_causality,
    test_stationarity,
    create_lagged_features,
)
from src.backtesting.walk_forward import PointInTimeWalkForward
from src.backtesting.metrics import (
    compute_regression_metrics,
    diebold_mariano_test,
    block_bootstrap_confidence_interval,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def run_macro_credit_pipeline(
    df: pd.DataFrame,
    target_col: str = "inad_pf_cartao_rotativo",
    macro_cols: List[str] = None,
    initial_train_size: int = 60,  # 5 anos de treino inicial
    horizon: int = 3,              # 3 meses à frente
) -> Dict[str, Any]:
    """
    Executa o pipeline completo de análise de defasagem, modelagem e backtesting Walk-Forward para uma modalidade.
    """
    if macro_cols is None:
        macro_cols = ["selic_anualizada", "ipca_12m", "ibc_br", "desemprego_pnad", "endividamento_familias", "comprometimento_renda"]
    # Garantir que só usa colunas existentes no dataset
    macro_cols = [c for c in macro_cols if c in df.columns]

    # 1. Análise Econométrica de Defasagem (Selic -> Target)
    logger.info(f"Calculando Correlação Cruzada e Causalidade de Granger para {target_col}...")
    ccf_result = compute_cross_correlation(df["selic_anualizada"], df[target_col], max_lags=18)
    granger_pvalues = test_granger_causality(df["selic_anualizada"], df[target_col], max_lag=12)
    stationarity_target = test_stationarity(df[target_col])

    # 2. Engenharia de Lags sem Data Leakage
    lags = [1, 2, 3, 6, 9, 12]
    df_features = create_lagged_features(df, target_col=target_col, feature_cols=macro_cols, lags=lags)

    # Definir colunas preditoras
    feature_names = [c for c in df_features.columns if c not in ["date", target_col] and "_lag" in c]

    # Descartar linhas iniciais com NaNs decorrentes dos lags
    df_clean = df_features.dropna(subset=feature_names + [target_col]).reset_index(drop=True)

    # 3. Backtesting Walk-Forward
    logger.info(f"Iniciando Walk-Forward Backtesting (Horizonte = {horizon} meses, Treino Inicial = {initial_train_size} meses)...")
    wf = PointInTimeWalkForward(initial_train_size=initial_train_size, horizon=horizon, step=1, rolling=False)

    y_all_true = []
    y_all_naive = []
    y_all_ridge = []
    y_all_lgbm = []
    dates_test = []

    for train_idx, test_idx in wf.split(df_clean):
        train_data = df_clean.iloc[train_idx]
        test_data = df_clean.iloc[test_idx]

        X_train = train_data[feature_names]
        y_train = train_data[target_col]
        X_test = test_data[feature_names]
        y_test = test_data[target_col]

        # Baseline: Naive / Persistence (último valor observado antes do horizonte de teste)
        last_observed = train_data[target_col].iloc[-1]
        pred_naive = np.full(shape=len(y_test), fill_value=last_observed)

        # Modelo 1: Ridge (AR-X) com pré-processamento estritamente fitado no treino
        ridge_pipe = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("model", Ridge(alpha=10.0, random_state=42))
        ])
        ridge_pipe.fit(X_train, y_train)
        pred_ridge = ridge_pipe.predict(X_test)

        # Modelo 2: LightGBM Regressor
        lgb_model = lgb.LGBMRegressor(
            n_estimators=60,
            learning_rate=0.05,
            num_leaves=15,
            random_state=42,
            verbose=-1
        )
        lgb_model.fit(X_train, y_train)
        pred_lgbm = lgb_model.predict(X_test)

        y_all_true.extend(y_test.values)
        y_all_naive.extend(pred_naive)
        y_all_ridge.extend(pred_ridge)
        y_all_lgbm.extend(pred_lgbm)
        dates_test.extend(test_data["date"].dt.strftime("%Y-%m-%d").values)

    y_true_arr = np.array(y_all_true)
    y_naive_arr = np.array(y_all_naive)
    y_ridge_arr = np.array(y_all_ridge)
    y_lgbm_arr = np.array(y_all_lgbm)

    # 4. Cálculo de Métricas Comparativas e Teste de Diebold-Mariano
    metrics_naive = compute_regression_metrics(y_true_arr, y_naive_arr)
    metrics_ridge = compute_regression_metrics(y_true_arr, y_ridge_arr, y_baseline=y_naive_arr)
    metrics_lgbm = compute_regression_metrics(y_true_arr, y_lgbm_arr, y_baseline=y_naive_arr)

    # Intervalos de Confiança (Block Bootstrap 95%)
    ci_lgbm = block_bootstrap_confidence_interval(y_true_arr, y_lgbm_arr)

    # Feature Importances do LightGBM final
    final_lgb = lgb.LGBMRegressor(n_estimators=80, learning_rate=0.05, num_leaves=15, random_state=42, verbose=-1)
    final_lgb.fit(df_clean[feature_names], df_clean[target_col])
    importances = dict(zip(feature_names, [round(float(v), 2) for v in final_lgb.feature_importances_]))
    top_features = dict(sorted(importances.items(), key=lambda x: x[1], reverse=True)[:10])

    return {
        "target": target_col,
        "cross_correlation": ccf_result,
        "granger_pvalues": granger_pvalues,
        "stationarity": stationarity_target,
        "backtesting": {
            "n_evaluated_windows": len(y_true_arr) // horizon,
            "horizon_months": horizon,
            "metrics": {
                "naive_baseline": metrics_naive,
                "ridge_arx": metrics_ridge,
                "lightgbm": metrics_lgbm,
            },
            "confidence_intervals_95_lgbm": ci_lgbm,
        },
        "top_feature_importances": top_features,
        "test_series_sample": {
            "dates": dates_test[-24:],  # últimos 24 meses do backtest
            "actual": [round(float(v), 2) for v in y_true_arr[-24:]],
            "predicted_lgbm": [round(float(v), 2) for v in y_lgbm_arr[-24:]],
            "predicted_naive": [round(float(v), 2) for v in y_naive_arr[-24:]],
        }
    }
