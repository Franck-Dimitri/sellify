import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AIAssistantWidget from '@/Components/AIAssistantWidget';
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    Store,
    Package,
    ShoppingCart,
    AlertTriangle,
    Sparkles,
    User,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

export default function CustomerLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const user = auth.user;

    const navSections = [
        {
            title: 'ESPACE ACHETEUR',
            items: [
                { 
                    name: 'Tableau de bord', 
                    href: route('customer.dashboard'), 
                    icon: LayoutDashboard, 
                    active: route().current('customer.dashboard') 
                },
                { 
                    name: 'Mes Commandes', 
                    href: route('customer.orders.index'), 
                    icon: ShoppingBag, 
                    active: route().current('customer.orders.*') 
                },
                { 
                    name: 'Mes Favoris', 
                    href: route('customer.wishlist'), 
                    icon: Heart, 
                    active: route().current('customer.wishlist') 
                },
            ]
        },
        {
            title: 'EXPLORATION & ACHATS',
            items: [
                { 
                    name: 'Toutes les Boutiques', 
                    href: route('public.shops.index'), 
                    icon: Store, 
                    active: route().current('public.shops.*') 
                },
                { 
                    name: 'Catalogue Produits', 
                    href: route('public.products.index'), 
                    icon: Package, 
                    active: route().current('public.products.*') 
                },
                { 
                    name: 'Mon Panier', 
                    href: route('cart.index'), 
                    icon: ShoppingCart, 
                    active: route().current('cart.*') 
                },
            ]
        },
        {
            title: 'SÉCURITÉ & FIDÉLITÉ',
            items: [
                { 
                    name: 'Mes Litiges & Arbitrage', 
                    href: route('customer.disputes.index'), 
                    icon: AlertTriangle, 
                    active: route().current('customer.disputes.*') 
                },
                { 
                    name: 'Points & Récompenses', 
                    href: route('customer.loyalty'), 
                    icon: Sparkles, 
                    active: route().current('customer.loyalty') 
                },
                { 
                    name: 'Mon Profil & Adresses', 
                    href: route('customer.profile'), 
                    icon: User, 
                    active: route().current('customer.profile') 
                },
            ]
        }
    ];

    return (
        <div className="h-screen w-screen flex bg-stone-50 overflow-hidden antialiased font-sans text-stone-800">
            {/* Sidebar Desktop & Mobile */}
            <aside className={`bg-white text-stone-600 w-64 flex flex-col border-r border-stone-200/80 shadow-xs flex-shrink-0 z-30 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-stone-100 bg-white">
                    <Link href="/" className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-stone-950 bg-yellow-500 shadow-xs text-sm">
                            S
                        </span>
                        <div>
                            <span className="font-semibold text-base tracking-tight text-stone-900">
                                Sellify<span className="text-yellow-600">.me</span>
                            </span>
                            <span className="block text-[10px] text-stone-400 font-medium uppercase tracking-wider leading-none mt-0.5">
                                Espace Client
                            </span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-stone-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categorized Sidebar Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
                    {navSections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                                            item.active
                                                ? 'bg-yellow-50 text-stone-950 font-medium border-r-2 border-yellow-500 shadow-xs'
                                                : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-normal'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2.5">
                                            <item.icon className={`w-4 h-4 flex-shrink-0 ${item.active ? 'text-yellow-600' : 'text-stone-400'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.active && <ChevronRight className="w-3.5 h-3.5 text-yellow-600" />}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer User Profile */}
                <div className="p-3.5 border-t border-stone-100 space-y-2.5 bg-white">
                    <div className="flex items-center space-x-2.5 px-1">
                        <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-900 border border-yellow-200 font-medium text-xs uppercase">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-medium text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                            <p className="text-[10px] text-yellow-700 font-medium tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-yellow-600" />
                                <span>Acheteur Protégé</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-normal text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Déconnexion</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-stone-200/80 flex items-center justify-between px-6 flex-shrink-0 z-20">
                    <div className="flex items-center flex-1 max-w-lg">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-stone-500 hover:text-stone-700 focus:outline-none md:hidden mr-4"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search Bar */}
                        <div className="relative w-full hidden sm:block">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Rechercher une commande, une boutique ou un produit..."
                                className="w-full bg-stone-50 text-xs pl-9 pr-12 py-1.5 rounded-lg border border-stone-200 focus:border-yellow-500 focus:bg-white outline-none font-normal text-stone-800 transition-all placeholder-stone-400"
                            />
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-3">
                        <Link 
                            href={route('cart.index')}
                            className="p-2 text-stone-600 hover:text-yellow-700 rounded-lg hover:bg-stone-50 transition-colors relative"
                            title="Mon Panier"
                        >
                            <ShoppingCart className="w-4.5 h-4.5" />
                        </Link>

                        <button className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-50 transition-colors relative" title="Notifications">
                            <Bell className="w-4.5 h-4.5 text-stone-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-500"></span>
                        </button>
                        
                        <div className="h-5 w-px bg-stone-200"></div>

                        {/* User Display */}
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center font-medium text-xs text-stone-950 uppercase shadow-xs">
                                {user.first_name[0]}
                            </div>
                            <span className="text-xs font-medium text-stone-800 hidden sm:inline-block">
                                {user.first_name} {user.last_name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Scrollable View Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="px-6 pt-4">
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg flex items-center justify-between text-xs font-medium shadow-xs">
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="px-6 pt-4">
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2 rounded-lg flex items-center justify-between text-xs font-medium shadow-xs">
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {/* Main Page Children */}
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>

            {/* Universal Floating AI Assistant Widget */}
            <AIAssistantWidget />
        </div>
    );
}
