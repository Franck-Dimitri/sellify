import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { AlertTriangle, ShieldCheck, Clock, CheckCircle2, Store, Package } from 'lucide-react';

export default function Index({ disputes = { data: [] } }) {
    const disputeStatusBadge = (status) => {
        const map = {
            opened: { label: 'En attente défense vendeur', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            defense_submitted: { label: 'En examen arbitrage', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            resolved_refund: { label: 'Remboursement Client validé', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            resolved_seller: { label: 'Rejeté / Payé au Vendeur', bg: 'bg-stone-100 text-stone-700 border-stone-200' },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <CustomerLayout title="Mes Litiges & Réclamations">
            <Head title="Mes Litiges - Espace Client" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-yellow-700 uppercase tracking-wide">
                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Médiation & Protection Acheteur</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900 mt-1">
                            Mes Réclamations & Litiges
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Vos fonds restent bloqués en Escrow tant qu'une réclamation est en cours d'examen par nos modérateurs.
                        </p>
                    </div>

                    <Link
                        href={route('customer.orders.index')}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
                    >
                        <span>Voir mes commandes</span>
                    </Link>
                </div>

                {/* Disputes List */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Commande</th>
                                    <th className="py-3 px-4">Boutique</th>
                                    <th className="py-3 px-4">Motif Réclamation</th>
                                    <th className="py-3 px-4">Montant Bloqué</th>
                                    <th className="py-3 px-4">Statut Arbitrage</th>
                                    <th className="py-3 px-4 text-right">Détails</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {disputes.data && disputes.data.length > 0 ? (
                                    disputes.data.map((d) => (
                                        <tr key={d.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3 px-4 font-mono font-medium text-stone-900">
                                                {d.order?.order_number}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-stone-700">
                                                {d.order?.shop?.name}
                                            </td>
                                            <td className="py-3 px-4 text-stone-800 max-w-xs truncate">
                                                {d.reason}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-stone-900">
                                                {Number(d.order?.total_amount || 0).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3 px-4">
                                                {disputeStatusBadge(d.status)}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Link
                                                    href={route('customer.orders.show', d.order?.order_number)}
                                                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium text-[11px]"
                                                >
                                                    Suivi
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-stone-400">
                                            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                                            <p className="text-xs font-medium text-stone-700">Aucun litige en cours</p>
                                            <p className="text-[11px] text-stone-400 mt-0.5">Toutes vos commandes se déroulent dans les meilleures conditions.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </CustomerLayout>
    );
}
