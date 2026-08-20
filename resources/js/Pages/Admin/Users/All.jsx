import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Search, 
    Eye, 
    ShieldAlert, 
    UserCheck, 
    Users, 
    ShoppingBag, 
    Truck, 
    User, 
    X
} from 'lucide-react';

export default function All({ users = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.all'), { search, role, status }, { preserveState: true });
    };

    const handleClear = () => {
        setSearch('');
        setRole('');
        setStatus('');
        router.get(route('admin.users.all'), {});
    };

    const handleBan = (id, name) => {
        if (confirm(`Voulez-vous suspendre le compte de ${name} ?`)) {
            router.post(route('admin.users.ban', id));
        }
    };

    const roleBadge = (r) => {
        const map = {
            admin: { label: 'Administrateur', bg: 'bg-rose-50 text-rose-800 border-rose-200' },
            seller: { label: 'Vendeur / Boutique', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            driver: { label: 'Chauffeur livreur', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            customer: { label: 'Acheteur client', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
        };
        const conf = map[r] || { label: r, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <AdminLayout title="Tous les utilisateurs">
            <Head title="Tous les utilisateurs - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Users className="w-4 h-4 text-yellow-600" />
                            <span>Répertoire des comptes</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Tous les utilisateurs enregistrés
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez les acheteurs, vendeurs, livreurs et administrateurs de la plateforme Sellify.
                        </p>
                    </div>
                </div>

                {/* Exactly 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Total comptes</span>
                            <div className="w-8 h-8 bg-stone-100 rounded-xl flex items-center justify-center text-stone-700">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">{stats.total || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Base d'utilisateurs globale</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Comptes actifs</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <UserCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.active || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Utilisateurs validés</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Attente KYC</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{stats.pending_kyc || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Modération d'identité requise</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Vendeurs & livreurs</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">{(stats.sellers || 0) + (stats.drivers || 0)}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Partenaires actifs</span>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <form onSubmit={handleSearch} className="bg-white border border-stone-200/80 p-4 rounded-xl shadow-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                        
                        <div className="relative sm:col-span-2">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par nom, email ou téléphone..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </div>

                        <div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800 font-normal"
                            >
                                <option value="">Tous les rôles</option>
                                <option value="customer">Acheteurs clients</option>
                                <option value="seller">Vendeurs</option>
                                <option value="driver">Chauffeurs livreurs</option>
                                <option value="admin">Administrateurs</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl transition-colors border border-yellow-500"
                            >
                                Filtrer
                            </button>
                            {(search || role || status) && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors"
                                    title="Réinitialiser"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Users Table */}
                <div className="bg-white border border-stone-200/80 rounded-xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Utilisateur</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Rôle</th>
                                    <th className="py-3 px-4">Statut</th>
                                    <th className="py-3 px-4">Date d'inscription</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center font-bold text-yellow-900 text-xs border border-yellow-200">
                                                        {u.first_name[0]}{u.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <span className="block font-semibold text-stone-900">{u.first_name} {u.last_name}</span>
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
                                            <td className="py-3.5 px-4">
                                                {roleBadge(u.role)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                                    u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                                                }`}>
                                                    {u.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-500">
                                                {new Date(u.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('admin.users.show', u.id)}
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
                                        <td colSpan="6" className="py-10 text-center text-stone-400">
                                            Aucun utilisateur trouvé.
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
