import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Card, CardContent } from '../../../Components/ui/Card';
import Input from '../../../Components/ui/Input';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import { Search, Eye, Filter } from 'lucide-react';

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, role, status }, { preserveState: true });
    };

    const handleClear = () => {
        setSearch('');
        setRole('');
        setStatus('');
        router.get(route('admin.users.index'), {});
    };

    return (
        <AdminLayout title="Gestion des Utilisateurs">
            <Head title="Utilisateurs" />

            <div className="space-y-6">
                {/* Search & Filters */}
                <Card className="bento-card">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                            <Input
                                label="Rechercher un utilisateur"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nom, email, téléphone..."
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="text-sm font-semibold text-surface-700 block mb-1.5">Rôle</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white border border-surface-200 focus:border-primary-500 rounded-lg outline-none font-semibold text-surface-700"
                            >
                                <option value="">Tous les rôles</option>
                                <option value="customer">Client (Customer)</option>
                                <option value="seller">Vendeur (Seller)</option>
                                <option value="driver">Livreur (Driver)</option>
                                <option value="admin">Administrateur (Admin)</option>
                            </select>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="text-sm font-semibold text-surface-700 block mb-1.5">Statut Compte</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-white border border-surface-200 focus:border-primary-500 rounded-lg outline-none font-semibold text-surface-700"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="suspended">Suspendu</option>
                                <option value="banned">Banni</option>
                            </select>
                        </div>
                        <div className="flex space-x-2 w-full md:w-auto">
                            <Button type="submit" variant="primary" className="flex-1 md:flex-initial space-x-2">
                                <Search className="w-4 h-4" />
                                <span>Filtrer</span>
                            </Button>
                            <Button type="button" variant="outline" onClick={handleClear} className="flex-1 md:flex-initial">
                                Réinitialiser
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Users Table */}
                <Card className="bento-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50 border-b border-surface-200 text-xs font-bold text-surface-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Utilisateur</th>
                                    <th className="py-4 px-6">Rôle</th>
                                    <th className="py-4 px-6">Téléphone</th>
                                    <th className="py-4 px-6">KYC Statut</th>
                                    <th className="py-4 px-6">Compte</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100 text-sm font-semibold text-surface-700">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-surface-400">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-700 border border-surface-200">
                                                        {user.first_name[0]}{user.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-surface-900 leading-none">{user.first_name} {user.last_name}</h4>
                                                        <span className="text-xs text-surface-400 font-mono mt-1 block">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`capitalize text-xs font-bold px-2.5 py-0.5 rounded-full border
                                                    ${user.role === 'admin' ? 'bg-purple-50 text-purple-800 border-purple-200' : ''}
                                                    ${user.role === 'seller' ? 'bg-secondary-50 text-secondary-800 border-secondary-200' : ''}
                                                    ${user.role === 'driver' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''}
                                                    ${user.role === 'customer' ? 'bg-surface-100 text-surface-800 border-surface-200' : ''}
                                                `}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-surface-500 font-mono">{user.phone || 'Non renseigné'}</td>
                                            <td className="py-4 px-6">
                                                <Badge variant={
                                                    user.kyc_status === 'verified' ? 'success' :
                                                    user.kyc_status === 'pending' ? 'warning' :
                                                    user.kyc_status === 'rejected' ? 'danger' : 'neutral'
                                                }>
                                                    {user.kyc_status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant={
                                                    user.status === 'active' ? 'success' :
                                                    user.status === 'suspended' ? 'warning' : 'danger'
                                                }>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link href={route('admin.users.show', user.id)}>
                                                    <Button variant="outline" size="sm" className="space-x-1.5">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Détails</span>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination simple */}
                    {users.links.length > 3 && (
                        <div className="bg-surface-50 border-t border-surface-150 px-6 py-4 flex justify-between items-center text-xs font-bold text-surface-500">
                            <div>Affichage de {users.from} à {users.to} sur {users.total} utilisateurs</div>
                            <div className="flex space-x-1">
                                {users.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg border transition-colors
                                            ${link.active ? 'bg-primary-500 text-surface-950 border-primary-500' : 'bg-white border-surface-200 hover:bg-surface-100 text-surface-600'}
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
