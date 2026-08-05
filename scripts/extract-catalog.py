# -*- coding: utf-8 -*-
"""
Extrae productos (titulo, specs, precio, imagenes) de los 23 catalogos PDF
de Industrias FECMO y genera data/products.json + public/products/**.

Ejecutar con: C:/Python314/python.exe scripts/extract-catalog.py
"""
import io
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

CATALOG_DIR = Path(r"E:\FECMO\catalogosfecmo")
WEB_DIR = Path(__file__).resolve().parent.parent
IMAGES_DIR = WEB_DIR / "public" / "products"
DATA_DIR = WEB_DIR / "data"

CATEGORY_NAMES = {
    "CATALOGO ASADORES Y PARRILLA.pdf": "Asadores y Parrillas",
    "CATALOGO BANDEJAS.pdf": "Bandejas",
    "CATALOGO BASCULAS.pdf": "Básculas",
    "CATALOGO CUARTOS DE CRECIMIENTO.pdf": "Cuartos de Crecimiento",
    "CATALOGO DE DESHIDRATADORES.pdf": "Deshidratadores",
    "CATALOGO ESTUFAS.pdf": "Estufas",
    "CATALOGO FOGONES DE LEÑA.pdf": "Fogones de Leña",
    "CATALOGO FREIDORAS.pdf": "Freidoras",
    "CATALOGO HORNOS LECHONEROS.pdf": "Hornos Lechoneros",
    "CATALOGO HORNOS MULTI USOS CONVENCIONALES.pdf": "Hornos Multiusos",
    "CATALOGO HORNOS PANADEROS.pdf": "Hornos Panaderos",
    "CATALOGO HORNOS PARA PIZZA.pdf": "Hornos para Pizza",
    "CATALOGO HORNOS PARA POLLOS.pdf": "Hornos para Pollos",
    "CATALOGO HORNOS ROTATORIOS DE PANADERIA.pdf": "Hornos Rotatorios de Panadería",
    "CATALOGO IMPORTADOS.pdf": "Importados",
    "CATALOGO LICUADORAS.pdf": "Licuadoras",
    "CATALOGO OLLAS.pdf": "Ollas",
    "CATALOGO PLANCHAS.pdf": "Planchas",
    "CATALOGO TABLAS DE ACERO.pdf": "Tablas de Acero",
    "CATALOGO TOPINERAS.pdf": "Topineras",
    "CATALOGO UTENSILIOS.pdf": "Utensilios",
    "HORNOS TIPO TUNEL.pdf": "Hornos Tipo Túnel",
    "MOLINOS.pdf": "Molinos",
    "PROCESADORES DE CARNES.pdf": "Procesadores de Carnes",
}

# Etiquetas de specs confirmadas (linea completa, tal cual aparecen en la
# columna izquierda de la tabla de specs, ya en mayusculas).
FIELD_LABELS = {
    "MATERIALES", "CAPACIDAD", "CATEGORIA", "COLOR", "COMBUSTIBLE",
    "ENERGIA", "ESPACIOS", "ESPESOR DE CORTE", "FRECUENCIA", "GARANTIA",
    "MEDIDAS", "MOTOR", "PESO", "POTENCIA", "QUEMADORES", "TEMPERATURA",
    "VELOCIDAD", "VELOCIDADES", "VOLTAJE", "TABLERO", "SOPORTES",
    "CUCHILLA", "DISCO", "CONTIENE", "RENDIMIENTO", "TIPOS DE CARNES",
    "CAPACIDAD DE PRODUCTIVIDAD", "GRADUADOR DE TEMPERATURA",
    "RANGO DE TEMPERATURA", "PRODUCCION ESTIMADA", "SISTEMA DE ENCENDIDO",
    "ACCESORIOS", "PARRILLA", "FOGONES", "MUEBLE", "GENERALES",
    "ACEITE", "AZUCAR", "MAIZ", "CAPACIDAD DE CORTE",
    "CAPACIDAD DE LA TOLVA", "SISTEMA DE MOLIDO", "BANDA DE ASADO",
    "MEDIDAS GENERALES",
}
LABEL_ALIASES = {"CONBUSTIBLE": "COMBUSTIBLE"}
MAX_LABEL_LINES = 3  # tope de lineas a fusionar buscando una etiqueta conocida

HEADER_MARKERS = ("CARRERA 20", "WHATSAPP:", "SÍGUENOS", "INSTAGRAM:",
                   "FACEBOOK:", "TIKTOK:", "RECIBIMOS TODOS")


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "producto"


def norm_label(text: str) -> str:
    text = text.upper().strip()
    return LABEL_ALIASES.get(text, text)


