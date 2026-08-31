import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Logos3 } from '@/Components/ui/logos3';
import { FeaturesSectionWithHoverEffects } from '@/Components/ui/feature-section-with-hover-effects';
import { PricingSection } from '@/Components/ui/PricingSection';
import { 
    Search, 
    Sparkles, 
    ShieldCheck, 
    Truck, 
    ArrowRight, 
    CheckCircle2, 
    Star, 
    Flame, 
    Store, 
    Package, 
    BadgeCheck, 
    Smartphone, 
    CreditCard, 
    MapPin, 
    Clock, 
    ChevronRight,
    Users,
    TrendingUp,
    Lock,
    Zap,
    Shirt,
    Home as HomeIcon,
    Car,
    Building2,
    Check,
    MessageCircle,
    Play
} from 'lucide-react';

export default function Welcome({ 
    featuredDeals = [], 
    topShops = [], 
    categories = [] 
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activePersona, setActivePersona] = useState('sellers'); // 'sellers', 'buyers', 'drivers'
    const [activeStep, setActiveStep] = useState(1);

    // Auto rotate step showcase every 5s
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev % 4) + 1);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('public.products.index'), { search: searchQuery });
        } else {
            router.get(route('public.products.index'));
        }
    };

    const categoriesList = [
        { id: 'tech', name: 'High-Tech & Smartphones', count: '124+', icon: Smartphone },
        { id: 'fashion', name: 'Mode & Bazin Africain', count: '88+', icon: Shirt },
        { id: 'home', name: 'Maison & Électroménager', count: '54+', icon: HomeIcon },
        { id: 'beauty', name: 'Beauté & Soins Bio', count: '42+', icon: Sparkles },
        { id: 'auto', name: 'Auto, Moto & Pièces', count: '31+', icon: Car },
        { id: 'food', name: 'Alimentation & Terroir', count: '29+', icon: Package },
    ];

    const pipelineSteps = [
        {
            num: "01",
            step: 1,
            title: "Créez votre boutique & Catalogue en 2 min",
            description: "Ajoutez vos articles avec photos, prix en FCFA et options de livraison sans aucune compétence technique.",
            tag: "Boutique Officielle",
            badgeColor: "bg-amber-100 text-yellow-900 border-yellow-300",
        },
        {
            num: "02",
            step: 2,
            title: "Partagez vos Smart-Links WhatsApp en 1 Clic",
            description: "Envoyez des liens de commande pré-remplis sur WhatsApp, TikTok et Instagram. Le client clique et valide son panier immédiatement.",
            tag: "Smart-Link Express",
            badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
        },
        {
            num: "03",
            step: 3,
            title: "Paiement Sécurisé sous Séquestre Escrow",
            description: "L'acheteur règle par Orange Money ou MTN MoMo. Les fonds sont consignés en sécurité chez Sellify jusqu'à la livraison.",
            tag: "Protection 100%",
            badgeColor: "bg-yellow-100 text-yellow-950 border-yellow-400",
        },
        {
            num: "04",
            step: 4,
            title: "Dispatch IA du Coursier & Déblocage par OTP",
            description: "Le livreur le plus proche prend en charge le colis, le remet en main propre et l'acheteur communique son code secret pour libérer les gains.",
            tag: "Validation OTP",
            badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
        },
    ];

    return (
        <PublicLayout>
            <Head title="Sellify.me - La Première Marketplace Sécurisée d'Afrique" />

            <div className="w-full bg-[#fbf9f5] font-sans text-stone-700 antialiased overflow-hidden">
                
                {/* 1. HERO SECTION (INSPIRED BY QUSO.AI & PROJECTY) */}
                <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 border-b border-stone-200/80">
                    
                    {/* Background Dot Matrix Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />
                    
                    {/* Soft Ambient Glows */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[400px] bg-gradient-to-tr from-yellow-300/20 via-amber-200/20 to-orange-200/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
                        
                        {/* Top Trust Social Pill */}
                        <div className="flex items-center justify-center">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs text-xs text-stone-600 animate-fade-in">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                    <div className="w-5 h-5 rounded-full bg-yellow-400 border border-white flex items-center justify-center text-[9px] font-bold text-stone-950">A</div>
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[9px] font-bold text-white">M</div>
                                    <div className="w-5 h-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] font-bold text-white">D</div>
                                    <div className="w-5 h-5 rounded-full bg-amber-600 border border-white flex items-center justify-center text-[9px] font-bold text-white">P</div>
                                </div>
                                <span className="font-semibold text-stone-900">+50 000 commerçants & acheteurs</span>
                                <span className="text-stone-300">•</span>
                                <span className="text-yellow-700 font-medium flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Garantie Escrow</span>
                                </span>
                            </div>
                        </div>

                        {/* Main Hero Headline */}
                        <div className="text-center max-w-4xl mx-auto space-y-4">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-stone-950 tracking-tight leading-[1.15] text-pretty">
                                Achetez et vendez partout en Afrique en toute <span className="relative inline-block text-stone-950 underline decoration-yellow-400 decoration-wavy decoration-2">confiance</span>
                            </h1>

                            <p className="text-sm sm:text-base lg:text-lg text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
                                La première plateforme panafricaine qui sécurise vos transactions par <strong>séquestre Escrow</strong>, booste vos ventes WhatsApp par <strong>Smart-Links</strong> et optimise vos livraisons par <strong>IA</strong>.
                            </p>
                        </div>

                        {/* Search Bar Interactive Hero Input */}
                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border-2 border-stone-200 focus-within:border-yellow-400 rounded-2xl shadow-lg p-1.5 pl-4 transition-all">
                                <Search className="w-5 h-5 text-stone-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit, une boutique ou une ville (ex: iPhone, Bazin, Douala)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-none text-xs sm:text-sm text-stone-900 focus:ring-0 outline-none placeholder:text-stone-400 px-3 font-normal"
                                />
                                <button
                                    type="submit"
                                    className="px-5 sm:px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Explorer</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        {/* Hero 3D Composition & Interactive Bento Mockup (Convertio & Projecty inspired) */}
                        <div className="relative pt-6 max-w-5xl mx-auto">
                            
                            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xl space-y-6">
                                
                                {/* Top Browser/App Bar */}
                                <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-xs text-stone-400">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <span className="text-[11px] font-mono text-stone-500 pl-2">sellify.me/app/ecosystem</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                        <span>Séquestre Actif</span>
                                    </span>
                                </div>

                                {/* Dual Visual Canvas */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    
                                    {/* Left: 3D Illustration Showcase */}
                                    <div className="md:col-span-7 relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-16/10 bg-stone-100 border border-stone-200 shadow-inner flex items-center justify-center">
                                        <img 
                                            src="/images/landing-hero.jpg" 
                                            alt="Sellify Panafrican Marketplace" 
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Floating Badge 1: Escrow Protected */}
                                        <div className="absolute top-4 left-4 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-lg flex items-center gap-2.5 animate-float">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-stone-400 block font-normal">Protection Achat</span>
                                                <span className="text-xs font-semibold text-stone-900">Séquestre 100% Détenu</span>
                                            </div>
                                        </div>

                                        {/* Floating Badge 2: Mobile Money */}
                                        <div className="absolute bottom-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-lg flex items-center gap-2.5 animate-float-reverse">
                                            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-yellow-700 font-bold text-xs">
                                                MoMo
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-stone-400 block font-normal">Paiement Mobile</span>
                                                <span className="text-xs font-semibold text-stone-900">Orange & MTN Validés</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Live Interactive Workflow Bento Cards */}
                                    <div className="md:col-span-5 space-y-3">
                                        
                                        <div className="p-4 bg-[#fcfbf9] rounded-2xl border border-stone-200/80 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-yellow-800 uppercase bg-amber-100 px-2 py-0.5 rounded-md">Smart-Link Actif</span>
                                                <span className="text-[11px] font-mono text-stone-400">SL-89412</span>
                                            </div>
                                            <h4 className="font-semibold text-stone-900 text-xs">iPhone 15 Pro Max 256Go</h4>
                                            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                                                <span className="text-stone-500 font-normal">Total Consigné :</span>
                                                <span className="font-semibold text-stone-900">890 000 FCFA</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-[#fcfbf9] rounded-2xl border border-stone-200/80 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">Livreur en Route</span>
                                                <span className="text-[11px] font-medium text-emerald-600">Arrivée 18 min</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 pt-1">
                                                <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-xs">
                                                    YA
                                                </div>
                                                <div className="text-left">
                                                    <span className="font-medium text-xs text-stone-900 block">Yvan Assomo (Moto Express)</span>
                                                    <span className="text-[10px] text-stone-400 font-normal">Douala • Akwa vers Bonapriso</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-yellow-950">
                                                <Lock className="w-3.5 h-3.5 text-yellow-700" />
                                                <span>Code Secret Déblocage OTP</span>
                                            </div>
                                            <p className="text-[11px] text-yellow-900 font-normal leading-relaxed">
                                                Le vendeur n'est crédité que lorsque vous inspectez le colis et communiquez votre code à la livraison.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Category Hub Pills */}
                        <div className="pt-4">
                            <div className="text-center mb-3">
                                <span className="text-xs text-stone-400 font-normal">Rayons populaires disponibles immédiatement :</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2.5">
                                {categoriesList.map((cat) => {
                                    const IconCmp = cat.icon;
                                    return (
                                        <Link 
                                            key={cat.id} 
                                            href={route('public.products.index', { category: cat.id })}
                                            className="px-4 py-2 bg-white hover:bg-yellow-400 border border-stone-200/80 hover:border-yellow-400 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-200 flex items-center gap-2 group cursor-pointer"
                                        >
                                            <IconCmp className="w-4 h-4 text-stone-500 group-hover:text-stone-950 transition-colors" />
                                            <span className="text-xs font-medium text-stone-800 group-hover:text-stone-950">{cat.name}</span>
                                            <span className="text-[10px] text-stone-400 group-hover:text-stone-800">({cat.count})</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </section>

                {/* 2. PARTNERS AUTO-SCROLL MARQUEE (LOGOS3) */}
                <Logos3 />

                {/* 3. INTERACTIVE HOW IT WORKS PIPELINE (CONVERTIO STYLE - IMAGE 2) */}
                <section className="py-16 md:py-24 border-b border-stone-200/80 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        
                        <div className="text-center space-y-3">
                            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                                Fonctionnement Simple & Transparent
                            </span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight">
                                Comment Sellify sécurise chaque étape de votre vente
                            </h2>
                            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto font-normal">
                                Une chaîne de valeur fluide du clic sur WhatsApp jusqu'à la remise du colis en main propre.
                            </p>
                        </div>

                        {/* Interactive Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pipelineSteps.map((pStep) => (
                                <div
                                    key={pStep.step}
                                    onClick={() => setActiveStep(pStep.step)}
                                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                                        activeStep === pStep.step
                                            ? 'bg-amber-50/60 border-yellow-400 shadow-md ring-2 ring-yellow-400/20'
                                            : 'bg-[#fcfbf9] border-stone-200/80 hover:border-yellow-400 hover:bg-white shadow-2xs'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-mono font-bold text-stone-400">
                                                {pStep.num}
                                            </span>
                                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${pStep.badgeColor}`}>
                                                {pStep.tag}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-sm text-stone-900 leading-snug">
                                            {pStep.title}
                                        </h3>
                                        <p className="text-xs text-stone-500 leading-relaxed font-normal">
                                            {pStep.description}
                                        </p>
                                    </div>

                                    <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-yellow-900">
                                        <span>Étape {pStep.step}</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-yellow-600" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pipeline Showcase Visual Card */}
                        <div className="bg-[#fbf9f5] border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                
                                <div className="lg:col-span-5 space-y-4">
                                    <span className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">
                                        Étape Active • {pipelineSteps[activeStep - 1].tag}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 leading-tight">
                                        {pipelineSteps[activeStep - 1].title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                        {pipelineSteps[activeStep - 1].description}
                                    </p>
                                    <div className="pt-2">
                                        <Link href={route('register')}>
                                            <button className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer">
                                                <span>Tester la plateforme</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
                                    {activeStep === 1 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                                                <span className="font-semibold text-stone-900">Catalogue & Produits</span>
                                                <span className="text-emerald-600 font-medium">Boutique Prête</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center space-y-1">
                                                    <Smartphone className="w-6 h-6 text-yellow-600 mx-auto" />
                                                    <span className="text-[11px] font-semibold block text-stone-900">High-Tech</span>
                                                </div>
                                                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center space-y-1">
                                                    <Shirt className="w-6 h-6 text-yellow-600 mx-auto" />
                                                    <span className="text-[11px] font-semibold block text-stone-900">Bazin & Mode</span>
                                                </div>
                                                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center space-y-1">
                                                    <Package className="w-6 h-6 text-yellow-600 mx-auto" />
                                                    <span className="text-[11px] font-semibold block text-stone-900">Épicerie Bio</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 2 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                                                <span className="font-semibold text-stone-900">Lien Généré pour WhatsApp</span>
                                                <span className="text-emerald-600 font-medium">Prêt au partage</span>
                                            </div>
                                            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 font-mono text-xs text-emerald-950">
                                                <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-emerald-900">
                                                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                                                    <span>sellify.me/pay/sl_iphone15promax</span>
                                                </div>
                                                <p className="font-sans text-[11px] text-stone-600">
                                                    "Bonjour, voici votre lien de commande direct avec paiement Escrow et livraison express."
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 3 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                                                <span className="font-semibold text-stone-900">Statut du Compte Séquestre</span>
                                                <span className="text-emerald-600 font-medium">Fonds Verrouillés</span>
                                            </div>
                                            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] text-stone-400 uppercase font-medium">Montant Consigné</span>
                                                    <p className="text-base font-semibold text-stone-900">890 000 FCFA</p>
                                                </div>
                                                <span className="px-3 py-1 bg-yellow-400 text-stone-950 font-semibold text-xs rounded-full">
                                                    En Attente de Livraison
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 4 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                                                <span className="font-semibold text-stone-900">Confirmation de Livraison</span>
                                                <span className="text-emerald-600 font-medium">Déblocage Effectué</span>
                                            </div>
                                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-950">
                                                <div className="flex items-center gap-1.5 font-semibold">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    <span>Code OTP validé avec succès (4 chiffres)</span>
                                                </div>
                                                <p className="text-[11px] text-stone-600 font-normal">
                                                    Les 890 000 FCFA ont été crédités immédiatement sur le compte Orange Money du commerçant.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* 4. 8 FEATURES GRID WITH HOVER GLOW EFFECTS */}
                <FeaturesSectionWithHoverEffects />

                {/* 5. PERSONAS HUB (SELLERS, BUYERS, DRIVERS) */}
                <section className="py-16 md:py-24 border-b border-stone-200/80 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        
                        <div className="text-center space-y-3">
                            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                                Un Écosystème Créé pour Tous
                            </span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight">
                                Une solution sur-mesure pour chaque acteur du commerce
                            </h2>
                        </div>

                        {/* Persona Tabs */}
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setActivePersona('sellers')}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                                    activePersona === 'sellers'
                                        ? 'bg-yellow-400 text-stone-950 shadow-md scale-102'
                                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                                }`}
                            >
                                Pour les Vendeurs & Grossistes
                            </button>

                            <button
                                onClick={() => setActivePersona('buyers')}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                                    activePersona === 'buyers'
                                        ? 'bg-yellow-400 text-stone-950 shadow-md scale-102'
                                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                                }`}
                            >
                                Pour les Acheteurs
                            </button>

                            <button
                                onClick={() => setActivePersona('drivers')}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                                    activePersona === 'drivers'
                                        ? 'bg-yellow-400 text-stone-950 shadow-md scale-102'
                                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                                }`}
                            >
                                Pour les Livreurs & Coursiers
                            </button>
                        </div>

                        {/* Persona Dynamic Showcase */}
                        <div className="bg-[#fbf9f5] border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                
                                <div className="lg:col-span-6 space-y-4">
                                    {activePersona === 'sellers' && (
                                        <>
                                            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
                                                Commerçants, Fabricants & Marques
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-semibold text-stone-900">
                                                Multipliez vos ventes sans crainte d'impayés
                                            </h3>
                                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                                Ne perdez plus de temps avec les clients hésitants sur WhatsApp. Générez des Smart-Links de paiement sécurisé, rassurez vos acheteurs avec la garantie Escrow et recevez vos fonds directement sur votre Mobile Money dès la livraison.
                                            </p>
                                            <ul className="space-y-2 text-xs text-stone-700 font-medium">
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Encaissement garanti avant expédition du colis</li>
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Boutique officielle avec gestion de stock en temps réel</li>
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Retraits instantanés Orange Money & MTN MoMo</li>
                                            </ul>
                                        </>
                                    )}

                                    {activePersona === 'buyers' && (
                                        <>
                                            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                                                Acheteurs Particuliers & Pros
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-semibold text-stone-900">
                                                Commandez en toute sérénité, zéro risque d'arnaque
                                            </h3>
                                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                                Finies les mauvaises surprises ! Votre argent ne va pas directement au vendeur : il est bloqué chez Sellify jusqu'à ce que vous receviez, ouvriez et validiez votre article en mains propres.
                                            </p>
                                            <ul className="space-y-2 text-xs text-stone-700 font-medium">
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Contrôle physique du colis avant validation du code OTP</li>
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Remboursement intégral garanti en cas de produit non-conforme</li>
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Suivi GPS en direct du coursier sur votre téléphone</li>
                                            </ul>
                                        </>
                                    )}

                                    {activePersona === 'drivers' && (
                                        <>
                                            <span className="text-[11px] font-semibold text-yellow-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
                                                Coursiers & Flottes de Livraison
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-semibold text-stone-900">
                                                Rejoignez le réseau logistique et gagnez chaque jour
                                            </h3>
                                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                                Recevez des courses optimisées par intelligence artificielle directement sur votre smartphone. Vos gains de livraison sont versés quotidiennement sur votre compte Mobile Money.
                                            </p>
                                            <ul className="space-y-2 text-xs text-stone-700 font-medium">
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Tournées optimisées avec navigation GPS intégrée</li>
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Paiements quotidiens automatiques sans frais cachés</li>
                                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Bonus et primes pour les livreurs les plus rapides</li>
                                            </ul>
                                        </>
                                    )}

                                    <div className="pt-3">
                                        <Link href={route('register')}>
                                            <button className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
                                                <span>Rejoindre Sellify gratuitement</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-4/3 sm:aspect-16/10 bg-white border border-stone-200 shadow-md">
                                    <img 
                                        src={
                                            activePersona === 'sellers' 
                                                ? '/images/seller-step1.jpg' 
                                                : (activePersona === 'buyers' ? '/images/buyer-onboarding.jpg' : '/images/driver-step2.jpg')
                                        } 
                                        alt="Persona Showcase" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                {/* 6. COMPLETE PRICING SECTION (0$, 5$, 20$, 200$) */}
                <PricingSection />

                {/* 7. BOTTOM HIGH-CONVERSION CTA BANNER */}
                <section className="py-16 bg-stone-950 text-white relative overflow-hidden">
                    
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                        <span className="text-[11px] font-semibold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full inline-block">
                            Propulsez Votre Commerce Dès Aujourd'hui
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                            Prêt à révolutionner vos ventes en Afrique ?
                        </h2>

                        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-normal leading-relaxed">
                            Créez votre boutique en 2 minutes, activez la protection Escrow et commencez à encaisser vos paiements Mobile Money en toute sécurité.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href={route('register')}>
                                <button className="w-full sm:w-auto px-7 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    <span>Commencer Gratuitement (0$)</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>

                            <Link href={route('public.products.index')}>
                                <button className="w-full sm:w-auto px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs sm:text-sm rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    <span>Visiter le Store Marketplace</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
