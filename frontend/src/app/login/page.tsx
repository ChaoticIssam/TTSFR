"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const MOROCCAN_REGIONS = [
  { value: "Beni Mellal-Khenifra", label: "Béni Mellal-Khénifra" },
  { value: "Casablanca-Settat", label: "Casablanca-Settat" },
  { value: "Dakhla-Oued Ed-Dahab", label: "Dakhla-Oued Ed-Dahab" },
  { value: "Draa-Tafilalet", label: "Drâa-Tafilalet" },
  { value: "Fes-Meknes", label: "Fès-Meknès" },
  { value: "Guelmim-Oued Noun", label: "Guelmim-Oued Noun" },
  { value: "Laayoune-Sakia El Hamra", label: "Laâyoune-Sakia El Hamra" },
  { value: "Marrakech-Safi", label: "Marrakech-Safi" },
  { value: "Oriental", label: "Oriental" },
  { value: "Rabat-Sale-Kenitra", label: "Rabat-Salé-Kénitra" },
  { value: "Souss-Massa", label: "Souss-Massa" },
  { value: "Tanger-Tetouan-Al Hoceima", label: "Tanger-Tétouan-Al Hoceïma" },
];

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regCoopName, setRegCoopName] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRegion, setRegRegion] = useState("Marrakech-Safi");
  const [regCity, setRegCity] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync tab with URL query param if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "register") {
      setActiveTab("register");
    } else if (tabParam === "login") {
      setActiveTab("login");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);
      if (user.role === "COOPERATIVE") {
        router.push("/cooperative/dashboard");
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      const error = err as { detail?: string };
      setErrorMessage(
        error.detail || "Identifiants invalides. Veuillez vérifier votre adresse e-mail et mot de passe."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword.length < 6) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: regEmail,
        password: regPassword,
        full_name: regFullName,
        cooperative_name: regCoopName,
        phone: regPhone || undefined,
        region: regRegion || undefined,
        city: regCity || undefined,
      });

      setSuccessMessage("Compte créé avec succès ! Redirection en cours...");
      setTimeout(() => {
        router.push("/cooperative/dashboard");
      }, 1000);
    } catch (err: unknown) {
      const error = err as { detail?: string };
      setErrorMessage(
        error.detail || "Erreur lors de l'inscription. Veuillez vérifier les informations saisies."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setActiveTab("login");
    setLoginEmail(demoEmail);
    setLoginPassword(demoPass);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">
          {activeTab === "login" ? "Connexion à votre espace" : "Inscription Coopérative"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === "login"
            ? "Entrez vos identifiants pour accéder à la plateforme TTSFR."
            : "Renseignez les informations de votre coopérative."}
        </p>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[#0F4C3A] text-xs flex items-start space-x-2">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#0F4C3A]" />
          <span className="leading-relaxed font-medium">{successMessage}</span>
        </div>
      )}

      {/* Tab 1: Connexion */}
      {activeTab === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Adresse e-mail
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="contact@cooperative.ma"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-slate-700"
              >
                Mot de passe
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showLoginPassword ? "text" : "password"}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-10 py-2 text-sm rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                aria-label={showLoginPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showLoginPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold text-sm transition disabled:opacity-50"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-medium text-slate-500 mb-2">
              Comptes de test (1-clic) :
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill("pilote1@coop.ma", "CoopPilote1!")}
                className="py-1.5 px-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 transition truncate text-center"
                title="Coopérative 3ème Millénaire (Lamima - Rehamna)"
              >
                3ème Millénaire
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("pilote2@coop.ma", "CoopPilote2!")}
                className="py-1.5 px-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 transition truncate text-center"
                title="Coopérative Nahla Al Hamra (Honee Bee - Benslimane)"
              >
                Nahla Al Hamra
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("admin@ttsfr.um6p.ma", "AdminTTSFR2026!")}
                className="py-1.5 px-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 transition truncate text-center"
                title="Dr. Sabah BELIL - Supervision UM6P/GTI"
              >
                Admin (UM6P)
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Inscription */}
      {activeTab === "register" && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="reg-coop-name"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Nom de la coopérative <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-coop-name"
              type="text"
              required
              value={regCoopName}
              onChange={(e) => setRegCoopName(e.target.value)}
              placeholder="ex: Coopérative Al Baraka"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="reg-full-name"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Représentant <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-full-name"
                type="text"
                required
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Nom complet"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
              />
            </div>
            <div>
              <label
                htmlFor="reg-phone"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Téléphone
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Adresse e-mail <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="contact@coop.ma"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="reg-region"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Région
              </label>
              <select
                id="reg-region"
                value={regRegion}
                onChange={(e) => setRegRegion(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
              >
                {MOROCCAN_REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="reg-city"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Ville / Commune
              </label>
              <input
                id="reg-city"
                type="text"
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                placeholder="ex: Benguerir"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Mot de passe (min. 6 car.) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showRegPassword ? "text" : "password"}
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-9 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition"
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                aria-label={showRegPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showRegPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold text-xs transition disabled:opacity-50"
          >
            {isLoading ? "Création en cours..." : "Créer mon compte coopérative"}
          </button>
        </form>
      )}

      {/* Switch link */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        {activeTab === "login" ? (
          <p className="text-xs text-slate-600">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className="font-semibold text-[#0F4C3A] hover:underline"
            >
              Créer un compte
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-600">
            Déjà inscrit ?{" "}
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className="font-semibold text-[#0F4C3A] hover:underline"
            >
              Se connecter
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      {/* Centered UM6P | GTI Logo */}
      <Link href="/" className="mb-6 flex items-center group">
        <Image
          src="/images/logo_um6p_gti.png"
          alt="UM6P | GTI Green Tech Institute"
          width={190}
          height={30}
          priority
          className="h-7 w-auto object-contain transition-transform group-hover:scale-[1.02]"
        />
      </Link>

      {/* Main Authentication Card */}
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center text-slate-400 text-xs shadow-sm border border-slate-200">
            Chargement...
          </div>
        }
      >
        <AuthForm />
      </Suspense>

      {/* Back to Home & Institutional Notice */}
      <div className="mt-6 text-center space-y-1">
        <div>
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            ← Retour à l'accueil
          </Link>
        </div>
        <p className="text-[11px] text-slate-400">
          Plateforme TTSFR • UM6P & GTI
        </p>
      </div>
    </div>
  );
}
