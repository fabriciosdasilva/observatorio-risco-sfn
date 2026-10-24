"""
Módulo de engenharia de atributos temporais e análise econométrica de defasagem (Lags).
Calcula Função de Correlação Cruzada (CCF), testes de estacionariedade (ADF) e Causalidade de Granger
entre choques na política monetária (Selic) e a trajetória da inadimplência.
"""

from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller, grangercausalitytests


def test_stationarity(series: pd.Series) -> Dict[str, Any]:
    """
    Executa o teste Augmented Dickey-Fuller (ADF) para avaliar estacionariedade.
    """
    clean_series = series.dropna()
    result = adfuller(clean_series, autolag="AIC")
    return {
        "adf_statistic": float(result[0]),
        "p_value": float(result[1]),
        "used_lag": int(result[2]),
        "n_obs": int(result[3]),
        "is_stationary": bool(result[1] < 0.05),
        "critical_values": {k: float(v) for k, v in result[4].items()},
    }


def compute_cross_correlation(
    series_x: pd.Series, series_y: pd.Series, max_lags: int = 18
) -> Dict[str, Any]:
    """
    Calcula a correlação cruzada normalizada entre series_x(t) e series_y(t + lag) para lag in [0, max_lags].
    Exemplo: series_x = Selic, series_y = Inadimplência.
    Um pico no lag k indica que a Selic hoje atinge o pico de correlação com a inadimplência k meses depois.
    """
    df = pd.DataFrame({"x": series_x, "y": series_y}).dropna()
    correlations = []
    lags = list(range(0, max_lags + 1))

    for k in lags:
        if k == 0:
            corr = df["x"].corr(df["y"])
        else:
            corr = df["x"].corr(df["y"].shift(-k))
        correlations.append(float(corr) if not np.isnan(corr) else 0.0)

    # Identificar lag com máxima correlação absoluta
    abs_corrs = [abs(c) for c in correlations]
    peak_lag = int(np.argmax(abs_corrs))
    peak_corr = float(correlations[peak_lag])

    return {
        "lags": lags,
        "correlations": [round(c, 4) for c in correlations],
        "peak_lag_months": peak_lag,
        "peak_correlation": round(peak_corr, 4),
    }


def test_granger_causality(
    series_cause: pd.Series, series_effect: pd.Series, max_lag: int = 12
) -> Dict[int, float]:
    """
    Testa se series_cause ajuda a prever estatisticamente series_effect (Causalidade de Granger).
    Retorna o p-valor do teste F para cada lag considerado.
    """
    # Para séries financeiras, usar a primeira diferença para garantir estacionariedade
    dx = series_cause.diff().dropna()
    dy = series_effect.diff().dropna()
    aligned = pd.concat([dy, dx], axis=1).dropna()
    aligned.columns = ["y", "x"]

    p_values = {}
    try:
        results = grangercausalitytests(aligned, maxlag=max_lag, verbose=False)
        for lag, test_result in results.items():
            # Teste F de soma de coeficientes restritos
            f_pvalue = test_result[0]["ssr_ftest"][1]
            p_values[lag] = round(float(f_pvalue), 5)
    except Exception as e:
        p_values[-1] = str(e)

    return p_values


def create_lagged_features(
    df: pd.DataFrame, target_col: str, feature_cols: List[str], lags: List[int]
) -> pd.DataFrame:
    """
    Gera colunas defasadas (lags) sem vazamento de dados futuros.
    """
    df_out = df.copy()
    for col in feature_cols:
        for lag in lags:
            df_out[f"{col}_lag{lag}"] = df_out[col].shift(lag)

    # Lags do próprio target (autorregressivo)
    for lag in [1, 2, 3, 6, 12]:
        df_out[f"{target_col}_lag{lag}"] = df_out[target_col].shift(lag)

    return df_out
