import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Components/ui/Card';
import Input from '../../../Components/ui/Input';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import { 
    Search, 
    Eye, 
    Trash2, 
    TrendingUp, 
    ShieldAlert, 
    Check, 
    AlertCircle, 
    User, 
    Mail, 
    Phone, 
    Calendar,
    Users,
    ShoppingBag,
    Truck,
    ShieldCheck,
    UserCheck,
    Ban
} from 'lucide-react';

export default function All({ users, filters, stats, pendingRequests }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');
    const [chartFilter, setChartFilter] = useState('Mois');

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

    const handleDelete = (id, name) => {
        if (confirm(`Voulez-vous suspendre définitivement le compte de ${name} ?`)) {
            router.post(route('admin.users.ban', id));
        }
    };

    return (
        <AdminLayout title="Tous les Utilisateurs">
            <Head title="Tous les utilisateurs - Sellify Admin" />

            <div className="space-y-6">
                {/* 1. Six Stats Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { title: 'Total', value: stats.total, icon: Users, color: 'text-surface-700 bg-surface-50 border-surface-200' },
                        { title: 'Actifs', value: stats.active, icon: UserCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                        { title: 'En attente', value: stats.pending_kyc, icon: ShieldAlert, color: 'text-amber-700 bg-amber-50 border-amber-100' },
                        { title: 'Vendeurs', value: stats.sellers, icon: ShoppingBag, color: 'text-blue-700 bg-blue-50 border-blue-100' },
                        { title: 'Livreurs', value: stats.drivers, icon: Truck, color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
                        { title: 'Clients', value: stats.customers, icon: User, color: 'text-amber-700 bg-amber-50/70 border-amber-100/70' }
                    ].map((stat, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border bg-white flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md`}>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">{stat.title}</span>
                                <div className={`p-1.5 rounded-lg border ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="text-2xl font-black text-surface-900 tracking-tight">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Middle Row: Chart & Pending Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Interactive SVG Registration Chart mockup */}
                    <Card className="bento-card lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 pb-4 mb-4">
                            <div className="space-y-0.5">
                                <CardTitle className="text-sm font-bold flex items-center space-x-2 text-surface-800">
                                    <TrendingUp className="w-5 h-5 text-amber-500" />
                                    <span>Évolution des inscriptions</span>
                                </CardTitle>
                                <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Statistiques des 7 derniers jours</p>
                            </div>
                            <div className="flex space-x-1 bg-surface-50 border border-surface-150 p-1 rounded-xl">
                                {['Semaine', 'Mois', 'Année'].map((btn) => (
                                    <button
                                        key={btn}
                                        onClick={() => setChartFilter(btn)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all
                                            ${chartFilter === btn ? 'bg-white text-surface-900 shadow-sm border border-surface-200' : 'text-surface-500 hover:text-surface-800'}`}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="h-64 flex flex-col justify-end relative">
                            {/* SVG mockup graph */}
                            <svg className="w-full h-48 text-amber-500" viewBox="0 0 600 200">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/>
                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0"/>
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,150 Q100,80 200,120 T400,60 T600,30 L600,200 L0,200 Z"
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d="M0,150 Q100,80 200,120 T400,60 T600,30"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                                <circle cx="200" cy="120" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                                <circle cx="400" cy="60" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                                <circle cx="600" cy="30" r="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                            </svg>
                            <div className="flex justify-between text-[10px] text-surface-450 font-bold uppercase tracking-wider pt-4 border-t border-surface-100 px-2 font-mono">
                                <span>Lundi</span>
                                <span>Mardi</span>
                                <span>Mercredi</span>
                                <span>Jeudi</span>
                                <span>Vendredi</span>
                                <span>Samedi</span>
                                <span>Dimanche</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Pending requests sidebar */}
                    <Card className="bento-card">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-surface-100 pb-4 mb-4">
                            <CardTitle className="text-sm font-bold flex items-center space-x-2 text-surface-800">
                                <ShieldAlert className="w-5 h-5 text-amber-500" />
                                <span>Demandes en attente</span>
                            </CardTitle>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-mono font-bold">
                                {pendingRequests.length}
                            </span>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-12 text-surface-400 text-xs font-bold">
                                    Aucune demande en attente.
                                </div>
                            ) : (
                                pendingRequests.map((req) => (
                                    <div key={req.id} className="p-3.5 border border-surface-150 rounded-xl bg-surface-50/50 hover:bg-surface-50 transition-colors space-y-3.5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-black text-xs">
                                                {req.user.first_name[0]}{req.user.last_name[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-extrabold text-surface-800">{req.user.first_name} {req.user.last_name}</h4>
                                                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md mt-1 border
                                                    ${req.type === 'seller' ? 'bg-blue-50 text-blue-800 border-blue-100' : 'bg-indigo-50 text-indigo-800 border-indigo-100'}`}>
                                                    {req.type === 'seller' ? 'Vendeur' : 'Livreur'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {/* Document checklist */}
                                            {req.user.kyc_documents?.map((doc, idx) => (
                                                <div key={idx} className="flex items-center bg-white px-2 py-0.5 border border-surface-200 rounded-md text-[9px] font-bold text-surface-500">
                                                    <Check className="w-2.5 h-2.5 text-emerald-500 mr-1" />
                                                    <span className="uppercase">{doc.type.replace('_', ' ')}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-1 border-t border-surface-100">
                                            <span className="text-[9px] text-surface-400 font-bold uppercase">Soumis le {new Date(req.submitted_at).toLocaleDateString('fr-FR')}</span>
                                            <Link href={route('admin.kyc.show', req.id)}>
                                                <Button size="xs" variant="primary" className="font-bold text-[10px] px-3 py-1 bg-amber-500 text-white rounded-lg shadow-sm">
                                                    Traiter
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Search & Filter Bar */}
                <Card className="bento-card">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                            <Input
                                label="Rechercher un utilisateur"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nom, e-mail, numéro de téléphone..."
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block mb-1.5">Rôle</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 focus:border-amber-400 rounded-xl outline-none font-semibold text-surface-700 transition-colors"
                            >
                                <option value="">Tous les rôles</option>
                                <option value="customer">Client (Customer)</option>
                                <option value="seller">Vendeur (Seller)</option>
                                <option value="driver">Livreur (Driver)</option>
                                <option value="admin">Administrateur (Admin)</option>
                            </select>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block mb-1.5">Statut Compte</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 focus:border-amber-400 rounded-xl outline-none font-semibold text-surface-700 transition-colors"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="suspended">Suspendu</option>
                                <option value="banned">Banni</option>
                            </select>
                        </div>
                        <div className="flex space-x-2 w-full md:w-auto">
                            <Button type="submit" variant="primary" className="flex-1 md:flex-initial space-x-2 bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm">
                                <Search className="w-4 h-4" />
                                <span>Filtrer</span>
                            </Button>
                            <Button type="button" variant="outline" onClick={handleClear} className="flex-1 md:flex-initial rounded-xl px-4 py-2.5">
                                Réinitialiser
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* 4. Users List Table */}
                <Card className="bento-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50 border-b border-surface-150 text-[10px] font-bold text-surface-400 uppercase tracking-wider font-mono">
                                    <th className="py-4 px-6">Utilisateur</th>
                                    <th className="py-4 px-6">Contact</th>
                                    <th className="py-4 px-6">Rôle</th>
                                    <th className="py-4 px-6">Statut</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100 text-sm font-semibold text-surface-750">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-surface-400 text-sm font-semibold">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3.5">
                                                    <div className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center font-black text-surface-700 border border-surface-200 shadow-sm text-xs">
                                                        {user.first_name[0]}{user.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-surface-900 leading-none">{user.first_name} {user.last_name}</h4>
                                                        <span className="text-[10px] text-surface-400 font-mono mt-1 block">ID: #{user.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1 font-mono text-xs text-surface-500">
                                                    <div className="flex items-center space-x-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-surface-400" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-surface-400" />
                                                        <span>{user.phone || 'Non renseigné'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`capitalize text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider
                                                    ${user.role === 'admin' ? 'bg-purple-50 text-purple-800 border-purple-200' : ''}
                                                    ${user.role === 'seller' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''}
                                                    ${user.role === 'driver' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : ''}
                                                    ${user.role === 'customer' ? 'bg-surface-100 text-surface-800 border-surface-200' : ''}
                                                `}>
                                                    {user.role === 'customer' ? 'Client' : user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant={
                                                    user.status === 'active' ? 'success' :
                                                    user.status === 'suspended' ? 'warning' : 'danger'
                                                }>
                                                    {user.status === 'active' ? 'Actif' : user.status === 'suspended' ? 'Suspendu' : 'Banni'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link href={route('admin.users.show', user.id)}>
                                                        <Button variant="outline" size="sm" className="space-x-1.5 rounded-lg border border-surface-250 py-1 px-2.5 text-xs font-bold">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            <span>Détails</span>
                                                        </Button>
                                                    </Link>
                                                    {user.role !== 'admin' && user.role !== 'superadmin' && user.status !== 'banned' && (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm" 
                                                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDelete(user.id, `${user.first_name} ${user.last_name}`)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links.length > 3 && (
                        <div className="bg-surface-50 border-t border-surface-150 px-6 py-4 flex justify-between items-center text-xs font-bold text-surface-500 font-mono">
                            <div>Affichage de {users.from} à {users.to} sur {users.total} utilisateurs</div>
                            <div className="flex space-x-1">
                                {users.links.map((link, idx) => (
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
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
