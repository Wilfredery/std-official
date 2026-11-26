"""Matplotlib charts for the RFM analysis, styled like shinetechdata.com.

Every function takes the table from rfm.score() and a language ("es" or "en")
and returns a Figure. Same card style as analytics/pareto_abc/charts.py.
"""

from __future__ import annotations

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.axes import Axes
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.figure import Figure
from matplotlib.patches import Patch, Rectangle
from matplotlib.ticker import PercentFormatter

from rfm import SEGMENTS, summary

# Site palette (dark).
BG = "#16141d"
PANEL = "#211e2c"
BORDER = "#363149"
INK = "#f5f5f7"
INK_2 = "#d4d4dc"
MUTED = "#a1a1b5"
# Validated pair on PANEL (dataviz validator, dark): purple = money / high value,
# blue = head count / low value. Same meaning in every chart of the post.
MONEY = "#8b5cf6"
COUNT = "#2b9fd6"
# Sequential ramp for the grid: more clients = lighter (dark mode).
GRID_CMAP = LinearSegmentedColormap.from_list("rfm", ["#2a2539", "#5b44a0", "#8b5cf6", "#c4b5fd"])
FONT_STACK = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

LABELS = {
    "es": {
        "badge": "EJEMPLO",
        "segments": {
            "champions": "Campeones",
            "promising": "Nuevos y prometedores",
            "attention": "Necesitan atención",
            "at_risk": "En riesgo",
            "lost": "Perdidos",
        },
        "mix_title": "Clientes e ingresos por segmento",
        "mix_clients": "% de los clientes",
        "mix_revenue": "% de los ingresos",
        "grid_title": "Clientes según recencia y frecuencia + gasto",
        "grid_x": "Frecuencia y gasto (FM): 1 = poco, 5 = mucho",
        "grid_y": "Recencia (R): 5 = vino hace poco",
        "grid_cell": "{n} clientes · {r:.0%} de los ingresos",
        "grid_bar": "Clientes por celda",
        "rec_title": "Hace cuántos días vino cada cliente por última vez",
        "rec_x": "Días desde la última visita",
        "rec_y": "Clientes",
        "rec_high": "Frecuencia y gasto altos (FM 3 a 5)",
        "rec_low": "Frecuencia y gasto bajos (FM 1 y 2)",
        "rec_line": "R 1 y 2: {d} días o más",
        "rec_note": "{n} clientes en riesgo\ndejaron {m} el último año",
    },
    "en": {
        "badge": "EXAMPLE",
        "segments": {
            "champions": "Champions",
            "promising": "New & promising",
            "attention": "Need attention",
            "at_risk": "At risk",
            "lost": "Lost",
        },
        "mix_title": "Clients and revenue by segment",
        "mix_clients": "% of clients",
        "mix_revenue": "% of revenue",
        "grid_title": "Clients by recency and frequency + spend",
        "grid_x": "Frequency and spend (FM): 1 = low, 5 = high",
        "grid_y": "Recency (R): 5 = visited recently",
        "grid_cell": "{n} clients · {r:.0%} of revenue",
        "grid_bar": "Clients per cell",
        "rec_title": "Days since each client's last visit",
        "rec_x": "Days since last visit",
        "rec_y": "Clients",
        "rec_high": "High frequency and spend (FM 3 to 5)",
        "rec_low": "Low frequency and spend (FM 1 and 2)",
        "rec_line": "R 1 and 2: {d} days or more",
        "rec_note": "{n} at-risk clients\nspent {m} last year",
    },
}

# (R range, FM range) of each segment on the 5x5 grid, inclusive.
SEGMENT_CELLS = {
    "champions": ((4, 5), (4, 5)),
    "promising": ((4, 5), (1, 3)),
    "attention": ((3, 3), (1, 5)),
    "at_risk": ((1, 2), (3, 5)),
    "lost": ((1, 2), (1, 2)),
}


def money(value: float, lang: str) -> str:
    """$42,746 in English, US$42.746 in Spanish (matches the blog's style)."""
    text = f"{value:,.0f}"
    return f"${text}" if lang == "en" else "US$" + text.replace(",", ".")


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


def _frame(title: str, lang: str, rect: tuple[float, float, float, float] = (0.1, 0.15, 0.85, 0.66)) -> tuple[Figure, Axes]:
    """960x560 card with the title and the EXAMPLE badge, like the other blog charts."""
    fig = plt.figure(figsize=(9.6, 5.6), dpi=100)
    fig.text(0.042, 0.905, title, fontsize=17, fontweight="bold", color=INK)
    fig.text(
        0.955, 0.905, LABELS[lang]["badge"], fontsize=9, fontweight="bold", color=MUTED,
        ha="right", bbox={"boxstyle": "round,pad=0.55,rounding_size=0.9", "fc": PANEL, "ec": BORDER, "lw": 1.2},
    )
    ax = fig.add_axes(rect)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.spines["left"].set_color(BORDER)
    ax.spines["bottom"].set_color(BORDER)
    ax.set_axisbelow(True)
    return fig, ax


