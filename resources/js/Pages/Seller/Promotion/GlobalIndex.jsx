import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Percent, 
    Calendar,
    ArrowRight,
    Tag,
    Store,
    TrendingUp,
    Gift,
    Clock,
    Sparkles
} from 'lucide-react';

export default function GlobalIndex({ promotions = [] }) {
    const totalPromotions = promotions.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activePromotions = promotions.filter(p => {
        const start = new Date(p.start_date);
        const end = new Date(p.end_date);
        return start <= today && end >= today;
    }).length;

    const averageDiscount = totalPromotions > 0 
        ? Math.round(promotions.reduce((sum, p) => sum + p.discount_percentage, 0) / totalPromotions)
        : 0;

    const maxDiscount = totalPromotions > 0 
        ? Math.max(...promotions.map(p => p.discount_percentage))
        : 0;

    return (
        <SellerCentralLayout title="Promotions Centralisées">
            <Head title="Espace Promotions - Sellify" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* COMPACT & ELEGANT TOP BANNER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/70 border border-amber-200/60 p-5 rounded-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Tag className="w-3.5 h-3.5 text-amber-600" />
                            <span>Ventes Flash & Remises Commerciales</span>
                        </div>
                        <h1 className="text-lg font-semibold text-stone-900">
                            Promotions Centralisées Multi-Boutiques
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Supervisez et analysez l'ensemble des campagnes promotionnelles sur vos boutiques.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-amber-500/20 text-amber-950 font-medium rounded-lg text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                            <span>Remises Vendeur Active</span>
                        </div>
                    </div>
                </div>

                {/* 4 COMPACT REFINED KPI METRICS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Campagnes Créées</span>
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                                <Gift className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">{totalPromotions}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Promotions Actives</span>
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Clock className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-emerald-600">{activePromotions}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Remise Moyenne</span>
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Percent className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">{averageDiscount}%</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Remise Maximale</span>
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-purple-700">-{maxDiscount}%</p>
                    </div>
                </div>

                {/* PROMOTIONS TABLE */}
                <div className="bg-white border border-stone-200/70 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Offres Promotionnelles Multi-Boutiques</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-normal">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200/70 text-[11px] text-stone-500 font-medium">
                                    <th className="px-5 py-3">Boutique</th>
                                    <th className="px-5 py-3">Produit Concerné</th>
                                    <th className="px-5 py-3 text-center">Remise</th>
                                    <th className="px-5 py-3 text-right">Prix d'Origine</th>
                                    <th className="px-5 py-3 text-right">Prix Réduit</th>
                                    <th className="px-5 py-3 text-center">Période d'Activité</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-700">
                                {promotions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-stone-400 font-normal">
                                            Aucune promotion programmée pour l'instant.
                                        </td>
                                    </tr>
                                ) : (
                                    promotions.map((promo) => {
                                        const end = new Date(promo.end_date);
                                        const isExpired = end < today;

                                        return (
                                            <tr key={promo.id} className="hover:bg-stone-50/70 transition-colors">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-1.5 font-medium text-stone-900">
                                                        <Store className="w-3.5 h-3.5 text-amber-600" />
                                                        <span>{promo.shop?.name || 'Boutique'}</span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3 font-medium text-stone-900">
                                                    {promo.product?.name}
                                                </td>

                                                <td className="px-5 py-3 text-center">
                                                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                                        isExpired ? 'bg-stone-100 text-stone-500' : 'bg-red-50 text-red-700 border border-red-200'
                                                    }`}>
                                                        -{promo.discount_percentage}% OFF
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3 text-right text-stone-400 font-normal line-through">
                                                    {Number(promo.product?.price || 0).toLocaleString()} FCFA
                                                </td>

                                                <td className="px-5 py-3 text-right font-semibold text-stone-900">
                                                    {Number(promo.promo_price).toLocaleString()} FCFA
                                                </td>

                                                <td className="px-5 py-3 text-center text-stone-500 font-normal">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Calendar className="w-3 h-3 text-stone-400" />
                                                        <span>{formatDate(promo.start_date)} au {formatDate(promo.end_date)}</span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3 text-right">
                                                    {promo.shop?.slug && (
                                                        <Link 
                                                            href={route('seller.shop.promotions.index', promo.shop.slug)}
                                                            className="inline-flex items-center gap-1 text-amber-700 hover:underline font-medium text-xs"
                                                        >
                                                            <span>Gérer</span>
                                                            <ArrowRight className="w-3 h-3" />
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </SellerCentralLayout>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
