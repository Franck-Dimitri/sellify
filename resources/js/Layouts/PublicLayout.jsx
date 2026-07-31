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
    HelpCircle, 
    CreditCard, 
    Store,
    LayoutDashboard,
    LogOut,
    Smartphone,
    Share2
} from 'lucide-react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4] flex flex-col antialiased font-sans text-stone-800">
            
            {/* TOP GREEN ANNOUNCEMENT BANNER */}
            <div className="bg-[#12b886] text-white text-[11px] py-1.5 px-4 font-medium">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-stone-900 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Accio Work</span>
                        </span>
                        <span>L'IA à chaque étape du développement et du commerce sur Sellify.me</span>
                    </div>
                    <a 
                        href="#demo" 
                        className="hidden sm:inline-flex items-center gap-1 hover:underline text-white font-semibold"
                    >
                        <span>Commencez votre essai gratuit</span>
                        <span>&rarr;</span>
                    </a>
                </div>
            </div>

            {/* MAIN HEADER (SELLIFY BRAND AMBER STYLE) */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
                {/* Top Header Utilities Line */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        
                        {/* Logo & Primary Dropdowns */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-1">
                                <span className="text-2xl font-black tracking-tight text-amber-600 italic font-serif">
                                    Sellify<span className="text-stone-900 font-sans not-italic">.me</span>
                                </span>
                            </Link>

                            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-stone-700">
                                <Link href={route('public.products.index')} className="flex items-center gap-1 hover:text-amber-600 transition-colors">
                                    <Menu className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Toutes les catégories</span>
                                </Link>
                                <Link href={route('public.shops.index')} className="flex items-center gap-1 hover:text-amber-600 transition-colors">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Fabricants Verified</span>
                                </Link>
                                <Link href={route('public.products.index', { on_sale: 1 })} className="hover:text-amber-600 transition-colors">
                                    Dropshipping & Escrow
                                </Link>
                            </nav>
                        </div>

                        {/* Right Utility Navigation */}
                        <div className="hidden md:flex items-center gap-5 text-xs font-normal text-stone-600">
                            
                            {/* Delivery Location */}
                            <div className="flex items-center gap-1.5 border-r border-stone-200 pr-4">
                                <span className="text-[10px] text-stone-400">Adresse de livraison :</span>
                                <span className="font-semibold text-stone-800 flex items-center gap-1">
                                    <span>🇨🇲</span>
                                    <span>CM</span>
                                </span>
                            </div>

                            {/* Currency & Language */}
                            <div className="flex items-center gap-1 border-r border-stone-200 pr-4">
                                <Globe className="w-3.5 h-3.5 text-stone-500" />
                                <span className="font-medium text-stone-800">Français-XAF</span>
                            </div>

                            {/* Cart Icon */}
                            <Link href={route('public.products.index')} className="relative p-1 hover:text-amber-600">
                                <ShoppingCart className="w-5 h-5 text-stone-700" />
                                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-amber-950 text-[9px] font-bold flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            {/* Auth Actions */}
                            {auth?.user ? (
                                <div className="flex items-center gap-2 pl-2">
                                    <Link href={route(auth.user.role + '.dashboard')}>
                                        <button className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold rounded-full shadow-2xs flex items-center gap-1.5 transition-colors">
                                            <LayoutDashboard className="w-3.5 h-3.5" />
                                            <span>Mon Dashboard</span>
                                        </button>
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="p-1.5 text-stone-500 hover:text-stone-800">
                                        <LogOut className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 pl-2">
                                    <Link href={route('login')} className="flex items-center gap-1 text-stone-700 hover:text-amber-600 font-medium pr-1">
                                        <UserIcon className="w-4 h-4 text-stone-500" />
                                        <span>Se connecter</span>
                                    </Link>
                                    <Link href={route('register')}>
                                        <button className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold rounded-full shadow-xs transition-colors">
                                            Créer un compte
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-600">
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Sub-Header Navigation Links Strip */}
                <div className="hidden lg:block bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 py-1.5">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-6 font-normal">
                        <Link href="/" className="hover:text-amber-600">À propos de Sellify.me</Link>
                        <Link href="/" className="hover:text-amber-600">Exonération de taxes</Link>
                        <Link href="/" className="hover:text-amber-600">Centre d'aide</Link>
                        <Link href="/" className="hover:text-amber-600">Accio Work</Link>
                        <Link href={route('register')} className="text-amber-600 font-semibold hover:underline">Vendre sur Sellify.me</Link>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 text-xs font-medium">
                        <Link href="/" className="block py-1.5 text-stone-800">Accueil</Link>
                        <Link href={route('public.products.index')} className="block py-1.5 text-stone-800">Catalogue Produits</Link>
                        <Link href={route('public.shops.index')} className="block py-1.5 text-stone-800">Fabricants Verified</Link>
                        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                            {auth?.user ? (
                                <Link href={route(auth.user.role + '.dashboard')} className="w-full">
                                    <button className="w-full py-2 bg-amber-500 text-amber-950 font-bold rounded-lg text-xs">
                                        Mon Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="w-full">
                                        <button className="w-full py-2 border border-stone-300 text-stone-800 rounded-lg text-xs font-medium">Se connecter</button>
                                    </Link>
                                    <Link href={route('register')} className="w-full">
                                        <button className="w-full py-2 bg-amber-500 text-amber-950 font-bold rounded-lg text-xs">Créer un compte</button>
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
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg flex items-center justify-between text-xs font-medium">
                        <span>{usePage().props.flash.success}</span>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-grow">
                {children}
            </main>

            {/* FLOATING RIGHT ACTION SIDEBAR */}
            <div className="fixed right-3 bottom-6 z-50 flex flex-col gap-2">
                <button 
                    title="Messagerie"
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-md text-stone-700 hover:text-amber-600 flex flex-col items-center justify-center text-[9px] font-medium transition-all group"
                >
                    <MessageSquare className="w-4 h-4 text-stone-600 group-hover:text-amber-600" />
                    <span>Message</span>
                </button>
                <button 
                    title="Accio Work"
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-md text-stone-700 hover:text-amber-600 flex flex-col items-center justify-center text-[9px] font-medium transition-all group"
                >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Accio</span>
                </button>
                <button 
                    title="Sellify Lens"
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-md text-stone-700 hover:text-amber-600 flex flex-col items-center justify-center text-[9px] font-medium transition-all group"
                >
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>Lens</span>
                </button>
                <button 
                    onClick={scrollToTop}
                    title="Haut de page"
                    className="w-10 h-10 rounded-xl bg-stone-900 text-white shadow-md hover:bg-amber-500 hover:text-amber-950 flex flex-col items-center justify-center text-[9px] font-medium transition-all"
                >
                    <ArrowUp className="w-4 h-4" />
                    <span>Haut</span>
                </button>
            </div>

            {/* COMPREHENSIVE FOOTER */}
            <footer className="bg-white border-t border-stone-200 text-stone-600 pt-12 pb-8 text-xs font-normal">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* 5 Main Columns Navigation */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-stone-100 pb-10">
                        
                        {/* Col 1 */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-stone-900 text-xs">À propos de Sellify.me</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500">
                                <li><a href="#" className="hover:underline">Pourquoi Sellify ?</a></li>
                                <li><a href="#" className="hover:underline">Co-Create Pitch</a></li>
                                <li><a href="#" className="hover:underline">Engagements RSE</a></li>
                                <li><a href="#" className="hover:underline">Carrières</a></li>
                            </ul>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-stone-900 text-xs">Protection de commande</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500">
                                <li><a href="#" className="hover:underline">Paiements sécurisés Escrow</a></li>
                                <li><a href="#" className="hover:underline">Satisfait ou Remboursé</a></li>
                                <li><a href="#" className="hover:underline">Livraison dans les délais garantie</a></li>
                                <li><a href="#" className="hover:underline">Protection après-vente</a></li>
                                <li><a href="#" className="hover:underline">Suivi de production et d'inspection</a></li>
                                <li><a href="#" className="hover:underline">Politiques et réglementations</a></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-stone-900 text-xs">Approvisionnez-vous</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500">
                                <li><Link href={route('public.shops.index')} className="hover:underline">Fabricants Verified</Link></li>
                                <li><a href="#" className="hover:underline">Demander un devis (RFQ)</a></li>
                                <li><Link href={route('public.products.index')} className="hover:underline">Catalogue Produits</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-stone-900 text-xs">Centre d'assistance</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500">
                                <li><a href="#" className="hover:underline">Centre d'aide aux acheteurs</a></li>
                                <li><a href="#" className="hover:underline">Chat en direct</a></li>
                                <li><a href="#" className="hover:underline">Ouvrir un litige commercial</a></li>
                                <li><a href="#" className="hover:underline">Demandes de remboursement</a></li>
                                <li><a href="#" className="hover:underline">Signaler une infraction IP</a></li>
                            </ul>
                        </div>

                        {/* Col 5 */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-stone-900 text-xs">Vendre sur Sellify.me</h4>
                            <ul className="space-y-2 text-[11px] text-stone-500">
                                <li><Link href={route('register')} className="hover:underline font-semibold text-amber-600">Démarrer sur Sellify</Link></li>
                                <li><a href="#" className="hover:underline">Suivi de commande</a></li>
                                <li><a href="#" className="hover:underline">Devenir fournisseur vérifié</a></li>
                                <li><a href="#" className="hover:underline">Partenariats</a></li>
                            </ul>

                            <div className="pt-2">
                                <h5 className="font-bold text-stone-900 text-[11px] mb-2">Restez connecté</h5>
                                <div className="flex items-center gap-3 text-stone-500 text-xs">
                                    <span className="hover:text-stone-900 cursor-pointer font-bold border border-stone-200 px-2 py-0.5 rounded">Facebook</span>
                                    <span className="hover:text-stone-900 cursor-pointer font-bold border border-stone-200 px-2 py-0.5 rounded">LinkedIn</span>
                                    <span className="hover:text-stone-900 cursor-pointer font-bold border border-stone-200 px-2 py-0.5 rounded">Twitter</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Payment Icons Strip & App Downloads */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-8">
                        
                        {/* Payment Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-stone-500">
                            <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200">ID Check</span>
                            <span className="px-2 py-1 bg-amber-500 text-amber-950 rounded">Orange Money</span>
                            <span className="px-2 py-1 bg-amber-400 text-stone-900 rounded">MTN MoMo</span>
                            <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 text-blue-700">VISA</span>
                            <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 text-red-600">MasterCard</span>
                            <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 text-blue-900">PayPal</span>
                            <span className="px-2 py-1 bg-stone-900 text-white rounded">Apple Pay</span>
                            <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200">G Pay</span>
                            <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200">T/T Virements</span>
                        </div>

                        {/* Mobile Apps */}
                        <div className="flex items-center gap-3">
                            <button className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
                                <Smartphone className="w-3.5 h-3.5 text-white" />
                                <span>App Store</span>
                            </button>
                            <button className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
                                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                                <span>Google Play</span>
                            </button>
                        </div>
                    </div>

                    {/* Legal Copyright Bar */}
                    <div className="text-center text-[11px] text-stone-400 space-y-2">
                        <div className="flex justify-center flex-wrap gap-4 text-stone-500 font-normal">
                            <a href="#" className="hover:underline">Mentions légales</a>
                            <span>•</span>
                            <a href="#" className="hover:underline">Règles de mise en vente des produits</a>
                            <span>•</span>
                            <a href="#" className="hover:underline">Droits de propriété intellectuelle</a>
                            <span>•</span>
                            <a href="#" className="hover:underline">Politique de confidentialité</a>
                            <span>•</span>
                            <a href="#" className="hover:underline">Conditions d'utilisation</a>
                        </div>
                        <p>&copy; {new Date().getFullYear()} Sellify.me. Tous droits réservés. Plateforme de Commerce B2B & B2C Cameroun & Afrique Centrale.</p>
                    </div>

                </div>
            </footer>

        </div>
    );
}
