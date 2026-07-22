import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    AlertTriangle, 
    ShieldCheck, 
    Clock, 
    FileText, 
    Upload, 
    CheckCircle2, 
    XCircle, 
    Lock,
    X,
    Send
} from 'lucide-react';

export default function DisputesIndex({ disputes = [] }) {
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [defenseText, setDefenseText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenModal = (dispute) => {
        setSelectedDispute(dispute);
        setDefenseText(dispute.seller_defense_text || '');
    };

    const handleDefenseSubmit = (e) => {
        e.preventDefault();
        if (!selectedDispute) return;

        setSubmitting(true);

        router.post(route('seller.disputes.defense', selectedDispute.id), {
            seller_defense_text: defenseText
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setSelectedDispute(null);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    return (
        <SellerCentralLayout title="Gestion des Litiges Vendeur">
            <Head title="Gestion des Litiges - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Centre d'Arbitrage & Prévention des Litiges</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Gestion des Litiges & Défense Escrow
                        </h1>
                        <p className="text-xs text-stone-600">
                            En cas de contestation client, transmettez vos explications et vos preuves d'emballage/expédition sous 48h.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1.5 bg-amber-500/20 text-amber-900 font-medium rounded-xl text-xs flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-700" />
                            <span>Délai d'Arbitrage : 48h - 72h</span>
                        </div>
                    </div>
                </div>

                {/* Disputes History Table */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Dossiers de Contestation ({disputes.length})</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-6 py-3.5">Référence Litige</th>
                                    <th className="px-6 py-3.5">Client Concerné</th>
                                    <th className="px-6 py-3.5">Motif de la Contestation</th>
                                    <th className="px-6 py-3.5">Statut Séquestre Escrow</th>
                                    <th className="px-6 py-3.5">Défense Vendeur</th>
                                    <th className="px-6 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {disputes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-stone-400 font-normal">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                                            <p className="font-medium text-stone-700">Aucun litige en cours.</p>
                                            <p className="text-[11px] text-stone-400 mt-0.5">Vos expéditions se déroulent sans contestation.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    disputes.map(d => (
                                        <tr key={d.id} className="hover:bg-stone-50/80 transition-colors">
                                            <td className="px-6 py-3.5 font-mono font-medium text-amber-900">
                                                #LIT-{d.id}
                                            </td>

                                            <td className="px-6 py-3.5 font-medium text-stone-900">
                                                {d.client ? `${d.client.first_name} ${d.client.last_name}` : 'Client Anonyme'}
                                            </td>

                                            <td className="px-6 py-3.5 text-stone-600 max-w-xs font-normal">
                                                {d.reason || 'Article non conforme ou retard de livraison.'}
                                            </td>

                                            <td className="px-6 py-3.5">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                                                    🔒 Fonds Contestés
                                                </span>
                                            </td>

                                            <td className="px-6 py-3.5 font-normal">
                                                {d.seller_responded_at ? (
                                                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Défense transmise
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-800 font-medium flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Réponse requise (48h)
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-3.5 text-right">
                                                <button
                                                    onClick={() => handleOpenModal(d)}
                                                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-lg text-xs font-medium transition-all shadow-xs"
                                                >
                                                    {d.seller_responded_at ? 'Voir le Dossier' : 'Répondre au Litige'}
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
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-stone-800">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <h3 className="font-semibold text-stone-900 text-sm">Dossier d'Arbitrage #LIT-{selectedDispute.id}</h3>
                                <button onClick={() => setSelectedDispute(null)} className="text-stone-400 hover:text-stone-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleDefenseSubmit} className="space-y-4 text-xs font-normal">
                                <div>
                                    <label className="block font-medium text-stone-600 mb-1">
                                        Explications & Preuves de Défense *
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={defenseText}
                                        onChange={e => setDefenseText(e.target.value)}
                                        placeholder="Décrivez précisément l'état de l'article avant expédition, le mode d'emballage et les références de livraison..."
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                        required
                                    />
                                </div>

                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                                    <span className="font-medium">Information : </span>
                                    Vos éléments seront transmis directement à l'équipe d'arbitrage Sellify pour débloquer les fonds sous séquestre.
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDispute(null)}
                                        className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 font-medium transition-colors"
                                    >
                                        Fermer
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-2.5 bg-amber-500 text-amber-950 rounded-xl font-medium hover:bg-amber-600 transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{submitting ? 'Transmission...' : 'Soumettre les Preuves'}</span>
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
