import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Sparkles, Gift, Tag, CheckCircle2, ArrowRight, Store } from 'lucide-react';

export default function Loyalty({ loyaltyPoints = 0, availableCoupons = [] }) {
    return (
        <CustomerLayout title="Points & Fidélité">
            <Head title="Points & Récompenses - Sellify" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-yellow-50/70 border border-yellow-200/80 p-5 rounded-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-yellow-800 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Programme Fidélité & Récompenses</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Vos Points Sellify Rewards
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Chaque achat confirmé avec succès sur Sellify vous rapporte des points échangeables contre des remises.
                        </p>
                    </div>

                    <div className="bg-white border border-yellow-300 p-3.5 rounded-xl flex items-center gap-3 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500 text-stone-950 flex items-center justify-center font-bold">
                            <Gift className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] text-stone-500 font-medium">Solde de Points</p>
                            <p className="text-xl font-semibold text-stone-950">{loyaltyPoints} points</p>
                        </div>
                    </div>
                </div>

                {/* Available Coupons */}
                <div className="space-y-3.5">
                    <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-yellow-600" />
                        <span>Codes Promo Disponibles sur les Boutiques</span>
                    </h2>

                    {availableCoupons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {availableCoupons.map((coupon) => (
                                <div key={coupon.id} className="bg-white border border-stone-200 rounded-xl p-4 space-y-3 shadow-xs hover:border-yellow-400 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono font-bold text-xs bg-yellow-50 text-yellow-900 border border-yellow-200 px-2.5 py-1 rounded-md">
                                            {coupon.code}
                                        </span>
                                        <span className="text-xs font-semibold text-emerald-600">
                                            {coupon.type === 'percentage' ? `-${coupon.value}%` : `-${Number(coupon.value).toLocaleString('fr-FR')} FCFA`}
                                        </span>
                                    </div>

                                    <div className="text-xs text-stone-600 space-y-1">
                                        <p className="font-medium text-stone-900 flex items-center gap-1">
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
                                            className="text-xs text-yellow-700 hover:underline font-medium"
                                        >
                                            Utiliser &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-stone-400">
                            <Tag className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-stone-700">Aucun coupon disponible actuellement</p>
                        </div>
                    )}
                </div>

            </div>
        </CustomerLayout>
    );
}
