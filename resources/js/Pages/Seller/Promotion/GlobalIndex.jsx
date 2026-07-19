import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import Badge from '../../../Components/ui/Badge';
import { 
    Percent, 
    Calendar,
    ArrowRight,
    Tag,
    Store
} from 'lucide-react';

export default function GlobalIndex({ promotions = [] }) {
    return (
        <SellerCentralLayout title="Gestion des Promotions Globale">
            <Head title="Promotions Centralisées - Sellify Vendeur" />

            <div className="space-y-6 max-w-5xl mx-auto px-1">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-surface-700 tracking-tight">Promotions Centralisées</h2>
                    <p className="text-xs text-surface-450 mt-0.5">Suivez toutes les remises programmées à travers l'ensemble de vos boutiques locales.</p>
                </div>

                {/* Promotions Table */}
                {promotions.length === 0 ? (
                    <div className="bg-white border border-surface-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                            <Percent className="w-10 h-10 text-yellow-600" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                            <p className="text-sm font-semibold text-surface-700 font-semibold">Aucune promotion programmée</p>
                            <p className="text-xs text-surface-400 leading-relaxed font-normal">
                                Vous n'avez configuré aucune promotion active ou future sur vos produits. Accédez à la console de gestion d'une boutique pour en créer une.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-surface-50 border-b border-surface-150 text-surface-400 font-bold uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Boutique</th>
                                        <th className="p-4 font-semibold">Produit</th>
                                        <th className="p-4 font-semibold text-center">Remise</th>
                                        <th className="p-4 font-semibold text-right">Prix normal</th>
                                        <th className="p-4 font-semibold text-right">Prix soldé</th>
                                        <th className="p-4 font-semibold text-center">Période</th>
                                        <th className="p-4 font-semibold text-right">Gestion</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-100 text-surface-600 font-semibold">
                                    {promotions.map((promo) => {
                                        const isExpired = new Date(promo.end_date) < new Date(new Date().toDateString());
                                        const shopColor = promo.shop?.theme_color || '#CA8A04';
                                        
                                        return (
                                            <tr key={promo.id} className="hover:bg-surface-50/30 transition-colors">
                                                {/* Shop Logo & Name */}
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span 
                                                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold shrink-0"
                                                            style={{ backgroundColor: shopColor }}
                                                        >
                                                            {promo.shop?.name[0].toUpperCase()}
                                                        </span>
                                                        <span className="font-bold text-surface-750">{promo.shop?.name}</span>
                                                    </div>
                                                </td>

                                                {/* Product Name */}
                                                <td className="p-4">
                                                    <h4 className="font-bold text-surface-700 text-sm leading-snug">{promo.product?.name}</h4>
                                                </td>

                                                {/* Discount Percentage */}
                                                <td className="p-4 text-center">
                                                    <Badge variant={isExpired ? 'neutral' : 'success'} className="font-bold">
                                                        -{promo.discount_percentage}%
                                                    </Badge>
                                                </td>

                                                {/* Original Price */}
                                                <td className="p-4 text-right text-surface-400 font-normal line-through">
                                                    {parseFloat(promo.product?.price || 0).toFixed(2)} €
                                                </td>

                                                {/* Discounted Price */}
                                                <td className="p-4 text-right font-bold text-surface-750 text-sm">
                                                    {parseFloat(promo.promo_price).toFixed(2)} €
                                                </td>

                                                {/* Date Period */}
                                                <td className="p-4 text-center text-[10px] text-surface-450 font-normal">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                                                        <span>
                                                            {formatDate(promo.start_date)} au {formatDate(promo.end_date)}
                                                        </span>
                                                    </div>
                                                    {isExpired && (
                                                        <span className="text-red-500 font-semibold text-[8px] uppercase tracking-wider block mt-0.5">Expiré</span>
                                                    )}
                                                </td>

                                                {/* Redirect to Shop console */}
                                                <td className="p-4 text-right">
                                                    <Link 
                                                        href={route('seller.shop.promotions.index', promo.shop?.slug)}
                                                        className="inline-flex items-center space-x-1 text-[11px] font-bold hover:underline"
                                                        style={{ color: shopColor }}
                                                    >
                                                        <span>Gérer</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </SellerCentralLayout>
    );
}

// Utility to format dates
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
    });
}
