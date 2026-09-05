import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ShieldCheck, Lock, Smartphone, Truck, CheckCircle2, ArrowRight, Award, Building2 } from 'lucide-react';

export default function Escrow() {
  return (
    <PublicLayout>
      <Head title="Protocole Séquestre Escrow & Mentions Légales - Sellify.me" />

      <div className="w-full bg-[#fbf9f5] min-h-screen py-12 font-sans text-stone-700 antialiased">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
              Sécurité Financière & Mentions Légales
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Le Protocole Escrow Sellify
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Architecture de confiance technique et financière garantissant zéro arnaque sur le commerce africain.
            </p>
          </div>

          {/* Flow Visual Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-yellow-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-semibold text-stone-900 text-xs">Commande & Séquestre</h3>
              <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                L'acheteur paie par Orange Money ou MTN MoMo. Les fonds sont verrouillés sur le compte séquestre Sellify.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-yellow-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-semibold text-stone-900 text-xs">Dispatch & Collecte</h3>
              <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                Le vendeur prépare le colis. Le coursier partenaire géolocalisé le récupère et lance la livraison.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-yellow-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-semibold text-stone-900 text-xs">Contrôle & Code OTP</h3>
              <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                L'acheteur inspecte son article en mains propres et communique son code secret OTP au coursier.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-yellow-700 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-semibold text-stone-900 text-xs">Paiement Vendeur</h3>
              <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                Le séquestre se déverrouille instantanément : le vendeur et le coursier reçoivent leurs gains sur leur Mobile Money.
              </p>
            </div>
          </div>

          {/* Legal Details Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6 text-xs sm:text-sm font-normal leading-relaxed text-stone-600">
            <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Building2 className="w-5 h-5 text-yellow-600" />
              <span>Mentions Légales & Immatriculation</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-medium">Société Mère</span>
                <p className="font-semibold text-stone-900">Sellify Holding Inc.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-medium">Filiale Opérationnelle</span>
                <p className="font-semibold text-stone-900">Sellify Cameroun SAS (OHADA)</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-medium">Siège Social</span>
                <p className="font-semibold text-stone-900">Boulevard de la Liberté, Akwa, Douala</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-medium">Contact Légal & Support</span>
                <p className="font-semibold text-stone-900">legal@sellify.me • +237 699 00 11 22</p>
              </div>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="text-center">
            <Link href={route('home')}>
              <button className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5">
                <span>Retour à l'accueil Sellify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
