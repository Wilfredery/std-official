"""Matplotlib charts for the Pareto / ABC analysis, styled like shinetechdata.com.

Every function takes the ranked table from pareto.classify() and a language
("es" or "en") and returns a Figure, so the blog SVG export and
hand-made client reports share them.
"""

from __future__ import annotations

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.axes import Axes
from matplotlib.figure import Figure
from matplotlib.patches import Patch
from matplotlib.ticker import FuncFormatter, PercentFormatter

from pareto import CLASSES, summary

# Site palette (dark). A/B/C is an ordinal purple ramp validated against PANEL:
# monotone lightness, single hue, every step clears the surface.
BG = "#16141d"
PANEL = "#211e2c"
BORDER = "#363149"
INK = "#f5f5f7"
INK_2 = "#d4d4dc"
MUTED = "#a1a1b5"
CLASS_COLORS = {"A": "#c4b5fd", "B": "#8b5cf6", "C": "#6747c7"}
# Text that sits on top of each class color.
ON_CLASS = {"A": BG, "B": INK, "C": INK}
FONT_STACK = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

LABELS = {
    "es": {
        "badge": "EJEMPLO",
        "class": "Clase {c}",
        "curve_title": "Curva de Pareto: pocos productos, casi todas las ventas",
        "curve_x": "% de productos (de más a menos vendido)",
        "curve_y": "% acumulado de las ventas",
        "curve_even": "Si todos vendieran igual",
        "curve_note": "{p:.0%} de los productos\n= {r:.0%} de las ventas",
        "bars_title": "Ventas anuales por producto, de mayor a menor",
        "bars_x": "{n} productos ordenados por ventas",
        "bars_y": "Ventas anuales",
        "bars_note": "Clase C: {n} productos\nsolo {r:.0%} de las ventas",
        "mix_title": "Cuánto pesa cada clase",
        "mix_rows": ("Productos", "Ventas", "Ganancia bruta"),
        "scatter_title": "Ventas contra margen: qué hacer con cada producto",
        "scatter_x": "Ventas anuales (escala logarítmica)",
        "scatter_y": "Margen bruto",
        "q_star": "Estrellas:\nprotégelas",
        "q_traffic": "Imanes de tráfico:\nnunca sin stock",
        "q_opportunity": "Oportunidad:\ndales vitrina",
        "q_review": "Revisar\no eliminar",
        "avg_margin": "Margen promedio {m:.0%}",
    },
    "en": {
        "badge": "EXAMPLE",
        "class": "Class {c}",
        "curve_title": "Pareto curve: a few items, almost all of the sales",
        "curve_x": "% of products (best seller first)",
        "curve_y": "Cumulative % of sales",
        "curve_even": "If every product sold the same",
        "curve_note": "{p:.0%} of products\n= {r:.0%} of sales",
        "bars_title": "Annual sales by product, highest to lowest",
        "bars_x": "{n} products ranked by sales",
        "bars_y": "Annual sales",
        "bars_note": "Class C: {n} products\njust {r:.0%} of sales",
        "mix_title": "How much each class weighs",
        "mix_rows": ("Products", "Sales", "Gross profit"),
        "scatter_title": "Sales vs. margin: what to do with each product",
        "scatter_x": "Annual sales (log scale)",
        "scatter_y": "Gross margin",
        "q_star": "Stars:\nprotect them",
        "q_traffic": "Traffic drivers:\nnever out of stock",
        "q_opportunity": "Opportunity:\ngive them shelf space",
        "q_review": "Review\nor cut",
        "avg_margin": "Average margin {m:.0%}",
    },
}


def money(value: float, lang: str) -> str:
    """$76,300 in English, US$76.300 in Spanish (matches the blog's style)."""
    text = f"{value:,.0f}"
    return f"${text}" if lang == "en" else "US$" + text.replace(",", ".")


def pct(value: float) -> str:
    return f"{value:.0%}"


plt.rcParams.update(
    {
        "font.family": ["DejaVu Sans"],
        "font.size": 11,
        "svg.fonttype": "none",
        "figure.facecolor": BG,
        "axes.facecolor": PANEL,
        "axes.edgecolor": BORDER,
        "axes.labelcolor": MUTED,
        "axes.titlecolor": INK,
        "axes.grid": True,
        "grid.color": BORDER,
        "grid.linewidth": 0.8,
        "xtick.color": MUTED,
        "ytick.color": MUTED,
        "xtick.major.size": 0,
        "ytick.major.size": 0,
        "legend.frameon": False,
        "legend.labelcolor": INK_2,
    }
)


