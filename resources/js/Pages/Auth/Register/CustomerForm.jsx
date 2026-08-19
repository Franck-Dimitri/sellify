import React from 'react';
import { useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CustomerForm() {
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
        <div className="bg-white p-6 sm:p-8 border border-stone-200 rounded-xl shadow-xs space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="font-medium text-stone-700 block mb-1">Prénom</label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder="Ex: Jean"
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
                            placeholder="Ex: Dupont"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                            required
                        />
                        {errors.last_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.last_name}</p>}
                    </div>
                </div>

                <div>
                    <label className="font-medium text-stone-700 block mb-1">Adresse Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="jean.dupont@exemple.com"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                        required
                    />
                    {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
                </div>

                <div>
                    <label className="font-medium text-stone-700 block mb-1">Numéro de Téléphone (Mobile Money)</label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="+237 6XX XX XX XX"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                        required
                    />
                    {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="font-medium text-stone-700 block mb-1">Mot de passe</label>
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
                        <label className="font-medium text-stone-700 block mb-1">Confirmer mot de passe</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                        <span>Créer mon compte Client</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
