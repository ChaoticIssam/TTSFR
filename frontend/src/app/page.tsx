import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Leaf,
  Users,
  BookOpen,
  Building2,
  Sparkles,
  BarChart3,
  Layers,
  ChevronRight,
} from "lucide-react";

type Partner = {
  name: string;
  role: string;
  desc: string;
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClass?: string;
  wordmark?: string;
};

const PARTNERS: Partner[] = [
  {
    name: "Université Mohammed VI Polytechnique",
    role: "Partenaire Académique",
    desc: "Pilotage scientifique, recherche appliquée et cadre méthodologique d'évaluation.",
    logo: "/images/logo_um6p.png",
    logoWidth: 160,
    logoHeight: 40,
    logoClass: "h-9 w-auto object-contain",
  },
  {
    name: "Green Tech Institute",
    role: "Coordination Technique",
    desc: "Coordination technique, ingénierie de la transition verte et efficacité énergétique.",
    logo: "/images/logo_gti.png",
    logoWidth: 150,
    logoHeight: 36,
    logoClass: "h-8 w-auto object-contain",
  },
  {
    name: "Fondation OCP",
    role: "Soutien Institutionnel",
    desc: "Soutien stratégique et accompagnement terrain des coopératives marocaines.",
    // TODO: remplacer par le logo officiel fourni par la Fondation OCP
    wordmark: "Fondation OCP",
  },
  {
    name: "Office du Développement de la Coopération",
    role: "Référentiel National",
    desc: "Nomenclature sectorielle de référence et données institutionnelles nationales.",
    logo: "/images/logo_odco.png",
    logoWidth: 140,
    logoHeight: 42,
    logoClass: "h-11 w-auto object-contain",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Institutional Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: Official Logos (UM6P | GTI) + Anchor Subroutes pushed to the left */}
          <div className="flex items-center space-x-6 xl:space-x-10">
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <Image
                src="/images/logo_um6p_gti.png"
                alt="UM6P | GTI Green Tech Institute"
                width={190}
                height={30}
                priority
                className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            {/* Subroutes navigation with plenty of breathing room */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs xl:text-sm font-semibold text-slate-600 whitespace-nowrap">
              <a
                href="#approche"
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl whitespace-nowrap hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Notre approche
              </a>
              <a
                href="#domaines"
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl whitespace-nowrap hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Domaines d'accompagnement
              </a>
              <a
                href="#clusters"
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl whitespace-nowrap hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Clusters de maturité
              </a>
              <a
                href="#partenaires"
                className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl whitespace-nowrap hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Partenaires
              </a>
            </nav>
          </div>

          {/* Right: Authentication / Portal CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 hover:text-[#0F4C3A] hover:bg-slate-100 transition whitespace-nowrap"
            >
              Connexion
            </Link>
            <Link
              href="/cooperative/dashboard"
              className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white shadow-sm hover:shadow transition active:scale-[0.98] whitespace-nowrap"
            >
              <span>Espace Coopérative</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 hidden sm:inline" />
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Value Proposition & CTAs (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-6">
                Un Modèle Évolutif pour la{" "}
                <span className="text-[#0F4C3A]">Transformation Durable</span>{" "}
                des Coopératives
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                La plateforme d'ingénierie et d'accompagnement technique conçue pour évaluer les maturités opérationnelle, économique, organisationnelle et énergétique selon la nomenclature officielle ODCO, et prescrire des feuilles de route adaptées.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/cooperative/diagnostic"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white transition shadow-sm hover:shadow"
                >
                  <span>Démarrer le diagnostic pilote</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition"
                >
                  <span>Accéder à l'Espace Coopérative</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Symbolic 3-Step Transformation Pipeline */}
            <div className="lg:col-span-5 flex flex-col justify-center lg:pl-8">
              <div className="relative pl-14 sm:pl-16 space-y-7 before:absolute before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
                
                {/* Step 1: Diagnostic */}
                <div className="relative flex items-start group">
                  <div className="absolute -left-14 sm:-left-16 h-12 w-12 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Étape 01
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      Diagnostic Multidimensionnel
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Identification du secteur ODCO, puis évaluation de 4 dimensions de maturité à travers 20 questions notées de 0 à 4.
                    </p>
                  </div>
                </div>

                {/* Step 2: Clusterisation */}
                <div className="relative flex items-start group">
                  <div className="absolute -left-14 sm:-left-16 h-12 w-12 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Étape 02
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      Clusterisation Technico-Fonctionnelle
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Attribution du profil le plus compatible parmi 6 clusters : type de process, énergie, digitalisation, complexité et contraintes normatives.
                    </p>
                  </div>
                </div>

                {/* Step 3: Prescription */}
                <div className="relative flex items-start group">
                  <div className="absolute -left-14 sm:-left-16 h-12 w-12 rounded-2xl bg-[#0F4C3A] border-2 border-[#0F4C3A] text-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A]">
                      Étape 03 • Action
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      Prescription Sur-Mesure
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Feuille de route activant les modules transversaux, sectoriels, technologiques et par niveau de maturité.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 1: Notre Approche (Slide 1 & 3) */}
      <section id="approche" className="py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Notre Approche
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Une articulation scientifique entre nomenclature institutionnelle sectorielle et matrice de maturité technico-fonctionnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pillar 1: Cadre Sectoriel ODCO */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center mb-5 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Axe Horizontal • Macro-Niveau
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Cadre Sectoriel ODCO
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Nomenclature officielle ODCO de 24 secteurs, déclinée en 237 sous-secteurs proposés pour la plateforme, afin d'intégrer les exigences réglementaires, sanitaires et de marché propres à chaque activité.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Référentiel National</span>
                <span className="text-[11px] font-normal text-slate-400">24 Secteurs · 237 Sous-secteurs</span>
              </div>
            </div>

            {/* Pillar 2: Matrice de Maturité 4D */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center mb-5 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Axe Vertical • Micro-Niveau
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Matrice de Maturité 4D
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Évaluation objective sur 20 indicateurs quantifiés mesurant la performance opérationnelle, économique, organisationnelle ainsi que la maturité technologique et énergétique.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>20 Indicateurs Calibrés</span>
                <span className="text-[11px] font-normal text-slate-400">Échelle 0–4</span>
              </div>
            </div>

            {/* Pillar 3: Système de Modules Sur-Mesure */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#0F4C3A] border-2 border-[#0F4C3A] text-white shadow-sm flex items-center justify-center mb-5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A] mb-1.5">
                  Moteur de Prescription • Action
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Modules Sur-Mesure
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Activation dynamique de 4 familles de modules d'accompagnement (transversaux, sectoriels, technologiques et par palier) calibrés selon le profil réel de la coopérative.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Feuilles de Route Ciblées</span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                  4 Familles de Modules
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: Nos Domaines d'Accompagnement */}
      <section id="domaines" className="py-10 sm:py-12 lg:py-14 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nos Domaines d'Accompagnement
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Six leviers modulaires pour accélérer la montée en compétences et la transformation durable des coopératives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
            {[
              {
                title: "Mise à niveau technique",
                kicker: "Levier 01 • Procédés & Outils",
                desc: "Optimisez vos processus de production, votre maintenance préventive et vos équipements pour fiabiliser la cadence et réduire les pertes matières.",
                axis: "Axe Opérationnel",
                tag: "Équipements & Procédés",
                icon: Cpu,
              },
              {
                title: "Certification et Conformité",
                kicker: "Levier 02 • Normes & Agrément",
                desc: "Transformez les normes réglementaires, sanitaires (ONSSA) et labels de qualité en leviers pérennes de conformité et d'accès aux marchés.",
                axis: "Axe Réglementaire",
                tag: "Sanitaire & ONSSA",
                icon: ShieldCheck,
              },
              {
                title: "Durabilité & Économie circulaire",
                kicker: "Levier 03 • Écologie & Sobriété",
                desc: "Accélérez la transition écologique par la valorisation des sous-produits organiques, l'efficacité énergétique et la sobriété hydrique.",
                axis: "Axe Durable",
                tag: "Économie Circulaire",
                icon: Leaf,
              },
              {
                title: "Digitalisation et visibilité",
                kicker: "Levier 04 • Numérique & Marché",
                desc: "Développez votre présence en ligne, digitalisez la traçabilité de vos lots et accédez aux circuits de distribution modernes et professionnels.",
                axis: "Axe Numérique",
                tag: "Traçabilité & Marché",
                icon: BookOpen,
              },
              {
                title: "Formation & Renforcement des Compétences",
                kicker: "Levier 05 • Compétences & Gouvernance",
                desc: "Renforcez les compétences managériales, techniques et financières des coopérateurs et adhérents pour consolider la gouvernance interne.",
                axis: "Axe Organisationnel",
                tag: "Gouvernance & Gestion",
                icon: Users,
              },
              {
                title: "Suivi & Étude d'impact",
                kicker: "Levier 06 • Indicateurs & Retombées",
                desc: "Mesurez vos indicateurs clés avec des données fiables, suivez la progression de maturité et démontrez les retombées socio-économiques locales.",
                axis: "Axe Stratégique",
                tag: "Indicateurs & Impact",
                icon: CheckCircle2,
              },
            ].map((domain, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-9 w-9 rounded-xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center mb-3 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                    <domain.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {domain.kicker}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-[#0F4C3A] transition-colors">
                    {domain.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    {domain.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{domain.axis}</span>
                  <span className="text-[10px] font-normal text-slate-400">{domain.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The 6 Clusters Typology */}
      <section id="clusters" className="py-10 sm:py-12 lg:py-14 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              La Typologie des 6 Clusters
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Six profils définis par le type de process, l'intensité énergétique, la digitalisation, la complexité et les contraintes normatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
            {[
              {
                num: "01",
                name: "Artisanal traditionnel",
                process: "Manuel dominant",
                energy: "Faible",
                desc: "Digitalisation très faible, process simple, contraintes normatives faibles (hygiène basique).",
              },
              {
                num: "02",
                name: "Transformation légère",
                process: "Manuel + mécanique léger",
                energy: "Faible à moyenne",
                desc: "Digitalisation faible, complexité moyenne, contraintes ONSSA / sanitaires.",
              },
              {
                num: "03",
                name: "Production mécanisée",
                process: "Mécanique dominant",
                energy: "Moyenne",
                desc: "Digitalisation moyenne, process structuré, contraintes techniques et de sécurité.",
              },
              {
                num: "04",
                name: "Industriel / extractif",
                process: "Mécanique lourd / thermique",
                energy: "Élevée",
                desc: "Digitalisation moyenne, complexité élevée, contraintes strictes (sécurité, environnement).",
              },
              {
                num: "05",
                name: "Services organisés",
                process: "Organisationnel (non productif)",
                energy: "Faible",
                desc: "Digitalisation variable, complexité gestionnelle, contraintes contractuelles et de qualité.",
              },
              {
                num: "06",
                name: "Services cognitifs & numériques",
                process: "Informationnel / digital",
                energy: "Faible",
                desc: "Digitalisation élevée, complexité informationnelle, contraintes liées aux données et à la qualité de service.",
              },
            ].map((cluster, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Cluster {cluster.num}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                      {cluster.process}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-[#0F4C3A] transition-colors">
                    {cluster.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    {cluster.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-[10px] font-normal text-slate-400">Intensité énergétique</span>
                  <span className="text-[10px] font-medium text-slate-600">{cluster.energy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Partenaires Institutionnels - défilement de gauche à droite */}
      <section id="partenaires" className="py-10 sm:py-12 lg:py-14 bg-white border-b border-slate-200 scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nos Partenaires
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Une initiative conjointe pour catalyser le développement durable de l'économie sociale et solidaire.
            </p>
          </div>
        </div>

        <div className="relative w-full overflow-hidden py-3">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Deux moitiés identiques : translateX(-50%) -> 0 boucle sans saccade. La seconde est masquée aux lecteurs d'écran. */}
          <div className="flex w-max animate-slide-ltr select-none">
            {[0, 1].map((half) => (
              <ul key={half} className="flex gap-5 pr-5" aria-hidden={half === 1 ? true : undefined}>
                {[...PARTNERS, ...PARTNERS].map((partner, index) => (
                  <li
                    key={`${half}-${index}`}
                    className="w-72 sm:w-80 flex-shrink-0 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between items-center text-center group"
                  >
                    <div className="w-full flex flex-col items-center">
                      <div className="h-14 w-full flex items-center justify-center mb-3 px-2">
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={half === 0 ? partner.name : ""}
                            width={partner.logoWidth}
                            height={partner.logoHeight}
                            className={`${partner.logoClass} transition-transform group-hover:scale-105 duration-200`}
                          />
                        ) : (
                          // Logo officiel en attente : affichage textuel neutre plutôt qu'un logo reconstitué
                          <span className="text-lg font-extrabold tracking-tight text-slate-800">
                            {partner.wordmark}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#0F4C3A] transition-colors line-clamp-1">
                        {partner.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                        {partner.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200/80 mt-3">
                      {partner.role}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F4C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center rounded-xl bg-white px-4 py-2.5">
            <Image
              src="/images/logo_um6p_gti.png"
              alt="UM6P | GTI Green Tech Institute"
              width={200}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="text-center md:text-right text-xs text-emerald-100/70 leading-relaxed">
            <p>Plateforme TTSFR • Un Modèle Évolutif pour la Transformation Durable des Coopératives</p>
            <p className="mt-1">© 2026 Université Mohammed VI Polytechnique (UM6P) & Green Tech Institute (GTI). Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
