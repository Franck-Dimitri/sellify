import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    Settings,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    Bell,
    BarChart3,
    CreditCard,
    Package,
    LifeBuoy,
    MoreHorizontal,
    ChevronDown,
    Search,
    UserCheck,
    Globe
} from 'lucide-react';
import Button from '../Components/ui/Button';

export default function AdminLayout({ children, title }) {
    const { auth, flash, sidebar_counts } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [usersDropdownOpen, setUsersDropdownOpen] = React.useState(true);

    const counts = sidebar_counts || {
        all: 0,
        sellers: 0,
        drivers: 0,
        customers: 0,
        admins: 0,
        blocked: 0
    };

    const mainNavigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
        { name: 'Statistiques', href: '#', icon: BarChart3, badge: 'NEW', active: false },
        { name: 'Commandes', href: '#', icon: Package, badge: '12', active: false },
        { name: 'Paiements', href: '#', icon: CreditCard, active: false },
    ];

    const userSubNavigation = [
        { name: 'Tous les utilisateurs', href: route('admin.users.all'), count: counts.all, active: route().current('admin.users.all') },
        { name: 'Vendeurs', href: route('admin.users.sellers'), count: counts.sellers, active: route().current('admin.users.sellers') },
        { name: 'Livreurs', href: route('admin.users.drivers'), count: counts.drivers, active: route().current('admin.users.drivers') },
        { name: 'Clients', href: route('admin.users.customers'), count: counts.customers, active: route().current('admin.users.customers') },
        { name: 'Administrateurs', href: route('admin.users.admins'), count: counts.admins, active: route().current('admin.users.admins') },
        { name: 'Utilisateurs bloqués', href: route('admin.users.blocked'), count: counts.blocked, active: route().current('admin.users.blocked') },
    ];

    const bottomNavigation = [
        { name: 'Produits', href: '#', icon: Package, active: false },
        { name: 'Support', href: '#', icon: LifeBuoy, active: false },
        { name: 'Autres', href: '#', icon: MoreHorizontal, active: false },
    ];

    return (
        <div className="h-screen w-screen flex bg-surface-50 overflow-hidden antialiased">
            {/* Sidebar Desktop & Mobile */}
            <aside className={`bg-white text-surface-700 w-64 flex flex-col border-r border-surface-200 shadow-sm flex-shrink-0 z-30 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-surface-100 bg-white">
                    <Link href="/" className="flex items-center space-x-2.5">
                        <span className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-white shadow-md text-base">S</span>
                        <div>
                            <span className="font-extrabold text-base tracking-tight text-surface-900">Sellify<span className="text-amber-500">.me</span></span>
                            <span className="block text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-none mt-0.5">Administration</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-surface-400 hover:text-surface-900 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar Scrollable area */}
                <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-5">
                    {/* Main Nav Section */}
                    <div className="space-y-1">
                        {mainNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                                    ${item.active
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold'
                                        : 'hover:bg-surface-50 text-surface-600 hover:text-surface-900'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider
                                        ${item.badge === 'NEW' ? 'bg-rose-500 text-white animate-pulse' : 'bg-surface-100 text-surface-600'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Users Expandable Section */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <Users className="w-4.5 h-4.5 text-surface-500" />
                                <span>Utilisateurs</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${usersDropdownOpen ? 'transform rotate-180' : ''}`} />
                        </button>

                        {usersDropdownOpen && (
                            <div className="pl-4.5 space-y-1 mt-1 border-l border-surface-100 ml-5.5">
                                {userSubNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150
                                            ${item.active
                                                ? 'bg-amber-50 text-amber-900 border-l-2 border-amber-500 font-bold pl-2.5'
                                                : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                                            }`}
                                    >
                                        <span>{item.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold
                                            ${item.active ? 'bg-amber-100 text-amber-800' : 'bg-surface-100 text-surface-500'}`}>
                                            {item.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Nav Section */}
                    <div className="space-y-1">
                        <span className="block text-[10px] font-semibold text-surface-450 uppercase tracking-wider px-3.5 mb-2">Autres</span>
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-50 text-surface-600 hover:text-surface-900 transition-colors
                                    ${item.active ? 'bg-amber-500 text-white font-semibold' : ''}`}
                            >
                                <item.icon className="w-4.5 h-4.5 flex-shrink-0 text-surface-500" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-surface-100 space-y-4 bg-white">
                    <div className="flex items-center space-x-3 px-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-surface-100 to-surface-50 flex items-center justify-center text-surface-700 border border-surface-200 shadow-xs font-semibold">
                            {auth.user.first_name[0]}{auth.user.last_name[0]}
                        </div>
                        <div className="truncate">
                            <p className="text-sm font-semibold text-surface-800 truncate">{auth.user.first_name} {auth.user.last_name}</p>
                            <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider">{auth.user.role}</p>
                        </div>
                    </div>

                    <div className="pt-1">
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
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
                {/* Header */}
                <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center flex-1 max-w-lg">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-surface-500 hover:text-surface-600 focus:outline-none md:hidden mr-4"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar - matching premium look */}
                        <div className="relative w-full hidden sm:block">
                            <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Recherche..."
                                className="w-full bg-surface-50 text-sm pl-9 pr-12 py-1.5 rounded-xl border border-surface-200 focus:border-amber-400 focus:bg-white outline-none font-medium text-surface-700 transition-all placeholder-surface-400"
                            />
                            <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-white px-1.5 py-0.5 border border-surface-200 rounded-md text-[10px] text-surface-400 font-semibold shadow-xs font-mono">
                                ⌘K
                            </div>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-surface-400 hover:text-surface-600 rounded-xl hover:bg-surface-50 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
                        </button>
                        <div className="h-6 w-px bg-surface-200"></div>
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold text-xs border border-amber-250">
                                {auth.user.first_name[0]}
                            </div>
                            <span className="text-sm font-semibold text-surface-800 hidden sm:inline-block">
                                {auth.user.first_name} {auth.user.last_name}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {/* Notifications & Flash Messages */}
                    {flash?.success && (
                        <div className="px-6 pt-4">
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up text-sm font-semibold">
                                {flash.success}
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="px-6 pt-4">
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up text-sm font-semibold">
                                {flash.error}
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
