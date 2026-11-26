"""RFM analysis (recency, frequency, monetary) for a small business client list.

Pure data functions, no plotting: the blog SVG export builds on these, so the
numbers in the post always match the code.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = ("client", "date", "amount")

# Segments on the recency score (R) and the combined frequency + spend score (FM).
# Every (R, FM) cell from 1 to 5 belongs to exactly one segment, so the grid
# chart can draw them as rectangles. Order = how the post presents them.
SEGMENTS = ("champions", "promising", "attention", "at_risk", "lost")


def segment_for(r: int, fm: int) -> str:
    if r >= 4:
        return "champions" if fm >= 4 else "promising"
    if r == 3:
        return "attention"
    return "at_risk" if fm >= 3 else "lost"


# Fictional independent hair salon, one location, 12 months of appointments.
# (archetype, clients, visit gap in days, ticket range, days since last visit)
AS_OF = pd.Timestamp("2026-10-31")
_ARCHETYPES = (
    ("regular", 150, (35, 60), (95, 185), (0, 45)),
    ("occasional", 240, (80, 130), (45, 95), (0, 120)),
    ("new", 110, None, (50, 120), (0, 75)),
    ("lapsing", 85, (40, 75), (90, 175), (110, 220)),
    ("one_time", 255, None, (40, 90), (120, 365)),
)


def sample_salon(seed: int = 11) -> pd.DataFrame:
    """Illustrative appointment history: one row per paid visit."""
    rng = np.random.default_rng(seed)
    rows = []
    client = 0
    for kind, count, gap, (lo, hi), (last_lo, last_hi) in _ARCHETYPES:
        for _ in range(count):
            client += 1
            ticket = rng.uniform(lo, hi)
            last = int(rng.integers(last_lo, last_hi + 1))
            if kind == "new":
                # First visit in the last quarter, maybe a second one since.
                ages = [last] + ([int(rng.integers(0, last))] if last > 30 and rng.random() < 0.35 else [])
            elif kind == "one_time":
                ages = [last]
            else:
                assert gap is not None
                ages, age = [], last
                while age <= 364:
                    ages.append(age)
                    age += int(rng.integers(gap[0], gap[1] + 1))
            for age in ages:
                rows.append(
                    {
                        "client": f"C{client:04d}",
                        "date": AS_OF - pd.Timedelta(days=age),
                        "amount": round(ticket * rng.uniform(0.85, 1.15)),
                    }
                )
    return pd.DataFrame(rows).sort_values("date", ignore_index=True)


def validate(df: pd.DataFrame) -> pd.DataFrame:
    """Check a visits table and return a clean copy (raises ValueError)."""
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Missing column(s): {', '.join(missing)}")
    out = df.copy()
    out["date"] = pd.to_datetime(out["date"], errors="coerce")
    out["amount"] = pd.to_numeric(out["amount"], errors="coerce")
    out = out.loc[out["date"].notna() & out["amount"].notna() & (out["amount"] > 0)]
    if out.empty:
        raise ValueError("No rows with a valid date and a positive amount")
    return out


def _quintile(values: pd.Series) -> pd.Series:
    """Score 1-5 by position in the ranking (quintiles).

    Tied values share the score of the first position they occupy, so every
    client who came once gets the same F score even when they are 40% of the list.
    """
    first = values.rank(method="min")
    return (np.floor(5 * (first - 1) / len(values)) + 1).astype(int)


def score(visits: pd.DataFrame, as_of: pd.Timestamp | None = None) -> pd.DataFrame:
    """One row per client with recency, frequency, monetary, scores and segment."""
    visits = validate(visits)
    as_of = as_of if as_of is not None else pd.Timestamp(visits["date"].max())
    out: pd.DataFrame = visits.groupby("client").agg(
        last_visit=("date", "max"), frequency=("date", "size"), monetary=("amount", "sum")
    )
    out["recency_days"] = (as_of - out["last_visit"]).dt.days
    out["r"] = _quintile(-out["recency_days"])  # fewer days = better
    out["f"] = _quintile(out["frequency"])
    out["m"] = _quintile(out["monetary"])
    out["fm"] = np.floor((out["f"] + out["m"]) / 2 + 0.5).astype(int)  # round half up
    out["segment"] = [segment_for(r, fm) for r, fm in zip(out["r"], out["fm"])]
    return out.reset_index()


def summary(scored: pd.DataFrame) -> pd.DataFrame:
    """Per segment: clients, shares, revenue, average spend, visits and recency."""
    g = scored.groupby("segment").agg(
        clients=("client", "size"),
        revenue=("monetary", "sum"),
        visits=("frequency", "sum"),
        avg_spend=("monetary", "mean"),
        avg_visits=("frequency", "mean"),
        avg_recency=("recency_days", "mean"),
    )
    g = g.reindex(SEGMENTS).fillna(0)
    g["client_share"] = g["clients"] / g["clients"].sum()
    g["revenue_share"] = g["revenue"] / g["revenue"].sum()
    return g


def recency_ranges(scored: pd.DataFrame) -> pd.DataFrame:
    """Days since last visit covered by each R score (for the post's table)."""
    return scored.groupby("r")["recency_days"].agg(["min", "max", "size"]).sort_index(ascending=False)
