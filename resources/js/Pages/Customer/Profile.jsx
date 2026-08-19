import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { User, Phone, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Profile({ user }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.profile.update'));
    };

    return (
        <CustomerLayout title="Mon Profil Client">
            <Head title="Mon Profil - Espace Client" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16 max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-yellow-700 uppercase tracking-wide">
                            <User className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Paramètres & Coordonnées</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900 mt-1">
                            Mon Compte Acheteur
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez vos coordonnées de livraison et vos numéros de paiement Mobile Money.
                        </p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5">
                    {recentlySuccessful && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Vos modifications ont été enregistrées avec succès.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Prénom</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.first_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.last_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Adresse Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-stone-400 mt-0.5">L'adresse email est liée à vos transactions Escrow.</p>
                            </div>

                            <div>
                                <label className="font-medium text-stone-700 block mb-1">Numéro de Téléphone (Mobile Money)</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 space-y-3">
                            <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-stone-400" />
                                <span>Changer de mot de passe (optionnel)</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    />
                                    {errors.password && <p className="text-rose-600 text-[11px] mt-0.5">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Confirmer mot de passe</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg transition-colors shadow-xs"
                            >
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </CustomerLayout>
    );
}
