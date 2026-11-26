"""Write the blog post's charts as accessible SVGs (Spanish and English).

    python analytics/pareto_abc/export_svgs.py

Output: public/images/blog/pareto-analysis-small-business/*.svg
"""

from __future__ import annotations

import io
import re
from pathlib import Path
from xml.sax.saxutils import escape

import charts
import pareto

SLUG = "pareto-analysis-small-business"
OUT_DIR = Path(__file__).resolve().parents[2] / "public" / "images" / "blog" / SLUG

# file name per language for each chart
FILES = {
    "pareto_curve": {"es": "curva-pareto-tienda-mascotas", "en": "pet-store-pareto-curve"},
    "class_mix": {"es": "peso-clases-abc", "en": "abc-class-mix"},
    "margin_scatter": {"es": "ventas-vs-margen-productos", "en": "product-sales-vs-margin"},
}


def describe(name: str, ranked, lang: str) -> str:
    """Plain-text summary of the data for the SVG <desc> (screen readers)."""
    s = pareto.summary(ranked)
    es = lang == "es"
    note = "Datos ilustrativos de una tienda de mascotas independiente." if es else \
        "Illustrative data from an independent pet supply store."
    parts = []
    for c in pareto.CLASSES:
        row = s.loc[c]
        if es:
            parts.append(
                f"Clase {c}: {int(row.products)} productos ({row.product_share:.0%}), "
                f"{row.revenue_share:.0%} de las ventas, {row.profit_share:.0%} de la ganancia bruta, "
                f"margen {row.margin_pct:.0%}."
            )
        else:
            parts.append(
                f"Class {c}: {int(row.products)} products ({row.product_share:.0%}), "
                f"{row.revenue_share:.0%} of sales, {row.profit_share:.0%} of gross profit, "
                f"{row.margin_pct:.0%} margin."
            )
    if name == "margin_scatter":
        parts.append(
            "Los productos A venden más pero tienen margen bajo; muchos productos B y C tienen margen alto."
            if es else
            "Class A products sell the most but have low margins; many B and C products have high margins."
        )
    return " ".join(parts + [note])


def to_svg(fig, title: str, desc: str) -> str:
    buf = io.StringIO()
    fig.savefig(buf, format="svg", metadata={"Date": None, "Creator": None})
    svg = buf.getvalue()
    svg = svg[svg.index("<svg"):]  # drop XML prolog and DOCTYPE
    # Pixel size for the blog's layout-shift-free <img>, keep matplotlib's viewBox.
    svg = re.sub(r'<svg([^>]*?) width="[\d.]+pt" height="[\d.]+pt"',
                 r'<svg\1 width="960" height="560" role="img" aria-labelledby="t d"', svg, count=1)
    svg = re.sub(r"(<svg[^>]*>)", rf'\1\n<title id="t">{escape(title)}</title>\n<desc id="d">{escape(desc)}</desc>',
                 svg, count=1)
    # Matplotlib writes the font it measured with; let browsers use the site's font stack.
    svg = re.sub(r"font-family:\s*'DejaVu Sans'", f"font-family: {charts.FONT_STACK}", svg)
    return svg


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ranked = pareto.classify(pareto.sample_pet_store())
    titles = {
        "pareto_curve": "curve_title",
        "class_mix": "mix_title",
        "margin_scatter": "scatter_title",
    }
    for name, names in FILES.items():
        for lang, stem in names.items():
            fig = getattr(charts, name)(ranked, lang)
            title = charts.LABELS[lang][titles[name]]
            path = OUT_DIR / f"{stem}.svg"
            path.write_text(to_svg(fig, title, describe(name, ranked, lang)), encoding="utf-8")
            charts.plt.close(fig)
            print(f"wrote {path.relative_to(OUT_DIR.parents[3])} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
