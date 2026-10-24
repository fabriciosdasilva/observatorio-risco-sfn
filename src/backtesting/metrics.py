"""
Módulo de métricas de avaliação quantitativa e testes estatísticos de modelos.
Inclui teste de Diebold-Mariano para comparação contra Naive Baseline,
Block Bootstrap para intervalos de confiança e métricas de risco de crédito (KS, Gini, Brier).
"""

from typing import Dict, Any, List, Optional, Tuple
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    roc_auc_score,
    brier_score_loss,
    precision_recall_curve,
    auc,
)


def compute_regression_metrics(
    y_true: np.ndarray, y_pred: np.ndarray, y_baseline: Optional[np.ndarray] = None
) -> Dict[str, Any]:
    """
    Calcula MAE, RMSE, MAPE e Acurácia Direcional (MDA).
    """
    y_t = np.asarray(y_true).ravel()
    y_p = np.asarray(y_pred).ravel()

    mae = float(mean_absolute_error(y_t, y_p))
    rmse = float(np.sqrt(mean_squared_error(y_t, y_p)))
    # MAPE com proteção contra divisão por zero
    denom = np.where(np.abs(y_t) < 1e-5, 1e-5, np.abs(y_t))
    mape = float(np.mean(np.abs((y_t - y_p) / denom)) * 100)

    # Mean Directional Accuracy (MDA)
    if len(y_t) > 1:
        dir_true = np.sign(np.diff(y_t))
        dir_pred = np.sign(np.diff(y_p))
        mda = float(np.mean(dir_true == dir_pred) * 100)
    else:
        mda = 100.0

    res = {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "mape_percent": round(mape, 2),
        "directional_accuracy_percent": round(mda, 2),
    }

    if y_baseline is not None:
        y_b = np.asarray(y_baseline).ravel()
        dm_stat, dm_pvalue = diebold_mariano_test(y_t, y_p, y_b)
        res["diebold_mariano_stat"] = round(dm_stat, 4)
        res["diebold_mariano_pvalue"] = round(dm_pvalue, 5)
        res["beats_baseline_statistically"] = bool(dm_pvalue < 0.05 and dm_stat < 0)

    return res


def diebold_mariano_test(
    y_true: np.ndarray, y_pred_model: np.ndarray, y_pred_baseline: np.ndarray, power: int = 2
) -> Tuple[float, float]:
    """
    Teste de Diebold-Mariano (1995) com correção de Harvey, Leybourne e Newbold (1997).
    Compara a perda do modelo contra a perda do baseline.
    Se estatística DM < 0 e p-valor < 0.05, o modelo é estatisticamente superior ao baseline.
    """
    e_model = np.abs(y_true - y_pred_model) ** power
    e_base = np.abs(y_true - y_pred_baseline) ** power
    d = e_model - e_base

    T = len(d)
    if T < 4:
        return 0.0, 1.0

    mean_d = np.mean(d)
    # Autocovariância no lag 0
    gamma_0 = np.var(d, ddof=0)
    if gamma_0 <= 1e-12:
        return 0.0, 1.0

    # Estimador de variância assintótica simples (h=1)
    dm_stat = mean_d / np.sqrt(gamma_0 / T)
    # Correção de pequenos amostras de Harvey et al.
    hln_stat = dm_stat * np.sqrt((T + 1 - 2 + 1 / T) / T)
    # p-valor bilateral com distribuição t de Student (graus de liberdade = T - 1)
    p_value = 2.0 * (1.0 - stats.t.cdf(np.abs(hln_stat), df=T - 1))

    return float(hln_stat), float(p_value)


def block_bootstrap_confidence_interval(
    y_true: np.ndarray, y_pred: np.ndarray, n_boot: int = 1000, block_size: int = 4
) -> Dict[str, List[float]]:
    """
    Calcula intervalos de confiança de 95% para RMSE e MAE via Block Bootstrap (preservando autocorrelação).
    """
    T = len(y_true)
    if T < block_size * 2:
        rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
        mae = float(mean_absolute_error(y_true, y_pred))
        return {"rmse_ci_95": [round(rmse, 4), round(rmse, 4)], "mae_ci_95": [round(mae, 4), round(mae, 4)]}

    boot_rmse = []
    boot_mae = []
    n_blocks = int(np.ceil(T / block_size))

    np.random.seed(42)
    for _ in range(n_boot):
        start_indices = np.random.randint(0, T - block_size + 1, size=n_blocks)
        indices = np.concatenate([np.arange(idx, idx + block_size) for idx in start_indices])[:T]
        sample_true = y_true[indices]
        sample_pred = y_pred[indices]

        boot_rmse.append(np.sqrt(mean_squared_error(sample_true, sample_pred)))
        boot_mae.append(mean_absolute_error(sample_true, sample_pred))

    return {
        "rmse_ci_95": [round(float(np.percentile(boot_rmse, 2.5)), 4), round(float(np.percentile(boot_rmse, 97.5)), 4)],
        "mae_ci_95": [round(float(np.percentile(boot_mae, 2.5)), 4), round(float(np.percentile(boot_mae, 97.5)), 4)],
    }


def compute_credit_risk_metrics(y_true: np.ndarray, y_prob: np.ndarray) -> Dict[str, Any]:
    """
    Calcula métricas regulatórias de Risco de Crédito:
    - ROC-AUC
    - Coeficiente de Gini = 2 * AUC - 1
    - Estatística Kolmogorov-Smirnov (KS)
    - Brier Score (calibração)
    - PR-AUC (Precision-Recall AUC para dados desbalanceados)
    """
    y_t = np.asarray(y_true).astype(int)
    y_p = np.asarray(y_prob).astype(float)

    auc_score = float(roc_auc_score(y_t, y_p))
    gini_score = 2.0 * auc_score - 1.0

    # Kolmogorov-Smirnov (KS)
    positives = y_p[y_t == 1]
    negatives = y_p[y_t == 0]
    if len(positives) > 0 and len(negatives) > 0:
        ks_stat, ks_pval = stats.ks_2samp(positives, negatives)
    else:
        ks_stat, ks_pval = 0.0, 1.0

    # Brier Score
    brier = float(brier_score_loss(y_t, y_p))

    # PR-AUC
    precision, recall, _ = precision_recall_curve(y_t, y_p)
    pr_auc = float(auc(recall, precision))

    return {
        "roc_auc": round(auc_score, 4),
        "gini": round(gini_score, 4),
        "ks_stat": round(float(ks_stat), 4),
        "ks_pvalue": round(float(ks_pval), 5),
        "brier_score": round(brier, 4),
        "pr_auc": round(pr_auc, 4),
    }