def segment_mix(scored: pd.DataFrame, lang: str = "es") -> Figure:
    """Paired bars per segment: share of clients against share of revenue."""
    t = LABELS[lang]
    fig, ax = _frame(t["mix_title"], lang, rect=(0.25, 0.1, 0.7, 0.7))
    s = summary(scored)
    y = np.arange(len(SEGMENTS))[::-1].astype(float)
    h = 0.32
    for offset, col, color, label in (
        (h / 2 + 0.02, "client_share", COUNT, t["mix_clients"]),
        (-h / 2 - 0.02, "revenue_share", MONEY, t["mix_revenue"]),
    ):
        values = s[col].to_numpy()
        ax.barh(y + offset, values, height=h, color=color, lw=0, label=label)
        for yy, v in zip(y + offset, values):
            ax.text(v + 0.008, yy, f"{v:.0%}", va="center", color=INK_2, fontsize=10.5)
    ax.set_yticks(y, [t["segments"][k] for k in SEGMENTS], color=INK_2, fontsize=12)
    ax.set_xlim(0, max(s["client_share"].max(), s["revenue_share"].max()) * 1.12)
    ax.xaxis.set_major_formatter(PercentFormatter(1.0))
    ax.grid(axis="y", visible=False)
    ax.spines["left"].set_visible(False)
    ax.legend(loc="lower right", handlelength=1.1)
    return fig


def rf_grid(scored: pd.DataFrame, lang: str = "es") -> Figure:
    """5x5 heatmap of recency score against FM score, with segment outlines."""
    t = LABELS[lang]
    fig, ax = _frame(t["grid_title"], lang, rect=(0.1, 0.13, 0.74, 0.7))
    counts = pd.crosstab(scored["r"], scored["fm"]).reindex(index=range(1, 6), columns=range(1, 6), fill_value=0)
    img = ax.imshow(counts.to_numpy(), origin="lower", cmap=GRID_CMAP, aspect="auto",
                    extent=(0.5, 5.5, 0.5, 5.5), vmin=0)
    # Surface gaps between cells.
    for k in np.arange(1.5, 5.5):
        ax.axvline(k, color=PANEL, lw=2)
        ax.axhline(k, color=PANEL, lw=2)
    s = summary(scored)
    for seg, ((r0, r1), (f0, f1)) in SEGMENT_CELLS.items():
        ax.add_patch(Rectangle((f0 - 0.5, r0 - 0.5), f1 - f0 + 1, r1 - r0 + 1, fill=False,
                               ec=INK, lw=2.2, zorder=3))
        ax.text((f0 + f1) / 2, (r0 + r1) / 2,
                f"{t['segments'][seg]}\n" + t["grid_cell"].format(n=int(s.loc[seg, "clients"]),
                                                                 r=s.loc[seg, "revenue_share"]),
                ha="center", va="center", color=INK, fontsize=10.5, fontweight="bold", linespacing=1.5,
                zorder=4, bbox={"boxstyle": "round,pad=0.45", "fc": PANEL, "ec": "none", "alpha": 0.88})
    ax.set_xticks(range(1, 6))
    ax.set_yticks(range(1, 6))
    ax.grid(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_visible(False)
    ax.set_xlabel(t["grid_x"])
    ax.set_ylabel(t["grid_y"])
    cax = fig.add_axes((0.87, 0.13, 0.018, 0.7))
    bar = fig.colorbar(img, cax=cax)
    bar.outline.set_visible(False)
    bar.ax.tick_params(colors=MUTED, length=0)
    bar.set_label(t["grid_bar"], color=MUTED)
    return fig


def recency_hist(scored: pd.DataFrame, lang: str = "es") -> Figure:
    """Clients by days since last visit, stacked by high vs. low FM."""
    t = LABELS[lang]
    fig, ax = _frame(t["rec_title"], lang)
    bins = np.arange(0, 375 + 1, 15)  # 0-374 days, 25 columns
    high = scored.loc[scored["fm"] >= 3, "recency_days"]
    low = scored.loc[scored["fm"] < 3, "recency_days"]
    hi_n, _ = np.histogram(high, bins)
    lo_n, _ = np.histogram(low, bins)
    width = 15 - 1.6  # surface gap between columns
    left = bins[:-1] + 0.8
    ax.bar(left, hi_n, width=width, align="edge", color=MONEY, lw=0, label=t["rec_high"])
    ax.bar(left, lo_n, width=width, align="edge", bottom=hi_n, color=COUNT, lw=0, label=t["rec_low"])
    cut = int(scored.loc[scored["r"] <= 2, "recency_days"].min())
    ax.axvline(cut, color=INK_2, lw=1.2, ls=(0, (4, 4)))
    top = float((hi_n + lo_n).max())
    ax.text(cut + 4, top * 1.02, t["rec_line"].format(d=cut), color=INK_2, fontsize=10)
    risk = scored[scored["segment"] == "at_risk"]
    if not risk.empty:
        x = float(risk["recency_days"].median())
        ax.annotate(
            t["rec_note"].format(n=len(risk), m=money(risk["monetary"].sum(), lang)),
            (x, float(np.histogram(high, [x - 7, x + 8])[0][0])), xytext=(x + 40, top * 0.6),
            color=INK, fontsize=12, fontweight="bold",
            arrowprops={"arrowstyle": "-", "color": INK_2, "lw": 1},
        )
    ax.set_xlim(0, 375)
    ax.set_ylim(0, top * 1.12)
    ax.set_xticks(range(0, 361, 30))
    ax.grid(axis="x", visible=False)
    ax.set_xlabel(t["rec_x"])
    ax.set_ylabel(t["rec_y"])
    handles = [Patch(color=MONEY, label=t["rec_high"]), Patch(color=COUNT, label=t["rec_low"])]
    ax.legend(handles=handles, loc="upper center", bbox_to_anchor=(0.5, 1.13), ncols=2, handlelength=1.1)
    return fig
