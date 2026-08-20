import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    ShoppingBag, 
    DollarSign, 
    Sparkles, 
    ArrowRight, 
    Store, 
    Package, 
    Truck, 
    ShieldCheck, 
    CheckCircle2, 
    AlertTriangle,
    Eye,
    Key,
    ExternalLink,
    Gift,
    TrendingUp,
    BarChart2,
    PieChart,
    Clock,
    Activity,
    Heart,
    Bell
} from 'lucide-react';

export default function Dashboard({ 
    stats = {}, 
    recentOrders = [], 
    featuredShops = [], 
    recommendedProducts = [],
    monthlySpending = [],
    statusBreakdown = [],
    activityLogs = []
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const maxMonthly = Math.max(...monthlySpending.map(m => m.amount), 100000);

    const statusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livraison', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En cours de livraison', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré & validé', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
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
        <CustomerLayout title="Tableau de bord client">
            <Head title="Mon espace acheteur - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800 antialiased font-sans">
                
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-yellow-50/80 border border-yellow-200/90 p-6 rounded-2xl shadow-2xs">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-yellow-800 font-semibold text-xs tracking-wide">
                            <ShieldCheck className="w-4 h-4 text-yellow-600" />
                            <span>Garantie de protection achats Escrow active</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900">
                            Bonjour, {user.first_name} {user.last_name} 👋
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Suivez vos commandes en temps réel, consultez votre solde de parrainage et vos statistiques d'achat.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <Link
                            href={route('customer.orders.index')}
                            className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs border border-yellow-500"
                        >
                            <ShoppingBag className="w-4 h-4 text-yellow-950" />
                            <span>Mes commandes</span>
                        </Link>
                        <Link
                            href={route('customer.referral')}
                            className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                            <Gift className="w-4 h-4 text-yellow-400" />
                            <span>Parrainer (+500 F)</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Total Spent */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Total dépensé</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_spent || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Achats 100% sécurisés</span>
                    </div>

                    {/* Active In-Transit Orders */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Commandes en cours</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <Truck className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            {stats.active_orders || 0} <span className="text-xs font-medium text-stone-500">colis</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Livraison & suivi OTP</span>
                    </div>

                    {/* Delivered Orders */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Commandes réceptionnées</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                            {stats.delivered_orders || 0} <span className="text-xs font-medium text-stone-500">commandes</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Séquestres libérés</span>
                    </div>

                    {/* Loyalty Points */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Points & crédits</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-200">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                            {stats.loyalty_points || 0} <span className="text-xs font-medium text-stone-500">pts</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Réductions débloquées</span>
                    </div>
                </div>

                {/* STATS CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Monthly Spending Bar Chart (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Évolution des dépenses mensuelles (FCFA)</h3>
                            </div>
                            <span className="text-[11px] text-stone-400 font-medium">6 derniers mois</span>
                        </div>

                        {/* Bar Chart Visualization */}
                        <div className="pt-4 pb-2">
                            <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-stone-200 pb-2 px-2">
                                {monthlySpending.map((m, idx) => {
                                    const heightPercent = maxMonthly > 0 ? Math.max(12, Math.round((m.amount / maxMonthly) * 100)) : 12;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                                            <div className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-2 py-0.5 rounded shadow-xs">
                                                {Number(m.amount).toLocaleString('fr-FR')} F
                                            </div>
                                            <div 
                                                style={{ height: `${heightPercent}%` }}
                                                className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-xl group-hover:from-yellow-600 group-hover:to-yellow-500 transition-all duration-300 shadow-2xs"
                                            />
                                            <span className="text-[11px] font-semibold text-stone-600 truncate">{m.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Status Breakdown Donut/Progress (1 col) */}
                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Répartition par statut</h3>
                            </div>
                        </div>

                        <div className="space-y-4 pt-1">
                            {statusBreakdown.map((sb, idx) => {
                                const total = statusBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 1;
                                const percent = Math.round((sb.count / total) * 100);
                                return (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold">
                                            <span className="text-stone-700">{sb.status}</span>
                                            <span className="text-stone-900">{sb.count} ({percent}%)</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                                            <div 
                                                style={{ width: `${percent}%`, backgroundColor: sb.color }}
                                                className="h-full rounded-full transition-all duration-500"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-2 border-t border-stone-100">
                            <Link 
                                href={route('customer.orders.index')}
                                className="w-full py-2.5 bg-stone-50 hover:bg-yellow-50 hover:text-yellow-950 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                            >
                                <span>Gérer mes commandes</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Main 2-column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left 2 Cols: Recent Orders */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div>
                                <h2 className="text-sm font-bold text-stone-900">Mes dernières commandes</h2>
                                <p className="text-xs text-stone-500 font-normal">Historique de vos achats avec séquestre Mobile Money</p>
                            </div>
                            <Link
                                href={route('customer.orders.index')}
                                className="text-xs text-yellow-700 hover:text-yellow-800 font-semibold flex items-center gap-1"
                            >
                                <span>Voir toutes</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase">
                                        <th className="py-2.5 px-3">Commande</th>
                                        <th className="py-2.5 px-3">Boutique</th>
                                        <th className="py-2.5 px-3">Articles</th>
                                        <th className="py-2.5 px-3">Montant</th>
                                        <th className="py-2.5 px-3">Statut</th>
                                        <th className="py-2.5 px-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 text-xs">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                                                <td className="py-3 px-3 font-mono font-bold text-stone-900">
                                                    <Link 
                                                        href={route('customer.orders.show', order.order_number)}
                                                        className="hover:text-yellow-700 hover:underline"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                    <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                            day: '2-digit', month: 'short'
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 font-semibold text-stone-800">
                                                    {order.shop?.name || 'Boutique'}
                                                </td>
                                                <td className="py-3 px-3 text-stone-600">
                                                    {order.items?.length || 0} article(s)
                                                </td>
                                                <td className="py-3 px-3 font-bold text-stone-900">
                                                    {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                                                </td>
                                                <td className="py-3 px-3">
                                                    {statusBadge(order.delivery_status)}
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <Link
                                                        href={route('customer.orders.show', order.order_number)}
                                                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <Key className="w-3 h-3 text-stone-500" />
                                                        <span>OTP & Suivi</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-stone-400">
                                                <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                                                <p className="text-xs">Vous n'avez pas encore passé de commande.</p>
                                                <Link 
                                                    href={route('public.products.index')} 
                                                    className="text-xs text-yellow-700 hover:underline font-semibold mt-1 inline-block"
                                                >
                                                    Découvrir le catalogue &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Col: Top Shops & Activity Stream */}
                    <div className="space-y-6">
                        
                        {/* Boutiques Certifiées */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                <h3 className="text-sm font-bold text-stone-900">Boutiques certifiées</h3>
                                <Link
                                    href={route('public.shops.index')}
                                    className="text-xs text-yellow-700 hover:underline font-semibold"
                                >
                                    Toutes
                                </Link>
                            </div>

                            <div className="space-y-2.5">
                                {featuredShops.map((s) => (
                                    <div key={s.id} className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center font-bold text-yellow-900 text-xs border border-yellow-200">
                                                {s.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-stone-900">{s.name}</p>
                                                <p className="text-[11px] text-stone-400 font-normal">{s.products_count || 0} produit(s)</p>
                                            </div>
                                        </div>
                                        <a
                                            href={route('shop.public', s.slug)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-semibold rounded-lg border border-stone-200 flex items-center gap-1 transition-colors"
                                        >
                                            <span>Visiter</span>
                                            <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Stream */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-3 shadow-2xs">
                            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                                <Activity className="w-4 h-4 text-yellow-600" />
                                <span>Flux d'activité récent</span>
                            </h3>

                            {activityLogs && activityLogs.length > 0 ? (
                                <div className="space-y-2.5 text-xs">
                                    {activityLogs.map((log) => (
                                        <div key={log.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                                            <p className="font-semibold text-stone-800 text-[11px]">{log.description}</p>
                                            <span className="text-[10px] text-stone-400 block">{new Date(log.created_at).toLocaleString('fr-FR')}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400 text-center py-4">Aucune activité enregistrée récemment.</p>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </CustomerLayout>
    );
}
