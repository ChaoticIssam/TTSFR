import itertools

import pytest
from app.services.scoring_engine import ScoringEngine
from app.models.cluster import ClusterCode

EXCEL_BENCHMARK_ANSWERS = {
    # 5 Profiling questions (P1 to P5)
    "p1": "Mécanique dominante",
    "p2": 2,  # 2 - Moyenne
    "p3": 1,  # 1 - Faible
    "p4": "Gestionnelle",
    "p5": "Techniques & sécurité",
    # 20 Maturity questions (0 to 4)
    "o1": 2, "o2": 2, "o3": 1, "o4": 1, "o5": 2,  # Operational: 8/20 = 40.0%
    "e1": 3, "e2": 1, "e3": 2, "e4": 3, "e5": 1,  # Economic: 10/20 = 50.0%
    "g1": 0, "g2": 1, "g3": 2, "g4": 2, "g5": 2,  # Organizational: 7/20 = 35.0%
    "t1": 2, "t2": 4, "t3": 2, "t4": 3, "t5": 1,  # Tech & Energy: 12/20 = 60.0%
}


def test_scoring_engine_exact_excel_benchmark():
    """
    Validates that the scoring engine reproduces the EXACT numbers from
    related_files/TTSFR_Diagnostic_MVP_Calcul.xlsx (Sheets: Diagnostic étape 1 & Questionnaire).
    """
    result = ScoringEngine.evaluate_diagnostic(dict(EXCEL_BENCHMARK_ANSWERS))

    # 1. Check exact dimension scores
    assert result["score_operational"] == 40.0
    assert result["score_economic"] == 50.0
    assert result["score_organizational"] == 35.0
    assert result["score_tech_energy"] == 60.0

    # 2. Check maturity levels
    assert result["level_operational"] == "Niveau 2 - En structuration"
    assert result["level_economic"] == "Niveau 3 - Avancé"
    assert result["level_organizational"] == "Niveau 2 - En structuration"
    assert result["level_tech_energy"] == "Niveau 3 - Avancé"

    # 3. Check cluster assignment
    assert result["cluster_code"] == ClusterCode.PRODUCTION_MECANISEE

    # 4. Check exact compatibility percentages from Excel
    compat = result["cluster_compatibilities"]
    assert compat[ClusterCode.PRODUCTION_MECANISEE] == 78.3
    assert compat[ClusterCode.SERVICES_ORGANISES] == 33.3
    assert compat[ClusterCode.TRANSFORMATION_LEGERE] == 30.0
    assert compat[ClusterCode.INDUSTRIEL_EXTRACTIF] == 23.3
    assert compat[ClusterCode.ARTISANAL_TRADITIONNEL] == 18.3
    assert compat[ClusterCode.SERVICES_COGNITIFS] == 11.7


def test_excel_labels_are_accepted_for_scales():
    """P2/P3 and maturity answers may be sent as the Excel labels ("2 - Moyenne")."""
    answers = dict(EXCEL_BENCHMARK_ANSWERS)
    answers["p2"] = "2 - Moyenne"
    answers["p3"] = "1 - Faible"
    answers["o1"] = "2 - Partiellement mis en place"
    result = ScoringEngine.evaluate_diagnostic(answers)
    assert result["cluster_compatibilities"][ClusterCode.PRODUCTION_MECANISEE] == 78.3
    assert result["score_operational"] == 40.0


@pytest.mark.parametrize("missing_key", ["p1", "p2", "p3", "p4", "p5", "o5", "e1", "g3", "t4"])
def test_incomplete_diagnostic_is_rejected(missing_key):
    """Excel returns blank results unless all P1-P5 and all 5 answers per dimension are filled."""
    answers = dict(EXCEL_BENCHMARK_ANSWERS)
    answers.pop(missing_key)
    with pytest.raises(ValueError) as exc:
        ScoringEngine.evaluate_diagnostic(answers)
    assert missing_key.upper() in str(exc.value)


@pytest.mark.parametrize(
    "key,value",
    [("o1", 5), ("o1", -1), ("o1", 2.5), ("p2", 4), ("p3", -1), ("p1", "Inconnu"), ("p4", "Autre"), ("p5", "")],
)
def test_out_of_range_answers_are_rejected(key, value):
    answers = dict(EXCEL_BENCHMARK_ANSWERS)
    answers[key] = value
    with pytest.raises(ValueError):
        ScoringEngine.evaluate_diagnostic(answers)


@pytest.mark.parametrize(
    "score,level",
    [(0, "Niveau 1 - Initial"), (20, "Niveau 1 - Initial"), (25, "Niveau 2 - En structuration"),
     (45, "Niveau 2 - En structuration"), (50, "Niveau 3 - Avancé"), (70, "Niveau 3 - Avancé"),
     (75, "Niveau 4 - Performant"), (100, "Niveau 4 - Performant")],
)
def test_maturity_level_thresholds(score, level):
    """Excel: <25 Initial ; <50 En structuration ; <75 Avancé ; else Performant."""
    assert ScoringEngine.get_maturity_level(score) == level


def _excel_reference(answers):
    """Literal transcription of Excel F11:F16 and C17 for cross-checking."""
    rows = []
    for code, prof in ScoringEngine.CLUSTER_PROFILES.items():
        raw = (
            35 * (answers["p1"] == prof["process"])
            + 15 * (1 - abs(answers["p2"] - prof["energy"]) / 3)
            + 20 * (1 - abs(answers["p3"] - prof["digital"]) / 3)
            + 15 * (answers["p4"] == prof["complexity"])
            + 15 * (answers["p5"] == prof["norms"])
        )
        rows.append((code, ScoringEngine._round_half_up(raw, 1)))
    best = max(score for _, score in rows)
    return dict(rows), next(code for code, score in rows if score == best)


def test_all_profile_combinations_match_excel_reference():
    """Exhaustive check over every possible P1-P5 combination (6*4*4*6*6 = 3456 cases)."""
    base = dict(EXCEL_BENCHMARK_ANSWERS)
    for p1, p2, p3, p4, p5 in itertools.product(
        ScoringEngine.PROCESS_OPTIONS, range(4), range(4),
        ScoringEngine.COMPLEXITY_OPTIONS, ScoringEngine.NORMS_OPTIONS,
    ):
        answers = {**base, "p1": p1, "p2": p2, "p3": p3, "p4": p4, "p5": p5}
        expected_compat, expected_cluster = _excel_reference(answers)
        result = ScoringEngine.evaluate_diagnostic(answers)
        assert result["cluster_compatibilities"] == expected_compat
        assert result["cluster_code"] == expected_cluster
