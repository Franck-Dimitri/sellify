import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    CreditCard, 
    Search, 
    ShieldCheck, 
    DollarSign, 
    Percent, 
    CheckCircle2, 
    AlertTriangle, 
    Eye,
    X,
    Lock,
    Unlock,
    RotateCcw,
    MapPin,
    User,
    Store,
    Key,
    Clock
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

export default function Index({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || 'all');
    const [selectedOrder, setSelectedOrder] = useState(null); // Inspection Modal state
    const { post, processing } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.escrow.index'), { search, payment_status: paymentStatus }, { preserveState: true });
    };

    const handleTabChange = (st) => {
        setPaymentStatus(st);
        router.get(route('admin.escrow.index'), { search, payment_status: st }, { preserveState: true });
    };

    const handleForceRelease = (orderNumber) => {
        if (confirm(`Voulez-vous libérer les fonds Escrow de la commande #${orderNumber} au vendeur ?`)) {
            post(route('admin.escrow.release', orderNumber), {
                onSuccess: () => setSelectedOrder(null)
            });
        }
    };

    const handleForceRefund = (orderNumber) => {
        if (confirm(`Voulez-vous forcer le remboursement intégral de la commande #${orderNumber} à l'acheteur ?`)) {
            post(route('admin.escrow.refund', orderNumber), {
                onSuccess: () => setSelectedOrder(null)
            });
        }
    };

    const handleLockEscrow = (orderNumber) => {
        if (confirm(`Voulez-vous geler/bloquer les fonds Escrow de la commande #${orderNumber} pour litige ?`)) {
            post(route('admin.escrow.lock', orderNumber), {
                onSuccess: () => setSelectedOrder(null)
            });
        }
    };

    const paymentStatusBadge = (st) => {
        const map = {
            escrow_held: { label: 'Sous séquestre (Bloqué)', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            released: { label: 'Libéré au vendeur', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            refunded: { label: 'Remboursé à l\'acheteur', bg: 'bg-rose-50 text-rose-900 border-rose-200' },
        };
        const conf = map[st] || { label: st, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    // Chart.js Data Configs
    const escrowLineData = {
        labels: ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'],
        datasets: [
            {
                label: 'Volume Escrow Consigné (FCFA)',
                data: [450000, 890000, 1420000, 2100000, 3400000, stats.total_volume || 4200000],
                borderColor: '#eab308',
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
            }
        ]
    };

    const escrowLineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y.toLocaleString('fr-FR')} FCFA`
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                grid: { color: 'rgba(231, 229, 228, 0.6)' },
                ticks: {
                    callback: (value) => `${(value / 1000).toLocaleString()}k`
                }
            }
        }
    };

    const escrowDoughnutData = {
        labels: ['Sous séquestre', 'Libérés vendeurs', 'Remboursés'],
        datasets: [
            {
                data: [stats.escrow_held || 1200000, stats.released || 2800000, stats.refunded || 200000],
                backgroundColor: ['#eab308', '#10b981', '#f43f5e'],
                borderWidth: 0,
            }
        ]
    };

    const escrowDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        },
        cutout: '70%'
    };

    return (
        <AdminLayout title="Garantie Escrow & séquestres">
            <Head title="Gestion Escrow & paiements - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <ShieldCheck className="w-4 h-4 text-yellow-600" />
                            <span>Séquestre financier Mobile Money</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Gestion & inspection des garanties Escrow
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Inspection détaillée des consignations Mobile Money, blocage et déblocage manuel des fonds.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Volume total consigné</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_volume || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Flux Mobile Money sous séquestre</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Actuellement bloqués</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <CreditCard className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">
                            {Number(stats.escrow_held || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">En attente de réception OTP</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Fonds libérés vendeurs</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                            {Number(stats.released || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Paiements vendeurs réglés</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Commissions Sellify (3%)</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700 border border-purple-200">
                                <Percent className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">
                            {Number(stats.platform_commission || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Revenus plateforme</span>
                    </div>
                </div>

                {/* CHART.JS CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Line Chart: Escrow Volume Trend */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Évolution mensuelle du séquestre Escrow (FCFA)</h3>
                            <span className="text-xs text-stone-400">Chart.js Graphique</span>
                        </div>
                        <div className="h-56">
                            <Line data={escrowLineData} options={escrowLineOptions} />
                        </div>
                    </div>

                    {/* Doughnut Chart: Status Breakdown */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Répartition des fonds</h3>
                        </div>
                        <div className="h-56 relative flex items-center justify-center">
                            <Doughnut data={escrowDoughnutData} options={escrowDoughnutOptions} />
                        </div>
                    </div>

                </div>

                {/* Filters */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                            {[
                                { id: 'all', label: 'Toutes les consignes' },
                                { id: 'escrow_held', label: 'Bloqués sous séquestre' },
                                { id: 'released', label: 'Libérés' },
                                { id: 'refunded', label: 'Remboursés' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        paymentStatus === tab.id
                                            ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500 font-bold'
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
                                placeholder="Rechercher par N° commande, client..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </form>
                    </div>
                </div>

                {/* Escrow Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">N° Commande</th>
                                    <th className="py-3 px-4">Acheteur</th>
                                    <th className="py-3 px-4">Boutique destinataire</th>
                                    <th className="py-3 px-4">Montant séquestre</th>
                                    <th className="py-3 px-4">Statut Escrow</th>
                                    <th className="py-3 px-4 text-right">Inspection & Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map((o) => (
                                        <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                                                #{o.order_number}
                                                <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                                    OTP: {o.delivery_otp || 'N/A'}
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
                                                {paymentStatusBadge(o.payment_status)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
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
                                            Aucune consigne Escrow trouvée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* INSPECTION MODAL DRAWER */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-stone-200/90 rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-150">
                        
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-base text-stone-900">Inspection consigne #{selectedOrder.order_number}</h3>
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
                                    <span className="text-[10px] text-stone-400 block">{selectedOrder.user?.email}</span>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Boutique destinataire :</span>
                                    <strong className="text-stone-900">{selectedOrder.shop?.name}</strong>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
                                <div>
                                    <span className="text-stone-400 block">Montant en séquestre :</span>
                                    <strong className="text-stone-900 text-sm">{Number(selectedOrder.total_amount).toLocaleString('fr-FR')} FCFA</strong>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Code OTP de livraison :</span>
                                    <strong className="text-yellow-700 font-mono text-sm">{selectedOrder.delivery_otp || 'N/A'}</strong>
                                </div>
                            </div>

                            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                                <span className="text-stone-400 block">Adresse de livraison :</span>
                                <strong className="text-stone-900">{selectedOrder.shipping_address || 'Non spécifiée'}</strong>
                            </div>
                        </div>

                        {/* Admin Action Control Buttons */}
                        <div className="pt-3 border-t border-stone-100 space-y-2">
                            <span className="text-xs font-bold text-stone-900 block">Contrôle des fonds par l'Administrateur :</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleForceRelease(selectedOrder.order_number)}
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>Débloquer fonds au vendeur</span>
                                </button>
                                <button
                                    onClick={() => handleLockEscrow(selectedOrder.order_number)}
                                    disabled={processing}
                                    className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition-colors border border-amber-300 flex items-center gap-1.5"
                                >
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Geler fonds</span>
                                </button>
                                <button
                                    onClick={() => handleForceRefund(selectedOrder.order_number)}
                                    disabled={processing}
                                    className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Rembourser acheteur</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
