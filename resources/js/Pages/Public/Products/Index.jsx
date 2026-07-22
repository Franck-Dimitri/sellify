import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Search, 
    Package, 
    Filter, 
    Tag, 
    Store, 
    Percent, 
    CheckCircle2, 
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    ChevronRight,
    Flame,
    Clock,
    Star,
    Smartphone,
    Shirt,
    Home,
    Sparkles,
    Car,
    Activity,
    Truck,
    CreditCard,
    Zap,
    Grid,
    SlidersHorizontal,
    Award,
    Building2,
    Lock,
    FileText,
    BadgeCheck,
    Headphones,
    RefreshCw,
    TrendingUp
} from 'lucide-react';

export default function Index({ 
    products, 
    featuredDeals = [], 
    topShops = [], 
    categories = [], 
    filters = {} 
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [onSale, setOnSale] = useState(filters.on_sale || false);
    const [selectedShop, setSelectedShop] = useState(filters.shop_slug || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [activeTab, setActiveTab] = useState('all');

    // Countdown Timer State for Daily Deals
    const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 12 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleFilterSubmit = (e) => {
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
        router.get(route('public.products.index'));
    };

    return (
        <PublicLayout>
            <Head title="Store & Marketplace B2B/B2C - Sellify.me (Format Alibaba)" />

            <div className="w-full bg-stone-100/80 min-h-screen pb-20 antialiased font-sans text-stone-800">
                
                {/* TOP ALIBABA TRADE ASSURANCE RIBBON */}
                <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white text-xs py-2 px-4 border-b border-stone-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-normal">
                        <div className="flex items-center gap-2">
                            <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Trade Assurance
                            </span>
                            <span className="text-stone-300 text-[11px]">
                                Protection Acheteur 100% Garantie par le Compte Séquestre Sellify. Remboursement automatique sous 48h.
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-amber-400 font-medium">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Paiement Sécurisé MoMo</span>
                            <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Livraison Exprès 24h</span>
                        </div>
                    </div>
                </div>

                {/* ALIBABA STYLE MEGA SEARCH & HEADER BAR */}
                <div className="bg-white border-b border-stone-200 shadow-2xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            
                            {/* Category Selector Dropdown */}
                            <div className="relative w-full md:w-60 shrink-0">
                                <select 
                                    className="w-full px-3.5 py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-xl outline-none border-none cursor-pointer"
                                    value={selectedShop}
                                    onChange={(e) => {
                                        setSelectedShop(e.target.value);
                                        router.get(route('public.products.index'), {
                                            search,
                                            shop_slug: e.target.value,
                                            on_sale: onSale ? 1 : 0,
                                        }, { preserveState: true });
                                    }}
                                >
                                    <option value="">-- Toutes les Boutiques Certifiées --</option>
                                    {topShops.map(s => (
                                        <option key={s.id} value={s.slug}>{s.name} ({s.city || 'Douala'})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Main Search Input Bar */}
                            <form onSubmit={handleFilterSubmit} className="flex-1 flex items-center w-full gap-2">
                                <div className="relative flex-1">
                                    <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Que recherchez-vous ? (ex: Smartphone 5G, Ordinateur Portable, Robe de Mariée, Outillage...)"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>Rechercher</span>
                                </button>
                            </form>

                        </div>

                        {/* Popular Quick Search Tags & Supplier Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium text-stone-600 pt-1 pb-1">
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold shrink-0">Filtres Rapides :</span>
                            {[
                                { label: 'Toutes les Offres', action: handleReset },
                                { label: '⚡ Ventes Flash (-50%)', action: () => { setOnSale(true); handleFilterSubmit(); } },
                                { label: '🥇 Boutiques Gold Supplier', action: () => {} },
                                { label: '📄 Vendeurs Immatriculés RCCM', action: () => {} },
                                { label: '🚚 Stock Local Douala / Yaoundé', action: () => {} }
                            ].map((b, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={b.action}
                                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] rounded-lg transition-colors shrink-0"
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN MARKETPLACE BODY GRID */}
                <div className=" mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT SIDEBAR (3 COLS) */}
                        <div className="lg:col-span-3 space-y-5">
                            
                            {/* Rayons & Catégories Accordion Widget */}
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Grid className="w-4 h-4 text-amber-600" />
                                        <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
                                            Secteurs & Industries
                                        </h3>
                                    </div>
                                    <span className="text-[10px] text-stone-400 font-medium">{categories.length} catégories</span>
                                </div>

                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSearch(cat.name);
                                                handleFilterSubmit();
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-950 font-medium transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 rounded-md bg-stone-100 group-hover:bg-amber-200/60 flex items-center justify-center shrink-0">
                                                    <Smartphone className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-900" />
                                                </div>
                                                <span className="truncate">{cat.name}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Verified Sellers & Gold Suppliers Widget */}
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-600" />
                                        <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
                                            Fournisseurs Gold
                                        </h3>
                                    </div>
                                    <Link href={route('public.shops.index')} className="text-[10px] text-amber-700 font-medium hover:underline">
                                        Voir l'annuaire
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {topShops.slice(0, 5).map((s) => (
                                        <div key={s.id} className="p-2.5 bg-stone-50/70 border border-stone-200/60 rounded-xl space-y-2 hover:bg-white transition-all">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 truncate">
                                                    <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                                                        {s.logo_path ? (
                                                            <img src={`/storage/${s.logo_path}`} alt={s.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Store className="w-4 h-4 text-stone-400 stroke-[1.5]" />
                                                        )}
                                                    </div>
                                                    <div className="truncate">
                                                        <div className="flex items-center gap-1">
                                                            <h4 className="font-semibold text-stone-900 text-xs truncate">{s.name}</h4>
                                                            <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                        </div>
                                                        <span className="text-[10px] text-stone-400 block font-normal truncate">{s.city || 'Cameroun'}</span>
                                                    </div>
                                                </div>

                                                <Link href={route('shop.public', s.slug)}>
                                                    <button className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-amber-950 text-[10px] font-semibold rounded-md shrink-0">
                                                        Vitrine
                                                    </button>
                                                </Link>
                                            </div>

                                            {s.rccm_number && (
                                                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                                                    <span>RCCM : <strong className="text-stone-700">{s.rccm_number}</strong></span>
                                                    <span className="text-emerald-600 font-medium">98.5% Réponse</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trade Assurance Detailed Protection Card */}
                            <div className="bg-gradient-to-b from-amber-500/10 to-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3 text-xs text-amber-950 font-normal shadow-2xs">
                                <div className="flex items-center gap-2 font-semibold text-amber-900 border-b border-amber-200/60 pb-2">
                                    <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
                                    <span>Garantie Trade Assurance</span>
                                </div>
                                <p className="text-[11px] text-stone-600 leading-relaxed">
                                    Consignation 100% sécurisée des fonds sur compte séquestre bancaire jusqu'à la vérification physique de votre colis.
                                </p>
                                <div className="space-y-1.5 text-[11px] text-stone-700 pt-1">
                                    <div className="flex items-center gap-1.5">
                                        <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        <span>Inspection Qualité Produit</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        <span>Remboursement Intégral si Défaut</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        <span>Orange Money & MTN MoMo</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* CENTER / MAIN CONTENT (9 COLS) */}
                        <div className="lg:col-span-9 space-y-6">
                            
                            {/* HERO PROMO & INDUSTRY SHOWCASE BANNER */}
                            <div className="relative bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col justify-between min-h-[240px] border border-stone-800">
                                {/* Decorative Glow */}
                                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-amber-500/10 blur-3xl pointer-events-none" />

                                <div className="space-y-3 max-w-xl z-10">
                                    <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3" />
                                        <span>Marketplace B2B / B2C Cameroun</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
                                        Approvisionnez-vous directement auprès des <span className="text-amber-400">Usines & Vendeurs Agréés</span>
                                    </h2>
                                    <p className="text-xs text-stone-300 font-normal leading-relaxed">
                                        Des milliers de références garanties au prix grossiste ou détail avec protection séquestre. Factures certifiées et expédition assurée.
                                    </p>
                                </div>

                                <div className="pt-4 z-10 flex flex-wrap items-center gap-3">
                                    <button 
                                        onClick={() => { setOnSale(true); handleFilterSubmit(); }}
                                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
                                    >
                                        <span>Consulter les Offres Flash</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                    <Link href={route('public.shops.index')}>
                                        <button className="px-4 py-2.5 border border-stone-700 hover:bg-stone-800 text-stone-200 text-xs font-medium rounded-xl transition-colors">
                                            Voir toutes les Boutiques Vérifiées
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* DAILY DEALS / FLASH SALES WITH COUNTDOWN TIMER */}
                            {featuredDeals.length > 0 && (
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-5 h-5 text-red-600 animate-bounce" />
                                            <div>
                                                <h3 className="font-semibold text-stone-900 text-sm">Ventes Flash & Promos Grossistes</h3>
                                                <p className="text-[11px] text-stone-400 font-normal">Offres limitées dans le temps avec livraison directe</p>
                                            </div>
                                        </div>

                                        {/* Countdown Timer */}
                                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-red-700">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Fin dans : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
                                        </div>
                                    </div>

                                    {/* Flash Deals Cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                                        {featuredDeals.map((deal) => {
                                            const img = deal.image_paths && deal.image_paths[0] ? `/storage/${deal.image_paths[0]}` : null;
                                            return (
                                                <div key={deal.id} className="border border-stone-200/70 rounded-xl p-3 bg-stone-50/40 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-2 flex flex-col justify-between group">
                                                    <div>
                                                        <div className="relative w-full h-36 bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                            {img ? (
                                                                <img src={img} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                            ) : (
                                                                <Package className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                                            )}
                                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                                                -{deal.active_promotion.discount_percentage}% OFF
                                                            </span>
                                                        </div>

                                                        <div className="pt-2 space-y-1">
                                                            {deal.shop && (
                                                                <div className="flex items-center justify-between text-[10px] text-stone-400">
                                                                    <span className="truncate font-medium text-stone-600">{deal.shop.name}</span>
                                                                    <span className="text-amber-600 font-semibold">Gold</span>
                                                                </div>
                                                            )}
                                                            <h4 className="font-semibold text-stone-900 text-xs line-clamp-1">{deal.name}</h4>
                                                            <div className="flex items-baseline gap-1.5 text-xs pt-1">
                                                                <span className="font-semibold text-stone-900">
                                                                    {Number(deal.active_promotion.promo_price).toLocaleString()} FCFA
                                                                </span>
                                                                <span className="text-[10px] text-stone-400 line-through font-normal">
                                                                    {Number(deal.price).toLocaleString()} FCFA
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stock Progress bar */}
                                                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                                                        <div className="flex justify-between text-[10px] text-stone-500 font-normal">
                                                            <span>Dispo : <strong>{deal.stock} unités</strong></span>
                                                            <span className="text-emerald-600 font-medium">Verified Escrow</span>
                                                        </div>
                                                        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '70%' }} />
                                                        </div>
                                                        <Link href={route('public.products.show', deal.slug)} className="block pt-1">
                                                            <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-[11px] rounded-lg transition-colors shadow-2xs">
                                                                Acheter Directement
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* BOUTIQUES VÉRIFIÉES SHOWCASE (ALIBABA GOLD SUPPLIER CARDS) */}
                            {topShops.length > 0 && (
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-amber-600" />
                                            <div>
                                                <h3 className="font-semibold text-stone-900 text-sm">Vitrines des Vendeurs Certifiés (Gold Suppliers)</h3>
                                                <p className="text-[11px] text-stone-400 font-normal">Commerçants avec numéro RCCM vérifié et garantie de conformité</p>
                                            </div>
                                        </div>
                                        <Link href={route('public.shops.index')} className="text-xs text-amber-700 font-medium hover:underline">
                                            Tout l'annuaire
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {topShops.slice(0, 4).map((s) => (
                                            <div key={s.id} className="border border-stone-200/70 rounded-xl p-4 bg-stone-50/40 space-y-3 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all flex flex-col justify-between">
                                                <div className="space-y-2">
                                                    <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 overflow-hidden shadow-2xs flex items-center justify-center">
                                                        {s.logo_path ? (
                                                            <img src={`/storage/${s.logo_path}`} alt={s.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Store className="w-5 h-5 text-stone-400 stroke-[1.5]" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <h4 className="font-semibold text-stone-900 text-xs truncate">{s.name}</h4>
                                                            <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                        </div>
                                                        <span className="text-[10px] text-stone-400 font-normal block truncate">{s.slogan || 'Boutique Officielle'}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-normal">
                                                    <div className="flex justify-between">
                                                        <span>Articles en stock :</span>
                                                        <strong className="text-stone-800 font-semibold">{s.products?.length || 0}</strong>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Note Boutique :</span>
                                                        <span className="font-semibold text-stone-900 flex items-center gap-0.5">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            <span>4.9 / 5</span>
                                                        </span>
                                                    </div>
                                                    <Link href={route('shop.public', s.slug)} className="block pt-1">
                                                        <button className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded-lg transition-colors">
                                                            Visiter la Boutique
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MAIN CATALOGUE PRODUCTS GRID WITH TAB FILTERS */}
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                                    <div>
                                        <h3 className="font-semibold text-stone-900 text-sm">Catalogue Général des Produits Recommandés</h3>
                                        <p className="text-[11px] text-stone-400 font-normal">Articles avec livraison garantie sous 24h à 48h</p>
                                    </div>

                                    {/* Quick Filter Tabs */}
                                    <div className="flex items-center gap-1.5 overflow-x-auto">
                                        {[
                                            { id: 'all', label: 'Tous les Articles' },
                                            { id: 'promo', label: 'En Promotion' },
                                            { id: 'under_50k', label: '< 50 000 FCFA' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setActiveTab(t.id);
                                                    if (t.id === 'promo') {
                                                        setOnSale(true);
                                                        handleFilterSubmit();
                                                    } else if (t.id === 'under_50k') {
                                                        setMaxPrice('50000');
                                                        handleFilterSubmit();
                                                    } else {
                                                        handleReset();
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                    activeTab === t.id
                                                        ? 'bg-amber-500 text-amber-950 border-amber-500 font-semibold shadow-2xs'
                                                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                                }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Products Grid */}
                                {products.data.length === 0 ? (
                                    <div className="p-12 text-center space-y-3 font-normal">
                                        <Package className="w-10 h-10 text-stone-300 mx-auto stroke-[1.5]" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-stone-800">Aucun produit ne correspond à votre recherche</p>
                                            <p className="text-xs text-stone-500">Modifiez vos critères de recherche ou réinitialisez les filtres.</p>
                                        </div>
                                        <button onClick={handleReset} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg">
                                            Réinitialiser les filtres
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {products.data.map((product) => {
                                            const hasPromo = product.active_promotion !== null;
                                            const firstImage = product.image_paths && product.image_paths.length > 0 
                                                ? `/storage/${product.image_paths[0]}` 
                                                : null;

                                            return (
                                                <div 
                                                    key={product.id}
                                                    className="border border-stone-200/70 rounded-xl p-3 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                                                >
                                                    <div>
                                                        {/* Image Box */}
                                                        <div className="relative w-full h-40 bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                            {firstImage ? (
                                                                <img 
                                                                    src={firstImage} 
                                                                    alt={product.name} 
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                                                />
                                                            ) : (
                                                                <Package className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                                            )}

                                                            {hasPromo && (
                                                                <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                                                    -{product.active_promotion.discount_percentage}% OFF
                                                                </span>
                                                            )}

                                                            <span className="absolute bottom-1.5 left-1.5 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-normal px-2 py-0.5 rounded-md">
                                                                MOQ : 1 pièce
                                                            </span>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="pt-2.5 space-y-1">
                                                            {product.shop && (
                                                                <div className="flex items-center gap-1 text-[10px] text-stone-500 truncate">
                                                                    <Store className="w-3 h-3 text-amber-600 shrink-0" />
                                                                    <span className="truncate font-medium">{product.shop.name}</span>
                                                                </div>
                                                            )}

                                                            <Link href={route('public.products.show', product.slug)}>
                                                                <h4 className="font-semibold text-stone-900 text-xs line-clamp-2 hover:text-amber-700 transition-colors">
                                                                    {product.name}
                                                                </h4>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="pt-2.5 border-t border-stone-100 mt-2 space-y-2">
                                                        <div className="flex items-baseline justify-between">
                                                            <div>
                                                                {hasPromo ? (
                                                                    <div className="leading-tight">
                                                                        <span className="text-xs font-semibold text-stone-900 block">
                                                                            {Number(product.active_promotion.promo_price).toLocaleString()} FCFA
                                                                        </span>
                                                                        <span className="text-[10px] text-stone-400 line-through font-normal">
                                                                            {Number(product.price).toLocaleString()} FCFA
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs font-semibold text-stone-900 block">
                                                                        {Number(product.price).toLocaleString()} FCFA
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <span className="text-[10px] text-stone-400 font-normal">
                                                                {product.stock} dispo
                                                            </span>
                                                        </div>

                                                        <Link href={route('public.products.show', product.slug)}>
                                                            <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-[11px] rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1">
                                                                <span>Commander Direct via Escrow</span>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* PAGINATION LINKS */}
                                {products.links && products.links.length > 3 && (
                                    <div className="flex justify-center items-center gap-1 pt-4 border-t border-stone-100">
                                        {products.links.map((link, idx) => (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                    link.active
                                                        ? 'bg-amber-500 text-amber-950 border-amber-500 font-semibold'
                                                        : link.url
                                                            ? 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                                            : 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
