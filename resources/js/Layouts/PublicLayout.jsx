import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Button from '../Components/ui/Button';
import { LogOut, User as UserIcon, LayoutDashboard, Menu, X, ShoppingBag, Store, Home } from 'lucide-react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col antialiased font-sans text-stone-800">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2.5">
                                <span className="w-8.5 h-8.5 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-amber-950 shadow-xs text-base">S</span>
                                <span className="font-semibold text-xl tracking-tight text-stone-900">
                                    Sellify<span className="text-amber-600">.me</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-stone-600">
                            <Link 
                                href="/" 
                                className={`flex items-center space-x-1.5 transition-colors ${route().current('welcome') ? 'text-amber-700 font-semibold' : 'hover:text-stone-900'}`}
                            >
                                <Home className="w-3.5 h-3.5" />
                                <span>Accueil</span>
                            </Link>

                            <Link 
                                href={route('public.products.index')} 
                                className={`flex items-center space-x-1.5 transition-colors ${route().current('public.products.*') ? 'text-amber-700 font-semibold' : 'hover:text-stone-900'}`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Catalogue Produits</span>
                            </Link>

                            <Link 
                                href={route('public.shops.index')} 
                                className={`flex items-center space-x-1.5 transition-colors ${route().current('public.shops.*') ? 'text-amber-700 font-semibold' : 'hover:text-stone-900'}`}
                            >
                                <Store className="w-3.5 h-3.5" />
                                <span>Boutiques Vérifiées</span>
                            </Link>
                        </nav>

                        {/* Actions (Login / Dashboard) */}
                        <div className="hidden md:flex items-center space-x-3">
                            {auth?.user ? (
                                <>
                                    {auth.user.role !== 'customer' && (
                                        <Link href={route(auth.user.role + '.dashboard')}>
                                            <button className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors">
                                                <LayoutDashboard className="w-3.5 h-3.5" />
                                                <span>Mon Tableau de Bord</span>
                                            </button>
                                        </Link>
                                    )}
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="px-3 py-2 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Déconnexion</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <button className="px-3.5 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-lg transition-colors">
                                            Connexion
                                        </button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <button className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-lg shadow-xs transition-colors">
                                            Créer une boutique
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-stone-500 hover:text-stone-700 p-2 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-2 shadow-inner text-xs font-medium">
                        <Link href="/" className="block py-2 text-stone-700 hover:text-amber-700">Accueil</Link>
                        <Link href={route('public.products.index')} className="block py-2 text-stone-700 hover:text-amber-700">Catalogue Produits</Link>
                        <Link href={route('public.shops.index')} className="block py-2 text-stone-700 hover:text-amber-700">Boutiques Vérifiées</Link>
                        <div className="pt-3 border-t border-stone-100 flex flex-col space-y-2">
                            {auth?.user ? (
                                <>
                                    {auth.user.role !== 'customer' && (
                                        <Link href={route(auth.user.role + '.dashboard')} className="w-full">
                                            <button className="w-full py-2 bg-amber-500 text-amber-950 font-semibold rounded-lg shadow-xs text-xs">
                                                Mon Dashboard
                                            </button>
                                        </Link>
                                    )}
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="w-full py-2 border border-stone-200 text-stone-600 rounded-lg text-xs"
                                    >
                                        Déconnexion
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="w-full">
                                        <button className="w-full py-2 border border-stone-200 text-stone-700 rounded-lg text-xs">Connexion</button>
                                    </Link>
                                    <Link href={route('register')} className="w-full">
                                        <button className="w-full py-2 bg-amber-500 text-amber-950 font-semibold rounded-lg shadow-xs text-xs">Créer une boutique</button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {usePage().props.flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs text-xs font-medium">
                        <span>{usePage().props.flash.success}</span>
                    </div>
                </div>
            )}
            {usePage().props.flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs text-xs font-medium">
                        <span>{usePage().props.flash.error}</span>
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white text-stone-600 py-10 border-t border-stone-200/80 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-stone-900">
                                <span className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-amber-950 text-sm">S</span>
                                <span className="font-semibold text-lg tracking-tight">Sellify.me</span>
                            </div>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                Plateforme e-commerce sécurisée avec protection Escrow et paiements Mobile Money (Orange / MTN MoMo).
                            </p>
                        </div>
                        {/* Links Columns */}
                        <div>
                            <h4 className="text-stone-900 font-semibold text-xs uppercase tracking-wider mb-3">Acheteurs & Marketplace</h4>
                            <ul className="space-y-2 text-xs text-stone-500 font-normal">
                                <li><Link href={route('public.products.index')} className="hover:text-amber-700 transition-colors">Catalogue Produits</Link></li>
                                <li><Link href={route('public.shops.index')} className="hover:text-amber-700 transition-colors">Boutiques Certifiées</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-stone-900 font-semibold text-xs uppercase tracking-wider mb-3">Vendeurs & Partenaires</h4>
                            <ul className="space-y-2 text-xs text-stone-500 font-normal">
                                <li><Link href={route('register')} className="hover:text-amber-700 transition-colors">Ouvrir une boutique</Link></li>
                                <li><Link href={route('register')} className="hover:text-amber-700 transition-colors">Devenir Livreur</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-stone-900 font-semibold text-xs uppercase tracking-wider mb-3">Assistance & Sécurité</h4>
                            <p className="text-xs text-stone-500 font-normal leading-relaxed">
                                Paiement Séquestre Escrow Garanti.<br />
                                Support client : support@sellify.me
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-stone-100 mt-8 pt-6 text-center text-[11px] text-stone-400 font-normal">
                        &copy; {new Date().getFullYear()} Sellify.me. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </div>
    );
}
