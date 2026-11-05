"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Cluster, Cooperative, DiagnosticSubmission } from "@/lib/types";
import {
  CooperativeShell,
  CoopSection,
} from "@/components/cooperative-shell";

const CLUSTER_NAMES: Record<string, string> = {
  SERVICES_COGNITIFS: "Services cognitifs et numériques",
  SERVICES_ORGANISES: "Services organisés",
  INDUSTRIEL_EXTRACTIF: "Industriel / extractif",
  PRODUCTION_MECANISEE: "Production mécanisée",
  TRANSFORMATION_LEGERE: "Transformation légère",
  ARTISANAL_TRADITIONNEL: "Artisanal traditionnel",
};

export default function CooperativeDashboard() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [activeSection, setActiveSection] = useState<CoopSection>("overview");
  const [coopProfile, setCoopProfile] = useState<Cooperative | null>(null);
  const [latestDiag, setLatestDiag] = useState<DiagnosticSubmission | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const [editForm, setEditForm] = useState({
    member_count: 1,
    women_member_count: 0,
    activity_description: "",
    region: "",
    city: "",
    registration_number: "",
  });

  // Read initial ?section= query parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section");
      if (sec === "accompagnement" || sec === "profil" || sec === "overview") {
        setActiveSection(sec);
      }
    }
  }, []);

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
    try {
      const [coop, clusterList] = await Promise.all([
        api.get<Cooperative>("/cooperatives/me"),
        api.get<Cluster[]>("/clusters").catch(() => [] as Cluster[]),
      ]);
      setCoopProfile(coop);
      setClusters(clusterList);
      setEditForm({
        member_count: coop.member_count,
        women_member_count: coop.women_member_count,
        activity_description: coop.activity_description || "",
        region: coop.region || "",
        city: coop.city || "",
        registration_number: coop.registration_number || "",
      });

      try {
        const diag = await api.get<DiagnosticSubmission>("/diagnostics/my-latest");
        setLatestDiag(diag);
      } catch {
        setLatestDiag(null);
      }
    } catch {
      // Ignore transient errors
    }
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
      setCoopProfile(updated);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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

  const weakestDim = [...dimensionList].sort((a, b) => a.val - b.val)[0];

  const officialModules = [
    {
      category: "1. Modules transversaux",
      subtitle: "Socle commun à toutes les coopératives",
      title: "Structuration et gouvernance",
      items: [
        "Clarification des rôles et responsabilités entre adhérentes",
        "Organisation documentaire et tenue des registres statutaires",
        "Suivi de la qualité et réduction des pertes matières",
      ],
    },
    {
      category: "2. Modules sectoriels (ODCO)",
      subtitle: coopProfile?.sector?.name
        ? `${coopProfile.sector.name}${coopProfile.sub_sector?.name ? ` · ${coopProfile.sub_sector.name}` : ""}`
        : "Adaptés à votre filière d'activité",
      title: "Conformité et valorisation filière",
      items: [
        "Accompagnement agrément sanitaire ONSSA et bonnes pratiques d'hygiène",
        "Traçabilité des lots, étiquetage réglementaire et conditionnement",
        "Valorisation commerciale terroir et accès aux circuits professionnels",
      ],
    },
    {
      category: "3. Modules technologiques",
      subtitle: latestDiag?.answers?.p1
        ? `Processus : ${String(latestDiag.answers.p1)}`
        : "Adaptés à votre équipement",
      title: "Équipements et sobriété énergétique",
      items: [
        "Standardisation des étapes de production et ergonomie des postes",
        "Programme de maintenance préventive et entretien du matériel",
        "Suivi des consommations d'eau et d'énergie et valorisation des sous-produits",
      ],
    },
    {
      category: "4. Modules par niveau de maturité",
      subtitle: weakestDim
        ? `Priorité : ${weakestDim.title} (${weakestDim.val.toFixed(0)} %)`
        : "Progression par palier",
      title: "Feuille de route de montée en maturité",
      items: [
        "Calcul structuré du coût de revient et suivi régulier de la trésorerie",
        "Mise en place d'indicateurs simples de suivi de production et des ventes",
        "Déploiement d'outils numériques de gestion, sauvegarde et visibilité",
      ],
    },
  ];

  return (
    <CooperativeShell
      activeSection={activeSection}
      onSelectSection={setActiveSection}
      coopProfile={coopProfile}
    >
      {/* =====================================================================
          SECTION 1 : VUE D'ENSEMBLE (Synthèse épurée sur un seul écran)
         ===================================================================== */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* En-tête de la coopérative */}
          <section className="bg-white rounded-2xl border border-slate-200/90 px-6 py-5 sm:px-8 sm:py-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#0F4C3A] block">
                {coopProfile?.sector?.name || "Agriculture"}
                {coopProfile?.sub_sector?.name ? ` · ${coopProfile.sub_sector.name}` : ""}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate mt-0.5">
                {coopProfile ? coopProfile.name : "Chargement de la coopérative..."}
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
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-semibold text-xs sm:text-sm transition whitespace-nowrap"
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
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
            {latestDiag?.status === "SUBMITTED" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Colonne gauche (7 cols) : Maturité par dimension */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="mb-5">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      1. Maturité par dimension
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Scores évalués sur 100 % à partir des 20 questions de maturité.
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
                      Comparaison de votre mode opératoire avec les 6 profils types.
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
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-bold text-xs sm:text-sm transition whitespace-nowrap"
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
          SECTION 2 : PARCOURS D'ACCOMPAGNEMENT (Vue dédiée aux 4 modules TTSFR)
         ===================================================================== */}
      {activeSection === "accompagnement" && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Parcours d&apos;accompagnement recommandé
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Feuille de route structurée selon les 4 familles de modules du modèle TTSFR.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block">Cluster attribué</span>
                  <strong className="font-bold text-slate-900">{clusterDisplayName}</strong>
                </div>
                <div className="h-7 w-px bg-slate-200 hidden sm:block" />
                <div>
                  <span className="text-slate-400 block">Axe prioritaire</span>
                  <strong className="font-bold text-[#0F4C3A]">
                    {weakestDim ? `${weakestDim.title} (${weakestDim.val.toFixed(0)} %)` : "—"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {officialModules.map((mod) => (
                <div
                  key={mod.category}
                  className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/40 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] block">
                      {mod.category}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {mod.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 mb-4">
                      {mod.subtitle}
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-200/70 pt-4">
                      {mod.items.map((line) => (
                        <li key={line} className="flex items-start space-x-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0F4C3A] mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          SECTION 3 : PROFIL COOPÉRATIVE (Fiche d'identité complète & édition)
         ===================================================================== */}
      {activeSection === "profil" && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
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
                    {coopProfile?.sector?.name || "Agriculture"}
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
                  className="px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-semibold text-xs sm:text-sm inline-flex items-center space-x-2 transition disabled:opacity-50"
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
    </CooperativeShell>
  );
}
