import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { Card } from '../../Components/ui/Card';
import CustomerForm from './Register/CustomerForm';
import SellerForm from './Register/SellerForm';
import DriverForm from './Register/DriverForm';
import { ShoppingBag, Users, Truck, ArrowLeft } from 'lucide-react';

export default function Register() {
    const [role, setRole] = useState(null); // 'customer', 'seller', 'driver'

    return (
        <>
            <Head title="Créer un compte" />

            <div className="min-h-screen bg-surface-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="max-w-4xl w-full mx-auto text-center mb-4">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center font-extrabold text-surface-950 shadow-sm">S</span>
                        <span className="font-extrabold text-xl tracking-tight text-surface-900">
                            Sellify<span className="text-primary-600">.me</span>
                        </span>
                    </Link>
                </div>

                <div className="max-w-4xl w-full mx-auto flex-grow flex items-center justify-center">
                    <div className="w-full space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            {role && (
                                <button
                                    onClick={() => setRole(null)}
                                    className="inline-flex items-center text-xs font-bold text-surface-400 hover:text-surface-600 mb-2 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                    Retour aux options
                                </button>
                            )}
                            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">
                                {role === 'customer' && 'Créer un compte Client'}
                                {role === 'seller' && 'Créer un compte Vendeur'}
                                {role === 'driver' && 'Créer un compte Livreur'}
                                {!role && 'Rejoindre Sellify.me'}
                            </h2>
                            <p className="text-sm text-surface-500 font-medium max-w-md mx-auto leading-relaxed">
                                {!role 
                                    ? 'Sélectionnez le type de compte que vous souhaitez créer pour commencer.'
                                    : 'Veuillez remplir les informations requises pour créer votre compte.'
                                }
                            </p>
                        </div>

                        {/* Step 1: Role Selection Cards */}
                        {!role ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
                                {/* Card 1: Customer */}
                                <Card 
                                    hoverable 
                                    onClick={() => setRole('customer')}
                                    className="cursor-pointer text-center space-y-4 p-8 flex flex-col justify-between items-center group border border-surface-200"
                                >
                                    <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl group-hover:scale-105 transition-transform duration-200">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-lg text-surface-900">Acheteur</h3>
                                        <p className="text-xs text-surface-400 leading-relaxed">
                                            Acheter des produits sécurisés via paiement Escrow.
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-primary-600 group-hover:text-primary-700">Démarrer &rarr;</span>
                                </Card>

                                {/* Card 2: Seller */}
                                <Card 
                                    hoverable 
                                    onClick={() => setRole('seller')}
                                    className="cursor-pointer text-center space-y-4 p-8 flex flex-col justify-between items-center group border border-surface-200"
                                >
                                    <div className="p-4 bg-secondary-50 text-secondary-600 rounded-2xl group-hover:scale-105 transition-transform duration-200">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-lg text-surface-900">Vendeur</h3>
                                        <p className="text-xs text-surface-400 leading-relaxed">
                                            Créer des boutiques et vendre des produits avec Smart-Links.
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-secondary-600 group-hover:text-secondary-700">Créer ma boutique &rarr;</span>
                                </Card>

                                {/* Card 3: Driver */}
                                <Card 
                                    hoverable 
                                    onClick={() => setRole('driver')}
                                    className="cursor-pointer text-center space-y-4 p-8 flex flex-col justify-between items-center group border border-surface-200"
                                >
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-105 transition-transform duration-200">
                                        <Truck className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-lg text-surface-900">Livreur</h3>
                                        <p className="text-xs text-surface-400 leading-relaxed">
                                            Livrer des commandes et optimiser vos trajets par IA.
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700">Rejoindre la flotte &rarr;</span>
                                </Card>
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
                            <div className="text-center text-sm font-semibold text-surface-500 pt-4 max-w-md mx-auto border-t border-surface-100">
                                Vous possédez déjà un compte ?{' '}
                               <Link href={route('login')} className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Connectez-vous
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Simple Footer */}
                <div className="text-center text-xs text-surface-400 mt-8">
                    &copy; {new Date().getFullYear()} Sellify.me. Tous droits réservés.
                </div>
            </div>
        </>
    );
}
