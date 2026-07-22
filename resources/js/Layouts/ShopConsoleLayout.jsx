import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Store,
    Package,
    ArrowLeft,
    LogOut,
    Bell,
    ExternalLink,
    Percent
} from 'lucide-react';

export default function ShopConsoleLayout({ children, shop, title }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const activeThemeColor = shop?.theme_color || '#F59E0B';

    const navigation = [
        { 
            name: 'Tableau de bord', 
            href: route('seller.shop.dashboard', shop.slug), 
            icon: LayoutDashboard, 
            active: route().current('seller.shop.dashboard', { shop: shop.slug }) 
        },
        { 
            name: 'Configuration', 
            href: route('seller.shop.edit', shop.slug), 
            icon: Store, 
            active: route().current('seller.shop.edit', { shop: shop.slug }) 
        },
        { 
            name: 'Catalogue Produits', 
            href: route('seller.shop.products.index', shop.slug), 
            icon: Package, 
            active: route().current('seller.shop.products.*', { shop: shop.slug })
        },
        { 
            name: 'Promotions Locales', 
            href: route('seller.shop.promotions.index', shop.slug), 
            icon: Percent, 
            active: route().current('seller.shop.promotions.*', { shop: shop.slug })
        },
    ];

    return (
        <div className="h-screen w-screen flex flex-col bg-stone-50 overflow-hidden antialiased font-sans text-stone-800">
            
            {/* TOP HEADER FOR SHOP CONSOLE */}
            <header className="h-16 bg-white border-b border-stone-200/70 px-6 flex-shrink-0 z-20">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    
                    {/* Shop Brand & Status */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-amber-950 shadow-xs text-sm" style={{ backgroundColor: activeThemeColor }}>
                            {shop.logo_path ? (
                                <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                shop.name[0].toUpperCase()
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold text-sm tracking-tight text-stone-900 leading-tight">
                                    {shop.name}
                                </h1>
                                <span className="text-[10px] bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                                    Console Boutique
                                </span>
                            </div>
                            <a 
                                href={route('shop.public', shop.slug)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-normal"
                            >
                                <span>Visiter la vitrine publique</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Right side items & User info */}
                    <div className="flex items-center space-x-3">
                        {/* Return to Central Button */}
                        <Link 
                            href={route('seller.dashboard')} 
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200/80"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Retour au Central Vendeur</span>
                        </Link>

                        <div className="h-5 w-px bg-stone-200"></div>

                        {/* Notifications */}
                        <button className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-50 transition-colors relative" title="Notifications">
                            <Bell className="w-4.5 h-4.5 text-stone-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
                        </button>
                        
                        {/* User Display */}
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-medium text-xs text-amber-950 uppercase shadow-xs">
                                {user.first_name[0]}
                            </div>
                            <span className="text-xs font-medium text-stone-800 hidden md:inline-block">
                                {user.first_name} {user.last_name}
                            </span>
                        </div>

                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            title="Déconnexion"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* HORIZONTAL CENTERED TAB NAVIGATION BAR */}
            <div className="bg-white border-b border-stone-200/70 px-6 py-2 flex items-center justify-center shrink-0 shadow-2xs">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-2">
                        Gestion Boutique :
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border ${
                                        item.active
                                            ? 'bg-amber-500 text-amber-950 font-semibold border-amber-500 shadow-xs'
                                            : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200/70 hover:border-stone-300'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${item.active ? 'text-amber-950' : 'text-stone-400'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MAIN SCROLLABLE CONTENT AREA (MAX-W-7XL) */}
            <div className="flex-1 overflow-y-auto">
                {/* Flash messages */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto px-6 pt-4">
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-xs">
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="max-w-7xl mx-auto px-6 pt-4">
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-xs">
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Page Content Centered with max-w-7xl */}
                <main className="p-6 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
