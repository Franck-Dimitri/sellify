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
    FileText,
    X,
    User,
    MapPin,
    ShieldCheck
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Index({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    // Chart.js Configuration
    const ordersBarData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Commandes traitées',
                data: [14, 22, 19, 31, 45, 52, 38],
                backgroundColor: '#f59e0b',
                borderRadius: 6,
            }
        ]
    };

    const ordersBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(231, 229, 228, 0.6)' } }
        }
    };

    const ordersDoughnutData = {
        labels: ['En attente', 'En transit', 'Livrées', 'Annulées'],
        datasets: [
            {
                data: [stats.pending_orders || 15, stats.in_transit_orders || 8, stats.delivered_orders || 42, stats.cancelled_orders || 4],
                backgroundColor: ['#3b82f6', '#a855f7', '#10b981', '#f43f5e'],
                borderWidth: 0,
            }
        ]
    };

    const ordersDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        cutout: '70%'
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
                            Inspection détaillée des commandes, du statut de livraison et du code OTP de sécurité.
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
                        <span className="text-[11px] text-stone-400 font-normal">Commandes enregistrées</span>
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

                {/* CHART.JS CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Volume quotidien des commandes</h3>
                            <span className="text-xs text-stone-400">Chart.js Graphique</span>
                        </div>
                        <div className="h-52">
                            <Bar data={ordersBarData} options={ordersBarOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Répartition par statut</h3>
                        </div>
                        <div className="h-52 relative flex items-center justify-center">
                            <Doughnut data={ordersDoughnutData} options={ordersDoughnutOptions} />
                        </div>
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
                                                <button
                                                    onClick={() => setSelectedOrder(o)}
                                                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-xl font-bold text-[11px] transition-colors inline-flex items-center gap-1 border border-yellow-500"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Inspecter</span>
                                                </button>
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

            {/* ORDER INSPECTION MODAL */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-stone-200/90 rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-150">
                        
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-base text-stone-900">Inspection commande #{selectedOrder.order_number}</h3>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-stone-700">
                            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
                                <div>
                                    <span className="text-stone-400 block">Acheteur :</span>
                                    <strong className="text-stone-900">{selectedOrder.user?.first_name} {selectedOrder.user?.last_name}</strong>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Boutique :</span>
                                    <strong className="text-stone-900">{selectedOrder.shop?.name}</strong>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
                                <div>
                                    <span className="text-stone-400 block">Montant commande :</span>
                                    <strong className="text-stone-900 text-sm">{Number(selectedOrder.total_amount).toLocaleString('fr-FR')} FCFA</strong>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Code OTP de sécurité :</span>
                                    <strong className="text-yellow-700 font-mono text-sm">{selectedOrder.delivery_otp || 'Non généré'}</strong>
                                </div>
                            </div>

                            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                                <span className="text-stone-400 block">Statut paiement Escrow :</span>
                                <strong>{selectedOrder.payment_status || 'escrow_held'}</strong>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
                            >
                                Fermer l'inspection
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
