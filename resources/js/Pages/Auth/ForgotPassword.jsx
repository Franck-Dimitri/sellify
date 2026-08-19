import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';

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
            <Head title="Mot de passe oublié" />

            <div className="max-w-md w-full mx-auto space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="w-9 h-9 rounded-lg bg-yellow-500 flex items-center justify-center font-bold text-stone-950 shadow-xs">S</span>
                        <span className="font-bold text-xl tracking-tight text-stone-900">
                            Sellify<span className="text-yellow-600">.me</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-1">
                        <Link href="/login" className="inline-flex items-center text-xs font-medium text-stone-500 hover:text-stone-800 mb-1">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                            Retour à la connexion
                        </Link>
                        <h1 className="text-xl font-semibold text-stone-900">Réinitialisation de mot de passe</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Saisissez votre adresse email pour recevoir les instructions de réinitialisation.
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
                            {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <span>Envoyer le lien de réinitialisation</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
