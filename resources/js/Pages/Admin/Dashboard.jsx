import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Users as UsersIcon, 
    Store, 
    Truck, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight, 
    Download, 
    Clock, 
    ShoppingBag, 
    ArrowRight,
    Award,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    BarChart2,
    PieChart,
    CheckCircle2,
    XCircle,
    UserCheck,
    Tag,
    Key,
    Activity,
    FileText,
    Percent
} from 'lucide-react';

export default function Dashboard({ 
    stats = {}, 
    monthlyTrend = [], 
    recentOrders = [], 
    urgentDisputes = [], 
    recentKyc = [], 
    activities = [] 
}) {
    const [timeframe, setTimeframe] = useState('month');
    const { post, processing } = useForm();

    const handleResolveDispute = (disputeId, resolution) => {
        if (confirm(`Confirmez-vous la décision d'arbitrage : ${resolution === 'refund_buyer' ? 'Rembourser le client' : 'Payer le vendeur'} ?`)) {
            post(route('admin.disputes.resolve', disputeId), {
                data: { resolution }
            });
        }
    };

    const maxVolume = Math.max(...monthlyTrend.map(m => m.volume), 100000);

    const orderStatusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livraison', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En cours (OTP)', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré & libéré', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            cancelled: { label: 'Annulé / Remboursé', bg: 'bg-rose-50 text-rose-900 border-rose-200' },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <AdminLayout title="Tableau de bord administration">
            <Head title="Tableau de bord général - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* 1. Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <ShieldCheck className="w-4 h-4 text-yellow-600" />
                            <span>Supervision globale de la plateforme</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Tableau de bord d'administration
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Vue synthétique des transactions sous séquestre, modération des litiges, vendeurs KYC et livreurs.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/80">
                            {[
                                { id: 'week', label: 'Semaine' },
                                { id: 'month', label: 'Mois' },
                                { id: 'year', label: 'Année' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTimeframe(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        timeframe === tab.id
                                            ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Primary Financial KPIs (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Volume Total Escrow */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Volume total sous séquestre</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_escrow_volume || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-stone-400">
                            <span>Bloqué : {Number(stats.escrow_held_amount || 0).toLocaleString('fr-FR')} F</span>
                            <span className="text-emerald-600 font-semibold">Libéré : {Number(stats.released_amount || 0).toLocaleString('fr-FR')} F</span>
                        </div>
                    </div>

                    {/* Commissions Plateforme (3%) */}
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
                        <span className="text-[11px] text-stone-400 font-normal">Revenu net de la plateforme</span>
                    </div>

                    {/* Vendeurs & KYC */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Boutiques & vendeurs</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <Store className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            {stats.verified_sellers || 0} / {stats.total_sellers || 0} <span className="text-xs font-medium text-stone-500">vérifiés</span>
                        </p>
                        <span className="text-[11px] text-amber-600 font-semibold">
                            {stats.pending_kyc_requests || 0} dossier(s) KYC en attente
                        </span>
                    </div>

                    {/* Litiges & Arbitrage */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Réclamations & litiges</span>
                            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-200">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-rose-600">
                            {stats.disputed_orders || 0} <span className="text-xs font-medium text-stone-500">litiges</span>
                        </p>
                        <span className="text-[11px] text-rose-700 font-semibold">Arbitrage admin requis</span>
                    </div>
                </div>

                {/* 3. CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Monthly Volume Bar Chart (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Volume des transactions Escrow & commissions (FCFA)</h3>
                            </div>
                            <span className="text-[11px] text-stone-400 font-medium">6 derniers mois</span>
                        </div>

                        {/* Interactive Bar Chart */}
                        <div className="pt-4 pb-2">
                            <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-stone-200 pb-2 px-2">
                                {monthlyTrend.map((m, idx) => {
                                    const heightPercent = maxVolume > 0 ? Math.max(12, Math.round((m.volume / maxVolume) * 100)) : 12;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                                            <div className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-2 py-0.5 rounded shadow-xs">
                                                {Number(m.volume).toLocaleString('fr-FR')} F
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

                    {/* Operational Metrics Breakdown (1 col) */}
                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Santé des opérations</h3>
                            </div>
                        </div>

                        <div className="space-y-4 pt-1 text-xs">
                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-stone-600">Commandes en préparation / attente</span>
                                    <span className="text-stone-900">{stats.pending_orders || 0}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full w-3/4" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-stone-600">Colis en cours de livraison (OTP)</span>
                                    <span className="text-purple-700">{stats.in_transit_orders || 0}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full w-1/2" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-stone-600">Livraisons confirmées & réglées</span>
                                    <span className="text-emerald-700">{stats.delivered_orders || 0}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-stone-600">Chauffeurs livreurs homologués</span>
                                    <span className="text-blue-700">{stats.verified_drivers || 0} / {stats.total_drivers || 0}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-4/5" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100">
                            <Link 
                                href={route('admin.users.sellers')}
                                className="w-full py-2.5 bg-stone-50 hover:bg-yellow-50 text-stone-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                            >
                                <span>Gérer les boutiques & vendeurs</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* 4. URGENT DISPUTES ARBITRATION SECTION */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                            <div>
                                <h3 className="font-bold text-sm text-stone-900">Arbitrage des litiges & réclamations urgentes</h3>
                                <p className="text-xs text-stone-500 font-normal">Examinez le motif du client et la défense du vendeur avant de débloquer ou rembourser les fonds.</p>
                            </div>
                        </div>
                    </div>

                    {urgentDisputes && urgentDisputes.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase">
                                        <th className="py-2.5 px-3">Commande</th>
                                        <th className="py-2.5 px-3">Acheteur</th>
                                        <th className="py-2.5 px-3">Boutique / Vendeur</th>
                                        <th className="py-2.5 px-3">Motif réclamation</th>
                                        <th className="py-2.5 px-3">Montant</th>
                                        <th className="py-2.5 px-3 text-right">Décision d'arbitrage admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {urgentDisputes.map((d) => (
                                        <tr key={d.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3 px-3 font-mono font-bold text-stone-900">
                                                #{d.order?.order_number}
                                            </td>
                                            <td className="py-3 px-3 font-semibold text-stone-800">
                                                {d.order?.user ? `${d.order.user.first_name} ${d.order.user.last_name}` : 'Client'}
                                            </td>
                                            <td className="py-3 px-3 font-semibold text-stone-800">
                                                {d.order?.shop?.name || 'Boutique'}
                                            </td>
                                            <td className="py-3 px-3 text-stone-600 max-w-xs truncate">
                                                {d.reason}
                                            </td>
                                            <td className="py-3 px-3 font-bold text-stone-900">
                                                {Number(d.order?.total_amount || 0).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3 px-3 text-right space-x-2">
                                                <button
                                                    onClick={() => handleResolveDispute(d.id, 'refund_buyer')}
                                                    disabled={processing}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-[11px] transition-colors"
                                                >
                                                    Rembourser client
                                                </button>
                                                <button
                                                    onClick={() => handleResolveDispute(d.id, 'release_seller')}
                                                    disabled={processing}
                                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[11px] transition-colors"
                                                >
                                                    Payer vendeur
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-stone-400 bg-stone-50/50 rounded-xl">
                            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-80" />
                            <p className="text-xs font-semibold text-stone-700">Aucun litige en attente d'arbitrage</p>
                        </div>
                    )}
                </div>

                {/* 5. RECENT ESCROW TRANSACTIONS TABLE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Recent Orders (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Dernières commandes & transactions Escrow</h3>
                            <span className="text-xs text-stone-400 font-normal">Supervision en direct</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase">
                                        <th className="py-2.5 px-3">N° Commande</th>
                                        <th className="py-2.5 px-3">Client</th>
                                        <th className="py-2.5 px-3">Boutique</th>
                                        <th className="py-2.5 px-3">Montant</th>
                                        <th className="py-2.5 px-3">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {recentOrders && recentOrders.length > 0 ? (
                                        recentOrders.map((o) => (
                                            <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                                                <td className="py-3 px-3 font-mono font-bold text-stone-900">
                                                    #{o.order_number}
                                                </td>
                                                <td className="py-3 px-3 font-semibold text-stone-800">
                                                    {o.user ? `${o.user.first_name} ${o.user.last_name}` : 'Client'}
                                                </td>
                                                <td className="py-3 px-3 text-stone-600">
                                                    {o.shop?.name || 'Boutique'}
                                                </td>
                                                <td className="py-3 px-3 font-bold text-stone-900">
                                                    {Number(o.total_amount).toLocaleString('fr-FR')} FCFA
                                                </td>
                                                <td className="py-3 px-3">
                                                    {orderStatusBadge(o.delivery_status)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-6 text-center text-stone-400">Aucune commande récente.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pending KYC Submissions (1 col) */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                                <UserCheck className="w-4 h-4 text-yellow-600" />
                                <span>KYC en attente</span>
                            </h3>
                            <Link href={route('admin.kyc.index')} className="text-xs text-yellow-700 font-semibold hover:underline">
                                Voir tous
                            </Link>
                        </div>

                        <div className="space-y-3 text-xs">
                            {recentKyc && recentKyc.length > 0 ? (
                                recentKyc.map((kyc) => (
                                    <div key={kyc.id} className="p-3 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-stone-900">
                                                {kyc.user ? `${kyc.user.first_name} ${kyc.user.last_name}` : 'Utilisateur'}
                                            </p>
                                            <span className="text-[10px] text-stone-400 block uppercase">
                                                Role : {kyc.user?.role}
                                            </span>
                                        </div>
                                        <Link
                                            href={route('admin.kyc.show', kyc.id)}
                                            className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-yellow-400 hover:text-stone-950 text-stone-700 font-bold rounded-lg transition-colors text-[11px]"
                                        >
                                            Examiner
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-stone-400 text-center py-4">Aucun dossier KYC en attente.</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
