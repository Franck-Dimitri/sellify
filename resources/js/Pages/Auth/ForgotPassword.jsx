import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
            <Head title="Mot de passe oublié - Sellify.me" />

            <div className="max-w-md w-full mx-auto space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2.5 group">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-black text-stone-950 shadow-md group-hover:scale-105 transition-transform">
                            S
                        </span>
                        <span className="font-extrabold text-2xl tracking-tight text-stone-900">
                            Sellify<span className="text-yellow-600">.me</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-1.5">
                        <Link href={route('login')} className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-stone-800 mb-1 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                            <span>Retour à la connexion</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-stone-900">Mot de passe oublié ?</h1>
                        <p className="text-xs text-stone-500 font-normal leading-relaxed">
                            Saisissez votre adresse email pour recevoir un lien de réinitialisation sécurisé.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-stone-700 block">Adresse Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="votre.email@exemple.com"
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-all shadow-2xs"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {processing ? (
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-stone-950 border-t-transparent"></span>
                            ) : (
                                <>
                                    <span>Envoyer le lien de réinitialisation</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lien sécurisé crypté à usage unique</span>
                </div>
            </div>
        </div>
    );
}
