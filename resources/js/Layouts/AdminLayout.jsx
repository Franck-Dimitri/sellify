import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AIAssistantWidget from '@/Components/AIAssistantWidget';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    BarChart3,
    CreditCard,
    Package,
    LifeBuoy,
    ChevronDown,
    Search,
    UserCheck,
    AlertTriangle,
    ShieldCheck,
    PanelLeftClose,
    PanelLeftOpen,
    ArrowRight,
    Check,
    Tag,
    Store,
    Sparkles
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash, sidebar_counts } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop mini sidebar state
    const [usersDropdownOpen, setUsersDropdownOpen] = useState(true);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

    const user = auth.user;

    const counts = sidebar_counts || {
        all: 0,
        sellers: 0,
        drivers: 0,
        customers: 0,
        admins: 0,
        blocked: 0,
        pending_kyc: 0
    };

    const mainSections = [
        {
            title: 'Vue d\'ensemble',
            items: [
                { 
                    name: 'Tableau de bord', 
                    href: route('admin.dashboard'), 
                    icon: LayoutDashboard, 
                    active: route().current('admin.dashboard') 
                },
                { 
                    name: 'Sellify AI 1.2 Flash', 
                    href: route('admin.ai.index'), 
                    icon: Sparkles, 
                    badge: '⚡ IA',
                    active: route().current('admin.ai.*') 
                },
                { 
                    name: 'Statistiques', 
                    href: '#', 
                    icon: BarChart3, 
                    badge: 'Pro',
                    active: false 
                },
            ]
        },
        {
            title: 'Finances & séquestre',
            items: [
                { 
                    name: 'Séquestre Escrow', 
                    href: route('admin.escrow.index'), 
                    icon: CreditCard, 
                    active: route().current('admin.escrow.*') 
                },
                { 
                    name: 'Codes promo', 
                    href: '#', 
                    icon: Tag, 
                    active: false 
                },
            ]
        },
        {
            title: 'Opérations & litiges',
            items: [
                { 
                    name: 'Boutiques', 
                    href: route('admin.shops.index'), 
                    icon: Store, 
                    active: route().current('admin.shops.*') 
                },
                { 
                    name: 'Vérifications KYC', 
                    href: route('admin.kyc.index'), 
                    icon: UserCheck, 
                    badge: counts.pending_kyc > 0 ? `${counts.pending_kyc}` : 'Urgent', 
                    active: route().current('admin.kyc.*') 
                },
                { 
                    name: 'Commandes', 
                    href: route('admin.orders.index'), 
                    icon: Package, 
                    active: route().current('admin.orders.*') 
                },
                { 
                    name: 'Litiges', 
                    href: '#', 
                    icon: AlertTriangle, 
                    badge: 'Litiges',
                    active: false 
                },
            ]
        }
    ];

    const userSubNavigation = [
        { name: 'Tous utilisateurs', href: route('admin.users.all'), count: counts.all, active: route().current('admin.users.all') },
        { name: 'Vendeurs', href: route('admin.users.sellers'), count: counts.sellers, active: route().current('admin.users.sellers') },
        { name: 'Livreurs', href: route('admin.users.drivers'), count: counts.drivers, active: route().current('admin.users.drivers') },
        { name: 'Clients', href: route('admin.users.customers'), count: counts.customers, active: route().current('admin.users.customers') },
        { name: 'Comptes bloqués', href: route('admin.users.blocked'), count: counts.blocked, active: route().current('admin.users.blocked') },
    ];

    const systemSection = {
        title: 'Système',
        items: [
            { 
                name: 'Support', 
                href: '#', 
                icon: LifeBuoy, 
                active: false 
            },
            { 
                name: 'Paramètres', 
                href: '#', 
                icon: Settings, 
                active: false 
            },
        ]
    };

    const topNotifications = [
        {
            id: 1,
            title: "Demande KYC à valider",
            desc: "Nouveau dossier soumis par la boutique Tech Shop SARL.",
            time: "Il y a 5 min",
        },
        {
            id: 2,
            title: "Litige d'arbitrage ouvert",
            desc: "Commande #SLF-2026-X892 : Le client réclame un remboursement.",
            time: "Il y a 25 min",
        }
    ];

    return (
        <div className="h-screen w-screen flex bg-stone-50 overflow-hidden antialiased font-sans text-stone-800">
            
            {/* Mobile Drawer Backdrop */}
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
                <div className="h-16 flex items-center justify-between px-4 border-b border-stone-100 bg-white">
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
                                    Administration
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

                {/* Navigation Links */}
                <nav className="flex-1 px-2.5 py-4 overflow-y-auto space-y-4">
                    
                    {/* Section 1, 2, 3 */}
                    {mainSections.map((section, sIdx) => (
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
                                        {!isCollapsed && item.badge && (
                                            <span className="text-[10px] bg-yellow-400 text-stone-950 font-bold px-1.5 py-0.2 rounded-md">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Section 4: User Accounts (Placed as 4th section!) */}
                    <div className="space-y-1">
                        {!isCollapsed ? (
                            <>
                                <h3 className="px-3 text-[10px] font-semibold text-stone-400 tracking-wide">
                                    Utilisateurs
                                </h3>
                                <button
                                    onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <Users className="w-4 h-4 text-stone-400" />
                                        <span>Gestion utilisateurs</span>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${usersDropdownOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {usersDropdownOpen && (
                                    <div className="pl-3.5 space-y-0.5 mt-1 border-l border-stone-200 ml-4">
                                        {userSubNavigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-[11px] transition-all duration-150 ${
                                                    item.active
                                                        ? 'bg-yellow-50 text-stone-950 font-semibold border-l-2 border-yellow-500 pl-2'
                                                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                                                }`}
                                            >
                                                <span>{item.name}</span>
                                                <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-1.5 py-0.2 rounded font-medium">
                                                    {item.count}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-2">
                                <Link 
                                    href={route('admin.users.all')} 
                                    title="Gestion utilisateurs"
                                    className="p-2.5 hover:bg-stone-100 rounded-xl text-stone-600"
                                >
                                    <Users className="w-4 h-4 text-stone-500" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Section 5: System */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h3 className="px-3 text-[10px] font-semibold text-stone-400 tracking-wide">
                                {systemSection.title}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {systemSection.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={isCollapsed ? item.name : undefined}
                                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-normal transition-all"
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <item.icon className="w-4 h-4 text-stone-400" />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </nav>

                {/* Sidebar Footer User Profile */}
                <div className="p-3 border-t border-stone-100 space-y-2 bg-white">
                    <div className={`flex items-center space-x-2.5 px-1 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center text-stone-950 font-bold text-xs shrink-0 shadow-2xs">
                            {user.first_name[0]}
                        </div>
                        {!isCollapsed && (
                            <div className="truncate">
                                <p className="text-xs font-semibold text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                                <p className="text-[10px] text-yellow-700 font-medium flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-yellow-600" />
                                    <span>Super Administrateur</span>
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
                                placeholder="Rechercher un utilisateur, une boutique ou une commande..."
                                className="w-full bg-stone-50 text-xs pl-9 pr-12 py-2 rounded-xl border border-stone-200 focus:border-yellow-500 focus:bg-white outline-none font-normal text-stone-800 transition-all placeholder-stone-400"
                            />
                        </div>
                    </div>

                    {/* Right Side Items */}
                    <div className="flex items-center space-x-3 relative">
                        
                        {/* Quick Access to KYC Pending */}
                        <Link 
                            href={route('admin.kyc.index')}
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-300 text-yellow-950 font-bold text-xs rounded-xl hover:bg-yellow-100 transition-colors shadow-2xs"
                            title="Accès rapide aux KYC en attente"
                        >
                            <UserCheck className="w-4 h-4 text-yellow-700" />
                            <span>KYC en attente</span>
                            {counts.pending_kyc > 0 && (
                                <span className="bg-yellow-500 text-stone-950 px-1.5 py-0.2 rounded-md font-bold text-[10px]">
                                    {counts.pending_kyc}
                                </span>
                            )}
                        </Link>

                        {/* Notifications Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                className="p-2 text-stone-600 hover:text-yellow-700 rounded-xl hover:bg-stone-50 transition-colors relative" 
                                title="Notifications administration"
                            >
                                <Bell className="w-5 h-5 text-stone-600" />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-white"></span>
                            </button>

                            {/* Admin Notifications Dropdown */}
                            {notifDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Bell className="w-4 h-4 text-yellow-600" />
                                            <h4 className="font-bold text-xs text-stone-900">Alertes système & KYC</h4>
                                        </div>
                                        <span className="text-[10px] bg-yellow-100 text-yellow-900 font-semibold px-2 py-0.5 rounded-full">
                                            2 urgences
                                        </span>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                                        {topNotifications.map((n) => (
                                            <div key={n.id} className="p-2.5 bg-stone-50 rounded-xl space-y-1">
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
                                            href={route('admin.kyc.index')}
                                            onClick={() => setNotifDropdownOpen(false)}
                                            className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-yellow-500"
                                        >
                                            <span>Examiner les dossiers KYC</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="h-5 w-px bg-stone-200"></div>

                        {/* Admin Display */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center font-bold text-xs text-stone-950 uppercase shadow-xs">
                                {user.first_name[0]}
                            </div>
                            <span className="text-xs font-semibold text-stone-800 hidden sm:inline-block">
                                {user.first_name} {user.last_name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Scrollable View Content - Full Width */}
                <div className="flex-1 overflow-y-auto bg-stone-100/60">
                    {/* Flash Messages */}
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

                    {/* Main Content Container */}
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
