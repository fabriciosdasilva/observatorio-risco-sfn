"""
Testes de verificação de métricas estatísticas e de risco de crédito.
"""

import numpy as np
import pytest
from src.backtesting.metrics import (
    compute_regression_metrics,
    diebold_mariano_test,
    compute_credit_risk_metrics,
    block_bootstrap_confidence_interval,
)


def test_regression_metrics_basic():
    y_true = np.array([10.0, 12.0, 14.0, 16.0])
    y_pred = np.array([10.0, 11.0, 15.0, 17.0])
    y_base = np.array([9.0, 10.0, 11.0, 12.0])

    metrics = compute_regression_metrics(y_true, y_pred, y_baseline=y_base)
    assert metrics["mae"] > 0
    assert metrics["rmse"] >= metrics["mae"]
    assert 0 <= metrics["directional_accuracy_percent"] <= 100
    assert "diebold_mariano_pvalue" in metrics


def test_diebold_mariano_superior_model():
    """
    Quando o modelo tem erro significativamente menor que o baseline,
    o teste de Diebold-Mariano deve retornar estatística negativa.
    """
    np.random.seed(42)
    n = 100
    y_true = np.random.randn(n)
    y_pred_good = y_true + np.random.randn(n) * 0.1
    y_pred_bad = y_true + np.random.randn(n) * 2.0

    stat, pval = diebold_mariano_test(y_true, y_pred_good, y_pred_bad)
    assert stat < 0, "Estatística DM deveria ser negativa indicando superioridade do modelo"
    assert pval < 0.01, "Deveria ser estatisticamente significante com p < 0.01"


def test_credit_risk_metrics():
    np.random.seed(42)
    y_true = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])
    # Scores que discriminam bem
    y_prob = np.array([0.1, 0.2, 0.15, 0.25, 0.3, 0.7, 0.85, 0.9, 0.75, 0.95])

    metrics = compute_credit_risk_metrics(y_true, y_prob)
    assert metrics["roc_auc"] > 0.8
    assert metrics["gini"] > 0.6
    assert 0.0 <= metrics["ks_stat"] <= 1.0
    assert 0.0 <= metrics["brier_score"] <= 1.0


def test_block_bootstrap():
    np.random.seed(42)
    y_true = np.linspace(1, 10, 50)
    y_pred = y_true + np.random.randn(50) * 0.2

    ci = block_bootstrap_confidence_interval(y_true, y_pred, n_boot=200, block_size=4)
    assert ci["rmse_ci_95"][0] <= ci["rmse_ci_95"][1]
    assert ci["mae_ci_95"][0] <= ci["mae_ci_95"][1]
