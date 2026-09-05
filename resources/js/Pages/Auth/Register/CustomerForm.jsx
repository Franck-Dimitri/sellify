import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    ArrowRight, 
    Smartphone, 
    Mail, 
    ShieldCheck, 
    Lock, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    Sparkles, 
    Truck, 
    RefreshCw
} from 'lucide-react';

export default function CustomerForm() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        role: 'customer',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
            
            {/* LEFT: CUSTOMER SIGN UP FORM */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-stone-200 rounded-2xl shadow-xs space-y-6">
                
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                        <Sparkles className="w-3 h-3 text-yellow-600" />
                        <span>Compte Acheteur</span>
                    </div>
                    <h2 className="text-xl font-semibold text-stone-900">Vos coordonnées</h2>
                    <p className="text-xs text-stone-500 font-normal">
                        Renseignez vos informations pour commander en toute sécurité.
                    </p>
                </div>

                {/* OAuth 2.0 Social Logins */}
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => alert("Inscription Google OAuth 2.0 en cours...")}
                        className="w-full py-2.5 px-4 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>S'inscrire avec Google</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => alert("Inscription Facebook...")}
                            className="py-2.5 px-3 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Facebook</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => alert("Inscription Apple ID...")}
                            className="py-2.5 px-3 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-stone-900 fill-current" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.11.64-2.79 1.44-.59.69-1.12 1.83-.98 2.91 1.07.08 2.14-.55 2.78-1.31z"/>
                            </svg>
                            <span>Apple ID</span>
                        </button>
                    </div>
                </div>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-stone-200"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium uppercase tracking-wider">Ou avec vos identifiants</span>
                    <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="font-medium text-stone-800 block">Prénom</label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Ex: Jean"
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
                                placeholder="Ex: Dupont"
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
                                placeholder="jean.dupont@exemple.com"
                                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="font-medium text-stone-800 block">Numéro de Téléphone (Mobile Money)</label>
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
                            disabled={processing}
                            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? (
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-stone-950 border-t-transparent"></span>
                            ) : (
                                <>
                                    <span>Valider et créer mon compte</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* RIGHT: DEDICATED ILLUSTRATION & INFORMATIVE ONBOARDING BANNER */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* Onboarding Image & Explanation */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="rounded-xl overflow-hidden border border-stone-100 shadow-2xs">
                        <img
                            src="/images/buyer-onboarding.jpg"
                            alt="Acheteur Sellify"
                            className="w-full h-44 object-cover"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-sm font-semibold text-stone-900">Garantie Séquestre Escrow</h3>
                        </div>
                        <p className="text-xs text-stone-500 font-normal leading-relaxed">
                            Votre paiement reste en sécurité chez Sellify. Le commerçant n'est payé qu'après validation de votre colis à la livraison.
                        </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-normal">
                        <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Remboursement intégral en cas d'article non conforme</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <Truck className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                            <span>Suivi de votre livreur en direct par GPS</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <RefreshCw className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                            <span>Code secret OTP pour débloquer la remise du colis</span>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-950">
                    <Sparkles className="w-4 h-4 text-yellow-700 shrink-0" />
                    <p className="text-[11px] font-normal leading-relaxed">
                        Un code de vérification sécurisé vous sera envoyé par email à la validation.
                    </p>
                </div>
            </div>

        </div>
    );
}
