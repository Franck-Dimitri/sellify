import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SellerCentralLayout from '../../Layouts/SellerCentralLayout';
import { 
    Store, 
    ShoppingBag, 
    DollarSign, 
    ArrowUpRight, 
    Clock, 
    ArrowRight,
    Package,
    Boxes,
    Sparkles,
    BarChart2,
    PieChart,
    Search,
    Calendar,
    Eye
} from 'lucide-react';

export default function Dashboard({ shopsData = [], totalStock = 0, activityLogs = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const seller = user?.seller;
    const shops = shopsData;

    const [selectedShopId, setSelectedShopId] = useState('general');
    const [timeframe, setTimeframe] = useState('week');

    const selectedShop = shops.find(s => String(s.id) === String(selectedShopId));
    const totalProductsCount = shopsData.reduce((sum, s) => sum + (s.products?.length || 0), 0);

    const dbActivities = activityLogs.map(log => {
        const date = new Date(log.created_at);
        return {
            id: log.id,
            description: log.description,
            time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        };
    });

    // Orders History Data
    const recentOrders = [
        { id: '#CMD-9821', customer: 'Hervé Ngueme', shopName: shops[0]?.name || 'Boutique A', amount: '24 500 FCFA', status: 'pending', date: 'Aujourd\'hui 14:30', items: 2 },
        { id: '#CMD-9819', customer: 'Clarisse Ngo', shopName: shops[1]?.name || shops[0]?.name || 'Boutique B', amount: '67 000 FCFA', status: 'processing', date: 'Aujourd\'hui 11:15', items: 1 },
        { id: '#CMD-9818', customer: 'Marc Kamga', shopName: shops[0]?.name || 'Boutique A', amount: '12 000 FCFA', status: 'shipped', date: 'Hier 18:40', items: 3 },
        { id: '#CMD-9812', customer: 'Amina Bello', shopName: shops[1]?.name || shops[0]?.name || 'Boutique B', amount: '45 000 FCFA', status: 'delivered', date: '19/07/2026', items: 4 },
        { id: '#CMD-9805', customer: 'Jean-Paul Koffi', shopName: shops[0]?.name || 'Boutique A', amount: '31 500 FCFA', status: 'delivered', date: '18/07/2026', items: 2 },
    ];

    const filteredOrders = selectedShopId === 'general'
        ? recentOrders
        : recentOrders.filter(o => o.shopName === selectedShop?.name);

    return (
        <SellerCentralLayout title="Tableau de bord Vendeur">
            <Head title="Tableau de bord - Sellify" />

            <div className="w-full space-y-5 pb-16 text-stone-800 antialiased font-sans">
                
                {/* COMPACT & ELEGANT HEADER BANNER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/70 border border-amber-200/60 p-5 rounded-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Espace Vendeur Centralisé</span>
                        </div>
                        <h1 className="text-lg font-semibold text-stone-900">
                            Bonjour, {user.first_name} {user.last_name} 👋
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Supervision globale de vos boutiques, vos ventes et l'activité récente.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            className="bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer shadow-xs"
                        >
                            <option value="general">Vue Globale (Toutes les boutiques)</option>
                            {shops.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>

                        <div className="flex items-center bg-white border border-stone-200 p-0.5 rounded-lg text-xs">
                            {['week', 'month', 'year'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-2.5 py-1 rounded-md font-medium transition-all capitalize ${
                                        timeframe === t ? 'bg-amber-500 text-amber-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                                    }`}
                                >
                                    {t === 'week' ? 'Semaine' : t === 'month' ? 'Mois' : 'Année'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COMPACT REFINED KPI METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Revenue Card */}
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Chiffre d'Affaires</span>
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                                <DollarSign className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">148 500 FCFA</p>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +18.4% ce mois
                        </span>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Commandes Reçues</span>
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">18 commandes</p>
                        <span className="text-[11px] text-stone-400 font-normal">Toutes boutiques confondues</span>
                    </div>

                    {/* Stock Card */}
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Catalogue & Stocks</span>
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Boxes className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">{totalProductsCount} produit(s)</p>
                        <span className="text-[11px] text-stone-400 font-normal">Stock total : {totalStock} unités</span>
                    </div>

                    {/* Shops Count Card */}
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Boutiques Rattachées</span>
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Store className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">{shops.length} boutique(s)</p>
                        <span className="text-[11px] text-amber-800 font-medium capitalize">Formule Pack {seller?.pack || 'Starter'}</span>
                    </div>

                </div>

                {/* CHARTS & ANALYTICS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Line / Bar Chart (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs space-y-3">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-amber-600" />
                                <div>
                                    <h3 className="font-semibold text-stone-900 text-sm">Évolution des Ventes & Commandes</h3>
                                    <span className="text-[11px] text-stone-400 font-normal">Revenus bruts vs volume de commandes</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-normal text-stone-600">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span>Ventes (FCFA)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span>Commandes</span>
                                </div>
                            </div>
                        </div>

                        {/* Responsive SVG Chart */}
                        <div className="relative w-full h-[200px] pt-1">
                            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <line x1="40" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="75" x2="570" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="120" x2="570" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="165" x2="570" y2="165" stroke="#f1f5f9" strokeWidth="1" />

                                <rect x="75" y="125" width="24" height="40" rx="3" fill="#3b82f6" fillOpacity="0.75" />
                                <rect x="155" y="85" width="24" height="80" rx="3" fill="#3b82f6" fillOpacity="0.75" />
                                <rect x="235" y="105" width="24" height="60" rx="3" fill="#3b82f6" fillOpacity="0.75" />
                                <rect x="315" y="65" width="24" height="100" rx="3" fill="#3b82f6" fillOpacity="0.75" />
                                <rect x="395" y="35" width="24" height="130" rx="3" fill="#3b82f6" fillOpacity="0.75" />
                                <rect x="475" y="75" width="24" height="90" rx="3" fill="#3b82f6" fillOpacity="0.75" />
                                <rect x="555" y="110" width="24" height="55" rx="3" fill="#3b82f6" fillOpacity="0.75" />

                                <path
                                    d="M 87,135 Q 167,105 247,115 T 407,50 T 567,95"
                                    fill="none"
                                    stroke="#F59E0B"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                <circle cx="87" cy="135" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="167" cy="105" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="247" cy="115" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="327" cy="90" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="407" cy="50" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="487" cy="70" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="567" cy="95" r="4" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />

                                <text x="10" y="34" fill="#a8a29e" fontSize="9" fontWeight="400">80k</text>
                                <text x="10" y="79" fill="#a8a29e" fontSize="9" fontWeight="400">50k</text>
                                <text x="10" y="124" fill="#a8a29e" fontSize="9" fontWeight="400">20k</text>
                                <text x="10" y="169" fill="#a8a29e" fontSize="9" fontWeight="400">0</text>

                                <text x="78" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Lun</text>
                                <text x="158" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Mar</text>
                                <text x="238" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Mer</text>
                                <text x="318" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Jeu</text>
                                <text x="398" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Ven</text>
                                <text x="478" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Sam</text>
                                <text x="556" y="186" fill="#a8a29e" fontSize="9" fontWeight="400">Dim</text>
                            </svg>
                        </div>
                    </div>

                    {/* Donut Category Breakdown (1 col) */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
                            <PieChart className="w-4 h-4 text-amber-600" />
                            <div>
                                <h3 className="font-semibold text-stone-900 text-sm">Répartition par Catégorie</h3>
                                <span className="text-[11px] text-stone-400 font-normal">Part des ventes ce mois</span>
                            </div>
                        </div>

                        <div className="flex justify-center items-center my-1">
                            <svg className="w-24 h-24" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f5f5f4" strokeWidth="4" />
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="50 50" strokeDashoffset="25" />
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="75" />
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="105" />
                            </svg>
                        </div>

                        <div className="space-y-1.5 text-xs text-stone-600 font-normal">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span>Électronique & Tech</span>
                                </div>
                                <span className="font-medium text-stone-900">50%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span>Mode & Vêtements</span>
                                </div>
                                <span className="font-medium text-stone-900">30%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span>Autres Ventes</span>
                                </div>
                                <span className="font-medium text-stone-900">20%</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ORDERS HISTORY TABLE */}
                <div className="bg-white border border-stone-200/70 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Historique des Commandes ({filteredOrders.length})</h3>
                        </div>

                        <Link href={route('seller.inventory.index')} className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-1">
                            <span>Gestion des stocks</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600 font-normal">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-5 py-3">Référence</th>
                                    <th className="px-5 py-3">Boutique</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3 text-center">Articles</th>
                                    <th className="px-5 py-3 text-right">Montant Total</th>
                                    <th className="px-5 py-3">Statut Livraison / Escrow</th>
                                    <th className="px-5 py-3 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-stone-400">
                                            Aucune commande disponible.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(ord => (
                                        <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                                            <td className="px-5 py-3 font-mono font-medium text-stone-900">
                                                {ord.id}
                                            </td>

                                            <td className="px-5 py-3 font-medium text-stone-800">
                                                {ord.shopName}
                                            </td>

                                            <td className="px-5 py-3 text-stone-700">
                                                {ord.customer}
                                            </td>

                                            <td className="px-5 py-3 text-center font-medium">
                                                {ord.items}
                                            </td>

                                            <td className="px-5 py-3 text-right font-medium text-stone-900">
                                                {ord.amount}
                                            </td>

                                            <td className="px-5 py-3">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                                                    ord.status === 'delivered'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : ord.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                }`}>
                                                    {ord.status === 'delivered' ? '✓ Livré (Libéré)' : ord.status === 'pending' ? '⏳ En attente' : '📦 En cours (Séquestre)'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-3 text-right text-stone-400 font-normal">
                                                {ord.date}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ACTIVITY LOG SECTION */}
                <div className="bg-white border border-stone-200/70 rounded-xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-stone-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <h3 className="font-semibold text-stone-900 text-sm">Journal d'Activité Récents</h3>
                    </div>

                    <div className="p-4 divide-y divide-stone-100 text-xs font-normal">
                        {dbActivities.length === 0 ? (
                            <p className="text-stone-400 text-center py-3">Aucune activité récente enregistrée.</p>
                        ) : (
                            dbActivities.slice(0, 5).map(log => (
                                <div key={log.id} className="py-2 flex items-center justify-between text-stone-600">
                                    <span>{log.description}</span>
                                    <span className="text-stone-400 text-[11px] font-mono">{log.time}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </SellerCentralLayout>
    );
}
