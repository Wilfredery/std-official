"""Write the blog post's charts as accessible SVGs (Spanish and English).

    python analytics/rfm/export_svgs.py

Output: public/images/blog/rfm-analysis-small-business/*.svg
"""

from __future__ import annotations

import io
import re
from pathlib import Path
from xml.sax.saxutils import escape

import charts
import rfm

SLUG = "rfm-analysis-small-business"
OUT_DIR = Path(__file__).resolve().parents[2] / "public" / "images" / "blog" / SLUG

# file name and title key per chart, per language
FILES = {
    "segment_mix": ({"es": "segmentos-clientes-ingresos", "en": "segments-clients-revenue"}, "mix_title"),
    "rf_grid": ({"es": "matriz-rfm-salon", "en": "salon-rfm-grid"}, "grid_title"),
    "recency_hist": ({"es": "dias-desde-ultima-visita", "en": "days-since-last-visit"}, "rec_title"),
}


def describe(scored, lang: str) -> str:
    """Plain-text summary of the data for the SVG <desc> (screen readers)."""
    s = rfm.summary(scored)
    names = charts.LABELS[lang]["segments"]
    es = lang == "es"
    parts = []
    for seg in rfm.SEGMENTS:
        row = s.loc[seg]
        if es:
            parts.append(f"{names[seg]}: {int(row.clients)} clientes ({row.client_share:.0%}), "
                         f"{row.revenue_share:.0%} de los ingresos.")
        else:
            parts.append(f"{names[seg]}: {int(row.clients)} clients ({row.client_share:.0%}), "
                         f"{row.revenue_share:.0%} of revenue.")
    parts.append("Datos ilustrativos de un salón de belleza independiente." if es else
                 "Illustrative data from an independent hair salon.")
    return " ".join(parts)


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
    scored = rfm.score(rfm.sample_salon(), rfm.AS_OF)
    for name, (names, title_key) in FILES.items():
        for lang, stem in names.items():
            fig = getattr(charts, name)(scored, lang)
            path = OUT_DIR / f"{stem}.svg"
            path.write_text(to_svg(fig, charts.LABELS[lang][title_key], describe(scored, lang)), encoding="utf-8")
            charts.plt.close(fig)
            print(f"wrote {path.relative_to(OUT_DIR.parents[3])} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
