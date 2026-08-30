import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ImageUploadDropzone from '@/Components/ui/ImageUploadDropzone';
import { 
    ShieldCheck, 
    Truck, 
    ArrowRight, 
    ArrowLeft, 
    Sparkles, 
    Navigation, 
    DollarSign, 
    CheckCircle2, 
    Lock, 
    Eye, 
    EyeOff, 
    Mail, 
    Smartphone, 
    Bike, 
    Car, 
    MapPin, 
    Award
} from 'lucide-react';

export default function DriverForm() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    const handleNextStep1 = (e) => {
        e.preventDefault();
        if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.password || !data.password_confirmation) {
            alert("Veuillez renseigner tous les champs obligatoires avant de continuer.");
            return;
        }
        if (data.password !== data.password_confirmation) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        setStep(2);
    };

    const handleNextStep2 = (e) => {
        e.preventDefault();
        if (!data.license_number || !data.vehicle_plate || !data.coverage_zone) {
            alert("Veuillez renseigner les informations relatives à votre véhicule et zone d'activité.");
            return;
        }
        setStep(3);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const vehicles = [
        { id: 'moto', label: 'Moto / Scooter', desc: 'Idéal en ville & livraison express', icon: Bike, recommended: true },
        { id: 'voiture', label: 'Voiture / Berline', desc: 'Colis moyens & trajets interurbains', icon: Car },
        { id: 'camionnette', label: 'Camionnette', desc: 'Gros volumes & fret commercial', icon: Truck },
        { id: 'velo', label: 'Vélo / VAE', desc: 'Hyper-centre & écologique', icon: Bike },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
            
            {/* LEFT: MULTI-STEP DRIVER FORM */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-stone-200 rounded-2xl shadow-xs space-y-6">
                
                {/* Step Indicators */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-medium">
                        <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-yellow-400 text-stone-950 font-semibold' : 'bg-stone-100 text-stone-500'}`}>1</span>
                            <span>Identité</span>
                        </span>
                        <div className="h-1 flex-1 mx-2 bg-stone-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-yellow-400 transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
                        </div>
                        <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-yellow-400 text-stone-950 font-semibold' : 'bg-stone-100 text-stone-500'}`}>2</span>
                            <span>Véhicule</span>
                        </span>
                        <div className="h-1 flex-1 mx-2 bg-stone-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-yellow-400 transition-all duration-300 ${step === 3 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-yellow-400 text-stone-950 font-semibold' : 'bg-stone-100 text-stone-500'}`}>3</span>
                            <span>Documents</span>
                        </span>
                    </div>
                </div>

                <form onSubmit={step === 1 ? handleNextStep1 : step === 2 ? handleNextStep2 : handleSubmit} className="space-y-4 text-xs">
                    
                    {/* STEP 1: PERSONAL IDENTITY */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1 pb-1">
                                <h2 className="text-xl font-semibold text-stone-900">1. Vos Coordonnées Personnelles</h2>
                                <p className="text-xs text-stone-500 font-normal">
                                    Vos coordonnées pour la gestion de votre compte livreur et la réception de vos gains.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-medium text-stone-800 block">Prénom</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="Ex: Pierre"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                    {errors.first_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.first_name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="font-medium text-stone-800 block">Nom</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="Ex: Mbarga"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                    {errors.last_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.last_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Adresse Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="livreur@exemple.com"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Numéro Mobile Money (Versement des courses)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+237 6XX XX XX XX"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-medium text-stone-800 block">Mot de passe</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-rose-600 text-[11px] mt-0.5">{errors.password}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="font-medium text-stone-800 block">Confirmer mot de passe</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                >
                                    <span>Passer à l'étape 2 : Véhicule</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: VEHICLE & ZONE */}
                    {step === 2 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1 pb-1">
                                <h2 className="text-xl font-semibold text-stone-900">2. Votre Véhicule & Zone de Couverture</h2>
                                <p className="text-xs text-stone-500 font-normal">
                                    Choisissez votre moyen de transport pour recevoir des propositions de courses ciblées.
                                </p>
                            </div>

                            {/* Vehicle Selector */}
                            <div className="space-y-1.5">
                                <label className="font-medium text-stone-800 block">Type de véhicule</label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {vehicles.map((v) => {
                                        const Icon = v.icon;
                                        const isSelected = data.vehicle_type === v.id;
                                        return (
                                            <div
                                                key={v.id}
                                                onClick={() => setData('vehicle_type', v.id)}
                                                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                                                    isSelected 
                                                        ? 'border-yellow-400 bg-amber-50/50 shadow-2xs' 
                                                        : 'border-stone-200 bg-white hover:border-stone-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-yellow-400 text-stone-950' : 'bg-stone-100 text-stone-600'}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    {v.recommended && (
                                                        <span className="text-[9px] font-medium uppercase tracking-wider bg-yellow-100 text-yellow-900 px-1.5 py-0.2 rounded">
                                                            Populaire
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold text-xs ${isSelected ? 'text-yellow-950' : 'text-stone-800'}`}>
                                                        {v.label}
                                                    </p>
                                                    <p className="text-[10px] text-stone-400 font-normal leading-tight mt-0.5">
                                                        {v.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Numéro de Permis de Conduire</label>
                                <input
                                    type="text"
                                    value={data.license_number}
                                    onChange={(e) => setData('license_number', e.target.value)}
                                    placeholder="Ex: DL-89218-A"
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                    required
                                />
                                {errors.license_number && <p className="text-rose-600 text-[11px] mt-0.5">{errors.license_number}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Immatriculation du Véhicule</label>
                                <input
                                    type="text"
                                    value={data.vehicle_plate}
                                    onChange={(e) => setData('vehicle_plate', e.target.value)}
                                    placeholder="Ex: LT-129-XX"
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 font-mono transition-all shadow-2xs uppercase"
                                    required
                                />
                                {errors.vehicle_plate && <p className="text-rose-600 text-[11px] mt-0.5">{errors.vehicle_plate}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Zone de Couverture Principale</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.coverage_zone}
                                        onChange={(e) => setData('coverage_zone', e.target.value)}
                                        placeholder="Ex: Douala (Akwa, Bonanjo, Deido)"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                </div>
                                {errors.coverage_zone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.coverage_zone}</p>}
                            </div>

                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Retour</span>
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                >
                                    <span>Passer à l'étape 3 : Documents</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: KYC DOCUMENTS */}
                    {step === 3 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1 pb-1">
                                <h2 className="text-xl font-semibold text-stone-900">3. Documents & Certification</h2>
                                <p className="text-xs text-stone-500 font-normal">
                                    Importez vos justificatifs avec prévisualisation pour l'attribution de votre badge de coursier vérifié.
                                </p>
                            </div>

                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
                                <ShieldCheck className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                                <p className="leading-relaxed font-normal">
                                    L'équipe Sellify valide vos documents en 24h ouvrées pour assurer la sécurité des colis auprès des commerçants.
                                </p>
                            </div>

                            {/* CNI Dropzone */}
                            <ImageUploadDropzone
                                label="CNI Recto/Verso ou Passeport"
                                description="Pièce d'identité lisible"
                                value={data.doc_cni}
                                onChange={(file) => handleFileChange('doc_cni', file)}
                                error={errors.doc_cni}
                                required
                            />

                            {/* Permis de conduire Dropzone */}
                            <ImageUploadDropzone
                                label="Permis de Conduire"
                                description="En cours de validité"
                                value={data.doc_permis}
                                onChange={(file) => handleFileChange('doc_permis', file)}
                                error={errors.doc_permis}
                                required
                            />

                            {/* Carte Grise Dropzone */}
                            <ImageUploadDropzone
                                label="Carte Grise du Véhicule"
                                description="Document officiel du véhicule"
                                value={data.doc_carte_grise}
                                onChange={(file) => handleFileChange('doc_carte_grise', file)}
                                error={errors.doc_carte_grise}
                                required
                            />

                            {/* Photo du véhicule Dropzone */}
                            <ImageUploadDropzone
                                label="Photo du Véhicule (Plaque lisible)"
                                description="Vue d'ensemble de votre véhicule"
                                value={data.doc_vehicule}
                                onChange={(file) => handleFileChange('doc_vehicule', file)}
                                error={errors.doc_vehicule}
                                required
                            />

                            {/* Selfie Dropzone */}
                            <ImageUploadDropzone
                                label="Photo Selfie de Contrôle"
                                description="Photo nette de votre visage"
                                value={data.doc_selfie}
                                onChange={(file) => handleFileChange('doc_selfie', file)}
                                error={errors.doc_selfie}
                                required
                            />

                            <div className="pt-3 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Retour</span>
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing || !data.doc_cni || !data.doc_permis || !data.doc_carte_grise || !data.doc_vehicule || !data.doc_selfie}
                                    className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? (
                                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-stone-950 border-t-transparent"></span>
                                    ) : (
                                        <>
                                            <span>Finaliser mon inscription Livreur</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* RIGHT: DYNAMIC ONBOARDING BANNER ACCORDING TO STEP */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* STEP 1 DEDICATED EXPLANATION & IMAGE */}
                {step === 1 && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 animate-fade-in">
                        <div className="rounded-xl overflow-hidden border border-stone-100 shadow-2xs">
                            <img
                                src="/images/driver-step1.jpg"
                                alt="Livreur Partenaire"
                                className="w-full h-44 object-cover"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-yellow-600" />
                                <h3 className="text-sm font-semibold text-stone-900">Étape 1 : Profil & Gains Quotidiens</h3>
                            </div>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                Rejoignez une flotte connectée et recevez automatiquement vos gains après chaque livraison directement sur votre compte Mobile Money.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-normal">
                            <div className="flex items-start gap-2.5">
                                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Paiements journaliers garantis sans frais cachés</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Smartphone className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                <span>Application mobile intuitive et alertes de courses</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Accès prioritaire aux commandes des marchands vérifiés</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 DEDICATED EXPLANATION & IMAGE */}
                {step === 2 && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 animate-fade-in">
                        <div className="rounded-xl overflow-hidden border border-stone-100 shadow-2xs">
                            <img
                                src="/images/driver-step2.jpg"
                                alt="Navigation Logistique IA"
                                className="w-full h-44 object-cover"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-semibold text-stone-900">Étape 2 : Navigation & Tournées IA</h3>
                            </div>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                Notre algorithme optimise vos trajets en temps réel pour regrouper les livraisons par quartier et limiter les trajets à vide.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-normal">
                            <div className="flex items-start gap-2.5">
                                <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span>Itinéraires géolocalisés avec guidage étape par étape</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Courses attribuées selon la proximité de votre position</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Gain de temps moyen de 25 minutes par tournée</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3 DEDICATED EXPLANATION & IMAGE */}
                {step === 3 && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 animate-fade-in">
                        <div className="rounded-xl overflow-hidden border border-stone-100 shadow-2xs">
                            <img
                                src="/images/driver-step3.jpg"
                                alt="Certification Livreur"
                                className="w-full h-44 object-cover"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-600" />
                                <h3 className="text-sm font-semibold text-stone-900">Étape 3 : Badge Livreur Certifié</h3>
                            </div>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                La certification confirme la validité de vos pièces et vous attribue le statut de coursier agréé auprès du réseau de marchands.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-normal">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Badge officiel visible par les commerçants et clients</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Sécurisation de la remise du colis par code secret OTP</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Support assistance coursier disponible 7j/7</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-950">
                    <Sparkles className="w-4 h-4 text-yellow-700 shrink-0" />
                    <p className="text-[11px] font-normal leading-relaxed">
                        {step === 1 && "Votre compte sera configuré dès la validation de votre email."}
                        {step === 2 && "Vous pouvez modifier votre zone d'activité à tout moment."}
                        {step === 3 && "Photos nettes et lisibles recommandées pour une validation en moins de 24h."}
                    </p>
                </div>
            </div>

        </div>
    );
}
