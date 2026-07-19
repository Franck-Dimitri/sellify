import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Store,
    Package,
    ShoppingBag,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Globe,
    ExternalLink,
    Clock,
    UserCheck,
    CreditCard
} from 'lucide-react';
import Button from '../Components/ui/Button';

export default function SellerLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const user = auth.user;
    const seller = user?.seller;
    const shop = seller?.shop;

    // 7 Tabs
    const navigation = [
        { 
            name: 'Tableau de bord', 
            href: route('seller.dashboard'), 
            icon: LayoutDashboard, 
            active: route().current('seller.dashboard') 
        },
        { 
            name: shop ? 'Gérer Boutique' : 'Créer Boutique', 
            href: shop ? route('seller.shop.edit') : route('seller.shop.create'), 
            icon: Store, 
            active: route().current('seller.shop.edit') || route().current('seller.shop.create') 
        },
        { 
            name: 'Produits', 
            href: '#', 
            icon: Package, 
            active: false,
            badge: '0/30'
        },
        { 
            name: 'Commandes', 
            href: '#', 
            icon: ShoppingBag, 
            active: false 
        },
        { 
            name: 'Clients', 
            href: '#', 
            icon: Users, 
            active: false 
        },
        { 
            name: 'Statistiques', 
            href: '#', 
            icon: BarChart3, 
            active: false 
        },
        { 
            name: 'Paramètres', 
            href: '#', 
            icon: Settings, 
            active: false 
        }
    ];

    const activeThemeColor = shop?.theme_color || '#EAB308';

    return (
        <div className="h-screen w-screen flex bg-surface-50 overflow-hidden antialiased font-sans">
            {/* Sidebar Desktop & Mobile */}
            <aside className={`bg-white text-surface-700 w-66 flex flex-col border-r border-surface-200 shadow-sm flex-shrink-0 z-30 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-surface-100 bg-white">
                    <Link href="/" className="flex items-center space-x-2.5">
                        <span className="w-8.5 h-8.5 rounded-xl flex items-center justify-center font-black text-white shadow-md text-base" style={{ backgroundColor: activeThemeColor }}>
                            S
                        </span>
                        <div>
                            <span className="font-extrabold text-base tracking-tight text-surface-900">
                                Sellify<span style={{ color: activeThemeColor }}>.me</span>
                            </span>
                            <span className="block text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-none mt-0.5">
                                Espace Vendeur
                            </span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-surface-400 hover:text-surface-900 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Seller shop quick card if exists */}
                {shop && (
                    <div className="p-4 mx-4 mt-4 bg-surface-50 border border-surface-200 rounded-2xl flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-surface-150 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                            {shop.logo_path ? (
                                <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <Store className="w-5 h-5 text-surface-300" />
                            )}
                        </div>
                        <div className="truncate flex-1">
                            <span className="text-xs font-bold text-surface-800 block truncate">{shop.name}</span>
                            <a href={route('shop.public', shop.slug)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-surface-400 font-bold hover:underline flex items-center space-x-0.5">
                                <span>Visiter boutique</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                                ${item.active
                                    ? 'text-white shadow-md'
                                    : 'hover:bg-surface-50 text-surface-600 hover:text-surface-900'
                                }`}
                            style={item.active ? { backgroundColor: activeThemeColor } : {}}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                <span>{item.name}</span>
                            </div>
                            {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider
                                    ${item.active ? 'bg-white/20 text-white' : 'bg-surface-100 text-surface-600'}`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-surface-100 space-y-4 bg-white">
                    <div className="flex items-center space-x-3 px-2">
                        <div className="w-9 h-9 rounded-xl bg-surface-50 flex items-center justify-center text-surface-700 border border-surface-200 shadow-xs font-bold text-xs uppercase">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div className="truncate">
                            <p className="text-sm font-semibold text-surface-800 truncate">{user.first_name} {user.last_name}</p>
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                                Starter Plan
                            </p>
                        </div>
                    </div>

                    <div className="pt-1">
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50 transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Déconnexion</span>
                        </Link>
                    </div>

                    <div className="text-center text-[10px] text-surface-400 font-medium pt-1 border-t border-surface-50">
                        <span>Version 2.0.0</span>
                        <p className="mt-0.5">&copy; 2026 Sellify.me</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header / Topbar */}
                <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
                    <div className="flex items-center flex-1 max-w-lg">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-surface-500 hover:text-surface-600 focus:outline-none md:hidden mr-4"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar */}
                        <div className="relative w-full hidden sm:block">
                            <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Rechercher des produits, commandes, clients..."
                                className="w-full bg-surface-50 text-sm pl-9 pr-12 py-1.5 rounded-xl border border-surface-200 focus:border-surface-400 focus:bg-white outline-none font-medium text-surface-700 transition-all placeholder-surface-400"
                            />
                            <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-white px-1.5 py-0.5 border border-surface-200 rounded-md text-[10px] text-surface-400 font-semibold shadow-xs font-mono">
                                ⌘K
                            </div>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-4">
                        {/* Settings Link */}
                        <a href="#" className="p-2 text-surface-400 hover:text-surface-600 rounded-xl hover:bg-surface-50 transition-colors" title="Paramètres">
                            <Settings className="w-5 h-5" />
                        </a>

                        {/* Notifications */}
                        <button className="p-2 text-surface-400 hover:text-surface-600 rounded-xl hover:bg-surface-50 transition-colors relative" title="Notifications">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
                        </button>
                        
                        <div className="h-6 w-px bg-surface-200"></div>

                        {/* User Display */}
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border uppercase text-white shadow-sm" style={{ backgroundColor: activeThemeColor }}>
                                {user.first_name[0]}
                            </div>
                            <span className="text-sm font-semibold text-surface-800 hidden sm:inline-block">
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
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up text-sm font-semibold">
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="px-6 pt-4">
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up text-sm font-semibold">
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
