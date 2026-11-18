"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Save,
  CheckCircle2,
  FileText,
  Download,
  Filter,
  Layers,
  BarChart3,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Cluster, Cooperative, DiagnosticSubmission } from "@/lib/types";
import { CoopSection } from "@/components/cooperative-shell";
import { useCooperative } from "../layout";
import {
  TTSFR_MODULES,
  TTSFR_DELIVERABLES,
  TTSFR_IMPACT_INDICATORS,
  ACTIVATION_BADGES,
  CHECKLIST_ANSWER_RULES,
  ChecklistAnswer,
  ChecklistItemEntry,
  ImpactIndicatorEntry,
  getMaturityTierFromScore,
  computeModuleGlobalStatus,
} from "@/lib/ttsfr-modules-data";

const CLUSTER_NAMES: Record<string, string> = {
  SERVICES_COGNITIFS: "Services cognitifs et numériques",
  SERVICES_ORGANISES: "Services organisés",
  INDUSTRIEL_EXTRACTIF: "Industriel / extractif",
  PRODUCTION_MECANISEE: "Production mécanisée",
  TRANSFORMATION_LEGERE: "Transformation légère",
  ARTISANAL_TRADITIONNEL: "Artisanal traditionnel",
};

const CHECKLIST_OPTIONS: ChecklistAnswer[] = [
  "Non",
  "Partiellement",
  "Oui sans preuve",
  "Oui avec preuve",
  "Non applicable",
];

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-slate-200/90 px-6 py-5 sm:px-8 sm:py-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-4 w-36 bg-slate-200 rounded-md" />
          <div className="h-7 w-64 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-48 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-5 w-44 bg-slate-200 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 h-28 space-y-3">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-6 w-16 bg-slate-200 rounded" />
                  <div className="h-2 w-full bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-5 w-44 bg-slate-200 rounded-md" />
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 h-64 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded-md w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CooperativeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isLoading: authLoading } = useAuth();
  const { cooperative: coopProfile, updateCooperativeState } = useCooperative();

  const [activeSection, setActiveSection] = useState<CoopSection>("overview");
  const [latestDiag, setLatestDiag] = useState<DiagnosticSubmission | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Accompagnement state: 7 modules, 99 deliverables checklist, 18 impact indicators
  const [accompSubTab, setAccompSubTab] = useState<"livrables" | "impact">("livrables");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("M02");
  const [selectedActivationFilter, setSelectedActivationFilter] = useState<string>("ALL");
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>("ALL");
  const [selectedImpactType, setSelectedImpactType] = useState<"ALL" | "KPI" | "KVI" | "KWI">("ALL");
  const [checklistEntries, setChecklistEntries] = useState<Record<string, ChecklistItemEntry>>({});
  const [impactEntries, setImpactEntries] = useState<Record<string, ImpactIndicatorEntry>>({});
  const [isSavingAccomp, setIsSavingAccomp] = useState(false);
  const saveAccompTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [editForm, setEditForm] = useState({
    member_count: 1,
    women_member_count: 0,
    activity_description: "",
    region: "",
    city: "",
    registration_number: "",
  });

  // Sync activeSection with URL search query param (?section=...)
  useEffect(() => {
    const sec = searchParams?.get("section");
    if (sec === "accompagnement" || sec === "profil" || sec === "overview") {
      setActiveSection(sec);
    } else {
      setActiveSection("overview");
    }
  }, [searchParams]);

  // Sync editForm when coopProfile loads or updates
  useEffect(() => {
    if (coopProfile) {
      setEditForm({
        member_count: coopProfile.member_count,
        women_member_count: coopProfile.women_member_count,
        activity_description: coopProfile.activity_description || "",
        region: coopProfile.region || "",
        city: coopProfile.city || "",
        registration_number: coopProfile.registration_number || "",
      });
    }
  }, [coopProfile]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [clusterList, diag] = await Promise.all([
        api.get<Cluster[]>("/clusters").catch(() => [] as Cluster[]),
        api.get<DiagnosticSubmission>("/diagnostics/my-latest").catch(() => null),
      ]);
      setClusters(clusterList);
      setLatestDiag(diag);

      if (diag?.answers) {
        const savedChecklist = (diag.answers.checklist_entries || {}) as Record<
          string,
          ChecklistItemEntry
        >;
        // If diagnostic is SUBMITTED and M01 deliverables L001..L003 aren't answered yet,
        // pre-populate L001..L003 as "Oui avec preuve" since Module 01 (Diagnostic) is completed on the platform
        if (diag.status === "SUBMITTED") {
          for (const lid of ["L001", "L002", "L003"]) {
            if (!savedChecklist[lid]?.answer) {
              savedChecklist[lid] = {
                answer: "Oui avec preuve",
                proof: "Généré et validé automatiquement sur la plateforme TTSFR",
              };
            }
          }
        }
        setChecklistEntries(savedChecklist);

        if (diag.answers.impact_entries) {
          setImpactEntries(
            diag.answers.impact_entries as Record<string, ImpactIndicatorEntry>
          );
        }
      }
    } catch {
      // Handled silently
    } finally {
      setIsDataLoading(false);
    }
  };

  const persistAccompagnement = useCallback(
    (
      nextChecklist: Record<string, ChecklistItemEntry>,
      nextImpact: Record<string, ImpactIndicatorEntry>
    ) => {
      if (saveAccompTimerRef.current) {
        clearTimeout(saveAccompTimerRef.current);
      }
      saveAccompTimerRef.current = setTimeout(async () => {
        try {
          setIsSavingAccomp(true);
          await api.post("/diagnostics/my-accompagnement", {
            checklist_entries: nextChecklist,
            impact_entries: nextImpact,
          });
        } catch {
          // Ignore transient save errors
        } finally {
          setIsSavingAccomp(false);
        }
      }, 600);
    },
    []
  );

  const handleUpdateChecklistItem = (
    livrableId: string,
    patch: Partial<ChecklistItemEntry>
  ) => {
    setChecklistEntries((prev) => {
      const current = prev[livrableId] || { answer: "" };
      const updated = {
        ...prev,
        [livrableId]: { ...current, ...patch },
      };
      persistAccompagnement(updated, impactEntries);
      return updated;
    });
  };

  const handleUpdateImpactItem = (
    indicatorId: string,
    patch: Partial<ImpactIndicatorEntry>
  ) => {
    setImpactEntries((prev) => {
      const current = prev[indicatorId] || {};
      const updated = {
        ...prev,
        [indicatorId]: { ...current, ...patch },
      };
      persistAccompagnement(checklistEntries, updated);
      return updated;
    });
  };

  const handleExportImpactCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Indicateur",
      "Objectif",
      "Methode d'evaluation",
      "Cible",
      "Valeur initiale",
      "Valeur actuelle",
      "Gain obtenu",
      "Frequence",
    ];
    const rows = TTSFR_IMPACT_INDICATORS.map((ind) => {
      const entry = impactEntries[ind.id] || {};
      return [
        `"${ind.id}"`,
        `"${ind.type}"`,
        `"${ind.name.replace(/"/g, '""')}"`,
        `"${ind.objective.replace(/"/g, '""')}"`,
        `"${ind.method.replace(/"/g, '""')}"`,
        `"${ind.target.replace(/"/g, '""')}"`,
        `"${(entry.initialValue || "").replace(/"/g, '""')}"`,
        `"${(entry.currentValue || "").replace(/"/g, '""')}"`,
        `"${(entry.gain || "").replace(/"/g, '""')}"`,
        `"${ind.frequency}"`,
      ].join(";");
    });
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `tracker_impact_kpi_kvi_kwi_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSavedMsg(false);
    try {
      const updated = await api.put<Cooperative>("/cooperatives/me", {
        member_count: Number(editForm.member_count),
        women_member_count: Number(editForm.women_member_count),
        activity_description: editForm.activity_description,
        region: editForm.region,
        city: editForm.city,
        registration_number: editForm.registration_number,
      });
      updateCooperativeState(updated);
      setProfileSavedMsg(true);
      setTimeout(() => setProfileSavedMsg(false), 3500);
    } catch {
      alert("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (authLoading || (!token && typeof window !== "undefined")) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0F4C3A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  const womenPercentage = coopProfile?.member_count
    ? Math.round(((coopProfile.women_member_count || 0) / coopProfile.member_count) * 100)
    : 0;

  const assignedCluster = clusters.find((c) => c.id === latestDiag?.cluster_id);
  const compatMap = (latestDiag?.answers?.cluster_compatibilities || {}) as Record<string, number>;
  const clusterCode = (latestDiag?.answers?.cluster_code as string) || assignedCluster?.code || "";
  const clusterScore =
    clusterCode && typeof compatMap[clusterCode] === "number"
      ? compatMap[clusterCode]
      : Object.values(compatMap).length > 0
      ? Math.max(...Object.values(compatMap))
      : null;
  const clusterDisplayName =
    assignedCluster?.name || CLUSTER_NAMES[clusterCode] || "Non évalué";

  const sortedCompatibilities = Object.entries(CLUSTER_NAMES).map(([code, name]) => ({
    code,
    name,
    score: typeof compatMap[code] === "number" ? compatMap[code] : 0,
  }));

  const dimensionList = [
    {
      title: "Performance opérationnelle",
      val: latestDiag?.score_operational ?? 0,
    },
    {
      title: "Performance économique",
      val: latestDiag?.score_economic ?? 0,
    },
    {
      title: "Maturité organisationnelle",
      val: latestDiag?.score_organizational ?? 0,
    },
    {
      title: "Maturité technologique et énergétique",
      val: latestDiag?.score_tech_energy ?? 0,
    },
  ];

  const avgMaturityScore =
    latestDiag?.score_global ??
    (dimensionList.reduce((acc, d) => acc + d.val, 0) / 4 || 0);
  const maturityTier = getMaturityTierFromScore(avgMaturityScore);
  const weakestDim = [...dimensionList].sort((a, b) => a.val - b.val)[0];

  // Filter deliverables for the selected module and active filters
  const activeModuleObj =
    TTSFR_MODULES.find((m) => m.id === selectedModuleId) || TTSFR_MODULES[1];

  const moduleDeliverables = TTSFR_DELIVERABLES.filter((d) => {
    if (d.moduleId !== selectedModuleId) return false;
    if (
      selectedActivationFilter !== "ALL" &&
      !d.activations.includes(selectedActivationFilter)
    ) {
      return false;
    }
    if (selectedFamilyFilter !== "ALL" && d.family !== selectedFamilyFilter) {
      return false;
    }
    return true;
  });

  const filteredImpactIndicators = TTSFR_IMPACT_INDICATORS.filter(
    (ind) => selectedImpactType === "ALL" || ind.type === selectedImpactType
  );

  if (isDataLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full">
      {/* =====================================================================
          SECTION 1 : VUE D'ENSEMBLE (Synthèse épurée sur un seul écran)
         ===================================================================== */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* En-tête de la coopérative */}
          <section className="bg-white rounded-2xl border border-slate-200/90 px-6 py-5 sm:px-8 sm:py-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#0F4C3A] block">
                {coopProfile?.sector?.name || "Secteur d'activité"}
                {coopProfile?.sub_sector?.name ? ` · ${coopProfile.sub_sector.name}` : ""}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate mt-0.5">
                {coopProfile?.name || "Espace Coopérative"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {coopProfile?.city || "Localisation non renseignée"}
                {coopProfile?.region ? ` (${coopProfile.region})` : ""} ·{" "}
                {coopProfile?.member_count || 1} adhérentes ({womenPercentage} % femmes)
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/cooperative/diagnostic"
                prefetch={false}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-semibold text-xs sm:text-sm transition whitespace-nowrap shadow-sm"
              >
                <span>
                  {latestDiag?.status === "SUBMITTED"
                    ? "Voir ou modifier mon diagnostic"
                    : "Accéder au diagnostic"}
                </span>
                <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </Link>
            </div>
          </section>

          {/* Synthèse du diagnostic : 4 dimensions + 6 clusters */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            {latestDiag?.status === "SUBMITTED" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Colonne gauche (7 cols) : Maturité par dimension */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="mb-5">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      1. Maturité par dimension
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Scores évalués sur 100 % à partir des 20 questions de maturité (formule : moyenne / 4 × 100).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    {dimensionList.map((dim) => {
                      const lvl =
                        dim.val < 25
                          ? "Niveau 1 - Initial"
                          : dim.val < 50
                          ? "Niveau 2 - En structuration"
                          : dim.val < 75
                          ? "Niveau 3 - Avancé"
                          : "Niveau 4 - Performant";
                      return (
                        <div
                          key={dim.title}
                          className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-sm font-bold text-slate-900">
                                {dim.title}
                              </span>
                              <strong className="text-lg font-extrabold text-[#0F4C3A] whitespace-nowrap">
                                {Number(dim.val).toFixed(1).replace(".", ",")} %
                              </strong>
                            </div>
                            <span className="text-xs text-slate-500 block mt-1">
                              {lvl}
                            </span>
                          </div>

                          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-5">
                            <div
                              className="bg-[#0F4C3A] h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(4, dim.val))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Colonne droite (5 cols) : Compatibilité par profil */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="mb-5">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      2. Compatibilité par profil
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Comparaison de votre mode opératoire (P1 à P5) avec les 6 profils types.
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
                      <div>
                        <span className="text-xs text-slate-500 block">Cluster attribué</span>
                        <strong className="text-base sm:text-lg font-extrabold text-slate-900 block mt-0.5">
                          {clusterDisplayName}
                        </strong>
                      </div>
                      {clusterScore !== null && (
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block">Compatibilité</span>
                          <strong className="text-xl sm:text-2xl font-extrabold text-[#0F4C3A] block mt-0.5 whitespace-nowrap">
                            {clusterScore.toFixed(1).replace(".", ",")} %
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {sortedCompatibilities.map((item) => {
                        const isBest = item.code === clusterCode;
                        return (
                          <div key={item.code}>
                            <div className="flex justify-between text-xs mb-1">
                              <span
                                className={
                                  isBest
                                    ? "font-bold text-[#0F4C3A]"
                                    : "font-medium text-slate-700"
                                }
                              >
                                {item.name}
                              </span>
                              <span
                                className={`whitespace-nowrap ${
                                  isBest
                                    ? "font-extrabold text-[#0F4C3A]"
                                    : "text-slate-500"
                                }`}
                              >
                                {item.score.toFixed(1).replace(".", ",")} %
                              </span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isBest ? "bg-[#0F4C3A]" : "bg-slate-400/70"
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
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Diagnostic de maturité et profil de transition
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Complétez votre évaluation en 5 étapes pour calculer vos scores sur les 4 dimensions et identifier votre cluster.
                  </p>
                </div>
                <Link
                  href="/cooperative/diagnostic"
                  prefetch={false}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-bold text-xs sm:text-sm transition whitespace-nowrap shadow-sm"
                >
                  <span>
                    {latestDiag?.status === "DRAFT"
                      ? `Reprendre à l'étape ${latestDiag.current_step}/5`
                      : "Démarrer mon diagnostic"}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}
          </section>
        </div>
      )}

      {/* =====================================================================
          SECTION 2 : PARCOURS D'ACCOMPAGNEMENT PERSONNALISÉ
          (7 Modules M01-M07 × 4 Logiques A1-A4 × 99 Livrables L001-L099 × Tracker KPI/KVI/KWI)
         ===================================================================== */}
      {activeSection === "accompagnement" && (
        <div className="space-y-6">
          {/* En-tête officiel prescrit par le fichier Excel TTSFR */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
                    Prescription &amp; Suivi TTSFR
                  </span>
                  {isSavingAccomp && (
                    <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Sauvegarde en cours...
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Votre parcours d’accompagnement personnalisé
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Ces recommandations ont été sélectionnées selon votre secteur, votre technologie, votre niveau de maturité et vos besoins transversaux.
                </p>
              </div>

              {/* Profil synthétique d'activation */}
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200/80 text-xs flex-shrink-0">
                <div>
                  <span className="text-slate-400 block">Secteur ODCO</span>
                  <strong className="font-bold text-slate-900">
                    {coopProfile?.sector?.name || "Tous secteurs"}
                  </strong>
                </div>
                <div className="h-7 w-px bg-slate-200 hidden sm:block" />
                <div>
                  <span className="text-slate-400 block">Technologie (P1)</span>
                  <strong className="font-bold text-slate-900">
                    {String(latestDiag?.answers?.p1 || "Standard")}
                  </strong>
                </div>
                <div className="h-7 w-px bg-slate-200 hidden sm:block" />
                <div>
                  <span className="text-slate-400 block">Cluster &amp; Palier</span>
                  <strong className="font-bold text-[#0F4C3A]">
                    {clusterDisplayName} ({maturityTier})
                  </strong>
                </div>
              </div>
            </div>

            {/* Les 4 badges de logiques d'activation (A1 à A4) */}
            <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center">
                  <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  Filtrer par logique d&apos;activation :
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedActivationFilter("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    selectedActivationFilter === "ALL"
                      ? "bg-[#0F4C3A] text-white border-[#0F4C3A]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Toutes (A1–A4)
                </button>
                {Object.entries(ACTIVATION_BADGES).map(([code, badge]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() =>
                      setSelectedActivationFilter(
                        selectedActivationFilter === code ? "ALL" : code
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedActivationFilter === code
                        ? "bg-[#0F4C3A] text-white border-[#0F4C3A]"
                        : `${badge.colorClass} hover:opacity-90`
                    }`}
                  >
                    {code} · {badge.label}
                  </button>
                ))}
              </div>

              {/* Bascule Livrables vs Tracker KPI/KVI/KWI */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 self-start sm:self-auto flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAccompSubTab("livrables")}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    accompSubTab === "livrables"
                      ? "bg-white text-[#0F4C3A] shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                  Checklist des 7 Modules (99 livrables)
                </button>
                <button
                  type="button"
                  onClick={() => setAccompSubTab("impact")}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    accompSubTab === "impact"
                      ? "bg-white text-[#0F4C3A] shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Tracker KPI, KVI &amp; KWI (18)
                </button>
              </div>
            </div>
          </section>

          {accompSubTab === "livrables" ? (
            <>
              {/* Grille des 7 Modules thématiques (M01 à M07) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {TTSFR_MODULES.map((mod) => {
                  const modItems = TTSFR_DELIVERABLES.filter(
                    (d) => d.moduleId === mod.id
                  );
                  const modStatus = computeModuleGlobalStatus(
                    modItems,
                    checklistEntries
                  );
                  const answeredCount = modItems.filter(
                    (d) => Boolean(checklistEntries[d.id]?.answer)
                  ).length;
                  const isSelected = selectedModuleId === mod.id;

                  const statusBadgeStyle =
                    modStatus.tone === "rose"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : modStatus.tone === "amber"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : modStatus.tone === "emerald"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : modStatus.tone === "blue"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-slate-100 text-slate-600 border-slate-200";

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? "bg-white border-[#0F4C3A] ring-2 ring-[#0F4C3A]/15 shadow-sm"
                          : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F4C3A]">
                            {mod.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeStyle}`}
                          >
                            {modStatus.label}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {mod.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {mod.objective}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          {answeredCount}/{modItems.length} livrables évalués
                        </span>
                        {mod.id === "M01" && latestDiag?.status === "SUBMITTED" && (
                          <span className="text-[10px] font-bold text-emerald-700">
                            Déjà réalisé
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </section>

              {/* Détail du Module sélectionné et Checklist de ses livrables */}
              <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] block">
                      {activeModuleObj.displayLabel}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                      {activeModuleObj.objective}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Périmètre : {activeModuleObj.perimeter}
                    </p>
                  </div>

                  {/* Filtre par famille de livrable (Descriptif, Normatif, Opérationnel, Stratégique) */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["ALL", "Descriptif", "Normatif", "Opérationnel", "Stratégique"].map(
                      (fam) => (
                        <button
                          key={fam}
                          type="button"
                          onClick={() => setSelectedFamilyFilter(fam)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            selectedFamilyFilter === fam
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {fam === "ALL" ? "Toutes familles" : fam}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {moduleDeliverables.length === 0 ? (
                  <div className="py-12 text-center text-xs sm:text-sm text-slate-500">
                    Aucun livrable ne correspond aux filtres sélectionnés dans ce module.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {moduleDeliverables.map((deliv) => {
                      const entry = checklistEntries[deliv.id] || { answer: "" };
                      const rule = entry.answer
                        ? CHECKLIST_ANSWER_RULES[entry.answer]
                        : null;

                      const familyBadgeClass =
                        deliv.family === "Descriptif"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : deliv.family === "Normatif"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : deliv.family === "Opérationnel"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-emerald-50 text-[#0F4C3A] border-emerald-200";

                      return (
                        <div
                          key={deliv.id}
                          className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 space-y-4 transition hover:border-slate-300"
                        >
                          {/* Ligne 1 : ID, Famille, Titre et Badges d'activation (A1..A4) */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-extrabold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                                  {deliv.id}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${familyBadgeClass}`}
                                >
                                  {deliv.family}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  Palier cible : {deliv.maturityScope}
                                </span>
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                {deliv.title}
                              </h3>
                            </div>

                            {/* Badges d'activation */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {deliv.activations.map((actCode) => {
                                const b = ACTIVATION_BADGES[actCode];
                                if (!b) return null;
                                return (
                                  <span
                                    key={actCode}
                                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${b.colorClass}`}
                                  >
                                    {b.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Ligne 2 : Question de vérification & 5 boutons de réponse */}
                          <div className="pt-2 border-t border-slate-200/70">
                            <p className="text-xs font-medium text-slate-600 mb-2.5">
                              {deliv.question}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {CHECKLIST_OPTIONS.map((opt) => {
                                const isSelected = entry.answer === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() =>
                                      handleUpdateChecklistItem(deliv.id, {
                                        answer: isSelected ? "" : opt,
                                      })
                                    }
                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                                      isSelected
                                        ? "bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-2xs"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Ligne 3 : Statut automatique, Recommandation, Ressource TTSFR et Preuve */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-slate-200/70 items-center text-xs">
                            <div className="lg:col-span-5 flex flex-wrap items-center gap-3">
                              <div>
                                <span className="text-[11px] text-slate-400 block">
                                  Statut du livrable
                                </span>
                                <strong
                                  className={`font-bold ${
                                    rule?.tone === "rose"
                                      ? "text-rose-700"
                                      : rule?.tone === "amber"
                                      ? "text-amber-700"
                                      : rule?.tone === "emerald"
                                      ? "text-emerald-700"
                                      : rule?.tone === "blue"
                                      ? "text-blue-700"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {rule ? rule.status : "À renseigner"}
                                </strong>
                              </div>
                              <div className="h-6 w-px bg-slate-200" />
                              <div>
                                <span className="text-[11px] text-slate-400 block">
                                  Action recommandée
                                </span>
                                <strong className="font-semibold text-slate-800">
                                  {rule ? rule.action : "Choisir une réponse"}
                                </strong>
                              </div>
                            </div>

                            <div className="lg:col-span-4">
                              <input
                                type="text"
                                value={entry.proof || ""}
                                onChange={(e) =>
                                  handleUpdateChecklistItem(deliv.id, {
                                    proof: e.target.value,
                                  })
                                }
                                placeholder={`Preuve / commentaire (${deliv.expectedProof})...`}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A]"
                              />
                            </div>

                            <div className="lg:col-span-3 flex items-center justify-end">
                              {entry.answer !== "Non applicable" && (
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                                  <FileText className="h-3.5 w-3.5 text-[#0F4C3A]" />
                                  <span>
                                    {rule ? rule.resourceState : "Modèle TTSFR"} ({deliv.resourceFormat})
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          ) : (
            /* =================================================================
               SOUS-ONGLET 2 : TRACKER D'IMPACT (18 Indicateurs KPI, KVI et KWI)
               ================================================================= */
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] block">
                    Module 07 — Suivi et étude d’impact
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                    Tracker des indicateurs KPI, KVI et KWI
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Renseignez la valeur initiale, la valeur actuelle et le gain obtenu pour mesurer l&apos;impact opérationnel (KPI), la valeur créée (KVI) et le bien-être des membres (KWI).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(["ALL", "KPI", "KVI", "KWI"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedImpactType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedImpactType === t
                          ? "bg-[#0F4C3A] text-white border-[#0F4C3A]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {t === "ALL" ? "Tous (18)" : t}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleExportImpactCSV}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Exporter Tracker (CSV)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredImpactIndicators.map((ind) => {
                  const val = impactEntries[ind.id] || {};
                  const badgeStyle =
                    ind.type === "KPI"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : ind.type === "KVI"
                      ? "bg-emerald-50 text-[#0F4C3A] border-emerald-200"
                      : "bg-purple-50 text-purple-700 border-purple-200";

                  return (
                    <div
                      key={ind.id}
                      className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                    >
                      <div className="lg:col-span-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border ${badgeStyle}`}
                          >
                            {ind.type}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {ind.objective}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {ind.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Formule : <span className="font-mono text-slate-700">{ind.method}</span> · Cible :{" "}
                          <strong className="text-[#0F4C3A]">{ind.target}</strong> ({ind.frequency})
                        </p>
                      </div>

                      <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                            Valeur initiale
                          </label>
                          <input
                            type="text"
                            value={val.initialValue || ""}
                            onChange={(e) =>
                              handleUpdateImpactItem(ind.id, {
                                initialValue: e.target.value,
                              })
                            }
                            placeholder="Ex: 12 %"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0F4C3A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                            Valeur actuelle
                          </label>
                          <input
                            type="text"
                            value={val.currentValue || ""}
                            onChange={(e) =>
                              handleUpdateImpactItem(ind.id, {
                                currentValue: e.target.value,
                              })
                            }
                            placeholder="Ex: 19 %"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0F4C3A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                            Gain mesuré
                          </label>
                          <input
                            type="text"
                            value={val.gain || ""}
                            onChange={(e) =>
                              handleUpdateImpactItem(ind.id, {
                                gain: e.target.value,
                              })
                            }
                            placeholder="Ex: +7 pts"
                            className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/40 font-bold text-[#0F4C3A] focus:outline-none focus:border-[#0F4C3A]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* =====================================================================
          SECTION 3 : PROFIL COOPÉRATIVE (Fiche d'identité complète & édition)
         ===================================================================== */}
      {activeSection === "profil" && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="pb-5 mb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Profil de la coopérative
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Consultez et mettez à jour les informations administratives, les effectifs et le descriptif d&apos;activité.
                </p>
              </div>
              {profileSavedMsg && (
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F4C3A] text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Modifications enregistrées</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Lecture seule : Dénomination & Secteur ODCO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">
                    Dénomination officielle
                  </span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">
                    {coopProfile?.name || "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">
                    Secteur &amp; Sous-secteur ODCO
                  </span>
                  <strong className="text-sm font-bold text-[#0F4C3A] block mt-1">
                    {coopProfile?.sector?.name || "Non renseigné"}
                    {coopProfile?.sub_sector?.name ? ` · ${coopProfile.sub_sector.name}` : ""}
                  </strong>
                </div>
              </div>

              {/* Champs éditables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Total adhérents / membres
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.member_count}
                    onChange={(e) =>
                      setEditForm({ ...editForm, member_count: parseInt(e.target.value) || 1 })
                    }
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-1 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Nombre de femmes adhérentes ({womenPercentage} %)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.women_member_count}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        women_member_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-1 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Ville / Commune
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-1 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] focus:outline-none"
                    placeholder="Ex: Benguerir"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Région
                  </label>
                  <input
                    type="text"
                    value={editForm.region}
                    onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-1 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] focus:outline-none"
                    placeholder="Ex: Marrakech-Safi"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Description des activités et gamme de produits
                </label>
                <textarea
                  rows={4}
                  value={editForm.activity_description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, activity_description: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 leading-relaxed focus:ring-1 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] focus:outline-none"
                  placeholder="Détaillez vos produits, procédés de fabrication ou services..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-semibold text-xs sm:text-sm inline-flex items-center space-x-2 transition disabled:opacity-50 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {isSavingProfile
                      ? "Enregistrement..."
                      : "Enregistrer les modifications"}
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default function CooperativeDashboard() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#0F4C3A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Chargement de votre espace...</p>
          </div>
        </div>
      }
    >
      <CooperativeDashboardContent />
    </Suspense>
  );
}
