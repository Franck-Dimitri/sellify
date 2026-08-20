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
    ShieldCheck,
    Users,
    Settings,
    Gift,
    Check,
    ArrowRight,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';

export default function CustomerLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop mini sidebar state
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

    const user = auth.user;

    const navSections = [
        {
            title: 'Espace acheteur',
            items: [
                { 
                    name: 'Tableau de bord', 
                    href: route('customer.dashboard'), 
                    icon: LayoutDashboard, 
                    active: route().current('customer.dashboard') 
                },
                { 
                    name: 'Mes commandes', 
                    href: route('customer.orders.index'), 
                    icon: ShoppingBag, 
                    active: route().current('customer.orders.*') 
                },
                { 
                    name: 'Mes favoris', 
                    href: route('customer.wishlist'), 
                    icon: Heart, 
                    active: route().current('customer.wishlist') 
                },
                { 
                    name: 'Notifications', 
                    href: route('customer.notifications'), 
                    icon: Bell, 
                    badge: 2,
                    active: route().current('customer.notifications') 
                },
            ]
        },
        {
            title: 'Exploration & achats',
            items: [
                { 
                    name: 'Toutes les boutiques', 
                    href: route('public.shops.index'), 
                    icon: Store, 
                    active: route().current('public.shops.*') 
                },
                { 
                    name: 'Catalogue produits', 
                    href: route('public.products.index'), 
                    icon: Package, 
                    active: route().current('public.products.*') 
                },
                { 
                    name: 'Mon panier', 
                    href: route('public.cart.index'), 
                    icon: ShoppingCart, 
                    active: route().current('public.cart.*') 
                },
            ]
        },
        {
            title: 'Sécurité & communauté',
            items: [
                { 
                    name: 'parrainage', 
                    href: route('customer.referral'), 
                    icon: Gift, 
                    badge: '1 500 F',
                    active: route().current('customer.referral') 
                },
                { 
                    name: 'litiges & arbitrage', 
                    href: route('customer.disputes.index'), 
                    icon: AlertTriangle, 
                    active: route().current('customer.disputes.*') 
                },
                { 
                    name: 'Points & récompenses', 
                    href: route('customer.loyalty'), 
                    icon: Sparkles, 
                    active: route().current('customer.loyalty') 
                },
                { 
                    name: 'Mon profil & adresses', 
                    href: route('customer.profile'), 
                    icon: User, 
                    active: route().current('customer.profile') 
                },
                { 
                    name: 'Paramètres du compte', 
                    href: route('customer.settings'), 
                    icon: Settings, 
                    active: route().current('customer.settings') 
                },
            ]
        }
    ];

    const topNotifications = [
        {
            id: 1,
            title: "Code secret OTP disponible",
            desc: "Présentez le code OTP au livreur pour valider la réception.",
            time: "Il y a 10 min",
            unread: true
        },
        {
            id: 2,
            title: "Nouveau code promo -10%",
            desc: "Profitez de réductions dégressives sur vos achats gros.",
            time: "Il y a 1h",
            unread: true
        }
    ];

    return (
        <div className="h-screen w-screen flex bg-stone-50 overflow-hidden antialiased font-sans text-stone-800">
            
            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 md:hidden"
                />
            )}

            {/* Sidebar (Desktop Collapsible & Mobile Drawer) */}
            <aside 
                className={`bg-white text-stone-600 flex flex-col border-r border-stone-200/80 shadow-xs flex-shrink-0 z-50 fixed md:static inset-y-0 left-0 transition-all duration-200 ease-in-out ${
                    sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
                } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
            >
                {/* Brand Header */}
                <div className={`h-16 flex items-center border-b border-stone-100 bg-white px-4 justify-between`}>
                    <Link href="/" className="flex items-center space-x-2.5 overflow-hidden">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-950 bg-yellow-500 shadow-xs text-sm shrink-0">
                            S
                        </span>
                        {!isCollapsed && (
                            <div className="truncate">
                                <span className="font-semibold text-base tracking-tight text-stone-900">
                                    Sellify<span className="text-yellow-600">.me</span>
                                </span>
                                <span className="block text-[10px] text-stone-400 font-medium leading-none mt-0.5">
                                    Espace client
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle Button */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors"
                        title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                    </button>

                    {/* Mobile Close Button */}
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-stone-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categorized Sidebar Navigation */}
                <nav className="flex-1 px-2.5 py-4 overflow-y-auto space-y-4">
                    {navSections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                            {!isCollapsed && (
                                <h3 className="px-3 text-[10px] font-semibold text-stone-400 tracking-wide">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        title={isCollapsed ? item.name : undefined}
                                        className={`flex items-center rounded-xl text-xs transition-all duration-150 ${
                                            isCollapsed 
                                                ? 'justify-center p-2.5' 
                                                : 'justify-between px-3 py-2'
                                        } ${
                                            item.active
                                                ? 'bg-yellow-50 text-stone-950 font-semibold border-r-2 border-yellow-500 shadow-xs'
                                                : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-normal'
                                        }`}
                                    >
                                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'}`}>
                                            <item.icon className={`w-4 h-4 flex-shrink-0 ${item.active ? 'text-yellow-600' : 'text-stone-400'}`} />
                                            {!isCollapsed && <span>{item.name}</span>}
                                        </div>

                                        {!isCollapsed && (
                                            <div className="flex items-center gap-1">
                                                {item.badge && (
                                                    <span className="text-[10px] bg-yellow-400 text-stone-950 px-1.5 py-0.2 font-bold rounded-md">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {item.active && <ChevronRight className="w-3.5 h-3.5 text-yellow-600" />}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer User Profile */}
                <div className="p-3 border-t border-stone-100 space-y-2 bg-white">
                    <div className={`flex items-center space-x-2.5 px-1 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-900 border border-yellow-200 font-bold text-xs shrink-0">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>
                        {!isCollapsed && (
                            <div className="truncate">
                                <p className="text-xs font-semibold text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                                <p className="text-[10px] text-yellow-700 font-medium flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-yellow-600" />
                                    <span>Acheteur protégé</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {!isCollapsed ? (
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Déconnexion</span>
                        </Link>
                    ) : (
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            title="Déconnexion"
                            className="w-full flex justify-center p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-stone-200/80 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
                    <div className="flex items-center flex-1 max-w-xl gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-stone-500 hover:text-stone-700 focus:outline-none md:hidden p-1.5 bg-stone-100 rounded-lg"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search Bar */}
                        <div className="relative w-full hidden sm:block">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Rechercher une commande, une boutique ou un produit..."
                                className="w-full bg-stone-50 text-xs pl-9 pr-12 py-2 rounded-xl border border-stone-200 focus:border-yellow-500 focus:bg-white outline-none font-normal text-stone-800 transition-all placeholder-stone-400"
                            />
                        </div>
                    </div>

                    {/* Right Side Header Items */}
                    <div className="flex items-center space-x-3 relative">
                        <Link 
                            href={route('public.cart.index')}
                            className="p-2 text-stone-600 hover:text-yellow-700 rounded-xl hover:bg-stone-50 transition-colors relative"
                            title="Mon panier"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </Link>

                        {/* Functional Notifications Topbar Icon */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                className="p-2 text-stone-600 hover:text-yellow-700 rounded-xl hover:bg-stone-50 transition-colors relative" 
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5 text-stone-600" />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-white"></span>
                            </button>

                            {/* Notifications Dropdown Popover */}
                            {notifDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Bell className="w-4 h-4 text-yellow-600" />
                                            <h4 className="font-bold text-xs text-stone-900">Notifications récentes</h4>
                                        </div>
                                        <span className="text-[10px] bg-yellow-100 text-yellow-900 font-semibold px-2 py-0.5 rounded-full">
                                            2 nouvelles
                                        </span>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                                        {topNotifications.map((n) => (
                                            <div key={n.id} className="p-2.5 bg-stone-50 rounded-xl hover:bg-yellow-50/60 transition-colors space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-semibold text-stone-900">{n.title}</span>
                                                    <span className="text-[10px] text-stone-400">{n.time}</span>
                                                </div>
                                                <p className="text-[11px] text-stone-600 leading-normal">{n.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2 border-t border-stone-100">
                                        <Link
                                            href={route('customer.notifications')}
                                            onClick={() => setNotifDropdownOpen(false)}
                                            className="w-full py-2 bg-stone-100 hover:bg-yellow-400 hover:text-stone-950 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <span>Voir toutes les notifications</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="h-5 w-px bg-stone-200"></div>

                        {/* User Profile Badge Header */}
                        <Link href={route('customer.profile')} className="flex items-center space-x-2 p-1 hover:bg-stone-50 rounded-xl transition-colors">
                            <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center font-bold text-xs text-stone-950 uppercase shadow-xs">
                                {user.first_name[0]}
                            </div>
                            <span className="text-xs font-semibold text-stone-800 hidden sm:inline-block">
                                {user.first_name} {user.last_name}
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Scrollable View Content without max-w-7xl constraint */}
                <div className="flex-1 overflow-y-auto bg-stone-100/60">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="px-6 pt-4">
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span>{flash.success}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="px-6 pt-4">
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs">
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {/* Main Page Children Container - Full Width */}
                    <main className="p-4 sm:p-6 w-full">
                        {children}
                    </main>
                </div>
            </div>

            {/* Universal Floating AI Assistant Widget */}
            <AIAssistantWidget />
        </div>
    );
}
