import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Lock, 
    Mail, 
    ArrowRight, 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    Zap, 
    Sparkles
} from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#f7f5f0] text-stone-700 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Head title="Connexion sécurisée - Sellify.me" />

            {/* SPLIT BACKGROUND: RIGHT HALF YELLOW */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 z-0">
                {/* Subtle Geometric Overlay */}
                <div className="w-full h-full opacity-15 pattern-grid-amber"></div>
                <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            {/* LEFT BACKGROUND: SOFT WARM STONE PATTERN */}
            <div className="absolute inset-y-0 left-0 w-full md:w-1/2 pattern-grid-amber opacity-40 z-0"></div>

            {/* CENTERED COMPACT DUAL-CARD CONTAINER */}
            <div className="max-w-4xl w-full bg-white rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
                
                {/* LEFT COLUMN: AUTH FORM */}
                <div className="md:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-5 bg-white">
                    
                    {/* Header with Logo */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center space-x-2 group">
                            <span className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center font-bold text-stone-900 shadow-2xs group-hover:scale-105 transition-transform">
                                S
                            </span>
                            <span className="font-semibold text-lg tracking-tight text-stone-900">
                                Sellify<span className="text-yellow-600">.me</span>
                            </span>
                        </Link>

                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Escrow Protégé</span>
                        </div>
                    </div>

                    {/* Form Intro */}
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                            Connexion à votre espace
                        </h1>
                        <p className="text-xs text-stone-500 font-normal leading-relaxed">
                            Accédez à vos boutiques, vos commandes et vos fonds sous séquestre.
                        </p>
                    </div>

                    {/* Quick Social Google Login */}
                    <div>
                        <button
                            type="button"
                            onClick={() => alert("Connexion Google OAuth en cours...")}
                            className="w-full py-2.5 px-4 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Continuer avec Google</span>
                        </button>
                    </div>

                    {/* Separator */}
                    <div className="relative flex py-0.5 items-center">
                        <div className="flex-grow border-t border-stone-200"></div>
                        <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium uppercase tracking-wider">Ou avec vos identifiants</span>
                        <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    {/* Form Inputs */}
                    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-stone-800 block">Adresse Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nom@exemple.com"
                                    className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 text-xs transition-all shadow-2xs"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="font-medium text-stone-800">Mot de passe</label>
                                <Link href={route('password.request')} className="text-[11px] text-yellow-700 hover:text-yellow-800 hover:underline font-medium">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Lock className="w-3.5 h-3.5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 text-xs transition-all shadow-2xs"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-rose-600 text-[11px] mt-0.5">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                            <label className="flex items-center space-x-2 cursor-pointer select-none">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-3.5 w-3.5 text-yellow-500 focus:ring-yellow-400 border-stone-300 rounded cursor-pointer"
                                />
                                <span className="text-xs text-stone-600 font-normal">
                                    Se souvenir de moi
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? (
                                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-stone-950 border-t-transparent"></span>
                            ) : (
                                <>
                                    <span>Se connecter</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-normal">
                        <span>Nouveau sur Sellify ?</span>
                        <Link href={route('register')} className="text-yellow-700 hover:text-yellow-800 font-semibold hover:underline">
                            Créer un compte &rarr;
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN: VISUAL SHOWCASE */}
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-amber-50/80 to-yellow-50/80 border-l border-amber-100 p-6 sm:p-8 flex-col justify-between items-center text-center">
                    
                    {/* Top Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200/80 text-[11px] font-medium text-stone-800 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-yellow-600" />
                        <span>Plateforme Panafricaine</span>
                    </div>

                    {/* Image with subtle float */}
                    <div className="relative my-auto py-2 w-full max-w-[280px]">
                        <div className="rounded-2xl overflow-hidden border border-amber-200/70 shadow-md bg-white">
                            <img
                                src="/images/login-illustration.jpg"
                                alt="Sellify Sécurité Escrow"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Floating Escrow Badge */}
                        <div className="absolute -bottom-2 -left-2 bg-white/95 backdrop-blur-md border border-stone-200 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-left animate-float">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-stone-900">Escrow 100%</p>
                                <p className="text-[9px] text-stone-500">Paiement garanti</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Features */}
                    <div className="space-y-1 pt-2 max-w-[260px]">
                        <h3 className="text-xs font-semibold text-stone-900">
                            Vendez, achetez et livrez
                        </h3>
                        <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                            Boutiques SaaS, Smart-Links WhatsApp et retraits instantanés par Mobile Money.
                        </p>
                    </div>

                </div>

            </div>

            {/* Bottom Copyright */}
            <div className="absolute bottom-3 text-center text-[11px] text-stone-500/80 font-normal z-10">
                &copy; {new Date().getFullYear()} Sellify.me • Marketplace et Séquestre Panafricain
            </div>
        </div>
    );
}
