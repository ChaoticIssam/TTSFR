"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Save,
  Layers,
  HelpCircle,
  BarChart3,
  Cpu,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  ShieldCheck,
  FileText,
  Building2,
  RefreshCw,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Cluster, Cooperative, DiagnosticSubmission } from "@/lib/types";
import { ODCO_SECTORS, OdcoSector, OdcoSubSector } from "@/lib/odco-data";
import { useCooperative } from "../layout";

// ==============================================================================
// 1. Profiling Questions (P1 to P5) - Determining Cluster Compatibility (35/15/20/15/15)
// ==============================================================================
const PROFILING_QUESTIONS = [
  {
    id: "p1",
    label: "Quel type de processus représente le mieux l'activité principale de la coopérative ?",
    weight: "35% du profil cluster",
    options: [
      { value: "Manuel dominant", desc: "Savoir-faire traditionnel, outillage manuel, absence de mécanisation." },
      { value: "Manuel + mécanique légère", desc: "Processus manuel assisté de petits équipements semi-mécanisés." },
      { value: "Mécanique dominante", desc: "Ligne de transformation mécanisée, convoyeurs, moulins ou moteurs." },
      { value: "Mécanique lourde / thermique", desc: "Presses industrielles continues, fours haute température, fortes puissances." },
      { value: "Organisationnel (non productif)", desc: "Prestation de services, transport, logistique, écotourisme, accueil." },
      { value: "Informationnel / digital", desc: "Conseil, ingénierie, gestion, commerce électronique ou services numériques." },
    ],
  },
  {
    id: "p2",
    label: "Quelle est l'intensité énergétique de l'activité ?",
    weight: "15% du profil cluster",
    options: [
      { value: 0, label: "0 - Faible", desc: "Consommation d'énergie minime ou essentiellement manuelle." },
      { value: 1, label: "1 - Faible à moyenne", desc: "Besoins modestes (petits moteurs d'appoint, éclairage, pompage léger)." },
      { value: 2, label: "2 - Moyenne", desc: "Machines régulières, froid commercial, pompage agricole intensif." },
      { value: 3, label: "3 - Élevée", desc: "Procédés thermiques continus, chaudières, fours industriels." },
    ],
  },
  {
    id: "p3",
    label: "Quel est le niveau actuel de digitalisation des opérations ?",
    weight: "20% du profil cluster",
    options: [
      { value: 0, label: "0 - Très faible", desc: "Aucun outil numérique ou simple téléphone portable pour appels." },
      { value: 1, label: "1 - Faible", desc: "Messagerie instantanée basique, comptabilité ou registre sur papier." },
      { value: 2, label: "2 - Moyenne", desc: "Gestion sur tableurs, présence sur réseaux sociaux, logiciel comptable." },
      { value: 3, label: "3 - Élevée", desc: "Plateforme e-commerce, ERP/progiciel, traçabilité numérique, catalogue en ligne." },
    ],
  },
  {
    id: "p4",
    label: "Quel niveau décrit le mieux la complexité du processus principal ?",
    weight: "15% du profil cluster",
    options: [
      { value: "Simple", desc: "Gestes élémentaires, étapes courtes, faible dépendance technique." },
      { value: "Moyenne", desc: "Quelques étapes standardisées (tri, lavage, conditionnement)." },
      { value: "Structurée", desc: "Procédé technique par étapes avec contrôles intermédiaires réguliers." },
      { value: "Élevée", desc: "Processus continu, paramètres physico-chimiques précis, normes strictes." },
      { value: "Gestionnelle", desc: "Complexité liée aux plannings, clients, prestataires et flux physiques." },
      { value: "Informationnelle", desc: "Complexité liée au traitement de données, études et livrables immatériels." },
    ],
  },
  {
    id: "p5",
    label: "Quelles sont les principales contraintes normatives de l'activité ?",
    weight: "15% du profil cluster",
    options: [
      { value: "Faibles (hygiène basique)", desc: "Bonnes pratiques d'hygiène et de sécurité élémentaires." },
      { value: "ONSSA / sanitaire", desc: "Agrément sanitaire ONSSA, HACCP, traçabilité des lots et analyses." },
      { value: "Techniques & sécurité", desc: "Normes machines, conformité électrique, équipements de protection." },
      { value: "Strictes (sécurité / environnement)", desc: "Rejets, émissions, normes environnementales strictes, audits réguliers." },
      { value: "Contractuelles / qualité", desc: "Cahiers des charges distributeurs, certifications bio/terroir, SLAs." },
      { value: "Données & qualité de service", desc: "Protection des données personnelles (CNDP), conformité numérique et contractuelle." },
    ],
  },
];

