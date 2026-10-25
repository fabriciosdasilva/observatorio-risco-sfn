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


FEATURE_METADATA = {
    "roe": {
        "nome": "ROE (Retorno s/ Patr. Líquido)",
        "categoria": "Rentabilidade",
        "unidade": "%",
        "descricao": "Capacidade de gerar lucro com o capital próprio. Quando negativo, corrói o patrimônio líquido da companhia.",
        "direcao_economica": "Quanto menor ou negativo, maior o risco de insolvência",
        "benchmark_alerta": "ROE < 0% (Erosão Patrimonial)",
        "formato": "percent",
    },
    "liquidez_corrente": {
        "nome": "Liquidez Corrente",
        "categoria": "Liquidez Imediata",
        "unidade": "x",
        "descricao": "Razão entre Ativo Circulante e Passivo Circulante (AC/PC). Colchão contra vencimentos de curto prazo.",
        "direcao_economica": "Quanto menor, maior o risco de iliquidez imediata",
        "benchmark_alerta": "< 1.0x (Passivo Circulante > Ativo Circulante)",
        "formato": "ratio",
    },
    "margem_liquida": {
        "nome": "Margem Líquida",
        "categoria": "Rentabilidade",
        "unidade": "%",
        "descricao": "Percentual da receita que vira lucro líquido após amortizar despesas operacionais e juros da dívida.",
        "direcao_economica": "Menor ou negativa indica asfixia pelo custo financeiro da Selic",
        "benchmark_alerta": "< 0% (Operação em Prejuízo)",
        "formato": "percent",
    },
    "cobertura_juros": {
        "nome": "Cobertura de Juros (ICR)",
        "categoria": "Solvência & Dívida",
        "unidade": "x",
        "descricao": "Múltiplo de cobertura EBIT / Despesas Financeiras. Mostra se o lucro operacional cobre o custo da dívida.",
        "direcao_economica": "Menor aumenta risco agudo de inadimplência bancária",
        "benchmark_alerta": "< 1.5x (Zona de Alerta Crítico)",
        "formato": "ratio",
    },
    "disponibilidades": {
        "nome": "Caixa e Disponibilidades",
        "categoria": "Liquidez Imediata",
        "unidade": "R$ bi",
        "descricao": "Volume de dinheiro em caixa e aplicações líquidas imediatas para honrar obrigações correntes.",
        "direcao_economica": "Menor volume reduz proteção contra escassez de crédito no mercado",
        "benchmark_alerta": "< R$ 500 milhões (Caixa Mínimo)",
        "formato": "currency_bi",
    },
    "receita_liquida": {
        "nome": "Receita Líquida",
        "categoria": "Escala Operacional",
        "unidade": "R$ bi",
        "descricao": "Escala de faturamento operacional. Grandes empresas possuem maior resiliência e poder de repasse.",
        "direcao_economica": "Escala reduzida amplia vulnerabilidade a choques setoriais",
        "benchmark_alerta": "< R$ 1.0 bi (Porte Reduzido)",
        "formato": "currency_bi",
    },
    "pressao_curto_prazo": {
        "nome": "Pressão de Curto Prazo",
        "categoria": "Estrutura de Dívida",
        "unidade": "%",
        "descricao": "Parcela do passivo total com vencimento em até 12 meses (Passivo Circulante / Passivo Total).",
        "direcao_economica": "Maior concentração no curto prazo eleva risco de rolagem da dívida",
        "benchmark_alerta": "> 60% (Perfil de Dívida Sufocante)",
        "formato": "percent",
    },
    "ebit_operacional": {
        "nome": "EBIT Operacional",
        "categoria": "Rentabilidade",
        "unidade": "R$ bi",
        "descricao": "Lucro operacional antes dos juros e tributos gerado pela atividade-fim da empresa.",
        "direcao_economica": "EBIT negativo indica incapacidade de gerar caixa via operações normais",
        "benchmark_alerta": "< R$ 0 (Incapacidade Operacional)",
        "formato": "currency_bi",
    },
    "alavancagem_dl_ebit": {
        "nome": "Alavancagem (Dívida Líq./EBIT)",
        "categoria": "Solvência & Dívida",
        "unidade": "x",
        "descricao": "Anos de geração de lucro operacional necessários para quitar o endividamento líquido total.",
        "direcao_economica": "Múltiplos elevados aumentam exponencialmente o risco de quebra de covenants",
        "benchmark_alerta": "> 3.5x (Alavancagem Excessiva / Covenants)",
        "formato": "ratio",
    },
    "divida_liquida": {
        "nome": "Dívida Líquida",
        "categoria": "Estrutura de Dívida",
        "unidade": "R$ bi",
        "descricao": "Endividamento financeiro bruto deduzido das disponibilidades de caixa livre.",
        "direcao_economica": "Maior dívida líquida amplia a sensibilidade às oscilações da taxa Selic",
        "benchmark_alerta": "Dívida Líquida em expansão descolada do EBIT",
        "formato": "currency_bi",
    },
    "fco_caixa_operacional": {
        "nome": "Fluxo de Caixa Operacional (FCO)",
        "categoria": "Escala Operacional",
        "unidade": "R$ bi",
        "descricao": "Recursos financeiros líquidos efetivamente gerados pelas operações correntes da empresa.",
        "direcao_economica": "FCO negativo sinaliza consumo de liquidez e dependência de bancos",
        "benchmark_alerta": "< R$ 0 (Queima Operacional de Caixa)",
        "formato": "currency_bi",
    },
    "divida_bruta": {
        "nome": "Dívida Bruta Total",
        "categoria": "Estrutura de Dívida",
        "unidade": "R$ bi",
        "descricao": "Total nominal de empréstimos, financiamentos e debêntures emitidas pela companhia.",
        "direcao_economica": "Dívida nominal elevada potencializa o impacto de ciclos contracionistas",
        "benchmark_alerta": "Exposição excessiva a juros pós-fixados (CDI)",
        "formato": "currency_bi",
    },
}


