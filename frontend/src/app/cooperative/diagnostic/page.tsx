"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Save, Sparkles, AlertCircle } from "lucide-react";

export default function DiagnosticWizard() {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // 1 = sector, 2 = sub-sector
  const [selectedSector, setSelectedSector] = useState("AGRI");
  const [selectedSubSector, setSelectedSubSector] = useState("AGRI_PROD");
  
  // Answers state
  const [answers, setAnswers] = useState({
    op_process_quality: 70,
    op_hygiene_safety: 80,
    op_waste_management: 50,
    eco_turnover: 65,
    eco_cashflow: 60,
    eco_margin_control: 55,
    org_governance: 60,
    org_training_access: 40,
    tech_mechanization: 50,
    tech_energy_efficiency: 40,
    tech_digital_tools: 30,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAutoSaved, setIsAutoSaved] = useState(false);

  // Auto-save feedback simulation
  useEffect(() => {
    setIsAutoSaved(true);
    const timer = setTimeout(() => setIsAutoSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [step, subStep, selectedSector, selectedSubSector, answers]);

  const sectors = [
    { code: "AGRI", name: "Agriculture", desc: "Cultures, élevage et dérivés" },
    { code: "ARTISANAT", name: "Artisanat", desc: "Tapis, poterie, cuir et bois" },
    { code: "DENREES", name: "Denrées alimentaires", desc: "Alimentation et agro-transformation" },
    { code: "ARGAN", name: "Argan", desc: "Huile d'argan et cosmétique" },
    { code: "PAM", name: "Plantes aromatiques et médicinales", desc: "Distillation et herboristerie" },
    { code: "PECHE", name: "Pêche maritime", desc: "Produits de la mer" },
    { code: "FORET", name: "Forêt", desc: "Exploitation forestière et bois" },
    { code: "TOURISME", name: "Tourisme", desc: "Gîtes et écotourisme" },
    { code: "PRESTATION", name: "Prestation de services", desc: "Services aux membres" },
    { code: "CONSEIL", name: "Conseil et gestion", desc: "Études et accompagnement" },
    { code: "ECOMMERCE", name: "Commerce électronique", desc: "Vente en ligne directe" },
    { code: "TRANSPORT", name: "Transport", desc: "Transport de personnes et marchandises" },
  ];

  const agriSubSectors = [
    { code: "AGRI_PROD", name: "Production primaire", desc: "Céréales, maraîchage, arboriculture..." },
    { code: "AGRI_ELEV", name: "Élevage", desc: "Ovins, caprins, bovins, volailles..." },
    { code: "AGRI_APIC", name: "Apiculture", desc: "Production de miel et produits de la ruche" },
    { code: "AGRI_SERV", name: "Services agricoles", desc: "Irrigation, mécanisation, prestations..." },
    { code: "AGRI_TRANS", name: "Transformation agroalimentaire", desc: "Conditionnement, valorisation..." },
    { code: "AGRI_BIO", name: "Filière biologique", desc: "Circuits courts, bio certifié..." },
    { code: "AGRI_EXP", name: "Exportation agricole", desc: "Conditionnement aux normes export" },
  ];

  const handleNext = () => {
    if (step === 1 && subStep === 1) {
      setSubStep(2);
    } else if (step < 5) {
      setStep(step + 1);
      setSubStep(1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step === 1 && subStep === 2) {
      setSubStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl flex flex-col border-x border-slate-200">
        
        {/* Step Indicator Header */}
        <header className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase text-[#0F4C3A] tracking-wider">
              Étape {step}/5
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">Diagnostic TTSFR</span>
          </div>
          <div className="flex items-center space-x-2">
            {isAutoSaved && (
              <span className="flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium transition animate-pulse">
                <Save className="h-3 w-3 mr-1" />
                Sauvegardé
              </span>
            )}
            <Link href="/cooperative/dashboard" className="text-xs text-slate-400 hover:text-slate-700">
              Quitter
            </Link>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-[#10B981] h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          {!isSubmitted ? (
            <>
              {/* STEP 1: ODCO SECTORS & SUB-SECTORS */}
              {step === 1 && subStep === 1 && (
                <div>
                  <div className="mb-5">
                    <h1 className="text-lg font-bold text-slate-900 leading-snug">
                      Sélectionnez votre secteur d'activité
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Cette information adapte votre diagnostic à votre réalité terrain.
                    </p>
                  </div>

                  <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    {sectors.map((s) => {
                      const isSelected = selectedSector === s.code;
                      return (
                        <div
                          key={s.code}
                          onClick={() => setSelectedSector(s.code)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "border-[#10B981] bg-emerald-50/40 ring-1 ring-[#10B981]"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <h3 className={`text-xs font-bold ${isSelected ? "text-[#0F4C3A]" : "text-slate-900"}`}>
                              {s.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                          </div>
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition ${
                              isSelected
                                ? "bg-[#10B981] border-[#10B981] text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 1.2: SUB-SECTORS DRILLDOWN */}
              {step === 1 && subStep === 2 && (
                <div>
                  <div className="mb-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Secteur : {sectors.find((s) => s.code === selectedSector)?.name}
                    </span>
                  </div>
                  <div className="mb-5">
                    <h1 className="text-lg font-bold text-slate-900 leading-snug">
                      Précisez votre sous-secteur d'activité
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Sélectionnez votre sous-secteur principal.
                    </p>
                  </div>

                  <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    {agriSubSectors.map((sub) => {
                      const isSelected = selectedSubSector === sub.code;
                      return (
                        <div
                          key={sub.code}
                          onClick={() => setSelectedSubSector(sub.code)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "border-[#10B981] bg-emerald-50/40 ring-1 ring-[#10B981]"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <h3 className={`text-xs font-bold ${isSelected ? "text-[#0F4C3A]" : "text-slate-900"}`}>
                              {sub.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">{sub.desc}</p>
                          </div>
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition ${
                              isSelected
                                ? "bg-[#10B981] border-[#10B981] text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: OPERATIONAL PERFORMANCE */}
              {step === 2 && (
                <div>
                  <div className="mb-5">
                    <h1 className="text-lg font-bold text-slate-900">Performance Opérationnelle</h1>
                    <p className="text-xs text-slate-500 mt-1">Évaluation des processus, qualité, et hygiène.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Maîtrise des processus de production ({answers.op_process_quality}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers.op_process_quality}
                        onChange={(e) => setAnswers({ ...answers, op_process_quality: Number(e.target.value) })}
                        className="w-full accent-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Normes d'hygiène et de sécurité ({answers.op_hygiene_safety}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers.op_hygiene_safety}
                        onChange={(e) => setAnswers({ ...answers, op_hygiene_safety: Number(e.target.value) })}
                        className="w-full accent-[#10B981]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ECONOMIC PERFORMANCE */}
              {step === 3 && (
                <div>
                  <div className="mb-5">
                    <h1 className="text-lg font-bold text-slate-900">Performance Économique</h1>
                    <p className="text-xs text-slate-500 mt-1">Évaluation des ventes, trésorerie et marges.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Stabilité du chiffre d'affaires ({answers.eco_turnover}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers.eco_turnover}
                        onChange={(e) => setAnswers({ ...answers, eco_turnover: Number(e.target.value) })}
                        className="w-full accent-[#10B981]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ORGANIZATIONAL MATURITY */}
              {step === 4 && (
                <div>
                  <div className="mb-5">
                    <h1 className="text-lg font-bold text-slate-900">Maturité Organisationnelle</h1>
                    <p className="text-xs text-slate-500 mt-1">Gouvernance, rôles clairs et compétences.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Gouvernance et participation des membres ({answers.org_governance}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers.org_governance}
                        onChange={(e) => setAnswers({ ...answers, org_governance: Number(e.target.value) })}
                        className="w-full accent-[#10B981]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: TECH & ENERGY MATURITY */}
              {step === 5 && (
                <div>
                  <div className="mb-5">
                    <h1 className="text-lg font-bold text-slate-900">Maturité Technologique & Énergétique</h1>
                    <p className="text-xs text-slate-500 mt-1">Équipements, numérique et efficacité énergétique.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Degré de mécanisation des outils ({answers.tech_mechanization}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers.tech_mechanization}
                        onChange={(e) => setAnswers({ ...answers, tech_mechanization: Number(e.target.value) })}
                        className="w-full accent-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Utilisation d'énergies renouvelables ({answers.tech_energy_efficiency}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers.tech_energy_efficiency}
                        onChange={(e) => setAnswers({ ...answers, tech_energy_efficiency: Number(e.target.value) })}
                        className="w-full accent-[#10B981]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="pt-6 pb-2 flex items-center space-x-3">
                {(step > 1 || subStep > 1) && (
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Retour</span>
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-[2] py-3.5 px-6 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1"
                >
                  <span>{step === 5 ? "Calculer mon cluster" : "Continuer"}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </>
          ) : (
            /* RESULTS SCREEN (SLIDE 57 CLUSTER RESTITUTION) */
            <div className="py-4 flex flex-col justify-between h-full">
              <div className="text-center">
                <div className="h-16 w-16 bg-emerald-100 text-[#0F4C3A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Sparkles className="h-8 w-8" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Diagnostic Validé
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-3">Votre Profil de Maturité</h2>
                
                {/* Cluster Badge */}
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#0F4C3A] text-white shadow-lg">
                  <span className="text-xs uppercase font-semibold text-emerald-200">Cluster Attribué</span>
                  <h3 className="text-xl font-bold mt-1">Transformation Légère</h3>
                  <p className="text-xs text-emerald-100/90 mt-2">
                    Conditionnement et valorisation semi-mécanisée avec potentiel d'optimisation énergétique.
                  </p>
                </div>

                {/* Dimension Scores Breakdown */}
                <div className="mt-5 space-y-2 text-left">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">Scores par Dimension :</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px]">Opérationnel</span>
                      <p className="font-bold text-slate-900 text-sm">{answers.op_hygiene_safety}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px]">Économique</span>
                      <p className="font-bold text-slate-900 text-sm">{answers.eco_turnover}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px]">Organisation</span>
                      <p className="font-bold text-slate-900 text-sm">{answers.org_governance}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px]">Tech & Énergie</span>
                      <p className="font-bold text-slate-900 text-sm">{answers.tech_mechanization}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2.5">
                <Link
                  href="/cooperative/dashboard"
                  className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl bg-[#0F4C3A] hover:bg-[#135D43] text-white font-bold text-xs shadow-md transition"
                >
                  Accéder à mon plan d'action personnalisé
                </Link>
                <button
                  onClick={() => alert("Génération du rapport d'audit PDF en cours...")}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Télécharger le Rapport d'audit (PDF)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
