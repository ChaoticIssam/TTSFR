from typing import Dict, Any, Tuple
from app.models.cluster import ClusterCode

class ScoringEngine:
    """
    Deterministic scoring and clustering engine for the TTSFR diagnostic model.
    Evaluates 5 dimensions and assigns one of the 6 standardized archetypes.
    """
    RULE_VERSION = "v1.0"

    @classmethod
    def evaluate_diagnostic(cls, answers: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates scores for the 4 core dimensions and assigns a cluster.
        Returns:
            {
                "score_operational": float,
                "score_economic": float,
                "score_organizational": float,
                "score_tech_energy": float,
                "score_global": float,
                "cluster_code": str,
                "rule_version": str,
            }
        """
        step_2 = answers.get("step_2", {})  # Performance opérationnelle
        step_3 = answers.get("step_3", {})  # Performance économique
        step_4 = answers.get("step_4", {})  # Maturité organisationnelle
        step_5 = answers.get("step_5", {})  # Maturité technologique et énergétique

        # 1. Operational Score (Process, quality, safety, waste)
        score_op = cls._calculate_dimension_score(step_2, default_baseline=60.0)

        # 2. Economic Score (Sales, margins, cash flow, resilience)
        score_eco = cls._calculate_dimension_score(step_3, default_baseline=55.0)

        # 3. Organizational Score (Governance, roles, skills, tracking)
        score_org = cls._calculate_dimension_score(step_4, default_baseline=50.0)

        # 4. Tech & Energy Score (Equipment, mechanization, digital, energy efficiency)
        score_tech = cls._calculate_dimension_score(step_5, default_baseline=45.0)

        # Global Weighted Score
        score_global = round(
            (score_op * 0.30) + (score_eco * 0.25) + (score_org * 0.20) + (score_tech * 0.25),
            2
        )

        # 5. Cluster Classification Logic (Based on Section 6 & Slide 57)
        cluster_code = cls._determine_cluster(answers, score_op, score_tech, score_global)

        return {
            "score_operational": round(score_op, 2),
            "score_economic": round(score_eco, 2),
            "score_organizational": round(score_org, 2),
            "score_tech_energy": round(score_tech, 2),
            "score_global": score_global,
            "cluster_code": cluster_code,
            "rule_version": cls.RULE_VERSION,
        }

    @staticmethod
    def _calculate_dimension_score(step_answers: Dict[str, Any], default_baseline: float) -> float:
        if not step_answers:
            return default_baseline

        total_weight = 0.0
        earned_points = 0.0

        for key, val in step_answers.items():
            if isinstance(val, (int, float)):
                earned_points += min(float(val), 100.0)
                total_weight += 1.0
            elif isinstance(val, bool):
                earned_points += 100.0 if val else 0.0
                total_weight += 1.0
            elif isinstance(val, list):
                # Multiple choice scoring
                earned_points += min(len(val) * 20.0, 100.0)
                total_weight += 1.0

        if total_weight > 0:
            return min(max(earned_points / total_weight, 0.0), 100.0)
        return default_baseline

    @staticmethod
    def _determine_cluster(
        answers: Dict[str, Any],
        score_op: float,
        score_tech: float,
        score_global: float
    ) -> str:
        sector_code = answers.get("step_1", {}).get("sector_code", "")

        # 1. Services logic
        if sector_code in ["CONSEIL", "ECOMMERCE"]:
            return ClusterCode.SERVICES_COGNITIFS
        if sector_code in ["TRANSPORT", "TOURISME", "PRESTATION"]:
            return ClusterCode.SERVICES_ORGANISES

        # 2. Production & Manufacturing logic
        if score_tech >= 75.0 and score_op >= 70.0:
            return ClusterCode.INDUSTRIEL_EXTRACTIF
        elif score_tech >= 50.0:
            return ClusterCode.PRODUCTION_MECANISEE
        elif score_tech >= 30.0:
            return ClusterCode.TRANSFORMATION_LEGERE
        else:
            return ClusterCode.ARTISANAL_TRADITIONNEL
