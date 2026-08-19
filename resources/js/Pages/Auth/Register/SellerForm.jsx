import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ShieldCheck, Upload, ArrowRight, ArrowLeft, Store } from 'lucide-react';

export default function SellerForm() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        role: 'seller',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        // KYC Docs
        doc_cni: null,
        doc_registre: null,
        doc_selfie: null,
    });

    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="bg-white p-6 sm:p-8 border border-stone-200 rounded-xl shadow-xs space-y-5">
            {/* Step Indicators */}
            <div className="flex justify-between items-center pb-3 border-b border-stone-100 text-xs">
                <span className={`font-medium ${step === 1 ? 'text-yellow-700' : 'text-stone-400'}`}>
                    1. Informations Personnelles
                </span>
                <div className="h-1 flex-1 mx-4 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-yellow-500 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
                </div>
                <span className={`font-medium ${step === 2 ? 'text-yellow-700' : 'text-stone-400'}`}>
                    2. Documents KYC Vendeur
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {step === 1 && (
                    <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Prénom</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="Ex: Jean"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.first_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    placeholder="Ex: Dupont"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.last_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Adresse Email Pro</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="vendeur@entreprise.com"
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                            {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Téléphone Principal (Orange / MTN MoMo)</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+237 6XX XX XX XX"
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                            {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.password && <p className="text-rose-600 text-[11px] mt-0.5">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Confirmer mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <span>Continuer vers les documents KYC</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50/70 border border-yellow-200/80 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-yellow-950">
                            <ShieldCheck className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                                Conformément à la réglementation sur les paiements Escrow, veuillez joindre vos pièces d'identité et justificatifs commerciaux pour activer vos retraits.
                            </p>
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">CNI ou Passeport (Photo lisible)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange('doc_cni', e)}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300"
                                required
                            />
                            {errors.doc_cni && <p className="text-rose-600 text-[11px] mt-0.5">{errors.doc_cni}</p>}
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Registre de Commerce (RCCM) ou Patente</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange('doc_registre', e)}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300"
                                required
                            />
                            {errors.doc_registre && <p className="text-rose-600 text-[11px] mt-0.5">{errors.doc_registre}</p>}
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Photo Selfie (Contrôle d'identité)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange('doc_selfie', e)}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300"
                                required
                            />
                            {errors.doc_selfie && <p className="text-rose-600 text-[11px] mt-0.5">{errors.doc_selfie}</p>}
                        </div>

                        <div className="pt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Retour</span>
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                                <span>Finaliser l'inscription Vendeur</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
