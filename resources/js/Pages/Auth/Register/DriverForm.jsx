import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import { Card } from '../../../Components/ui/Card';
import { ShieldCheck, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

export default function DriverForm() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        role: 'driver',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        // Vehicle Info
        vehicle_type: 'moto',
        license_number: '',
        vehicle_plate: '',
        coverage_zone: '',
        // KYC Docs
        doc_cni: null,
        doc_permis: null,
        doc_carte_grise: null,
        doc_vehicule: null,
        doc_selfie: null,
    });

    const handleFileChange = (field, e) => {
        setData(field, e.target.files[0]);
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
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
                <div className="h-1 flex-1 mx-3 bg-surface-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-secondary-500 transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? 'text-secondary-600' : 'text-surface-400'}`}>
                    Étape 2: Véhicule
                </span>
                <div className="h-1 flex-1 mx-3 bg-surface-100 rounded-full overflow-hidden"></div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step === 3 ? 'text-secondary-600' : 'text-surface-400'}`}>
                    Étape 3: KYC
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Info */}
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
                                <span>Continuer vers le véhicule</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Vehicle & Zone Info */}
                {step === 2 && (
                    <div className="space-y-4 animate-scale-in">
                        <div className="flex flex-col space-y-1.5 w-full">
                            <label className="text-sm font-semibold text-surface-700">Type de véhicule</label>
                            <select
                                name="vehicle_type"
                                value={data.vehicle_type}
                                onChange={(e) => setData('vehicle_type', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-surface-900 bg-white border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg transition-all outline-none text-sm md:text-base font-medium"
                            >
                                <option value="moto">Moto</option>
                                <option value="voiture">Voiture</option>
                                <option value="velo">Vélo / Trottinette</option>
                                <option value="camionnette">Camionnette / Van</option>
                            </select>
                            {errors.vehicle_type && <p className="text-xs text-accent-500 font-medium">{errors.vehicle_type}</p>}
                        </div>

                        <Input
                            label="Numéro de Permis de conduire"
                            name="license_number"
                            value={data.license_number}
                            onChange={(e) => setData('license_number', e.target.value)}
                            error={errors.license_number}
                            placeholder="Ex: PE-980182-B"
                            required
                        />

                        <Input
                            label="Plaque d'immatriculation"
                            name="vehicle_plate"
                            value={data.vehicle_plate}
                            onChange={(e) => setData('vehicle_plate', e.target.value)}
                            error={errors.vehicle_plate}
                            placeholder="Ex: LT-281-AA"
                            required
                        />

                        <Input
                            label="Zone de couverture (Villes, Quartiers)"
                            name="coverage_zone"
                            value={data.coverage_zone}
                            onChange={(e) => setData('coverage_zone', e.target.value)}
                            error={errors.coverage_zone}
                            placeholder="Ex: Douala (Akwa, Bonapriso, Deido)"
                            required
                        />

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
                                type="button"
                                variant="primary"
                                className="flex-1 shadow-md space-x-2"
                                onClick={nextStep}
                            >
                                <span>Continuer vers le KYC</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: KYC Document Uploads */}
                {step === 3 && (
                    <div className="space-y-5 animate-scale-in">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-800">
                            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="leading-relaxed font-medium">
                                Pour intégrer la flotte de livraison Sellify, veuillez soumettre les documents d'identification de votre profil et de votre véhicule.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* CNI */}
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-semibold text-surface-700">CNI ou Passeport</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-3 flex items-center justify-between cursor-pointer bg-surface-50">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange('doc_cni', e)} className="hidden" id="doc_cni" required />
                                    <label htmlFor="doc_cni" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-xs font-semibold text-surface-600 truncate">{data.doc_cni ? data.doc_cni.name : 'Photo de la pièce d\'identité'}</span>
                                    </label>
                                </div>
                                {errors.doc_cni && <p className="text-xs text-accent-500 font-medium">{errors.doc_cni}</p>}
                            </div>

                            {/* Permis */}
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-semibold text-surface-700">Permis de conduire</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-3 flex items-center justify-between cursor-pointer bg-surface-50">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange('doc_permis', e)} className="hidden" id="doc_permis" required />
                                    <label htmlFor="doc_permis" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-xs font-semibold text-surface-600 truncate">{data.doc_permis ? data.doc_permis.name : 'Photo du permis de conduire'}</span>
                                    </label>
                                </div>
                                {errors.doc_permis && <p className="text-xs text-accent-500 font-medium">{errors.doc_permis}</p>}
                            </div>

                            {/* Carte Grise */}
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-semibold text-surface-700">Carte Grise du véhicule</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-3 flex items-center justify-between cursor-pointer bg-surface-50">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange('doc_carte_grise', e)} className="hidden" id="doc_carte_grise" required />
                                    <label htmlFor="doc_carte_grise" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-xs font-semibold text-surface-600 truncate">{data.doc_carte_grise ? data.doc_carte_grise.name : 'Photo de la carte grise'}</span>
                                    </label>
                                </div>
                                {errors.doc_carte_grise && <p className="text-xs text-accent-500 font-medium">{errors.doc_carte_grise}</p>}
                            </div>

                            {/* Photo Véhicule */}
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-semibold text-surface-700">Photo du Véhicule</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-3 flex items-center justify-between cursor-pointer bg-surface-50">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange('doc_vehicule', e)} className="hidden" id="doc_vehicule" required />
                                    <label htmlFor="doc_vehicule" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-xs font-semibold text-surface-600 truncate">{data.doc_vehicule ? data.doc_vehicule.name : 'Photo entière du véhicule'}</span>
                                    </label>
                                </div>
                                {errors.doc_vehicule && <p className="text-xs text-accent-500 font-medium">{errors.doc_vehicule}</p>}
                            </div>

                            {/* Selfie */}
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-semibold text-surface-700">Photo Selfie de vérification</label>
                                <div className="border border-dashed border-surface-200 hover:border-secondary-500 rounded-xl p-3 flex items-center justify-between cursor-pointer bg-surface-50">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange('doc_selfie', e)} className="hidden" id="doc_selfie" required />
                                    <label htmlFor="doc_selfie" className="flex items-center space-x-3 cursor-pointer w-full">
                                        <Upload className="w-5 h-5 text-surface-400" />
                                        <span className="text-xs font-semibold text-surface-600 truncate">{data.doc_selfie ? data.doc_selfie.name : 'Uploader une photo selfie'}</span>
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
