import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Privacy() {
  return (
    <PublicLayout>
      <Head title="Politique de Confidentialité - Sellify.me" />

      <div className="w-full bg-[#fbf9f5] min-h-screen py-12 font-sans text-stone-700 antialiased">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
              Conformité & Données Personnelles
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Politique de Confidentialité
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Dernière mise à jour : 31 Août 2026 • Conforme aux réglementations CEMAC, OHADA et standards internationaux de protection des données.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm font-normal leading-relaxed text-stone-600">
            
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <ShieldCheck className="w-5 h-5 text-yellow-600" />
                <span>1. Introduction et Responsable du Traitement</span>
              </h2>
              <p>
                La plateforme <strong>Sellify.me</strong> (ci-après « Sellify », « nous », « notre ») est exploitée par la société Sellify Inc. et ses filiales opérationnelles locales. Nous nous engageons formellement à respecter et protéger la vie privée de tous nos utilisateurs : acheteurs, vendeurs professionnels, grossistes et livreurs partenaires.
              </p>
              <p>
                Cette politique détaille comment nous collectons, utilisons, conservons et protégeons vos données à caractère personnel lorsque vous naviguez sur notre site, commandez via nos Smart-Links, utilisez notre séquestre Escrow ou créez une boutique en ligne.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Eye className="w-5 h-5 text-yellow-600" />
                <span>2. Données Collectées</span>
              </h2>
              <p>Nous collectons uniquement les informations nécessaires au bon déroulement des transactions et de la logistique :</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Données d'identité et contact :</strong> Nom complet, numéro de téléphone (Orange Money, MTN MoMo, Wave), adresse email, adresse de livraison précise et ville.</li>
                <li><strong>Données de vérification d'identité (KYC) :</strong> Pièce nationale d'identité (CNI), passeport ou récépissé RCCM pour les vendeurs professionnels et livreurs.</li>
                <li><strong>Données transactionnelles :</strong> Historique des commandes, montants consignés sous séquestre, identifiants de transactions Mobile Money (nous ne conservons jamais votre code secret PIN).</li>
                <li><strong>Données de géolocalisation :</strong> Coordonnées GPS lors des tournées de livraison pour assurer le suivi en temps réel du colis par l'acheteur.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Lock className="w-5 h-5 text-yellow-600" />
                <span>3. Utilisation des Données</span>
              </h2>
              <p>Vos informations sont traitées pour les finalités suivantes :</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Exécution des transactions commerciales et séquestration sécurisée des fonds (Escrow).</li>
                <li>Attribution automatique et optimisation du trajet du coursier le plus proche.</li>
                <li>Envoi des notifications SMS et WhatsApp de suivi de colis et codes OTP de déblocage.</li>
                <li>Lutte contre la fraude, vérification de l'authenticité des boutiques et arbitrage des litiges.</li>
                <li>Amélioration continue de notre algorithme d'assistance commerciale par intelligence artificielle.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <FileText className="w-5 h-5 text-yellow-600" />
                <span>4. Partage et Non-Vente des Données</span>
              </h2>
              <p>
                <strong>Sellify ne vend, ne loue et ne cède aucune donnée personnelle à des régies publicitaires tierces.</strong> Vos données sont partagées uniquement avec :
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Le livreur désigné pour la course (nom, téléphone, adresse de livraison).</li>
                <li>Le vendeur concerné (détail des articles et confirmation du paiement).</li>
                <li>Les opérateurs de paiement agréés (Orange Money, MTN MoMo) pour valider le séquestre.</li>
                <li>Les autorités judiciaires ou étatiques uniquement en cas de réquisition légale formelle.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                <span>5. Vos Droits & Contact DPO</span>
              </h2>
              <p>
                Conformément aux lois applicables, vous disposez d'un droit permanent d'accès, de rectification, de suppression et de portabilité de l'ensemble de vos données. Pour exercer vos droits ou pour toute question relative à la protection de votre vie privée, vous pouvez contacter notre Délégué à la Protection des Données :
              </p>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                <p className="font-semibold text-stone-900">Bureau de Protection des Données Sellify</p>
                <p>Email : <a href="mailto:privacy@sellify.me" className="text-yellow-700 font-medium hover:underline">privacy@sellify.me</a> / <a href="mailto:support@sellify.me" className="text-yellow-700 font-medium hover:underline">support@sellify.me</a></p>
                <p>Adresse : Boulevard de la Liberté, Akwa, Douala, Cameroun</p>
              </div>
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
