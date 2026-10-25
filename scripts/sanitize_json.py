import json
import math
import re
from pathlib import Path

def sanitize(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize(v) for v in obj]
    return obj

for path in [
    Path("data/output_json/pilar3_cvm_empresas.json"),
    Path("web/public/data/pilar3_cvm_empresas.json"),
]:
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        clean_data = sanitize(data)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(clean_data, f, ensure_ascii=False, indent=2)
        print(f"Sanitized {path}")
