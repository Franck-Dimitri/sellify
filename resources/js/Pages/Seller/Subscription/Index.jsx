import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    CreditCard, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    Store, 
    Boxes, 
    Percent, 
    Sparkles, 
    Zap, 
    Check,
    HelpCircle,
    ArrowRight
} from 'lucide-react';

export default function SubscriptionIndex({ packs = [], currentPack, currentSubscription, usage, cycle }) {
    const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual
    const [submittingPack, setSubmittingPack] = useState(null);

    const handleUpgrade = (packName) => {
        setSubmittingPack(packName);
        router.post(route('seller.subscription.upgrade'), { pack: packName }, {
            preserveScroll: true,
            onSuccess: () => setSubmittingPack(null),
            onError: () => setSubmittingPack(null),
        });
    };

    const daysRemaining = cycle?.days_remaining;
    const percentUsed = cycle?.percent_used || 0;

    return (
        <SellerCentralLayout title="Packs & Abonnements SaaS">
            <Head title="Abonnements Vendeur - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <CreditCard className="w-4 h-4 text-amber-600" />
                            <span>Formules & Avantages Vendeur</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Packs d'Abonnement & Quotas
                        </h1>
                        <p className="text-xs text-stone-600">
                            Gérez votre formule, suivez la durée restante de votre cycle et étendez les capacités de vos boutiques.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1.5 bg-amber-500/20 text-amber-900 font-medium rounded-xl text-xs flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-700" />
                            <span>Modulable Sans Engagement</span>
                        </div>
                    </div>
                </div>

                {/* Active Plan Detail & Time Cycle Dashboard Card */}
                <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-medium">
                                <CreditCard className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    Formule Actuelle
                                </span>
                                <h2 className="text-base font-semibold text-stone-900 mt-1 capitalize">
                                    Pack {currentPack}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-normal text-stone-600">
                            {cycle?.started_at && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                    <span>Activé le : <strong className="font-medium text-stone-800">{cycle.started_at}</strong></span>
                                </div>
                            )}
                            {cycle?.expires_at && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Renouvellement : <strong className="font-medium text-stone-800">{cycle.expires_at}</strong></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cycle Time Progress Gauge */}
                    {daysRemaining !== null && (
                        <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="text-stone-600 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    Progression du Cycle d'Abonnement
                                </span>
                                <span className="text-amber-950 font-semibold">
                                    {daysRemaining} jour(s) restant(s)
                                </span>
                            </div>
                            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                                    style={{ width: `${percentUsed}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Quota Usage Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Shops Quota */}
                        <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-100">
                            <div className="flex items-center justify-between text-stone-600">
                                <span className="font-medium flex items-center gap-1.5">
                                    <Store className="w-3.5 h-3.5 text-amber-600" />
                                    Boutiques Utilisées
                                </span>
                                <span className="font-semibold text-stone-900">
                                    {usage.shops_count} / {usage.max_shops > 100 ? 'Illimité' : usage.max_shops}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${Math.min(100, (usage.shops_count / usage.max_shops) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Products Quota */}
                        <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-100">
                            <div className="flex items-center justify-between text-stone-600">
                                <span className="font-medium flex items-center gap-1.5">
                                    <Boxes className="w-3.5 h-3.5 text-amber-600" />
                                    Produits en Stock
                                </span>
                                <span className="font-semibold text-stone-900">
                                    {usage.products_count} / {usage.max_products > 1000 ? 'Illimité' : usage.max_products}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${Math.min(100, (usage.products_count / (usage.max_products || 30)) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Commission Rate */}
                        <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-100">
                            <div className="flex items-center justify-between text-stone-600">
                                <span className="font-medium flex items-center gap-1.5">
                                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                                    Commission sur Vente
                                </span>
                                <span className="font-semibold text-emerald-700">{usage.commission_rate}</span>
                            </div>
                            <p className="text-[10px] text-stone-400">Prélevée uniquement lors des ventes réelles.</p>
                        </div>
                    </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center items-center gap-3 pt-2">
                    <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-stone-900' : 'text-stone-400'}`}>
                        Paiement Mensuel
                    </span>
                    <button
                        onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${
                            billingCycle === 'annual' ? 'bg-amber-500' : 'bg-stone-300'
                        }`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </button>
                    <span className={`text-xs font-medium flex items-center gap-1 ${billingCycle === 'annual' ? 'text-stone-900' : 'text-stone-400'}`}>
                        <span>Paiement Annuel</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            -20% de réduction
                        </span>
                    </span>
                </div>

                {/* SaaS Packs Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packs.map(pack => {
                        const isCurrent = pack.name === currentPack;
                        const price = billingCycle === 'annual' && pack.monthly_price > 0 
                            ? Math.round(pack.monthly_price * 0.8) 
                            : pack.monthly_price;

                        const isPopular = pack.name === 'pro';

                        return (
                            <div
                                key={pack.id}
                                className={`bg-white rounded-2xl p-6 shadow-sm border flex flex-col justify-between relative transition-all ${
                                    isCurrent 
                                        ? 'border-amber-500 ring-2 ring-amber-500/20' 
                                        : isPopular
                                        ? 'border-amber-400 shadow-md'
                                        : 'border-stone-200/70 hover:border-stone-300'
                                }`}
                            >
                                {isPopular && !isCurrent && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-[10px] font-semibold uppercase px-3 py-0.5 rounded-full shadow-xs">
                                        Recommandé
                                    </span>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-base font-semibold text-stone-900">{pack.display_name}</h3>
                                        {isCurrent && (
                                            <span className="bg-amber-100 text-amber-900 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                                                Actif
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-semibold text-stone-900">
                                                {price === 0 ? 'Gratuit' : `${Number(price).toLocaleString()} FCFA`}
                                            </span>
                                            {price > 0 && <span className="text-xs text-stone-400 font-normal">/ mois</span>}
                                        </div>
                                        {billingCycle === 'annual' && price > 0 && (
                                            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Facturé annuellement</p>
                                        )}
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
                                        {pack.features && pack.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span className="font-normal">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 pt-4 border-t border-stone-100">
                                    <button
                                        onClick={() => handleUpgrade(pack.name)}
                                        disabled={isCurrent || submittingPack === pack.name}
                                        className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                                            isCurrent
                                                ? 'bg-stone-100 text-stone-400 cursor-default'
                                                : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-amber-950 shadow-xs'
                                        }`}
                                    >
                                        <span>
                                            {submittingPack === pack.name 
                                                ? 'Changement...' 
                                                : isCurrent 
                                                ? 'Pack Actuel' 
                                                : 'Choisir ce Pack'
                                            }
                                        </span>
                                        {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </SellerCentralLayout>
    );
}
