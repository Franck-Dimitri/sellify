import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import { Card } from '../../../Components/ui/Card';
import { ShieldCheck, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

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

    const nextStep = () => {
        setStep(2);
    };

    const prevStep = () => {
        setStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <Card className="bg-white p-8 border border-surface-200 rounded-3xl shadow-sm space-y-6">
            {/* Step Indicators */}
            <div className="flex justify-between items-center pb-4 border-b border-surface-100">
                <span className={`text-xs font-bold uppercase tracking-wider ${step === 1 ? 'text-secondary-600' : 'text-surface-400'}`}>
                    Étape 1: Profil
                </span>
                <div className="h-1 flex-1 mx-4 bg-surface-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-secondary-500 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? 'text-secondary-600' : 'text-surface-400'}`}>
                    Étape 2: Documents KYC
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                    <div className="space-y-4 animate-scale-in">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Prénom"
                                name="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                error={errors.first_name}
                                placeholder="Ex: John"
                                required
                            />
                            <Input
                                label="Nom"
                                name="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                error={errors.last_name}
                                placeholder="Ex: Doe"
                                required
                            />
                        </div>

                        <Input
                            label="Adresse Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            placeholder="john.doe@exemple.com"
                            required
                        />

                        <Input
                            label="Téléphone"
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            error={errors.phone}
                            placeholder="Ex: +237699999999"
                            required
                        />

                        <Input
                            label="Mot de passe"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            placeholder="••••••••"
                            required
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            placeholder="••••••••"
                            required
                        />

                        <div className="pt-4">
                            <Button
                                type="button"
                                variant="primary"
                                className="w-full shadow-md space-x-2"
                                onClick={nextStep}
                            >
                                <span>Continuer vers les documents</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-scale-in">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-800">
                            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="leading-relaxed font-medium">
                                Pour valider votre compte vendeur et activer le retrait d'argent, veuillez uploader des fichiers CNI, Registre de commerce et un Selfie de contrôle.
                            </p>
                        </div>

                        {/* File inputs */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-sm font-semibold text-surface-700">CNI ou Passeport (Recto/Verso ou complet)</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-4 flex items-center justify-between cursor-pointer bg-surface-50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('doc_cni', e)}
                                        className="hidden"
                                        id="doc_cni"
                                        required
                                    />
                                    <label htmlFor="doc_cni" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-sm font-medium text-surface-600 truncate">
                                            {data.doc_cni ? data.doc_cni.name : 'Sélectionner une photo/image'}
                                        </span>
                                    </label>
                                </div>
                                {errors.doc_cni && <p className="text-xs text-accent-500 font-medium">{errors.doc_cni}</p>}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-sm font-semibold text-surface-700">Registre de commerce (RCCM)</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-4 flex items-center justify-between cursor-pointer bg-surface-50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('doc_registre', e)}
                                        className="hidden"
                                        id="doc_registre"
                                        required
                                    />
                                    <label htmlFor="doc_registre" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-sm font-medium text-surface-600 truncate">
                                            {data.doc_registre ? data.doc_registre.name : 'Sélectionner une photo/image'}
                                        </span>
                                    </label>
                                </div>
                                {errors.doc_registre && <p className="text-xs text-accent-500 font-medium">{errors.doc_registre}</p>}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-sm font-semibold text-surface-700">Photo Selfie de vérification</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-4 flex items-center justify-between cursor-pointer bg-surface-50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('doc_selfie', e)}
                                        className="hidden"
                                        id="doc_selfie"
                                        required
                                    />
                                    <label htmlFor="doc_selfie" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-sm font-medium text-surface-600 truncate">
                                            {data.doc_selfie ? data.doc_selfie.name : 'Sélectionner une photo/image'}
                                        </span>
                                    </label>
                                </div>
                                {errors.doc_selfie && <p className="text-xs text-accent-500 font-medium">{errors.doc_selfie}</p>}
                            </div>
                        </div>

                        {errors.error && (
                            <p className="text-sm text-accent-500 font-bold text-center bg-accent-50 border border-accent-100 rounded-xl py-2">{errors.error}</p>
                        )}

                        <div className="flex space-x-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-1/3 flex items-center justify-center space-x-2"
                                onClick={prevStep}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Retour</span>
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                className="flex-1 shadow-md"
                                disabled={processing}
                            >
                                Soumettre mon dossier KYC
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Card>
    );
}
