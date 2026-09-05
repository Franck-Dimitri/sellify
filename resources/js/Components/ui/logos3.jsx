import React from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/Components/ui/carousel";

const defaultLogos = [
  {
    id: "orange-money",
    name: "Orange Money",
    tagline: "Paiement Mobile Sécurisé",
    color: "from-orange-500 to-amber-500",
    badge: "Mobile Money",
  },
  {
    id: "mtn-momo",
    name: "MTN MoMo",
    tagline: "Transactions Instantanées",
    color: "from-yellow-400 to-amber-500",
    badge: "MoMo API",
  },
  {
    id: "wave",
    name: "Wave Money",
    tagline: "0% Frais de Dépôt",
    color: "from-sky-400 to-blue-600",
    badge: "Fintech",
  },
  {
    id: "afriland",
    name: "Afriland First Bank",
    tagline: "Partenaire Bancaire Escrow",
    color: "from-emerald-600 to-teal-700",
    badge: "Banque",
  },
  {
    id: "uba",
    name: "UBA Africa",
    tagline: "Réseau Panafricain",
    color: "from-red-600 to-rose-700",
    badge: "Pan-Africa",
  },
  {
    id: "dhl",
    name: "DHL Express",
    tagline: "Logistique Interurbaine",
    color: "from-yellow-500 to-amber-600",
    badge: "Livraison",
  },
  {
    id: "ecobank",
    name: "Ecobank",
    tagline: "Paiements Transfrontaliers",
    color: "from-cyan-600 to-blue-700",
    badge: "Banking",
  },
  {
    id: "yango",
    name: "Yango Delivery",
    tagline: "Courses Urbaines Express",
    color: "from-red-500 to-amber-500",
    badge: "Coursiers",
  },
];

export function Logos3({
  heading = "Ils font confiance à l'infrastructure Sellify",
  subheading = "Partenaires bancaires, opérateurs Mobile Money et réseaux logistiques certifiés à travers l'Afrique.",
  logos = defaultLogos,
  className = "",
}) {
  return (
    <section className={`py-12 bg-white/70 backdrop-blur-xs border-y border-stone-200/80 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-2">
        <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          Écosystème & Partenaires Officiels
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
          {heading}
        </h2>
        {subheading && (
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl font-normal">
            {subheading}
          </p>
        )}
      </div>

      <div className="pt-8">
        <div className="relative mx-auto flex items-center justify-center max-w-7xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ speed: 1.2, playOnInit: true, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 justify-center pl-4 pr-4"
                >
                  <div className="group flex items-center gap-3 p-3.5 bg-stone-50 hover:bg-white border border-stone-200/80 hover:border-yellow-400 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 w-full">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${logo.color} flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0`}>
                      {logo.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-900 truncate">
                          {logo.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block truncate font-normal">
                        {logo.tagline}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Fade gradients on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#fbf9f5] to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#fbf9f5] to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}
