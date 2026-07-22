import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';

export default function DisputesIndex({ disputes }) {
    const [selectedDispute, setSelectedDispute] = useState(null);

    const { data, setData, post, processing } = useForm({
        seller_defense_text: '',
    });

    const handleDefenseSubmit = (e) => {
        e.preventDefault();
        post(`/seller/disputes/${selectedDispute.id}/defense`, {
            onSuccess: () => setSelectedDispute(null),
        });
    };

    return (
        <SellerCentralLayout header="Gestion des Litiges (Côté Vendeur)">
            <Head title="Litiges Vendeur - Seller Central" />

            <div className="space-y-8">
                {/* Intro Banner */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Centre d'Arbitrage & Preuves de Défense</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            En cas de litige ouvert par un client, vous disposez d'un délai imparti de 48h pour transmettre vos preuves d'emballage et d'expédition.
                        </p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold px-4 py-2 rounded-xl text-xs">
                        SLA Arbitrage : 72h
                    </span>
                </div>

                {/* Disputes List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">N° Litige</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Motif du Litige</th>
                                    <th className="px-6 py-3">Statut Escrow</th>
                                    <th className="px-6 py-3">Défense Vendeur</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {disputes.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Aucun litige en cours. Excellent travail ! 🎉</td>
                                    </tr>
                                ) : (
                                    disputes.map(d => (
                                        <tr key={d.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-mono font-bold text-indigo-600">#LIT-00{d.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{d.client?.first_name} {d.client?.last_name}</td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs">{d.reason}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                    🔒 Fonds Bloqués DISPUTED
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {d.seller_responded_at ? '✓ Transmise' : '⏳ Attente de réponse (48h)'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedDispute(d)}
                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition"
                                                >
                                                    {d.seller_responded_at ? 'Voir les Preuves' : 'Répondre au Litige'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Defense Submission */}
                {selectedDispute && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                            <div className="flex justify-between items-center border-b pb-3">
                                <h3 className="font-bold text-lg text-gray-900">Dossier de Défense #LIT-00{selectedDispute.id}</h3>
                                <button onClick={() => setSelectedDispute(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            <form onSubmit={handleDefenseSubmit} className="space-y-4 text-sm">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1">Explication & Justification du Vendeur</label>
                                    <textarea
                                        rows="4"
                                        value={data.seller_defense_text}
                                        onChange={e => setData('seller_defense_text', e.target.value)}
                                        placeholder="Décrivez précisément les détails du colis avant expédition (état, emballage, numéro de suivi)..."
                                        className="w-full px-3 py-2 border rounded-xl"
                                        required
                                    />
                                </div>

                                <div className="pt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDispute(null)}
                                        className="flex-1 py-2.5 border rounded-xl text-gray-600"
                                    >
                                        Fermer
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                                    >
                                        Soumettre les Preuves
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SellerCentralLayout>
    );
}