def _frame(title: str, lang: str, left: float = 0.1) -> tuple[Figure, Axes]:
    """960x560 card with the title and the EXAMPLE badge, like the other blog charts."""
    fig = plt.figure(figsize=(9.6, 5.6), dpi=100)
    fig.text(0.042, 0.905, title, fontsize=17, fontweight="bold", color=INK)
    fig.text(
        0.955, 0.905, LABELS[lang]["badge"], fontsize=9, fontweight="bold", color=MUTED,
        ha="right", bbox={"boxstyle": "round,pad=0.55,rounding_size=0.9", "fc": PANEL, "ec": BORDER, "lw": 1.2},
    )
    ax = fig.add_axes((left, 0.15, 0.95 - left, 0.66))
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.spines["left"].set_color(BORDER)
    ax.spines["bottom"].set_color(BORDER)
    ax.set_axisbelow(True)
    return fig, ax


def _class_legend(ax: Axes, lang: str, loc: str = "upper right") -> None:
    handles = [Patch(color=CLASS_COLORS[c], label=LABELS[lang]["class"].format(c=c)) for c in CLASSES]
    ax.legend(handles=handles, loc=loc, ncols=3, handlelength=1.1, columnspacing=1.4)


def pareto_curve(ranked: pd.DataFrame, lang: str = "es") -> Figure:
    """Cumulative share of sales against share of products, zones shaded by class."""
    t = LABELS[lang]
    fig, ax = _frame(t["curve_title"], lang)
    x = np.concatenate([[0], ranked["cum_products"].to_numpy()])
    y = np.concatenate([[0], ranked["cum_share"].to_numpy()])
    for c in CLASSES:
        idx = np.flatnonzero(ranked["abc"].to_numpy() == c)
        if idx.size:
            span = slice(idx[0], idx[-1] + 2)  # +1 for the leading 0, +1 to close the gap
            ax.fill_between(x[span], 0, y[span], color=CLASS_COLORS[c], alpha=0.85, lw=0)
            # Zone letter at the foot of each class, plus a surface-colored divider.
            ax.text((x[idx[0]] + x[idx[-1] + 1]) / 2, 0.04, c, ha="center", color=ON_CLASS[c],
                    fontsize=14, fontweight="bold", zorder=4)
            if idx[0] > 0:
                ax.plot([x[idx[0]]] * 2, [0, y[idx[0]]], color=PANEL, lw=2, zorder=3)
    ax.plot([0, 1], [0, 1], color=MUTED, lw=1.2, ls=(0, (4, 4)))
    ax.text(0.62, 0.55, t["curve_even"], color=MUTED, fontsize=10, rotation=24, rotation_mode="anchor")
    ax.plot(x, y, color=INK, lw=2)

    a_rows = ranked[ranked["abc"] == "A"]
    if not a_rows.empty:
        px, py = float(a_rows["cum_products"].iloc[-1]), float(a_rows["cum_share"].iloc[-1])
        ax.plot([px, px], [0, py], color=INK, lw=1, ls=(0, (2, 3)))
        ax.plot([0, px], [py, py], color=INK, lw=1, ls=(0, (2, 3)))
        ax.scatter([px], [py], s=70, color=INK, edgecolor=PANEL, linewidth=2, zorder=5)
        ax.annotate(
            t["curve_note"].format(p=px, r=py), (px, py), xytext=(px + 0.08, py - 0.22),
            color=INK, fontsize=12, fontweight="bold",
            arrowprops={"arrowstyle": "-", "color": INK_2, "lw": 1},
        )
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.02)
    ax.xaxis.set_major_formatter(PercentFormatter(1.0))
    ax.yaxis.set_major_formatter(PercentFormatter(1.0))
    ax.set_xlabel(t["curve_x"])
    ax.set_ylabel(t["curve_y"])
    return fig  # zones carry direct A/B/C labels, so no legend box


def revenue_bars(ranked: pd.DataFrame, lang: str = "es") -> Figure:
    """The long tail: one bar per product, colored by class."""
    t = LABELS[lang]
    fig, ax = _frame(t["bars_title"], lang)
    colors = [CLASS_COLORS[c] for c in ranked["abc"]]
    ax.bar(ranked["rank"], ranked["revenue"], width=0.78, color=colors, lw=0)
    ax.grid(axis="x", visible=False)
    ax.set_xlim(0.3, len(ranked) + 0.7)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: money(v, lang)))
    ax.set_xticks([])
    ax.set_xlabel(t["bars_x"].format(n=len(ranked)))
    ax.set_ylabel(t["bars_y"])
    c_rows = ranked[ranked["abc"] == "C"]
    if not c_rows.empty:
        mid = float(c_rows["rank"].median())
        ax.annotate(
            t["bars_note"].format(n=len(c_rows), r=c_rows["share"].sum()),
            (mid, float(c_rows["revenue"].max())), xytext=(mid, float(ranked["revenue"].max()) * 0.42),
            ha="center", color=INK, fontsize=12, fontweight="bold",
            arrowprops={"arrowstyle": "-", "color": INK_2, "lw": 1},
        )
    _class_legend(ax, lang)
    return fig