// ==============================================================================
// 2. Maturity Questions (20 Questions: O1-O5, E1-E5, G1-G5, T1-T5 on 0..4 scale)
// ==============================================================================
const SCALE_OPTIONS = [
  { value: 0, label: "0 - Inexistant", desc: "Aucune pratique ni démarche formalisée." },
  { value: 1, label: "1 - Occasionnel", desc: "Pratique informelle, dépendante des personnes, non documentée." },
  { value: 2, label: "2 - Partiel", desc: "En cours de structuration, appliqué sur certains aspects." },
  { value: 3, label: "3 - Formalisé", desc: "Règles écrites, appliquées régulièrement et connues des membres." },
  { value: 4, label: "4 - Maîtrisé", desc: "Mesuré par indicateurs, suivi rigoureux et amélioration continue." },
];

const OPERATIONAL_QUESTIONS = [
  { id: "o1", label: "Les étapes du processus de production ou de prestation sont-elles définies et appliquées ?", hint: "Fiches techniques, gammes de fabrication, modes opératoires standardisés." },
  { id: "o2", label: "La production ou les prestations sont-elles planifiées selon les commandes et les capacités disponibles ?", hint: "Planning prévisionnel, gestion des calendriers et respect des délais." },
  { id: "o3", label: "Les stocks, matières premières, consommables et outils sont-ils suivis régulièrement ?", hint: "Inventaires réguliers, fiches d'entrées/sorties, gestion des péremptions." },
  { id: "o4", label: "Des contrôles qualité sont-ils réalisés et les non-conformités sont-elles enregistrées ?", hint: "Vérification des lots, fiches de non-conformité, identification des causes." },
  { id: "o5", label: "Les délais, la productivité, les pertes ou les rebuts sont-ils mesurés ?", hint: "Taux de rebus, rendement matière première, suivi du gaspillage." },
];

const ECONOMIC_QUESTIONS = [
  { id: "e1", label: "Toutes les ventes, charges et dépenses sont-elles enregistrées de manière régulière ?", hint: "Livre des recettes et dépenses, pièces justificatives classées, suivi régulier." },
  { id: "e2", label: "La coopérative calcule-t-elle le coût de revient de ses principaux produits ou services ?", hint: "Calcul des coûts d'intrants, de main-d'œuvre directe et amortissement machine." },
  { id: "e3", label: "La marge, la trésorerie et les besoins financiers sont-ils suivis ?", hint: "Solde bancaire prévisionnel, marges par produit, anticipation des tensions de caisse." },
  { id: "e4", label: "La coopérative dispose-t-elle d’une clientèle régulière et suffisamment diversifiée ?", hint: "Plusieurs clients réguliers, absence de dépendance excessive à un client unique." },
  { id: "e5", label: "Un budget, un plan d’investissement ou un plan de financement est-il établi ?", hint: "Prévisions annuelles de ventes et d'achats, planification des renouvellements d'équipement." },
];

const ORGANIZATIONAL_QUESTIONS = [
  { id: "g1", label: "Les rôles et responsabilités des membres, dirigeants et salariés sont-ils clairement définis ?", hint: "Organigramme, répartition claire des tâches, fiches de responsabilités." },
  { id: "g2", label: "Les réunions, décisions et plans d’action sont-ils documentés et suivis ?", hint: "Procès-verbaux d'assemblée générale et de conseil d'administration, registre des décisions." },
  { id: "g3", label: "Les documents administratifs, dossiers des membres et registres d’activité sont-ils à jour ?", hint: "Statuts actualisés, registre des adhérents ODCO, conformité juridique." },
  { id: "g4", label: "La coopérative fixe-t-elle des objectifs et suit-elle des indicateurs de performance ?", hint: "Objectifs annuels partagés, indicateurs de production et de satisfaction des membres." },
  { id: "g5", label: "Les contrats, autorisations et obligations réglementaires sont-ils identifiés et gérés ?", hint: "Baux, contrats commerciaux, assurances, déclarations légales et fiscales." },
];

const TECH_ENERGY_QUESTIONS = [
  { id: "t1", label: "Des outils numériques sont-ils utilisés pour la gestion, la vente, la production ou le suivi des activités ?", hint: "Outils de facturation, WhatsApp Pro, réseaux sociaux, plateformes d'e-commerce." },
  { id: "t2", label: "Les données de la coopérative sont-elles centralisées, sauvegardées et protégées ?", hint: "Sauvegarde sur le cloud ou disque dur externe, mots de passe sécurisés." },
  { id: "t3", label: "Les équipements sont-ils adaptés aux besoins et entretenus selon un programme défini ?", hint: "Maintenance préventive, calendrier de révision, fiches d'entretien machine." },
  { id: "t4", label: "Les consommations d’électricité, de combustible et d’eau sont-elles mesurées et suivies ?", hint: "Suivi des factures mensuelles d'énergie, relevés de compteurs, détection de surconsommations." },
  { id: "t5", label: "Des actions d’économie d’énergie, d’eau ou de matières sont-elles mises en œuvre et évaluées ?", hint: "Panneaux solaires, recyclage des sous-produits, récupération d'eau, éclairage LED." },
];

function DiagnosticSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Stepper Skeleton */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main Card Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-7 w-72 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-96 bg-slate-100 rounded" />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
              <div className="h-4 w-60 bg-slate-200 rounded" />
              <div className="h-3 w-80 bg-slate-100 rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-12 bg-white rounded-xl border border-slate-200/80" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticWizard() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const { cooperative: coopProfile, setHeaderRight } = useCooperative();

  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // 1 = Secteur, 2 = Profil cluster (P1..P5)
  const [selectedSector, setSelectedSector] = useState("AGR");
  const [selectedSubSectorCode, setSelectedSubSectorCode] = useState("AGR_01");
  const [customSubSector, setCustomSubSector] = useState("Céréales et légumineuses");
  const [otherSubSectorText, setOtherSubSectorText] = useState("");
  const [sectorSearchQuery, setSectorSearchQuery] = useState("");

  // Answers state for P1-P5 and O1-O5, E1-E5, G1-G5, T1-T5.
  // Starts empty: like the Excel model, every question must be answered before any result is computed.
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<DiagnosticSubmission | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoSaving) {
      setHeaderRight(
        <span className="hidden sm:flex items-center text-xs text-slate-500 font-medium">
          <Save className="h-3.5 w-3.5 mr-1.5 text-[#0F4C3A]" />
          Sauvegarde...
        </span>
      );
    } else {
      setHeaderRight(null);
    }
    return () => setHeaderRight(null);
  }, [isAutoSaving, setHeaderRight]);

  const stepLabels = [
    { num: 1, title: "Secteur & Profil", icon: Layers },
    { num: 2, title: "Opérationnel", icon: Cpu },
    { num: 3, title: "Économique", icon: TrendingUp },
    { num: 4, title: "Organisation", icon: Users },
    { num: 5, title: "Tech & Énergie", icon: Zap },
  ];

  // Active sector and sub-sectors
  const activeSector = ODCO_SECTORS.find((s) => s.code === selectedSector) || ODCO_SECTORS[0];

  const filteredSectors = sectorSearchQuery.trim()
    ? ODCO_SECTORS.filter(
        (s) =>
          s.name.toLowerCase().includes(sectorSearchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(sectorSearchQuery.toLowerCase()) ||
          s.desc.toLowerCase().includes(sectorSearchQuery.toLowerCase()) ||
          s.sub_sectors.some((sub) => sub.name.toLowerCase().includes(sectorSearchQuery.toLowerCase()))
      )
    : ODCO_SECTORS;

  const handleSelectSector = (code: string) => {
    setSelectedSector(code);
    const sec = ODCO_SECTORS.find((s) => s.code === code);
    if (sec && sec.sub_sectors.length > 0) {
      setSelectedSubSectorCode(sec.sub_sectors[0].code);
      setCustomSubSector(sec.sub_sectors[0].name);
      setOtherSubSectorText("");
    }
  };

  const handleSelectSubSector = (sub: OdcoSubSector) => {
    setSelectedSubSectorCode(sub.code);
    setCustomSubSector(sub.name);
    if (!sub.name.toLowerCase().includes("autre")) {
      setOtherSubSectorText("");
    }
  };

  const getEffectiveSubSectorName = useCallback(() => {
    const isOther =
      customSubSector.toLowerCase().includes("autre") ||
      selectedSubSectorCode.toLowerCase().includes("autre");
    if (isOther && otherSubSectorText.trim()) {
      return `Autre : ${otherSubSectorText.trim()}`;
    }
    return customSubSector;
  }, [customSubSector, selectedSubSectorCode, otherSubSectorText]);

  // Route protection
  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  // Load latest diagnostic and cluster list
  useEffect(() => {
    if (!token) return;

    const initData = async () => {
      try {
        const [clusterList, coop] = await Promise.all([
          api.get<Cluster[]>("/clusters").catch(() => [] as Cluster[]),
          api.get<Cooperative>("/cooperatives/me").catch(() => null),
        ]);
        setClusters(clusterList);
        if (coop) setCoopProfile(coop);

        const latest = await api.get<DiagnosticSubmission>("/diagnostics/my-latest");
        if (latest) {
          if (latest.answers) {
            setAnswers((prev) => ({ ...prev, ...(latest.answers as Record<string, any>) }));
            if (latest.answers.sector_code) {
              const sCode = String(latest.answers.sector_code);
              setSelectedSector(sCode);
              const sec = ODCO_SECTORS.find((s) => s.code === sCode);
              if (sec) {
                if (latest.answers.sub_sector_code) {
                  const sub = sec.sub_sectors.find((item) => item.code === String(latest.answers.sub_sector_code));
                  if (sub) {
                    setSelectedSubSectorCode(sub.code);
                    setCustomSubSector(sub.name);
                  }
                } else if (latest.answers.sub_sector_name) {
                  const sName = String(latest.answers.sub_sector_name);
                  if (sName.startsWith("Autre :")) {
                    const autreSub = sec.sub_sectors.find((item) => item.name.toLowerCase().includes("autre"));
                    if (autreSub) setSelectedSubSectorCode(autreSub.code);
                    setCustomSubSector(autreSub ? autreSub.name : "Autre – à préciser");
                    setOtherSubSectorText(sName.replace(/^Autre\s*:\s*/i, ""));
                  } else {
                    const sub = sec.sub_sectors.find((item) => item.name.toLowerCase() === sName.toLowerCase());
                    if (sub) {
                      setSelectedSubSectorCode(sub.code);
                      setCustomSubSector(sub.name);
                    } else {
                      setCustomSubSector(sName);
                    }
                  }
                }
              }
            }
          }
          if (latest.status === "SUBMITTED") {
            setSubmissionResult(latest);
            setIsSubmitted(true);
            setStep(1);
            setSubStep(1);
          } else {
            setStep(latest.current_step || 1);
          }
        }
      } catch {
        // First diagnostic attempt
      } finally {
        setIsInitialLoading(false);
      }
    };

    initData();
  }, [token]);

  // Debounced auto-save to draft endpoint
  useEffect(() => {
    if (!token || isSubmitted) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        await api.post("/diagnostics/my-draft", {
          current_step: step,
          answers: {
            ...answers,
            sector_code: selectedSector,
            sector_name: activeSector.name,
            sub_sector_code: selectedSubSectorCode,
            sub_sector_name: getEffectiveSubSectorName(),
          },
        });
      } catch {
        // Silent catch for transient connection drops
      } finally {
        setTimeout(() => setIsAutoSaving(false), 800);
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [step, subStep, selectedSector, selectedSubSectorCode, customSubSector, otherSubSectorText, answers, token, isSubmitted, activeSector.name, getEffectiveSubSectorName]);

  const STEP_QUESTION_KEYS: Record<number, string[]> = {
    2: OPERATIONAL_QUESTIONS.map((q) => q.id),
    3: ECONOMIC_QUESTIONS.map((q) => q.id),
    4: ORGANIZATIONAL_QUESTIONS.map((q) => q.id),
    5: TECH_ENERGY_QUESTIONS.map((q) => q.id),
  };

  const getCurrentStepKeys = (): string[] => {
    if (step === 1) return subStep === 2 ? PROFILING_QUESTIONS.map((q) => q.id) : [];
    return STEP_QUESTION_KEYS[step] || [];
  };

  const isAnswered = (key: string) => answers[key] !== undefined && answers[key] !== null && answers[key] !== "";
  const missingInStep = getCurrentStepKeys().filter((k) => !isAnswered(k));
  const isCurrentStepComplete = missingInStep.length === 0;

  const handleNext = async () => {
    if (!isCurrentStepComplete) return;
    if (step === 1 && subStep === 1) {
      setSubStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step < 5) {
      setStep(step + 1);
      setSubStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Step 5: Execute Python deterministic scoring engine
      setIsSubmitting(true);
      try {
        const result = await api.post<DiagnosticSubmission>("/diagnostics/my-submit", {
          answers: {
            ...answers,
            sector_code: selectedSector,
            sector_name: activeSector.name,
            sub_sector_code: selectedSubSectorCode,
            sub_sector_name: getEffectiveSubSectorName(),
          },
        });
        setSubmissionResult(result);
        setIsSubmitted(true);
        router.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        alert(
          err instanceof Error && err.message
            ? `Erreur lors de la soumission du diagnostic : ${err.message}`
            : "Erreur lors de la soumission du diagnostic. Veuillez réessayer."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 1 && subStep === 2) {
      setSubStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setQuestionAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const getMaturityLevelLabel = (score: number) => {
    if (score < 25) return { label: "Niveau 1 - Initial", color: "text-slate-700 bg-slate-100 border-slate-200" };
    if (score < 50) return { label: "Niveau 2 - En structuration", color: "text-slate-700 bg-slate-100 border-slate-200" };
    if (score < 75) return { label: "Niveau 3 - Avancé", color: "text-slate-700 bg-slate-100 border-slate-200" };
    return { label: "Niveau 4 - Performant", color: "text-[#0F4C3A] bg-slate-100 border-[#0F4C3A]/30 font-bold" };
  };

  // Official Excel cluster profiles (Barème & profils A5:F10)
  const EXCEL_CLUSTER_PROFILES = [
    { code: "SERVICES_COGNITIFS", name: "Services cognitifs et numériques", process: "Informationnel / digital", energy: 0, digital: 3, complexity: "Informationnelle", norms: "Données & qualité de service" },
    { code: "SERVICES_ORGANISES", name: "Services organisés", process: "Organisationnel (non productif)", energy: 0, digital: 2, complexity: "Gestionnelle", norms: "Contractuelles / qualité" },
    { code: "INDUSTRIEL_EXTRACTIF", name: "Industriel / extractif", process: "Mécanique lourde / thermique", energy: 3, digital: 2, complexity: "Élevée", norms: "Strictes (sécurité / environnement)" },
    { code: "PRODUCTION_MECANISEE", name: "Production mécanisée", process: "Mécanique dominante", energy: 2, digital: 2, complexity: "Structurée", norms: "Techniques & sécurité" },
    { code: "TRANSFORMATION_LEGERE", name: "Transformation légère", process: "Manuel + mécanique légère", energy: 1, digital: 1, complexity: "Moyenne", norms: "ONSSA / sanitaire" },
    { code: "ARTISANAL_TRADITIONNEL", name: "Artisanal traditionnel", process: "Manuel dominant", energy: 0, digital: 0, complexity: "Simple", norms: "Faibles (hygiène basique)" },
  ];

  const getClusterCompatibilities = () => {
    const savedCompat = submissionResult?.answers?.cluster_compatibilities as Record<string, number> | undefined;
    const src = submissionResult?.answers || answers;
    const p1 = String(src.p1 ?? "").trim().toLowerCase();
    const p2 = Number(src.p2);
    const p3 = Number(src.p3);
    const p4 = String(src.p4 ?? "").trim().toLowerCase();
    const p5 = String(src.p5 ?? "").trim().toLowerCase();

    return EXCEL_CLUSTER_PROFILES.map((prof) => {
      if (savedCompat && typeof savedCompat[prof.code] === "number") {
        return { ...prof, score: savedCompat[prof.code] };
      }
      const mProcess = p1 === prof.process.toLowerCase() ? 35 : 0;
      const mEnergy = 15 * (1 - Math.abs(p2 - prof.energy) / 3);
      const mDigital = 20 * (1 - Math.abs(p3 - prof.digital) / 3);
      const mComplexity = p4 === prof.complexity.toLowerCase() ? 15 : 0;
      const mNorms = p5 === prof.norms.toLowerCase() ? 15 : 0;
      const score = Math.round((mProcess + mEnergy + mDigital + mComplexity + mNorms) * 10) / 10;
      return { ...prof, score };
    });
  };

  const clusterCompatList = getClusterCompatibilities();
  // Excel C17: INDEX(..., MATCH(MAX(F11:F16), F11:F16, 0)) -> first cluster in table order wins a tie
  const maxCompatScore = Math.max(...clusterCompatList.map((c) => c.score));
  const savedClusterCode = submissionResult?.answers?.cluster_code as string | undefined;
  const bestCompatCluster =
    clusterCompatList.find((c) => c.code === savedClusterCode) ||
    clusterCompatList.find((c) => c.score === maxCompatScore);
  const assignedCluster = clusters.find((c) => c.id === submissionResult?.cluster_id);

  if (authLoading || (!token && typeof window !== "undefined") || isInitialLoading) {
    return <DiagnosticSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Horizontal Desktop Stepper */}
        {!isSubmitted && (
          <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-5 gap-2">
              {stepLabels.map((s) => {
                const isCurrent = step === s.num;
                const isPast = step > s.num;
                return (
                  <div
                    key={s.num}
                    className={`flex items-center space-x-2.5 p-2 rounded-xl text-left transition ${
                      isCurrent
                        ? "bg-slate-50 text-[#0F4C3A] border border-[#0F4C3A]/30 shadow-xs"
                        : isPast
                        ? "text-slate-700"
                        : "text-slate-400 opacity-60"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isCurrent
                          ? "bg-[#0F4C3A] text-white"
                          : isPast
                          ? "bg-slate-100 text-[#0F4C3A] border border-slate-200"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isPast ? <Check className="h-4 w-4" /> : s.num}
                    </div>
                    <span className="text-xs font-bold truncate hidden md:inline">
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden md:hidden">
              <div
                className="bg-[#0F4C3A] h-1.5 transition-all duration-300 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          {!isSubmitted ? (
            <>
              {/* STEP 1.1: SECTEUR ODCO ET SOUS-SECTEUR */}
              {step === 1 && subStep === 1 && (
                <div>
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Nomenclature ODCO
                    </p>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Secteur d'activité
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Choisissez votre secteur d'activité, puis sélectionnez votre spécialité ci-dessous.
                    </p>
                  </div>

                  {/* Search Bar for Sectors */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={sectorSearchQuery}
                      onChange={(e) => setSectorSearchQuery(e.target.value)}
                      placeholder="Rechercher un secteur (ex: Agriculture, Artisanat, Tourisme...)"
                      className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] focus:bg-white transition"
                    />
                    {sectorSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setSectorSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-700"
                      >
                        Effacer
                      </button>
                    )}
                  </div>

                  {/* Sectors Grid (24 Secteurs ODCO) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0.5">
                    {filteredSectors.map((s) => {
                      const isSelected = selectedSector === s.code;
                      return (
                        <div
                          key={s.code}
                          onClick={() => handleSelectSector(s.code)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? "border-[#0F4C3A] bg-slate-50 shadow-xs ring-1 ring-[#0F4C3A]"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`text-sm font-bold ${isSelected ? "text-[#0F4C3A]" : "text-slate-900"}`}>
                                {s.name}
                              </h3>
                              {isSelected && <Check className="h-4 w-4 text-[#0F4C3A] flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{s.desc}</p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{s.sub_sectors.length} sous-secteurs</span>
                            <span className={isSelected ? "font-bold text-[#0F4C3A]" : ""}>
                              {isSelected ? "Sélectionné" : "Cliquer pour choisir"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* DYNAMIC SUB-SECTORS DROPDOWN (BASED ON SELECTED SECTOR) */}
                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <label
                      htmlFor="sous-secteur-select"
                      className="block text-sm font-semibold text-slate-900 mb-1"
                    >
                      Sous-secteur d'activité ({activeSector.name})
                    </label>
                    <p className="text-xs text-slate-500 mb-2.5">
                      Précisez la spécialité de votre coopérative :
                    </p>

                    <div className="relative max-w-xl">
                      <select
                        id="sous-secteur-select"
                        value={selectedSubSectorCode}
                        onChange={(e) => {
                          const subCode = e.target.value;
                          const found = activeSector.sub_sectors.find((s) => s.code === subCode);
                          if (found) {
                            handleSelectSubSector(found);
                          }
                        }}
                        className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] cursor-pointer shadow-xs transition"
                      >
                        {activeSector.sub_sectors.map((sub) => (
                          <option key={sub.code} value={sub.code}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Precision input if "Autre" is selected */}
                    {(customSubSector.toLowerCase().includes("autre") ||
                      selectedSubSectorCode.toLowerCase().includes("autre")) && (
                      <div className="mt-3.5 max-w-2xl p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Précisez l'activité ou la spécialité exacte de votre coopérative :
                        </label>
                        <input
                          type="text"
                          value={otherSubSectorText}
                          onChange={(e) => setOtherSubSectorText(e.target.value)}
                          placeholder="ex: Production de spiruline, élevage camelin, maroquinerie d'art..."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 1.2: PROFIL CLUSTER (P1 à P5) */}
              {step === 1 && subStep === 2 && (
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Profil Technico-Fonctionnel
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                      Caractéristiques du Mode Opératoire
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Ces 5 paramètres structurent la compatibilité mathématique avec les 6 archétypes de maturité TTSFR.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {PROFILING_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-2.5">
                          <label className="text-sm font-bold text-slate-900">
                            {q.label}
                          </label>
                          <span className="text-xs font-medium text-slate-400">
                            {q.weight}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                          {q.options.map((opt) => {
                            const isChosen = answers[q.id] === opt.value;
                            return (
                              <button
                                key={String(opt.value)}
                                type="button"
                                onClick={() => setQuestionAnswer(q.id, opt.value)}
                                className={`text-left p-3.5 rounded-xl border transition text-xs flex flex-col justify-between ${
                                  isChosen
                                    ? "border-[#0F4C3A] bg-slate-50 text-[#0F4C3A] font-medium shadow-xs ring-1 ring-[#0F4C3A]"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-slate-900">
                                    {(opt as any).label || opt.value}
                                  </span>
                                  {isChosen && <Check className="h-3.5 w-3.5 text-[#0F4C3A]" />}
                                </div>
                                <span className="text-[11px] text-slate-500">{opt.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: PERFORMANCE OPERATIONNELLE (O1 à O5) */}
              {step === 2 && (
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Dimension 1 sur 4 · Performance Opérationnelle
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                      Maîtrise des Procédés, Planification & Qualité
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Évaluez vos standards de production, le suivi des stocks et l'enregistrement de la qualité.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {OPERATIONAL_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="mb-2">
                          <label className="text-sm font-bold text-slate-900 block">{q.label}</label>
                          <p className="text-xs text-slate-500 mt-0.5">{q.hint}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
                          {SCALE_OPTIONS.map((scale) => {
                            const isSelected = answers[q.id] === scale.value;
                            return (
                              <button
                                key={scale.value}
                                type="button"
                                onClick={() => setQuestionAnswer(q.id, scale.value)}
                                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                                  isSelected
                                    ? "border-[#0F4C3A] bg-slate-50 text-slate-900 font-bold ring-1 ring-[#0F4C3A] shadow-xs"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="block font-bold">{scale.label}</span>
                                <span className="block text-[10px] text-slate-500 mt-0.5 line-clamp-2">{scale.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: PERFORMANCE ECONOMIQUE (E1 à E5) */}
              {step === 3 && (
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Dimension 2 sur 4 · Performance Économique
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                      Comptabilité, Coût de Revient & Trésorerie
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Évaluez la rigueur de vos enregistrements comptables, le calcul des marges et la diversification commerciale.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {ECONOMIC_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="mb-2">
                          <label className="text-sm font-bold text-slate-900 block">{q.label}</label>
                          <p className="text-xs text-slate-500 mt-0.5">{q.hint}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
                          {SCALE_OPTIONS.map((scale) => {
                            const isSelected = answers[q.id] === scale.value;
                            return (
                              <button
                                key={scale.value}
                                type="button"
                                onClick={() => setQuestionAnswer(q.id, scale.value)}
                                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                                  isSelected
                                    ? "border-[#0F4C3A] bg-slate-50 text-slate-900 font-bold ring-1 ring-[#0F4C3A] shadow-xs"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="block font-bold">{scale.label}</span>
                                <span className="block text-[10px] text-slate-500 mt-0.5 line-clamp-2">{scale.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: MATURITE ORGANISATIONNELLE (G1 à G5) */}
              {step === 4 && (
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Dimension 3 sur 4 · Maturité Organisationnelle
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                      Gouvernance, Responsabilités & Conformité Légale
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Évaluez la clarté des rôles, la documentation des décisions et le respect des obligations statutaires.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {ORGANIZATIONAL_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="mb-2">
                          <label className="text-sm font-bold text-slate-900 block">{q.label}</label>
                          <p className="text-xs text-slate-500 mt-0.5">{q.hint}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
                          {SCALE_OPTIONS.map((scale) => {
                            const isSelected = answers[q.id] === scale.value;
                            return (
                              <button
                                key={scale.value}
                                type="button"
                                onClick={() => setQuestionAnswer(q.id, scale.value)}
                                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                                  isSelected
                                    ? "border-[#0F4C3A] bg-slate-50 text-slate-900 font-bold ring-1 ring-[#0F4C3A] shadow-xs"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="block font-bold">{scale.label}</span>
                                <span className="block text-[10px] text-slate-500 mt-0.5 line-clamp-2">{scale.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: MATURITE TECHNOLOGIQUE ET ENERGETIQUE (T1 à T5) */}
              {step === 5 && (
                <div>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Dimension 4 sur 4 · Maturité Technologique & Énergétique
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                      Digitalisation, Maintenance & Sobriété Énergétique
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Évaluez l'utilisation des technologies numériques, la maintenance des équipements et la gestion de l'énergie et de l'eau.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {TECH_ENERGY_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="mb-2">
                          <label className="text-sm font-bold text-slate-900 block">{q.label}</label>
                          <p className="text-xs text-slate-500 mt-0.5">{q.hint}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
                          {SCALE_OPTIONS.map((scale) => {
                            const isSelected = answers[q.id] === scale.value;
                            return (
                              <button
                                key={scale.value}
                                type="button"
                                onClick={() => setQuestionAnswer(q.id, scale.value)}
                                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                                  isSelected
                                    ? "border-[#0F4C3A] bg-slate-50 text-slate-900 font-bold ring-1 ring-[#0F4C3A] shadow-xs"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="block font-bold">{scale.label}</span>
                                <span className="block text-[10px] text-slate-500 mt-0.5 line-clamp-2">{scale.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1 && subStep === 1}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </button>

                <div className="text-xs text-slate-400 font-medium text-center">
                  {step === 1 ? `Étape 1 (${subStep}/2)` : `Étape ${step} sur 5`}
                  {!isCurrentStepComplete && (
                    <span className="block text-amber-700 mt-0.5">
                      {missingInStep.length} question{missingInStep.length > 1 ? "s" : ""} sans réponse
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting || !isCurrentStepComplete}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0d4031] text-white text-sm font-bold shadow-xs active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {step === 5 ? (
                    isSubmitting ? "Calcul du diagnostic..." : "Valider et calculer mon cluster"
                  ) : (
                    <>
                      <span>Suivant</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* RESTITUTION RESULTATS SUBMITTED (Organisé, visuel et lisible) */
            <div>
              {/* En-tête principal avec cluster et score de compatibilité */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Synthèse de votre diagnostic
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Retrouvez ci-dessous votre niveau de maturité sur les 4 dimensions ainsi que votre compatibilité avec les 6 profils types.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 sm:gap-8 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 flex-shrink-0">
                  <div>
                    <span className="text-xs text-slate-500 block">Cluster</span>
                    <span className="text-lg font-bold text-slate-900 block mt-0.5">
                      {bestCompatCluster?.name || assignedCluster?.name || "—"}
                    </span>
                  </div>
                  <div className="h-9 w-px bg-slate-200 hidden sm:block" />
                  <div>
                    <span className="text-xs text-slate-500 block">Score de compatibilité du cluster</span>
                    <span className="text-2xl font-extrabold text-[#0F4C3A] block mt-0.5">
                      {bestCompatCluster ? `${bestCompatCluster.score.toFixed(1).replace(".", ",")} %` : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grille principale équilibrée en 2 colonnes */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-stretch">
                {/* Colonne 1 : Les 4 Dimensions de Maturité */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900">
                      1. Maturité par dimension
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Évaluation de vos pratiques actuelles sur une échelle de 0 à 100 %.
                    </p>
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 flex flex-col justify-between">
                    {[
                      {
                        label: "Performance opérationnelle",
                        desc: "Procédés de production, suivi des stocks et contrôle qualité",
                        score: submissionResult?.score_operational ?? 0,
                      },
                      {
                        label: "Performance économique",
                        desc: "Tenue comptable, calcul des coûts de revient et trésorerie",
                        score: submissionResult?.score_economic ?? 0,
                      },
                      {
                        label: "Maturité organisationnelle",
                        desc: "Gouvernance, répartition des rôles et conformité légale",
                        score: submissionResult?.score_organizational ?? 0,
                      },
                      {
                        label: "Maturité technologique et énergétique",
                        desc: "Outils numériques, maintenance des équipements et sobriété énergétique",
                        score: submissionResult?.score_tech_energy ?? 0,
                      },
                    ].map((dim) => {
                      const lvl = getMaturityLevelLabel(dim.score);
                      return (
                        <div key={dim.label} className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-2.5">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">
                                {dim.label}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {dim.desc}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <span className="text-base font-extrabold text-[#0F4C3A] block whitespace-nowrap">
                                {Number(dim.score).toFixed(1).replace(".", ",")} %
                              </span>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {lvl.label}
                              </span>
                            </div>
                          </div>

                          {/* Barre de progression visuelle */}
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#0F4C3A] h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(4, Number(dim.score)))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Colonne 2 : Compatibilité avec les 6 Clusters */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900">
                      2. Compatibilité par profil
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Comparaison de votre mode opératoire avec les 6 profils types.
                    </p>
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 flex flex-col justify-between">
                    {clusterCompatList.map((item) => {
                      const isBest = item.code === bestCompatCluster?.code;
                      return (
                        <div
                          key={item.code}
                          className={`px-5 py-4 transition-colors ${
                            isBest ? "bg-emerald-50/50" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <span
                              className={`text-sm ${
                                isBest
                                  ? "font-bold text-[#0F4C3A]"
                                  : "font-medium text-slate-700"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span
                              className={`text-sm whitespace-nowrap ${
                                isBest
                                  ? "font-extrabold text-[#0F4C3A]"
                                  : "font-semibold text-slate-600"
                              }`}
                            >
                              {item.score.toFixed(1).replace(".", ",")} %
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isBest ? "bg-[#0F4C3A]" : "bg-slate-300"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(3, item.score))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                <Link
                  href="/cooperative/dashboard?section=accompagnement"
                  prefetch={false}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white text-sm font-bold transition text-center shadow-sm"
                >
                  Accéder à mon parcours d'accompagnement
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition text-center"
                >
                  Modifier mes réponses
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
