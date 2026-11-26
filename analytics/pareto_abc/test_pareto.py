import pandas as pd
import pytest

import pareto


def table(revenues):
    return pd.DataFrame(
        {"product": [f"p{i}" for i in range(len(revenues))], "category": "x", "revenue": revenues}
    )


def test_product_that_crosses_the_cutoff_stays_in_a():
    # Shares 50%, 30%, 10%, 6%, 4%: cumulative before each = 0, 50, 80, 90, 96.
    ranked = pareto.classify(table([30, 50, 6, 10, 4]), a_cutoff=0.80, b_cutoff=0.95)
    assert list(ranked["revenue"]) == [50, 30, 10, 6, 4]
    assert list(ranked["abc"]) == ["A", "A", "B", "B", "C"]


def test_summary_shares_add_up():
    s = pareto.summary(pareto.classify(pareto.sample_pet_store()))
    assert s["product_share"].sum() == pytest.approx(1)
    assert s["revenue_share"].sum() == pytest.approx(1)
    assert s["profit_share"].sum() == pytest.approx(1)


def test_sample_store_follows_80_20():
    s = pareto.summary(pareto.classify(pareto.sample_pet_store()))
    assert s.loc["A", "product_share"] == pytest.approx(0.20, abs=0.02)
    assert s.loc["A", "revenue_share"] == pytest.approx(0.80, abs=0.02)


def test_validate_accepts_whole_number_margins_and_drops_bad_rows():
    raw = table(["100", "abc", "-5", "50"]).assign(margin_pct=[35, 40, 10, 0.2])
    clean = pareto.validate(raw)
    assert list(clean["revenue"]) == [100, 50]
    assert list(clean["margin_pct"]) == pytest.approx([0.35, 0.2])


def test_validate_rejects_missing_columns():
    with pytest.raises(ValueError, match="revenue"):
        pareto.validate(pd.DataFrame({"product": ["a"], "category": ["x"]}))


@pytest.mark.parametrize("a,b", [(0.9, 0.8), (0, 0.9), (0.8, 1)])
def test_classify_rejects_bad_cutoffs(a, b):
    with pytest.raises(ValueError):
        pareto.classify(table([1, 2]), a, b)

