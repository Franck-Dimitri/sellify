import React from "react";
import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
  IconShieldCheck,
  IconBrandWhatsapp,
  IconTruckDelivery,
  IconBuildingStore,
  IconScale,
  IconDeviceMobileMessage,
  IconWallet,
  IconChartDots
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Séquestre Escrow 100% Garanti",
      description:
        "L'acheteur paie en toute confiance : les fonds restent sécurisés chez Sellify et ne sont libérés au vendeur qu'après validation du code secret OTP.",
      icon: <IconShieldCheck className="w-6 h-6 text-yellow-600" />,
      badge: "Zéro Arnaque",
    },
    {
      title: "Smart-Links WhatsApp en 1 Clic",
      description:
        "Générez des liens de commande pré-remplis partageables sur WhatsApp, TikTok et Instagram avec calcul automatique des frais de livraison.",
      icon: <IconBrandWhatsapp className="w-6 h-6 text-emerald-600" />,
      badge: "Vente Flash",
    },
    {
      title: "Dispatch Coursiers par IA",
      description:
        "Algorithme intelligent qui attribue chaque commande au livreur le plus proche et optimise les tournées pour une remise en moins de 45 minutes.",
      icon: <IconTruckDelivery className="w-6 h-6 text-yellow-600" />,
      badge: "Suivi GPS Direct",
    },
    {
      title: "Vitrines & Boutiques Certifiées",
      description:
        "Boutiques personnalisées avec nom de domaine, horaires en direct, catalogue interactif et badge de conformité RCCM vérifié.",
      icon: <IconBuildingStore className="w-6 h-6 text-amber-600" />,
      badge: "Pro & Grossistes",
    },
    {
      title: "Arbitrage des Litiges sous 48h",
      description:
        "Centre de médiation dédié : si le produit ne correspond pas, l'acheteur est intégralement remboursé et le colis est retourné au vendeur.",
      icon: <IconScale className="w-6 h-6 text-rose-600" />,
      badge: "Protection Totale",
    },
    {
      title: "Mobile Money Natif & Instantané",
      description:
        "Paiements directs sans carte bancaire via Orange Money, MTN MoMo et Wave avec confirmation par SMS et notifications push en temps réel.",
      icon: <IconDeviceMobileMessage className="w-6 h-6 text-amber-600" />,
      badge: "Orange & MTN",
    },
    {
      title: "Retraits MoMo Illimités & Sans Frais",
      description:
        "Les vendeurs retirent leurs gains directement sur leur portefeuille Mobile Money dès que la commande est livrée, sans délai d'attente.",
      icon: <IconWallet className="w-6 h-6 text-emerald-600" />,
      badge: "Paiement 24/7",
    },
    {
      title: "Analytics & Pilotage Commercial",
      description:
        "Tableau de bord en temps réel : volume de ventes, taux de conversion, paniers moyens et prédictions de réapprovisionnement de stock.",
      icon: <IconChartDots className="w-6 h-6 text-yellow-600" />,
      badge: "Dashboard Live",
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          Fonctionnalités Panafricaines Révolutionnaires
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight">
          L'infrastructure e-commerce la plus complète d'Afrique
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto font-normal">
          Pensé pour résoudre les défis réels du commerce informel : sécurité des paiements, confiance mutuelle et logistique urbaine optimisée.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  badge,
  index,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-8 sm:py-10 px-6 sm:px-8 relative group/feature border-stone-200/70",
        (index === 0 || index === 4) && "lg:border-l-0",
        index < 4 && "lg:border-b",
        index % 2 === 0 && "md:border-r",
        "hover:bg-[#fcfbf9] transition-colors duration-200"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-amber-50/60 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-amber-50/60 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 shadow-2xs group-hover/feature:scale-110 group-hover/feature:bg-yellow-400 group-hover/feature:border-yellow-400 transition-all duration-200">
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/60">
            {badge}
          </span>
        )}
      </div>

      <div className="text-sm sm:text-base font-semibold mb-2 relative z-10">
        <div className="absolute -left-6 sm:-left-8 inset-y-0 h-5 group-hover/feature:h-7 w-1 rounded-r-full bg-stone-300 group-hover/feature:bg-yellow-400 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-1.5 transition duration-200 inline-block text-stone-900">
          {title}
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed relative z-10 font-normal">
        {description}
      </p>
    </div>
  );
};
