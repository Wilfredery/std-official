"""Pareto / ABC analysis for a small business product catalog.

Pure data functions, no plotting: the blog SVG export and the client reports
both build on these, so the numbers in the post and in the app always match.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

CLASSES = ("A", "B", "C")
REQUIRED_COLUMNS = ("product", "category", "revenue")

# Fictional independent pet supply store, one location, 12 months of sales.
# (category, SKU count, popularity boost, gross margin range)
_CATALOG = (
    ("Dog food", 16, 7.0, (0.18, 0.28)),
    ("Cat food", 14, 5.5, (0.19, 0.28)),
    ("Cat litter", 6, 4.5, (0.22, 0.30)),
    ("Flea, tick & health", 10, 2.4, (0.30, 0.40)),
    ("Treats & chews", 16, 2.0, (0.44, 0.56)),
    ("Aquarium & fish", 8, 0.9, (0.36, 0.48)),
    ("Grooming", 8, 0.8, (0.40, 0.52)),
    ("Small animal & bird", 6, 0.7, (0.30, 0.42)),
    ("Beds & accessories", 18, 0.7, (0.45, 0.58)),
    ("Toys", 18, 0.55, (0.48, 0.62)),
)
SAMPLE_ANNUAL_REVENUE = 780_000


def sample_pet_store(seed: int = 7) -> pd.DataFrame:
    """Illustrative 120-SKU catalog with a realistic long-tail revenue curve."""
    rng = np.random.default_rng(seed)
    rows = []
    for category, count, boost, (lo, hi) in _CATALOG:
        for n in range(1, count + 1):
            rows.append(
                {
                    "product": f"{category} #{n}",
                    "category": category,
                    "popularity": boost * rng.lognormal(0.0, 0.55),
                    "margin_pct": round(rng.uniform(lo, hi), 3),
                }
            )
    df = pd.DataFrame(rows).sort_values("popularity", ascending=False, ignore_index=True)
    # Long-tail weights: a few staples carry the store, most SKUs sell little.
    weights = 1.0 / (np.arange(1, len(df) + 1) + 16) ** 2.7
    df["revenue"] = np.round(SAMPLE_ANNUAL_REVENUE * weights / weights.sum(), -1)
    return df.drop(columns="popularity")


def validate(df: pd.DataFrame) -> pd.DataFrame:
    """Check an uploaded table and return a clean copy (raises ValueError)."""
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Missing column(s): {', '.join(missing)}")
    out = df.copy()
    out["revenue"] = pd.to_numeric(out["revenue"], errors="coerce")
    if "margin_pct" in out.columns:
        margin = pd.Series(pd.to_numeric(out["margin_pct"], errors="coerce"), index=out.index)
        # Accept 35 or 0.35 for 35%.
        out["margin_pct"] = margin.mask(margin > 1, margin / 100)
    out = out.loc[out["revenue"].notna() & (out["revenue"] > 0)].copy()
    if out.empty:
        raise ValueError("No rows with a positive revenue value")
    return out


def classify(df: pd.DataFrame, a_cutoff: float = 0.80, b_cutoff: float = 0.95) -> pd.DataFrame:
    """Rank products by revenue and tag each one A, B or C.

    A product belongs to a class when the cumulative share *before* it is under
    that class's cutoff, so the product that crosses 80% is still an A.
    """
    if not 0 < a_cutoff < b_cutoff < 1:
        raise ValueError("Cutoffs must satisfy 0 < A < B < 1")
    out = df.sort_values("revenue", ascending=False, ignore_index=True)
    total = out["revenue"].sum()
    out["share"] = out["revenue"] / total
    out["cum_share"] = out["share"].cumsum()
    before = out["cum_share"] - out["share"]
    out["abc"] = np.select([before < a_cutoff, before < b_cutoff], ["A", "B"], "C")
    out["rank"] = np.arange(1, len(out) + 1)
    out["cum_products"] = out["rank"] / len(out)
    if "margin_pct" in out.columns:
        out["gross_profit"] = out["revenue"] * out["margin_pct"]
    return out


def summary(ranked: pd.DataFrame) -> pd.DataFrame:
    """Per-class totals: product count/share, revenue share and margin."""
    total_rev = ranked["revenue"].sum()
    agg = {"products": ("product", "count"), "revenue": ("revenue", "sum")}
    if "gross_profit" in ranked.columns:
        agg["gross_profit"] = ("gross_profit", "sum")
    out = ranked.groupby("abc").agg(**agg).reindex(list(CLASSES), fill_value=0)
    out["product_share"] = out["products"] / len(ranked)
    out["revenue_share"] = out["revenue"] / total_rev
    if "gross_profit" in out.columns:
        out["margin_pct"] = (out["gross_profit"] / out["revenue"]).fillna(0)
        out["profit_share"] = out["gross_profit"] / out["gross_profit"].sum()
    return out
