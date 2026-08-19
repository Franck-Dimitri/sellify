import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';
import { 
    ShoppingBag, 
    Search, 
    Filter, 
    Clock, 
    CheckCircle2, 
    Truck, 
    Package, 
    AlertCircle, 
    Eye, 
    Printer, 
    Store,
    DollarSign,
    ShieldCheck,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

export default function Index({ orders, stats, shops = [], filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedShop, setSelectedShop] = useState(filters.shop_id || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(filters.payment_status || 'all');

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(route('seller.orders.index'), {
            search: searchTerm || undefined,
            shop_id: selectedShop !== 'all' ? selectedShop : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            payment_status: selectedPaymentStatus !== 'all' ? selectedPaymentStatus : undefined,
        }, { preserveState: true });
    };

    const statusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livreur', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
            in_transit: { label: 'En livraison', bg: 'bg-purple-50 text-purple-800 border-purple-200' },
            delivered: { label: 'Livré', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            cancelled: { label: 'Annulé', bg: 'bg-rose-50 text-rose-800 border-rose-200' },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    const paymentBadge = (status) => {
        const map = {
            escrow_held: { label: 'Escrow Bloqué', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200', icon: ShieldCheck },
            released: { label: 'Payé & Débloqué', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', icon: CheckCircle2 },
            refunded: { label: 'Remboursé', bg: 'bg-stone-100 text-stone-700 border-stone-200', icon: AlertCircle },
            disputed: { label: 'En litige', bg: 'bg-rose-50 text-rose-900 border-rose-200', icon: AlertCircle },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200', icon: DollarSign };
        const Icon = conf.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                <Icon className="w-3 h-3" />
                <span>{conf.label}</span>
            </span>
        );
    };

    return (
        <SellerCentralLayout title="Gestion des Commandes">
            <Head title="Commandes Reçues - Espace Vendeur" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-yellow-700 uppercase tracking-wide">
                            <ShoppingBag className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Commandes & Expéditions</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900 mt-1">
                            Commandes de vos Boutiques
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Suivez les commandes entrantes, préparez les colis et remettez-les aux livreurs certifiés.
                        </p>
                    </div>
                </div>

                {/* KPI Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    <div className="bg-white border border-stone-200 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-stone-500 font-medium">Total Commandes</p>
                            <ShoppingBag className="w-4 h-4 text-stone-400" />
                        </div>
                        <p className="text-2xl font-semibold text-stone-900 mt-2">{stats.total || 0}</p>
                        <p className="text-[11px] text-stone-400 mt-1">Historique consolidé</p>
                    </div>

                    <div className="bg-white border border-stone-200 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-stone-500 font-medium">À Préparer</p>
                            <Package className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-semibold text-blue-600 mt-2">{stats.pending_prep || 0}</p>
                        <p className="text-[11px] text-stone-400 mt-1">En attente de colisage</p>
                    </div>

                    <div className="bg-white border border-stone-200 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-stone-500 font-medium">Prêts Enlèvement</p>
                            <Truck className="w-4 h-4 text-yellow-600" />
                        </div>
                        <p className="text-2xl font-semibold text-yellow-600 mt-2">{stats.ready_for_pickup || 0}</p>
                        <p className="text-[11px] text-stone-400 mt-1">Attente passage livreur</p>
                    </div>

                    <div className="bg-white border border-stone-200 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-stone-500 font-medium">Escrow Sécurisé</p>
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xl font-semibold text-emerald-600 mt-2">
                            {Number(stats.escrow_locked_amount || 0).toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">Fonds bloqués à libérer</p>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="bg-white border border-stone-200 p-3.5 rounded-xl">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
                        <div className="relative lg:col-span-2">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="N° Commande (SLF-...), Client, Téléphone..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-colors"
                            />
                        </div>

                        <div>
                            <select
                                value={selectedShop}
                                onChange={(e) => {
                                    setSelectedShop(e.target.value);
                                    router.get(route('seller.orders.index'), {
                                        search: searchTerm || undefined,
                                        shop_id: e.target.value !== 'all' ? e.target.value : undefined,
                                        status: selectedStatus !== 'all' ? selectedStatus : undefined,
                                    }, { preserveState: true });
                                }}
                                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                            >
                                <option value="all">Toutes les boutiques</option>
                                {shops.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    router.get(route('seller.orders.index'), {
                                        search: searchTerm || undefined,
                                        shop_id: selectedShop !== 'all' ? selectedShop : undefined,
                                        status: e.target.value !== 'all' ? e.target.value : undefined,
                                    }, { preserveState: true });
                                }}
                                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                            >
                                <option value="all">Tous les statuts livraison</option>
                                <option value="pending">En attente</option>
                                <option value="preparing">En préparation</option>
                                <option value="ready_for_pickup">Prêt pour livreur</option>
                                <option value="in_transit">En livraison</option>
                                <option value="delivered">Livré</option>
                                <option value="cancelled">Annulé</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg transition-colors"
                            >
                                Filtrer
                            </button>
                            {(searchTerm || selectedShop !== 'all' || selectedStatus !== 'all' || selectedPaymentStatus !== 'all') && (
                                <Link
                                    href={route('seller.orders.index')}
                                    className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-lg"
                                >
                                    Effacer
                                </Link>
                            )}
                        </div>
                    </form>
                </div>

                {/* Orders Table */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Commande</th>
                                    <th className="py-3 px-4">Boutique</th>
                                    <th className="py-3 px-4">Client & Ville</th>
                                    <th className="py-3 px-4">Articles</th>
                                    <th className="py-3 px-4">Montant Total</th>
                                    <th className="py-3 px-4">Paiement Escrow</th>
                                    <th className="py-3 px-4">Statut Livraison</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-xs">
                                {orders?.data && orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3 px-4 font-mono font-medium text-stone-900">
                                                <Link 
                                                    href={route('seller.orders.show', order.order_number)}
                                                    className="text-stone-900 hover:text-yellow-700 hover:underline"
                                                >
                                                    {order.order_number}
                                                </Link>
                                                <span className="block text-[11px] text-stone-400 font-sans font-normal">
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-stone-700">
                                                <div className="flex items-center gap-1.5">
                                                    <Store className="w-3.5 h-3.5 text-stone-400" />
                                                    <span>{order.shop?.name || 'Boutique'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-stone-900">{order.customer_name}</p>
                                                <p className="text-[11px] text-stone-500">{order.customer_phone} • {order.city}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-stone-700 font-normal">
                                                    {order.items?.length || 0} article(s)
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-stone-900">
                                                {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3 px-4">
                                                {paymentBadge(order.payment_status)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {statusBadge(order.delivery_status)}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={route('seller.orders.show', order.order_number)}
                                                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium text-xs transition-colors"
                                                    >
                                                        Détails
                                                    </Link>
                                                    <a
                                                        href={route('seller.orders.print', order.order_number)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Imprimer bordereau"
                                                        className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-stone-500">
                                            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-stone-700">Aucune commande trouvée</p>
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                Les nouvelles commandes de vos boutiques apparaîtront automatiquement ici.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders?.links && orders.links.length > 3 && (
                        <div className="py-3 px-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                            <span>Affichage de {orders.from || 0} à {orders.to || 0} sur {orders.total || 0} commandes</span>
                            <div className="flex gap-1">
                                {orders.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded-md border text-xs font-medium ${
                                            link.active 
                                                ? 'bg-yellow-500 text-stone-950 border-yellow-500' 
                                                : link.url 
                                                    ? 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50' 
                                                    : 'text-stone-300 border-stone-100 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </SellerCentralLayout>
    );
}