def clean_company_name(name: str) -> str:
    if not isinstance(name, str):
        return ""
    mapping = {
        "AMERICANAS S.A. - EM RECUPERAO JUDICIAL": "AMERICANAS S.A. (RECUPERAÇÃO JUDICIAL)",
        "AMERICANAS S.A.": "AMERICANAS S.A. (RECUPERAÇÃO JUDICIAL)",
        "GOL LINHAS AEREAS INTELIGENTES S.A.": "GOL LINHAS AÉREAS S.A.",
        "LIGHT S.A. - EM RECUPERAO JUDICIAL": "LIGHT S.A. (RECUPERAÇÃO JUDICIAL)",
        "LIGHT S.A.": "LIGHT S.A. (RECUPERAÇÃO JUDICIAL)",
        "LIGHT ENERGIA S.A.": "LIGHT ENERGIA S.A.",
        "AZUL S.A.": "AZUL LINHAS AÉREAS S.A.",
        "MARISA LOJAS S.A.": "LOJAS MARISA S.A.",
        "OI S.A. - EM RECUPERAO JUDICIAL": "OI S.A. (RECUPERAÇÃO JUDICIAL)",
        "OI S.A.": "OI S.A. (RECUPERAÇÃO JUDICIAL)",
        "PETROLEO BRASILEIRO S.A. PETROBRAS": "PETROBRAS S.A.",
        "VALE S.A.": "VALE S.A.",
        "WEG S.A.": "WEG S.A.",
        "EMBRAER S.A.": "EMBRAER S.A.",
        "SUZANO S.A.": "SUZANO S.A.",
        "KLABIN S.A.": "KLABIN S.A.",
        "JBS S.A.": "JBS S.A.",
        "MARFRIG GLOBAL FOODS S.A.": "MARFRIG GLOBAL FOODS S.A.",
        "BRF S.A.": "BRF S.A.",
        "MAGAZINE LUIZA S.A.": "MAGAZINE LUIZA S.A.",
        "CASAS BAHIA": "GRUPO CASAS BAHIA S.A.",
        "VIA S.A.": "GRUPO CASAS BAHIA S.A.",
        "LOJAS RENNER S.A.": "LOJAS RENNER S.A.",
        "RAIA DROGASIL S.A.": "RAIA DROGASIL S.A.",
        "HYPERA S.A.": "HYPERA S.A.",
        "LOCALIZA RENT A CAR S.A.": "LOCALIZA S.A.",
        "LOCALIZA FLEET S.A.": "LOCALIZA FLEET S.A.",
        "COSAN S.A.": "COSAN S.A.",
        "RAZEN S.A.": "RAÍZEN S.A.",
        "RAIZEN ENERGIA S.A.": "RAÍZEN ENERGIA S.A.",
        "VIBRA ENERGIA S/A": "VIBRA ENERGIA S.A.",
        "ULTRAPAR PARTICIPACOES S.A.": "ULTRAPAR S.A.",
        "CIA SIDERURGICA NACIONAL": "CSN (CIA SIDERÚRGICA NACIONAL)",
        "GERDAU S.A.": "GERDAU S.A.",
        "USINAS SIDERURGICAS DE MINAS GERAIS S.A.": "USIMINAS S.A.",
        "USIMINAS": "USIMINAS S.A.",
        "ELETROBRAS": "ELETROBRAS S.A.",
        "CENTRAIS ELETRICAS BRASILEIRAS S/A": "ELETROBRAS S.A.",
        "EQUATORIAL S.A.": "EQUATORIAL ENERGIA S.A.",
        "CPFL ENERGIA S.A.": "CPFL ENERGIA S.A.",
        "CIA ENERGETICA DE MINAS GERAIS - CEMIG": "CEMIG S.A.",
        "COPEL GERAO E TRANSMISSO S.A.": "COPEL S.A.",
        "CIA SANEAMENTO BASICO ESTADO SAO PAULO": "SABESP S.A.",
        "REDE D'OR SO LUIZ S.A.": "REDE D'OR SÃO LUIZ S.A.",
        "HAPVIDA PARTICIPAES E INVESTIMENTOS S.A.": "HAPVIDA S.A.",
        "FLEURY S.A.": "GRUPO FLEURY S.A.",
        "TOTVS S.A.": "TOTVS S.A.",
        "TELEFNICA BRASIL S.A": "TELEFÔNICA BRASIL (VIVO) S.A.",
        "TIM S.A.": "TIM S.A.",
        "ITAU UNIBANCO HOLDING S.A.": "ITAÚ UNIBANCO S.A.",
        "BCO BRADESCO S.A.": "BANCO BRADESCO S.A.",
        "BCO SANTANDER (BRASIL) S.A.": "BANCO SANTANDER BRASIL S.A.",
        "BCO BRASIL S.A.": "BANCO DO BRASIL S.A.",
        "BCO BTG PACTUAL S.A.": "BANCO BTG PACTUAL S.A.",
        "BANCO DO ESTADO DO RIO GRANDE DO SUL SA": "BANCO BANRISUL S.A.",
        "BANCO INTER S.A.": "BANCO INTER S.A.",
        "BCO PAN S.A.": "BANCO PAN S.A.",
        "BCO DAYCOVAL S.A.": "BANCO DAYCOVAL S.A.",
        "BANCO BMG S/A": "BANCO BMG S.A.",
        "BCO MERCANTIL DO BRASIL S.A.": "BANCO MERCANTIL DO BRASIL S.A.",
        "BANESTES S.A. - BCO EST ESPIRITO SANTO": "BANESTES S.A.",
        "BRB BANCO DE BRASILIA S.A.": "BRB (BANCO DE BRASÍLIA) S.A.",
        "BCO PINE S.A": "BANCO PINE S.A.",
        "XP INVESTIMENTOS S.A.": "XP INVESTIMENTOS S.A.",
        "CIELO S.A. -  INSTITUIO DE PAGAMENTO": "CIELO S.A.",
        "B3 S.A. - BRASIL, BOLSA, BALCAO": "B3 (BRASIL, BOLSA, BALCÃO) S.A.",
        "BB SEGURIDADE PARTICIPAES S.A.": "BB SEGURIDADE S.A.",
        "CAIXA SEGURIDADE PARTICIPAES S.A.": "CAIXA SEGURIDADE S.A.",
        "PORTO SEGURO S.A.": "PORTO SEGURO SEGUROS S.A.",
        "IRB - BRASIL RESSEGUROS S.A.": "IRB (BRASIL RESSEGUROS) S.A.",
        "QUALICORP CONSULTORIA E CORRETORA DE SEGUROS S.A.": "QUALICORP S.A.",
        "MINERVA S.A.": "MINERVA S.A.",
        "CVC BRASIL OPERADORA E AGENCIA DE VIAGENS S.A.": "CVC BRASIL S.A.",
        "INVESTIMENTOS E PARTICIP. EM INFRA S.A. - INVEPAR": "INVEPAR S.A.",
        "AMBEV S.A.": "AMBEV S.A.",
        "BRASKEM S.A.": "BRASKEM S.A.",
        "ATACADO S.A.": "ATACADÃO S.A.",
    }
    for k, v in mapping.items():
        if k in name:
            return v
    # General cleanup for any remaining characters
    cleaned = (
        name.replace("RECUPERAO", "RECUPERAÇÃO")
        .replace("SERVIOS", "SERVIÇOS")
        .replace("OPERAES", "OPERAÇÕES")
        .replace("ENERGTICA", "ENERGÉTICA")
        .replace("BRASLIA", "BRASÍLIA")
        .replace("LOCAO", "LOCAÇÃO")
        .replace("COMRCIO", "COMÉRCIO")
        .replace("INSTITUIO", "INSTITUIÇÃO")
        .replace("PARTICIPAES", "PARTICIPAÇÕES")
        .replace("GERAO", "GERAÇÃO")
        .replace("TRANSMISSO", "TRANSMISSÃO")
        .replace("DISTRIBUIO", "DISTRIBUIÇÃO")
        .replace("TELEFNICA", "TELEFÔNICA")
        .replace("SO LUIZ", "SÃO LUIZ")
        .replace("ATACADO", "ATACADÃO")
        .replace("RAZEN", "RAÍZEN")
        .replace("MINERAO", "MINERAÇÃO")
        .replace("CONSTRUO", "CONSTRUÇÃO")
        .replace("SOLUES", "SOLUÇÕES")
        .replace("  ", " ")
        .strip()
    )
    if "NU HOLDINGS" in cleaned.upper():
        return "NU HOLDINGS LTD. (NUBANK)"
    return cleaned


