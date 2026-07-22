import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';

export default function SubscriptionIndex({ packs, currentPack, currentSubscription }) {
    const { post, processing } = useForm();

    const handleUpgrade = (packName) => {
        post('/seller/subscription/upgrade', {
            data: { pack: packName },
        });
    };

    return (
        <SellerCentralLayout header="Gestion des Abonnements SaaS Vendeur">
            <Head title="Abonnements SaaS - Seller Central" />

            <div className="space-y-8">
                {/* Active Sub Banner */}
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-400/30">
                            Abonnement Actuel
                        </span>
                        <h2 className="text-2xl font-black mt-2 capitalize">Pack {currentPack}</h2>
                        <p className="text-sm text-indigo-200 mt-1">
                            {currentSubscription?.expires_at
                                ? `Renouvellement automatique le ${new Date(currentSubscription.expires_at).toLocaleDateString('fr-FR')}`
                                : 'Pack actif sans engagement.'}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-center">
                        <span className="text-xs text-indigo-200 block">Commission Ventes</span>
                        <span className="text-xl font-bold">
                            {currentPack === 'business' ? '5% – 7%' : currentPack === 'pro' ? '8% – 11%' : '12% – 15%'}
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packs.map(pack => {
                        const isCurrent = pack.name === currentPack;
                        return (
                            <div
                                key={pack.id}
                                className={`bg-white rounded-2xl p-6 shadow-sm border transition flex flex-col justify-between ${
                                    isCurrent ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-gray-200 hover:shadow-md'
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-gray-900">{pack.display_name}</h3>
                                        {isCurrent && (
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                Actif
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 mb-6">
                                        <span className="text-3xl font-black text-gray-900">
                                            {pack.monthly_price === 0 ? 'Gratuit' : `${numberFormat(pack.monthly_price)} FCFA`}
                                        </span>
                                        {pack.monthly_price > 0 && <span className="text-xs text-gray-500"> / mois</span>}
                                    </div>

                                    <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                        {pack.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className="text-green-500 font-bold">✓</span>
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleUpgrade(pack.name)}
                                        disabled={isCurrent || processing}
                                        className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition shadow-sm ${
                                            isCurrent
                                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                    >
                                        {isCurrent ? 'Pack Actuel' : 'Choisir ce Pack'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </SellerCentralLayout>
    );
}

function numberFormat(val) {
    return new Intl.NumberFormat('fr-FR').format(val);
}
