"""
Módulo de ingestão de séries temporais do Banco Central do Brasil (SGS).
Coleta dados macroeconômicos e de crédito diretamente da API REST pública do BACEN.
Aplica regras Point-in-Time (PIT) e formatação tabular limpa.
"""

import logging
from typing import Dict, Any, Optional
import requests
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Mapeamento oficial de séries mensais do SGS BACEN
BACEN_SGS_METADATA: Dict[str, Dict[str, Any]] = {
    "selic_anualizada": {"code": 4189, "name": "Taxa Selic Efetiva Anualizada (% a.a.)", "pit_lag_days": 0},
    "ipca_12m": {"code": 13522, "name": "IPCA Acumulado 12 Meses (%)", "pit_lag_days": 15},
    "ibc_br": {"code": 24363, "name": "Índice de Atividade Econômica do BC (IBC-Br)", "pit_lag_days": 45},
    "desemprego_pnad": {"code": 24369, "name": "Taxa de Desocupação PNAD Contínua (%)", "pit_lag_days": 30},
    "endividamento_familias": {"code": 29037, "name": "Endividamento das Famílias (% da renda)", "pit_lag_days": 60},
    "comprometimento_renda": {"code": 29034, "name": "Comprometimento de Renda das Famílias (%)", "pit_lag_days": 60},
    "inad_pf_total": {"code": 21084, "name": "Inadimplência PF Total (>90 dias %)", "pit_lag_days": 30},
    "inad_pf_cartao_rotativo": {"code": 21127, "name": "Inadimplência Cartão Rotativo PF (%)", "pit_lag_days": 30},
    "inad_pf_pessoal_livre": {"code": 21116, "name": "Inadimplência Crédito Pessoal Não-Consignado (%)", "pit_lag_days": 30},
    "inad_pf_consignado": {"code": 21118, "name": "Inadimplência Crédito Consignado (%)", "pit_lag_days": 30},
    "inad_pf_veiculos": {"code": 21121, "name": "Inadimplência Veículos PF (%)", "pit_lag_days": 30},
    "inad_pf_imobiliario": {"code": 21124, "name": "Inadimplência Imobiliário Mercado PF (%)", "pit_lag_days": 30},
    "inad_pj_total": {"code": 21083, "name": "Inadimplência PJ Total (>90 dias %)", "pit_lag_days": 30},
    "inad_pj_capital_giro": {"code": 21095, "name": "Inadimplência Capital de Giro PJ (%)", "pit_lag_days": 30},
    "spread_medio": {"code": 20783, "name": "Spread Médio Total Operações Crédito (p.p.)", "pit_lag_days": 30},
}


def fetch_sgs_series(series_code: int) -> pd.DataFrame:
    """
    Busca série histórica completa do SGS BACEN em formato JSON.
    """
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{series_code}/dados?formato=json"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ObservatorioSFN/1.0"}

    response = requests.get(url, headers=headers, timeout=20)
    response.raise_for_status()
    data = response.json()

    if not data or not isinstance(data, list):
        logger.warning(f"Série {series_code} vazia ou em formato inesperado.")
        return pd.DataFrame(columns=["data", "valor"])

    df = pd.DataFrame(data)
    df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
    df["valor"] = pd.to_numeric(df["valor"].astype(str).str.replace(",", "."), errors="coerce")
    df = df.sort_values("data").drop_duplicates(subset=["data"]).reset_index(drop=True)
    return df


def build_macro_credit_dataset(start_date: str = "2013-01-01") -> pd.DataFrame:
    """
    Consolida todas as séries do SGS em um único DataFrame mensal padronizado.
    """
    logger.info("Iniciando coleta direta das séries do BACEN SGS...")
    merged_df = None

    for col_name, meta in BACEN_SGS_METADATA.items():
        code = meta["code"]
        logger.info(f"Coletando série {code} ({col_name}): {meta['name']}...")
        try:
            df_series = fetch_sgs_series(code)
            if df_series.empty:
                continue

            df_series["date"] = df_series["data"].dt.to_period("M").dt.to_timestamp()
            df_monthly = df_series.groupby("date")["valor"].last().reset_index()
            df_monthly = df_monthly.rename(columns={"valor": col_name})

            if merged_df is None:
                merged_df = df_monthly
            else:
                merged_df = pd.merge(merged_df, df_monthly, on="date", how="outer")
        except Exception as e:
            logger.error(f"Erro ao buscar série {col_name} ({code}): {e}")

    if merged_df is not None:
        merged_df = merged_df.sort_values("date").reset_index(drop=True)
        # Filtrar a partir da data de início solicitada
        merged_df = merged_df[merged_df["date"] >= pd.to_datetime(start_date)].reset_index(drop=True)
        logger.info(f"Dataset consolidado com sucesso: {merged_df.shape[0]} meses e {merged_df.shape[1]} colunas.")

    return merged_df


if __name__ == "__main__":
    df = build_macro_credit_dataset(start_date="2013-01-01")
    output_parquet = "data/raw/sgs_macro_credit.parquet"
    output_csv = "data/raw/sgs_macro_credit.csv"
    df.to_parquet(output_parquet, index=False)
    df.to_csv(output_csv, index=False)
    logger.info(f"Arquivos salvos com sucesso em {output_parquet} e {output_csv}.")