def class_mix(ranked: pd.DataFrame, lang: str = "es") -> Figure:
    """100% stacked bars: share of products, sales and gross profit per class."""
    t = LABELS[lang]
    fig, ax = _frame(t["mix_title"], lang, left=0.17)
    s = summary(ranked)
    cols = ["product_share", "revenue_share"] + (["profit_share"] if "profit_share" in s else [])
    rows = list(t["mix_rows"][: len(cols)])
    ypos = np.arange(len(cols))[::-1]
    gap = 0.004  # surface gap between segments
    for y, col in zip(ypos, cols):
        left = 0.0
        for c in CLASSES:
            w = float(s.loc[c, col])
            if w <= 0:
                continue
            ax.barh(y, max(w - gap, 0), left=left, height=0.58, color=CLASS_COLORS[c], lw=0)
            label = f"{c} · {pct(w)}" if w >= 0.1 else pct(w)
            if w >= 0.035:
                ax.text(left + w / 2, y, label, ha="center", va="center", color=ON_CLASS[c],
                        fontsize=11 if w >= 0.1 else 9.5, fontweight="bold")
            left += w
    ax.set_yticks(ypos, rows, color=INK_2, fontsize=12)
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.6, len(cols) - 0.4)
    ax.xaxis.set_major_formatter(PercentFormatter(1.0))
    ax.grid(axis="y", visible=False)
    ax.spines["left"].set_visible(False)
    handles = [Patch(color=CLASS_COLORS[c], label=t["class"].format(c=c)) for c in CLASSES]
    ax.legend(handles=handles, loc="upper center", bbox_to_anchor=(0.5, 1.13), ncols=3,
              handlelength=1.1, columnspacing=1.4)
    return fig


def margin_scatter(ranked: pd.DataFrame, lang: str = "es") -> Figure:
    """Sales (log) against gross margin, with the four action quadrants."""
    t = LABELS[lang]
    fig, ax = _frame(t["scatter_title"], lang)
    if "margin_pct" not in ranked.columns:
        ax.text(0.5, 0.5, "margin_pct column needed", ha="center", color=MUTED, transform=ax.transAxes)
        return fig
    for c in CLASSES[::-1]:  # A drawn last, on top
        part = ranked[ranked["abc"] == c]
        ax.scatter(part["revenue"], part["margin_pct"], s=64, color=CLASS_COLORS[c],
                   edgecolor=PANEL, linewidth=1.6, label=t["class"].format(c=c), zorder=3)
    ax.set_xscale("log")
    a_min = ranked.loc[ranked["abc"] == "A", "revenue"].min()
    avg = ranked["gross_profit"].sum() / ranked["revenue"].sum()
    ax.axvline(a_min * 0.93, color=MUTED, lw=1, ls=(0, (4, 4)))
    ax.axhline(avg, color=MUTED, lw=1, ls=(0, (4, 4)))
    ax.text(ranked["revenue"].min(), avg + 0.006, t["avg_margin"].format(m=avg), color=MUTED, fontsize=9.5)
    quad = {"fontsize": 11, "fontweight": "bold", "color": INK_2, "transform": ax.transAxes}
    ax.text(0.98, 0.96, t["q_star"], ha="right", va="top", **quad)
    ax.text(0.98, 0.04, t["q_traffic"], ha="right", va="bottom", **quad)
    ax.text(0.02, 0.96, t["q_opportunity"], ha="left", va="top", **quad)
    ax.text(0.02, 0.04, t["q_review"], ha="left", va="bottom", **quad)
    ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: money(v, lang)))
    ax.yaxis.set_major_formatter(PercentFormatter(1.0))
    lo, hi = ranked["margin_pct"].min(), ranked["margin_pct"].max()
    ax.set_ylim(lo - 0.06, hi + 0.08)
    ax.set_xlabel(t["scatter_x"])
    ax.set_ylabel(t["scatter_y"])
    handles, labels = ax.get_legend_handles_labels()
    ax.legend(handles[::-1], labels[::-1], loc="upper center", ncols=3, bbox_to_anchor=(0.5, 1.12),
              handletextpad=0.3, columnspacing=1.4)
    return fig
