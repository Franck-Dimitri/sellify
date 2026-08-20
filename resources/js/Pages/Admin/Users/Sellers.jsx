import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Search, 
    Eye, 
    Check,
    Mail, 
    Phone, 
    Calendar,
    ShoppingBag,
    UserCheck,
    Clock,
    UserX,
    Store,
    ShieldCheck
} from 'lucide-react';

export default function Sellers({ sellers = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('admin.users.sellers'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleTabChange = (status) => {
        setStatusFilter(status);
        router.get(route('admin.users.sellers'), { search, status }, { preserveState: true });
    };

    return (
        <AdminLayout title="Vendeurs & boutiques">
            <Head title="Vendeurs & boutiques - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Store className="w-4 h-4 text-yellow-600" />
                            <span>Gestion des vendeurs & boutiques</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Boutiques & vendeurs partenaire
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Supervisez les vendeurs enregistrés, vérifiez les dossiers KYC et validez l'ouverture des boutiques.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl text-xs font-bold text-yellow-950 shrink-0">
                        {stats.total || 0} vendeurs / {stats.pending || 0} en attente KYC
                    </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl border border-stone-200/80 bg-white space-y-1 shadow-2xs">
                        <span className="text-xs font-semibold text-stone-500 block">Total vendeurs</span>
                        <span className="text-2xl font-bold text-stone-900 block">{stats.total || 0}</span>
                    </div>
                    <div className="p-4 rounded-2xl border border-emerald-200/80 bg-white space-y-1 shadow-2xs">
                        <span className="text-xs font-semibold text-emerald-700 block">Approuvés & vérifiés</span>
                        <span className="text-2xl font-bold text-emerald-600 block">{stats.approved || 0}</span>
                    </div>
                    <div className="p-4 rounded-2xl border border-amber-200/80 bg-white space-y-1 shadow-2xs">
                        <span className="text-xs font-semibold text-amber-700 block">En attente KYC</span>
                        <span className="text-2xl font-bold text-amber-600 block">{stats.pending || 0}</span>
                    </div>
                    <div className="p-4 rounded-2xl border border-rose-200/80 bg-white space-y-1 shadow-2xs">
                        <span className="text-xs font-semibold text-rose-700 block">Rejetés / Bloqués</span>
                        <span className="text-2xl font-bold text-rose-600 block">{stats.rejected || 0}</span>
                    </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        <div className="flex flex-wrap gap-1">
                            {[
                                { name: 'Tous', filter: '', count: stats.total },
                                { name: 'Approuvés', filter: 'approved', count: stats.approved },
                                { name: 'En attente', filter: 'pending', count: stats.pending },
                                { name: 'Rejetés', filter: 'rejected', count: stats.rejected }
                            ].map((tab) => (
                                <button
                                    key={tab.filter}
                                    onClick={() => handleTabChange(tab.filter)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        statusFilter === tab.filter
                                            ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500'
                                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {tab.name} ({tab.count || 0})
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher vendeur ou boutique..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </form>

                    </div>
                </div>

                {/* Sellers Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Vendeur / Boutique</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Statut KYC</th>
                                    <th className="py-3 px-4">Boutiques créées</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {sellers.data && sellers.data.length > 0 ? (
                                    sellers.data.map((s) => (
                                        <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center font-bold text-yellow-900 text-xs border border-yellow-200">
                                                        {s.user?.first_name[0]}{s.user?.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-stone-900">
                                                            {s.user ? `${s.user.first_name} ${s.user.last_name}` : 'Vendeur'}
                                                        </span>
                                                        <span className="text-[10px] text-stone-400 font-mono">Boutique ID #{s.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-600">
                                                <div className="space-y-0.5">
                                                    <span className="block font-medium text-stone-800">{s.user?.email}</span>
                                                    <span className="text-[11px] text-stone-400">{s.user?.phone || 'Non renseigné'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    s.status === 'approved' 
                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                        : s.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {s.status === 'approved' ? 'Approuvé' : s.status === 'pending' ? 'En examen' : 'Rejeté'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-700 font-semibold">
                                                {s.shops_count || 1} boutique(s)
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('admin.users.show', s.user_id || s.id)}
                                                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Consulter</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-10 text-center text-stone-400">
                                            Aucun vendeur ne correspond aux critères.
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
