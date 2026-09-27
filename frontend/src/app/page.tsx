import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu, Leaf, Users, BookOpen, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Institutional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-[#0F4C3A] tracking-tight">UM6P</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">GTI</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium text-slate-600">Fondation OCP</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-700">
            <a href="#approche" className="hover:text-[#0F4C3A] transition">Notre approche</a>
            <a href="#domaines" className="hover:text-[#0F4C3A] transition">Domaines d'accompagnement</a>
            <a href="#clusters" className="hover:text-[#0F4C3A] transition">Clusters de maturité</a>
            <a href="#partenaires" className="hover:text-[#0F4C3A] transition">Partenaires</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link
              href="/cooperative/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#0F4C3A] text-white hover:bg-[#135D43] transition shadow-sm"
            >
              Espace Coopérative
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white py-16 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-100/70 text-[#0F4C3A] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <span>Projet de Recherche TTSFR</span>
              <span>•</span>
              <span>Pilote Opérationnel</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Un Modèle Évolutif pour la <span className="text-[#0F4C3A]">Transformation Durable</span> des Coopératives
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Digitalisez votre parcours de diagnostic, évaluez vos maturités opérationnelle, économique, technologique et énergétique, et bénéficiez de plans d'action sur mesure développés par l'UM6P et la Fondation OCP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cooperative/diagnostic"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-[#10B981] text-white hover:bg-emerald-600 transition shadow-md hover:shadow-lg group"
              >
                <span>Lancer mon diagnostic pilote</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/cooperative/dashboard"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Découvrir l'Espace d'accompagnement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Accompaniment Domains (From Slide 58) */}
      <section id="domaines" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Nos Domaines d'Accompagnement</h2>
            <p className="mt-3 text-slate-600">Six piliers stratégiques pour accélérer la montée en compétences et la durabilité.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Mise à niveau technique", desc: "Optimisez vos processus, votre maintenance et vos outils de production.", icon: Cpu },
              { title: "Certification et Conformité", desc: "Transformez les normes réglementaires et sanitaires en leviers de croissance.", icon: ShieldCheck },
              { title: "Durabilité & Économie circulaire", desc: "Transition écologique, valorisation des déchets et sobriété en eau.", icon: Leaf },
              { title: "Digitalisation et visibilité", desc: "Développez votre présence en ligne, votre traçabilité et vos canaux e-commerce.", icon: BookOpen },
              { title: "Formation & Capability Building", desc: "Renforcez les compétences managériales, techniques et humaines des coopérateurs.", icon: Users },
              { title: "Suivi & Étude d'impact", desc: "Pilotez vos indicateurs clés avec des données fiables et mesurables.", icon: CheckCircle2 },
            ].map((domain, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
                <div className="h-12 w-12 rounded-xl bg-emerald-100/70 text-[#0F4C3A] flex items-center justify-center mb-4">
                  <domain.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{domain.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{domain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 6 Clusters Typology (From Slide 57) */}
      <section id="clusters" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">La Typologie des 6 Clusters</h2>
            <p className="mt-3 text-slate-600">Le diagnostic classe automatiquement chaque coopérative selon sa réalité opérationnelle.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Artisanal traditionnel", tag: "Savoir-faire manuel et valorisation du patrimoine" },
              { name: "Transformation légère", tag: "Conditionnement et valorisation semi-mécanisée" },
              { name: "Production mécanisée", tag: "Équipements automatisés et cadences régulières" },
              { name: "Industriel / Extractif", tag: "Haute capacité technique et volumes importants" },
              { name: "Services organisés", tag: "Prestations structurées, logistique et accueil" },
              { name: "Services cognitifs & numériques", tag: "Ingénierie, conseil et commerce digital" },
            ].map((cluster, i) => (
              <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wide">Cluster {i + 1}</span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{cluster.name}</h4>
                  <p className="text-xs text-slate-500 mt-2">{cluster.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F4C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-bold text-lg">Projet TTSFR</p>
            <p className="text-sm text-emerald-100/70 mt-1">Université Mohammed VI Polytechnique (UM6P) • Green Tech Institute • Fondation OCP</p>
          </div>
          <div className="text-sm text-emerald-100/70">
            © 2026 TTSFR. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
