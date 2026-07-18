import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Card, CardContent } from '../../../Components/ui/Card';
import Input from '../../../Components/ui/Input';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import { 
    Search, 
    Eye, 
    Mail, 
    Phone, 
    Calendar,
    ShieldAlert,
    UserCheck,
    UserX,
    Lock
} from 'lucide-react';

export default function Admins({ admins, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('admin.users.admins'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleTabChange = (status) => {
        setStatusFilter(status);
        router.get(route('admin.users.admins'), { search, status }, { preserveState: true });
    };

    return (
        <AdminLayout title="Espace Administrateurs">
            <Head title="Administrateurs - Sellify Admin" />

            <div className="space-y-6">
                {/* 1. Header Banner Card */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-3xl p-6 shadow-lg shadow-amber-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black tracking-tight flex items-center">
                            <Lock className="w-5.5 h-5.5 mr-2" />
                            <span>Espace Administrateurs</span>
                        </h2>
                        <p className="text-xs text-amber-50 font-bold uppercase tracking-wider">Gestion de l'équipe administrative de la plateforme</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4.5 py-2 rounded-2xl text-right">
                        <span className="text-sm font-black tracking-tight">{stats.total} Administrateurs / {stats.active} Actifs</span>
                    </div>
                </div>

                {/* 2. Three Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-3xl border border-surface-200 bg-white flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider block">Total Administrateurs</span>
                            <span className="text-3xl font-black text-surface-900 tracking-tight">{stats.total}</span>
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-500">
                            <Lock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="p-5 rounded-3xl border border-emerald-100 bg-white flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider block">Actifs</span>
                            <span className="text-3xl font-black text-emerald-600 tracking-tight">{stats.active}</span>
                        </div>
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-500">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="p-5 rounded-3xl border border-rose-100 bg-white flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider block">Inactifs</span>
                            <span className="text-3xl font-black text-rose-600 tracking-tight">{stats.inactive}</span>
                        </div>
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500">
                            <UserX className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 3. Filter Tabs & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 border border-surface-200 rounded-3xl shadow-sm">
                    {/* Tabs */}
                    <div className="flex space-x-1 p-1 bg-surface-50 border border-surface-150 rounded-2xl">
                        {[
                            { name: 'Tous', filter: '', count: stats.total },
                            { name: 'Actifs', filter: 'active', count: stats.active },
                            { name: 'Inactifs', filter: 'inactive', count: stats.inactive }
                        ].map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => handleTabChange(tab.filter)}
                                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2
                                    ${statusFilter === tab.filter
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold border border-amber-600/10'
                                        : 'text-surface-500 hover:text-surface-800'}`}
                            >
                                <span>{tab.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold
                                    ${statusFilter === tab.filter ? 'bg-amber-600 text-white' : 'bg-surface-150 text-surface-600'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-80">
                        <div className="relative w-full">
                            <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Recherche..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-surface-50 text-sm pl-9 pr-4 py-2 rounded-2xl border border-surface-200 focus:border-amber-400 outline-none font-semibold text-surface-700 transition-colors"
                            />
                        </div>
                        <Button type="submit" variant="primary" className="bg-amber-500 text-white font-bold p-2.5 rounded-2xl shadow-sm">
                            <Search className="w-4 h-4" />
                        </Button>
                    </form>
                </div>

                {/* 4. Admins Grid */}
                {admins.data.length === 0 ? (
                    <Card className="bento-card text-center py-20">
                        <CardContent className="space-y-3">
                            <Lock className="w-12 h-12 text-surface-300 mx-auto" />
                            <p className="text-sm font-bold text-surface-400">Aucun administrateur trouvé.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {admins.data.map((user) => (
                            <div key={user.id} className="bg-white border border-surface-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative flex flex-col justify-between space-y-4">
                                {/* Header of Card */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3.5">
                                        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-black text-sm shadow-sm">
                                            {user.first_name[0]}{user.last_name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-surface-900 leading-tight">{user.first_name} {user.last_name}</h4>
                                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block mt-1">{user.role}</span>
                                        </div>
                                    </div>
                                    <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </div>

                                {/* Body Information */}
                                <div className="space-y-2 text-xs font-semibold text-surface-600 border-t border-surface-50 pt-3.5">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-3.5 h-3.5 text-surface-400" />
                                        <span className="font-mono truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-3.5 h-3.5 text-surface-400" />
                                        <span className="font-mono">{user.phone || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-3.5 h-3.5 text-surface-400" />
                                        <span>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="pt-2">
                                    <Link href={route('admin.users.show', user.id)} className="w-full">
                                        <Button variant="outline" className="w-full justify-center space-x-1.5 rounded-2xl border border-surface-200 py-2.5 text-xs font-bold bg-surface-50 text-surface-700 hover:bg-surface-100">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Détails</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {admins.links.length > 3 && (
                    <Card className="bento-card overflow-hidden p-0">
                        <div className="bg-surface-50 px-6 py-4 flex justify-between items-center text-xs font-bold text-surface-500 font-mono">
                            <div>Affichage de {admins.from} à {admins.to} sur {admins.total} administrateurs</div>
                            <div className="flex space-x-1">
                                {admins.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg border transition-colors
                                            ${link.active ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-surface-200 hover:bg-surface-100 text-surface-600'}
                                            ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
