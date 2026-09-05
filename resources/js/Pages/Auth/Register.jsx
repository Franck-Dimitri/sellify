import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerForm from './Register/CustomerForm';
import SellerForm from './Register/SellerForm';
import DriverForm from './Register/DriverForm';
import { 
    ShoppingBag, 
    Users, 
    Truck, 
    ArrowLeft, 
    ShieldCheck, 
    Zap, 
    Sparkles, 
    CheckCircle2, 
    ArrowRight,
    Store
} from 'lucide-react';

export default function Register() {
    const [role, setRole] = useState(null); // 'customer', 'seller', 'driver'

    return (
        <div className="min-h-screen bg-stone-50 text-stone-700 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
            <Head title="Créer un compte sécurisé - Sellify.me" />

            {/* Top Brand Navigation */}
            <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
                <Link href="/" className="inline-flex items-center space-x-2 group">
                    <span className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-bold text-stone-900 shadow-xs group-hover:scale-105 transition-transform">
                        S
                    </span>
                    <span className="font-semibold text-xl tracking-tight text-stone-900">
                        Sellify<span className="text-yellow-600">.me</span>
                    </span>
                </Link>

                <div className="text-xs text-stone-500">
                    Déjà un compte ?{' '}
                    <Link href={route('login')} className="font-semibold text-yellow-700 hover:text-yellow-800 hover:underline">
                        Se connecter
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl w-full mx-auto my-6 space-y-6">
                
                {/* Header title */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    {role && (
                        <button
                            onClick={() => setRole(null)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:border-stone-300 px-3 py-1.5 rounded-full transition-all shadow-2xs cursor-pointer mb-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Changer de rôle</span>
                        </button>
                    )}

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                        <span>Inscription Rapide & Sécurisée</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
                        {!role && "Rejoignez la marketplace sécurisée"}
                        {role === 'customer' && "Créer un compte Acheteur"}
                        {role === 'seller' && "Ouvrir votre Espace Vendeur"}
                        {role === 'driver' && "Devenir Livreur Partenaire"}
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed">
                        {!role 
                            ? "Choisissez votre profil pour découvrir les outils adaptés à votre activité."
                            : "Renseignez vos informations pour finaliser votre inscription."
                        }
                    </p>
                </div>

                {/* ROLE SELECTION SCREEN */}
                {!role ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto">
                        
                        {/* ROLE 1: ACHETEUR */}
                        <div 
                            onClick={() => setRole('customer')}
                            className="group bg-white border border-stone-200 hover:border-yellow-400 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-yellow-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-yellow-400 group-hover:text-stone-900 transition-all">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                        Acheteur
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-base font-semibold text-stone-900 group-hover:text-yellow-700 transition-colors">
                                        Acheteur Particulier
                                    </h2>
                                    <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                        Achetez sur les boutiques et les Smart-Links WhatsApp en toute sécurité.
                                    </p>
                                </div>

                                <ul className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600 font-normal">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Garantie Séquestre Escrow</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Suivi du colis en temps réel</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Paiement OM, MoMo ou Wave</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6">
                                <div className="w-full py-2.5 px-4 bg-stone-50 group-hover:bg-yellow-400 text-stone-700 group-hover:text-stone-950 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-stone-200 group-hover:border-yellow-400">
                                    <span>Choisir ce profil</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* ROLE 2: VENDEUR */}
                        <div 
                            onClick={() => setRole('seller')}
                            className="group bg-white border-2 border-yellow-400 hover:border-yellow-500 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-stone-900 font-semibold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-2xs">
                                Recommandé
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-yellow-700 border border-amber-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-yellow-400 group-hover:text-stone-900 transition-all">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900">
                                        Commerce
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-base font-semibold text-stone-900 group-hover:text-yellow-700 transition-colors">
                                        Vendeur Professionnel
                                    </h2>
                                    <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                        Créez vos boutiques en ligne et encaissez via Smart-Links WhatsApp.
                                    </p>
                                </div>

                                <ul className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600 font-normal">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Multi-boutiques (jusqu'à 3)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Générateur Smart-Links instantanés</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Retraits rapides & Micro-crédits</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6">
                                <div className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs">
                                    <span>Ouvrir ma boutique</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* ROLE 3: LIVREUR */}
                        <div 
                            onClick={() => setRole('driver')}
                            className="group bg-white border border-stone-200 hover:border-yellow-400 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-yellow-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-yellow-400 group-hover:text-stone-900 transition-all">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                        Logistique
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-base font-semibold text-stone-900 group-hover:text-yellow-700 transition-colors">
                                        Livreur Partenaire
                                    </h2>
                                    <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                        Recevez des courses optimisées par l'IA et encaissez vos gains quotidiens.
                                    </p>
                                </div>

                                <ul className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600 font-normal">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Courses géolocalisées intelligentes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Itinéraires optimisés par IA</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Paiements journaliers garantis</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6">
                                <div className="w-full py-2.5 px-4 bg-stone-50 group-hover:bg-yellow-400 text-stone-700 group-hover:text-stone-950 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-stone-200 group-hover:border-yellow-400">
                                    <span>Rejoindre la flotte</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* RENDER SPECIFIC ROLE FORM */
                    <div className="pt-2">
                        {role === 'customer' && <CustomerForm />}
                        {role === 'seller' && <SellerForm />}
                        {role === 'driver' && <DriverForm />}
                    </div>
                )}
            </div>

            {/* Bottom Footer */}
            <div className="max-w-6xl w-full mx-auto text-center text-[11px] text-stone-400 pt-6 border-t border-stone-200 font-normal">
                &copy; {new Date().getFullYear()} Sellify.me • Marketplace et Logistique Sécurisée
            </div>
        </div>
    );
}
