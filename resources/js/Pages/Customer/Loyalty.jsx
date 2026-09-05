import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    Sparkles, 
    Gift, 
    Tag, 
    CheckCircle2, 
    ArrowRight, 
    Store, 
    Award, 
    Crown, 
    ShieldCheck, 
    Percent, 
    Truck, 
    Zap 
} from 'lucide-react';

export default function Loyalty({ loyaltyPoints = 0, availableCoupons = [] }) {
    // Loyalty tiers: Bronze (0-999), Argent (1000-4999), Or (5000+)
    let currentTier = 'Bronze';
    let nextTier = 'Argent';
    let nextTierThreshold = 1000;
    let tierColor = 'text-amber-800 bg-amber-100 border-amber-300';
    let progressPercent = Math.min(100, Math.round((loyaltyPoints / 1000) * 100));

    if (loyaltyPoints >= 5000) {
        currentTier = 'Or';
        nextTier = 'Diamant';
        nextTierThreshold = 10000;
        tierColor = 'text-yellow-900 bg-yellow-400 border-yellow-500';
        progressPercent = 100;
    } else if (loyaltyPoints >= 1000) {
        currentTier = 'Argent';
        nextTier = 'Or';
        nextTierThreshold = 5000;
        tierColor = 'text-slate-800 bg-slate-200 border-slate-400';
        progressPercent = Math.min(100, Math.round(((loyaltyPoints - 1000) / 4000) * 100));
    }

    return (
        <CustomerLayout title="Programme de Fidélité">
            <Head title="Points de Confiance & Fidélité - Sellify" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16 max-w-5xl mx-auto">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-yellow-50/80 border border-yellow-200 p-6 rounded-2xl shadow-xs">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-yellow-800 font-bold text-xs uppercase tracking-wide">
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                            <span>Programme Fidélité · Points de Confiance (1 FCFA = 1 pt)</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900">
                            Vos Points de Confiance Acheteur
                        </h1>
                        <p className="text-xs text-stone-600 font-normal max-w-xl">
                            Chaque commande confirmée vous rapporte des points de fidélité. Montez en grade pour débloquer des réductions sur la livraison et des ventes flash exclusives.
                        </p>
                    </div>

                    <div className="bg-white border border-yellow-300 p-4 rounded-2xl flex items-center gap-3.5 shadow-xs shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold">
                            <Gift className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] text-stone-500 font-semibold">Solde Actuel</p>
                            <p className="text-2xl font-bold text-stone-950">{Number(loyaltyPoints).toLocaleString()} pts</p>
                        </div>
                    </div>
                </div>

                {/* TIER STATUS & PROGRESS BAR (Sub-Module 2.1.10) */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-yellow-50 text-yellow-700 rounded-xl">
                                <Crown className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-stone-400 uppercase font-bold block">Statut Actuel</span>
                                <span className="font-bold text-base text-stone-900 flex items-center gap-2">
                                    <span>Membre {currentTier}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierColor}`}>
                                        Palier {currentTier}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {currentTier !== 'Or' && (
                            <span className="text-xs text-stone-500 font-medium">
                                Plus que <strong>{Number(nextTierThreshold - loyaltyPoints).toLocaleString()} pts</strong> pour devenir Membre {nextTier} !
                            </span>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-stone-600">
                            <span>Progression vers {nextTier}</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
                            <div 
                                className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Tier Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                        {/* Bronze */}
                        <div className={`p-4 rounded-xl border text-xs space-y-2 ${currentTier === 'Bronze' ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-200' : 'bg-stone-50 border-stone-200 opacity-70'}`}>
                            <div className="flex items-center justify-between font-bold text-amber-900">
                                <span>🥉 Bronze (0 - 999 pts)</span>
                                {currentTier === 'Bronze' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <ul className="space-y-1 text-stone-600 text-[11px]">
                                <li>• Protection Escrow standard</li>
                                <li>• Suivi live des commandes</li>
                                <li>• Factures PDF certifiées</li>
                            </ul>
                        </div>

                        {/* Argent */}
                        <div className={`p-4 rounded-xl border text-xs space-y-2 ${currentTier === 'Argent' ? 'bg-slate-50 border-slate-400 ring-2 ring-slate-200' : 'bg-stone-50 border-stone-200 opacity-70'}`}>
                            <div className="flex items-center justify-between font-bold text-stone-900">
                                <span>🥈 Argent (1 000 - 4 999 pts)</span>
                                {currentTier === 'Argent' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <ul className="space-y-1 text-stone-600 text-[11px]">
                                <li>• Tous les avantages Bronze</li>
                                <li>• <strong>-5% sur les frais de livraison</strong></li>
                                <li>• Accès prioritaire aux ventes flash</li>
                            </ul>
                        </div>

                        {/* Or */}
                        <div className={`p-4 rounded-xl border text-xs space-y-2 ${currentTier === 'Or' ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : 'bg-stone-50 border-stone-200 opacity-70'}`}>
                            <div className="flex items-center justify-between font-bold text-yellow-950">
                                <span>🥇 Or (5 000+ pts)</span>
                                {currentTier === 'Or' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <ul className="space-y-1 text-stone-600 text-[11px]">
                                <li>• Tous les avantages Argent</li>
                                <li>• <strong>-10% sur les frais de livraison</strong></li>
                                <li>• Ligne support VIP prioritaire 24/7</li>
                                <li>• Badge "Acheteur VIP" certifié</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Available Coupons */}
                <div className="space-y-3.5">
                    <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-yellow-600" />
                        <span>Codes Promo & Bons de Réduction Disponibles</span>
                    </h2>

                    {availableCoupons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {availableCoupons.map((coupon) => (
                                <div key={coupon.id} className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-yellow-400 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono font-bold text-xs bg-yellow-50 text-yellow-900 border border-yellow-200 px-2.5 py-1 rounded-lg">
                                            {coupon.code}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-600">
                                            {coupon.type === 'percentage' ? `-${coupon.value}%` : `-${Number(coupon.value).toLocaleString('fr-FR')} FCFA`}
                                        </span>
                                    </div>

                                    <div className="text-xs text-stone-600 space-y-1">
                                        <p className="font-semibold text-stone-900 flex items-center gap-1">
                                            <Store className="w-3.5 h-3.5 text-stone-400" />
                                            <span>{coupon.shop?.name || 'Boutique'}</span>
                                        </p>
                                        <p className="text-[11px] text-stone-400">
                                            Valable jusqu'au {new Date(coupon.end_date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-[11px] text-stone-500">
                                            {coupon.min_order_amount > 0 ? `Dès ${Number(coupon.min_order_amount).toLocaleString('fr-FR')} FCFA` : 'Sans minimum'}
                                        </span>
                                        <a
                                            href={route('shop.public', coupon.shop?.slug)}
                                            className="text-xs text-yellow-700 hover:underline font-bold"
                                        >
                                            Utiliser &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-stone-400">
                            <Tag className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                            <p className="text-xs font-semibold text-stone-700">Aucun coupon disponible actuellement</p>
                        </div>
                    )}
                </div>

            </div>
        </CustomerLayout>
    );
}
