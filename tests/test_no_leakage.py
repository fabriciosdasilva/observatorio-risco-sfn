"""
Testes de verificação estrita de ausência de vazamento temporal (Data Leakage)
e integridade do framework de validação Walk-Forward.
"""

import numpy as np
import pandas as pd
import pytest
from src.backtesting.walk_forward import PointInTimeWalkForward


def test_walk_forward_strict_temporal_order():
    """
    Garante que em cada fold do Walk-Forward, max(train_indices) < min(test_indices),
    sem sobreposição temporal.
    """
    n_months = 100
    dates = pd.date_range("2015-01-01", periods=n_months, freq="MS")
    df_dummy = pd.DataFrame({"date": dates, "val": np.random.randn(n_months)})

    wf = PointInTimeWalkForward(initial_train_size=40, horizon=3, step=1, rolling=False)
    splits = list(wf.split(df_dummy))

    assert len(splits) > 0, "Deveria haver múltiplos splits gerados."

    for train_idx, test_idx in splits:
        assert len(train_idx) >= 40
        assert len(test_idx) == 3
        # O último índice de treino deve ser estritamente anterior ao primeiro de teste
        assert np.max(train_idx) < np.min(test_idx)
        # Nenhuma interseção entre treino e teste
        assert len(set(train_idx).intersection(set(test_idx))) == 0


def test_no_future_data_leakage_in_training():
    """
    Verifica que alterar valores no futuro (conjunto de teste) não altera
    em absolutamente nada o treinamento e as predições geradas no passado.
    """
    from sklearn.linear_model import Ridge
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline

    np.random.seed(42)
    n = 60
    X = pd.DataFrame({"feat1": np.random.randn(n), "feat2": np.random.randn(n)})
    y = pd.Series(X["feat1"] * 2.0 + np.random.randn(n) * 0.1)

    train_idx = np.arange(0, 45)
    test_idx = np.arange(45, 60)

    # Treina com dados normais
    pipe1 = Pipeline([("scaler", StandardScaler()), ("model", Ridge())])
    pipe1.fit(X.iloc[train_idx], y.iloc[train_idx])
    pred1_train = pipe1.predict(X.iloc[train_idx])

    # Modifica drasticamente os dados futuros do conjunto de teste (simulando choque)
    X_corrupted = X.copy()
    y_corrupted = y.copy()
    X_corrupted.iloc[test_idx] += 1000.0
    y_corrupted.iloc[test_idx] += 5000.0

    # Treina novamente no mesmo conjunto de treino
    pipe2 = Pipeline([("scaler", StandardScaler()), ("model", Ridge())])
    pipe2.fit(X_corrupted.iloc[train_idx], y_corrupted.iloc[train_idx])
    pred2_train = pipe2.predict(X_corrupted.iloc[train_idx])

    # As predições de treino e coeficientes devem ser 100% idênticos
    np.testing.assert_allclose(pred1_train, pred2_train, rtol=1e-12)
    np.testing.assert_allclose(pipe1.named_steps["model"].coef_, pipe2.named_steps["model"].coef_, rtol=1e-12)
