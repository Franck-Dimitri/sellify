import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Eye, 
    ShieldAlert, 
    CheckCircle2, 
    XCircle, 
    UserCheck,
    FileText,
    Clock,
    Search,
    BarChart2,
    PieChart,
    TrendingUp
} from 'lucide-react';

export default function Index({ kycRequests = { data: [] }, filters = {} }) {
    const [status, setStatus] = useState(filters.status || 'pending');
    const [type, setType] = useState(filters.type || '');

    const handleFilterChange = (newStatus, newType = type) => {
        setStatus(newStatus);
        setType(newType);
        router.get(route('admin.kyc.index'), { status: newStatus, type: newType }, { preserveState: true });
    };

    const pendingCount = kycRequests.data ? kycRequests.data.filter(r => r.status === 'pending').length : 0;
    const approvedCount = kycRequests.data ? kycRequests.data.filter(r => r.status === 'approved').length : 0;
    const rejectedCount = kycRequests.data ? kycRequests.data.filter(r => r.status === 'rejected').length : 0;
    const totalCount = kycRequests.data ? kycRequests.data.length : 0;

    // Monthly Submission Trend Mockup Data for Chart
    const monthlyKycTrend = [
        { month: 'Mars', count: 12 },
        { month: 'Avril', count: 18 },
        { month: 'Mai', count: 25 },
        { month: 'Juin', count: 32 },
        { month: 'Juillet', count: 40 },
        { month: 'Août', count: totalCount || 15 },
    ];
    const maxKycCount = Math.max(...monthlyKycTrend.map(m => m.count), 10);

    return (
        <AdminLayout title="Modération KYC">
            <Head title="Vérification KYC - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <UserCheck className="w-4 h-4 text-yellow-600" />
                            <span>Vérification d'identité & pièces justificatives</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            File d'examen KYC & conformité
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Validez l'identité des vendeurs et des livreurs avant l'activation officielle de leurs comptes.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-xl text-xs font-bold text-yellow-950 shrink-0">
                        {pendingCount} dossier(s) en attente de modération
                    </div>
                </div>

                {/* Exactly 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Demandes soumises</span>
                            <div className="w-8 h-8 bg-stone-100 rounded-xl flex items-center justify-center text-stone-700">
                                <FileText className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">{totalCount}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Total dossiers examinés</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">En attente d'examen</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Priorité modération haute</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Dossiers approuvés</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Identités certifiées</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Dossiers rejetés</span>
                            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-200">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-rose-600">{rejectedCount}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Document non conforme</span>
                    </div>
                </div>

                {/* CHARTS SECTION IN KYC VIEW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Monthly KYC Submission Trend Chart (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Évolution des soumissions KYC par mois</h3>
                            </div>
                            <span className="text-[11px] text-stone-400 font-normal">Flux des 6 derniers mois</span>
                        </div>

                        {/* Interactive Bar Chart */}
                        <div className="pt-4 pb-2">
                            <div className="grid grid-cols-6 gap-3 items-end h-40 border-b border-stone-200 pb-2 px-2">
                                {monthlyKycTrend.map((m, idx) => {
                                    const heightPercent = maxKycCount > 0 ? Math.max(15, Math.round((m.count / maxKycCount) * 100)) : 15;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                                            <div className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-2 py-0.5 rounded shadow-xs">
                                                {m.count} dossiers
                                            </div>
                                            <div 
                                                style={{ height: `${heightPercent}%` }}
                                                className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-xl group-hover:from-yellow-600 transition-all duration-300 shadow-2xs"
                                            />
                                            <span className="text-[11px] font-semibold text-stone-600 truncate">{m.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Status Breakdown Ring/Progress (1 col) */}
                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Ratio de validation KYC</h3>
                            </div>
                        </div>

                        <div className="space-y-4 pt-1 text-xs">
                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-emerald-700">Approuvés</span>
                                    <span>{approvedCount}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-3/4" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-amber-700">En attente</span>
                                    <span>{pendingCount}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full w-1/2" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-rose-700">Rejetés</span>
                                    <span>{rejectedCount}</span>
                                </div>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 rounded-full w-1/4" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Filter Tabs */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'pending', label: 'En attente de validation', icon: ShieldAlert, color: 'text-amber-700' },
                            { id: 'approved', label: 'Dossiers approuvés', icon: CheckCircle2, color: 'text-emerald-700' },
                            { id: 'rejected', label: 'Dossiers rejetés', icon: XCircle, color: 'text-rose-700' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleFilterChange(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                                    status === tab.id
                                        ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500 font-bold'
                                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* KYC Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Demandeur</th>
                                    <th className="py-3 px-4">Type de compte</th>
                                    <th className="py-3 px-4">Pièces fournies</th>
                                    <th className="py-3 px-4">Date de soumission</th>
                                    <th className="py-3 px-4">Statut</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {kycRequests.data && kycRequests.data.length > 0 ? (
                                    kycRequests.data.map((req) => (
                                        <tr key={req.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center font-bold text-yellow-900 text-xs border border-yellow-200">
                                                        {req.user?.first_name[0]}{req.user?.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <span className="block font-semibold text-stone-900">{req.user?.first_name} {req.user?.last_name}</span>
                                                        <span className="text-[10px] text-stone-400 font-mono">{req.user?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    req.type === 'seller' ? 'bg-yellow-50 text-yellow-900 border border-yellow-200' : 'bg-purple-50 text-purple-900 border border-purple-200'
                                                }`}>
                                                    {req.type === 'seller' ? 'Vendeur / Boutique' : 'Chauffeur livreur'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-medium text-stone-700">
                                                {req.documents_count || 1} fichier(s) PDF/Image
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-500 font-mono">
                                                {new Date(req.submitted_at || req.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    req.status === 'approved' 
                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                        : req.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {req.status === 'approved' ? 'Approuvé' : req.status === 'pending' ? 'En examen' : 'Rejeté'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('admin.kyc.show', req.id)}
                                                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-xl text-[11px] font-bold transition-colors inline-flex items-center gap-1 border border-yellow-500"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Examiner</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-stone-400">
                                            Aucun dossier KYC trouvé.
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
