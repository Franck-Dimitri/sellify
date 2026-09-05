import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Scale, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Terms() {
  return (
    <PublicLayout>
      <Head title="Conditions Générales d'Utilisation (CGU / CGV) - Sellify.me" />

      <div className="w-full bg-[#fbf9f5] min-h-screen py-12 font-sans text-stone-700 antialiased">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
              Cadre Contractuel & Juridique
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Conditions Générales d'Utilisation et de Vente
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Régies par le droit commercial OHADA et la législation sur le commerce électronique.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm font-normal leading-relaxed text-stone-600">
            
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Scale className="w-5 h-5 text-yellow-600" />
                <span>1. Objet et Champ d'Application</span>
              </h2>
              <p>
                Les présentes Conditions Générales d'Utilisation et de Vente (CGU/CGV) définissent les règles régissant l'utilisation de la plateforme de commerce électronique <strong>Sellify.me</strong>, des liens de commande <strong>Smart-Links</strong>, ainsi que des services de tiers de confiance sous séquestre (<strong>Escrow</strong>).
              </p>
              <p>
                Toute commande passée sur Sellify ou via un Smart-Link implique l'acceptation sans réserve des présentes conditions par l'acheteur et par le vendeur professionnel.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <ShieldCheck className="w-5 h-5 text-yellow-600" />
                <span>2. Mécanisme du Tiers de Confiance & Séquestre Escrow</span>
              </h2>
              <p>
                Sellify agit en qualité de tiers de confiance technique et financier impartial :
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Consignation des fonds :</strong> Lors du paiement par Mobile Money (Orange Money, MTN MoMo, Wave), les fonds de l'acheteur sont bloqués sur un compte séquestre dédié.</li>
                <li><strong>Déblocage au vendeur :</strong> Les fonds ne sont crédités sur le solde du vendeur qu'après remise effective du colis et saisie du code secret de vérification OTP par l'acheteur.</li>
                <li><strong>Protection anti-arnaque :</strong> En cas de non-livraison, de produit endommagé ou de non-conformité manifeste, les fonds sont immédiatement restitués à l'acheteur.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                <span>3. Obligations des Vendeurs et Qualité des Produits</span>
              </h2>
              <p>
                Tout commerçant ou créateur de boutique sur Sellify s'engage à :
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Fournir des descriptions fidèles, des photos réelles et des prix exacts toutes taxes comprises.</li>
                <li>Ne proposer aucun produit prohibé, contrefait ou issu d'une filière illicite.</li>
                <li>Préparer et emballer soigneusement les colis dès notification de la commande.</li>
                <li>Maintenir à jour ses stocks et horaires d'ouverture réels.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span>4. Procédure de Litige et Arbitrage</span>
              </h2>
              <p>
                En cas de désaccord à la réception du colis, l'acheteur dispose d'un délai de <strong>48 heures</strong> pour ouvrir un ticket d'incident depuis son interface ou auprès du support. L'équipe de médiation Sellify examine les preuves (photos, rapport du livreur) et rend une décision d'arbitrage impartiale sous 48h ouvrées.
              </p>
            </section>

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
