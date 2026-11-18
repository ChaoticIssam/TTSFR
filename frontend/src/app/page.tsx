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
  BarChart3,
  Layers,
  Compass,
  HeartHandshake,
  Scale,
  Lightbulb,
  Heart,
  MapPin,
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

const SIX_DOMAINS = [
  {
    title: "Mise à niveau technique",
    kicker: "Module 02 • Procédés & Équipements",
    desc: "Améliorer les procédés de production, adapter les équipements et structurer les outils de gestion des coûts, des stocks et de l’organisation du travail.",
    axis: "Axe Opérationnel",
    tag: "Procédés & Gestion",
    icon: Cpu,
  },
  {
    title: "Certification et conformité QHSE",
    kicker: "Module 03 • Qualité, Hygiène & Sécurité",
    desc: "Accompagner les démarches de qualité, d’hygiène, de sécurité et d’environnement grâce à la traçabilité, à la maîtrise des risques et à la préparation aux exigences de conformité et de certification.",
    axis: "Axe Normatif",
    tag: "QHSE & ONSSA",
    icon: ShieldCheck,
  },
  {
    title: "Durabilité et économie circulaire",
    kicker: "Module 04 • Ressources & Circularité",
    desc: "Favoriser une utilisation responsable des ressources, la réduction des impacts environnementaux et la valorisation des matières et des sous-produits.",
    axis: "Axe Durable",
    tag: "Économie Circulaire",
    icon: Leaf,
  },
  {
    title: "Digitalisation et visibilité",
    kicker: "Module 05 • Numérique & Commercialisation",
    desc: "Développer l’usage des outils numériques pour la gestion, la communication, la visibilité des produits et la commercialisation en ligne.",
    axis: "Axe Numérique",
    tag: "Visibilité & E-commerce",
    icon: BookOpen,
  },
  {
    title: "Formation et renforcement des capacités",
    kicker: "Module 06 • Compétences & Autonomie",
    desc: "Proposer des apprentissages pratiques adaptés aux besoins des membres et faciliter l’utilisation autonome des outils et des équipements.",
    axis: "Axe Humain",
    tag: "Capability Building",
    icon: Users,
  },
  {
    title: "Suivi et étude d’impact",
    kicker: "Module 07 • KPI, KVI & KWI",
    desc: "Mesurer les évolutions de la performance, de la valeur créée et du bien-être des membres pour ajuster l’accompagnement.",
    axis: "Axe Stratégique",
    tag: "Mesure d'Impact",
    icon: BarChart3,
  },
];

const METHODOLOGY_STEPS = [
  {
    num: "01",
    title: "Identifier les coopératives et leur contexte",
    desc: "Nous identifions les coopératives à accompagner et recueillons les premières informations sur leur activité, leur organisation et leur environnement. Une grille multicritère aide à structurer l’analyse et la sélection des structures pilotes.",
  },
  {
    num: "02",
    title: "Diagnostiquer les besoins et les capacités",
    desc: "Nous analysons les pratiques de production, les équipements, la gestion, la qualité, les compétences et les usages numériques. Les échanges avec les membres permettent de préciser les difficultés rencontrées et les priorités d’amélioration. Le positionnement tient compte du secteur d’activité, selon le cadre de l’Office du Développement de la Coopération, ainsi que des caractéristiques techniques et du niveau de maturité de la coopérative.",
  },
  {
    num: "03",
    title: "Construire un plan d’action personnalisé",
    desc: "À partir du diagnostic, nous définissons avec la coopérative les actions prioritaires, les ressources nécessaires, les responsabilités et les résultats recherchés. Le parcours mobilise les domaines d’accompagnement utiles à sa situation.",
  },
  {
    num: "04",
    title: "Déployer les solutions sur le terrain",
    desc: "Nous accompagnons la mise en œuvre des solutions retenues : amélioration des équipements et des procédés, outils de gestion, traçabilité, organisation du travail, pratiques durables ou supports de commercialisation.",
  },
  {
    num: "05",
    title: "Former et faciliter l’appropriation",
    desc: "Des formations, ateliers pratiques et guides d’utilisation aident les membres à prendre en main les solutions. L’objectif est de permettre leur utilisation dans les activités quotidiennes et de renforcer progressivement l’autonomie de la coopérative.",
  },
  {
    num: "06",
    title: "Mesurer les effets et ajuster",
    desc: "Nous suivons les progrès et recueillons les retours des bénéficiaires afin d’ajuster les actions et de capitaliser les enseignements.",
  },
];

