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
    recentProducts = [],
    weeklySales = []
}) {
    const { auth } = usePage().props;
    const activeThemeColor = shop?.theme_color || '#F59E0B';

    // Build dynamic points for the 7-day sales curve
    const maxAmount = Math.max(...weeklySales.map(d => Number(d.amount) || 0), 0);
    const chartPoints = (weeklySales.length === 7 ? weeklySales : [
        { day: 'Lun', date: '', amount: 0 },
        { day: 'Mar', date: '', amount: 0 },
        { day: 'Mer', date: '', amount: 0 },
        { day: 'Jeu', date: '', amount: 0 },
        { day: 'Ven', date: '', amount: 0 },
        { day: 'Sam', date: '', amount: 0 },
        { day: 'Dim', date: '', amount: 0 }
    ]).map((d, index) => {
        const x = index * 100;
        const y = maxAmount > 0 
            ? Math.round(150 - ((Number(d.amount) || 0) / maxAmount) * 120) 
            : 150;
        return { x, y, ...d };
    });

    const pathD = chartPoints.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
    const areaD = `${pathD} L 600 180 L 0 180 Z`;

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
                                        ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' 
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
                            <Plus className="w-3.5 h-3.5 text-yellow-600" />
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
                            <div className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-700">
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
                        <span className="text-[11px] text-yellow-800 font-normal">Attractivité catalogue</span>
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
                            <span className="text-xs font-medium text-yellow-900 bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-200">
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
                                        d={areaD} 
                                        fill="url(#shop-gradient-clean)" 
                                    />
                                    <path 
                                        d={pathD} 
                                        fill="none" 
                                        stroke={activeThemeColor} 
                                        strokeWidth="3" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                    />
                                    
                                    {chartPoints.map((pt, idx) => (
                                        <g key={idx}>
                                            <circle 
                                                cx={pt.x} 
                                                cy={pt.y} 
                                                r="4" 
                                                fill="white" 
                                                stroke={activeThemeColor} 
                                                strokeWidth="2.5" 
                                            />
                                        </g>
                                    ))}
                                </svg>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-stone-500 font-normal uppercase tracking-wider pt-2 px-1">
                                {chartPoints.map((pt, idx) => (
                                    <div key={idx} className="text-center">
                                        <span className="block font-medium text-stone-600">{pt.day}</span>
                                        <span className="block text-[9px] text-stone-400 font-mono">
                                            {Number(pt.amount || 0) > 0 ? `${Number(pt.amount).toLocaleString()} F` : '0 F'}
                                        </span>
                                    </div>
                                ))}
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
                                className="w-full py-2 px-3.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-950 border border-yellow-200 rounded-lg text-xs font-medium flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-yellow-700" />
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
                        <Link href={route('seller.shop.products.index', shop.slug)} className="text-xs font-medium text-yellow-700 hover:underline">
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
                                    recentOrders.map(order => {
                                        const productNames = order.items && order.items.length > 0
                                            ? order.items.map(it => it.product?.name || 'Produit').slice(0, 2).join(', ') + (order.items.length > 2 ? '...' : '')
                                            : 'Commande directe';
                                        return (
                                            <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                                                <td className="px-5 py-3">
                                                    <span className="font-medium text-stone-900 block">{order.order_number}</span>
                                                    <span className="text-[10px] text-stone-400 truncate block max-w-xs">{productNames}</span>
                                                </td>
                                                <td className="px-5 py-3 text-stone-800">
                                                    {order.customer_name || 'Client anonyme'}
                                                    {order.customer_phone && <span className="block text-[10px] text-stone-400">{order.customer_phone}</span>}
                                                </td>
                                                <td className="px-5 py-3 text-right font-medium text-stone-900">
                                                    {Number(order.total_amount || 0).toLocaleString()} FCFA
                                                </td>
                                                <td className="px-5 py-3">
                                                    {order.payment_status === 'released' ? (
                                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                                            ✓ Libéré
                                                        </span>
                                                    ) : order.payment_status === 'escrow_held' ? (
                                                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                                            ⏳ Séquestre
                                                        </span>
                                                    ) : (
                                                        <span className="bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                                            {order.payment_status || 'En attente'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <Link 
                                                        href={route('seller.orders.show', order.order_number)}
                                                        className="text-yellow-700 font-medium text-[11px] hover:underline inline-flex items-center gap-1"
                                                    >
                                                        Détails &rarr;
                                                    </Link>
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
        </ShopConsoleLayout>
    );
}
