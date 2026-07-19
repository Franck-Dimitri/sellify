import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SellerLayout from '../../Layouts/SellerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';
import Badge from '../../Components/ui/Badge';
import Button from '../../Components/ui/Button';
import { 
    DollarSign, 
    ShoppingBag, 
    Package, 
    Users, 
    ArrowUpRight, 
    ArrowDownRight, 
    Plus, 
    Store, 
    ExternalLink, 
    Clock, 
    Settings, 
    ShieldAlert,
    TrendingUp,
    Truck,
    ArrowRight,
    Globe
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [timeframe, setTimeframe] = useState('week');
    
    const user = auth.user;
    const seller = user?.seller;
    const shop = seller?.shop;
    
    const activeThemeColor = shop?.theme_color || '#EAB308';

    // Mock stats
    const stats = {
        revenue: shop ? '148 500 CFA' : '0 CFA',
        orders: shop ? 18 : 0,
        products: shop ? '4 / 30' : '0 / 30',
        customers: shop ? 12 : 0
    };

    // Mock orders
    const recentOrders = shop ? [
        { id: '#ORD-9821', customer: 'Amina Bello', amount: '12 500 CFA', status: 'delivered', date: 'Aujourd\'hui, 10:15' },
        { id: '#ORD-9820', customer: 'Marc Omgba', amount: '35 000 CFA', status: 'pending', date: 'Aujourd\'hui, 08:30' },
        { id: '#ORD-9819', customer: 'Marie Ngo', amount: '8 500 CFA', status: 'delivered', date: 'Hier, 17:45' },
        { id: '#ORD-9818', customer: 'Jean Kemajou', amount: '92 500 CFA', status: 'cancelled', date: '17 Juil, 14:20' }
    ] : [];

    return (
        <SellerLayout title="Tableau de bord">
            <Head title="Tableau de bord Vendeur" />

            <div className="space-y-6">
                {/* 1. Header & Welcome Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-surface-900 tracking-tight">Tableau de bord professionnel</h1>
                        <p className="text-sm text-surface-500 font-medium">
                            {shop ? `Suivi d'activité pour la boutique ${shop.name}` : 'Bienvenue sur votre espace vendeur Sellify'}
                        </p>
                    </div>

                    {shop && (
                        <div className="flex items-center space-x-2 bg-white border border-surface-200 p-1 rounded-2xl shadow-sm shrink-0">
                            {[
                                { id: 'week', label: 'Semaine' },
                                { id: 'month', label: 'Mois' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTimeframe(tab.id)}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                                    style={timeframe === tab.id ? { 
                                        backgroundColor: activeThemeColor, 
                                        color: '#FFFFFF' 
                                    } : { 
                                        color: '#64748B' 
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Onboarding banner OR Status Notifications */}
                {!shop ? (
                    <div className="bg-gradient-to-br from-surface-900 to-surface-950 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-radial-gradient pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${activeThemeColor} 0%, transparent 80%)` }} />
                        <div className="max-w-xl space-y-4 relative z-10">
                            <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: activeThemeColor }}>
                                Étape 1 sur 2
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                                Configurez votre boutique professionnelle en quelques clics
                            </h2>
                            <p className="text-sm text-surface-300 leading-relaxed font-medium">
                                Votre profil vendeur est actif. Créez dès maintenant votre vitrine personnalisée (style Alibaba avec horaires, logo, bannière de couverture, et contacts directs) pour commencer à vendre.
                            </p>
                            <div className="pt-2">
                                <Link href={route('seller.shop.create')}>
                                    <Button className="font-bold text-surface-950 hover:scale-[1.02] transition-transform flex items-center space-x-2 shadow-lg" style={{ backgroundColor: activeThemeColor }}>
                                        <Store className="w-4.5 h-4.5" />
                                        <span>Créer ma boutique pro</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    user.kyc_status !== 'verified' && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-3xl flex items-start space-x-4">
                            <div className="p-2 bg-yellow-100 rounded-xl text-yellow-850">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-yellow-900 text-sm">Dossier KYC en cours de révision</h4>
                                <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                                    Vos documents juridiques sont en cours de validation par nos agents. La création de boutique est autorisée, mais certaines fonctionnalités de paiement ou livraison critiques restent suspendues en attendant l'activation définitive de votre profil.
                                </p>
                            </div>
                        </div>
                    )
                )}

                {/* 3. Main Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Chiffre d'affaires</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.revenue}</span>
                            {shop && (
                                <div className="flex items-center space-x-1 pt-1.5">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-500">+12.4%</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-600 rounded-2xl border border-surface-150">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Commandes</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.orders}</span>
                            {shop && (
                                <div className="flex items-center space-x-1 pt-1.5">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-500">+8.1%</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-600 rounded-2xl border border-surface-150">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Products Card */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Produits</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.products}</span>
                            <span className="text-[10px] text-surface-400 block pt-1.5 font-bold">Limite Starter : 30 max</span>
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-600 rounded-2xl border border-surface-150">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Customers Card */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Clients</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.customers}</span>
                            {shop && (
                                <div className="flex items-center space-x-1 pt-1.5">
                                    <span className="text-[10px] text-surface-400 font-bold">Acheteurs récurrents</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-600 rounded-2xl border border-surface-150">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* 4. Quick Actions Banner */}
                {shop && (
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                        <h3 className="text-xs font-black text-surface-400 uppercase tracking-wider mb-4">Actions Rapides</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <a href={route('shop.public', shop.slug)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-2xl border border-surface-150 hover:border-surface-300 hover:bg-surface-50/50 transition-all group">
                                <div className="flex items-center space-x-2.5">
                                    <Globe className="w-4.5 h-4.5 text-surface-400 group-hover:text-surface-600 transition-colors" />
                                    <span className="text-xs font-bold text-surface-700">Voir boutique</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-surface-400 group-hover:translate-x-0.5 transition-transform" />
                            </a>

                            <button className="flex items-center justify-between p-3 rounded-2xl border border-surface-150 hover:border-surface-300 hover:bg-surface-50/50 transition-all group">
                                <div className="flex items-center space-x-2.5">
                                    <Plus className="w-4.5 h-4.5 text-surface-400 group-hover:text-surface-600 transition-colors" />
                                    <span className="text-xs font-bold text-surface-700">Nouveau produit</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-surface-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <Link href={route('seller.shop.edit')} className="flex items-center justify-between p-3 rounded-2xl border border-surface-150 hover:border-surface-300 hover:bg-surface-50/50 transition-all group">
                                <div className="flex items-center space-x-2.5">
                                    <Settings className="w-4.5 h-4.5 text-surface-400 group-hover:text-surface-600 transition-colors" />
                                    <span className="text-xs font-bold text-surface-700">Paramètres</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-surface-400 group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            <button className="flex items-center justify-between p-3 rounded-2xl border border-surface-150 hover:border-surface-300 hover:bg-surface-50/50 transition-all group">
                                <div className="flex items-center space-x-2.5">
                                    <Truck className="w-4.5 h-4.5 text-surface-400 group-hover:text-surface-600 transition-colors" />
                                    <span className="text-xs font-bold text-surface-700">Livraisons</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-surface-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. Charts & Lists Grid */}
                {shop ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sales Chart Box (2 cols) */}
                        <div className="lg:col-span-2 bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-sm font-extrabold text-surface-900">Aperçu du Chiffre d'affaires</h4>
                                    <span className="text-[11px] text-surface-400 mt-0.5 block">Performances de vente quotidiennes</span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-500">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Croissance positive</span>
                                </div>
                            </div>

                            {/* Beautiful SVG Sales Chart */}
                            <div className="relative w-full h-[220px]">
                                <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                                    <line x1="40" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="40" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="40" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="40" y1="180" x2="570" y2="180" stroke="#f1f5f9" strokeWidth="1" />

                                    {/* SVG Area chart */}
                                    <path
                                        d="M 90,150 Q 170,120 250,135 T 410,60 T 570,100 L 570,180 L 90,180 Z"
                                        fill="url(#colorUv)"
                                        opacity="0.15"
                                    />
                                    
                                    <path
                                        d="M 90,150 Q 170,120 250,135 T 410,60 T 570,100"
                                        fill="none"
                                        stroke={activeThemeColor}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />

                                    {/* Chart dots */}
                                    <circle cx="90" cy="150" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />
                                    <circle cx="170" cy="120" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />
                                    <circle cx="250" cy="135" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />
                                    <circle cx="330" cy="110" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />
                                    <circle cx="410" cy="60" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />
                                    <circle cx="490" cy="80" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />
                                    <circle cx="570" cy="100" r="4" fill={activeThemeColor} stroke="#ffffff" strokeWidth="2" />

                                    <text x="10" y="34" fill="#94a3b8" fontSize="9" fontWeight="700">50K</text>
                                    <text x="10" y="84" fill="#94a3b8" fontSize="9" fontWeight="700">30K</text>
                                    <text x="10" y="134" fill="#94a3b8" fontSize="9" fontWeight="700">10K</text>
                                    <text x="10" y="184" fill="#94a3b8" fontSize="9" fontWeight="700">0</text>

                                    <line x1="40" y1="180" x2="570" y2="180" stroke="#cbd5e1" strokeWidth="1" />

                                    <text x="83" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Lun</text>
                                    <text x="163" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Mar</text>
                                    <text x="243" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Mer</text>
                                    <text x="323" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Jeu</text>
                                    <text x="403" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Ven</text>
                                    <text x="483" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Sam</text>
                                    <text x="561" y="198" fill="#94a3b8" fontSize="10" fontWeight="700">Dim</text>

                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={activeThemeColor} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={activeThemeColor} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        {/* Recent Orders Box (1 col) */}
                        <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-extrabold text-surface-900 flex items-center space-x-2">
                                    <ShoppingBag className="w-4 h-4 text-surface-400" />
                                    <span>Commandes récentes</span>
                                </h4>
                            </div>

                            {recentOrders.length === 0 ? (
                                <div className="py-8 text-center text-surface-400 text-xs font-semibold">
                                    Aucune commande enregistrée.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((ord) => (
                                        <div key={ord.id} className="flex justify-between items-start text-xs font-semibold hover:bg-surface-50 p-2 rounded-xl transition-colors">
                                            <div>
                                                <span className="font-mono text-surface-900 block">{ord.id}</span>
                                                <span className="text-surface-400 text-[10px] block mt-0.5">{ord.customer} • {ord.date}</span>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="font-mono text-surface-900 block">{ord.amount}</span>
                                                <Badge variant={
                                                    ord.status === 'delivered' ? 'success' :
                                                    ord.status === 'pending' ? 'warning' : 'danger'
                                                }>
                                                    {ord.status === 'delivered' ? 'Livré' : ord.status === 'pending' ? 'En cours' : 'Annulé'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* If no shop, show a nice empty layout placeholder */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                        <div className="bg-white border border-surface-200 rounded-3xl p-6 h-60 flex flex-col justify-center items-center text-center space-y-3">
                            <div className="p-4 bg-surface-50 rounded-2xl">
                                <TrendingUp className="w-8 h-8 text-surface-300" />
                            </div>
                            <span className="text-sm font-bold text-surface-400">Les graphiques de vente s'afficheront après la configuration</span>
                        </div>
                        <div className="bg-white border border-surface-200 rounded-3xl p-6 h-60 flex flex-col justify-center items-center text-center space-y-3">
                            <div className="p-4 bg-surface-50 rounded-2xl">
                                <ShoppingBag className="w-8 h-8 text-surface-300" />
                            </div>
                            <span className="text-sm font-bold text-surface-400">Les commandes récentes apparaîtront ici</span>
                        </div>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