const INTERVENTION_PRINCIPLES = [
  {
    num: "01",
    title: "Co-construction",
    desc: "Associer les membres au diagnostic, aux choix et à l’évaluation.",
  },
  {
    num: "02",
    title: "Adaptation",
    desc: "Tenir compte des contraintes techniques, humaines, territoriales et saisonnières.",
  },
  {
    num: "03",
    title: "Progressivité",
    desc: "Organiser les améliorations selon les priorités et les capacités de la coopérative.",
  },
  {
    num: "04",
    title: "Apprentissage pratique",
    desc: "Relier les formations aux outils et aux situations de travail.",
  },
  {
    num: "05",
    title: "Amélioration continue",
    desc: "Utiliser les indicateurs et les retours de terrain pour faire évoluer les actions.",
  },
];

const VALUES_LIST = [
  {
    title: "Proximité",
    desc: "Comprendre les réalités du terrain et construire une relation d’écoute avec les membres pour proposer des réponses utiles à leur quotidien.",
    icon: MapPin,
  },
  {
    title: "Co-construction",
    desc: "Associer les coopératives aux décisions et reconnaître l’expérience de leurs membres dans la définition des solutions.",
    icon: HeartHandshake,
  },
  {
    title: "Équité",
    desc: "Favoriser une répartition équilibrée des responsabilités et du travail, en tenant compte des capacités et de la contribution de chaque membre.",
    icon: Scale,
  },
  {
    title: "Autonomie",
    desc: "Transmettre les compétences et les outils nécessaires pour permettre aux coopératives de piloter leur activité et de poursuivre leurs progrès.",
    icon: Compass,
  },
  {
    title: "Innovation utile",
    desc: "Adapter les solutions techniques et numériques aux besoins réels, avec une attention particulière à leur simplicité d’utilisation et à leur appropriation.",
    icon: Lightbulb,
  },
  {
    title: "Durabilité",
    desc: "Intégrer la préservation des ressources, la valorisation des matières et la réduction des impacts environnementaux dans les pratiques de la coopérative.",
    icon: Leaf,
  },
  {
    title: "Bien-être au travail",
    desc: "Prendre en compte la sécurité, l’ergonomie, la satisfaction et l’engagement des membres dans l’amélioration de la performance.",
    icon: Heart,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Institutional Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Official Logos (UM6P | GTI) + Anchor Subroutes */}
          <div className="flex items-center space-x-5 xl:space-x-8">
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

            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs xl:text-sm font-semibold text-slate-600 whitespace-nowrap">
              <a
                href="#approche"
                className="px-2.5 py-1.5 rounded-xl hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Notre approche
              </a>
              <a
                href="#domaines"
                className="px-2.5 py-1.5 rounded-xl hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Six domaines
              </a>
              <a
                href="#methodologie"
                className="px-2.5 py-1.5 rounded-xl hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Méthodologie
              </a>
              <a
                href="#valeurs"
                className="px-2.5 py-1.5 rounded-xl hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Valeurs
              </a>
              <a
                href="#equipe"
                className="px-2.5 py-1.5 rounded-xl hover:text-[#0F4C3A] hover:bg-slate-50 transition"
              >
                Nous découvrir
              </a>
              <a
                href="#partenaires"
                className="px-2.5 py-1.5 rounded-xl hover:text-[#0F4C3A] hover:bg-slate-50 transition"
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
      <section className="bg-white py-14 sm:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#0F4C3A] text-xs font-bold w-fit mb-4">
                <span>UM6P • Green Tech Institute • Fondation OCP</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.16] mb-5">
                Un Modèle Évolutif pour la{" "}
                <span className="text-[#0F4C3A]">Transformation Durable</span>{" "}
                des Coopératives
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                Un accompagnement adapté aux réalités de chaque coopérative, associant diagnostic de terrain, transfert de solutions, formation et suivi des effets obtenus pour renforcer la performance, la création de valeur et le bien-être des membres.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/cooperative/diagnostic"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white transition shadow-sm hover:shadow"
                >
                  <span>Démarrer le diagnostic</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#methodologie"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition"
                >
                  <span>Découvrir notre méthodologie</span>
                </a>
              </div>
            </div>

            {/* Right Column: Symbolic 3-Step Transformation Pipeline */}
            <div className="lg:col-span-5 flex flex-col justify-center lg:pl-6">
              <div className="relative pl-14 sm:pl-16 space-y-7 before:absolute before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
                <div className="relative flex items-start group">
                  <div className="absolute -left-14 sm:-left-16 h-12 w-12 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Étape 01 • Diagnostic
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      Diagnostic Multidimensionnel & Profilage
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Positionnement selon le secteur ODCO, les 5 critères technico-fonctionnels (P1–P5) et les 20 indicateurs de maturité notés de 0 à 4.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start group">
                  <div className="absolute -left-14 sm:-left-16 h-12 w-12 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 shadow-xs flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:border-[#0F4C3A] group-hover:text-[#0F4C3A]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Étape 02 • Activation
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      7 Modules & 4 Logiques d&apos;Activation
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Sélection personnalisée des livrables selon le socle transversal, le secteur ODCO, la technologie utilisée et le niveau de maturité.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start group">
                  <div className="absolute -left-14 sm:-left-16 h-12 w-12 rounded-2xl bg-[#0F4C3A] border-2 border-[#0F4C3A] text-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A]">
                      Étape 03 • Suivi & Impact
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      Ressources, Preuves & Indicateurs (KPI, KVI, KWI)
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Vérification des livrables avec preuves documentaires, partage d&apos;outils pratiques et mesure continue de la valeur créée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 1 : NOTRE APPROCHE (Texte officiel + 3 Coopératives Pilotes)
         ===================================================================== */}
      <section id="approche" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
              Notre approche
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Un accompagnement adapté aux réalités de chaque coopérative
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] mb-2">
                01 • Diagnostic &amp; Terrain
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nous accompagnons les coopératives dans le renforcement de leurs capacités techniques, économiques et organisationnelles. Notre approche associe diagnostic de terrain, transfert de solutions, formation et suivi des effets obtenus, pour construire avec les membres des réponses adaptées à leurs activités et à leurs priorités.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] mb-2">
                02 • Parcours Progressif
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Chaque coopérative présente des besoins spécifiques selon son secteur, ses procédés de production, ses ressources et son niveau de maturité. Nous partons de ces réalités pour définir un parcours d’accompagnement progressif, fondé sur des outils concrets et sur leur appropriation par les personnes qui les utilisent au quotidien.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] mb-2">
                03 • Valeur, Autonomie &amp; Durabilité
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Notre modèle relie la performance de l’activité à la création de valeur et au bien-être des membres. Il vise à améliorer la gestion, la qualité des produits et l’accès aux marchés, tout en renforçant l’autonomie des coopératives et la durabilité de leurs pratiques.
              </p>
            </div>
          </div>

          {/* Schéma officiel du Modèle Évolutif */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
            <Image
              src="/images/modele_evolutif_hexagones.png"
              alt="Un Modèle Évolutif pour la Transformation Durable des Coopératives"
              width={1100}
              height={600}
              className="w-full max-w-5xl mx-auto h-auto rounded-xl object-contain"
            />
          </div>

          {/* Encart : Une démarche éprouvée auprès de trois coopératives pilotes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] block mb-1">
                Expérimentation terrain
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Une démarche éprouvée auprès de trois coopératives pilotes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Le modèle a été mis en œuvre auprès de la{" "}
                <strong className="font-semibold text-slate-900">
                  coopérative agricole 3ème Millénaire
                </strong>
                , spécialisée dans la production de couscous sous la marque{" "}
                <strong className="font-semibold text-[#0F4C3A]">Lammima</strong>, la{" "}
                <strong className="font-semibold text-slate-900">
                  coopérative Nahla Al Hamra
                </strong>
                , active dans l’apiculture, et la{" "}
                <strong className="font-semibold text-slate-900">
                  coopérative Ibdaat Rhamna
                </strong>{" "}
                active dans le textile. Ces expériences alimentent la conception d’un accompagnement reproductible et adaptable à d’autres coopératives.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href="#methodologie"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white text-xs sm:text-sm font-bold transition shadow-sm whitespace-nowrap"
              >
                <span>Découvrir notre méthodologie</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2 : SIX DOMAINES POUR AGIR (Textes officiels)
         ===================================================================== */}
      <section id="domaines" className="py-14 sm:py-18 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
              Domaines d&apos;intervention
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Six domaines pour agir
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Après le diagnostic initial (Module 01), six domaines modulaires structurent l’accompagnement technique, normatif, écologique, numérique et humain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SIX_DOMAINS.map((domain, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[#0F4C3A] flex items-center justify-center mb-4">
                    <domain.icon className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {domain.kicker}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#0F4C3A] transition-colors">
                    {domain.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{domain.axis}</span>
                  <span className="text-[10px] font-normal text-slate-400">{domain.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3 : MÉTHODOLOGIE — DU DIAGNOSTIC À L'AUTONOMIE (6 étapes + 5 principes)
         ===================================================================== */}
      <section id="methodologie" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
              Méthodologie
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Du diagnostic à l’autonomie
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Notre méthodologie suit un parcours en six étapes. Elle permet de comprendre les besoins, de prioriser les actions, de déployer les solutions et d’en évaluer les effets avec les coopératives.
            </p>
          </div>

          {/* Les 6 étapes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {METHODOLOGY_STEPS.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#0F4C3A] text-white text-xs font-extrabold">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Étape {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Les 5 principes de notre intervention */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
                Principes directeurs
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Les principes de notre intervention
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {INTERVENTION_PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-extrabold text-[#0F4C3A] mb-2">
                      Principe {p.num}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4 : VALEURS — LES ENGAGEMENTS QUI ORIENTENT NOTRE ACCOMPAGNEMENT
         ===================================================================== */}
      <section id="valeurs" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
              Valeurs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Les engagements qui orientent notre accompagnement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES_LIST.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start space-x-4 hover:border-slate-300 transition"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-[#0F4C3A] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5 : NOUS DÉCOUVRIR (Équipe UM6P / GTI)
         ===================================================================== */}
      <section id="equipe" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A]">
              Nous découvrir
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Une équipe au service de la transformation des coopératives
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Notre équipe travaille avec les coopératives pour transformer les besoins identifiés sur le terrain en actions concrètes et en outils utilisables au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Sabah BELIL */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                <Image
                  src="/images/sabah_belil.jpeg"
                  alt="Dr. Sabah BELIL"
                  width={220}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Sabah BELIL
                </h3>
                <p className="text-xs font-bold text-[#0F4C3A] mt-0.5">
                  Project &amp; Development Manager — Université Mohammed VI Polytechnique
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  Sabah Belil est docteur spécialisée dans les supply chain durables et les systèmes complexes. Elle pilote des initiatives associant ingénierie, durabilité et autonomisation des communautés. Elle met son expertise scientifique au service du terrain pour développer des chaînes de valeur inclusives, résilientes et circulaires, alliant progrès technologique et impact social.
                </p>
              </div>
            </div>

            {/* Ahmed CHEBAK */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                <Image
                  src="/images/ahmed_chebak.png"
                  alt="Pr. Ahmed CHEBAK"
                  width={220}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Ahmed CHEBAK
                </h3>
                <p className="text-xs font-bold text-[#0F4C3A] mt-0.5">
                  Directeur Green Tech Institute — Université Mohammed VI Polytechnique
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  Ahmed CHEBAK est professeur de génie électrique à l’Université Mohammed VI Polytechnique (UM6P) et directeur du Green Tech Institute (GTI). Il intervient dans le cadre de cette démarche de transfert technologique dédiée au renforcement des capacités des coopératives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6 : LA TYPOLOGIE DES 6 CLUSTERS
         ===================================================================== */}
      <section id="clusters" className="py-12 sm:py-16 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              La Typologie des 6 Clusters
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Six profils définis par le type de processus (35 %), l&apos;intensité énergétique (15 %), la digitalisation (20 %), la complexité (15 %) et les contraintes normatives (15 %).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                process: "Manuel + mécanique légère",
                energy: "Faible à moyenne",
                desc: "Digitalisation faible, complexité moyenne, contraintes ONSSA / sanitaires.",
              },
              {
                num: "03",
                name: "Production mécanisée",
                process: "Mécanique dominante",
                energy: "Moyenne",
                desc: "Digitalisation moyenne, process structuré, contraintes techniques et de sécurité.",
              },
              {
                num: "04",
                name: "Industriel / extractif",
                process: "Mécanique lourde / thermique",
                energy: "Élevée",
                desc: "Digitalisation moyenne, complexité élevée, contraintes strictes (sécurité, environnement).",
              },
              {
                num: "05",
                name: "Services organisés",
                process: "Organisationnel (non productif)",
                energy: "Faible",
                desc: "Digitalisation moyenne, complexité gestionnelle, contraintes contractuelles et de qualité.",
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
                className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Cluster {cluster.num}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
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
                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-[10px] font-normal text-slate-400">Intensité énergétique</span>
                  <span className="text-[10px] font-medium text-slate-600">{cluster.energy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7 : PARTENAIRES INSTITUTIONNELS
         ===================================================================== */}
      <section id="partenaires" className="py-10 sm:py-14 bg-slate-50/50 border-b border-slate-200 scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nos Partenaires
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Une initiative conjointe pour catalyser le développement durable de l&apos;économie sociale et solidaire.
            </p>
          </div>
        </div>

        <div className="relative w-full overflow-hidden py-3">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

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
            <p className="mt-1">© 2026 Université Mohammed VI Polytechnique (UM6P) &amp; Green Tech Institute (GTI). Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
