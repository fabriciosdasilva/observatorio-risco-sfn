"""
Script de sincronização de artefatos analíticos para a aplicação web na Vercel.
Copia os JSONs gerados pelos 3 pilares para a pasta web/public/data/.
"""

import shutil
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def export_artifacts_to_web():
    source_dir = Path("data/output_json")
    target_dir = Path("web/public/data")
    target_dir.mkdir(parents=True, exist_ok=True)

    files_to_copy = [
        "pilar1_macro_lags.json",
        "pilar2_bancos_balancos.json",
        "pilar3_cvm_empresas.json",
    ]

    for fname in files_to_copy:
        src = source_dir / fname
        dst = target_dir / fname
        if src.exists():
            shutil.copy2(src, dst)
            logger.info(f"Copiado: {src} -> {dst}")
        else:
            logger.warning(f"Arquivo não encontrado: {src}")

    logger.info("Exportação para a pasta web/ concluída com sucesso!")


if __name__ == "__main__":
    export_artifacts_to_web()
