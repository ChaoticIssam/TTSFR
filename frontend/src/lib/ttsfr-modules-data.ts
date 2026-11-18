// Auto-generated from official TTSFR Excel specification
// Contains the 7 thematic modules (M01-M07), 4 activation logics (A1-A4),
// 99 deliverables (L001-L099), and 18 impact indicators (KPI, KVI, KWI).

export interface TtsfrThematicModule {
  id: string;
  name: string;
  objective: string;
  perimeter: string;
  displayLabel: string;
  note?: string;
}

export interface TtsfrActivationLogic {
  id: string;
  classification: string;
  logic: string;
  objective: string;
  examples: string;
  badge: string;
  rule: string;
}

export interface TtsfrDeliverable {
  id: string;
  moduleId: string;
  family: "Descriptif" | "Normatif" | "Opérationnel" | "Stratégique" | string;
  title: string;
  activations: string[];
  sectorScope: string;
  techScope: string;
  maturityScope: string;
  question: string;
  resourceFormat: string;
  expectedProof: string;
}

export interface TtsfrImpactIndicator {
  id: string;
  type: "KPI" | "KVI" | "KWI";
  name: string;
  objective: string;
  method: string;
  target: string;
  frequency: string;
}

export type ChecklistAnswer =
  | ""
  | "Non"
  | "Partiellement"
  | "Oui sans preuve"
  | "Oui avec preuve"
  | "Non applicable";

export interface ChecklistItemEntry {
  answer: ChecklistAnswer;
  proof?: string;
  responsible?: string;
  deadline?: string;
}

export interface ImpactIndicatorEntry {
  initialValue?: string;
  currentValue?: string;
  gain?: string;
}

export const CHECKLIST_ANSWER_RULES: Record<
  Exclude<ChecklistAnswer, "">,
  { status: string; action: string; resourceState: string; tone: "amber" | "blue" | "emerald" | "slate" | "rose" }
> = {
  Non: {
    status: "À mettre en place",
    action: "Mettre en place le livrable",
    resourceState: "Ressource TTSFR proposée",
    tone: "rose",
  },
  Partiellement: {
    status: "À compléter",
    action: "Compléter le livrable",
    resourceState: "Ressource TTSFR proposée",
    tone: "amber",
  },
  "Oui sans preuve": {
    status: "À vérifier",
    action: "Demander une preuve",
    resourceState: "Ressource consultable",
    tone: "blue",
  },
  "Oui avec preuve": {
    status: "Validé",
    action: "Conserver la preuve",
    resourceState: "Ressource consultable",
    tone: "emerald",
  },
  "Non applicable": {
    status: "Exclu",
    action: "Aucune action",
    resourceState: "Masquée",
    tone: "slate",
  },
};

