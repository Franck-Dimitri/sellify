import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Package, 
    Search, 
    Eye, 
    Truck, 
    CheckCircle2, 
    Clock, 
    XCircle,
    Store,
    Key,
    ShoppingBag,
    FileText
} from 'lucide-react';

export default function Index({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.orders.index'), { search, status }, { preserveState: true });
    };

    const handleTabChange = (st) => {
        setStatus(st);
        router.get(route('admin.orders.index'), { search, status: st }, { preserveState: true });
    };

    const statusBadge = (st) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livraison', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En cours (OTP)', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré & validé', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            cancelled: { label: 'Annulé', bg: 'bg-rose-50 text-rose-900 border-rose-200' },
        };
        const conf = map[st] || { label: st, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <AdminLayout title="Gestion des commandes">
            <Head title="Commandes globales - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Package className="w-4 h-4 text-yellow-600" />
                            <span>Supervision des ventes & livraisons</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Commandes globales de la plateforme
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Suivez l'état d'avancement des commandes, les livraisons en cours et les reçus sous séquestre.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Total commandes</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">{stats.total_orders || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Commandes passées</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">En attente / Préparation</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{stats.pending_orders || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Traitement vendeur</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">En cours de livraison</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-200">
                                <Truck className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">{stats.in_transit_orders || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Validation par OTP secret</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Livrées & clôturées</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.delivered_orders || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Fonds sous séquestre libérés</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                            {[
                                { id: 'all', label: 'Toutes' },
                                { id: 'pending', label: 'En attente' },
                                { id: 'in_transit', label: 'En cours' },
                                { id: 'delivered', label: 'Livrées' },
                                { id: 'cancelled', label: 'Annulées' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        status === tab.id
                                            ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500'
                                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="N° commande, client ou boutique..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Commande</th>
                                    <th className="py-3 px-4">Acheteur</th>
                                    <th className="py-3 px-4">Boutique</th>
                                    <th className="py-3 px-4">Montant total</th>
                                    <th className="py-3 px-4">Statut livraison</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map((o) => (
                                        <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                                                #{o.order_number}
                                                <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                                    {new Date(o.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-stone-800">
                                                {o.user ? `${o.user.first_name} ${o.user.last_name}` : 'Client'}
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-700 font-medium">
                                                {o.shop?.name || 'Boutique'}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-stone-900">
                                                {Number(o.total_amount).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {statusBadge(o.delivery_status)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('customer.orders.show', o.order_number)}
                                                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Détails</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-stone-400">
                                            Aucune commande trouvée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
