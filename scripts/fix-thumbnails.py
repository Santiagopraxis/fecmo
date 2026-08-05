# -*- coding: utf-8 -*-
"""Elimina la imagen decorativa de fondo (repetida en casi todos los
productos) detectada por hash de contenido, y renumera las imagenes
restantes de cada producto. Corre despues de extract-catalog.py.
"""
import hashlib
import json
from collections import defaultdict
from pathlib import Path

WEB_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = WEB_DIR / "data" / "products.json"
PUBLIC_DIR = WEB_DIR / "public"


def md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def main():
    products = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    # Paso 1: detectar hashes que se repiten en >=5 productos distintos (decoraciones/plantillas)
    hash_products = defaultdict(set)
    for p in products:
        for img in p["images"]:
            fpath = PUBLIC_DIR / img.lstrip("/")
            if fpath.exists():
                hash_products[md5(fpath)].add(p["id"])
    junk_hashes = {h for h, prods in hash_products.items() if len(prods) >= 5}
    print(f"Hashes decorativos detectados: {len(junk_hashes)}")

    removed_files = 0
    affected_products = 0

    for p in products:
        kept = []
        removed_this = []
        for img in p["images"]:
            fpath = PUBLIC_DIR / img.lstrip("/")
            if fpath.exists() and md5(fpath) in junk_hashes:
                removed_this.append(fpath)
            else:
                kept.append(img)

        if not removed_this:
            continue

        affected_products += 1

        # Borrar primero los archivos decorativos para que no choquen
        # con los nombres destino al renumerar.
        for fpath in removed_this:
            if fpath.exists():
                fpath.unlink()
            removed_files += 1

        # Renombrar las imagenes restantes a una secuencia limpia -1, -2, ...
        # (pasando por un nombre temporal para evitar colisiones cuando
        # el orden cambia, ej. -2 -> -1 mientras -1 aun no se libero).
        category_dir = PUBLIC_DIR / "products" / p["categorySlug"]
        temp_paths = []
        for idx, img in enumerate(kept, start=1):
            old_path = PUBLIC_DIR / img.lstrip("/")
            tmp_path = category_dir / f"{p['slug']}-tmp-{idx}.webp"
            old_path.rename(tmp_path)
            temp_paths.append(tmp_path)

        new_images = []
        for idx, tmp_path in enumerate(temp_paths, start=1):
            new_name = f"{p['slug']}-{idx}.webp"
            new_path = category_dir / new_name
            tmp_path.rename(new_path)
            new_images.append(f"/products/{p['categorySlug']}/{new_name}")

        p["images"] = new_images

    DATA_FILE.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")

    no_images = [p["id"] for p in products if not p["images"]]
    print(f"Productos afectados: {affected_products}")
    print(f"Archivos decorativos eliminados: {removed_files}")
    print(f"Productos sin ninguna imagen tras la limpieza: {len(no_images)}")
    if no_images:
        print(no_images)


if __name__ == "__main__":
    main()
