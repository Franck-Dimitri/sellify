import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Button from '../Components/ui/Button';
import { LogOut, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-surface-50 flex flex-col antialiased">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <span className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center font-extrabold text-surface-950 shadow-sm">S</span>
                                <span className="font-extrabold text-xl tracking-tight text-surface-900">
                                    Sellify<span className="text-primary-600">.me</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8 text-sm font-semibold text-surface-600">
                            <Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
                            <a href="#piliers" className="hover:text-primary-600 transition-colors">Piliers</a>
                            <a href="#vendeurs" className="hover:text-primary-600 transition-colors">Pour Vendeurs</a>
                            <a href="#livreurs" className="hover:text-primary-600 transition-colors">Pour Livreurs</a>
                        </nav>

                        {/* Actions (Login / Dashboard) */}
                        <div className="hidden md:flex items-center space-x-4">
                            {auth?.user ? (
                                <>
                                    {auth.user.role !== 'customer' && (
                                        <Link href={route(auth.user.role + '.dashboard')}>
                                            <Button variant="outline" size="sm" className="space-x-2">
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Mon Tableau de Bord</span>
                                            </Button>
                                        </Link>
                                    )}
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 px-3 py-1.5 text-sm space-x-1"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Déconnexion</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="outline" size="sm">Connexion</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button variant="primary" size="sm">Créer mon compte</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-surface-500 hover:text-surface-600 p-2 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-surface-200 px-4 pt-2 pb-4 space-y-3 shadow-inner">
                        <Link href="/" className="block py-2 text-base font-medium text-surface-700 hover:text-primary-600">Accueil</Link>
                        <a href="#piliers" className="block py-2 text-base font-medium text-surface-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Piliers</a>
                        <a href="#vendeurs" className="block py-2 text-base font-medium text-surface-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Pour Vendeurs</a>
                        <a href="#livreurs" className="block py-2 text-base font-medium text-surface-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Pour Livreurs</a>
                        <div className="pt-4 border-t border-surface-100 flex flex-col space-y-2">
                            {auth?.user ? (
                                <>
                                    {auth.user.role !== 'customer' && (
                                        <Link href={route(auth.user.role + '.dashboard')} className="w-full">
                                            <Button variant="outline" className="w-full space-x-2">
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Mon Dashboard</span>
                                            </Button>
                                        </Link>
                                    )}
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="w-full inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 px-4 py-2 text-sm"
                                    >
                                        Déconnexion
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="w-full">
                                        <Button variant="outline" className="w-full">Connexion</Button>
                                    </Link>
                                    <Link href={route('register')} className="w-full">
                                        <Button variant="primary" className="w-full">Créer mon compte</Button>
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
                    <div className="bg-secondary-50 border border-secondary-200 text-secondary-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up">
                        <span className="text-sm font-semibold">{usePage().props.flash.success}</span>
                    </div>
                </div>
            )}
            {usePage().props.flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="bg-accent-50 border border-accent-200 text-accent-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up">
                        <span className="text-sm font-semibold">{usePage().props.flash.error}</span>
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-surface-100 text-surface-600 py-12 border-t border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-surface-900">
                                <span className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center font-extrabold text-surface-950">S</span>
                                <span className="font-extrabold text-xl tracking-tight">Sellify.me</span>
                            </div>
                            <p className="text-sm text-surface-500">
                                La première plateforme SaaS et Escrow pour le commerce africain. Securisé, propulsé par l'IA logistique.
                            </p>
                        </div>
                        {/* Links Columns */}
                        <div>
                            <h4 className="text-surface-900 font-bold text-sm uppercase tracking-wider mb-4">Plateforme</h4>
                            <ul className="space-y-2 text-sm text-surface-500">
                                <li><a href="#piliers" className="hover:text-primary-600 transition-colors">Comment ça marche</a></li>
                                <li><Link href={route('register')} className="hover:text-primary-600 transition-colors">Créer une boutique</Link></li>
                                <li><Link href={route('register')} className="hover:text-primary-600 transition-colors">Devenir Livreur</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-surface-900 font-bold text-sm uppercase tracking-wider mb-4">Légal</h4>
                            <ul className="space-y-2 text-sm text-surface-500">
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Conditions Générales</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Politique de Confidentialité</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Mentions Légales</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-surface-900 font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
                            <p className="text-sm text-surface-500">
                                support@sellify.me<br />
                                Douala / Yaoundé, Cameroun
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-surface-200 mt-8 pt-8 text-center text-sm text-surface-400">
                        &copy; {new Date().getFullYear()} Sellify.me. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </div>
    );
}
