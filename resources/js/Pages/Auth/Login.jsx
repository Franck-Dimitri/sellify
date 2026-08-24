import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
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
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
            <Head title="Connexion" />

            <div className="max-w-md w-full mx-auto space-y-6">
                {/* Brand Logo */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="w-9 h-9 rounded-lg bg-yellow-500 flex items-center justify-center font-bold text-stone-950 shadow-xs">S</span>
                        <span className="font-bold text-xl tracking-tight text-stone-900">
                            Sellify<span className="text-yellow-600">.me</span>
                        </span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-bold text-stone-900">Connexion à votre compte</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Accédez à votre espace sécurisé avec vos identifiants.
                        </p>
                    </div>

                    {/* OAuth 2.0 Social Buttons (Sub-Module 2.1.1) */}
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => alert("Connexion Google OAuth 2.0 en cours d'initialisation...")}
                            className="w-full py-2.5 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2.5 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Continuer avec Google</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => alert("Connexion Facebook OAuth 2.0...")}
                                className="py-2.5 px-3 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span>Facebook</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => alert("Connexion Apple ID...")}
                                className="py-2.5 px-3 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors"
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
                        <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium">Ou avec votre adresse email</span>
                        <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-stone-700 block">Adresse Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="votre.email@exemple.com"
                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                            {errors.email && <p className="text-rose-600 text-[11px]">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="font-medium text-stone-700">Mot de passe</label>
                                <Link href={route('password.request')} className="text-[11px] text-yellow-700 hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                            {errors.password && <p className="text-rose-600 text-[11px]">{errors.password}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-stone-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-2 block text-xs text-stone-600 cursor-pointer font-normal">
                                Se souvenir de moi sur cet appareil
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <span>Se connecter à mon compte</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center text-xs text-stone-500 pt-4 border-t border-stone-100">
                        Nouveau sur Sellify ?{' '}
                        <Link href={route('register')} className="text-yellow-700 hover:underline font-bold">
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
