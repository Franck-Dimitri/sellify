import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, X, ShieldAlert, ArrowRight } from 'lucide-react';

export default function RefuseDeliveryModal({ orderNumber, onClose }) {
    const [selectedReason, setSelectedReason] = useState('too_far');
    const [customExplanation, setCustomExplanation] = useState('');
    const { post, processing } = useForm();

    const reasonsList = [
        { id: 'too_far', label: 'Distance trop éloignée de ma zone' },
        { id: 'vehicle_unsuitable', label: 'Volume/Poids du colis inadapté à mon véhicule' },
        { id: 'busy', label: 'Indisponibilité temporaire / En pause' },
        { id: 'mechanical_issue', label: 'Problème technique / Mécanique sur véhicule' },
        { id: 'custom', label: 'Autre raison spécifique...' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('driver.delivery.refuse', orderNumber), {
            data: {
                reason: selectedReason,
                explanation: customExplanation
            },
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                            <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-stone-900">Motif de refus (Commande #{orderNumber})</h3>
                            <span className="text-[10px] text-stone-400 font-normal block">Donnée transmise à l'algorithme d'apprentissage IA</span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Reason Selection */}
                <div className="space-y-2 text-xs font-normal">
                    <label className="block font-semibold text-stone-700">Veuillez indiquer le motif principal du refus :</label>
                    <div className="space-y-1.5">
                        {reasonsList.map((r) => (
                            <label 
                                key={r.id}
                                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                                    selectedReason === r.id 
                                        ? 'bg-yellow-50/80 border-yellow-400 text-yellow-950 font-semibold shadow-2xs' 
                                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="refusal_reason"
                                    value={r.id}
                                    checked={selectedReason === r.id}
                                    onChange={() => setSelectedReason(r.id)}
                                    className="text-yellow-500 focus:ring-yellow-400"
                                />
                                <span>{r.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Custom Explanation Input */}
                {selectedReason === 'custom' && (
                    <div className="space-y-1 text-xs">
                        <label className="block font-semibold text-stone-700">Précisez votre raison :</label>
                        <textarea
                            rows="2"
                            value={customExplanation}
                            onChange={(e) => setCustomExplanation(e.target.value)}
                            placeholder="Expliquez brièvement les contraintes du terrain..."
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 outline-none focus:ring-2 focus:ring-yellow-400 text-xs"
                        />
                    </div>
                )}

                {/* Info Note */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-500 font-normal leading-normal">
                    💡 La course sera instantanément réaffectée au livreur de backup le plus proche.
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                    >
                        <span>Confirmer le refus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

            </form>
        </div>
    );
}
