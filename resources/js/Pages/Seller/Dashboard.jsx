import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SellerCentralLayout from '../../Layouts/SellerCentralLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';
import Badge from '../../Components/ui/Badge';
import Button from '../../Components/ui/Button';
import { 
    Users as UsersIcon, 
    Store, 
    ShoppingBag, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight, 
    Download, 
    Clock, 
    ArrowRight,
    Award,
    Package,
    ChevronDown,
    Plus
} from 'lucide-react';

export default function Dashboard({ shopsData = [], totalStock = 0, activityLogs = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const seller = user?.seller;
    const shops = shopsData;

    const [selectedShopId, setSelectedShopId] = useState('general');
    const [timeframe, setTimeframe] = useState('week');

    // Primary Theme Accent Color
    const primaryColor = '#ecd500ff';

    const selectedShop = shops.find(s => String(s.id) === String(selectedShopId));

    // Calculate dynamic products statistics
    const totalProductsCount = shopsData.reduce((sum, s) => sum + (s.products?.length || 0), 0);
    const shopProductsCount = selectedShop ? (selectedShop.products?.length || 0) : 0;
    const shopStockCount = selectedShop ? (selectedShop.products?.reduce((sum, p) => sum + p.stock, 0) || 0) : 0;

    // Convert activity logs to dashboard format
    const dbActivities = activityLogs.map(log => {
        const date = new Date(log.created_at);
        return {
            id: log.id,
            description: log.description,
            time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        };
    });

    // Get real recent products
    const dbProducts = selectedShopId === 'general'
        ? shopsData.flatMap(s => (s.products || []).map(p => ({
            name: p.name,
            category: 'Général',
            price: parseFloat(p.price).toLocaleString('fr-FR') + ' CFA',
            status: p.stock > 3 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock',
            statusText: p.stock > 3 ? 'En stock' : p.stock > 0 ? 'Stock bas' : 'Rupture'
        }))).slice(0, 4)
        : (selectedShop?.products || []).map(p => ({
            name: p.name,
            category: 'Local',
            price: parseFloat(p.price).toLocaleString('fr-FR') + ' CFA',
            status: p.stock > 3 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock',
            statusText: p.stock > 3 ? 'En stock' : p.stock > 0 ? 'Stock bas' : 'Rupture'
        })).slice(0, 4);

    // Get real top products preview
    const dbTopProducts = selectedShopId === 'general'
        ? shopsData.flatMap(s => (s.products || []).map(p => ({
            name: p.name,
            category: s.name,
            sales: 0,
            revenue: parseFloat(p.price).toLocaleString('fr-FR') + ' CFA'
        }))).slice(0, 3)
        : (selectedShop?.products || []).map(p => ({
            name: p.name,
            category: selectedShop.name,
            sales: 0,
            revenue: parseFloat(p.price).toLocaleString('fr-FR') + ' CFA'
        })).slice(0, 3);

    // Fallbacks if no products added yet
    const displayProducts = dbProducts.length > 0 ? dbProducts : [
        { name: 'Aucun produit', category: '-', price: '-', status: 'out_of_stock', statusText: 'Vide' }
    ];

    const displayTopProducts = dbTopProducts.length > 0 ? dbTopProducts : [
        { name: 'Aucun produit', category: '-', sales: 0, revenue: '-' }
    ];

    const displayActivities = dbActivities.length > 0 ? dbActivities : [
        { id: 1, description: 'Aucune activité récente enregistrée.', time: 'À l\'instant' }
    ];

    // Dynamic state data depending on selected shop in dropdown
    const activeStats = selectedShopId === 'general' ? {
        revenue: '148 500 CFA',
        orders: 18,
        products: `${totalProductsCount} (${totalStock}/30)`,
        customers: 12,
        revenueChange: '+18.4%',
        ordersChange: '+12.5%',
        productsChange: `Stock total utilisé : ${totalStock} / 30`,
        customersChange: '+15% ce mois',
        recentOrders: [
            { id: '#CMD-9821', customer: 'Hervé Ngueme', shopName: 'Electro World', amount: '24 500 CFA', status: 'pending', date: 'Il y a 10 min' },
            { id: '#CMD-9819', customer: 'Clarisse Ngo', shopName: 'Robe Style', amount: '67 000 CFA', status: 'processing', date: 'Il y a 1 h' },
            { id: '#CMD-9818', customer: 'Marc Kamga', shopName: 'Electro World', amount: '12 000 CFA', status: 'shipped', date: 'Il y a 3 h' },
            { id: '#CMD-9812', customer: 'Amina Bello', shopName: 'Robe Style', amount: '45 000 CFA', status: 'delivered', date: 'Hier' }
        ],
        recentProducts: displayProducts,
        topProducts: displayTopProducts,
        activities: displayActivities
    } : {
        revenue: '92 500 CFA',
        orders: 10,
        products: `${shopProductsCount} (${shopStockCount} stock)`,
        customers: 7,
        revenueChange: '+14.2%',
        ordersChange: '+8.3%',
        productsChange: `Stock de la boutique : ${shopStockCount} unités`,
        customersChange: 'Clients uniques',
        recentOrders: [
            { id: '#CMD-9821', customer: 'Hervé Ngueme', shopName: selectedShop?.name || '', amount: '24 500 CFA', status: 'pending', date: 'Il y a 10 min' },
            { id: '#CMD-9818', customer: 'Marc Kamga', shopName: selectedShop?.name || '', amount: '12 000 CFA', status: 'shipped', date: 'Il y a 3 h' }
        ],
        recentProducts: displayProducts,
        topProducts: displayTopProducts,
        activities: displayActivities
    };

    const hasReachedLimit = seller?.pack === 'starter' && shops.length >= 1;

    return (
        <SellerCentralLayout title="Sellify Central">
            <Head title="Tableau de bord - Sellify Central" />

            <div className="space-y-6 px-1">
                {/* 1. Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-700 tracking-tight">Tableau de bord</h2>
                        <p className="text-sm text-surface-500 mt-1">Gérez votre activité de vendeur et vos boutiques</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Custom Styled Shop Dropdown Selector */}
                        <div className="relative">
                            <select
                                value={selectedShopId}
                                onChange={(e) => setSelectedShopId(e.target.value)}
                                className="appearance-none bg-white border border-surface-200 pl-4 pr-10 py-2 rounded-md text-xs font-meduim text-surface-700 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 cursor-pointer"
                            >
                                <option value="general">Global (Toutes les boutiques)</option>
                                {shops.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Timeframe */}
                        <div className="flex items-center space-x-3 bg-white border border-surface-200 p-1 rounded-md">
                            <div className="flex space-x-1">
                                {[
                                    { id: 'week', label: 'Semaine' },
                                    { id: 'month', label: 'Mois' },
                                    { id: 'year', label: 'Année' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setTimeframe(tab.id)}
                                        className={`px-3 py-1.5 rounded-md text-xs transition-all
                                            ${timeframe === tab.id
                                                ? 'text-yellow-650 bg-yellow-50 font-meduim'
                                                : 'text-surface-500 hover:text-surface-800'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="h-4 w-px bg-surface-200" />
                            <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs  text-surface-650 hover:text-surface-900 transition-colors">
                                <Download className="w-3.5 h-3.5" />
                                <span>Exporter</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Welcome Banner */}
                <div className="bg-yellow-500 text-white rounded-xl p-6 flex flex-col justify-center min-h-[100px] relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-full opacity-10 bg-gradient-to-l from-white pointer-events-none" />
                    <div className="flex justify-between items-center z-10 w-full">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <span>Bonjour, {user.first_name}</span>
                                <span className="ml-1.5">👋</span>
                            </h3>
                            <p className="text-xs text-yellow-50 mt-1">
                                {selectedShopId === 'general' 
                                    ? 'Voici ce qui se passe sur vos boutiques aujourd\'hui.'
                                    : `Voici ce qui se passe sur votre boutique "${selectedShop?.name}" aujourd'hui.`
                                }
                            </p>
                        </div>

                        {selectedShopId !== 'general' && selectedShop && (
                            <Link href={route('seller.shop.dashboard', selectedShop.slug)}>
                                <Button size="sm" className="bg-white text-yellow-600 hover:bg-yellow-50 border-none  flex items-center space-x-1">
                                    <span>Gérer la boutique</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 3. Four Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Revenue */}
                    <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Chiffre d'affaires</span>
                            <span className="text-2xl font-bold text-surface-750 block">{activeStats.revenue}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">{activeStats.revenueChange} ce mois</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">Revenu net</span>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Orders */}
                    <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Commandes reçues</span>
                            <span className="text-2xl font-bold text-surface-750 block">{activeStats.orders}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">{activeStats.ordersChange} ce mois</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">
                                {selectedShopId === 'general' ? 'Toutes boutiques confondues' : 'Boutique courante'}
                            </span>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Products */}
                    <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Catalogue global</span>
                            <span className="text-2xl font-bold text-surface-750 block">{activeStats.products}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">Produits en ligne</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">{activeStats.productsChange}</span>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 4: Customers */}
                    <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Clients uniques</span>
                            <span className="text-2xl font-bold text-surface-750 block">{activeStats.customers}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">{activeStats.customersChange}</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">Historique local</span>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* 4. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Sales & Orders Combination Chart */}
                    <div className="lg:col-span-2 bg-white border border-surface-200 rounded-xl p-5 shadow-xs">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-sm font-bold text-surface-700">Aperçu des ventes</h4>
                                <span className="text-[11px] text-surface-400 mt-0.5 block">Évolution des ventes et commandes</span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs font-semibold">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-600" />
                                    <span className="text-surface-500">Ventes</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span className="text-surface-500">Commandes</span>
                                </div>
                            </div>
                        </div>

                        {/* Responsive SVG Chart */}
                        <div className="relative w-full h-[240px]">
                            <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="40" y1="40" x2="570" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="90" x2="570" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="140" x2="570" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="190" x2="570" y2="190" stroke="#f1f5f9" strokeWidth="1" />

                                {/* Bar Chart: Commandes */}
                                {/* Mon */} <rect x="75" y="150" width="30" height="40" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                {/* Tue */} <rect x="155" y="110" width="30" height="80" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                {/* Wed */} <rect x="235" y="130" width="30" height="60" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                {/* Thu */} <rect x="315" y="90" width="30" height="100" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                {/* Fri */} <rect x="395" y="50" width="30" height="140" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                {/* Sat */} <rect x="475" y="95" width="30" height="95" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                {/* Sun */} <rect x="555" y="135" width="30" height="55" rx="4" fill="#3b82f6" fillOpacity="0.8" />

                                {/* Line Chart: Ventes */}
                                <path
                                    d="M 90,160 Q 170,130 250,140 T 410,70 T 570,120"
                                    fill="none"
                                    stroke="#CA8A04"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />

                                {/* Dot markers on the line */}
                                <circle cx="90" cy="160" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="170" cy="130" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="250" cy="140" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="330" cy="115" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="410" cy="70" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="490" cy="90" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="570" cy="120" r="4.5" fill="#CA8A04" stroke="#ffffff" strokeWidth="2" />

                                {/* Left Axis Labels (Ventes) */}
                                <text x="10" y="44" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">8000</text>
                                <text x="10" y="94" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">6000</text>
                                <text x="10" y="144" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">4000</text>
                                <text x="10" y="194" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">2000</text>

                                {/* Right Axis Labels (Commandes) */}
                                <text x="580" y="44" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">100</text>
                                <text x="580" y="94" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">75</text>
                                <text x="580" y="144" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">50</text>
                                <text x="580" y="194" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">25</text>

                                {/* X Axis Line */}
                                <line x1="40" y1="190" x2="570" y2="190" stroke="#cbd5e1" strokeWidth="1" />

                                {/* X Axis Labels */}
                                <text x="83" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Lun</text>
                                <text x="163" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Mar</text>
                                <text x="243" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Mer</text>
                                <text x="323" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Jeu</text>
                                <text x="403" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Ven</text>
                                <text x="483" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Sam</text>
                                <text x="561" y="210" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Dim</text>
                            </svg>
                        </div>
                    </div>

                    {/* Right: Pie Category Sales Chart */}
                    <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-surface-700">Ventes par catégorie</h4>
                            <span className="text-[11px] text-surface-400 mt-0.5 block">Répartition sur le mois en cours</span>
                        </div>

                        {/* SVG Donut Chart */}
                        <div className="flex justify-center items-center my-4">
                            <svg className="w-32 h-32" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                                {/* Yellow (High-tech) - 50% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#CA8A04" strokeWidth="4" 
                                    strokeDasharray="50 50" strokeDashoffset="25" />
                                {/* Blue (Fashion/Clothes) - 30% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" 
                                    strokeDasharray="30 70" strokeDashoffset="75" />
                                {/* Purple (Others) - 20% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" 
                                    strokeDasharray="20 80" strokeDashoffset="105" />
                            </svg>
                        </div>

                        {/* Breakdown List */}
                        <div className="space-y-2 text-xs font-semibold text-surface-600">
                            {[
                                { name: 'High-Tech', percent: '50%', color: 'bg-yellow-600' },
                                { name: 'Mode', percent: '30%', color: 'bg-blue-500' },
                                { name: 'Autres', percent: '20%', color: 'bg-purple-500' }
                            ].map((cat) => (
                                <div key={cat.name} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className="font-mono text-surface-900">{cat.percent}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. Details Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Commandes Récentes & Catalogue */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* A. Commandes Récentes */}
                        <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-700 flex items-center space-x-2">
                                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                                    <span>Dernières commandes</span>
                                </h4>
                                <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                                    {selectedShopId === 'general' ? 'Toutes les boutiques' : 'Boutique active'}
                                </span>
                            </div>
                            
                            {activeStats.recentOrders.length === 0 ? (
                                <div className="py-6 text-center text-surface-400 text-xs font-semibold">
                                    Aucune commande récente.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="text-surface-400 font-bold uppercase tracking-wider border-b border-surface-100 pb-2">
                                                <th className="pb-2.5 font-semibold">Commande ID</th>
                                                <th className="pb-2.5 font-semibold">Boutique</th>
                                                <th className="pb-2.5 font-semibold">Client</th>
                                                <th className="pb-2.5 font-semibold">Date</th>
                                                <th className="pb-2.5 font-semibold">Montant</th>
                                                <th className="pb-2.5 font-semibold">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-50 text-surface-600 font-semibold">
                                            {activeStats.recentOrders.map((ord) => (
                                                <tr key={ord.id} className="hover:bg-surface-50/50">
                                                    <td className="py-2.5 font-mono text-surface-900">{ord.id}</td>
                                                    <td className="py-2.5 text-xs text-surface-500">{ord.shopName}</td>
                                                    <td className="py-2.5">{ord.customer}</td>
                                                    <td className="py-2.5 text-surface-400">{ord.date}</td>
                                                    <td className="py-2.5 font-mono text-surface-900">{ord.amount}</td>
                                                    <td className="py-2.5">
                                                        <Badge variant={
                                                            ord.status === 'delivered' ? 'success' :
                                                            ord.status === 'pending' ? 'warning' : 'info'
                                                        }>
                                                            {ord.status === 'delivered' ? 'Livré' : ord.status === 'pending' ? 'En attente' : 'En cours'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* B. Catalogue / Produits Récents */}
                        <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-700 flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-emerald-500" />
                                    <span>Produits du catalogue</span>
                                </h4>
                                <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                                    Dernières modifications
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-surface-400 font-bold uppercase tracking-wider border-b border-surface-100 pb-2">
                                            <th className="pb-2.5 font-semibold">Nom du produit</th>
                                            <th className="pb-2.5 font-semibold">Catégorie</th>
                                            <th className="pb-2.5 font-semibold">Prix</th>
                                            <th className="pb-2.5 font-semibold">Statut Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-50 text-surface-600 font-semibold">
                                        {activeStats.recentProducts.map((p, index) => (
                                            <tr key={index} className="hover:bg-surface-50/50">
                                                <td className="py-2.5 text-surface-900">{p.name}</td>
                                                <td className="py-2.5 text-surface-400">{p.category}</td>
                                                <td className="py-2.5 font-mono text-surface-900">{p.price}</td>
                                                <td className="py-2.5">
                                                    <Badge variant={
                                                        p.status === 'in_stock' ? 'success' :
                                                        p.status === 'low_stock' ? 'warning' : 'danger'
                                                    }>
                                                        {p.statusText}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Top Produits & Activités Récentes */}
                    <div className="space-y-6">
                        {/* A. Top Produits */}
                        <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-700 flex items-center space-x-2">
                                    <Award className="w-4 h-4 text-purple-500" />
                                    <span>Produits les plus vendus</span>
                                </h4>
                                <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Ce mois</span>
                            </div>
                            
                            <div className="space-y-3.5 text-xs font-semibold text-surface-600">
                                {activeStats.topProducts.map((p, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                                                {p.name[0]}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-surface-900 block">{p.name}</span>
                                                <span className="text-[10px] text-surface-400 block mt-0.5">{p.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-surface-900 block font-mono">{p.revenue}</span>
                                            <span className="text-[10px] text-surface-400 block font-mono mt-0.5">{p.sales} ventes</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* B. Activités Récentes */}
                        <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-700 flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>Historique récent</span>
                                </h4>
                            </div>
                            
                            <div className="space-y-4 relative border-l border-surface-150 pl-3.5 ml-2 py-1">
                                {activeStats.activities.map((log) => (
                                    <div key={log.id} className="relative text-xs">
                                        <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-surface-800">Système</span>
                                            <span className="text-[10px] text-surface-400 font-mono">{log.time}</span>
                                        </div>
                                        <p className="text-[11px] text-surface-500 leading-relaxed mt-0.5 font-medium">
                                            {log.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SellerCentralLayout>
    );
}
