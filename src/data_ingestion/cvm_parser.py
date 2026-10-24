"""
Módulo de ingestão e parsing das Demonstrações Financeiras Padronizadas (DFP) da CVM.
Coleta Balanço Ativo (BPA), Balanço Passivo (BPP), DRE e DFC das companhias abertas na B3.
Extrai o plano de contas IFRS consolidado e calcula os índices de liquidez, solvência e endividamento.
"""

import io
import logging
import zipfile
from typing import List, Dict, Any, Optional
import requests
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Mapeamento do Plano de Contas Padronizado CVM (IFRS Consolidado)
CVM_ACCOUNT_MAP = {
    # Balanço Ativo (BPA)
    "1": "ativo_total",
    "1.01": "ativo_circulante",
    "1.01.01": "caixa_equivalentes",
    "1.01.02": "aplicacoes_financeiras",
    "1.01.03": "contas_a_receber",
    "1.01.04": "estoques",
    # Balanço Passivo (BPP)
    "2.01": "passivo_circulante",
    "2.01.02": "fornecedores_cp",
    "2.01.04": "emprestimos_cp",
    "2.02.01": "emprestimos_lp",
    "2.03": "patrimonio_liquido",
    # DRE (Empresas Não-Financeiras e Financeiras)
    "3.01": "receita_liquida",
    "3.03": "resultado_bruto",
    "3.05": "ebit_operacional",
    "3.06.01": "receitas_financeiras",
    "3.06.02": "despesas_financeiras",
    "3.09": "lucro_liquido_bancos",
    "3.11": "lucro_liquido_corporativo",
    # DFC
    "6.01": "fco_caixa_operacional",
}

# Lista de casos notáveis de estresse/RJ ou empresas monitoradas
TRACKED_COMPANIES_BENCHMARK = [
    "LOJAS AMERICANAS", "AMERICANAS", "GOL LINHAS AEREAS", "OI S.A.", "LIGHT S.A.",
    "VIA S.A.", "CASAS BAHIA", "MAGAZINE LUIZA", "MARISA LOJAS", "PETROBRAS",
    "VALE S.A.", "EMBRAER", "SUZANO", "WEG S.A.", "JBS S.A.", "MARFRIG",
    "ITAU UNIBANCO", "BANCO BRADESCO", "BANCO DO BRASIL", "BANCO SANTANDER"
]


def download_cvm_dfp_year(year: int) -> Dict[str, pd.DataFrame]:
    """
    Baixa e extrai os arquivos consolidados da DFP para um ano específico.
    """
    url = f"https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_{year}.zip"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ObservatorioSFN/1.0"}

    logger.info(f"Baixando CVM DFP ano {year} ({url})...")
    response = requests.get(url, headers=headers, timeout=60)
    response.raise_for_status()

    z = zipfile.ZipFile(io.BytesIO(response.content))
    namelist = z.namelist()

    datasets = {}
    needed = {
        "bpa": f"dfp_cia_aberta_BPA_con_{year}.csv",
        "bpp": f"dfp_cia_aberta_BPP_con_{year}.csv",
        "dre": f"dfp_cia_aberta_DRE_con_{year}.csv",
        "dfc": f"dfp_cia_aberta_DFC_MD_con_{year}.csv",
    }

    for key, filename in needed.items():
        if filename in namelist:
            df = pd.read_csv(z.open(filename), sep=";", encoding="ISO-8859-1", low_memory=False)
            # Filtrar apenas último exercício (ORDEM_EXERC == 'ÚLTIMO')
            if "ORDEM_EXERC" in df.columns:
                df = df[df["ORDEM_EXERC"] == "ÚLTIMO"]
            datasets[key] = df
        else:
            logger.warning(f"Arquivo {filename} não encontrado no zip do ano {year}.")

    return datasets


def parse_cvm_financial_statements(years: List[int]) -> pd.DataFrame:
    """
    Processa os balanços dos anos especificados e consolida uma tabela em painel com índices contábeis.
    """
    all_years_data = []

    for year in years:
        try:
            dfs = download_cvm_dfp_year(year)
            # Combinar BPA, BPP, DRE e DFC
            dfs_to_concat = [df for df in dfs.values() if not df.empty]
            if not dfs_to_concat:
                continue

            combined = pd.concat(dfs_to_concat, ignore_index=True)
            # Ajustar escala de moeda para R$ real se vier em Milhares (MIL)
            if "ESCALA_MOEDA" in combined.columns:
                multiplier = np.where(combined["ESCALA_MOEDA"].astype(str).str.upper() == "MIL", 1000.0, 1.0)
                combined["VL_CONTA"] = combined["VL_CONTA"] * multiplier

            # Filtrar apenas as contas do nosso mapa
            combined["CD_CONTA"] = combined["CD_CONTA"].astype(str).str.strip()
            filtered = combined[combined["CD_CONTA"].isin(CVM_ACCOUNT_MAP.keys())].copy()
            filtered["account_name"] = filtered["CD_CONTA"].map(CVM_ACCOUNT_MAP)

            # Pivotar para termos 1 linha por empresa e data de referência
            pivoted = filtered.pivot_table(
                index=["CNPJ_CIA", "DENOM_CIA", "DT_REFER"],
                columns="account_name",
                values="VL_CONTA",
                aggfunc="last",
            ).reset_index()

            # Unificar lucro líquido entre bancos (3.09) e corporativo (3.11)
            lucro_corp = pivoted["lucro_liquido_corporativo"] if "lucro_liquido_corporativo" in pivoted.columns else 0.0
            lucro_banco = pivoted["lucro_liquido_bancos"] if "lucro_liquido_bancos" in pivoted.columns else 0.0
            pivoted["lucro_liquido"] = np.where(pd.notna(lucro_corp) & (lucro_corp != 0), lucro_corp, lucro_banco)

            pivoted["ano"] = year
            all_years_data.append(pivoted)
            logger.info(f"Ano {year} processado: {len(pivoted)} companhias.")
        except Exception as e:
            logger.error(f"Erro ao processar DFP do ano {year}: {e}")

    if not all_years_data:
        raise RuntimeError("Nenhum dado da CVM pôde ser processado.")

    panel = pd.concat(all_years_data, ignore_index=True)
    panel = compute_financial_ratios(panel)
    return panel