def find_label_x(xs):
    """La columna de etiquetas es la posicion x0 mas frecuente entre las
    dos mas frecuentes (la mas a la izquierda). Se usa frecuencia (moda)
    en vez del hueco mas grande porque el precio ($ ...) suele quedar en
    una tercera posicion mucho mas a la derecha, lo que rompe cualquier
    separacion basada solo en el hueco mayor."""
    freq = Counter(round(x, 1) for x in xs)
    common = [x for x, _ in freq.most_common(2)]
    if not common:
        return None
    return min(common)


def parse_price(text: str):
    digits = re.sub(r"[^\d]", "", text)
    return int(digits) if digits else None


def get_repeated_image_bboxes(doc):
    """Detecta imagenes de cabecera/fondo que se repiten en (casi) todas
    las paginas del mismo archivo, identificadas por bbox constante."""
    bbox_pages = {}
    for page in doc:
        for info in page.get_image_info(xrefs=True):
            bbox = tuple(round(v) for v in info["bbox"])
            bbox_pages.setdefault(bbox, set()).add(page.number)
    threshold = max(2, int(len(doc) * 0.4))
    return {bbox for bbox, pages in bbox_pages.items() if len(pages) >= threshold}


def extract_product_images(doc, page, repeated_bboxes, out_dir: Path, slug: str):
    out_dir.mkdir(parents=True, exist_ok=True)
    saved = []
    seen_xrefs = set()
    idx = 0
    for info in page.get_image_info(xrefs=True):
        bbox = tuple(round(v) for v in info["bbox"])
        xref = info.get("xref")
        if bbox in repeated_bboxes or not xref or xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)
        try:
            pix = fitz.Pixmap(doc, xref)
            if pix.colorspace and pix.colorspace.n not in (1, 3):
                pix = fitz.Pixmap(fitz.csRGB, pix)
            if pix.width < 150 or pix.height < 150:
                continue
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            if img.mode in ("RGBA", "LA", "P"):
                bg = Image.new("RGB", img.size, (255, 255, 255))
                img = img.convert("RGBA")
                bg.paste(img, mask=img.split()[-1])
                img = bg
            else:
                img = img.convert("RGB")
            idx += 1
            filename = f"{slug}-{idx}.webp"
            img.save(out_dir / filename, "WEBP", quality=85)
            saved.append(filename)
        except Exception as exc:  # noqa: BLE001
            print(f"    ! error extrayendo imagen xref={xref}: {exc}")
    return saved


def parse_spec_lines(lines):
    """lines: lista de dict con x0,y0,text,bold,size, ya excluyendo header y titulo."""
    empty_meta = {"price": None, "price_variants": {}, "unmatched_labels": []}
    if not lines:
        return {}, empty_meta

    xs = [l["x0"] for l in lines if not l["bold"]]
    label_x = find_label_x(xs)

    def is_label_col(l):
        return l["bold"] or (label_x is not None and round(l["x0"], 1) == label_x)

    label_lines = sorted([l for l in lines if is_label_col(l)], key=lambda l: l["y0"])
    value_lines = sorted([l for l in lines if not is_label_col(l)], key=lambda l: l["y0"])

    if not label_lines:
        return {}, empty_meta

    # Fase 1: construir filas fusionando SOLO dentro de la secuencia de
    # lineas de la columna etiqueta (evita que una linea de valor
    # intercalada corte la fusion de una etiqueta partida en 2 lineas).
    rows = []  # {label, tag, is_price, start_y}
    i = 0
    n = len(label_lines)
    while i < n:
        line = label_lines[i]
        if line["bold"]:
            text_up = line["text"].upper().strip()
            tag = text_up.replace("VALOR", "").strip(" :-") or None
            rows.append({"label": "VALOR", "tag": tag, "is_price": True, "start_y": line["y0"]})
            i += 1
            continue

        # Match de prefijo mas largo: probamos 1, 2, 3... lineas y nos
        # quedamos con la combinacion mas larga que calce (ej. "MEDIDAS"
        # sola es valida, pero "MEDIDAS"+"GENERALES" tambien lo es y debe
        # ganar si el layout trae ambas lineas).
        buf = []
        matched_label = None
        consumed = 0
        for k in range(MAX_LABEL_LINES):
            idx = i + k
            if idx >= n or (k > 0 and label_lines[idx]["bold"]):
                break
            buf.append(label_lines[idx])
            candidate = norm_label(" ".join(x["text"] for x in buf))
            if candidate in FIELD_LABELS:
                matched_label = candidate
                consumed = k + 1

        if matched_label is None:
            matched_label = norm_label(line["text"])
            consumed = 1

        rows.append({"label": matched_label, "tag": None, "is_price": False, "start_y": line["y0"]})
        i += consumed

    # Fase 2: asignar las lineas de la columna valor a cada fila segun su
    # rango vertical [start_y de esta fila, start_y de la siguiente).
    for idx, row in enumerate(rows):
        y_start = row["start_y"]
        y_end = rows[idx + 1]["start_y"] if idx + 1 < len(rows) else float("inf")
        row["value_lines"] = [v for v in value_lines if y_start - 2 <= v["y0"] < y_end - 2]

    specs = {}
    price = None
    price_variants = {}
    unmatched_labels = []
    for row in rows:
        value_text = " ".join(v["text"] for v in row["value_lines"]).strip()
        value_text = re.sub(r"\s+", " ", value_text)
        if row["is_price"]:
            p = parse_price(value_text)
            if row["tag"]:
                price_variants[row["tag"]] = p
            elif price is None:
                price = p
            continue
        if row["label"] not in FIELD_LABELS:
            unmatched_labels.append(row["label"])
        if value_text:
            specs[row["label"]] = value_text

    return specs, {"price": price, "price_variants": price_variants, "unmatched_labels": unmatched_labels}


