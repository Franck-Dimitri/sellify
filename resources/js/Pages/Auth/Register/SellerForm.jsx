import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ImageUploadDropzone from '@/Components/ui/ImageUploadDropzone';
import { 
    ShieldCheck, 
    ArrowRight, 
    ArrowLeft, 
    Store, 
    Sparkles, 
    Zap, 
    TrendingUp, 
    CheckCircle2, 
    Lock, 
    Eye, 
    EyeOff, 
    Mail, 
    Smartphone, 
    FileCheck2
} from 'lucide-react';

export default function SellerForm() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.password || !data.password_confirmation) {
            alert("Veuillez renseigner tous les champs obligatoires avant de passer à l'étape suivante.");
            return;
        }
        if (data.password !== data.password_confirmation) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
            
            {/* LEFT: MULTI-STEP SELLER FORM */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-stone-200 rounded-2xl shadow-xs space-y-6">
                
                {/* Step Indicators */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-medium">
                        <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-yellow-400 text-stone-950 font-semibold' : 'bg-stone-100 text-stone-500'}`}>1</span>
                            <span>Coordonnées Pro</span>
                        </span>
                        <div className="h-1 flex-1 mx-4 bg-stone-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-yellow-400 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
                        </div>
                        <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-yellow-400 text-stone-950 font-semibold' : 'bg-stone-100 text-stone-500'}`}>2</span>
                            <span>Documents KYC</span>
                        </span>
                    </div>
                </div>

                <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-4 text-xs">
                    
                    {/* STEP 1: PERSONAL & SHOP INFO */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1 pb-1">
                                <h2 className="text-xl font-semibold text-stone-900">1. Coordonnées du Vendeur</h2>
                                <p className="text-xs text-stone-500 font-normal">
                                    Ces informations permettront de configurer votre profil commerçant et vos retraits.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-medium text-stone-800 block">Prénom</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="Ex: Paul"
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
                                        placeholder="Ex: Kamga"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                    {errors.last_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.last_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Adresse Email Professionnelle</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="vendeur@entreprise.com"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-medium text-stone-800 block">Numéro Principal (Orange Money / MTN MoMo)</label>
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
                                    <span>Passer à l'étape 2 : Documents KYC</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: KYC DOCUMENTS WITH LIVE PREVIEWS */}
                    {step === 2 && (
                        <div className="space-y-5 animate-fade-in">
                            <div className="space-y-1 pb-1">
                                <h2 className="text-xl font-semibold text-stone-900">2. Documents KYC & Certification</h2>
                                <p className="text-xs text-stone-500 font-normal">
                                    Importez vos justificatifs avec prévisualisation pour débloquer les retraits et les micro-crédits.
                                </p>
                            </div>

                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
                                <ShieldCheck className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                                <p className="leading-relaxed font-normal">
                                    Vos documents sont analysés de façon confidentielle sous 24h par notre équipe pour activer votre badge marchand vérifié.
                                </p>
                            </div>

                            {/* CNI Dropzone */}
                            <ImageUploadDropzone
                                label="CNI Recto/Verso ou Passeport"
                                description="Photo nette et lisible"
                                value={data.doc_cni}
                                onChange={(file) => handleFileChange('doc_cni', file)}
                                error={errors.doc_cni}
                                required
                            />

                            {/* RCCM Dropzone */}
                            <ImageUploadDropzone
                                label="Registre de Commerce (RCCM) ou Patente"
                                description="Document officiel de votre activité"
                                value={data.doc_registre}
                                onChange={(file) => handleFileChange('doc_registre', file)}
                                error={errors.doc_registre}
                                required
                            />

                            {/* Selfie Dropzone */}
                            <ImageUploadDropzone
                                label="Photo Selfie de Contrôle"
                                description="Selfie tenant votre document d'identité"
                                value={data.doc_selfie}
                                onChange={(file) => handleFileChange('doc_selfie', file)}
                                error={errors.doc_selfie}
                                required
                            />

                            <div className="pt-3 flex items-center gap-3">
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
                                    disabled={processing || !data.doc_cni || !data.doc_registre || !data.doc_selfie}
                                    className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? (
                                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-stone-950 border-t-transparent"></span>
                                    ) : (
                                        <>
                                            <span>Finaliser mon inscription Vendeur</span>
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
                                src="/images/seller-step1.jpg"
                                alt="Création de boutique Vendeur"
                                className="w-full h-44 object-cover"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-yellow-600" />
                                <h3 className="text-sm font-semibold text-stone-900">Étape 1 : Vos Boutiques & Smart-Links</h3>
                            </div>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                Lancez jusqu'à 3 boutiques distinctes et générez des liens de commande instantanés pour vos clients WhatsApp et réseaux sociaux.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-normal">
                            <div className="flex items-start gap-2.5">
                                <Zap className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                <span>Smart-Links de paiement générés en 1 clic</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <TrendingUp className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                <span>Prévisions de ventes et gestion intelligente des stocks</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Retraits automatiques vers Orange Money & MTN MoMo</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 DEDICATED EXPLANATION & IMAGE */}
                {step === 2 && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 animate-fade-in">
                        <div className="rounded-xl overflow-hidden border border-stone-100 shadow-2xs">
                            <img
                                src="/images/seller-step2.jpg"
                                alt="Validation KYC Vendeur"
                                className="w-full h-44 object-cover"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-semibold text-stone-900">Étape 2 : Pourquoi la vérification KYC ?</h3>
                            </div>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                La certification garantit la conformité légale de votre boutique et vous octroie le badge "Vendeur Vérifié" pour rassurer les acheteurs.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-normal">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Déblocage des plafonds de retrait sans limitation</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Éligibilité prioritaire aux micro-crédits de réapprovisionnement</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Protection complète contre les faux litiges et impayés</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-950">
                    <Sparkles className="w-4 h-4 text-yellow-700 shrink-0" />
                    <p className="text-[11px] font-normal leading-relaxed">
                        {step === 1 
                            ? "Vous pourrez personnaliser l'apparence de votre boutique immédiatement après l'inscription." 
                            : "Les formats JPG et PNG jusqu'à 5 Mo sont acceptés pour vos pièces justificatives."
                        }
                    </p>
                </div>
            </div>

        </div>
    );
}