def compute_financial_ratios(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calcula ratios e indicadores clássicos de Risco de Crédito Corporativo.
    """
    res = df.copy()

    # Preencher colunas essenciais faltantes com 0
    for col in CVM_ACCOUNT_MAP.values():
        if col not in res.columns:
            res[col] = 0.0
        else:
            res[col] = res[col].fillna(0.0)

    # Dívida Bruta = Empréstimos Curto Prazo + Longo Prazo
    res["divida_bruta"] = res["emprestimos_cp"] + res["emprestimos_lp"]
    # Disponibilidades = Caixa + Aplicações
    res["disponibilidades"] = res["caixa_equivalentes"] + res["aplicacoes_financeiras"]
    # Dívida Líquida
    res["divida_liquida"] = res["divida_bruta"] - res["disponibilidades"]

    # 1. Liquidez Corrente (Ativo Circulante / Passivo Circulante)
    res["liquidez_corrente"] = np.where(
        res["passivo_circulante"] > 0,
        res["ativo_circulante"] / res["passivo_circulante"],
        np.nan,
    )

    # 2. Cobertura de Juros (EBIT / |Despesas Financeiras|)
    desp_fin_abs = res["despesas_financeiras"].abs()
    res["cobertura_juros"] = np.where(
        desp_fin_abs > 1e4,
        res["ebit_operacional"] / desp_fin_abs,
        np.where(res["ebit_operacional"] >= 0, 10.0, -10.0),  # se não tem juros significativos
    )

    # 3. Alavancagem (Dívida Líquida / EBIT)
    res["alavancagem_dl_ebit"] = np.where(
        res["ebit_operacional"].abs() > 1e4,
        res["divida_liquida"] / res["ebit_operacional"],
        np.nan,
    )

    # 4. Pressão de Curto Prazo (Empréstimos CP / Dívida Bruta)
    res["pressao_curto_prazo"] = np.where(
        res["divida_bruta"] > 0,
        res["emprestimos_cp"] / res["divida_bruta"],
        0.0,
    )

    # 5. Margem Líquida
    res["margem_liquida"] = np.where(
        res["receita_liquida"] > 0,
        res["lucro_liquido"] / res["receita_liquida"],
        np.nan,
    )

    # 6. Retorno sobre Patrimônio Líquido (ROE)
    res["roe"] = np.where(
        res["patrimonio_liquido"] > 0,
        res["lucro_liquido"] / res["patrimonio_liquido"],
        np.nan,
    )

    # 7. Passivo a Descoberto (Patrimônio Líquido < 0)
    res["passivo_a_descoberto"] = (res["patrimonio_liquido"] < 0).astype(int)

    # 8. Altman Z''-Score para Mercados Emergentes
    # Z'' = 3.25 + 6.56*(Capital de Giro/Ativo Total) + 3.26*(Lucros Acumulados aprox ROE*PL/Ativo) + 6.72*(EBIT/Ativo) + 1.05*(PL/Passivo Total)
    ativo_tot = np.where(res["ativo_total"] > 0, res["ativo_total"], 1e-6)
    passivo_tot = np.where(res["passivo_circulante"] + res["emprestimos_lp"] > 0, res["passivo_circulante"] + res["emprestimos_lp"], 1e-6)
    
    x1 = (res["ativo_circulante"] - res["passivo_circulante"]) / ativo_tot
    x2 = res["lucro_liquido"] / ativo_tot
    x3 = res["ebit_operacional"] / ativo_tot
    x4 = res["patrimonio_liquido"] / passivo_tot

    res["altman_z_score"] = 3.25 + 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4

    # 9. Target de Distress Financeiro / Risco Alto
    # Critério: PL < 0 OU (Cobertura de Juros < 0.8 E Queima de Caixa Operacional FCO < 0)
    res["target_distress"] = (
        (res["passivo_a_descoberto"] == 1) |
        ((res["cobertura_juros"] < 0.8) & (res["fco_caixa_operacional"] < 0) & (res["divida_bruta"] > 1e6)) |
        (res["altman_z_score"] < 1.1)  # Zona de distress severo do Altman
    ).astype(int)

    return res


if __name__ == "__main__":
    # Processar histórico de anos representativos para treino e backtesting OOT (2018 a 2023)
    years = [2018, 2019, 2020, 2021, 2022, 2023]
    df_panel = parse_cvm_financial_statements(years)
    output_parquet = "data/processed/cvm_corporate_panel.parquet"
    df_panel.to_parquet(output_parquet, index=False)
    logger.info(f"Painel corporativo salvo em {output_parquet} ({len(df_panel)} registros).")
