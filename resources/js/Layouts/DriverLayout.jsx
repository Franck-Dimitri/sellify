import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AIAssistantWidget from '@/Components/AIAssistantWidget';
import RefuseDeliveryModal from '@/Components/RefuseDeliveryModal';
import {
    LayoutDashboard,
    Truck,
    MapPin,
    Wallet,
    Bell,
    Star,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    PanelLeftClose,
    PanelLeftOpen,
    Check,
    CircleDot,
    ShoppingBag,
    ArrowRight,
    WifiOff,
    Download,
    Clock,
    Lock,
    Package
} from 'lucide-react';

export default function DriverLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [pushAlert, setPushAlert] = useState(null);
    const [refuseModalOrderNumber, setRefuseModalOrderNumber] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes decision countdown (2.3.3 spec)

    const user = auth.user || {};
    const driver = user.driver || {};

    const [activityStatus, setActivityStatus] = useState(driver.activity_status || 'online');

    // 5-minute Countdown Timer (2.3.3 spec)
    useEffect(() => {
        if (!pushAlert) return;
        setTimerSeconds(300);
        const interval = setInterval(() => {
            setTimerSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setPushAlert(null); // Auto-reassign to backup driver if timer expires
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [pushAlert]);

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Register Service Worker & Listen for Offline / PWA Install Prompt
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
                .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
        }

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallPwa = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('[PWA] Driver accepted PWA installation');
                }
                setDeferredPrompt(null);
            });
        }
    };

    // Simulate incoming push dispatch alert
    useEffect(() => {
        const timer = setTimeout(() => {
            setPushAlert({
                id: 'push-992',
                order_number: 'SLF-2026-X892',
                shop_name: 'Tech Shop (Bastos)',
                customer_name: 'Marc Kamga',
                destination: 'Akwa, Immeuble Rose',
                escrow_amount: 150000,
                package_desc: 'Smartphone & Accessoires · 1.2 kg',
                fee: 2500,
                distance: '3.4 km',
                duration: '12 min',
                time: 'À l\'instant'
            });
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    const handleStatusToggle = (newStatus) => {
        setActivityStatus(newStatus);
        router.post(route('driver.availability'), { activity_status: newStatus }, { preserveState: true });
    };

    const handleAcceptPush = (orderNumber) => {
        setPushAlert(null);
        router.post(route('driver.delivery.accept', orderNumber));
    };

    const navigation = [
        { name: 'Tableau de bord', href: route('driver.dashboard'), icon: LayoutDashboard, active: route().current('driver.dashboard') },
        { name: 'Livraisons & courses', href: route('driver.deliveries'), icon: Truck, active: route().current('driver.deliveries') },
        { name: 'Carte & itinéraire', href: route('driver.map'), icon: MapPin, active: route().current('driver.map') },
        { name: 'Portefeuille & gains', href: route('driver.earnings'), icon: Wallet, active: route().current('driver.earnings') },
        { name: 'Notifications', href: route('driver.notifications'), icon: Bell, active: route().current('driver.notifications') },
        { name: 'Avis & évaluations', href: route('driver.reviews'), icon: Star, active: route().current('driver.reviews') },
        { name: 'Paramètres & véhicule', href: route('driver.settings'), icon: Settings, active: route().current('driver.settings') },
    ];

    const driverNotifications = [
        { id: 1, title: "Nouvelle course disponible !", desc: "Colis #SLF-2026-X892 prêt chez Tech Shop (Bastos).", time: "Il y a 2 min" },
        { id: 2, title: "Paiement de livraison crédité", desc: "+ 2 500 FCFA ajoutés à votre portefeuille.", time: "Il y a 1 heure" }
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
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-yellow-950 bg-yellow-400 border border-yellow-500 shadow-2xs text-sm shrink-0">
                            S
                        </span>
                        {!isCollapsed && (
                            <div className="truncate">
                                <span className="font-bold text-base tracking-tight text-stone-900">
                                    Sellify<span className="text-yellow-600">.Express</span>
                                </span>
                                <span className="block text-[10px] text-stone-400 font-semibold leading-none mt-0.5">
                                    Espace Livreur PWA
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle */}
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
                <nav className="flex-1 px-2.5 py-4 overflow-y-auto space-y-1">
                    {!isCollapsed && (
                        <h3 className="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                            Menu Chauffeur
                        </h3>
                    )}

                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            className={`flex items-center rounded-xl text-xs transition-all duration-150 ${
                                isCollapsed 
                                    ? 'justify-center p-2.5' 
                                    : 'justify-between px-3 py-2.5'
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
                        </Link>
                    ))}
                </nav>

                {/* PWA Installation Prompt Button */}
                {deferredPrompt && !isCollapsed && (
                    <div className="p-3 border-t border-stone-100 bg-yellow-50/60">
                        <button
                            onClick={handleInstallPwa}
                            className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 border border-yellow-500"
                        >
                            <Download className="w-4 h-4" />
                            <span>Installer App PWA</span>
                        </button>
                    </div>
                )}

                {/* Sidebar Footer Driver Profile */}
                <div className="p-3 border-t border-stone-100 space-y-2 bg-white">
                    <div className={`flex items-center space-x-2.5 px-1 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 font-bold text-xs flex items-center justify-center shrink-0 border border-yellow-500 shadow-2xs">
                            {user.first_name ? user.first_name[0] : 'L'}
                        </div>
                        {!isCollapsed && (
                            <div className="truncate">
                                <p className="text-xs font-semibold text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                                <p className="text-[10px] text-yellow-800 font-medium flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-yellow-600" />
                                    <span>Livreur Certifié</span>
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

                        {/* Status Toggle Button */}
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                            <button
                                onClick={() => handleStatusToggle('online')}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activityStatus === 'online'
                                        ? 'bg-emerald-500 text-white shadow-2xs'
                                        : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                <CircleDot className="w-3 h-3 animate-pulse" />
                                <span>En service</span>
                            </button>
                            <button
                                onClick={() => handleStatusToggle('busy')}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activityStatus === 'busy'
                                        ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs border border-yellow-500'
                                        : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                <Truck className="w-3 h-3" />
                                <span>En course</span>
                            </button>
                            <button
                                onClick={() => handleStatusToggle('offline')}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activityStatus === 'offline'
                                        ? 'bg-stone-600 text-white shadow-2xs'
                                        : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                <span>Hors service</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Items */}
                    <div className="flex items-center space-x-3 relative">
                        
                        {/* Notifications Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                className="p-2 text-stone-600 hover:text-yellow-700 rounded-xl hover:bg-stone-50 transition-colors relative" 
                                title="Notifications livreur"
                            >
                                <Bell className="w-5 h-5 text-stone-600" />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-white"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {notifDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Bell className="w-4 h-4 text-yellow-600" />
                                            <h4 className="font-bold text-xs text-stone-900">Alertes livraisons</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                                        {driverNotifications.map((n) => (
                                            <div key={n.id} className="p-2.5 bg-stone-50 rounded-xl space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-semibold text-stone-900">{n.title}</span>
                                                    <span className="text-[10px] text-stone-400">{n.time}</span>
                                                </div>
                                                <p className="text-[11px] text-stone-600 leading-normal">{n.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="h-5 w-px bg-stone-200"></div>

                        {/* Driver Profile */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 font-bold text-xs flex items-center justify-center border border-yellow-500 uppercase shadow-2xs">
                                {user.first_name ? user.first_name[0] : 'L'}
                            </div>
                            <span className="text-xs font-semibold text-stone-800 hidden sm:inline-block">
                                {user.first_name} {user.last_name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* OFFLINE WARNING BANNER */}
                {isOffline && (
                    <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-inner">
                        <WifiOff className="w-4 h-4" />
                        <span>⚡ Mode Hors-ligne activé — Les courses en cours et les adresses restent consultables sans connexion réseau.</span>
                    </div>
                )}

                {/* Main View Container */}
                <div className="flex-1 overflow-y-auto bg-stone-100/60 relative">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="px-6 pt-4">
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span>{flash.success}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="px-6 pt-4">
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs">
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    <main className="p-4 sm:p-6 w-full">
                        {children}
                    </main>

                    {/* REAL-TIME PUSH DISPATCH POPUP WITH 5-MIN TIMER & ESCROW SPECS (2.3.3 Spec) */}
                    {pushAlert && (
                        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white text-stone-900 rounded-2xl p-5 shadow-2xl border-2 border-yellow-400 animate-in slide-in-from-bottom-5 duration-200 space-y-3">
                            
                            {/* Header with 5-min Decision Timer */}
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                                        <Bell className="w-3.5 h-3.5 text-yellow-950" />
                                    </div>
                                    <h4 className="font-bold text-xs text-stone-900">Nouvelle proposition de course !</h4>
                                </div>

                                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>{formatTimer(timerSeconds)}</span>
                                </div>
                            </div>

                            {/* Details (Pickup, Dropoff, Escrow Amount, Package Type - 2.3.3 Spec) */}
                            <div className="space-y-2 text-xs text-stone-700 font-normal">
                                <div className="flex justify-between items-center bg-stone-50 border border-stone-200/80 p-2 rounded-xl">
                                    <span className="font-mono text-stone-600 font-bold">#{pushAlert.order_number}</span>
                                    <span className="text-yellow-700 font-extrabold">{pushAlert.distance} · {pushAlert.duration}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
                                        <span className="text-stone-400 block font-normal flex items-center gap-1">
                                            <Lock className="w-3 h-3 text-stone-500" /> Escrow sécurisé :
                                        </span>
                                        <strong className="text-stone-900 font-bold">{Number(pushAlert.escrow_amount).toLocaleString('fr-FR')} FCFA</strong>
                                    </div>
                                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
                                        <span className="text-stone-400 block font-normal flex items-center gap-1">
                                            <Package className="w-3 h-3 text-stone-500" /> Spécification colis :
                                        </span>
                                        <strong className="text-stone-900 font-medium truncate block">{pushAlert.package_desc}</strong>
                                    </div>
                                </div>

                                <p><strong className="text-stone-900">Retrait boutique :</strong> {pushAlert.shop_name}</p>
                                <p><strong className="text-stone-900">Destination client :</strong> {pushAlert.destination}</p>
                                
                                <p className="text-emerald-600 font-bold text-sm pt-1">
                                    Frais alloués : +{pushAlert.fee.toLocaleString('fr-FR')} FCFA
                                </p>
                            </div>

                            {/* Actions (Accept / Refuse Modal) */}
                            <div className="flex gap-2 pt-2 border-t border-stone-100">
                                <button
                                    onClick={() => handleAcceptPush(pushAlert.order_number)}
                                    className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1 border border-yellow-500"
                                >
                                    <span>Accepter la course</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setRefuseModalOrderNumber(pushAlert.order_number)}
                                    className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200"
                                >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* REFUSAL JUSTIFICATION MODAL (2.3.3 Spec) */}
            {refuseModalOrderNumber && (
                <RefuseDeliveryModal
                    orderNumber={refuseModalOrderNumber}
                    onClose={() => setRefuseModalOrderNumber(null)}
                />
            )}

            <AIAssistantWidget />
        </div>
    );
}
