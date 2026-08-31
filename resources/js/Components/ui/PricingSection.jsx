import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Check, Sparkles, ShieldCheck, ArrowRight, Zap, Building2, Store } from 'lucide-react';

export function PricingSection({ className = "" }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      name: "Découverte & Test",
      priceUSD: 0,
      priceFCFA: "0",
      description: "Pour les particuliers et vendeurs occasionnels qui souhaitent tester la sécurité Escrow.",
      badge: "Gratuit à vie",
      highlight: false,
      ctaText: "Créer un compte gratuit",
      features: [
        "Jusqu'à 5 produits en ligne",
        "Protection Escrow séquestre incluse",
        "1 Smart-Link WhatsApp actif",
        "Paiements Orange Money & MTN MoMo",
        "Suivi standard des livraisons",
        "Support communautaire par email",
      ],
    },
    {
      name: "Starter Vendeur Pro",
      priceUSD: 5,
      priceFCFA: "3 000",
      description: "Idéal pour les commerçants de quartier et micro-entrepreneurs actifs sur les réseaux sociaux.",
      badge: "Populaire",
      highlight: false,
      ctaText: "Démarrer avec le pack Starter",
      features: [
        "Jusqu'à 50 produits au catalogue",
        "Smart-Links WhatsApp illimités",
        "Badge 'Commerçant Vérifié'",
        "Retraits Mobile Money instantanés",
        "Dispatch prioritaire des coursiers",
        "Statistiques de base des ventes",
        "Support prioritaire par WhatsApp",
      ],
    },
    {
      name: "Business & Marque",
      priceUSD: 20,
      priceFCFA: "12 000",
      description: "Pour les boutiques établies, créateurs de mode et marques souhaitant scaler leurs ventes.",
      badge: "Recommandé",
      highlight: true,
      ctaText: "Propulser ma boutique",
      features: [
        "Produits & catalogues illimités",
        "Boutique officielle personnalisée",
        "Assistant IA de vente 24/7 intégré",
        "Taux de commission préférentiel",
        "Dispatch express 30 min garanti",
        "Gestion multi-utilisateurs (3 accès)",
        "Tableau de bord analytics avancé",
        "Gestionnaire de compte dédié",
      ],
    },
    {
      name: "Enterprise & Grossiste",
      priceUSD: 200,
      priceFCFA: "120 000",
      description: "Pour les importateurs, fabricants et réseaux de distribution multi-villes et transfrontaliers.",
      badge: "Panafricain",
      highlight: false,
      ctaText: "Contacter l'équipe VIP",
      features: [
        "Infrastructure multi-boutiques (jusqu'à 10)",
        "API complète pour ERP & stocks",
        "Accès réseau logistique interurbain (DHL, Fret)",
        "Taux de commission le plus bas du marché",
        "Médiation juridique prioritaire sous 2h",
        "Rapprochement bancaire automatisé",
        "Contrat cadre OHADA sur mesure",
      ],
    },
  ];

  return (
    <section className={`py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="text-center space-y-3 mb-12">
        <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          Tarification Transparente & Sans Surprise
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight">
          Des formules conçues pour chaque étape de votre croissance
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto font-normal">
          Choisissez l'offre qui correspond à votre volume d'activité. Aucun frais caché, résiliation possible à tout moment en 1 clic.
        </p>

        {/* Currency Switch Note */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-stone-500 font-normal">
          <span>Tarifs affichés en</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-stone-900">USD ($)</span>
          <span>et en</span>
          <span className="px-2 py-0.5 rounded-md bg-yellow-100 font-semibold text-yellow-900">FCFA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between relative ${
              plan.highlight
                ? 'bg-white border-2 border-yellow-400 shadow-xl scale-102 lg:-translate-y-2 ring-4 ring-yellow-400/10'
                : 'bg-white border border-stone-200/80 hover:border-yellow-400 hover:shadow-lg shadow-2xs'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-stone-950 font-semibold text-[10px] rounded-full shadow-2xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Le choix le plus populaire</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-base text-stone-900">{plan.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    plan.highlight 
                      ? 'bg-yellow-50 text-yellow-900 border-yellow-200' 
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed font-normal">
                  {plan.description}
                </p>
              </div>

              {/* Price Tag */}
              <div className="pt-2 pb-3 border-y border-stone-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold text-stone-900 tracking-tight">
                    {plan.priceUSD}$
                  </span>
                  <span className="text-xs text-stone-400 font-normal">/ mois</span>
                </div>
                <div className="text-xs font-medium text-yellow-700 mt-0.5">
                  soit env. {plan.priceFCFA} FCFA / mois
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-stone-600 font-normal pt-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Link href={route('register')}>
                <button
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    plan.highlight
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-stone-950 shadow-md'
                      : 'bg-stone-50 hover:bg-yellow-400 text-stone-800 hover:text-stone-950 border border-stone-200 hover:border-yellow-400'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow Guarantee Footer Pill */}
      <div className="mt-10 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-700 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-yellow-700 shrink-0" />
          <span className="font-medium">
            Garantie de remboursement intégrale sous 14 jours si vous n'êtes pas satisfait.
          </span>
        </div>
        <Link href={route('register')} className="font-semibold text-yellow-900 hover:underline shrink-0 flex items-center gap-1">
          <span>Créer mon compte vendeur</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </section>
  );
}
