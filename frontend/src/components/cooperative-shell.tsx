"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Compass,
  Building2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Cooperative } from "@/lib/types";

export type CoopSection = "overview" | "diagnostic" | "accompagnement" | "profil";

interface CooperativeShellProps {
  activeSection: CoopSection;
  onSelectSection?: (section: CoopSection) => void;
  coopProfile?: Cooperative | null;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const NAV_ITEMS: {
  id: CoopSection;
  label: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "overview",
    label: "Vue d'ensemble",
    subtitle: "Synthèse & indicateurs",
    href: "/cooperative/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "diagnostic",
    label: "Mon diagnostic",
    subtitle: "Évaluation en 5 étapes",
    href: "/cooperative/diagnostic",
    icon: ClipboardCheck,
  },
  {
    id: "accompagnement",
    label: "Parcours d'accompagnement",
    subtitle: "Les 4 familles de modules",
    href: "/cooperative/dashboard?section=accompagnement",
    icon: Compass,
  },
  {
    id: "profil",
    label: "Profil coopérative",
    subtitle: "Fiche d'identité & édition",
    href: "/cooperative/dashboard?section=profil",
    icon: Building2,
  },
];

export function CooperativeShell({
  activeSection,
  onSelectSection,
  coopProfile,
  headerRight,
  children,
}: CooperativeShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = coopProfile?.name || user?.full_name || "Espace Coopérative";
  const initials = displayName
    .replace(/^Coopérative\s+/i, "")
    .slice(0, 2)
    .toUpperCase();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof NAV_ITEMS)[number]
  ) => {
    // If we are already on /cooperative/dashboard and clicking one of the dashboard sections,
    // switch smoothly via state + URL query update.
    if (
      pathname === "/cooperative/dashboard" &&
      item.id !== "diagnostic" &&
      onSelectSection
    ) {
      e.preventDefault();
      onSelectSection(item.id);
      window.history.replaceState(null, "", item.href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // When navigating between different pages (e.g. diagnostic <-> dashboard),
    // refresh Next.js router cache to prevent showing stale states
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barre supérieure pleine largeur */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="w-full px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/images/logo_um6p_gti.png"
                alt="UM6P | GTI Green Tech Institute"
                width={190}
                height={30}
                priority
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-600 font-medium hidden sm:inline truncate">
              Espace d&apos;Accompagnement Technique
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            {headerRight}
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[260px]">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
                {user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              title="Déconnexion"
              className="px-3 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 transition flex items-center space-x-1.5 text-xs font-semibold whitespace-nowrap"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Corps principal : Sidebar gauche + Zone de contenu */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* Sidebar de navigation gauche */}
        <aside className="w-full lg:w-64 xl:w-72 lg:flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
          <div className="p-4 sm:p-5">
            {/* Carte miniature de la coopérative */}
            <div className="hidden lg:flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
              <div className="h-10 w-10 rounded-xl bg-[#0F4C3A] text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {coopProfile?.sector?.name || "Coopérative partenaire"}
                </p>
              </div>
            </div>

            {/* Menu des 4 sections */}
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    prefetch={false}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl transition flex-shrink-0 lg:flex-shrink ${
                      isActive
                        ? "bg-[#0F4C3A] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block whitespace-nowrap lg:whitespace-normal">
                        {item.label}
                      </span>
                      <span
                        className={`text-[11px] hidden lg:block truncate ${
                          isActive ? "text-emerald-100/90" : "text-slate-400"
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Zone de contenu de la section active */}
        <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 animate-fade-in">
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Footer simple sans répétition du logo */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="w-full px-5 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>Plateforme TTSFR — Espace d&apos;Accompagnement des Coopératives</p>
          <p>© 2026 Tous droits réservés</p>
        </div>
      </footer>

      {/* Modale de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
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
              Êtes-vous sûr de vouloir vous déconnecter de votre espace coopérative ?
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