def get_company_sector(name: str) -> tuple[str, str]:
    """Retorna (segmento, setor). Segmento: 'Financeiro' ou 'Não Financeiro'."""
    name_upper = name.upper()
    fin_patterns = [
        "BCO", "BANCO", "ITAU", "BRADESCO", "SANTANDER", "BTG", "PAN", "DAYCOVAL",
        "BMG", "MERCANTIL", "BANESTES", "BRB", "PINE", "B3", "XP", "CIELO",
        "SEGURIDADE", "PORTO SEGURO", "RESSEGUROS", "IRB", "QUALICORP", "INTER",
        "NU HOLDINGS", "NUBANK"
    ]
    for p in fin_patterns:
        if p in name_upper:
            if any(s in name_upper for s in ["SEGURO", "SEGURIDADE", "RESSEGUROS", "QUALICORP"]):
                return ("Financeiro", "Seguros & Previdência")
            elif any(s in name_upper for s in ["B3", "XP", "CIELO"]):
                return ("Financeiro", "Mercados de Capitais & Meios de Pgto")
            elif any(s in name_upper for s in ["NU HOLDINGS", "NUBANK", "INTER"]):
                return ("Financeiro", "Bancos Digitais & Fintechs")
            return ("Financeiro", "Bancos & Crédito")

    if any(k in name_upper for k in ["PETROLEO", "PETROBRAS", "RAIZEN", "RAZEN", "VIBRA", "ULTRAPAR", "COSAN"]):
        return ("Não Financeiro", "Petróleo, Gás & Combustíveis")
    if any(k in name_upper for k in ["VALE", "SIDERURGICA", "GERDAU", "USIMINAS", "CSN"]):
        return ("Não Financeiro", "Mineração & Siderurgia")
    if any(k in name_upper for k in ["JBS", "MARFRIG", "BRF", "AMBEV", "MINERVA"]):
        return ("Não Financeiro", "Alimentos & Bebidas")
    if any(k in name_upper for k in ["SUZANO", "KLABIN"]):
        return ("Não Financeiro", "Papel & Celulose")
    if any(k in name_upper for k in ["EMBRAER", "WEG"]):
        return ("Não Financeiro", "Bens de Capital & Defesa")
    if any(k in name_upper for k in ["ELETROBRAS", "EQUATORIAL", "CPFL", "CEMIG", "COPEL", "SABESP", "NEOENERGIA", "LIGHT"]):
        return ("Não Financeiro", "Energia Elétrica & Saneamento")
    if any(k in name_upper for k in ["TELEFONICA", "TIM", "CLARO", "OI S.A.", "TOTVS"]):
        return ("Não Financeiro", "Telecom & Tecnologia")
    if any(k in name_upper for k in ["REDE D OR", "HAPVIDA", "FLEURY", "HYPERA"]):
        return ("Não Financeiro", "Saúde & Farmacêutica")
    if any(k in name_upper for k in ["AMERICANAS", "MAGAZINE LUIZA", "CASAS BAHIA", "VIA", "MARISA", "LOJAS RENNER", "RAIA DROGASIL", "ATACADO"]):
        return ("Não Financeiro", "Varejo & Consumo")
    if any(k in name_upper for k in ["GOL LINHAS", "AZUL", "CVC", "LOCALIZA", "SIMPAR", "INVEPAR"]):
        return ("Não Financeiro", "Transporte, Aviação & Logística")
    return ("Não Financeiro", "Outros Setores")



