import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { 
    DollarSign, 
    ShoppingBag, 
    Package, 
    Users, 
    Plus, 
    ExternalLink, 
    TrendingUp, 
    Clock, 
    ChevronRight,
    ArrowUpRight,
    Flame,
    Store,
    AlertTriangle,
    ShieldCheck,
    Settings,
    Tag,
    BarChart2,
    CheckCircle2,
    Eye
} from 'lucide-react';

export default function LocalDashboard({ 
    shop, 
    productsCount = 0, 
    totalStock = 0, 
    outOfStockCount = 0, 
    promotionsCount = 0, 
    totalRevenue = 0,
    recentOrders = [],
    recentProducts = []
}) {
    const { auth } = usePage().props;
    const activeThemeColor = shop?.theme_color || '#F59E0B';

    return (
        <ShopConsoleLayout shop={shop} title={`Console Boutique - ${shop.name}`}>
            <Head title={`Console - ${shop.name}`} />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* COMPACT & REFINED LOCAL SHOP HEADER BANNER */}
                <div 
                    className="p-5 rounded-xl border shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 relative overflow-hidden text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, ${activeThemeColor} 0%, #1c1917 100%)` }}
                >
                    <div className="flex items-center gap-3.5 relative z-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl p-1 shadow-xs border border-white/20 flex items-center justify-center shrink-0">
                            {shop.logo_path ? (
                                <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <Store className="w-7 h-7 text-stone-400" />
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg md:text-xl font-semibold tracking-tight">{shop.name}</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${
                                    shop.is_holiday_mode 
                                        ? 'bg-amber-500/20 text-amber-200 border-amber-400/30' 
                                        : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                                }`}>
                                    {shop.is_holiday_mode ? 'Mode Vacances' : 'En Ligne • Active'}
                                </span>
                            </div>
                            <p className="text-xs text-stone-200 font-normal italic">
                                "{shop.slogan || 'Vitrine professionnelle dédiée.'}"
                            </p>
                            <div className="text-[11px] text-stone-300 font-normal flex items-center gap-2 pt-0.5">
                                <span>RCCM: {shop.registration_number || 'Non renseigné'}</span>
                                <span>•</span>
                                <span>{shop.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Local Actions */}
                    <div className="flex flex-wrap gap-2 relative z-10 w-full lg:w-auto">
                        <a 
                            href={route('shop.public', shop.slug)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-all shadow-xs"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Voir Vitrine Publique</span>
                        </a>
                        <Link 
                            href={route('seller.shop.products.create', shop.slug)}
                            className="px-3.5 py-2 bg-white text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5 text-amber-600" />
                            <span>Ajouter un Produit</span>
                        </Link>
                        <Link 
                            href={route('seller.shop.edit', shop.slug)}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                            title="Configuration de la boutique"
                        >
                            <Settings className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* COMPACT LOCAL KPI METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Revenue Card */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Chiffre d'Affaires Local</span>
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                                <DollarSign className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">
                            {Number(totalRevenue || 0).toLocaleString()} FCFA
                        </p>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Ventes propres à {shop.name}
                        </span>
                    </div>

                    {/* Catalogue Card */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Produits au Catalogue</span>
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Package className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">{productsCount} article(s)</p>
                        <span className="text-[11px] text-stone-400 font-normal">Stock global : {totalStock} unités</span>
                    </div>

                    {/* Promotions Card */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Promotions Actives</span>
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Tag className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">{promotionsCount} offre(s)</p>
                        <span className="text-[11px] text-amber-800 font-normal">Attractivité catalogue</span>
                    </div>

                    {/* Stock Alert Card */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Alertes Rupture Stock</span>
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">
                            {outOfStockCount > 0 ? `${outOfStockCount} épuisé(s)` : 'Aucune rupture'}
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">
                            {outOfStockCount > 0 ? 'Réapprovisionnement requis' : 'Stock en bon état'}
                        </span>
                    </div>

                </div>

                {/* GRAPH & TOP CATALOGUE ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Sales Curve Chart (8 cols) */}
                    <div className="lg:col-span-8 bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs space-y-3">
                        <div className="flex justify-between items-center pb-2.5 border-b border-stone-100">
                            <div>
                                <h3 className="font-semibold text-stone-900 text-sm">Ventes Spécifiques de {shop.name}</h3>
                                <p className="text-xs text-stone-400 font-normal">Évolution du chiffre d'affaires propre à cette boutique</p>
                            </div>
                            <span className="text-xs font-medium text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                7 Derniers Jours
                            </span>
                        </div>

                        <div className="h-56 flex flex-col justify-end pt-3">
                            <div className="relative w-full h-full flex-1">
                                <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="shop-gradient-clean" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={activeThemeColor} stopOpacity="0.25"/>
                                            <stop offset="100%" stopColor={activeThemeColor} stopOpacity="0.0"/>
                                        </linearGradient>
                                    </defs>
                                    
                                    <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                                    <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                                    <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />

                                    <path 
                                        d="M 0 140 L 100 115 L 200 60 L 300 95 L 400 25 L 500 45 L 600 15 L 600 180 L 0 180 Z" 
                                        fill="url(#shop-gradient-clean)" 
                                    />
                                    <path 
                                        d="M 0 140 L 100 115 L 200 60 L 300 95 L 400 25 L 500 45 L 600 15" 
                                        fill="none" 
                                        stroke={activeThemeColor} 
                                        strokeWidth="3" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                    />
                                    
                                    <circle cx="200" cy="60" r="4" fill="white" stroke={activeThemeColor} strokeWidth="2.5" />
                                    <circle cx="400" cy="25" r="4" fill="white" stroke={activeThemeColor} strokeWidth="2.5" />
                                    <circle cx="600" cy="15" r="4" fill="white" stroke={activeThemeColor} strokeWidth="2.5" />
                                </svg>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-stone-400 font-normal uppercase tracking-wider pt-2 px-1">
                                <span>Lun</span>
                                <span>Mar</span>
                                <span>Mer</span>
                                <span>Jeu</span>
                                <span>Ven</span>
                                <span>Sam</span>
                                <span>Dim</span>
                            </div>
                        </div>
                    </div>

                    {/* Fast Shop Actions & Controls (4 cols) */}
                    <div className="lg:col-span-4 bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-stone-900 text-sm border-b border-stone-100 pb-2">
                                Contrôle de la Boutique
                            </h3>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                Gérer les paramètres, les horaires, les offres promotionnelles et la disponibilité.
                            </p>
                        </div>

                        <div className="space-y-2 pt-1">
                            <Link 
                                href={route('seller.shop.products.index', shop.slug)}
                                className="w-full py-2 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-amber-700" />
                                    <span>Gérer le Catalogue</span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>

                            <Link 
                                href={route('seller.shop.promotions.index', shop.slug)}
                                className="w-full py-2 px-3.5 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Promotions Locales</span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>

                            <Link 
                                href={route('seller.shop.edit', shop.slug)}
                                className="w-full py-2 px-3.5 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Settings className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Paramètres & Horaires</span>
                                </span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* RECENT LOCAL ORDERS TABLE */}
                <div className="bg-white border border-stone-200/70 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-stone-900 text-sm">Dernières Commandes de {shop.name}</h3>
                            <p className="text-xs text-stone-400 font-normal">Commandes enregistrées sous séquestre</p>
                        </div>
                        <Link href={route('seller.shop.products.index', shop.slug)} className="text-xs font-medium text-amber-700 hover:underline">
                            Voir le catalogue
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-normal">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50 text-[11px] text-stone-500 font-medium">
                                    <th className="px-5 py-3">Réf / Produit</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3 text-right">Montant Total</th>
                                    <th className="px-5 py-3">Paiement</th>
                                    <th className="px-5 py-3 text-right">Suivi Colis</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-700">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-6 text-center text-stone-400">
                                            Aucune commande enregistrée pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                                            <td className="px-5 py-3">
                                                <span className="font-medium text-stone-900 block">{order.title}</span>
                                                <span className="text-[10px] text-stone-400 font-mono">Code: {order.tracking_code || '---'}</span>
                                            </td>
                                            <td className="px-5 py-3 text-stone-800">
                                                {order.delivery_info?.customer_name || 'Client anonyme'}
                                            </td>
                                            <td className="px-5 py-3 text-right font-medium text-stone-900">
                                                {Number(order.total_price).toLocaleString()} FCFA
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                                    ✓ Payé (Séquestre)
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <a 
                                                    href={route('public.order_tracking', order.tracking_code || '')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-amber-700 font-medium text-[11px] hover:underline"
                                                >
                                                    Suivre le colis
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </ShopConsoleLayout>
    );
}
