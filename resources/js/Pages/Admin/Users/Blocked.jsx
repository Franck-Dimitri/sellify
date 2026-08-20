import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Search, 
    Eye, 
    ShieldAlert, 
    UserX, 
    Ban,
    CheckCircle2
} from 'lucide-react';

export default function Blocked({ users = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('admin.users.blocked'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleTabChange = (status) => {
        setStatusFilter(status);
        router.get(route('admin.users.blocked'), { search, status }, { preserveState: true });
    };

    const handleActivate = (id, name) => {
        if (confirm(`Voulez-vous réactiver le compte de ${name} ?`)) {
            router.post(route('admin.users.activate', id));
        }
    };

    return (
        <AdminLayout title="Comptes bloqués">
            <Head title="Comptes bloqués - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                            <Ban className="w-4 h-4 text-rose-600" />
                            <span>Modération & comptes restreints</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Comptes bloqués et suspendus
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez les sanctions administratives, examens de litiges et demandes de réactivation de compte.
                        </p>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold text-rose-950 shrink-0">
                        {stats.total || 0} comptes restreints
                    </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        <div className="flex flex-wrap gap-1">
                            {[
                                { name: 'Tous', filter: '', count: stats.total },
                                { name: 'Suspendus', filter: 'suspended', count: stats.suspended },
                                { name: 'Bannis', filter: 'banned', count: stats.banned }
                            ].map((tab) => (
                                <button
                                    key={tab.filter}
                                    onClick={() => handleTabChange(tab.filter)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        statusFilter === tab.filter
                                            ? 'bg-rose-600 text-white shadow-2xs font-bold'
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
                                placeholder="Rechercher par nom ou email..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 text-stone-800"
                            />
                        </form>

                    </div>
                </div>

                {/* Blocked Users Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Utilisateur</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Rôle</th>
                                    <th className="py-3 px-4">Statut sanction</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center font-bold text-rose-900 text-xs border border-rose-200">
                                                        {u.first_name[0]}{u.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-stone-900">{u.first_name} {u.last_name}</span>
                                                        <span className="text-[10px] text-stone-400 font-mono">ID #{u.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-600">
                                                <div className="space-y-0.5">
                                                    <span className="block font-medium text-stone-800">{u.email}</span>
                                                    <span className="text-[11px] text-stone-400">{u.phone || 'Non renseigné'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-700 font-semibold uppercase text-[11px]">
                                                {u.role}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                                    {u.status === 'banned' ? 'Banni' : 'Suspendu'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleActivate(u.id, `${u.first_name} ${u.last_name}`)}
                                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold transition-colors border border-emerald-200"
                                                >
                                                    Réactiver
                                                </button>
                                                <Link
                                                    href={route('admin.users.show', u.id)}
                                                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors"
                                                >
                                                    Fiche
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-10 text-center text-stone-400">
                                            Aucun utilisateur bloqué ne correspond aux critères.
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
