import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AIAssistantWidget from '@/Components/AIAssistantWidget';
import {
    LayoutDashboard,
    Store,
    CreditCard,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Percent,
    Boxes,
    Link2,
    DollarSign,
    Wallet,
    TrendingUp,
    AlertTriangle,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function SellerCentralLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const user = auth.user;

    const navSections = [
        {
            title: 'NAVIGATION PRINCIPALE',
            items: [
                { 
                    name: 'Tableau de bord', 
                    href: route('seller.dashboard'), 
                    icon: LayoutDashboard, 
                    active: route().current('seller.dashboard') 
                },
                { 
                    name: 'Mes Boutiques', 
                    href: route('seller.shop.index'), 
                    icon: Store, 
                    active: route().current('seller.shop.index') 
                },
                { 
                    name: 'Inventaire & Stocks', 
                    href: route('seller.inventory.index'), 
                    icon: Boxes, 
                    active: route().current('seller.inventory.index') 
                },
                { 
                    name: 'Smart-Links (Réseaux)', 
                    href: route('seller.smart_links.index'), 
                    icon: Link2, 
                    active: route().current('seller.smart_links.index') 
                },
            ]
        },
        {
            title: 'FINANCES & CROISSANCE',
            items: [
                { 
                    name: 'Portefeuille & Retraits', 
                    href: route('seller.wallet.index'), 
                    icon: Wallet, 
                    active: route().current('seller.wallet.index') 
                },
                { 
                    name: 'SellifyPay (Prêts)', 
                    href: route('seller.loans.index'), 
                    icon: DollarSign, 
                    active: route().current('seller.loans.index') 
                },
                { 
                    name: 'Packs Abonnements', 
                    href: route('seller.subscription.index'), 
                    icon: CreditCard, 
                    active: route().current('seller.subscription.index') 
                },
            ]
        },
        {
            title: 'ANALYTIQUE & LITIGES',
            items: [
                { 
                    name: 'Rapports IA & Ventes', 
                    href: route('seller.analytics.index'), 
                    icon: TrendingUp, 
                    active: route().current('seller.analytics.index') 
                },
                { 
                    name: 'Gestion des Litiges', 
                    href: route('seller.disputes.index'), 
                    icon: AlertTriangle, 
                    active: route().current('seller.disputes.index') 
                },
                { 
                    name: 'Promotions', 
                    href: route('seller.promotions.global'), 
                    icon: Percent, 
                    active: route().current('seller.promotions.global') 
                },
            ]
        }
    ];

    return (
        <div className="h-screen w-screen flex bg-stone-50 overflow-hidden antialiased font-sans text-stone-800">
            {/* Sidebar Desktop & Mobile */}
            <aside className={`bg-white text-stone-600 w-64 flex flex-col border-r border-stone-200/70 shadow-sm flex-shrink-0 z-30 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-stone-100 bg-white">
                    <Link href="/" className="flex items-center space-x-2.5">
                        <span className="w-8.5 h-8.5 rounded-xl flex items-center justify-center font-bold text-amber-950 bg-amber-500 shadow-sm text-sm">
                            S
                        </span>
                        <div>
                            <span className="font-semibold text-base tracking-tight text-stone-900">
                                Sellify<span className="text-amber-600">.me</span>
                            </span>
                            <span className="block text-[10px] text-stone-400 font-medium uppercase tracking-wider leading-none mt-0.5">
                                Espace Vendeur
                            </span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-stone-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categorized Sidebar Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
                    {navSections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-1.5">
                            <h3 className="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                                            item.active
                                                ? 'bg-amber-50 text-amber-950 font-medium border-r-2 border-amber-500 shadow-xs'
                                                : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-normal'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2.5">
                                            <item.icon className={`w-4 h-4 flex-shrink-0 ${item.active ? 'text-amber-600' : 'text-stone-400'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.active && <ChevronRight className="w-3.5 h-3.5 text-amber-600" />}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer User Profile */}
                <div className="p-4 border-t border-stone-100 space-y-3 bg-white">
                    <div className="flex items-center space-x-3 px-1">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-900 border border-amber-200 font-medium text-xs uppercase">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-medium text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                            <p className="text-[10px] text-amber-700 font-medium uppercase tracking-wider">
                                {user.seller?.pack === 'pro' ? 'Pack Pro' : 'Pack Starter'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-normal text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Déconnexion</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header / Topbar */}
                <header className="h-16 bg-white border-b border-stone-200/70 flex items-center justify-between px-6 flex-shrink-0 z-20">
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
                                placeholder="Rechercher une boutique, une commande..."
                                className="w-full bg-stone-50 text-xs pl-9 pr-12 py-2 rounded-xl border border-stone-200 focus:border-amber-500 focus:bg-white outline-none font-normal text-stone-800 transition-all placeholder-stone-400"
                            />
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-3">
                        <button className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-50 transition-colors relative" title="Notifications">
                            <Bell className="w-4.5 h-4.5 text-stone-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
                        </button>
                        
                        <div className="h-5 w-px bg-stone-200"></div>

                        {/* User Display */}
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-medium text-xs text-amber-950 uppercase shadow-xs">
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
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-xs">
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="px-6 pt-4">
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-xs">
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

            {/* Universal Floating AI Assistant Widget */}
            <AIAssistantWidget />
        </div>
    );
}
