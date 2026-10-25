"""
Módulo do Pilar 2: Análise de Balanços e Solvência dos Grandes Bancos Brasileiros.
Compara a evolução patrimonial, rentabilidade (ROE), ativo total e despesas de captação
entre os grandes bancos tradicionais e digitais (Itaú, Bradesco, BB, Santander, BTG, Inter, Pan).
Executa simulação de Stress Testing (choque de perdas sob Resolução CMN 4.966 / IFRS 9).
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, List
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

TARGET_BANKS = {
    "60.872.504/0001-23": {"short_name": "Itaú Unibanco", "type": "Tradicional"},
    "60.746.948/0001-12": {"short_name": "Bradesco", "type": "Tradicional"},
    "00.000.000/0001-91": {"short_name": "Banco do Brasil", "type": "Público"},
    "90.400.888/0001-42": {"short_name": "Santander Brasil", "type": "Tradicional"},
    "30.306.294/0001-45": {"short_name": "BTG Pactual", "type": "Investimento"},
    "00.416.968/0001-01": {"short_name": "Banco Inter", "type": "Digital"},
    "59.285.411/0001-13": {"short_name": "Banco Pan", "type": "Varejo/Consignado"},
    "28.195.667/0001-06": {"short_name": "ABC Brasil", "type": "Atacado/Corporate"},
}


def run_bank_peer_analysis() -> Dict[str, Any]:
    panel_path = "data/processed/cvm_corporate_panel.parquet"
    logger.info(f"Carregando balanços bancários de {panel_path}...")
    df = pd.read_parquet(panel_path)

    # Filtrar bancos pelo CNPJ_CIA
    df_banks = df[df["CNPJ_CIA"].isin(TARGET_BANKS.keys())].copy()
    df_banks["banco_nome"] = df_banks["CNPJ_CIA"].map(lambda x: TARGET_BANKS[x]["short_name"])
    df_banks["tipo_banco"] = df_banks["CNPJ_CIA"].map(lambda x: TARGET_BANKS[x]["type"])

    # Ordenar por banco e ano
    df_banks = df_banks.sort_values(["banco_nome", "ano"]).reset_index(drop=True)

    bank_summaries = {}
    yearly_aggregates = []

    for cnpj, meta in TARGET_BANKS.items():
        short_name = meta["short_name"]
        bank_slice = df_banks[df_banks["CNPJ_CIA"] == cnpj].copy()

        if bank_slice.empty:
            continue

        history = []
        for _, row in bank_slice.iterrows():
            ativo_bi = round(float(row["ativo_total"]) / 1e9, 2)
            pl_bi = round(float(row["patrimonio_liquido"]) / 1e9, 2)
            lucro_bi = round(float(row["lucro_liquido"]) / 1e9, 2)
            desp_fin_bi = round(float(abs(row["despesas_financeiras"])) / 1e9, 2)
            roe_pct = round(float(row["roe"]) * 100, 2) if not np.isnan(row["roe"]) else 0.0

            history.append({
                "ano": int(row["ano"]),
                "ativo_total_bi": ativo_bi,
                "patrimonio_liquido_bi": pl_bi,
                "lucro_liquido_bi": lucro_bi,
                "despesas_captacao_bi": desp_fin_bi,
                "roe_pct": roe_pct,
            })

        # Simulação de Stress Testing (Choque de Risco / Resolução CMN 4.966)
        # Cenário de estresse: Aumento de 1.5% nas perdas de crédito estimadas sobre o ativo
        latest = history[-1] if history else None
        if latest and latest["patrimonio_liquido_bi"] > 0:
            perda_estresse_bi = round(latest["ativo_total_bi"] * 0.015, 2)
            lucro_estressado_bi = round(latest["lucro_liquido_bi"] - perda_estresse_bi, 2)
            roe_estressado_pct = round((lucro_estressado_bi / latest["patrimonio_liquido_bi"]) * 100, 2)
            stress_test = {
                "ano_base": latest["ano"],
                "cenario": "Choque de Inadimplência (+1.5% do Ativo)",
                "perda_adicional_estimada_bi": perda_estresse_bi,
                "lucro_pos_choque_bi": lucro_estressado_bi,
                "roe_base_pct": latest["roe_pct"],
                "roe_pos_choque_pct": roe_estressado_pct,
                "resiliente": bool(lucro_estressado_bi > 0),
            }
        else:
            stress_test = {}

        bank_summaries[short_name] = {
            "cnpj": cnpj,
            "tipo": meta["type"],
            "historico": history,
            "stress_test": stress_test,
        }

    output_dict = {
        "metadata": {
            "title": "Raio-X dos Grandes Bancos Brasileiros (CVM/BACEN)",
            "period": "2018-2025",
            "n_institutions": len(bank_summaries),
            "stress_scenario_standard": "Resolução CMN nº 4.966 / IFRS 9 Forward-Looking Stress",
        },
        "banks": bank_summaries,
    }

    # Salvar artefato JSON
    Path("data/output_json").mkdir(parents=True, exist_ok=True)
    out_file = "data/output_json/pilar2_bancos_balancos.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_dict, f, ensure_ascii=False, indent=2)

    logger.info(f"Resultados do Pilar 2 salvos em {out_file}!")

    print("\n" + "=" * 95)
    print("RESUMO EXECUTIVO - PILAR 2: BALANÇOS E STRESS TESTING DOS BANCOS (2018-2025)")
    print("=" * 95)
    print(f"{'Banco':<20} | {'Tipo':<14} | {'Ativo Total':<14} | {'Patr. Líquido':<14} | {'ROE Atual':<11} | {'ROE Estresse'}")
    print("-" * 95)
    for b_name, b_data in bank_summaries.items():
        st = b_data.get("stress_test", {})
        latest = b_data["historico"][-1] if b_data["historico"] else {}
        ativo_str = f"R$ {latest.get('ativo_total_bi', 0)} bi"
        pl_str = f"R$ {latest.get('patrimonio_liquido_bi', 0)} bi"
        roe_str = f"{latest.get('roe_pct', 0)}%"
        roe_stress_str = f"{st.get('roe_pos_choque_pct', 0)}%"
        print(f"{b_name:<20} | {b_data['tipo']:<14} | {ativo_str:<14} | {pl_str:<14} | {roe_str:<11} | {roe_stress_str}")
    print("=" * 95)

    return output_dict


if __name__ == "__main__":
    run_bank_peer_analysis()
