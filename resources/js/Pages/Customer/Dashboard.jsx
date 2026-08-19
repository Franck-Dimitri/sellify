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
    ExternalLink
} from 'lucide-react';

export default function Dashboard({ 
    stats = {}, 
    recentOrders = [], 
    featuredShops = [], 
    recommendedProducts = [] 
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const statusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livraison', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En cours de livraison', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré & Validé', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
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
        <CustomerLayout title="Tableau de bord Client">
            <Head title="Mon Espace Acheteur - Sellify" />

            <div className="w-full space-y-5 pb-16 text-stone-800 antialiased font-sans">
                
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-yellow-50/70 border border-yellow-200/80 p-5 rounded-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-yellow-800 font-medium text-xs uppercase tracking-wide">
                            <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Garantie de Protection Achats Escrow</span>
                        </div>
                        <h1 className="text-lg font-semibold text-stone-900">
                            Bonjour, {user.first_name} {user.last_name} 👋
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Suivez vos commandes, vos livraisons en cours et découvrez les nouveautés des boutiques certifiées.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href={route('customer.orders.index')}
                            className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Mes Commandes</span>
                        </Link>
                        <Link
                            href={route('public.shops.index')}
                            className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                            <Store className="w-3.5 h-3.5 text-stone-400" />
                            <span>Explorer Boutiques</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Total Spent */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Total Dépensé</span>
                            <div className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-700">
                                <DollarSign className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">
                            {Number(stats.total_spent || 0).toLocaleString('fr-FR')} FCFA
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Achats 100% sécurisés</span>
                    </div>

                    {/* Active In-Transit Orders */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">En Cours de Livraison</span>
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Truck className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-blue-600">
                            {stats.active_orders || 0} commande(s)
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Acheminement & suivi</span>
                    </div>

                    {/* Delivered Orders */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Commandes Réceptionnées</span>
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-emerald-600">
                            {stats.delivered_orders || 0} commande(s)
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Fonds Escrow validés</span>
                    </div>

                    {/* Loyalty Points */}
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Points Fidélité</span>
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-purple-600">
                            {stats.loyalty_points || 0} pts
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Bons de réduction actifs</span>
                    </div>
                </div>

                {/* Main 2-column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Left 2 Cols: Recent Orders */}
                    <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-stone-900">Mes Dernières Commandes</h2>
                                <p className="text-xs text-stone-500">Historique de vos achats avec séquestre Mobile Money</p>
                            </div>
                            <Link
                                href={route('customer.orders.index')}
                                className="text-xs text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1"
                            >
                                <span>Voir toutes</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-stone-100 text-[11px] font-medium text-stone-400 uppercase">
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
                                                <td className="py-2.5 px-3 font-mono font-medium text-stone-900">
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
                                                <td className="py-2.5 px-3 font-medium text-stone-800">
                                                    {order.shop?.name || 'Boutique'}
                                                </td>
                                                <td className="py-2.5 px-3 text-stone-600">
                                                    {order.items?.length || 0} article(s)
                                                </td>
                                                <td className="py-2.5 px-3 font-semibold text-stone-900">
                                                    {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    {statusBadge(order.delivery_status)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right">
                                                    <Link
                                                        href={route('customer.orders.show', order.order_number)}
                                                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium text-[11px] transition-colors"
                                                    >
                                                        Suivi & OTP
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
                                                    className="text-xs text-yellow-700 hover:underline font-medium mt-1 inline-block"
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

                    {/* Right Col: Top Shops & Recommendations */}
                    <div className="space-y-5">
                        
                        {/* Boutiques Certifiées */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-stone-900">Boutiques Vérifiées</h3>
                                <Link
                                    href={route('public.shops.index')}
                                    className="text-xs text-yellow-700 hover:underline font-medium"
                                >
                                    Toutes
                                </Link>
                            </div>

                            <div className="space-y-2.5">
                                {featuredShops.map((s) => (
                                    <div key={s.id} className="p-3 bg-stone-50 border border-stone-200/80 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center font-medium text-yellow-900 text-xs">
                                                {s.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-stone-900">{s.name}</p>
                                                <p className="text-[11px] text-stone-400">{s.products_count || 0} produit(s)</p>
                                            </div>
                                        </div>
                                        <a
                                            href={route('shop.public', s.slug)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-medium rounded-md border border-stone-200 flex items-center gap-1"
                                        >
                                            <span>Visiter</span>
                                            <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Produits Recommandés */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-stone-900">Articles Populaires</h3>
                                <Link
                                    href={route('public.products.index')}
                                    className="text-xs text-yellow-700 hover:underline font-medium"
                                >
                                    Catalogue
                                </Link>
                            </div>

                            <div className="space-y-2 text-xs">
                                {recommendedProducts.slice(0, 3).map((prod) => (
                                    <div key={prod.id} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/70 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-stone-900">{prod.name}</p>
                                            <p className="text-[11px] text-stone-500">{prod.shop?.name}</p>
                                        </div>
                                        <p className="font-semibold text-stone-900 text-xs shrink-0 ml-2">
                                            {Number(prod.price).toLocaleString('fr-FR')} FCFA
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </CustomerLayout>
    );
}
