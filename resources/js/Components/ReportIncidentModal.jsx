import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    AlertTriangle, 
    X, 
    Camera, 
    UploadCloud, 
    CheckCircle2, 
    ShieldCheck, 
    HelpCircle, 
    RotateCcw,
    Store,
    UserX,
    PackageX,
    FileText
} from 'lucide-react';

export default function ReportIncidentModal({ order, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        reason: 'vendor_fault_wrong_item',
        description: '',
        incident_photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const reasons = [
        {
            id: 'vendor_fault_wrong_item',
            title: 'Produit non conforme (Faute Vendeur)',
            desc: 'Mauvaise taille, mauvaise couleur ou article différent de la commande.',
            icon: Store,
            badge: 'Faute Vendeur',
            badgeColor: 'bg-rose-100 text-rose-800'
        },
        {
            id: 'vendor_fault_defective',
            title: 'Article défectueux ou cassé',
            desc: 'Produit abîmé au déballage ou ne s’allume pas.',
            icon: PackageX,
            badge: 'Faute Vendeur',
            badgeColor: 'bg-rose-100 text-rose-800'
        },
        {
            id: 'damaged_package',
            title: 'Colis endommagé / Emballage déchiré',
            desc: 'Emballage ouvert, écrasé ou altéré lors du transport.',
            icon: AlertTriangle,
            badge: 'Incident Logistique',
            badgeColor: 'bg-amber-100 text-amber-900'
        },
        {
            id: 'customer_refusal_changed_mind',
            title: 'Refus Client (Changement d\'avis)',
            desc: 'Le client ne souhaite plus le produit ou n\'a pas les fonds.',
            icon: UserX,
            badge: 'Refus Client',
            badgeColor: 'bg-yellow-100 text-yellow-950'
        },
        {
            id: 'customer_unreachable',
            title: 'Client injoignable ou absent',
            desc: 'Téléphone éteint / pas de réponse après 3 appels à destination.',
            icon: HelpCircle,
            badge: 'Client Absent',
            badgeColor: 'bg-stone-200 text-stone-700'
        }
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('incident_photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('driver.delivery.incident', order.order_number), {
            onSuccess: () => {
                if (onClose) onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-stone-200 space-y-4 my-auto animate-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200 shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm sm:text-base text-stone-900">
                                Signaler un Incident & Déclarer un Retour
                            </h3>
                            <p className="text-[11px] text-stone-400 font-mono">
                                Commande #{order.order_number}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Driver Financial Protection Banner */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Garantie Chauffeur Sellify Express :</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-snug">
                        Vos frais de course (<strong className="font-bold">+{Number(order.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA</strong>) vous sont <strong className="font-bold">100% garantis et crédités</strong>. Vous devez simplement ramener le colis à la boutique d'origine.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Reason Radios */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 block">
                            Sélectionnez le motif principal du litige / refus :
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {reasons.map((r) => {
                                const IconComponent = r.icon;
                                const isSelected = data.reason === r.id;
                                return (
                                    <label
                                        key={r.id}
                                        className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                            isSelected 
                                                ? 'bg-yellow-50/80 border-yellow-400 ring-1 ring-yellow-400' 
                                                : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="incident_reason"
                                            value={r.id}
                                            checked={isSelected}
                                            onChange={() => setData('reason', r.id)}
                                            className="mt-1 text-yellow-500 focus:ring-yellow-400"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1.5">
                                                <span className="font-bold text-xs text-stone-900">{r.title}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${r.badgeColor}`}>
                                                    {r.badge}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{r.desc}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        {errors.reason && <p className="text-xs text-rose-600 font-semibold">{errors.reason}</p>}
                    </div>

                    {/* Explanatory description */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-stone-400" />
                            <span>Description détaillée des faits constatés sur place :</span>
                        </label>
                        <textarea
                            rows={2}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Ex: Le client a ouvert devant moi et le produit est en taille 40 au lieu de 44..."
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.description && <p className="text-xs text-rose-600 font-semibold">{errors.description}</p>}
                    </div>

                    {/* Photo Proof Upload */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Photo de preuve terrain (Colis / Défaut / Reçu) :</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-stone-600">
                                <UploadCloud className="w-4 h-4 text-stone-400" />
                                <span>{data.incident_photo ? data.incident_photo.name : 'Prendre une photo ou importer'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Aperçu incident"
                                    className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                                />
                            )}
                        </div>
                        {errors.incident_photo && <p className="text-xs text-rose-600 font-semibold">{errors.incident_photo}</p>}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-4 h-4 shrink-0" />
                            <span>{processing ? 'Enregistrement...' : 'Valider le retour boutique & Encaisser frais'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}