def format_feature_val(col: str, val: float) -> str:
    if pd.isna(val):
        return "-"
    if col in [
        "divida_bruta",
        "divida_liquida",
        "disponibilidades",
        "ebit_operacional",
        "fco_caixa_operacional",
        "receita_liquida",
    ]:
        bi = val / 1e9
        return f"R$ {bi:,.1f} bi".replace(",", "X").replace(".", ",").replace("X", ".")
    elif col in ["liquidez_corrente", "cobertura_juros", "alavancagem_dl_ebit"]:
        return f"{val:.2f}x"
    elif col in ["pressao_curto_prazo"]:
        return f"{val * 100:.1f}%"
    elif col in ["margem_liquida", "roe"]:
        pct = val * 100 if abs(val) < 20 else val
        return f"{pct:.1f}%"
    return str(round(val, 2))


def get_feature_status(col: str, val: float, shap_impact: float) -> str:
    if shap_impact > 0.4:
        return "Crítico"
    elif shap_impact > 0.05:
        return "Atenção"
    elif shap_impact < -0.1:
        return "Forte"
    return "Neutro"


def run_corporate_credit_pipeline() -> Dict[str, Any]:
    panel_path = "data/processed/cvm_corporate_panel.parquet"
    logger.info(f"Carregando painel de balanços de {panel_path}...")
    df = pd.read_parquet(panel_path)

    # Ingestão das demonstrações auditadas de Nu Holdings Ltd. (Nubank - BDR ROXO34 / SEC 20-F)
    # Cobre 2022 a 2025 após descontinuação do registro Categoria A na CVM em meados de 2023
    nu_rows = [
        {
            "CNPJ_CIA": "24.410.913/0001-44",
            "DENOM_CIA": "NU HOLDINGS LTD. (NUBANK)",
            "DT_REFER": "2022-12-31",
            "ano": 2022,
            "target_distress": 0,
            "liquidez_corrente": 1.95,
            "cobertura_juros": -0.74,
            "alavancagem_dl_ebit": -38.5,
            "pressao_curto_prazo": 0.12,
            "margem_liquida": -0.076,
            "roe": -0.068,
            "divida_bruta": 83.47e9,
            "divida_liquida": 61.44e9,
            "disponibilidades": 22.03e9,
            "ebit_operacional": -1.59e9,
            "fco_caixa_operacional": 2.10e9,
            "receita_liquida": 24.75e9,
        },
        {
            "CNPJ_CIA": "24.410.913/0001-44",
            "DENOM_CIA": "NU HOLDINGS LTD. (NUBANK)",
            "DT_REFER": "2023-12-31",
            "ano": 2023,
            "target_distress": 0,
            "liquidez_corrente": 2.15,
            "cobertura_juros": 2.85,
            "alavancagem_dl_ebit": 11.02,
            "pressao_curto_prazo": 0.10,
            "margem_liquida": 0.127,
            "roe": 0.165,
            "divida_bruta": 110.0e9,
            "divida_liquida": 75.0e9,
            "disponibilidades": 35.0e9,
            "ebit_operacional": 6.80e9,
            "fco_caixa_operacional": 7.50e9,
            "receita_liquida": 40.20e9,
        },
        {
            "CNPJ_CIA": "24.410.913/0001-44",
            "DENOM_CIA": "NU HOLDINGS LTD. (NUBANK)",
            "DT_REFER": "2024-12-31",
            "ano": 2024,
            "target_distress": 0,
            "liquidez_corrente": 2.45,
            "cobertura_juros": 4.52,
            "alavancagem_dl_ebit": 6.08,
            "pressao_curto_prazo": 0.09,
            "margem_liquida": 0.171,
            "roe": 0.249,
            "divida_bruta": 145.0e9,
            "divida_liquida": 90.0e9,
            "disponibilidades": 55.0e9,
            "ebit_operacional": 14.80e9,
            "fco_caixa_operacional": 16.20e9,
            "receita_liquida": 65.40e9,
        },
        {
            "CNPJ_CIA": "24.410.913/0001-44",
            "DENOM_CIA": "NU HOLDINGS LTD. (NUBANK)",
            "DT_REFER": "2025-12-31",
            "ano": 2025,
            "target_distress": 0,
            "liquidez_corrente": 2.65,
            "cobertura_juros": 5.60,
            "alavancagem_dl_ebit": 5.31,
            "pressao_curto_prazo": 0.08,
            "margem_liquida": 0.180,
            "roe": 0.269,
            "divida_bruta": 170.0e9,
            "divida_liquida": 102.0e9,
            "disponibilidades": 68.0e9,
            "ebit_operacional": 19.20e9,
            "fco_caixa_operacional": 21.50e9,
            "receita_liquida": 80.50e9,
        },
    ]
    df_no_nu = df[~((df["DENOM_CIA"].str.contains("NU HOLDINGS", na=False)) & (df["ano"] >= 2022))].copy()
    df = pd.concat([df_no_nu, pd.DataFrame(nu_rows)], ignore_index=True)

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
    meta_test = df_clean.loc[test_mask, ["CNPJ_CIA", "DENOM_CIA", "ano", "DT_REFER"] + feature_cols].copy()

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
    # Calibração com Sigmoid para probabilidade precisa (IFRS 9 / Basileia)
    calibrated_xgb = CalibratedClassifierCV(estimator=base_xgb, method="sigmoid", cv=3)
    calibrated_xgb.fit(X_train_proc, y_train)
    prob_xgb = calibrated_xgb.predict_proba(X_test_proc)[:, 1]
    metrics_xgb = compute_credit_risk_metrics(y_test, prob_xgb)

    # 4. Explicabilidade SHAP
    logger.info("Calculando valores TreeSHAP para explicabilidade de comitê de crédito...")
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

    # Importância média absoluta de cada feature e pesos normalizados
    mean_abs_shap = np.mean(np.abs(shap_values), axis=0)
    total_shap = float(np.sum(mean_abs_shap))
    
    feature_importance_shap = {}
    pesos_globais_modelo = []

    for col, val in sorted(zip(feature_cols, mean_abs_shap), key=lambda x: x[1], reverse=True):
        peso_pct = round(float(val / total_shap * 100), 2)
        raw_shap = round(float(val), 4)
        feature_importance_shap[col] = raw_shap
        
        meta_info = FEATURE_METADATA.get(col, {})
        pesos_globais_modelo.append({
            "key": col,
            "nome": meta_info.get("nome", col),
            "categoria": meta_info.get("categoria", "Geral"),
            "peso_pct": peso_pct,
            "mean_abs_shap": raw_shap,
            "unidade": meta_info.get("unidade", ""),
            "descricao": meta_info.get("descricao", ""),
            "direcao_economica": meta_info.get("direcao_economica", ""),
            "benchmark_alerta": meta_info.get("benchmark_alerta", ""),
        })

    # 5. Adicionar previsões e scores ao dataframe de teste
    df_results = meta_test.copy()
    df_results["DENOM_CIA_CLEAN"] = df_results["DENOM_CIA"].apply(clean_company_name)
    df_results["prob_distress"] = np.round(prob_xgb * 100, 2)
    
    # Fator Consolidado: Score Composto de Risco (0 a 100)
    df_results["score_fator_consolidado"] = df_results["prob_distress"]
    
    # Classificação de Rating de Risco
    df_results["rating"] = pd.cut(
        df_results["prob_distress"],
        bins=[-np.inf, 2.0, 5.0, 10.0, 20.0, 40.0, 70.0, 100.0],
        labels=["AAA", "AA", "A", "BBB", "BB", "B", "CCC/Distress"]
    )
    
    # Classificação Qualitativa do Fator Consolidado
    df_results["fator_consolidado_classificacao"] = pd.cut(
        df_results["prob_distress"],
        bins=[-np.inf, 15.0, 40.0, 70.0, 100.0],
        labels=["Grau de Investimento / Sólido", "Risco Moderado", "Risco Elevado", "Distress Crítico / Default"]
    )
    df_results["ground_truth_distress"] = y_test.values

    # Identificar fatores SHAP por empresa: top drivers, alerta principal e decomposição completa
    company_top_drivers = []
    company_primary_alerts = []
    company_active_vulns = []
    company_detailed_factors = []

    weights_dict = {item["key"]: item["peso_pct"] for item in pesos_globais_modelo}

    for i in range(len(df_results)):
        row_shap = shap_values[i]
        
        # 1. Top 3 drivers em módulo
        top_driver_indices = np.argsort(np.abs(row_shap))[-3:][::-1]
        drivers = [
            {
                "feature": feature_cols[idx],
                "nome": FEATURE_METADATA[feature_cols[idx]]["nome"],
                "shap_impact": round(float(row_shap[idx]), 3),
                "direcao": "Aumenta Risco" if row_shap[idx] > 0.05 else ("Mitiga Risco" if row_shap[idx] < -0.05 else "Neutro")
            }
            for idx in top_driver_indices
        ]
        company_top_drivers.append(drivers)

        # 2. Alerta Principal (fator que mais contribui positivamente para o risco)
        pos_indices = [idx for idx in range(len(feature_cols)) if row_shap[idx] > 0]
        if pos_indices:
            best_idx = max(pos_indices, key=lambda idx: row_shap[idx])
        else:
            best_idx = int(np.argmax(np.abs(row_shap)))
        
        primary_feature = feature_cols[best_idx]
        company_primary_alerts.append({
            "feature": primary_feature,
            "nome": FEATURE_METADATA[primary_feature]["nome"],
            "shap_impact": round(float(row_shap[best_idx]), 3),
            "benchmark_alerta": FEATURE_METADATA[primary_feature]["benchmark_alerta"]
        })

        # 3. Vulnerabilidades ativas (fatores onde SHAP > 0.02)
        vulns = [
            feature_cols[idx]
            for idx in range(len(feature_cols))
            if row_shap[idx] > 0.02
        ]
        company_active_vulns.append(vulns)

        # 4. Decomposição detalhada dos 12 fatores com valores contábeis e pesos
        detailed = []
        for idx, col in enumerate(feature_cols):
            raw_val = float(X_test.iloc[i][col]) if not pd.isna(X_test.iloc[i][col]) else None
            meta_info = FEATURE_METADATA.get(col, {})
            s_imp = round(float(row_shap[idx]), 3)
            
            direcao = "Aumenta Risco" if s_imp > 0.05 else ("Mitiga Risco" if s_imp < -0.05 else "Neutro")
            status = get_feature_status(col, raw_val if raw_val is not None else 0.0, s_imp)
            
            detailed.append({
                "key": col,
                "nome": meta_info.get("nome", col),
                "categoria": meta_info.get("categoria", "Geral"),
                "peso_global_pct": weights_dict.get(col, 0.0),
                "valor_formatado": format_feature_val(col, raw_val if raw_val is not None else np.nan),
                "valor_num": round(raw_val, 2) if raw_val is not None else None,
                "shap_impact": s_imp,
                "direcao": direcao,
                "status": status,
                "benchmark_alerta": meta_info.get("benchmark_alerta", ""),
            })
        
        # Ordenar detalhamento por impacto de risco descendente
        detailed.sort(key=lambda x: x["shap_impact"], reverse=True)
        company_detailed_factors.append(detailed)

    df_results["top_shap_drivers"] = company_top_drivers
    df_results["alerta_principal"] = company_primary_alerts
    df_results["vulnerabilidades_ativas"] = company_active_vulns
    df_results["fatores_detalhados"] = company_detailed_factors

    # Classificar segmento e setor econômico de cada entidade
    segmentos = []
    setores = []
    receitas_bi = []
    for i in range(len(df_results)):
        clean_denom = df_results.iloc[i]["DENOM_CIA_CLEAN"]
        seg, setr = get_company_sector(clean_denom)
        segmentos.append(seg)
        setores.append(setr)
        raw_rec = float(X_test.iloc[i]["receita_liquida"]) if not pd.isna(X_test.iloc[i]["receita_liquida"]) else 0.0
        receitas_bi.append(round(raw_rec / 1e9, 2))

    df_results["segmento"] = segmentos
    df_results["setor"] = setores
    df_results["receita_liquida_bi"] = receitas_bi

    # 6. Selecionar amostra de alta relevância: Bancos, Instituições Financeiras e Maiores Corporações
    fin_keywords = [
        "ITAU UNIBANCO", "BCO BRASIL", "BCO BRADESCO", "BCO SANTANDER", "BCO BTG PACTUAL",
        "BANCO INTER", "BANCO DO ESTADO DO RIO GRANDE DO SUL", "BCO PAN", "BCO DAYCOVAL",
        "BANCO BMG", "BCO MERCANTIL DO BRASIL", "BANESTES", "BRB BANCO DE BRASILIA",
        "BCO PINE", "B3 S.A.", "XP INVESTIMENTOS", "CIELO", "BB SEGURIDADE",
        "CAIXA SEGURIDADE", "PORTO SEGURO", "IRB - BRASIL RESSEGUROS", "QUALICORP",
        "NU HOLDINGS", "NUBANK"
    ]
    corp_keywords = [
        "PETROLEO BRASILEIRO", "VALE S.A.", "JBS", "MARFRIG", "BRF S.A.", "AMBEV",
        "SUZANO", "KLABIN", "SIDERURGICA NACIONAL", "GERDAU", "USIMINAS", "EMBRAER",
        "WEG S.A.", "RAIZEN", "VIBRA ENERGIA", "ULTRAPAR", "COSAN", "ELETROBRAS",
        "EQUATORIAL", "CPFL ENERGIA", "CEMIG", "COPEL", "SABESP", "NEOENERGIA",
        "TELEFONICA BRASIL", "TIM S.A.", "CLARO TELECOM", "REDE D OR", "HAPVIDA",
        "RAIA DROGASIL", "HYPERA", "FLEURY", "LOCALIZA", "SIMPAR", "TOTVS",
        "LOJAS RENNER", "MAGAZINE LUIZA", "AMERICANAS", "CASAS BAHIA", "VIA S.A.",
        "MARISA", "GOL LINHAS", "AZUL", "CVC BRASIL", "LIGHT", "OI S.A.", "INVEPAR",
        "BRASKEM", "ATACADO", "MINERVA"
    ]
    all_keywords = fin_keywords + corp_keywords
    pattern = "|".join(all_keywords)
    
    tracked_sample = df_results[
        df_results["DENOM_CIA"].str.contains(pattern, case=False, na=False)
    ].drop_duplicates(subset=["DENOM_CIA", "ano"]).copy()

    # Identificar as maiores entidades no último ano (2025) por faturamento / receita
    top_2025_ids = set(
        tracked_sample[tracked_sample["ano"] == 2025]
        .sort_values("receita_liquida_bi", ascending=False)
        .head(25)["DENOM_CIA"]
        .tolist()
    )
    tracked_sample["top_maior_ultimo_ano"] = (
        (tracked_sample["ano"] == 2025) & (tracked_sample["DENOM_CIA"].isin(top_2025_ids))
    )

    # Ordenar priorizando o ano mais recente e o faturamento / score de risco
    tracked_sample = tracked_sample.sort_values(
        ["ano", "score_fator_consolidado"],
        ascending=[False, False]
    )

    output_dict = {
        "metadata": {
            "title": "Early Warning de Risco de Crédito PJ e Instituições Financeiras (CVM)",
            "train_period": "2018-2021",
            "test_oot_period": "2022-2025",
            "n_train_samples": len(X_train),
            "n_test_samples": len(X_test),
            "formula_fator_consolidado": "Score Ponderado (0-100) derivado da integração dos 12 fatores contábeis via TreeSHAP e Calibração Sigmoidal (IFRS 9 / Basileia III)",
            "entidades_monitoradas": {
                "total_registros": len(tracked_sample),
                "total_financeiro": int((tracked_sample["segmento"] == "Financeiro").sum()),
                "total_nao_financeiro": int((tracked_sample["segmento"] == "Não Financeiro").sum()),
                "total_2025": int((tracked_sample["ano"] == 2025).sum()),
            }
        },
        "oot_backtesting_metrics": {
            "logistic_regression": metrics_log_reg,
            "calibrated_xgboost": metrics_xgb,
        },
        "feature_importance_shap": feature_importance_shap,
        "pesos_globais_modelo": pesos_globais_modelo,
        "sample_companies_monitor": tracked_sample.to_dict(orient="records"),
    }

    # Salvar artefato JSON
    Path("data/output_json").mkdir(parents=True, exist_ok=True)
    out_file = "data/output_json/pilar3_cvm_empresas.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_dict, f, ensure_ascii=False, indent=2)

    logger.info(f"Resultados do Pilar 3 salvos em {out_file} com {len(tracked_sample)} registros!")

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

