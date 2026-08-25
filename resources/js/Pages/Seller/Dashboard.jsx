import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SellerCentralLayout from '../../Layouts/SellerCentralLayout';
import { 
    Store, 
    ShoppingBag, 
    DollarSign, 
    ArrowUpRight, 
    Clock, 
    ArrowRight, 
    Package, 
    Boxes, 
    Sparkles, 
    BarChart2, 
    CheckCircle2, 
    Eye,
    ShieldCheck,
    Plus,
    Truck
} from 'lucide-react';

export default function Dashboard({ 
    shopsData = [], 
    totalStock = 0, 
    totalProducts = 0,
    totalRevenue = 0,
    pendingOrdersCount = 0,
    deliveredOrdersCount = 0,
    recentOrders = [], 
    activityLogs = [] 
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const seller = user?.seller;
    const shops = shopsData;

    const [selectedShopId, setSelectedShopId] = useState('general');
    const selectedShop = shops.find(s => String(s.id) === String(selectedShopId));

    const displayedOrders = selectedShopId === 'general'
        ? recentOrders
        : recentOrders.filter(o => String(o.shop_id) === String(selectedShopId));

    const statusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livreur', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En livraison', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            cancelled: { label: 'Annulé', bg: 'bg-rose-50 text-rose-900 border-rose-200' },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <SellerCentralLayout title="Tableau de bord Vendeur">
            <Head title="Tableau de bord - Sellify" />

            <div className="w-full space-y-5 pb-16 text-stone-800 antialiased font-sans">
                
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-yellow-50/70 border border-yellow-200/80 p-5 rounded-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-yellow-800 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Espace Vendeur Centralisé</span>
                        </div>
                        <h1 className="text-lg font-semibold text-stone-900">
                            Bonjour, {user.first_name} {user.last_name} 👋
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Supervision consolidée de vos boutiques, vos commandes et de vos revenus Escrow.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            className="bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-800 focus:ring-2 focus:ring-yellow-500 outline-none cursor-pointer shadow-xs"
                        >
                            <option value="general">Vue Globale (Toutes les boutiques)</option>
                            {shops.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>

                        <Link
                            href={route('seller.orders.index')}
                            className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Gérer Commandes</span>
                        </Link>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Revenue Card */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Chiffre d'Affaires</span>
                            <div className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-700">
                                <DollarSign className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">
                            {Number(totalRevenue || 0).toLocaleString('fr-FR')} FCFA
                        </p>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Escrow sécurisé
                        </span>
                    </div>

                    {/* Pending Preparation Card */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">À Préparer</span>
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Package className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-blue-600">
                            {pendingOrdersCount} commande(s)
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Colisage en cours</span>
                    </div>

                    {/* Stock Card */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Produits & Stock</span>
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Boxes className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">{totalProducts} produit(s)</p>
                        <span className="text-[11px] text-stone-400 font-normal">Stock total : {totalStock} unités</span>
                    </div>

                    {/* Shops Count Card */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Boutiques Actives</span>
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Store className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">{shops.length} boutique(s)</p>
                        <span className="text-[11px] text-stone-400 font-normal">Pack {seller?.pack?.toUpperCase() || 'STARTER'}</span>
                    </div>
                </div>

                {/* SELLIFY AI 1.2 FLASH PROACTIVE COPILOT BANNER */}
                <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-5 sm:p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                        <div className="space-y-1.5 max-w-xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-yellow-950 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Sellify AI 1.2 Flash</span>
                                </span>
                                <span className="text-stone-400 text-xs font-medium">Copilote Vendeur & Optimisation</span>
                            </div>
                            <h2 className="text-base font-bold text-white">
                                Boostez vos ventes, générez des descriptions produits et optimisez votre catalogue
                            </h2>
                            <p className="text-xs text-stone-300 font-normal leading-relaxed">
                                Analysez la rentabilité de vos stocks, concevez des campagnes WhatsApp virales avec Smart-Links et simulez des micro-crédits d'approvisionnement en temps réel.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <Link
                                href={route('seller.ai.index')}
                                className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs"
                            >
                                <Sparkles className="w-4 h-4 text-yellow-950" />
                                <span>Lancer Sellify AI Copilote</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main 2-column Grid: Recent Orders & Shops list */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Left 2 Cols: Recent Orders */}
                    <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-stone-900">Commandes Récentes</h2>
                                <p className="text-xs text-stone-500">Dernières transactions enregistrées sur vos boutiques</p>
                            </div>
                            <Link
                                href={route('seller.orders.index')}
                                className="text-xs text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1"
                            >
                                <span>Voir tout</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-stone-100 text-[11px] font-medium text-stone-400 uppercase">
                                        <th className="py-2.5 px-3">Commande</th>
                                        <th className="py-2.5 px-3">Client</th>
                                        <th className="py-2.5 px-3">Boutique</th>
                                        <th className="py-2.5 px-3">Montant</th>
                                        <th className="py-2.5 px-3">Statut</th>
                                        <th className="py-2.5 px-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 text-xs">
                                    {displayedOrders.length > 0 ? (
                                        displayedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                                                <td className="py-2.5 px-3 font-mono font-medium text-stone-900">
                                                    {order.order_number}
                                                </td>
                                                <td className="py-2.5 px-3 font-medium text-stone-800">
                                                    {order.customer_name}
                                                </td>
                                                <td className="py-2.5 px-3 text-stone-600">
                                                    {order.shop?.name || 'Boutique'}
                                                </td>
                                                <td className="py-2.5 px-3 font-semibold text-stone-900">
                                                    {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    {statusBadge(order.delivery_status)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right">
                                                    <Link
                                                        href={route('seller.orders.show', order.order_number)}
                                                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium text-[11px] transition-colors"
                                                    >
                                                        Détails
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-stone-400">
                                                <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                                                <p className="text-xs">Aucune commande enregistrée pour le moment.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Col: Your Shops Quick List & Activity */}
                    <div className="space-y-5">
                        
                        {/* Shops Card */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-stone-900">Mes Boutiques</h3>
                                <Link
                                    href={route('seller.shop.index')}
                                    className="text-xs text-yellow-700 hover:underline font-medium"
                                >
                                    Gérer
                                </Link>
                            </div>

                            <div className="space-y-2.5">
                                {shops.map((s) => (
                                    <div key={s.id} className="p-3 bg-stone-50 border border-stone-200/80 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center font-medium text-yellow-900 text-xs">
                                                {s.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-stone-900">{s.name}</p>
                                                <p className="text-[11px] text-stone-400">{s.products?.length || 0} produit(s)</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('seller.shop.dashboard', s.slug)}
                                            className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-medium rounded-md border border-stone-200"
                                        >
                                            Console
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
                            <h3 className="text-sm font-semibold text-stone-900">Activité Récente</h3>
                            <div className="space-y-2.5 text-xs">
                                {activityLogs.slice(0, 5).map((log) => (
                                    <div key={log.id} className="flex items-start gap-2 text-stone-600">
                                        <Clock className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-stone-800 font-normal leading-tight">{log.description}</p>
                                            <p className="text-[10px] text-stone-400 mt-0.5">
                                                {new Date(log.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </SellerCentralLayout>
    );
}
