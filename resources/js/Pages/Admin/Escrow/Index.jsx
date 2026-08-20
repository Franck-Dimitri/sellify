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
    ArrowUpRight,
    RefreshCw
} from 'lucide-react';

export default function Index({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || 'all');
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
        if (confirm(`Voulez-vous forcer la libération des fonds Escrow pour la commande #${orderNumber} au vendeur ?`)) {
            post(route('admin.escrow.release', orderNumber));
        }
    };

    const handleForceRefund = (orderNumber) => {
        if (confirm(`Voulez-vous forcer le remboursement intégral de la commande #${orderNumber} à l'acheteur ?`)) {
            post(route('admin.escrow.refund', orderNumber));
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
                            Gestion des garanties sous séquestre Escrow
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Supervisez les fonds bloqués lors des commandes et effectuez des déblocages ou remboursements de secours.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Volume total sous séquestre</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_volume || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Flux Mobile Money consignés</span>
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
                                    <th className="py-3 px-4 text-right">Actions d'urgence admin</th>
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
                                                {o.payment_status === 'escrow_held' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleForceRelease(o.order_number)}
                                                            disabled={processing}
                                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[11px] transition-colors"
                                                        >
                                                            Forcer libération
                                                        </button>
                                                        <button
                                                            onClick={() => handleForceRefund(o.order_number)}
                                                            disabled={processing}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-[11px] transition-colors"
                                                        >
                                                            Forcer remboursement
                                                        </button>
                                                    </>
                                                )}
                                                {o.payment_status !== 'escrow_held' && (
                                                    <span className="text-[11px] text-stone-400 font-normal">Paiement clôturé</span>
                                                )}
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
        </AdminLayout>
    );
}