export const ACTIVATION_BADGES: Record<string, { label: string; colorClass: string }> = {
  A1: {
    label: "Socle transversal",
    colorClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  A2: {
    label: "Spécifique à votre secteur",
    colorClass: "bg-emerald-50 text-[#0F4C3A] border-emerald-200",
  },
  A3: {
    label: "Adapté à votre technologie",
    colorClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  A4: {
    label: "Recommandé pour votre niveau de maturité",
    colorClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

export function getMaturityTierFromScore(score: number): "N1" | "N2" | "N3" | "N4" {
  if (score < 25) return "N1";
  if (score < 50) return "N2";
  if (score < 75) return "N3";
  return "N4";
}

export function computeModuleGlobalStatus(
  deliverables: TtsfrDeliverable[],
  entries: Record<string, ChecklistItemEntry>
): { label: string; tone: "rose" | "amber" | "emerald" | "slate" | "blue" } {
  if (deliverables.length === 0) {
    return { label: "Non applicable", tone: "slate" };
  }
  const answers = deliverables.map((d) => entries[d.id]?.answer || "");
  const activeAnswers = answers.filter((a) => a !== "Non applicable");
  if (activeAnswers.length === 0) {
    return { label: "Non applicable", tone: "slate" };
  }
  if (activeAnswers.some((a) => a === "Non")) {
    return { label: "Prioritaire", tone: "rose" };
  }
  if (activeAnswers.some((a) => a === "Partiellement" || a === "Oui sans preuve")) {
    return { label: "À consolider", tone: "amber" };
  }
  if (activeAnswers.every((a) => a === "Oui avec preuve")) {
    return { label: "Satisfait", tone: "emerald" };
  }
  return { label: "À compléter", tone: "blue" };
}

export const TTSFR_MODULES: TtsfrThematicModule[] = [
  {
    "id": "M01",
    "name": "Diagnostic",
    "objective": "Évaluer la situation initiale, les besoins et le profil de la coopérative",
    "perimeter": "Diagnostic et évaluation des besoins",
    "displayLabel": "Module 01 — Diagnostic",
    "note": "deja fait"
  },
  {
    "id": "M02",
    "name": "Mise à niveau technique",
    "objective": "Modéliser et améliorer les flux, outils, technologie et organisation",
    "perimeter": "Flux, équipements, Lean, procédures, maintenance et investissements",
    "displayLabel": "Module 02 — Mise à niveau technique",
    "note": ""
  },
  {
    "id": "M03",
    "name": "Certification et conformité (QHSE)",
    "objective": "Préparer la conformité normative et la certification",
    "perimeter": "Qualité, traçabilité, hygiène, sécurité, ergonomie et certification",
    "displayLabel": "Module 03 — Certification et conformité (QHSE)",
    "note": ""
  },
  {
    "id": "M04",
    "name": "Durabilité et économie circulaire",
    "objective": "Réduire les impacts et développer des pratiques circulaires",
    "perimeter": "Énergie, déchets, matières, emballage et valorisation",
    "displayLabel": "Module 04 — Durabilité et économie circulaire",
    "note": ""
  },
  {
    "id": "M05",
    "name": "Digitalisation et visibilité",
    "objective": "Développer les canaux commerciaux et la visibilité numérique",
    "perimeter": "Site, réseaux sociaux, identité visuelle, e-commerce et mesure digitale",
    "displayLabel": "Module 05 — Digitalisation et visibilité",
    "note": ""
  },
  {
    "id": "M06",
    "name": "Formation et capability building",
    "objective": "Développer les compétences et l'autonomie",
    "perimeter": "Diagnostic des compétences, parcours, supports et évaluation",
    "displayLabel": "Module 06 — Formation et capability building",
    "note": ""
  },
  {
    "id": "M07",
    "name": "Suivi et étude d'impact",
    "objective": "Piloter les résultats et l'impact du modèle",
    "perimeter": "Tracker KPI, KVI et KWI, situation initiale, cible et gain",
    "displayLabel": "Module 07 — Suivi et étude d'impact",
    "note": ""
  }
];

export const TTSFR_ACTIVATIONS: TtsfrActivationLogic[] = [
  {
    "id": "A1",
    "classification": "Modules transversaux",
    "logic": "Indépendants du secteur",
    "objective": "Renforcer les fondamentaux organisationnels et opérationnels",
    "examples": "Analyse des dysfonctionnements, rôles, gaspillage, organisation documentaire",
    "badge": "Socle transversal",
    "rule": "Toujours visible"
  },
  {
    "id": "A2",
    "classification": "Modules sectoriels spécifiques",
    "logic": "Dépendent du secteur et sous-secteur ODCO",
    "objective": "Adapter aux contraintes techniques et réglementaires",
    "examples": "Artisanat : modèles, designs, foires. Alimentaire : HACCP, ONSSA, traçabilité, étiquetage",
    "badge": "Spécifique à votre secteur",
    "rule": "Afficher si secteur/sous-secteur correspond"
  },
  {
    "id": "A3",
    "classification": "Modules technologiques spécifiques",
    "logic": "Dépendent de la typologie : manuel, mécanique, thermique ou mixte",
    "objective": "Optimiser l'efficience selon le process",
    "examples": "Manuel : ergonomie. Mécanique : maintenance. Thermique/industriel : énergie et sécurité",
    "badge": "Adapté à votre technologie",
    "rule": "Afficher si typologie technologique correspond"
  },
  {
    "id": "A4",
    "classification": "Modules par niveau de maturité",
    "logic": "Basés sur les scores de maturité et le cluster",
    "objective": "Assurer une progression stratégique adaptée",
    "examples": "N1 formalisation. N2 standardisation. N3 tableaux de bord. N4 ERP et stratégie export",
    "badge": "Recommandé pour votre niveau de maturité",
    "rule": "Afficher selon score et cluster"
  }
];

export const TTSFR_DELIVERABLES: TtsfrDeliverable[] = [
  {
    "id": "L001",
    "moduleId": "M01",
    "family": "Descriptif",
    "title": "Rapport de diagnostic initial",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Rapport de diagnostic initial ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L002",
    "moduleId": "M01",
    "family": "Descriptif",
    "title": "Évaluation des besoins priorisés",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Évaluation des besoins priorisés ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L003",
    "moduleId": "M01",
    "family": "Descriptif",
    "title": "Profil secteur, sous-secteur, cluster et maturité",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Profil secteur, sous-secteur, cluster et maturité ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L004",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Cartographie des processus actuels",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Cartographie des processus actuels ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L005",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Cartographie standardisée BPMN",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Cartographie standardisée BPMN ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L006",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Fiches d'inventaire des équipements",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches d'inventaire des équipements ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L007",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Grille de conformité et d'obsolescence des équipements",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Grille de conformité et d'obsolescence des équipements ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L008",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Analyse des dysfonctionnements, NVA et gaspillages",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Analyse des dysfonctionnements, NVA et gaspillages ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L009",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Organigramme fonctionnel",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Organigramme fonctionnel ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L010",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "Matrice des responsabilités",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Matrice des responsabilités ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L011",
    "moduleId": "M02",
    "family": "Descriptif",
    "title": "État des lieux des indicateurs existants",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : État des lieux des indicateurs existants ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L012",
    "moduleId": "M02",
    "family": "Normatif",
    "title": "Fiches de bonnes pratiques Lean 5S et Kaizen",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches de bonnes pratiques Lean 5S et Kaizen ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L013",
    "moduleId": "M02",
    "family": "Normatif",
    "title": "Procédures standardisées de réception, production, stockage et expédition",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Procédures standardisées de réception, production, stockage et expédition ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L014",
    "moduleId": "M02",
    "family": "Normatif",
    "title": "Manuel qualité ou manuel de procédures techniques",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Manuel qualité ou manuel de procédures techniques ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L015",
    "moduleId": "M02",
    "family": "Normatif",
    "title": "Référentiel des fonctions et fiches de poste",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Référentiel des fonctions et fiches de poste ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L016",
    "moduleId": "M02",
    "family": "Normatif",
    "title": "Guide d'utilisation des équipements",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Guide d'utilisation des équipements ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L017",
    "moduleId": "M02",
    "family": "Normatif",
    "title": "Règles d'affectation des responsabilités organisationnelles",
    "activations": [
      "A1",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Règles d'affectation des responsabilités organisationnelles ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L018",
    "moduleId": "M02",
    "family": "Opérationnel",
    "title": "Tableau de bord automatisé KPI, KVI et KWI",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Tableau de bord automatisé KPI, KVI et KWI ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L019",
    "moduleId": "M02",
    "family": "Opérationnel",
    "title": "Tracker de performance",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Tracker de performance ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L020",
    "moduleId": "M02",
    "family": "Opérationnel",
    "title": "Guide d'utilisation des outils de gestion",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Guide d'utilisation des outils de gestion ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L021",
    "moduleId": "M02",
    "family": "Opérationnel",
    "title": "Fiches de maintenance par équipement",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches de maintenance par équipement ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L022",
    "moduleId": "M02",
    "family": "Opérationnel",
    "title": "Cahier des charges équipement incluant mise en service et formation",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Cahier des charges équipement incluant mise en service et formation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L023",
    "moduleId": "M02",
    "family": "Opérationnel",
    "title": "Outil de pilotage organisationnel",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Outil de pilotage organisationnel ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L024",
    "moduleId": "M02",
    "family": "Stratégique",
    "title": "Fiche de priorisation des investissements",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiche de priorisation des investissements ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L025",
    "moduleId": "M02",
    "family": "Stratégique",
    "title": "Catalogue technologique comparatif",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Catalogue technologique comparatif ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L026",
    "moduleId": "M02",
    "family": "Stratégique",
    "title": "Plan de mise en conformité technique ou technologique",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan de mise en conformité technique ou technologique ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L027",
    "moduleId": "M02",
    "family": "Stratégique",
    "title": "Recommandations issues du diagnostic croisé processus, équipements et organisation",
    "activations": [
      "A3",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Selon typologie",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Recommandations issues du diagnostic croisé processus, équipements et organisation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L028",
    "moduleId": "M03",
    "family": "Descriptif",
    "title": "Rapport de diagnostic qualité initial",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Rapport de diagnostic qualité initial ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L029",
    "moduleId": "M03",
    "family": "Descriptif",
    "title": "Grille d'évaluation des écarts réglementaires ou référentiels visés",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Grille d'évaluation des écarts réglementaires ou référentiels visés ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L030",
    "moduleId": "M03",
    "family": "Descriptif",
    "title": "Document unique d'évaluation des risques professionnels",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Document unique d'évaluation des risques professionnels ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L031",
    "moduleId": "M03",
    "family": "Descriptif",
    "title": "Fiches de signalement des risques",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches de signalement des risques ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L032",
    "moduleId": "M03",
    "family": "Descriptif",
    "title": "Fiches d'analyse ergonomique des postes de travail",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches d'analyse ergonomique des postes de travail ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L033",
    "moduleId": "M03",
    "family": "Normatif",
    "title": "Manuel qualité",
    "activations": [
      "A2"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Manuel qualité ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L034",
    "moduleId": "M03",
    "family": "Normatif",
    "title": "Procédures documentées de traçabilité, hygiène, contrôle qualité, réception et expédition",
    "activations": [
      "A2"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Procédures documentées de traçabilité, hygiène, contrôle qualité, réception et expédition ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L035",
    "moduleId": "M03",
    "family": "Normatif",
    "title": "Référentiel interne de conformité HACCP, ISO ou ONSSA",
    "activations": [
      "A2"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Référentiel interne de conformité HACCP, ISO ou ONSSA ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L036",
    "moduleId": "M03",
    "family": "Normatif",
    "title": "Affichages réglementaires obligatoires",
    "activations": [
      "A2"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Affichages réglementaires obligatoires ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L037",
    "moduleId": "M03",
    "family": "Normatif",
    "title": "Guide de bonnes pratiques ergonomiques",
    "activations": [
      "A2"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Guide de bonnes pratiques ergonomiques ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L038",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Dossier de certification avec justificatifs et preuves d'application",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Dossier de certification avec justificatifs et preuves d'application ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L039",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Fiches de suivi qualité : non-conformité, réclamations et conformité des lots",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches de suivi qualité : non-conformité, réclamations et conformité des lots ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L040",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Registre de contrôle qualité",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Registre de contrôle qualité ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L041",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Fiche d'auto-évaluation pour audit à blanc",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiche d'auto-évaluation pour audit à blanc ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L042",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Procédures internes HSE et gestion des EPI",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Procédures internes HSE et gestion des EPI ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L043",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Fiches de formation HSE",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches de formation HSE ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L044",
    "moduleId": "M03",
    "family": "Opérationnel",
    "title": "Plan d'aménagement des postes",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Selon poste",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan d'aménagement des postes ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L045",
    "moduleId": "M03",
    "family": "Stratégique",
    "title": "Plan de mise en conformité et préparation à la certification",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan de mise en conformité et préparation à la certification ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L046",
    "moduleId": "M03",
    "family": "Stratégique",
    "title": "Analyse coût-bénéfice de la certification ciblée",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Analyse coût-bénéfice de la certification ciblée ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L047",
    "moduleId": "M03",
    "family": "Stratégique",
    "title": "Politique HSE de la coopérative",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Politique HSE de la coopérative ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L048",
    "moduleId": "M03",
    "family": "Stratégique",
    "title": "Priorisation des investissements en sécurité",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Priorisation des investissements en sécurité ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L049",
    "moduleId": "M03",
    "family": "Stratégique",
    "title": "Plan de prévention des troubles musculosquelettiques",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon secteur",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan de prévention des troubles musculosquelettiques ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L050",
    "moduleId": "M04",
    "family": "Descriptif",
    "title": "Bilan carbone simplifié",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Bilan carbone simplifié ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L051",
    "moduleId": "M04",
    "family": "Descriptif",
    "title": "Audit énergétique des équipements et procédés",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Audit énergétique des équipements et procédés ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L052",
    "moduleId": "M04",
    "family": "Descriptif",
    "title": "Diagnostic des déchets et rejets",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Diagnostic des déchets et rejets ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L053",
    "moduleId": "M04",
    "family": "Descriptif",
    "title": "Inventaire des pratiques de recyclage ou réutilisation",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Inventaire des pratiques de recyclage ou réutilisation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L054",
    "moduleId": "M04",
    "family": "Descriptif",
    "title": "Analyse des flux matière et sources d'approvisionnement",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Analyse des flux matière et sources d'approvisionnement ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L055",
    "moduleId": "M04",
    "family": "Normatif",
    "title": "Référentiel interne d'économie circulaire",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Référentiel interne d'économie circulaire ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L056",
    "moduleId": "M04",
    "family": "Normatif",
    "title": "Charte écoresponsable de la coopérative",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Charte écoresponsable de la coopérative ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L057",
    "moduleId": "M04",
    "family": "Normatif",
    "title": "Grille d'éligibilité aux labels verts",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Grille d'éligibilité aux labels verts ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L058",
    "moduleId": "M04",
    "family": "Normatif",
    "title": "Standards d'emballage durable",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Standards d'emballage durable ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L059",
    "moduleId": "M04",
    "family": "Opérationnel",
    "title": "Prototype d'emballage durable",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Prototype d'emballage durable ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L060",
    "moduleId": "M04",
    "family": "Opérationnel",
    "title": "Fiches de recyclage ou d'upcycling",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches de recyclage ou d'upcycling ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L061",
    "moduleId": "M04",
    "family": "Opérationnel",
    "title": "Fiches d'action terrain pour les gestes écoresponsables",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches d'action terrain pour les gestes écoresponsables ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L062",
    "moduleId": "M04",
    "family": "Opérationnel",
    "title": "Outil de suivi des pratiques durables",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Outil de suivi des pratiques durables ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L063",
    "moduleId": "M04",
    "family": "Opérationnel",
    "title": "Kit d'affichage et de sensibilisation",
    "activations": [
      "A2",
      "A3"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Selon process",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Kit d'affichage et de sensibilisation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L064",
    "moduleId": "M04",
    "family": "Stratégique",
    "title": "Plan d'action durabilité à 1-3 ans",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan d'action durabilité à 1-3 ans ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L065",
    "moduleId": "M04",
    "family": "Stratégique",
    "title": "Analyse coût-bénéfice environnemental des solutions",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Analyse coût-bénéfice environnemental des solutions ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L066",
    "moduleId": "M04",
    "family": "Stratégique",
    "title": "Étude de faisabilité d'un bouclage local ou circuit court",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Étude de faisabilité d'un bouclage local ou circuit court ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L067",
    "moduleId": "M04",
    "family": "Stratégique",
    "title": "Scénarios de transition vers une économie circulaire",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon activité",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Scénarios de transition vers une économie circulaire ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L068",
    "moduleId": "M05",
    "family": "Descriptif",
    "title": "Étude de faisabilité commerciale digitale",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Numérique",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Étude de faisabilité commerciale digitale ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L069",
    "moduleId": "M05",
    "family": "Descriptif",
    "title": "État des lieux du site web et des réseaux sociaux",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Numérique",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : État des lieux du site web et des réseaux sociaux ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L070",
    "moduleId": "M05",
    "family": "Normatif",
    "title": "Guide d'utilisation des canaux digitaux",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Numérique",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Guide d'utilisation des canaux digitaux ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L071",
    "moduleId": "M05",
    "family": "Normatif",
    "title": "Charte graphique pour réseaux sociaux, visuels et site",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Numérique",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Charte graphique pour réseaux sociaux, visuels et site ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L072",
    "moduleId": "M05",
    "family": "Normatif",
    "title": "Modèle standard de fiche produit pour marketplace ou e-commerce",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Numérique",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Modèle standard de fiche produit pour marketplace ou e-commerce ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L073",
    "moduleId": "M05",
    "family": "Opérationnel",
    "title": "Création ou refonte du site web",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Création ou refonte du site web ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L074",
    "moduleId": "M05",
    "family": "Opérationnel",
    "title": "Pages sociales actives avec calendrier éditorial",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Pages sociales actives avec calendrier éditorial ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L075",
    "moduleId": "M05",
    "family": "Opérationnel",
    "title": "Kit média : photos professionnelles et vidéos",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Kit média : photos professionnelles et vidéos ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L076",
    "moduleId": "M05",
    "family": "Opérationnel",
    "title": "Présentoirs physiques pour exposition produit",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Présentoirs physiques pour exposition produit ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L077",
    "moduleId": "M05",
    "family": "Stratégique",
    "title": "Plan de communication digitale",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan de communication digitale ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L078",
    "moduleId": "M05",
    "family": "Stratégique",
    "title": "Tableau de statistiques de performance digitale",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Tableau de statistiques de performance digitale ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L079",
    "moduleId": "M05",
    "family": "Stratégique",
    "title": "Étude de faisabilité pour intégration à une marketplace",
    "activations": [
      "A2",
      "A4"
    ],
    "sectorScope": "Selon marché",
    "techScope": "Numérique",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Étude de faisabilité pour intégration à une marketplace ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L080",
    "moduleId": "M06",
    "family": "Descriptif",
    "title": "Diagnostic des compétences disponibles et manquantes",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Diagnostic des compétences disponibles et manquantes ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L081",
    "moduleId": "M06",
    "family": "Descriptif",
    "title": "Cartographie des compétences clés par domaine",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Cartographie des compétences clés par domaine ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L082",
    "moduleId": "M06",
    "family": "Descriptif",
    "title": "Grille d'auto-évaluation des connaissances",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Grille d'auto-évaluation des connaissances ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L083",
    "moduleId": "M06",
    "family": "Descriptif",
    "title": "Bilan des formations passées ou informelles",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Bilan des formations passées ou informelles ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L084",
    "moduleId": "M06",
    "family": "Normatif",
    "title": "Référentiel de compétences métiers",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Référentiel de compétences métiers ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L085",
    "moduleId": "M06",
    "family": "Normatif",
    "title": "Plans de formation types par profil ou poste",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plans de formation types par profil ou poste ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L086",
    "moduleId": "M06",
    "family": "Normatif",
    "title": "Grilles d'évaluation des acquis post-formation",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Grilles d'évaluation des acquis post-formation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L087",
    "moduleId": "M06",
    "family": "Normatif",
    "title": "Supports pédagogiques standards",
    "activations": [
      "A1",
      "A2"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Supports pédagogiques standards ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L088",
    "moduleId": "M06",
    "family": "Opérationnel",
    "title": "Programme de formation personnalisé",
    "activations": [
      "A1",
      "A2",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Programme de formation personnalisé ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L089",
    "moduleId": "M06",
    "family": "Opérationnel",
    "title": "Fiches atelier design thinking, prototypage ou amélioration continue",
    "activations": [
      "A1",
      "A2",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiches atelier design thinking, prototypage ou amélioration continue ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L090",
    "moduleId": "M06",
    "family": "Opérationnel",
    "title": "Attestations ou certificats de participation",
    "activations": [
      "A1",
      "A2",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Attestations ou certificats de participation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L091",
    "moduleId": "M06",
    "family": "Opérationnel",
    "title": "Accès encadré à des laboratoires ou dispositifs de test",
    "activations": [
      "A1",
      "A2",
      "A3"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Accès encadré à des laboratoires ou dispositifs de test ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L092",
    "moduleId": "M06",
    "family": "Stratégique",
    "title": "Plan de développement des compétences à 1-3 ans",
    "activations": [
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan de développement des compétences à 1-3 ans ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L093",
    "moduleId": "M06",
    "family": "Stratégique",
    "title": "Rapport d'impact des actions de formation",
    "activations": [
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Rapport d'impact des actions de formation ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L094",
    "moduleId": "M07",
    "family": "Opérationnel",
    "title": "Tracker de suivi KPI, KVI et KWI",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Tracker de suivi KPI, KVI et KWI ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L095",
    "moduleId": "M07",
    "family": "Opérationnel",
    "title": "Fiche de situation initiale, cible, valeur actuelle et gain",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Fiche de situation initiale, cible, valeur actuelle et gain ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L096",
    "moduleId": "M07",
    "family": "Opérationnel",
    "title": "Tableau de suivi des actions et responsables",
    "activations": [
      "A1",
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N1-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Tableau de suivi des actions et responsables ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L097",
    "moduleId": "M07",
    "family": "Stratégique",
    "title": "Rapport d'étude d'impact",
    "activations": [
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Rapport d'étude d'impact ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L098",
    "moduleId": "M07",
    "family": "Stratégique",
    "title": "Évaluation de la perception des coopérateurs",
    "activations": [
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Évaluation de la perception des coopérateurs ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  },
  {
    "id": "L099",
    "moduleId": "M07",
    "family": "Stratégique",
    "title": "Plan de pérennisation des indicateurs",
    "activations": [
      "A4"
    ],
    "sectorScope": "Tous",
    "techScope": "Tous",
    "maturityScope": "N2-N4",
    "question": "La coopérative dispose-t-elle du livrable suivant, à jour et appliqué : Plan de pérennisation des indicateurs ?",
    "resourceFormat": "PDF / Excel / Word / lien",
    "expectedProof": "Document, fichier, photo ou lien"
  }
];

export const TTSFR_IMPACT_INDICATORS: TtsfrImpactIndicator[] = [
  {
    "id": "IND_01",
    "type": "KPI",
    "name": "Taux de réduction des coûts de production (%)",
    "objective": "Mesurer l'efficience économique",
    "method": "((Coût avant - Coût après) / Coût avant) × 100",
    "target": "Augmentation de 5 à 10 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_02",
    "type": "KPI",
    "name": "Productivité du travail (unité/min)",
    "objective": "Mesurer les gains opérationnels",
    "method": "Nombre d'unités produites / minute",
    "target": "Augmentation ≥ 30 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_03",
    "type": "KPI",
    "name": "Taux de non-conformité (%)",
    "objective": "Mesurer qualité et conformité",
    "method": "Produits non conformes / produits contrôlés × 100",
    "target": "Réduction jusqu'à < 3 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_04",
    "type": "KPI",
    "name": "Taux d'utilisation des équipements (%)",
    "objective": "Mesurer l'appropriation des équipements",
    "method": "Temps réel / temps disponible théorique × 100",
    "target": "70 à 85 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_05",
    "type": "KPI",
    "name": "Nombre de pannes machine / mois",
    "objective": "Suivre la fiabilité",
    "method": "Nombre de pannes enregistrées / mois",
    "target": "≤ 2",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_06",
    "type": "KPI",
    "name": "Consommation énergétique mensuelle (kWh/mois)",
    "objective": "Mesurer l'efficience énergétique",
    "method": "kWh consommés / mois",
    "target": "Réduction progressive",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_07",
    "type": "KPI",
    "name": "Taux d'évolution du chiffre d'affaires (%)",
    "objective": "Mesurer la performance économique",
    "method": "((CA n - CA n-1) / CA n-1) × 100",
    "target": "Augmentation de 5 à 10 % / an",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_08",
    "type": "KVI",
    "name": "Évolution du revenu moyen annuel des membres (%)",
    "objective": "Mesurer l'impact économique direct",
    "method": "((Revenu n - Revenu n-1) / Revenu n-1) × 100",
    "target": "Augmentation de 10 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_09",
    "type": "KVI",
    "name": "Nombre d'emplois créés ou maintenus",
    "objective": "Mesurer l'impact socio-économique",
    "method": "Emplois n - emplois n-1",
    "target": "Maintien + création nette positive",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_10",
    "type": "KVI",
    "name": "Nombre de nouveaux produits ou activités",
    "objective": "Mesurer innovation et résilience",
    "method": "Nombre de nouveaux produits ou activités",
    "target": "1 à 4 innovations",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_11",
    "type": "KVI",
    "name": "Nouveaux marchés ou canaux accessibles",
    "objective": "Mesurer l'ouverture commerciale",
    "method": "Nombre de nouveaux circuits commerciaux",
    "target": "Minimum 1 nouveau canal",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_12",
    "type": "KVI",
    "name": "Taux d'utilisation de matières premières locales (%)",
    "objective": "Mesurer l'ancrage territorial",
    "method": "Matières locales / matières totales × 100",
    "target": "≥ 30 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_13",
    "type": "KVI",
    "name": "Taux de valorisation des déchets (%)",
    "objective": "Mesurer la valeur circulaire",
    "method": "Déchets valorisés / déchets totaux × 100",
    "target": "Augmentation ≥ 60 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_14",
    "type": "KWI",
    "name": "Réduction de la pénibilité du travail (%)",
    "objective": "Améliorer les conditions de travail",
    "method": "Évolution de la grille ergonomique",
    "target": "-50 % de postures à risque",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_15",
    "type": "KWI",
    "name": "Autonomie décisionnelle des acteurs locaux (%)",
    "objective": "Mesurer autonomie et capacités",
    "method": "Femmes formées / femmes totales × 100",
    "target": "80 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_16",
    "type": "KWI",
    "name": "Engagement des membres (%)",
    "objective": "Évaluer le climat organisationnel",
    "method": "Membres actifs / membres totaux × 100",
    "target": "Augmentation ≥ 75 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_17",
    "type": "KWI",
    "name": "Adoption des pratiques durables (%)",
    "objective": "Mesurer l'appropriation",
    "method": "Membres appliquant / membres totaux × 100",
    "target": "Augmentation ≥ 40 %",
    "frequency": "Mensuelle / trimestrielle"
  },
  {
    "id": "IND_18",
    "type": "KWI",
    "name": "Satisfaction des membres (%)",
    "objective": "Mesurer adhésion et bien-être",
    "method": "Réponses satisfaites / réponses totales × 100",
    "target": "≥ 60 %",
    "frequency": "Mensuelle / trimestrielle"
  }
];
