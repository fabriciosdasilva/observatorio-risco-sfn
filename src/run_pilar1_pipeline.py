"""
Script executor do Pilar 1:
Executa a análise econométrica de defasagem (lags), Causalidade de Granger,
modelagem preditiva (Baseline vs Ridge vs LightGBM) e Backtesting Walk-Forward para todas as modalidades.
Exporta o artefato consolidado para data/output_json/pilar1_macro_lags.json.
"""

import json
import logging
from pathlib import Path
import pandas as pd
from src.models.macro_credit_model import run_macro_credit_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def run_all_modalities():
    parquet_path = "data/raw/sgs_macro_credit.parquet"
    logger.info(f"Carregando dados consolidados de {parquet_path}...")
    df = pd.read_parquet(parquet_path)

    modalities = [
        {"key": "inad_pf_cartao_rotativo", "label": "Cartão Rotativo (PF)"},
        {"key": "inad_pf_pessoal_livre", "label": "Crédito Pessoal Não-Consignado (PF)"},
        {"key": "inad_pf_consignado", "label": "Crédito Consignado (PF)"},
        {"key": "inad_pf_veiculos", "label": "Financiamento de Veículos (PF)"},
        {"key": "inad_pf_imobiliario", "label": "Financiamento Imobiliário (PF)"},
        {"key": "inad_pj_capital_giro", "label": "Capital de Giro (PJ)"},
    ]

    all_results = {
        "metadata": {
            "source": "Banco Central do Brasil (SGS)",
            "start_date": str(df["date"].min())[:10],
            "end_date": str(df["date"].max())[:10],
            "n_months": len(df),
            "macro_variables": ["selic_anualizada", "ipca_12m", "ibc_br", "desemprego_pnad"],
        },
        "lag_summary_comparison": [],
        "modalities": {},
    }

    for mod in modalities:
        target = mod["key"]
        label = mod["label"]
        logger.info(f"\n==========================================")
        logger.info(f"Processando modalidade: {label} ({target})")
        logger.info(f"==========================================")

        res = run_macro_credit_pipeline(
            df=df,
            target_col=target,
            initial_train_size=48,  # 4 anos de treino inicial
            horizon=3,              # projeção de 3 meses (trimestre)
        )

        res["label"] = label
        all_results["modalities"][target] = res

        # Resumo comparativo de defasagem (pico da Selic -> Inadimplência)
        naive_rmse = res["backtesting"]["metrics"]["naive_baseline"]["rmse"]
        ridge_rmse = res["backtesting"]["metrics"]["ridge_arx"]["rmse"]
        lgbm_rmse = res["backtesting"]["metrics"]["lightgbm"]["rmse"]

        all_results["lag_summary_comparison"].append({
            "target": target,
            "label": label,
            "peak_lag_months": res["cross_correlation"]["peak_lag_months"],
            "peak_correlation": res["cross_correlation"]["peak_correlation"],
            "naive_rmse": naive_rmse,
            "ridge_rmse": ridge_rmse,
            "lgbm_rmse": lgbm_rmse,
            "ridge_improvement_pct": round((1 - ridge_rmse / naive_rmse) * 100, 2),
            "lgbm_improvement_pct": round((1 - lgbm_rmse / naive_rmse) * 100, 2),
            "ridge_directional_acc": res["backtesting"]["metrics"]["ridge_arx"]["directional_accuracy_percent"],
            "lgbm_directional_acc": res["backtesting"]["metrics"]["lightgbm"]["directional_accuracy_percent"],
            "ridge_beats_baseline": res["backtesting"]["metrics"]["ridge_arx"]["beats_baseline_statistically"],
        })

    # Criar pasta de saída
    Path("data/output_json").mkdir(parents=True, exist_ok=True)
    output_json = "data/output_json/pilar1_macro_lags.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    logger.info(f"\nResultados do Pilar 1 salvos com sucesso em {output_json}!")

    # Exibir tabela resumo executiva
    print("\n" + "=" * 90)
    print("RESUMO EXECUTIVO DO BACKTESTING - PILAR 1 (TRANSMISSÃO DA SELIC)")
    print("=" * 90)
    print(f"{'Modalidade':<32} | {'Pico Defasagem':<14} | {'Corr. Pico':<10} | {'RMSE Ridge':<11} | {'Ganho Ridge':<12} | {'RMSE Naive'}")
    print("-" * 90)
    for row in all_results["lag_summary_comparison"]:
        print(f"{row['label']:<32} | {str(row['peak_lag_months']) + ' meses':<14} | {row['peak_correlation']:<10} | {row['ridge_rmse']:<11} | {str(row['ridge_improvement_pct']) + '%' :<12} | {row['naive_rmse']}")
    print("=" * 90)


if __name__ == "__main__":
    run_all_modalities()
