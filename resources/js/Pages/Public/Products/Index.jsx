import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Search, 
    Camera, 
    Sparkles, 
    CheckCircle2, 
    ChevronRight, 
    ChevronDown,
    Building2,
    Store,
    Package,
    ShieldCheck,
    Truck,
    Clock,
    User,
    ArrowRight,
    Star,
    Award,
    Flame,
    Grid,
    SlidersHorizontal,
    Layers,
    Filter,
    MessageSquare,
    FileText,
    BadgeCheck,
    Phone,
    Video,
    Tv,
    Shirt,
    Home,
    Smartphone,
    Activity,
    Car,
    Eye
} from 'lucide-react';

export default function Index({ 
    products, 
    featuredDeals = [], 
    topShops = [], 
    categories = [], 
    filters = {} 
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeSearchTab, setActiveSearchTab] = useState('produits'); // ai_mode, produits, fabricants, mondial
    const [onSale, setOnSale] = useState(filters.on_sale || false);
    const [selectedShop, setSelectedShop] = useState(filters.shop_slug || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        router.get(route('public.products.index'), {
            search,
            shop_slug: selectedShop,
            on_sale: onSale ? 1 : 0,
            min_price: minPrice,
            max_price: maxPrice,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedShop('');
        setOnSale(false);
        setMinPrice('');
        setMaxPrice('');
        setSelectedCategory('');
        router.get(route('public.products.index'));
    };

    const categoryIcons = {
        'Beauté': Sparkles,
        'Véhicules & Transport': Car,
        'Maison & Jardin': Home,
        'Électronique grand public': Smartphone,
        'Sports & Loisirs': Activity,
        'Chaussures & Accessoires': Shirt,
        'Toutes les catégories': Grid,
    };

    return (
        <PublicLayout>
            <Head title="La plus grande plateforme de commerce B2B & B2C - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 font-sans text-stone-800 antialiased">
                
                {/* HERO SEARCH SECTION */}
                <div className="bg-white border-b border-stone-200 pt-6 pb-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                        
                        {/* 1. Tab Switcher Header above Search Bar */}
                        <div className="flex items-center justify-center gap-8 text-sm font-semibold text-stone-600">
                            <button 
                                onClick={() => setActiveSearchTab('ai_mode')}
                                className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all ${
                                    activeSearchTab === 'ai_mode' ? 'border-amber-500 text-amber-700 font-bold' : 'border-transparent hover:text-stone-900'
                                }`}
                            >
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>AI Mode ✨</span>
                            </button>

                            <button 
                                onClick={() => setActiveSearchTab('produits')}
                                className={`pb-1 border-b-2 transition-all ${
                                    activeSearchTab === 'produits' ? 'border-amber-500 text-amber-700 font-bold' : 'border-transparent hover:text-stone-900'
                                }`}
                            >
                                Produits
                            </button>

                            <button 
                                onClick={() => setActiveSearchTab('fabricants')}
                                className={`pb-1 border-b-2 transition-all ${
                                    activeSearchTab === 'fabricants' ? 'border-amber-500 text-amber-700 font-bold' : 'border-transparent hover:text-stone-900'
                                }`}
                            >
                                Fabricants / Boutiques
                            </button>

                            <button 
                                onClick={() => setActiveSearchTab('mondial')}
                                className={`pb-1 border-b-2 transition-all ${
                                    activeSearchTab === 'mondial' ? 'border-amber-500 text-amber-700 font-bold' : 'border-transparent hover:text-stone-900'
                                }`}
                            >
                                Mondial
                            </button>
                        </div>

                        {/* 2. Mega Search Input Container */}
                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border-2 border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-full shadow-md p-1 pl-5">
                                <input
                                    type="text"
                                    placeholder={activeSearchTab === 'fabricants' ? "Nom de boutique, secteur ou ville (ex: Douala, Yaoundé)..." : "Entraîneurs, coiffeuse avec miroir, sacs, téléphones..."}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent border-none text-xs sm:text-sm text-stone-900 focus:ring-0 outline-none placeholder:text-stone-400 font-normal pr-32"
                                />

                                {/* Camera / Search by Image button */}
                                <button 
                                    type="button"
                                    className="hidden sm:flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 px-3 border-r border-stone-200 shrink-0"
                                >
                                    <Camera className="w-4 h-4 text-stone-500" />
                                    <span>Recherche par Image</span>
                                </button>

                                {/* Main Amber Search Button */}
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold rounded-full shadow-xs transition-colors shrink-0 flex items-center gap-1.5 ml-2"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Rechercher</span>
                                </button>
                            </form>
                        </div>

                        {/* 3. Hero Trust Tagline */}
                        <div className="text-center space-y-1 pt-1">
                            <p className="text-xs font-semibold text-stone-800">
                                Contactez <strong className="text-amber-700 font-bold">34 000 fabricants Verified</strong>
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500 font-normal">
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> + de 5 000 secteurs</span>
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Prix d'usine & direct</span>
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Échantillons et customisation possibles</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* SUB-NAV QUICK LINKS BAR */}
                <div className="bg-[#f9f9f9] border-b border-stone-200 py-2.5">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium">
                        <div className="font-semibold text-stone-900 text-sm">
                            Bienvenue sur Sellify.me
                        </div>
                        <div className="flex items-center gap-6 text-[11px] text-stone-600">
                            <span className="flex items-center gap-1 cursor-pointer hover:text-amber-600">
                                <FileText className="w-3.5 h-3.5 text-stone-500" />
                                <span>Demander un devis</span>
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer hover:text-amber-600">
                                <Store className="w-3.5 h-3.5 text-stone-500" />
                                <span>Salon en ligne</span>
                            </span>
                            <span className="flex items-center gap-1 cursor-pointer hover:text-amber-600">
                                <Package className="w-3.5 h-3.5 text-stone-500" />
                                <span>Hub de sourcing de premier ordre</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* MAIN MARKETPLACE 4-COLUMN GRID */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                        
                        {/* COL 1: EXPLORER PAR CATÉGORIES */}
                        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
                            <h3 className="font-bold text-stone-900 text-xs tracking-tight border-b border-stone-100 pb-2">
                                Explorer par catégories
                            </h3>
                            <div className="space-y-1">
                                {[
                                    { name: 'Beauté', key: 'Beauté' },
                                    { name: 'Véhicules & Transport', key: 'Véhicules & Transport' },
                                    { name: 'Maison & Jardin', key: 'Maison & Jardin' },
                                    { name: 'Électronique grand public', key: 'Électronique grand public' },
                                    { name: 'Sports & Loisirs', key: 'Sports & Loisirs' },
                                    { name: 'Chaussures & Accessoires', key: 'Chaussures & Accessoires' },
                                    { name: 'Toutes les catégories', key: 'Toutes les catégories' }
                                ].map((cat, idx) => {
                                    const IconComponent = categoryIcons[cat.key] || Grid;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedCategory(cat.name);
                                                setSearch(cat.name);
                                                handleSearchSubmit();
                                            }}
                                            className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-stone-700 hover:bg-stone-50 hover:text-amber-600 font-normal transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <IconComponent className="w-4 h-4 text-stone-500 group-hover:text-amber-600" />
                                                <span>{cat.name}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* COL 2: TESTEZ NOS ÉCHANTILLONS */}
                        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-4">
                            <h3 className="font-bold text-stone-900 text-xs tracking-tight border-b border-stone-100 pb-2">
                                Testez nos échantillons
                            </h3>

                            <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                <div className="p-2.5 bg-stone-50 rounded-xl space-y-2 border border-stone-100 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="w-full h-20 bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Package className="w-8 h-8 text-stone-400 stroke-[1.5]" />
                                    </div>
                                    <span className="font-medium text-[11px] block text-stone-800">Produits tendance</span>
                                </div>
                                <div className="p-2.5 bg-stone-50 rounded-xl space-y-2 border border-stone-100 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="w-full h-20 bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-amber-500 stroke-[1.5]" />
                                    </div>
                                    <span className="font-medium text-[11px] block text-stone-800">Nouveautés</span>
                                </div>
                            </div>

                            {/* Q&R en direct */}
                            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2 text-xs">
                                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                    <span>Q&R en direct</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-100">
                                    <div className="w-10 h-10 bg-amber-500 text-amber-950 rounded-md shrink-0 flex items-center justify-center font-bold text-xs">
                                        LIVE
                                    </div>
                                    <p className="text-[11px] text-stone-600 font-normal line-clamp-2">
                                        Avis en direct sur le produit, tests d'étanchéité et démonstrations vendeurs...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* COL 3: TOP CLASSEMENT FOURNISSEURS */}
                        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                <h3 className="font-bold text-stone-900 text-xs tracking-tight">
                                    Top classement fournisseurs
                                </h3>
                                <Link href={route('public.shops.index')} className="text-[10px] text-amber-600 font-semibold hover:underline">
                                    Voir tout
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                <div className="p-2.5 bg-stone-50 rounded-xl space-y-2 border border-stone-100 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="w-full h-18 bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Store className="w-7 h-7 text-stone-400 stroke-[1.5]" />
                                    </div>
                                    <span className="font-medium text-[11px] block text-stone-800">Les plus populaires</span>
                                </div>
                                <div className="p-2.5 bg-stone-50 rounded-xl space-y-2 border border-stone-100 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="w-full h-18 bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Award className="w-7 h-7 text-amber-500 stroke-[1.5]" />
                                    </div>
                                    <span className="font-medium text-[11px] block text-stone-800">Meilleures ventes</span>
                                </div>
                                <div className="p-2.5 bg-stone-50 rounded-xl space-y-2 border border-stone-100 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="w-full h-18 bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Clock className="w-7 h-7 text-emerald-600 stroke-[1.5]" />
                                    </div>
                                    <span className="font-medium text-[11px] block text-stone-800">Réponse rapide</span>
                                </div>
                                <div className="p-2.5 bg-stone-50 rounded-xl space-y-2 border border-stone-100 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="w-full h-18 bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        <Truck className="w-7 h-7 text-blue-600 stroke-[1.5]" />
                                    </div>
                                    <span className="font-medium text-[11px] block text-stone-800">Livraison dans les délais</span>
                                </div>
                            </div>
                        </div>

                        {/* COL 4: GUEST USER CARD & RFQ REQUEST BOX */}
                        <div className="lg:col-span-3 space-y-4">
                            
                            {/* User Avatar Card */}
                            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3 text-center">
                                <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 mx-auto flex items-center justify-center">
                                    <User className="w-6 h-6 text-stone-400" />
                                </div>
                                <div>
                                    <span className="text-[11px] text-stone-400 block font-normal">Bienvenue !</span>
                                    <h4 className="font-bold text-stone-900 text-sm">Guest</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <Link href={route('login')}>
                                        <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-colors">
                                            Se connecter
                                        </button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <button className="w-full py-2 border border-amber-500 text-amber-900 hover:bg-amber-50 font-bold text-xs rounded-xl transition-colors">
                                            S'inscrire
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* RFQ Card ("Une demande, plusieurs devis") */}
                            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3 text-xs">
                                <h4 className="font-bold text-stone-900 text-xs">Une demande, plusieurs devis</h4>
                                
                                <div className="grid grid-cols-3 gap-1 text-center py-1 border-y border-stone-100 text-[10px]">
                                    <div>
                                        <strong className="block text-stone-900 font-bold text-xs">170,000+</strong>
                                        <span className="text-stone-400">Fournisseurs</span>
                                    </div>
                                    <div>
                                        <strong className="block text-stone-900 font-bold text-xs">&lt;5h</strong>
                                        <span className="text-stone-400">Délai réponse</span>
                                    </div>
                                    <div>
                                        <strong className="block text-stone-900 font-bold text-xs">7863</strong>
                                        <span className="text-stone-400">Industries</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 border border-stone-900 hover:bg-stone-900 hover:text-white text-stone-900 font-bold text-xs rounded-xl transition-colors">
                                    Demander un devis
                                </button>
                            </div>

                        </div>

                    </div>

                    {/* CATEGORIES HORIZONTAL NAV BAR WITH PILLS */}
                    <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3 overflow-x-auto">
                            <div className="flex items-center gap-6 text-xs font-semibold text-stone-700 shrink-0">
                                <button className="text-amber-700 font-bold border-b-2 border-amber-500 pb-1">Toutes les catégories</button>
                                <button className="hover:text-amber-600">Beauté</button>
                                <button className="hover:text-amber-600">Véhicules & Transport</button>
                                <button className="hover:text-amber-600">Maison & Jardin</button>
                                <button className="hover:text-amber-600">Électronique grand public</button>
                                <button className="hover:text-amber-600">Sports & Loisirs</button>
                                <button className="hover:text-amber-600">Chaussures & Accessoires</button>
                                <button className="hover:text-amber-600">Hygiène...</button>
                            </div>
                            <button className="text-xs text-stone-500 hover:text-stone-800 font-medium shrink-0 flex items-center gap-1">
                                <span>Voir plus</span>
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Feature Badges Pills Strip */}
                        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-normal text-stone-600 pt-1">
                            {[
                                'Faible MOQ pour personnalisation',
                                'Personnalisation à partir d\'échantillons',
                                'Gestion de la qualité certifiée',
                                'Personnalisation simple',
                                'Personnalisation complète',
                                'Capacités R&D élevées'
                            ].map((pill, idx) => (
                                <button key={idx} className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 shrink-0 transition-colors">
                                    {pill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC CONTENT CONTAINER: PRODUCT GRID VS MANUFACTURERS SHOWCASE */}
                    {activeSearchTab === 'fabricants' ? (
                        
                        /* MANUFACTURERS / BOUTIQUES CARDS SHOWCASE */
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-stone-900">
                                        Fabricants & Boutiques Certifiés Verified
                                    </h3>
                                    <p className="text-xs text-stone-500 font-normal">
                                        Fournisseurs immatriculés avec capacités d'approvisionnement et ateliers vérifiés
                                    </p>
                                </div>
                                <span className="text-xs text-stone-400 font-medium">
                                    {topShops.length} fabricants disponibles
                                </span>
                            </div>

                            {/* Detailed Manufacturer Cards Grid */}
                            <div className="space-y-5">
                                {topShops.map((shop) => {
                                    const shopProducts = shop.products ? shop.products.slice(0, 3) : [];

                                    return (
                                        <div 
                                            key={shop.id}
                                            className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:border-amber-500 hover:shadow-md transition-all space-y-4"
                                        >
                                            {/* Header Row */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                                                
                                                <div className="flex items-center gap-3">
                                                    {/* Logo Box */}
                                                    <div className="w-12 h-12 bg-white border border-stone-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                                                        {shop.logo_path ? (
                                                            <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Store className="w-6 h-6 text-stone-400 stroke-[1.5]" />
                                                        )}
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-stone-900 text-sm">{shop.name}</h4>
                                                            <span className="text-xs text-stone-500 font-normal flex items-center gap-1">
                                                                <span>{shop.city || 'Douala'}</span>
                                                                <span>🇨🇲 CM</span>
                                                            </span>
                                                        </div>

                                                        {/* Status badges line */}
                                                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-500 font-normal">
                                                            <span className="text-amber-700 font-bold flex items-center gap-0.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                                                                Verified
                                                            </span>
                                                            <span>•</span>
                                                            <span>3 ans</span>
                                                            <span>•</span>
                                                            <span>50+ personnel</span>
                                                            <span>•</span>
                                                            <span>Atelier certifié</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-50 rounded-full text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                                                        <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                                                        <span>Discuter en ligne</span>
                                                    </button>
                                                    <Link href={route('shop.public', shop.slug)}>
                                                        <button className="px-4 py-1.5 border border-stone-900 hover:bg-stone-900 hover:text-white rounded-full text-stone-900 text-xs font-semibold transition-colors">
                                                            Contactez-nous
                                                        </button>
                                                    </Link>
                                                </div>

                                            </div>

                                            {/* Body Grid Row */}
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
                                                
                                                {/* Sub-col 1: Company Metrics */}
                                                <div className="lg:col-span-4 bg-stone-50/70 border border-stone-100 rounded-xl p-3.5 space-y-3">
                                                    <div>
                                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">Note et avis</span>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <div className="flex text-amber-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                                ))}
                                                            </div>
                                                            <span className="font-bold text-stone-800">4.9/5</span>
                                                            <span className="text-[10px] text-stone-400">(24 avis)</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 text-[11px] text-stone-600 font-normal">
                                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Capacités de production</span>
                                                        <p className="flex items-center gap-1">&bull; Approvisionnement des entreprises</p>
                                                        <p className="flex items-center gap-1">&bull; Personnalisation complète sur commande</p>
                                                        <p className="flex items-center gap-1">&bull; Exportateur expérimenté certifié</p>
                                                        <p className="flex items-center gap-1">&bull; Service ODM / OEM disponible</p>
                                                    </div>
                                                </div>

                                                {/* Sub-col 2: Product Cards & Showroom Photo */}
                                                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                    
                                                    {/* 3 Product Thumbnails */}
                                                    {shopProducts.map((prod) => {
                                                        const pImg = prod.image_paths && prod.image_paths[0] ? `/storage/${prod.image_paths[0]}` : null;
                                                        return (
                                                            <div key={prod.id} className="bg-stone-50 rounded-xl p-2 border border-stone-100 hover:bg-white hover:shadow-2xs transition-all space-y-1.5 flex flex-col justify-between">
                                                                <div className="w-full aspect-square bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                                    {pImg ? (
                                                                        <img src={pImg} alt={prod.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package className="w-6 h-6 text-stone-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span className="font-bold text-stone-900 text-xs block truncate">
                                                                        {Number(prod.price).toLocaleString()} FCFA
                                                                    </span>
                                                                    <span className="text-[9px] text-stone-400 block truncate">
                                                                        Quantité min : 1 pièce
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Showroom / VR Photo Card */}
                                                    <div className="relative bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center text-white p-2 min-h-[120px] group">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                        <span className="absolute top-2 left-2 bg-amber-500 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded z-20 flex items-center gap-0.5">
                                                            <Eye className="w-3 h-3" />
                                                            <span>VR 360</span>
                                                        </span>
                                                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white z-20">
                                                            Atelier & Showroom
                                                        </span>
                                                        <span className="text-stone-400 text-xs z-10 group-hover:scale-110 transition-transform">
                                                            📸 1/19
                                                        </span>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    ) : (
                        
                        /* DEFAULT PRODUCTS CATALOG GRID */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-stone-900">
                                        Produits & Recommandations du Jour
                                    </h3>
                                    <p className="text-xs text-stone-500 font-normal">
                                        Achetez en gros ou au détail directement auprès des vendeurs agréés
                                    </p>
                                </div>

                                {/* Quick Filter Buttons */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={handleReset}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                            !onSale ? 'bg-amber-500 text-amber-950 border-amber-500 font-bold' : 'bg-white text-stone-700 border-stone-200'
                                        }`}
                                    >
                                        Tous les articles
                                    </button>
                                    <button 
                                        onClick={() => { setOnSale(true); handleSearchSubmit(); }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                            onSale ? 'bg-amber-500 text-amber-950 border-amber-500 font-bold' : 'bg-white text-stone-700 border-stone-200'
                                        }`}
                                    >
                                        Promotions & Ventes Flash
                                    </button>
                                </div>
                            </div>

                            {/* Product Cards Grid */}
                            {products.data.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80 space-y-3">
                                    <Package className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5]" />
                                    <h4 className="font-bold text-stone-800 text-sm">Aucun produit trouvé</h4>
                                    <p className="text-xs text-stone-500">Essayez de modifier votre recherche ou réinitialisez les filtres.</p>
                                    <button onClick={handleReset} className="px-4 py-2 bg-amber-500 text-amber-950 font-bold text-xs rounded-full">
                                        Réinitialiser la recherche
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {products.data.map((product) => {
                                        const hasPromo = product.active_promotion !== null;
                                        const firstImg = product.image_paths && product.image_paths[0] ? `/storage/${product.image_paths[0]}` : null;
                                        const displayPrice = hasPromo ? product.active_promotion.promo_price : product.price;

                                        return (
                                            <div 
                                                key={product.id}
                                                className="bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group p-3 space-y-2"
                                            >
                                                <div>
                                                    {/* Card Image Box with Camera hover icon */}
                                                    <div className="relative w-full aspect-square bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {firstImg ? (
                                                            <img 
                                                                src={firstImg} 
                                                                alt={product.name} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <Package className="w-10 h-10 text-stone-300 stroke-[1.5]" />
                                                        )}

                                                        {/* Bottom-left Camera icon tag */}
                                                        <span className="absolute bottom-2 left-2 bg-stone-900/70 backdrop-blur-xs text-white p-1 rounded-md">
                                                            <Camera className="w-3.5 h-3.5 text-white" />
                                                        </span>

                                                        {/* Discount Tag */}
                                                        {hasPromo && (
                                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                                -{product.active_promotion.discount_percentage}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Certification Tag Badges */}
                                                    <div className="flex flex-wrap items-center gap-1 pt-2">
                                                        <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                                            SCNP
                                                        </span>
                                                        <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                                            CE
                                                        </span>
                                                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                                            Verified
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <Link href={route('public.products.show', product.slug)} className="block pt-1">
                                                        <h4 className="font-normal text-stone-900 text-xs line-clamp-2 hover:text-amber-600 transition-colors leading-tight">
                                                            {product.name}
                                                        </h4>
                                                    </Link>
                                                </div>

                                                {/* Pricing & MOQ Section */}
                                                <div className="pt-2 border-t border-stone-100 space-y-1">
                                                    {/* Price */}
                                                    <div className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
                                                        {Number(displayPrice).toLocaleString()} FCFA
                                                    </div>

                                                    {/* MOQ & Sales */}
                                                    <div className="text-[10px] text-stone-500 font-normal">
                                                        MOQ: 1 pièce • <span className="text-stone-400">{product.stock} vendus</span>
                                                    </div>

                                                    {/* Verified Supplier Line */}
                                                    <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium pt-1">
                                                        <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                                                        <span className="truncate">Verified • 1 an • 🇨🇲 CM</span>
                                                    </div>

                                                    {/* Action Button */}
                                                    <Link href={route('public.products.show', product.slug)} className="block pt-1">
                                                        <button className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-[11px] rounded-lg transition-colors shadow-2xs">
                                                            Voir la fiche
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* PAGINATION */}
                            {products.links && products.links.length > 3 && (
                                <div className="flex justify-center items-center gap-1 pt-6">
                                    {products.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                                link.active
                                                    ? 'bg-amber-500 text-amber-950 border-amber-500 font-bold'
                                                    : link.url
                                                        ? 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                                                        : 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>

                    )}

                </div>

            </div>
        </PublicLayout>
    );
}
