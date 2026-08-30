import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Search, 
    Sparkles, 
    CheckCircle2, 
    ChevronRight, 
    ChevronDown,
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
    Filter,
    MessageSquare,
    BadgeCheck,
    Shirt,
    Home as HomeIcon,
    Smartphone,
    Car,
    Eye,
    Tag,
    X,
    MapPin,
    Building2
} from 'lucide-react';

export default function Index({ 
    products = { data: [], links: [] }, 
    featuredDeals = [], 
    topShops = [], 
    categories = [], 
    cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Bamenda', 'Maroua'],
    filters = {} 
}) {
    // Robust normalization against null, undefined, or empty array [] passed by PHP
    const safeFilters = (!Array.isArray(filters) && typeof filters === 'object' && filters !== null) ? filters : {};
    const safeProducts = (products && products.data) ? products : { data: Array.isArray(products) ? products : [], links: [] };
    const safeCategories = Array.isArray(categories) && categories.length > 0 ? categories : [
        { id: 'tech', name: 'High-Tech & Smartphones', count: 124 },
        { id: 'fashion', name: 'Mode & Bazin Africain', count: 88 },
        { id: 'home', name: 'Maison & Électroménager', count: 54 },
        { id: 'beauty', name: 'Beauté & Soins Bio', count: 42 },
        { id: 'auto', name: 'Auto, Moto & Pièces', count: 31 },
        { id: 'food', name: 'Alimentation & Épicerie', count: 29 },
    ];
    const safeTopShops = Array.isArray(topShops) ? topShops : [];
    const safeCities = Array.isArray(cities) && cities.length > 0 ? cities : ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Bamenda', 'Maroua'];

    // Safe initial states (guaranteed strings/booleans to avoid Array.prototype.sort invocation)
    const initialSearch = typeof safeFilters.search === 'string' ? safeFilters.search : '';
    const initialTab = safeFilters.shop_slug ? 'fabricants' : (safeFilters.on_sale ? 'promotions' : 'produits');
    const initialCity = typeof safeFilters.city === 'string' ? safeFilters.city : 'all';
    const initialCategory = typeof safeFilters.category === 'string' ? safeFilters.category : 'all';
    const initialVerified = safeFilters.verified_only === '1' || safeFilters.verified_only === true || safeFilters.verified_only === 1;
    const initialMinPrice = (typeof safeFilters.min_price === 'string' || typeof safeFilters.min_price === 'number') ? safeFilters.min_price : '';
    const initialMaxPrice = (typeof safeFilters.max_price === 'string' || typeof safeFilters.max_price === 'number') ? safeFilters.max_price : '';
    const initialSort = typeof safeFilters.sort === 'string' ? safeFilters.sort : 'relevance';

    const [search, setSearch] = useState(initialSearch);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedCity, setSelectedCity] = useState(initialCity);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [verifiedOnly, setVerifiedOnly] = useState(initialVerified);
    const [minPrice, setMinPrice] = useState(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
    const [sort, setSort] = useState(initialSort);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        router.get(route('public.products.index'), {
            search: search || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            city: selectedCity !== 'all' ? selectedCity : undefined,
            on_sale: activeTab === 'promotions' ? 1 : undefined,
            verified_only: verifiedOnly ? 1 : undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            sort: sort !== 'relevance' ? sort : undefined,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setActiveTab('produits');
        setSelectedCity('all');
        setSelectedCategory('all');
        setVerifiedOnly(false);
        setMinPrice('');
        setMaxPrice('');
        setSort('relevance');
        router.get(route('public.products.index'));
    };

    const categoryIcons = {
        'tech': Smartphone,
        'fashion': Shirt,
        'home': HomeIcon,
        'beauty': Sparkles,
        'auto': Car,
        'food': Package,
    };

    return (
        <PublicLayout>
            <Head title="Store & Marketplace Sécurisée - Sellify.me" />

            <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 font-sans text-stone-700 antialiased">
                
                {/* 1. TOP MARKETPLACE SEARCH & DISCOVERY HEADER */}
                <div className="bg-white border-b border-stone-200/80 pt-6 pb-6 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                        
                        {/* Tab Selector */}
                        <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-stone-600 border-b border-stone-100 pb-3">
                            <button 
                                onClick={() => { setActiveTab('produits'); }}
                                className={`flex items-center gap-1.5 pb-2 transition-all cursor-pointer ${
                                    activeTab === 'produits' ? 'border-b-2 border-yellow-500 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                                }`}
                            >
                                <Package className="w-4 h-4 text-yellow-600" />
                                <span>Tous les Produits</span>
                            </button>

                            <button 
                                onClick={() => { setActiveTab('promotions'); }}
                                className={`flex items-center gap-1.5 pb-2 transition-all cursor-pointer ${
                                    activeTab === 'promotions' ? 'border-b-2 border-yellow-500 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                                }`}
                            >
                                <Flame className="w-4 h-4 text-rose-500" />
                                <span>Ventes Flash & Promos</span>
                            </button>

                            <button 
                                onClick={() => { setActiveTab('fabricants'); }}
                                className={`flex items-center gap-1.5 pb-2 transition-all cursor-pointer ${
                                    activeTab === 'fabricants' ? 'border-b-2 border-yellow-500 text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                                }`}
                            >
                                <Store className="w-4 h-4 text-yellow-600" />
                                <span>Boutiques & Fabricants Verified</span>
                            </button>
                        </div>

                        {/* Search Bar Input */}
                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-stone-50 border border-stone-200 focus-within:border-yellow-400 focus-within:bg-white rounded-2xl shadow-xs p-1 pl-4 transition-all">
                                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'fabricants' ? "Rechercher une boutique par nom, ville (ex: Douala, Yaoundé) ou secteur..." : "Que recherchez-vous aujourd'hui ? (ex: Téléphones, Bazin, Sacs, Électroménager)..."}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent border-none text-xs sm:text-sm text-stone-800 focus:ring-0 outline-none placeholder:text-stone-400 px-3 font-normal"
                                />

                                {search && (
                                    <button 
                                        type="button" 
                                        onClick={() => setSearch('')} 
                                        className="p-1 text-stone-400 hover:text-stone-600 mr-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Rechercher</span>
                                </button>
                            </form>
                        </div>

                        {/* Escrow Guarantee Sub-banner */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500 font-normal pt-1">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Paiement Escrow 100% garanti</span>
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-yellow-600" />
                                <span>Livraison express suivie par GPS</span>
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="flex items-center gap-1">
                                <BadgeCheck className="w-3.5 h-3.5 text-yellow-600" />
                                <span>Commerçants vérifiés RCCM</span>
                            </span>
                        </div>

                    </div>
                </div>

                {/* 2. MAIN STORE BODY */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                    
                    {/* CATEGORY SELECTOR CAROUSEL PILLS */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-3 shadow-2xs flex items-center gap-2 overflow-x-auto">
                        <button
                            onClick={() => { setSelectedCategory('all'); handleSearchSubmit(); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                                selectedCategory === 'all' 
                                    ? 'bg-yellow-400 text-stone-950 shadow-2xs font-semibold' 
                                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                            }`}
                        >
                            <Grid className="w-3.5 h-3.5" />
                            <span>Toutes les catégories</span>
                        </button>

                        {safeCategories.map((cat) => {
                            const IconComponent = categoryIcons[cat.id] || Package;
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        const newCat = isSelected ? 'all' : cat.id;
                                        setSelectedCategory(newCat);
                                        router.get(route('public.products.index'), { category: newCat !== 'all' ? newCat : undefined }, { preserveState: true });
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                                        isSelected 
                                            ? 'bg-yellow-400 text-stone-950 shadow-2xs font-semibold' 
                                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                                    }`}
                                >
                                    <IconComponent className="w-3.5 h-3.5 text-stone-500" />
                                    <span>{cat.name}</span>
                                    <span className="text-[10px] text-stone-400">({cat.count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* FILTER CONTROLS BAR */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                        
                        {/* Left filter elements */}
                        <div className="flex flex-wrap items-center gap-3">
                            
                            {/* City Filter */}
                            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-stone-700">
                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                <span className="text-[11px] text-stone-500">Ville :</span>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => { setSelectedCity(e.target.value); }}
                                    className="bg-transparent border-none text-xs font-medium text-stone-800 outline-none cursor-pointer pr-2"
                                >
                                    <option value="all">Toutes les villes</option>
                                    {safeCities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Verified Only Toggle */}
                            <button
                                type="button"
                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    verifiedOnly 
                                        ? 'bg-amber-50 border-yellow-400 text-yellow-900 font-semibold' 
                                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                                }`}
                            >
                                <BadgeCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-yellow-600' : 'text-stone-400'}`} />
                                <span>Vendeurs vérifiés uniquement</span>
                            </button>

                            {/* Price Inputs */}
                            <div className="hidden sm:flex items-center gap-1.5 text-stone-500 text-[11px]">
                                <span>Prix :</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
                                />
                                <span className="text-[10px]">FCFA</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleSearchSubmit}
                                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                            >
                                Filtrer
                            </button>

                            {(search || selectedCategory !== 'all' || selectedCity !== 'all' || verifiedOnly || minPrice || maxPrice) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="text-[11px] text-stone-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                    <span>Réinitialiser</span>
                                </button>
                            )}
                        </div>

                        {/* Right Sorting Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-400 font-normal">Trier par :</span>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    router.get(route('public.products.index'), { sort: e.target.value }, { preserveState: true });
                                }}
                                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 outline-none cursor-pointer"
                            >
                                <option value="relevance">Recommandés</option>
                                <option value="price_asc">Prix croissant</option>
                                <option value="price_desc">Prix décroissant</option>
                            </select>
                        </div>

                    </div>

                    {/* 3. DYNAMIC CONTENT: PRODUCTS GRID OR VERIFIED SHOPS DIRECTORY */}
                    {activeTab === 'fabricants' ? (
                        
                        /* BOUTIQUES & FABRICANTS VIEW */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-stone-900">
                                        Boutiques & Fabricants Certifiés
                                    </h2>
                                    <p className="text-xs text-stone-500 font-normal">
                                        Découvrez les commerçants vérifiés avec atelier et boutique physique enregistrée.
                                    </p>
                                </div>
                                <span className="text-xs text-stone-400 font-normal">
                                    {safeTopShops.length} boutiques disponibles
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {safeTopShops.map((shop) => {
                                    const sellerUser = shop.seller?.user;
                                    const shopProducts = shop.products ? shop.products.slice(0, 3) : [];

                                    return (
                                        <div
                                            key={shop.id}
                                            className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:border-yellow-400 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                                        >
                                            <div className="space-y-3">
                                                {/* Header Identity */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                            {shop.logo_path ? (
                                                                <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Store className="w-6 h-6 text-yellow-700" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <h3 className="font-semibold text-sm text-stone-900">{shop.name}</h3>
                                                                <BadgeCheck className="w-4 h-4 text-yellow-600 shrink-0" />
                                                            </div>
                                                            <p className="text-[11px] text-stone-500 font-normal flex items-center gap-1">
                                                                <MapPin className="w-3 h-3 text-stone-400" />
                                                                <span>{shop.address || shop.city || 'Douala, Cameroun'}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium shrink-0">
                                                        Verified
                                                    </span>
                                                </div>

                                                <p className="text-xs text-stone-500 font-normal line-clamp-2 leading-relaxed">
                                                    {shop.description || shop.slogan || "Boutique officielle certifiée avec garantie séquestre Escrow."}
                                                </p>

                                                {/* Product Mini Thumbnails */}
                                                {shopProducts.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                                        {shopProducts.map((p) => {
                                                            const pImg = p.image_paths && p.image_paths[0] ? `/storage/${p.image_paths[0]}` : null;
                                                            return (
                                                                <div key={p.id} className="bg-stone-50 rounded-xl p-1.5 border border-stone-100 text-center space-y-1">
                                                                    <div className="w-full aspect-square bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                                        {pImg ? (
                                                                            <img src={pImg} alt={p.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Package className="w-4 h-4 text-stone-400" />
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[10px] font-semibold text-stone-800 block truncate">
                                                                        {Number(p.price).toLocaleString()} F
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                                <span className="text-[11px] text-stone-400 font-normal">Garantie Escrow active</span>
                                                <Link href={route('shop.public', shop.slug)}>
                                                    <button className="px-3.5 py-1.5 bg-stone-50 hover:bg-yellow-400 text-stone-800 hover:text-stone-950 font-medium text-xs rounded-xl border border-stone-200 hover:border-yellow-400 transition-all flex items-center gap-1 cursor-pointer">
                                                        <span>Visiter la boutique</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    ) : (
                        
                        /* PRODUCTS GRID VIEW */
                        <div className="space-y-4">
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-stone-900">
                                        {activeTab === 'promotions' ? "Ventes Flash & Articles en Promotion" : "Articles & Produits Disponibles"}
                                    </h2>
                                    <p className="text-xs text-stone-500 font-normal">
                                        Commandez avec protection Escrow et recevez votre colis à domicile.
                                    </p>
                                </div>
                                <span className="text-xs text-stone-400 font-normal">
                                    {safeProducts.total || safeProducts.data.length} résultats
                                </span>
                            </div>

                            {/* Empty State */}
                            {safeProducts.data.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80 space-y-3">
                                    <Package className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5]" />
                                    <h3 className="font-semibold text-stone-800 text-sm">Aucun produit trouvé</h3>
                                    <p className="text-xs text-stone-500 font-normal">
                                        Essayez d'élargir vos filtres de recherche ou sélectionnez une autre catégorie.
                                    </p>
                                    <button 
                                        onClick={handleReset} 
                                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {safeProducts.data.map((product) => {
                                        const hasPromo = product.active_promotion !== null && product.active_promotion !== undefined;
                                        const firstImg = product.image_paths && product.image_paths[0] ? `/storage/${product.image_paths[0]}` : null;
                                        const displayPrice = hasPromo ? product.active_promotion.promo_price : product.price;

                                        return (
                                            <div
                                                key={product.id}
                                                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:border-yellow-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between group p-3 space-y-2.5"
                                            >
                                                <div className="space-y-2">
                                                    
                                                    {/* Image Box */}
                                                    <div className="relative w-full aspect-square bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center border border-stone-100">
                                                        {firstImg ? (
                                                            <img 
                                                                src={firstImg} 
                                                                alt={product.name} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <Package className="w-8 h-8 text-stone-300" />
                                                        )}

                                                        {/* Promo Badge */}
                                                        {hasPromo && (
                                                            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                                                                -{product.active_promotion.discount_percentage}%
                                                            </span>
                                                        )}

                                                        {/* Escrow Tag */}
                                                        <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-stone-800 text-[9px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                            <span>Escrow</span>
                                                        </span>
                                                    </div>

                                                    {/* Boutique Name */}
                                                    {product.shop && (
                                                        <Link 
                                                            href={route('shop.public', product.shop.slug)}
                                                            className="text-[10px] text-stone-400 hover:text-yellow-700 truncate block font-normal"
                                                        >
                                                            {product.shop.name}
                                                        </Link>
                                                    )}

                                                    {/* Product Title */}
                                                    <Link href={route('public.products.show', product.slug)} className="block">
                                                        <h3 className="font-medium text-stone-900 text-xs line-clamp-2 hover:text-yellow-700 transition-colors leading-tight">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="pt-2 border-t border-stone-100 space-y-2">
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-semibold text-stone-900 tracking-tight">
                                                            {Number(displayPrice).toLocaleString()} FCFA
                                                        </div>
                                                        {hasPromo && (
                                                            <div className="text-[10px] text-stone-400 line-through">
                                                                {Number(product.price).toLocaleString()} FCFA
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Link href={route('public.products.show', product.slug)} className="block">
                                                        <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-[11px] rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer">
                                                            <span>Commander</span>
                                                            <ArrowRight className="w-3 h-3" />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* PAGINATION */}
                            {safeProducts.links && safeProducts.links.length > 3 && (
                                <div className="flex justify-center items-center gap-1.5 pt-8">
                                    {safeProducts.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                                                link.active
                                                    ? 'bg-yellow-400 text-stone-950 border-yellow-400 font-semibold shadow-2xs'
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
