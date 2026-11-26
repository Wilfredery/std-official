import pandas as pd
import pytest

import rfm


def visits(rows):
    return pd.DataFrame(rows, columns=["client", "date", "amount"])


@pytest.fixture(scope="module")
def scored():
    return rfm.score(rfm.sample_salon(), rfm.AS_OF)


def test_every_grid_cell_has_exactly_one_segment():
    cells = {(r, fm): rfm.segment_for(r, fm) for r in range(1, 6) for fm in range(1, 6)}
    assert set(cells.values()) == set(rfm.SEGMENTS)
    assert cells[(5, 5)] == "champions"
    assert cells[(1, 5)] == "at_risk"
    assert cells[(1, 1)] == "lost"


def test_scores_are_one_to_five_and_recent_clients_score_higher(scored):
    for col in ("r", "f", "m", "fm"):
        assert scored[col].between(1, 5).all()
    by_r = scored.groupby("r")["recency_days"].max()
    assert by_r.is_monotonic_decreasing


def test_tied_frequency_shares_one_score(scored):
    assert scored.loc[scored["frequency"] == 1, "f"].nunique() == 1
    assert scored.loc[scored["frequency"] == 1, "f"].iloc[0] == 1


def test_score_aggregates_per_client():
    raw = visits([
        ("a", "2026-01-01", 50), ("a", "2026-03-01", 70),
        ("b", "2026-02-15", 200), ("c", "bad date", 10), ("c", "2026-02-01", -5),
    ])
    out = rfm.score(raw, pd.Timestamp("2026-03-31")).set_index("client")
    assert list(out.index) == ["a", "b"]
    assert out.loc["a", "frequency"] == 2
    assert out.loc["a", "monetary"] == 120
    assert out.loc["a", "recency_days"] == 30
    assert out.loc["b", "recency_days"] == 44


def test_validate_rejects_missing_columns():
    with pytest.raises(ValueError, match="amount"):
        rfm.validate(pd.DataFrame({"client": ["a"], "date": ["2026-01-01"]}))


def test_summary_shares_add_up(scored):
    s = rfm.summary(scored)
    assert s["client_share"].sum() == pytest.approx(1)
    assert s["revenue_share"].sum() == pytest.approx(1)


def test_sample_salon_story(scored):
    """The figures the blog post quotes."""
    s = rfm.summary(scored)
    assert len(scored) == 840
    assert scored["monetary"].sum() == 284_050
    assert int(s.loc["champions", "clients"]) == 237
    assert s.loc["champions", "revenue_share"] == pytest.approx(0.62, abs=0.005)
    assert int(s.loc["at_risk", "clients"]) == 82
    assert s.loc["at_risk", "revenue"] == 42_746
    assert int(s.loc["lost", "clients"]) == 255
