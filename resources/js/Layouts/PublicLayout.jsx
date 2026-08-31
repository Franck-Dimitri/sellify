import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Search, 
    ShoppingCart, 
    User as UserIcon, 
    Globe, 
    ChevronDown, 
    Menu, 
    X, 
    MessageSquare, 
    Sparkles, 
    Camera, 
    ArrowUp, 
    CheckCircle2, 
    ShieldCheck, 
    Truck, 
    Lock, 
    Store,
    LayoutDashboard,
    LogOut,
    Smartphone,
    ShoppingBag
} from 'lucide-react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#fcfbf9] flex flex-col antialiased font-sans text-stone-700">
            
            {/* TOP ANNOUNCEMENT BANNER */}
            <div className="bg-stone-900 text-stone-200 text-[11px] py-1.5 px-4 font-normal">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-yellow-400 text-stone-950 font-semibold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-stone-950" />
                            <span>Escrow Protégé</span>
                        </span>
                        <span className="text-stone-300">Paiements sous séquestre sécurisés par Orange Money, MTN MoMo & Wave</span>
                    </div>
                    <Link 
                        href={route('register')} 
                        className="hidden sm:inline-flex items-center gap-1 hover:text-yellow-400 text-stone-200 font-medium transition-colors"
                    >
                        <span>Ouvrir une boutique</span>
                        <span>&rarr;</span>
                    </Link>
                </div>
            </div>

            {/* MAIN HEADER */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        
                        {/* Logo & Primary Dropdowns */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="inline-flex items-center space-x-2 group">
                                <span className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center font-bold text-stone-900 shadow-2xs group-hover:scale-105 transition-transform">
                                    S
                                </span>
                                <span className="font-semibold text-xl tracking-tight text-stone-900">
                                    Sellify<span className="text-yellow-600">.me</span>
                                </span>
                            </Link>

                            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-stone-600">
                                <Link href={route('public.products.index')} className="flex items-center gap-1 hover:text-yellow-700 transition-colors">
                                    <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Store & Produits</span>
                                </Link>
                                <Link href={route('public.shops.index')} className="flex items-center gap-1 hover:text-yellow-700 transition-colors">
                                    <Store className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Boutiques & Fabricants</span>
                                </Link>
                                <Link href={route('public.products.index', { on_sale: 1 })} className="flex items-center gap-1 hover:text-yellow-700 transition-colors">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                                    <span>Ventes Flash</span>
                                </Link>
                            </nav>
                        </div>

                        {/* Right Utility Navigation */}
                        <div className="hidden md:flex items-center gap-4 text-xs font-normal text-stone-600">
                            
                            {/* Delivery Location */}
                            <div className="flex items-center gap-1.5 border-r border-stone-200 pr-3">
                                <span className="text-[11px] text-stone-400">Livraison :</span>
                                <span className="font-medium text-stone-800 flex items-center gap-1 text-[11px]">
                                    <span>🇨🇲</span>
                                    <span>Cameroun</span>
                                </span>
                            </div>

                            {/* Cart Icon */}
                            <Link href={route('public.cart.index')} className="relative p-1.5 hover:text-yellow-700 text-stone-700 transition-colors">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-stone-950 text-[9px] font-semibold flex items-center justify-center shadow-2xs">
                                    0
                                </span>
                            </Link>

                            {/* Auth Actions */}
                            {auth?.user ? (
                                <div className="flex items-center gap-2 pl-2">
                                    <Link href={route(auth.user.role + '.dashboard')}>
                                        <button className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer">
                                            <LayoutDashboard className="w-3.5 h-3.5" />
                                            <span>Mon Dashboard</span>
                                        </button>
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
                                        <LogOut className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 pl-2">
                                    <Link href={route('login')} className="flex items-center gap-1 text-stone-700 hover:text-yellow-700 font-medium px-2 py-1 transition-colors">
                                        <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                                        <span>Se connecter</span>
                                    </Link>
                                    <Link href={route('register')}>
                                        <button className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer">
                                            Créer un compte
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-600 cursor-pointer">
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 text-xs font-medium">
                        <Link href="/" className="block py-1.5 text-stone-800">Accueil</Link>
                        <Link href={route('public.products.index')} className="block py-1.5 text-stone-800">Store & Catalogue</Link>
                        <Link href={route('public.shops.index')} className="block py-1.5 text-stone-800">Boutiques & Fabricants</Link>
                        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                            {auth?.user ? (
                                <Link href={route(auth.user.role + '.dashboard')} className="w-full">
                                    <button className="w-full py-2 bg-yellow-400 text-stone-950 font-semibold rounded-xl text-xs">
                                        Mon Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="w-full">
                                        <button className="w-full py-2 border border-stone-200 text-stone-800 rounded-xl text-xs font-medium">Se connecter</button>
                                    </Link>
                                    <Link href={route('register')} className="w-full">
                                        <button className="w-full py-2 bg-yellow-400 text-stone-950 font-semibold rounded-xl text-xs">Créer un compte</button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {usePage().props.flash?.success && (
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-3 w-full">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl flex items-center justify-between text-xs font-medium">
                        <span>{usePage().props.flash.success}</span>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-grow">
                {children}
            </main>

            {/* FLOATING ACTION SIDEBAR */}
            <div className="fixed right-3 bottom-6 z-50 flex flex-col gap-2">
                <button 
                    onClick={scrollToTop}
                    title="Haut de page"
                    className="w-10 h-10 rounded-xl bg-stone-900 text-white shadow-md hover:bg-yellow-400 hover:text-stone-950 flex flex-col items-center justify-center text-[9px] font-medium transition-all cursor-pointer"
                >
                    <ArrowUp className="w-4 h-4" />
                    <span>Haut</span>
                </button>
            </div>

            {/* FOOTER */}
            <footer className="bg-white border-t border-stone-200 text-stone-600 pt-12 pb-8 text-xs font-normal">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-stone-100 pb-10">
                        
                        {/* Col 1 */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-stone-900 text-xs">À propos de Sellify.me</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500 font-normal">
                                <li><Link href="/" className="hover:underline">Présentation & Vision</Link></li>
                                <li><Link href={route('public.shops.index')} className="hover:underline">Boutiques Partenaires</Link></li>
                                <li><Link href={route('register')} className="hover:underline">Devenir Vendeur</Link></li>
                                <li><Link href={route('register')} className="hover:underline">Devenir Livreur</Link></li>
                            </ul>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-stone-900 text-xs">Protection & Escrow</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500 font-normal">
                                <li><span className="text-stone-500">Paiements sous séquestre Escrow</span></li>
                                <li><span className="text-stone-500">Validation par code secret OTP</span></li>
                                <li><span className="text-stone-500">Suivi du livreur par GPS</span></li>
                                <li><span className="text-stone-500">Médiation & Résolution des litiges</span></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-stone-900 text-xs">Le Store & Catalogue</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500 font-normal">
                                <li><Link href={route('public.products.index')} className="hover:underline">Tous les produits</Link></li>
                                <li><Link href={route('public.products.index', { on_sale: 1 })} className="hover:underline">Ventes Flash du jour</Link></li>
                                <li><Link href={route('public.shops.index')} className="hover:underline">Fabricants vérifiés</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-stone-900 text-xs">Moyens de Paiement</h4>
                            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-medium text-stone-600">
                                <span className="px-2 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">Orange Money</span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-300">MTN MoMo</span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">Wave</span>
                                <span className="px-2 py-1 bg-stone-100 text-stone-800 rounded-lg border border-stone-200">Carte Bancaire</span>
                            </div>
                        </div>

                    </div>

                    {/* Legal Copyright Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400 font-normal pt-2">
                        <p>&copy; {new Date().getFullYear()} Sellify.me • La Première Marketplace Sécurisée d'Afrique.</p>
                        <div className="flex items-center gap-4 text-stone-500">
                            <Link href={route('legal.privacy')} className="hover:underline hover:text-stone-800">Politique de Confidentialité</Link>
                            <span>•</span>
                            <Link href={route('legal.terms')} className="hover:underline hover:text-stone-800">CGU / CGV</Link>
                            <span>•</span>
                            <Link href={route('legal.escrow')} className="hover:underline hover:text-stone-800">Protocole Escrow & Mentions Légales</Link>
                        </div>
                    </div>

                </div>
            </footer>

        </div>
    );
}
