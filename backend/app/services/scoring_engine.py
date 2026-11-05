from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any, List, Optional, Tuple
from app.models.cluster import ClusterCode

class ScoringEngine:
    """
    Deterministic scoring and clustering engine for the TTSFR diagnostic model.
    Conforms strictly to the official methodology specified in:
    - TTSFR_Diagnostic_MVP_Calcul.xlsx (Sheets: Questionnaire, Barème & profils)
    - Présentation_Project_Plateforme.pptx (Slides 1, 2, 3)
    """
    RULE_VERSION = "v1.1-odco-excel"

    CLUSTER_PROFILES: Dict[str, Dict[str, Any]] = {
        ClusterCode.SERVICES_COGNITIFS: {
            "name": "Services cognitifs et numériques",
            "process": "Informationnel / digital",
            "energy": 0,
            "digital": 3,
            "complexity": "Informationnelle",
            "norms": "Données & qualité de service",
        },
        ClusterCode.SERVICES_ORGANISES: {
            "name": "Services organisés",
            "process": "Organisationnel (non productif)",
            "energy": 0,
            "digital": 2,
            "complexity": "Gestionnelle",
            "norms": "Contractuelles / qualité",
        },
        ClusterCode.INDUSTRIEL_EXTRACTIF: {
            "name": "Industriel / extractif",
            "process": "Mécanique lourde / thermique",
            "energy": 3,
            "digital": 2,
            "complexity": "Élevée",
            "norms": "Strictes (sécurité / environnement)",
        },
        ClusterCode.PRODUCTION_MECANISEE: {
            "name": "Production mécanisée",
            "process": "Mécanique dominante",
            "energy": 2,
            "digital": 2,
            "complexity": "Structurée",
            "norms": "Techniques & sécurité",
        },
        ClusterCode.TRANSFORMATION_LEGERE: {
            "name": "Transformation légère",
            "process": "Manuel + mécanique légère",
            "energy": 1,
            "digital": 1,
            "complexity": "Moyenne",
            "norms": "ONSSA / sanitaire",
        },
        ClusterCode.ARTISANAL_TRADITIONNEL: {
            "name": "Artisanal traditionnel",
            "process": "Manuel dominant",
            "energy": 0,
            "digital": 0,
            "complexity": "Simple",
            "norms": "Faibles (hygiène basique)",
        },
    }

    MATURITY_LEVELS = [
        (25.0, "Niveau 1 - Initial"),
        (50.0, "Niveau 2 - En structuration"),
        (75.0, "Niveau 3 - Avancé"),
        (101.0, "Niveau 4 - Performant"),
    ]

    @classmethod
    def get_maturity_level(cls, score: float) -> str:
        for threshold, label in cls.MATURITY_LEVELS:
            if score < threshold:
                return label
        return "Niveau 4 - Performant"

    @classmethod
    def evaluate_diagnostic(cls, answers: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates scores for the 4 core dimensions and assigns one of the 6 clusters
        according to the exact mathematical formula in TTSFR_Diagnostic_MVP_Calcul.xlsx.

        Like the Excel model (COUNT(...) < 5 -> blank, OR(P1..P5 = "") -> blank),
        no result is produced unless every question has a valid answer:
        a ValueError listing the missing / invalid answers is raised instead.
        """
        # Flatten answers if nested by steps
        flat: Dict[str, Any] = {}
        for k, v in answers.items():
            if isinstance(v, dict):
                flat.update(v)
            else:
                flat[k] = v

        errors = cls.validate_answers(flat)
        if errors:
            raise ValueError("Diagnostic incomplet ou invalide : " + ", ".join(errors))

        # 1. Dimension Scores (O1-O5, E1-E5, G1-G5, T1-T5)
        score_op = cls._calculate_5q_score(flat, cls.DIMENSION_KEYS["operational"])
        score_eco = cls._calculate_5q_score(flat, cls.DIMENSION_KEYS["economic"])
        score_org = cls._calculate_5q_score(flat, cls.DIMENSION_KEYS["organizational"])
        score_tech = cls._calculate_5q_score(flat, cls.DIMENSION_KEYS["tech_energy"])

        # Internal aggregate only (not part of the Excel restitution).
        score_global = cls._round_half_up(
            (score_op + score_eco + score_org + score_tech) / 4.0, 2
        )

        # 2. Cluster Compatibility Evaluation (P1 to P5)
        cluster_code, compatibilities = cls._calculate_cluster_compatibilities(flat)

        return {
            "score_operational": score_op,
            "score_economic": score_eco,
            "score_organizational": score_org,
            "score_tech_energy": score_tech,
            "score_global": score_global,
            "level_operational": cls.get_maturity_level(score_op),
            "level_economic": cls.get_maturity_level(score_eco),
            "level_organizational": cls.get_maturity_level(score_org),
            "level_tech_energy": cls.get_maturity_level(score_tech),
            "level_global": cls.get_maturity_level(score_global),
            "cluster_code": cluster_code,
            "cluster_compatibilities": compatibilities,
            "rule_version": cls.RULE_VERSION,
        }

    # Answer lists of the Excel sheet "Barème & profils" (columns K, N, O)
    PROCESS_OPTIONS = [
        "Manuel dominant",
        "Manuel + mécanique légère",
        "Mécanique dominante",
        "Mécanique lourde / thermique",
        "Organisationnel (non productif)",
        "Informationnel / digital",
    ]
    COMPLEXITY_OPTIONS = ["Simple", "Moyenne", "Structurée", "Élevée", "Gestionnelle", "Informationnelle"]
    NORMS_OPTIONS = [
        "Faibles (hygiène basique)",
        "ONSSA / sanitaire",
        "Techniques & sécurité",
        "Strictes (sécurité / environnement)",
        "Contractuelles / qualité",
        "Données & qualité de service",
    ]

    DIMENSION_KEYS: Dict[str, List[str]] = {
        "operational": ["o1", "o2", "o3", "o4", "o5"],
        "economic": ["e1", "e2", "e3", "e4", "e5"],
        "organizational": ["g1", "g2", "g3", "g4", "g5"],
        "tech_energy": ["t1", "t2", "t3", "t4", "t5"],
    }

    @classmethod
    def validate_answers(cls, flat_answers: Dict[str, Any]) -> List[str]:
        """Returns the list of missing or invalid answer keys (empty list = complete)."""
        errors: List[str] = []

        allowed = {
            "p1": cls.PROCESS_OPTIONS,
            "p4": cls.COMPLEXITY_OPTIONS,
            "p5": cls.NORMS_OPTIONS,
        }
        for key, options in allowed.items():
            normalized = {cls._normalize_str(o) for o in options}
            if cls._normalize_str(flat_answers.get(key)) not in normalized:
                errors.append(key.upper())

        for key in ("p2", "p3"):
            if cls._parse_scale_0_to_3(flat_answers.get(key)) is None:
                errors.append(key.upper())

        for keys in cls.DIMENSION_KEYS.values():
            for key in keys:
                if cls._parse_maturity_answer(flat_answers.get(key)) is None:
                    errors.append(key.upper())

        return errors

    @staticmethod
    def _round_half_up(value: float, digits: int) -> float:
        """Excel ROUND() semantics (half away from zero), unlike Python's banker's rounding."""
        quant = Decimal(1).scaleb(-digits)
        return float(Decimal(repr(value)).quantize(quant, rounding=ROUND_HALF_UP))

    @staticmethod
    def _parse_maturity_answer(val: Any) -> Optional[int]:
        """A maturity answer must be an integer score from 0 to 4 (Barème H5:I9)."""
        if val is None or isinstance(val, bool):
            return None
        if isinstance(val, (int, float)):
            if float(val).is_integer() and 0 <= val <= 4:
                return int(val)
            return None
        s = str(val).strip()
        if s[:1] in {"0", "1", "2", "3", "4"} and (len(s) == 1 or not s[1].isdigit()):
            return int(s[0])
        return None

    @classmethod
    def _calculate_5q_score(cls, flat_answers: Dict[str, Any], keys: List[str]) -> float:
        """
        Excel: =AVERAGE(E15:E19)/4*100 (only when the 5 answers are present).
        """
        values = [cls._parse_maturity_answer(flat_answers.get(k)) for k in keys]
        avg = sum(v for v in values if v is not None) / len(keys)
        return cls._round_half_up((avg / 4.0) * 100.0, 2)

    @classmethod
    def _calculate_cluster_compatibilities(
        cls,
        flat_answers: Dict[str, Any],
    ) -> Tuple[str, Dict[str, float]]:
        """
        Computes compatibility score for each of the 6 clusters based on P1-P5.
        Excel Formula (F11):
        ROUND(
          35 * (P1 == ExpectedProcess)
          + 15 * (1 - ABS(P2 - ExpectedEnergy) / 3)
          + 20 * (1 - ABS(P3 - ExpectedDigital) / 3)
          + 15 * (P4 == ExpectedComplexity)
          + 15 * (P5 == ExpectedNorms),
          1
        )
        Assigned cluster (C17): INDEX(E11:E16, MATCH(MAX(F11:F16), F11:F16, 0))
        -> highest score, first cluster in table order wins a tie.
        """
        p1 = cls._normalize_str(flat_answers.get("p1"))
        p4 = cls._normalize_str(flat_answers.get("p4"))
        p5 = cls._normalize_str(flat_answers.get("p5"))
        p2_num = cls._parse_scale_0_to_3(flat_answers.get("p2"))
        p3_num = cls._parse_scale_0_to_3(flat_answers.get("p3"))

        compatibilities: Dict[str, float] = {}
        for code, profile in cls.CLUSTER_PROFILES.items():
            process_match = 1.0 if p1 == cls._normalize_str(profile["process"]) else 0.0
            complexity_match = 1.0 if p4 == cls._normalize_str(profile["complexity"]) else 0.0
            norms_match = 1.0 if p5 == cls._normalize_str(profile["norms"]) else 0.0

            energy_score = 15.0 * (1.0 - abs(p2_num - profile["energy"]) / 3.0)
            digital_score = 20.0 * (1.0 - abs(p3_num - profile["digital"]) / 3.0)

            total = cls._round_half_up(
                (35.0 * process_match)
                + energy_score
                + digital_score
                + (15.0 * complexity_match)
                + (15.0 * norms_match),
                1,
            )
            compatibilities[code] = total

        # Pick cluster with highest compatibility (first in Excel order on ties)
        best_score = max(compatibilities.values())
        best_cluster = next(code for code, score in compatibilities.items() if score == best_score)
        return best_cluster, compatibilities

    @staticmethod
    def _parse_scale_0_to_3(val: Any) -> Optional[float]:
        if val is None or isinstance(val, bool):
            return None
        if isinstance(val, (int, float)):
            if float(val).is_integer() and 0 <= val <= 3:
                return float(val)
            return None
        s = str(val).strip()
        if s[:1] in {"0", "1", "2", "3"} and (len(s) == 1 or not s[1].isdigit()):
            return float(s[0])
        return None

    @staticmethod
    def _normalize_str(val: Any) -> str:
        if val is None:
            return ""
        return " ".join(str(val).split()).lower()
