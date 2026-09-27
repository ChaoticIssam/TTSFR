import Link from "next/link";
import { ArrowRight, ChevronRight, Cpu, ShieldCheck, Leaf, BookOpen, Users, CheckCircle2 } from "lucide-react";

export default function CooperativeDashboard() {
  const domains = [
    { title: "Mise à niveau technique", subtitle: "Optimiser vos processus et outils", icon: Cpu },
    { title: "Certification et Conformité", subtitle: "Transformer les normes en leviers", icon: ShieldCheck },
    { title: "Durabilité & Économie circulaire", subtitle: "Transition écologique & innovation", icon: Leaf },
    { title: "Digitalisation et visibilité", subtitle: "Présence digitale et marchés", icon: BookOpen },
    { title: "Formation & Capability Building", subtitle: "Renforcer vos compétences", icon: Users },
    { title: "Suivi & Étude d'impact", subtitle: "Piloter avec des données fiables", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Mobile-optimized Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl flex flex-col border-x border-slate-200">
        
        {/* Header Bar */}
        <header className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#0F4C3A] text-lg tracking-tight">UM6P</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-emerald-800">Fondation OCP</span>
          </div>
          <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-900">
            Accueil
          </Link>
        </header>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#0F4C3A] to-[#135D43] text-white p-6 rounded-b-3xl shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2.5 py-1 rounded-full">
            Espace Coopérative
          </span>
          <h1 className="text-2xl font-bold mt-3 leading-snug">
            Espace d'accompagnement des coopératives
          </h1>
          <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
            Avancez sereinement avec des ressources conçues pour votre activité.
          </p>
        </div>

        {/* Main Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Nos domaines d'accompagnement
              </h2>
              <span className="text-[11px] text-slate-400">6 piliers</span>
            </div>

            {/* List of Domains matching Slide 58 */}
            <div className="space-y-3">
              {domains.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-[#0F4C3A] flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Bottom Action Button */}
          <div className="pt-6 pb-4">
            <Link
              href="/cooperative/diagnostic"
              className="w-full inline-flex items-center justify-center py-4 px-6 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition group"
            >
              <span>Lancer mon diagnostic</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <p className="text-[11px] text-center text-slate-400 mt-2.5">
              Sauvegarde automatique à chaque étape
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
