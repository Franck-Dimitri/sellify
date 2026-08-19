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
                <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-semibold text-stone-900">Connexion à votre compte</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Accédez à votre espace sécurisé avec vos identifiants.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-stone-700 block">Adresse Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="votre.email@exemple.com"
                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
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
                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
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
                                Se souvenir de moi
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <span>Se connecter</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </form>

                    <div className="text-center text-xs text-stone-500 pt-4 border-t border-stone-100">
                        Nouveau sur Sellify ?{' '}
                        <Link href={route('register')} className="text-yellow-700 hover:underline font-medium">
                            Créer un compte
                        </Link>
                    </div>
                </div>

                <div className="text-center text-[11px] text-stone-400">
                    Paiements Escrow Sécurisés • MTN MoMo & Orange Money
                </div>
            </div>
        </div>
    );
}