def extract_page_lines(page):
    d = page.get_text("dict")
    title_candidates = []
    spec_lines = []
    for block in d["blocks"]:
        if "lines" not in block:
            continue
        for line in block["lines"]:
            spans = line["spans"]
            txt = "".join(s["text"] for s in spans).strip()
            if not txt:
                continue
            upper = txt.upper()
            if any(m in upper for m in HEADER_MARKERS):
                continue
            max_size = max(s["size"] for s in spans)
            fonts = " ".join(s["font"] for s in spans)
            if "Calibri" not in fonts and "Arial" not in fonts:
                continue
            if max_size >= 14:
                title_candidates.append((line["bbox"][1], txt))
                continue
            bold = any("Bold" in s["font"] for s in spans)
            spec_lines.append({
                "x0": line["bbox"][0], "y0": line["bbox"][1],
                "text": txt, "bold": bold, "size": max_size,
            })
    title_candidates.sort(key=lambda t: t[0])
    title = title_candidates[0][1].strip() if title_candidates else None
    return title, spec_lines


def main():
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    products = []
    report = {"missing_price": [], "missing_specs": [], "no_images": [], "unmatched_labels": []}

    pdf_files = sorted(CATALOG_DIR.glob("*.pdf"))
    for pdf_path in pdf_files:
        fname = pdf_path.name
        if fname not in CATEGORY_NAMES:
            print(f"! Catalogo sin categoria mapeada, se omite: {fname}")
            continue
        category_name = CATEGORY_NAMES[fname]
        category_slug = slugify(category_name)
        print(f"== {fname} -> {category_name} ({category_slug})")

        doc = fitz.open(pdf_path)
        repeated_bboxes = get_repeated_image_bboxes(doc)
        out_dir = IMAGES_DIR / category_slug

        seen_slugs = set()
        for page in doc:
            title, spec_lines = extract_page_lines(page)
            if not title:
                continue  # pagina de portada / sin producto

            specs, meta = parse_spec_lines(spec_lines)
            base_slug = slugify(title)
            slug = base_slug
            n = 2
            while slug in seen_slugs:
                slug = f"{base_slug}-{n}"
                n += 1
            seen_slugs.add(slug)

            images = extract_product_images(doc, page, repeated_bboxes, out_dir, slug)

            product = {
                "id": f"{category_slug}--{slug}",
                "slug": slug,
                "title": title.strip(),
                "category": category_name,
                "categorySlug": category_slug,
                "price": meta["price"],
                "priceVariants": meta["price_variants"] or None,
                "specs": specs,
                "images": [f"/products/{category_slug}/{img}" for img in images],
                "sourcePage": page.number + 1,
                "sourceFile": fname,
            }
            products.append(product)

            if product["price"] is None and not product["priceVariants"]:
                report["missing_price"].append(product["id"])
            if len(specs) < 2:
                report["missing_specs"].append(product["id"])
            if not images:
                report["no_images"].append(product["id"])
            if meta["unmatched_labels"]:
                report["unmatched_labels"].append({"id": product["id"], "labels": meta["unmatched_labels"]})

    (DATA_DIR / "products.json").write_text(
        json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (DATA_DIR / "extraction-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    categories = sorted({(p["categorySlug"], p["category"]) for p in products})
    (DATA_DIR / "categories.json").write_text(
        json.dumps(
            [{"slug": s, "name": n, "count": sum(1 for p in products if p["categorySlug"] == s)}
             for s, n in categories],
            ensure_ascii=False, indent=2,
        ),
        encoding="utf-8",
    )

    print(f"\nTotal productos: {len(products)}")
    print(f"Sin precio: {len(report['missing_price'])}")
    print(f"Specs incompletas (<2 campos): {len(report['missing_specs'])}")
    print(f"Sin imagenes: {len(report['no_images'])}")
    print(f"Con etiquetas no reconocidas: {len(report['unmatched_labels'])}")


if __name__ == "__main__":
    main()
