import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import Badge from '../../../Components/ui/Badge';
import { Card, CardContent } from '../../../Components/ui/Card';
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
    // Computations
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

    // Group promotions by shop for breakdown
    const shopPromoCounts = promotions.reduce((acc, p) => {
        const name = p.shop?.name || 'Inconnue';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    const shopPromoData = Object.keys(shopPromoCounts).map(name => ({
        name,
        count: shopPromoCounts[name]
    }));

    return (
        <SellerCentralLayout title="Promotions Centralisées">
            <Head title="Espace Promotions - Sellify Central" />

            <div className="space-y-7  mx-auto px-1">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-surface-700 tracking-tight">Espace Promotions</h2>
                        <p className="text-xs text-surface-450 mt-0.5">Pilotez et analysez les campagnes de réductions sur l'ensemble de vos vitrines.</p>
                    </div>
                </div>                {/* 4 Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Total Promos */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Campagnes créées</span>
                            <span className="text-2xl font-bold text-surface-750 block">{totalPromotions}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <Tag className="w-3.5 h-3.5 text-yellow-600" />
                                <span className="text-xs text-surface-450 font-semibold">Total historique</span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                            <Gift className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Active Promos */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Promotions actives</span>
                            <span className="text-2xl font-bold text-surface-750 block">{activePromotions}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs text-emerald-600 font-semibold">En cours d'application</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Average Discount */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Remise moyenne</span>
                            <span className="text-2xl font-bold text-surface-750 block">{averageDiscount}%</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-xs text-surface-450 font-semibold">Sur tous les articles</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <Percent className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 4: Max Discount */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Remise maximale</span>
                            <span className="text-2xl font-bold text-surface-750 block">-{maxDiscount}%</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                <span className="text-xs text-purple-650 font-semibold">Offre vedette</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Interactive SVGs Line Chart (2 Columns) */}
                    <div className="lg:col-span-2 bg-white border border-surface-200 rounded-2xl p-6 shadow-xs">
                        <div>
                            <h4 className="text-sm font-bold text-surface-700">Performance des Remises</h4>
                            <span className="text-[11px] text-surface-450 mt-0.5 block">Suivi chronologique de l'impact des taux de promotions</span>
                        </div>

                        <div className="relative w-full h-[220px] mt-6">
                            <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="40" y1="30" x2="570" y2="30" stroke="#f8fafc" strokeWidth="1" />
                                <line x1="40" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="180" x2="570" y2="180" stroke="#f1f5f9" strokeWidth="1" />

                                {/* Trend line */}
                                <path 
                                    d="M 60 160 Q 140 120, 220 135 T 380 90 T 540 50" 
                                    fill="none" 
                                    stroke="#CA8A04" 
                                    strokeWidth="3"
                                    strokeLinecap="round" 
                                />

                                {/* Secondary guide line */}
                                <path 
                                    d="M 60 170 Q 140 150, 220 160 T 380 130 T 540 100" 
                                    fill="none" 
                                    stroke="#3b82f6" 
                                    strokeWidth="2" 
                                    strokeDasharray="4 4"
                                    strokeLinecap="round" 
                                />

                                {/* Labels */}
                                <text x="10" y="34" fill="#94a3b8" fontSize="10" fontWeight="600">80%</text>
                                <text x="10" y="84" fill="#94a3b8" fontSize="10" fontWeight="600">50%</text>
                                <text x="10" y="134" fill="#94a3b8" fontSize="10" fontWeight="600">30%</text>
                                <text x="10" y="184" fill="#94a3b8" fontSize="10" fontWeight="600">10%</text>

                                <text x="55" y="205" fill="#94a3b8" fontSize="10" fontWeight="600">Févr</text>
                                <text x="135" y="205" fill="#94a3b8" fontSize="10" fontWeight="600">Mars</text>
                                <text x="215" y="205" fill="#94a3b8" fontSize="10" fontWeight="600">Avril</text>
                                <text x="295" y="205" fill="#94a3b8" fontSize="10" fontWeight="600">Mai</text>
                                <text x="375" y="205" fill="#94a3b8" fontSize="10" fontWeight="600">Juin</text>
                                <text x="455" y="205" fill="#94a3b8" fontSize="10" fontWeight="600">Juil</text>
                            </svg>
                        </div>
                    </div>

                    {/* Right: Pie Breakdown of Promos by Shop (1 Column) */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-surface-700">Répartition par boutique</h4>
                            <span className="text-[11px] text-surface-450 mt-0.5 block">Proportion de campagnes par point de vente</span>
                        </div>

                        {/* Donut graphic */}
                        <div className="flex justify-center items-center my-5">
                            <svg className="w-28 h-28" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f8fafc" strokeWidth="4.5" />
                                {totalPromotions > 0 ? (
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#CA8A04" strokeWidth="4.5" 
                                        strokeDasharray="60 40" strokeDashoffset="25" />
                                ) : (
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4.5" />
                                )}
                                {totalPromotions > 1 && (
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                                        strokeDasharray="40 60" strokeDashoffset="85" />
                                )}
                            </svg>
                        </div>

                        <div className="space-y-2.5 text-xs font-semibold text-surface-600">
                            {shopPromoData.length === 0 ? (
                                <div className="text-center text-surface-400 py-2">Aucune donnée</div>
                            ) : (
                                shopPromoData.slice(0, 3).map((item, idx) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-yellow-600' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                            <span className="truncate max-w-[120px]">{item.name}</span>
                                        </div>
                                        <span className="font-mono text-surface-900">{item.count} promo{item.count > 1 ? 's' : ''}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Promotions Table */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-surface-700">Liste des Promotions</h3>
                    
                    {promotions.length === 0 ? (
                        <div className="bg-white border border-surface-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                                <Percent className="w-9 h-9 text-yellow-650" />
                            </div>
                            <div className="space-y-1 max-w-sm">
                                <p className="text-sm font-semibold text-surface-700">Aucune promotion programmée</p>
                                <p className="text-xs text-surface-400 leading-relaxed font-normal">
                                    Créez des remises directement depuis le menu de vos boutiques locales.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-surface-50 border-b border-surface-150 text-surface-400 font-bold uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Boutique</th>
                                            <th className="p-4 font-semibold">Produit</th>
                                            <th className="p-4 font-semibold text-center">Remise</th>
                                            <th className="p-4 font-semibold text-right">Ancien prix</th>
                                            <th className="p-4 font-semibold text-right">Prix réduit</th>
                                            <th className="p-4 font-semibold text-center">Période de validité</th>
                                            <th className="p-4 font-semibold text-right">Gestion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100 text-surface-600 font-semibold">
                                        {promotions.map((promo) => {
                                            const start = new Date(promo.start_date);
                                            const end = new Date(promo.end_date);
                                            const isExpired = end < today;
                                            const shopColor = promo.shop?.theme_color || '#CA8A04';
                                            
                                            return (
                                                <tr key={promo.id} className="hover:bg-surface-50/30 transition-colors">
                                                    {/* Shop */}
                                                    <td className="p-4">
                                                        <div className="flex items-center space-x-2.5">
                                                            <span 
                                                                className="w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-inner"
                                                                style={{ backgroundColor: shopColor }}
                                                            >
                                                                {promo.shop?.name[0].toUpperCase()}
                                                            </span>
                                                            <span className="font-bold text-surface-750">{promo.shop?.name}</span>
                                                        </div>
                                                    </td>

                                                    {/* Product */}
                                                    <td className="p-4">
                                                        <span className="font-bold text-surface-700 text-sm leading-snug">{promo.product?.name}</span>
                                                    </td>

                                                    {/* Discount Badge */}
                                                    <td className="p-4 text-center">
                                                        <Badge variant={isExpired ? 'neutral' : 'success'} className="font-bold">
                                                            -{promo.discount_percentage}%
                                                        </Badge>
                                                    </td>

                                                    {/* Old Price */}
                                                    <td className="p-4 text-right text-surface-400 font-normal line-through">
                                                        {parseFloat(promo.product?.price || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                    </td>

                                                    {/* Promo Price */}
                                                    <td className="p-4 text-right font-bold text-surface-750 text-sm">
                                                        {parseFloat(promo.promo_price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                    </td>

                                                    {/* Dates */}
                                                    <td className="p-4 text-center text-[10px] text-surface-450 font-normal">
                                                        <div className="flex items-center justify-center space-x-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                                                            <span>
                                                                {formatDate(promo.start_date)} au {formatDate(promo.end_date)}
                                                            </span>
                                                        </div>
                                                        {isExpired && (
                                                            <span className="text-red-500 font-semibold text-[8px] uppercase tracking-wider block mt-0.5">Expiré</span>
                                                        )}
                                                    </td>

                                                    {/* Action link */}
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
