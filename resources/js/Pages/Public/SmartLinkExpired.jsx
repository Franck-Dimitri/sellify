import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function SmartLinkExpired() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center font-sans">
            <Head title="Lien Expiré - Sellify.me" />
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-4 border border-gray-100">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                    ⏰
                </div>
                <h1 className="text-2xl font-black text-gray-900">Smart-Link Expiré ou Invalide</h1>
                <p className="text-sm text-gray-600">
                    Ce lien de paiement a expiré ou n'est plus disponible. Veuillez contacter le vendeur pour obtenir un nouveau lien de commande.
                </p>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-block bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
                    >
                        Retourner au Catalogue Sellify.me
                    </Link>
                </div>
            </div>
        </div>
    );
}
