import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Card } from '../../../Components/ui/Card';
import Badge from '../../../Components/ui/Badge';
import Button from '../../../Components/ui/Button';
import { Eye, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function Index({ kycRequests, filters }) {
    const [status, setStatus] = useState(filters.status || 'pending');
    const [type, setType] = useState(filters.type || '');

    const handleFilterChange = (newStatus, newType = type) => {
        setStatus(newStatus);
        setType(newType);
        router.get(route('admin.kyc.index'), { status: newStatus, type: newType }, { preserveState: true });
    };

    return (
        <AdminLayout title="File d'attente KYC (Vérification d'Identité)">
            <Head title="File d'attente KYC" />

            <div className="space-y-6">
                {/* Custom Bento Tabs */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={status === 'pending' ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('pending')}
                        className="space-x-1.5"
                    >
                        <ShieldAlert className="w-4 h-4" />
                        <span>En attente de validation</span>
                    </Button>
                    <Button
                        variant={status === 'approved' ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('approved')}
                        className="space-x-1.5"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Dossiers Approuvés</span>
                    </Button>
                    <Button
                        variant={status === 'rejected' ? 'primary' : 'outline'}
                        onClick={() => handleFilterChange('rejected')}
                        className="space-x-1.5"
                    >
                        <XCircle className="w-4 h-4" />
                        <span>Dossiers Rejetés</span>
                    </Button>
                </div>

                {/* Table card */}
                <Card className="bento-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50 border-b border-surface-200 text-xs font-bold text-surface-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Demandeur</th>
                                    <th className="py-4 px-6">Type</th>
                                    <th className="py-4 px-6">Documents soumis</th>
                                    <th className="py-4 px-6">Date de soumission</th>
                                    <th className="py-4 px-6">Statut KYC</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100 text-sm font-semibold text-surface-700">
                                {kycRequests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-surface-400">
                                            Aucune demande KYC trouvée dans cette catégorie.
                                        </td>
                                    </tr>
                                ) : (
                                    kycRequests.data.map((req) => (
                                        <tr key={req.id} className="hover:bg-surface-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-700 border border-surface-200">
                                                        {req.user.first_name[0]}{req.user.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-surface-900 leading-none">{req.user.first_name} {req.user.last_name}</h4>
                                                        <span className="text-xs text-surface-400 font-mono mt-1 block">{req.user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`capitalize text-xs font-bold px-2.5 py-0.5 rounded-full border
                                                    ${req.type === 'seller' ? 'bg-secondary-50 text-secondary-800 border-secondary-200' : 'bg-blue-50 text-blue-800 border-blue-200'}
                                                `}>
                                                    {req.type === 'seller' ? 'Vendeur' : 'Livreur'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-surface-500 font-mono">
                                                {req.documents_count} fichier(s)
                                            </td>
                                            <td className="py-4 px-6 text-surface-500 font-mono">
                                                {new Date(req.submitted_at).toLocaleDateString('fr-FR')} à {new Date(req.submitted_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant={
                                                    req.status === 'approved' ? 'success' :
                                                    req.status === 'rejected' ? 'danger' : 'warning'
                                                }>
                                                    {req.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link href={route('admin.kyc.show', req.id)}>
                                                    <Button variant="outline" size="sm" className="space-x-1.5">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Réviser</span>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {kycRequests.links.length > 3 && (
                        <div className="bg-surface-50 border-t border-surface-150 px-6 py-4 flex justify-between items-center text-xs font-bold text-surface-500">
                            <div>Affichage de {kycRequests.from} à {kycRequests.to} sur {kycRequests.total} dossiers</div>
                            <div className="flex space-x-1">
                                {kycRequests.links.map((link, idx) => (
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
