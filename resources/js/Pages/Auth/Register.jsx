import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerForm from './Register/CustomerForm';
import SellerForm from './Register/SellerForm';
import DriverForm from './Register/DriverForm';
import { ShoppingBag, Users, Truck, ArrowLeft } from 'lucide-react';

export default function Register() {
    const [role, setRole] = useState(null); // 'customer', 'seller', 'driver'

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
            <Head title="Créer un compte - Sellify" />

            <div className="max-w-3xl w-full mx-auto space-y-6">
                
                {/* Brand Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="w-9 h-9 rounded-lg bg-yellow-500 flex items-center justify-center font-bold text-stone-950 shadow-xs">S</span>
                        <span className="font-bold text-xl tracking-tight text-stone-900">
                            Sellify<span className="text-yellow-600">.me</span>
                        </span>
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center space-y-1">
                        {role && (
                            <button
                                onClick={() => setRole(null)}
                                className="inline-flex items-center text-xs font-medium text-stone-500 hover:text-stone-800 mb-1 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                <span>Changer de type de compte</span>
                            </button>
                        )}
                        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">
                            {role === 'customer' && 'Créer un compte Client (Acheteur)'}
                            {role === 'seller' && 'Créer un compte Vendeur Professionnel'}
                            {role === 'driver' && 'Devenir Livreur Partenaire'}
                            {!role && 'Rejoindre la plateforme Sellify.me'}
                        </h1>
                        <p className="text-xs text-stone-500 font-normal max-w-md mx-auto">
                            {!role 
                                ? 'Choisissez votre profil pour démarrer en toute sécurité.'
                                : 'Renseignez vos coordonnées pour finaliser votre inscription.'
                            }
                        </p>
                    </div>

                    {/* Step 1: Role Selection Cards */}
                    {!role ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {/* Card 1: Customer */}
                            <div 
                                onClick={() => setRole('customer')}
                                className="cursor-pointer text-center space-y-3 p-6 flex flex-col justify-between items-center bg-white border border-stone-200 hover:border-yellow-500 rounded-xl transition-all shadow-xs group"
                            >
                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg group-hover:scale-105 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="font-semibold text-sm text-stone-900">Acheteur</h2>
                                    <p className="text-xs text-stone-500 leading-relaxed font-normal">
                                        Achetez en toute confiance avec garantie séquestre Escrow.
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-yellow-700 group-hover:underline">Démarrer &rarr;</span>
                            </div>

                            {/* Card 2: Seller */}
                            <div 
                                onClick={() => setRole('seller')}
                                className="cursor-pointer text-center space-y-3 p-6 flex flex-col justify-between items-center bg-white border border-stone-200 hover:border-yellow-500 rounded-xl transition-all shadow-xs group"
                            >
                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg group-hover:scale-105 transition-transform">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="font-semibold text-sm text-stone-900">Vendeur</h2>
                                    <p className="text-xs text-stone-500 leading-relaxed font-normal">
                                        Créez vos boutiques, vendez avec Smart-Links et accédez aux micro-prêts.
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-yellow-700 group-hover:underline">Créer ma boutique &rarr;</span>
                            </div>

                            {/* Card 3: Driver */}
                            <div 
                                onClick={() => setRole('driver')}
                                className="cursor-pointer text-center space-y-3 p-6 flex flex-col justify-between items-center bg-white border border-stone-200 hover:border-yellow-500 rounded-xl transition-all shadow-xs group"
                            >
                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg group-hover:scale-105 transition-transform">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="font-semibold text-sm text-stone-900">Livreur</h2>
                                    <p className="text-xs text-stone-500 leading-relaxed font-normal">
                                        Recevez des livraisons géolocalisées avec optimisation des trajets.
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-yellow-700 group-hover:underline">Rejoindre la flotte &rarr;</span>
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Render specific form */
                        <div className="max-w-xl mx-auto">
                            {role === 'customer' && <CustomerForm />}
                            {role === 'seller' && <SellerForm />}
                            {role === 'driver' && <DriverForm />}
                        </div>
                    )}

                    {!role && (
                        <div className="text-center text-xs text-stone-500 pt-4 max-w-md mx-auto border-t border-stone-200">
                            Vous possédez déjà un compte ?{' '}
                            <Link href={route('login')} className="text-yellow-700 hover:underline font-medium">
                                Connectez-vous
                            </Link>
                        </div>
                    )}
                </div>

                <div className="text-center text-[11px] text-stone-400">
                    &copy; {new Date().getFullYear()} Sellify.me • Marketplace Sécurisée Panafricaine
                </div>
            </div>
        </div>
    );
}
