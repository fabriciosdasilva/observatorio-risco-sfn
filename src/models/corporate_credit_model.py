"""
Módulo de Modelagem de Risco de Crédito Corporativo (Pilar 3 - CVM).
Treina modelos de Early Warning (Baseline Altman Z vs Regressão Logística vs XGBoost Calibrado).
Validação estritamente Out-of-Time (Treino: 2018-2021, Teste OOT: 2022-2023).
Calcula métricas regulatórias (KS, Gini, Brier) e explicabilidade com TreeSHAP.
"""

import json
import logging
from typing import Dict, Any, List
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
import xgboost as xgb
import shap

from src.backtesting.metrics import compute_credit_risk_metrics

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def run_corporate_credit_pipeline() -> Dict[str, Any]:
    panel_path = "data/processed/cvm_corporate_panel.parquet"
    logger.info(f"Carregando painel de balanços de {panel_path}...")
    df = pd.read_parquet(panel_path)

    # Definir features contábeis de risco estritamente operacionais (sem proxies diretas do target)
    feature_cols = [
        "liquidez_corrente",
        "cobertura_juros",
        "alavancagem_dl_ebit",
        "pressao_curto_prazo",
        "margem_liquida",
        "roe",
        "divida_bruta",
        "divida_liquida",
        "disponibilidades",
        "ebit_operacional",
        "fco_caixa_operacional",
        "receita_liquida",
    ]

    # Limpeza de infinitos para valores finitos razoáveis
    df_clean = df.copy()
    for col in feature_cols:
        df_clean[col] = df_clean[col].replace([np.inf, -np.inf], np.nan)
        # Limitar outliers extremos para percentis 1% e 99%
        p01 = df_clean[col].quantile(0.01)
        p99 = df_clean[col].quantile(0.99)
        df_clean[col] = df_clean[col].clip(lower=p01, upper=p99)

    # 1. Divisão Out-of-Time (OOT) Rigorosa
    # Treino: 2018 a 2021 | Teste OOT: 2022 a 2025 (ciclo agudo de juros, quebras e recuperação)
    train_mask = df_clean["ano"] <= 2021
    test_mask = df_clean["ano"] >= 2022

    X_train = df_clean.loc[train_mask, feature_cols]
    y_train = df_clean.loc[train_mask, "target_distress"]
    X_test = df_clean.loc[test_mask, feature_cols]
    y_test = df_clean.loc[test_mask, "target_distress"]
    meta_test = df_clean.loc[test_mask, ["CNPJ_CIA", "DENOM_CIA", "ano", "DT_REFER"]]

    logger.info(f"Divisão OOT: Treino {X_train.shape[0]} amostras (2018-2021), Teste {X_test.shape[0]} amostras (2022-2025).")

    # 2. Baseline 1: Regressão Logística
    imputer = SimpleImputer(strategy="median")
    scaler = StandardScaler()

    X_train_proc = scaler.fit_transform(imputer.fit_transform(X_train))
    X_test_proc = scaler.transform(imputer.transform(X_test))

    log_reg = LogisticRegression(C=0.1, max_iter=500, random_state=42)
    log_reg.fit(X_train_proc, y_train)
    prob_log_reg = log_reg.predict_proba(X_test_proc)[:, 1]
    metrics_log_reg = compute_credit_risk_metrics(y_test, prob_log_reg)

    # 3. Modelo Principal: XGBoost com Calibração de Probabilidade
    base_xgb = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss"
    )
    # Calibração com Sigmoid/Isotônica para probabilidade precisa (IFRS 9 / Basileia)
    calibrated_xgb = CalibratedClassifierCV(estimator=base_xgb, method="sigmoid", cv=3)
    calibrated_xgb.fit(X_train_proc, y_train)
    prob_xgb = calibrated_xgb.predict_proba(X_test_proc)[:, 1]
    metrics_xgb = compute_credit_risk_metrics(y_test, prob_xgb)

    # 4. Explicabilidade SHAP
    logger.info("Calculando valores TreeSHAP para explicabilidade de comitê de crédito...")
    # Treinar um XGB direto com mesmos hiperparâmetros para TreeExplainer
    direct_xgb = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss"
    )
    direct_xgb.fit(X_train_proc, y_train)
    explainer = shap.TreeExplainer(direct_xgb)
    shap_values = explainer.shap_values(X_test_proc)

    # Importância média absoluta de cada feature
    mean_abs_shap = np.mean(np.abs(shap_values), axis=0)
    feature_importance_shap = {
        col: round(float(val), 4) for col, val in sorted(zip(feature_cols, mean_abs_shap), key=lambda x: x[1], reverse=True)
    }

    # 5. Adicionar previsões e scores ao dataframe de teste
    df_results = meta_test.copy()
    df_results["prob_distress"] = np.round(prob_xgb * 100, 2)
    # Classificação de Rating de Risco (Simulando escala bancária A a H)
    df_results["rating"] = pd.cut(
        df_results["prob_distress"],
        bins=[-np.inf, 2.0, 5.0, 10.0, 20.0, 40.0, 70.0, 100.0],
        labels=["AAA", "AA", "A", "BBB", "BB", "B", "CCC/Distress"]
    )
    df_results["ground_truth_distress"] = y_test.values

    # Identificar top 3 fatores de risco SHAP por empresa
    company_shap_drivers = []
    for i in range(len(df_results)):
        row_shap = shap_values[i]
        top_driver_indices = np.argsort(np.abs(row_shap))[-3:][::-1]
        drivers = [
            {"feature": feature_cols[idx], "shap_impact": round(float(row_shap[idx]), 3)}
            for idx in top_driver_indices
        ]
        company_shap_drivers.append(drivers)

    df_results["top_shap_drivers"] = company_shap_drivers

    # Filtrar empresas de interesse público para exibição rápida
    tracked_sample = df_results[
        df_results["DENOM_CIA"].str.contains(
            "AMERICANAS|GOL LINHAS|MAGAZINE LUIZA|CASAS BAHIA|LIGHT|MARISA|PETROBRAS|VALE|ITAU|BRADESCO",
            case=False,
            na=False
        )
    ].drop_duplicates(subset=["DENOM_CIA", "ano"]).sort_values(["ano", "prob_distress"], ascending=[False, False])

    output_dict = {
        "metadata": {
            "title": "Early Warning de Risco de Crédito PJ (CVM)",
            "train_period": "2018-2021",
            "test_oot_period": "2022-2025",
            "n_train_samples": len(X_train),
            "n_test_samples": len(X_test),
        },
        "oot_backtesting_metrics": {
            "logistic_regression": metrics_log_reg,
            "calibrated_xgboost": metrics_xgb,
        },
        "feature_importance_shap": feature_importance_shap,
        "sample_companies_monitor": tracked_sample.to_dict(orient="records"),
    }

    # Salvar artefato JSON
    Path("data/output_json").mkdir(parents=True, exist_ok=True)
    out_file = "data/output_json/pilar3_cvm_empresas.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_dict, f, ensure_ascii=False, indent=2)

    logger.info(f"Resultados do Pilar 3 salvos em {out_file}!")

    print("\n" + "=" * 80)
    print("RESUMO EXECUTIVO DO BACKTESTING OUT-OF-TIME - PILAR 3 (CRÉDITO PJ CVM)")
    print("=" * 80)
    print(f"{'Métrica':<25} | {'Regressão Logística':<20} | {'XGBoost Calibrado'}")
    print("-" * 80)
    print(f"{'ROC-AUC':<25} | {metrics_log_reg['roc_auc']:<20} | {metrics_xgb['roc_auc']}")
    print(f"{'Coeficiente Gini':<25} | {metrics_log_reg['gini']:<20} | {metrics_xgb['gini']}")
    print(f"{'Estatística KS':<25} | {metrics_log_reg['ks_stat']:<20} | {metrics_xgb['ks_stat']}")
    print(f"{'Brier Score (Calibração)':<25} | {metrics_log_reg['brier_score']:<20} | {metrics_xgb['brier_score']}")
    print(f"{'PR-AUC':<25} | {metrics_log_reg['pr_auc']:<20} | {metrics_xgb['pr_auc']}")
    print("=" * 80)

    return output_dict


if __name__ == "__main__":
    run_corporate_credit_pipeline()
