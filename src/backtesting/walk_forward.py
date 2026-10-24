"""
Módulo de divisão temporal para Backtesting em séries temporais financeiras.
Garante divisão Point-in-Time estrita, sem Look-Ahead Bias e sem vazamento de dados.
"""

from typing import Iterator, Tuple
import numpy as np
import pandas as pd


class PointInTimeWalkForward:
    """
    Gerador de folds para validação Walk-Forward (janela expansiva ou rolante).
    """

    def __init__(
        self,
        initial_train_size: int = 48,  # ex: 48 meses (4 anos) de histórico inicial
        horizon: int = 3,              # projeta 3 meses à frente (nowcasting trimestral)
        step: int = 1,                 # avança 1 mês por passo
        rolling: bool = False,         # True = descarta meses antigos mantendo janela fixa; False = janela expansiva
    ):
        self.initial_train_size = initial_train_size
        self.horizon = horizon
        self.step = step
        self.rolling = rolling

    def split(self, df: pd.DataFrame) -> Iterator[Tuple[np.ndarray, np.ndarray]]:
        n_samples = len(df)
        if n_samples < self.initial_train_size + self.horizon:
            raise ValueError(
                f"Tamanho do DataFrame ({n_samples}) insuficiente para treino inicial "
                f"({self.initial_train_size}) + horizonte ({self.horizon})."
            )

        for train_end in range(self.initial_train_size, n_samples - self.horizon + 1, self.step):
            if self.rolling:
                train_start = train_end - self.initial_train_size
            else:
                train_start = 0

            train_indices = np.arange(train_start, train_end)
            test_indices = np.arange(train_end, train_end + self.horizon)
            yield train_indices, test_indices

    def get_n_splits(self, df: pd.DataFrame) -> int:
        return len(list(self.split(df)))
