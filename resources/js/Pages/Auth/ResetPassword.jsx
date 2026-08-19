import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, ArrowRight } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
            <Head title="Réinitialiser le mot de passe" />

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
                        <h1 className="text-xl font-semibold text-stone-900">Nouveau Mot de Passe</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Définissez votre nouveau mot de passe sécurisé.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <input type="hidden" name="token" value={data.token} />

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Adresse Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                            {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                            {errors.password && <p className="text-rose-600 text-[11px] mt-0.5">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="font-medium text-stone-700 block mb-1">Confirmer nouveau mot de passe</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <span>Enregistrer le mot de passe</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
