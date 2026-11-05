"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  LogOut,
  RefreshCw,
  Eye,
  Layers,
  Sparkles,
  TrendingUp,
  MapPin,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Cooperative, DiagnosticSubmission, Cluster } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, logout } = useAuth();

  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticSubmission[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>("ALL");
  const [inspectCoop, setInspectCoop] = useState<Cooperative | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Guard: Accessible only by TTSFR Supervisory Team
  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        router.push("/login");
      } else if (user && user.role === "COOPERATIVE") {
        router.push("/cooperative/dashboard");
      }
    }
  }, [authLoading, token, user, router]);

  useEffect(() => {
    if (token && user && user.role !== "COOPERATIVE") {
      fetchAdminData();
    }
  }, [token, user]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [coopList, diagList, clusterList] = await Promise.all([
        api.get<Cooperative[]>("/cooperatives"),
        api.get<DiagnosticSubmission[]>("/diagnostics"),
        api.get<Cluster[]>("/clusters"),
      ]);
      setCooperatives(coopList);
      setDiagnostics(diagList);
      setClusters(clusterList);
    } catch {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  };

  // Associate each cooperative with its latest diagnostic
  const coopDiagnosticsMap = new Map<string, DiagnosticSubmission>();
  diagnostics.forEach((diag) => {
    const existing = coopDiagnosticsMap.get(diag.cooperative_id);
    if (!existing || new Date(diag.created_at) > new Date(existing.created_at)) {
      coopDiagnosticsMap.set(diag.cooperative_id, diag);
    }
  });

  const clusterMap = new Map<string, Cluster>();
  clusters.forEach((c) => clusterMap.set(c.id, c));

  // Compute aggregated stats
  const totalCoops = cooperatives.length;
  const submittedDiags = diagnostics.filter((d) => d.status === "SUBMITTED");
  const totalSubmitted = submittedDiags.length;
  const avgGlobalScore =
    totalSubmitted > 0
      ? Math.round(
          submittedDiags.reduce((acc, curr) => acc + (curr.score_global || 0), 0) / totalSubmitted
        )
      : 0;

  // Filter cooperatives
  const filteredCooperatives = cooperatives.filter((coop) => {
    const matchesSearch =
      coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coop.city && coop.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coop.region && coop.region.toLowerCase().includes(searchTerm.toLowerCase()));

    const latestDiag = coopDiagnosticsMap.get(coop.id);
    const matchesCluster =
      selectedClusterFilter === "ALL" ||
      (latestDiag && latestDiag.cluster_id === selectedClusterFilter);

    return matchesSearch && matchesCluster;
  });

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nom Cooperative",
      "Region",
      "Ville",
      "Membres Total",
      "Femmes Adherentes",
      "Secteur ODCO",
      "Statut Diagnostic",
      "Cluster Attribue",
      "Score Global (%)",
      "Score Operationnel (%)",
      "Score Economique (%)",
      "Score Organisationnel (%)",
      "Score Tech & Energie (%)",
      "Date Dernier Diagnostic",
    ];

    const rows = cooperatives.map((c) => {
      const diag = coopDiagnosticsMap.get(c.id);
      const cluster = diag?.cluster_id ? clusterMap.get(diag.cluster_id) : null;
      return [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.region || "Non precise"}"`,
        `"${c.city || "Non precise"}"`,
        c.member_count,
        c.women_member_count,
        `"${c.sector?.name || "Non precise"}"`,
        `"${diag ? diag.status : "NON_DEBUTE"}"`,
        `"${cluster ? cluster.name : "Non attribue"}"`,
        diag?.score_global ?? "",
        diag?.score_operational ?? "",
        diag?.score_economic ?? "",
        diag?.score_organizational ?? "",
        diag?.score_tech_energy ?? "",
        `"${diag ? new Date(diag.created_at).toLocaleDateString("fr-FR") : ""}"`,
      ].join(";");
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `synthese_ttsfr_cooperatives_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0F4C3A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Chargement de l'espace de supervision...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center flex-shrink-0">
              <Image
                src="/images/logo_um6p_gti.png"
                alt="UM6P | GTI Green Tech Institute"
                width={190}
                height={30}
                priority
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-600 font-medium hidden sm:inline">
              Supervision TTSFR
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Superviseur : {user?.full_name || "Équipe de Coordination"}
            </span>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#0F4C3A] hover:bg-[#0d4031] text-white text-xs font-bold shadow-xs transition"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              <span>Exporter Synthèse (CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              title="Se déconnecter"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Coopératives Suivies
              </span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">
                {totalCoops}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                Phase Pilote 2026
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Diagnostics Validés
              </span>
              <span className="text-3xl font-black text-[#0F4C3A] mt-1 block">
                {totalSubmitted}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                Clusters attribués
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Score Moyen Global
              </span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">
                {avgGlobalScore}%
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                Moyenne 4 dimensions
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Méthode Déterministe
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-1 block">
                Pondération 35/15/20/15/15
              </span>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                Conforme modèle Excel
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Cpu className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Distribution of 6 Clusters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Distribution selon les 6 Archétypes de Maturité (Clusters TTSFR)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cartographie des coopératives selon la matrice technico-fonctionnelle issue du diagnostic.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0F4C3A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Méthode MVP • Pondération 35/15/20/15/15
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {clusters.map((c) => {
              const count = diagnostics.filter(
                (d) => d.status === "SUBMITTED" && d.cluster_id === c.id
              ).length;
              const isSelected = selectedClusterFilter === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClusterFilter(isSelected ? "ALL" : c.id)}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    isSelected
                      ? "border-[#0F4C3A] bg-slate-50 shadow-xs ring-1 ring-[#0F4C3A]"
                      : "border-slate-200 bg-slate-50/60 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xl font-black text-slate-900">{count}</span>
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: c.color_code || "#0F4C3A" }}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                    {c.name}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cooperatives & Diagnostics Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par coopérative, ville, région..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedClusterFilter !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedClusterFilter("ALL")}
                  className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition"
                >
                  <span>Filtre actif : {clusters.find((c) => c.id === selectedClusterFilter)?.name}</span>
                  <X className="h-3.5 w-3.5 ml-1" />
                </button>
              )}

              <button
                type="button"
                onClick={fetchAdminData}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                title="Actualiser"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Coopérative</th>
                  <th className="px-5 py-3.5">Localisation</th>
                  <th className="px-5 py-3.5">Adhérents</th>
                  <th className="px-5 py-3.5">Statut Diag</th>
                  <th className="px-5 py-3.5">Cluster Attribué</th>
                  <th className="px-5 py-3.5 text-center">Compatibilité</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCooperatives.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                      Aucune coopérative ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                ) : (
                  filteredCooperatives.map((c) => {
                    const diag = coopDiagnosticsMap.get(c.id);
                    const cluster = diag?.cluster_id ? clusterMap.get(diag.cluster_id) : null;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900 block text-sm">{c.name}</span>
                          <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-block mt-0.5">
                            {c.sector?.name || "Secteur ODCO"}{c.sub_sector ? ` • ${c.sub_sector.name}` : ""}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-medium text-slate-800 block">{c.city || "Non renseigné"}</span>
                          <span className="text-[11px] text-slate-400 block">{c.region || "Région inconnue"}</span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-800 block">{c.member_count} membres</span>
                          <span className="text-[11px] text-slate-400">dont {c.women_member_count} femmes</span>
                        </td>

                        <td className="px-5 py-4">
                          {diag?.status === "SUBMITTED" ? (
                            <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                              Validé (5/5)
                            </span>
                          ) : diag?.status === "DRAFT" ? (
                            <span className="inline-flex items-center text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                              <Clock className="h-3 w-3 mr-1 text-amber-600" />
                              Brouillon (Étape {diag.current_step}/5)
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">Non débuté</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {cluster ? (
                            <span className="inline-flex items-center text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <span
                                className="h-2 w-2 rounded-full mr-1.5"
                                style={{ backgroundColor: cluster.color_code || "#10B981" }}
                              />
                              {cluster.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">En attente</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          {diag?.status === "SUBMITTED" &&
                          cluster?.code &&
                          diag.answers?.cluster_compatibilities?.[cluster.code] != null ? (
                            <span className="text-sm font-extrabold text-[#0F4C3A]">
                              {Number(diag.answers.cluster_compatibilities[cluster.code]).toFixed(1).replace(".", ",")} %
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectCoop(c)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-xs font-semibold transition"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1 text-emerald-700" />
                            <span>Détails</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Inspect Modal */}
      {inspectCoop && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Fiche Coopérative Pilote
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{inspectCoop.name}</h3>
                <p className="text-xs text-slate-500">{inspectCoop.city} • {inspectCoop.region}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectCoop(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inspection details */}
            {(() => {
              const diag = coopDiagnosticsMap.get(inspectCoop.id);
              const cluster = diag?.cluster_id ? clusterMap.get(diag.cluster_id) : null;

              return (
                <div className="space-y-6">
                  {/* General attributes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Adhérents totaux</span>
                      <span className="font-bold text-slate-900 text-sm">{inspectCoop.member_count}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Femmes adhérentes</span>
                      <span className="font-bold text-slate-900 text-sm">{inspectCoop.women_member_count}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Secteur & Sous-secteur ODCO</span>
                      <span className="font-bold text-emerald-800 text-xs block">
                        {inspectCoop.sector?.name || "Non précisé"}{inspectCoop.sub_sector ? ` • ${inspectCoop.sub_sector.name}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic status & scores */}
                  <div className="border border-slate-200 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-900">Évaluation & Diagnostic de Maturité</h4>
                      {diag?.status === "SUBMITTED" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Diagnostic Finalisé
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          En cours de saisie
                        </span>
                      )}
                    </div>

                    {diag?.status === "SUBMITTED" ? (
                      <div>
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/70 mb-4 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Cluster Attribué</span>
                            <span className="text-base font-extrabold text-[#0F4C3A]">{cluster?.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Compatibilité Max</span>
                            <span className="text-xl font-black text-[#0F4C3A]">
                              {diag.answers?.cluster_compatibilities && cluster?.code && diag.answers.cluster_compatibilities[cluster.code] != null
                                ? `${Number(diag.answers.cluster_compatibilities[cluster.code]).toFixed(1).replace(".", ",")} %`
                                : "—"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-4">
                          {[
                            { label: "Opérationnel", val: diag.score_operational ?? 0 },
                            { label: "Économique", val: diag.score_economic ?? 0 },
                            { label: "Organisation", val: diag.score_organizational ?? 0 },
                            { label: "Tech/Énergie", val: diag.score_tech_energy ?? 0 },
                          ].map((d) => {
                            const lvl = d.val < 25 ? "Niv. 1 - Initial" : d.val < 50 ? "Niv. 2 - Structuration" : d.val < 75 ? "Niv. 3 - Avancé" : "Niv. 4 - Performant";
                            return (
                              <div key={d.label} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-[10px] text-slate-400 block uppercase">{d.label}</span>
                                <span className="font-extrabold text-slate-900 text-sm block">{d.val}%</span>
                                <span className="text-[10px] font-semibold text-slate-600 block mt-0.5">{lvl}</span>
                              </div>
                            );
                          })}
                        </div>

                        {diag.answers?.cluster_compatibilities && (
                          <div className="border-t border-slate-100 pt-3">
                            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                              Compatibilité avec les 6 Clusters (Profil P1 à P5)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                              {clusters.map((cl) => {
                                const cScore = diag.answers.cluster_compatibilities[cl.code];
                                const isAssigned = cl.id === diag.cluster_id;
                                return (
                                  <div
                                    key={cl.id}
                                    className={`p-2 rounded-lg border flex items-center justify-between ${
                                      isAssigned ? "bg-emerald-50 border-[#0F4C3A] font-bold text-[#0F4C3A]" : "bg-white border-slate-200 text-slate-700"
                                    }`}
                                  >
                                    <span className="truncate mr-2 text-[11px]">{cl.name}</span>
                                    <span className="font-bold text-[11px] flex-shrink-0">
                                      {cScore != null ? `${Number(cScore).toFixed(1).replace(".", ",")}%` : "-"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        La coopérative n'a pas encore soumis son diagnostic complet.
                      </p>
                    )}
                  </div>

                  <div className="text-right pt-2">
                    <button
                      type="button"
                      onClick={() => setInspectCoop(null)}
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900">
              Confirmer la déconnexion
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Êtes-vous sûr de vouloir vous déconnecter de l&apos;espace de supervision ?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  router.push("/login");
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
