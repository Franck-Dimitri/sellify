import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { 
    ShieldCheck, 
    Zap, 
    Store, 
    TrendingUp, 
    Navigation, 
    Search,
    ArrowRight, 
    ShoppingBag, 
    Truck, 
    Lock, 
    Sparkles, 
    CheckCircle2, 
    ArrowUpRight, 
    DollarSign, 
    PackageCheck,
    CreditCard,
    Smartphone,
    Shirt,
    Home as HomeIcon,
    Car,
    Award,
    BadgeCheck,
    Flame,
    MapPin,
    Tag
} from 'lucide-react';

export default function Welcome({ 
    featuredDeals = [], 
    topShops = [], 
    categories = [] 
}) {
    const [activePersona, setActivePersona] = useState('sellers'); // 'sellers' | 'buyers' | 'drivers'
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('public.products.index'), { search: searchQuery });
        } else {
            router.get(route('public.products.index'));
        }
    };

    const categoryList = [
        { id: 'tech', name: 'High-Tech & Téléphones', icon: Smartphone, count: '1 240+ articles' },
        { id: 'fashion', name: 'Mode & Bazin Africain', icon: Shirt, count: '880+ articles' },
        { id: 'home', name: 'Maison & Électroménager', icon: HomeIcon, count: '540+ articles' },
        { id: 'beauty', name: 'Beauté & Soins Bio', icon: Sparkles, count: '420+ articles' },
        { id: 'auto', name: 'Auto, Moto & Pièces', icon: Car, count: '310+ articles' },
        { id: 'food', name: 'Épicerie & Produits Locaux', icon: ShoppingBag, count: '290+ articles' },
    ];

    return (
        <PublicLayout>
            <Head title="Sellify.me - La Première Marketplace & Logistique Sécurisée d'Afrique" />

            <div className="bg-[#fcfbf9] text-stone-700 antialiased font-sans">
                
                {/* 1. HERO SECTION WITH DIRECT MARKETPLACE SEARCH */}
                <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 pattern-grid-amber border-b border-stone-200/80">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-200/30 rounded-full blur-3xl opacity-70 pointer-events-none animate-pulse-glow"></div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-7">
                        
                        {/* Escrow Status Pill */}
                        <div className="inline-flex items-center gap-2 bg-white border border-amber-200/90 shadow-2xs px-4 py-1.5 rounded-full text-xs font-medium text-stone-800 animate-float">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Garantie Séquestre Mobile Money • 0% Risque d'Arnaque</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.18]">
                            Achetez, Vendez et Livrez <br />
                            <span className="text-yellow-600">partout en Afrique</span> en toute sécurité.
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xs sm:text-sm md:text-base text-stone-500 max-w-2xl mx-auto leading-relaxed font-normal">
                            Connectez vos boutiques, encaissez par Orange Money, MTN MoMo et Wave sous séquestre Escrow, et recevez vos colis suivis par GPS.
                        </p>

                        {/* HERO DIRECT PRODUCT SEARCH BAR */}
                        <div className="max-w-2xl mx-auto pt-2">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border-2 border-yellow-400 focus-within:border-yellow-500 rounded-2xl shadow-lg p-1.5 pl-4 transition-all">
                                <Search className="w-5 h-5 text-stone-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit, une boutique, une ville (ex: iPhone, Bazin, Douala)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-none text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:ring-0 outline-none px-3 font-normal"
                                />
                                <button
                                    type="submit"
                                    className="px-5 sm:px-7 py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                                >
                                    <span>Explorer le Store</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        {/* Quick category badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-stone-500 font-normal">
                            <span className="text-[11px] text-stone-400">Populaire :</span>
                            {['Smartphones 4K', 'Bazin Brodé', 'Chaussures Cuir', 'Télévisions', 'Mèches & Beauté'].map((tag, idx) => (
                                <Link 
                                    key={idx} 
                                    href={route('public.products.index', { search: tag })}
                                    className="px-2.5 py-1 bg-white hover:bg-yellow-50 hover:text-yellow-800 border border-stone-200 rounded-full text-[11px] text-stone-600 transition-colors shadow-2xs"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>

                    </div>
                </section>

                {/* 2. DEDICATED 3D VISUAL SHOWCASE */}
                <section className="relative bg-white py-12 border-b border-stone-200/80">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-[#fbf9f5]">
                            <img
                                src="/images/landing-hero.jpg"
                                alt="Plateforme E-Commerce Sellify"
                                className="w-full h-auto object-cover"
                            />

                            {/* Floating Escrow Badge */}
                            <div className="hidden sm:flex absolute top-6 left-6 bg-white/95 backdrop-blur-md border border-stone-200 p-3 rounded-2xl shadow-lg items-center gap-3 animate-float">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-stone-900">Paiement Séquestre</p>
                                    <p className="text-[11px] text-stone-500 font-normal">Débloqué uniquement après livraison</p>
                                </div>
                            </div>

                            {/* Floating Smart-Links Badge */}
                            <div className="hidden sm:flex absolute bottom-6 right-6 bg-white/95 backdrop-blur-md border border-stone-200 p-3 rounded-2xl shadow-lg items-center gap-3 animate-float-reverse">
                                <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center border border-yellow-200">
                                    <Zap className="w-4 h-4 fill-current" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-stone-900">Smart-Links WhatsApp</p>
                                    <p className="text-[11px] text-stone-500 font-normal">Commandes et encaissements en 1 clic</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 3. CATEGORIES HUB (DIRECT ACCESS TO /STORE) */}
                <section className="py-16 bg-[#fcfbf9] border-b border-stone-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                                    <Tag className="w-3.5 h-3.5 text-yellow-600" />
                                    <span>Rayons du Store</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                                    Explorer par Catégorie
                                </h2>
                                <p className="text-xs sm:text-sm text-stone-500 font-normal">
                                    Accédez aux milliers de références certifiées disponibles à la livraison.
                                </p>
                            </div>

                            <Link href={route('public.products.index')}>
                                <button className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                                    <span>Voir tout le catalogue</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </Link>
                        </div>

                        {/* Category Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categoryList.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={route('public.products.index', { category: cat.id })}
                                        className="group bg-white border border-stone-200 hover:border-yellow-400 p-4 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer hover:-translate-y-0.5"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-yellow-400 text-yellow-700 group-hover:text-stone-950 border border-amber-100 flex items-center justify-center transition-all">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xs text-stone-900 group-hover:text-yellow-700 transition-colors">
                                                {cat.name}
                                            </h3>
                                            <p className="text-[11px] text-stone-400 font-normal mt-0.5">
                                                {cat.count}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                    </div>
                </section>

                {/* 4. PERSONA SECTION WITH DEDICATED ILLUSTRATIONS */}
                <section className="py-20 bg-white border-b border-stone-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        
                        <div className="text-center space-y-2 max-w-2xl mx-auto">
                            <span className="text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                Écosystème Unifié
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                                Des outils conçus pour chaque acteur
                            </h2>
                            <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                                Découvrez les fonctionnalités développées sur-mesure pour vendeurs, acheteurs et livreurs.
                            </p>
                        </div>

                        {/* Persona Tabs */}
                        <div className="flex justify-center">
                            <div className="bg-stone-100 p-1.5 rounded-2xl flex gap-1.5 border border-stone-200">
                                <button
                                    onClick={() => setActivePersona('sellers')}
                                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                                        activePersona === 'sellers'
                                            ? 'bg-yellow-400 text-stone-950 shadow-2xs'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    <Store className="w-4 h-4" />
                                    <span>Pour les Vendeurs</span>
                                </button>

                                <button
                                    onClick={() => setActivePersona('buyers')}
                                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                                        activePersona === 'buyers'
                                            ? 'bg-yellow-400 text-stone-950 shadow-2xs'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Pour les Acheteurs</span>
                                </button>

                                <button
                                    onClick={() => setActivePersona('drivers')}
                                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                                        activePersona === 'drivers'
                                            ? 'bg-yellow-400 text-stone-950 shadow-2xs'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    <Truck className="w-4 h-4" />
                                    <span>Pour les Livreurs</span>
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Persona Content */}
                        <div className="pt-2">
                            
                            {/* SELLERS */}
                            {activePersona === 'sellers' && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                                    <div className="lg:col-span-6 space-y-5 text-left">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                                            <Zap className="w-3.5 h-3.5 text-yellow-600" />
                                            <span>Multipliez vos ventes en ligne</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-stone-900">
                                            Boutiques en ligne & Smart-Links WhatsApp
                                        </h3>
                                        <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                                            Créez votre catalogue, partagez des liens de commande instantanés sur vos statuts WhatsApp, TikTok et Instagram, et recevez vos fonds par séquestre Escrow sans litige d'impayé.
                                        </p>
                                        <div className="space-y-2.5 text-xs text-stone-600 font-normal">
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Multi-boutiques (jusqu'à 3 boutiques distinctes)</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Smart-Links de paiement instantanés en 1 clic</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Retraits automatiques vers Orange Money & MTN MoMo</span>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Link href={route('register')}>
                                                <button className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer">
                                                    <span>Ouvrir ma boutique Vendeur</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-6">
                                        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                                            <img
                                                src="/images/seller-step1.jpg"
                                                alt="Espace Vendeur Sellify"
                                                className="w-full h-72 sm:h-80 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* BUYERS */}
                            {activePersona === 'buyers' && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                                    <div className="lg:col-span-6 space-y-5 text-left">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Garantie Zéro Risque</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-stone-900">
                                            Achetez en toute confiance avec l'Escrow
                                        </h3>
                                        <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                                            Votre argent reste verrouillé sur le compte séquestre de Sellify. Le commerçant n'est payé que lorsque vous avez vérifié et validé votre colis lors de la livraison.
                                        </p>
                                        <div className="space-y-2.5 text-xs text-stone-600 font-normal">
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Remboursement garanti si l'article est non conforme</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Suivi en direct du livreur par géolocalisation GPS</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Code secret OTP pour sécuriser la remise du colis</span>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Link href={route('public.products.index')}>
                                                <button className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer">
                                                    <span>Commencer mes achats</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-6">
                                        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                                            <img
                                                src="/images/buyer-onboarding.jpg"
                                                alt="Espace Acheteur Sellify"
                                                className="w-full h-72 sm:h-80 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DRIVERS */}
                            {activePersona === 'drivers' && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                                    <div className="lg:col-span-6 space-y-5 text-left">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-medium">
                                            <Truck className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Flotte Logistique Partenaire</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-stone-900">
                                            Tournées intelligentes & gains quotidiens
                                        </h3>
                                        <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                                            Recevez automatiquement les propositions de courses les plus proches de vous et encaissez vos revenus journaliers directement sur votre compte Mobile Money.
                                        </p>
                                        <div className="space-y-2.5 text-xs text-stone-600 font-normal">
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Attribution des courses optimisée par IA</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Itinéraires GPS et réduction des kilomètres à vide</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Versement automatique après chaque remise validée</span>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Link href={route('register')}>
                                                <button className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer">
                                                    <span>Rejoindre la flotte Livreur</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-6">
                                        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                                            <img
                                                src="/images/driver-step2.jpg"
                                                alt="Espace Livreur Sellify"
                                                className="w-full h-72 sm:h-80 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </section>

                {/* 5. ESCROW FLOW (LIGHT & TRANSPARENT) */}
                <section className="py-20 bg-[#fcfbf9] border-b border-stone-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        
                        <div className="text-center space-y-2 max-w-2xl mx-auto">
                            <span className="text-xs font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                Protocole de Sécurité
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                                Comment fonctionne le séquestre Escrow ?
                            </h2>
                            <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                                Un mécanisme transparent en 4 temps pour protéger votre argent.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
                            <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3 hover:border-yellow-400 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-yellow-700 border border-amber-200 font-semibold text-xs flex items-center justify-center">
                                    01
                                </div>
                                <h3 className="font-semibold text-sm text-stone-900">Commande Smart-Link</h3>
                                <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                    L'acheteur commande depuis la boutique ou le Smart-Link et paie par Mobile Money.
                                </p>
                            </div>

                            <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3 hover:border-yellow-400 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-yellow-700 border border-amber-200 font-semibold text-xs flex items-center justify-center">
                                    02
                                </div>
                                <h3 className="font-semibold text-sm text-stone-900">Verrouillage Escrow</h3>
                                <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                    Les fonds sont bloqués sur le compte séquestre sécurisé de Sellify.
                                </p>
                            </div>

                            <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3 hover:border-yellow-400 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-yellow-700 border border-amber-200 font-semibold text-xs flex items-center justify-center">
                                    03
                                </div>
                                <h3 className="font-semibold text-sm text-stone-900">Livraison Géolocalisée</h3>
                                <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                    Le coursier le plus proche prend en charge le colis et suit l'itinéraire optimisé.
                                </p>
                            </div>

                            <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3 hover:border-yellow-400 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs flex items-center justify-center">
                                    04
                                </div>
                                <h3 className="font-semibold text-sm text-stone-900">Code OTP & Déblocage</h3>
                                <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                    L'acheteur inspecte le produit et donne son code OTP. Les fonds sont versés au vendeur.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 6. CALL TO ACTION */}
                <section className="py-20 bg-white text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Rejoignez l'écosystème Sellify</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight leading-tight">
                            Prêt à vivre l'expérience du e-commerce sécurisé ?
                        </h2>

                        <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed font-normal">
                            Explorez le catalogue des boutiques certifiées ou créez votre compte vendeur en moins de 2 minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link href={route('public.products.index')}>
                                <button className="w-full sm:w-auto px-7 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                                    <span>Explorer tous les produits</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <Link href={route('register')}>
                                <button className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer">
                                    <span>Ouvrir une boutique</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
