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
    ChevronDown,
    Plus,
    Boxes,
    Link2,
    Wallet,
    Sparkles,
    TrendingUp,
    BarChart2,
    PieChart,
    Search,
    Calendar,
    Download,
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

    // Orders History Mock Data (Multi-shop & Single shop)
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

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>Espace Vendeur Centralisé</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Bonjour, {user.first_name} {user.last_name} 👋
                        </h1>
                        <p className="text-xs text-stone-600">
                            Superviser vos boutiques, vos ventes, l'historique des commandes et la performance globale.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            className="bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer shadow-xs"
                        >
                            <option value="general">Vue Globale (Toutes les boutiques)</option>
                            {shops.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>

                        <div className="flex items-center bg-white border border-stone-200 p-1 rounded-xl text-xs">
                            {['week', 'month', 'year'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-3 py-1 rounded-lg font-medium transition-all capitalize ${
                                        timeframe === t ? 'bg-amber-500 text-amber-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                                    }`}
                                >
                                    {t === 'week' ? 'Semaine' : t === 'month' ? 'Mois' : 'Année'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Revenue Card */}
                    <div className="bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Chiffre d'Affaires</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">148 500 FCFA</p>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +18.4% ce mois
                        </span>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Commandes Reçues</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">18 commandes</p>
                        <span className="text-[11px] text-stone-400 font-normal">Toutes boutiques confondues</span>
                    </div>

                    {/* Stock Card */}
                    <div className="bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Catalogue & Stocks</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <Boxes className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">{totalProductsCount} produit(s)</p>
                        <span className="text-[11px] text-stone-400 font-normal">Stock total : {totalStock} unités</span>
                    </div>

                    {/* Shops Count Card */}
                    <div className="bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Boutiques Rattachées</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Store className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900">{shops.length} boutique(s)</p>
                        <span className="text-[11px] text-amber-800 font-medium capitalize">Formule Pack {seller?.pack || 'Starter'}</span>
                    </div>

                </div>

                {/* Interactive Statistics Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left: Combined Sales & Orders Line/Bar Chart (2 Cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-amber-600" />
                                <div>
                                    <h3 className="font-semibold text-stone-900 text-sm">Évolution des Ventes & Commandes</h3>
                                    <span className="text-[11px] text-stone-400 font-normal">Revenus bruts vs volume de commandes</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
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
                        <div className="relative w-full h-[230px] pt-2">
                            <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="40" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="180" x2="570" y2="180" stroke="#f1f5f9" strokeWidth="1" />

                                {/* Bar Chart: Commandes */}
                                <rect x="75" y="140" width="28" height="40" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                <rect x="155" y="100" width="28" height="80" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                <rect x="235" y="120" width="28" height="60" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                <rect x="315" y="80" width="28" height="100" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                <rect x="395" y="40" width="28" height="140" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                <rect x="475" y="85" width="28" height="95" rx="4" fill="#3b82f6" fillOpacity="0.8" />
                                <rect x="555" y="125" width="28" height="55" rx="4" fill="#3b82f6" fillOpacity="0.8" />

                                {/* Line Chart: Ventes */}
                                <path
                                    d="M 89,150 Q 169,120 249,130 T 409,60 T 569,110"
                                    fill="none"
                                    stroke="#F59E0B"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />

                                {/* Dot Markers */}
                                <circle cx="89" cy="150" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="169" cy="120" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="249" cy="130" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="329" cy="105" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="409" cy="60" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="489" cy="80" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="569" cy="110" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />

                                {/* Axis Labels */}
                                <text x="10" y="34" fill="#a8a29e" fontSize="10" fontWeight="500">80k</text>
                                <text x="10" y="84" fill="#a8a29e" fontSize="10" fontWeight="500">50k</text>
                                <text x="10" y="134" fill="#a8a29e" fontSize="10" fontWeight="500">20k</text>
                                <text x="10" y="184" fill="#a8a29e" fontSize="10" fontWeight="500">0</text>

                                <text x="80" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Lun</text>
                                <text x="160" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Mar</text>
                                <text x="240" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Mer</text>
                                <text x="320" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Jeu</text>
                                <text x="400" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Ven</text>
                                <text x="480" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Sam</text>
                                <text x="558" y="202" fill="#a8a29e" fontSize="10" fontWeight="500">Dim</text>
                            </svg>
                        </div>
                    </div>

                    {/* Right: Pie Breakdown of Sales (1 Col) */}
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <PieChart className="w-4 h-4 text-amber-600" />
                            <div>
                                <h3 className="font-semibold text-stone-900 text-sm">Ventes par Catégorie</h3>
                                <span className="text-[11px] text-stone-400 font-normal">Proportion sur les 30 derniers jours</span>
                            </div>
                        </div>

                        {/* Donut Graphic */}
                        <div className="flex justify-center items-center my-2">
                            <svg className="w-28 h-28" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f5f5f4" strokeWidth="4.5" />
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="50 50" strokeDashoffset="25" />
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="75" />
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="105" />
                            </svg>
                        </div>

                        <div className="space-y-2 text-xs font-medium text-stone-600">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span>Électronique & High-Tech</span>
                                </div>
                                <span className="font-semibold text-stone-900">50%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span>Mode & Vetements</span>
                                </div>
                                <span className="font-semibold text-stone-900">30%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span>Autres Accessoires</span>
                                </div>
                                <span className="font-semibold text-stone-900">20%</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Orders History Table */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Historique Récent des Commandes ({filteredOrders.length})</h3>
                        </div>

                        <Link href={route('seller.inventory.index')} className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-1">
                            <span>Gestion des stocks</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-6 py-3.5">Référence</th>
                                    <th className="px-6 py-3.5">Boutique</th>
                                    <th className="px-6 py-3.5">Client</th>
                                    <th className="px-6 py-3.5 text-center">Articles</th>
                                    <th className="px-6 py-3.5 text-right">Montant Total</th>
                                    <th className="px-6 py-3.5">Statut Livraison / Escrow</th>
                                    <th className="px-6 py-3.5 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-stone-400 font-normal">
                                            Aucune commande enregistrée.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(ord => (
                                        <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                                            <td className="px-6 py-3.5 font-mono font-semibold text-amber-900">
                                                {ord.id}
                                            </td>

                                            <td className="px-6 py-3.5 font-medium text-stone-900">
                                                {ord.shopName}
                                            </td>

                                            <td className="px-6 py-3.5 font-normal text-stone-800">
                                                {ord.customer}
                                            </td>

                                            <td className="px-6 py-3.5 text-center font-medium">
                                                {ord.items} article(s)
                                            </td>

                                            <td className="px-6 py-3.5 text-right font-semibold text-stone-900">
                                                {ord.amount}
                                            </td>

                                            <td className="px-6 py-3.5">
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

                                            <td className="px-6 py-3.5 text-right text-stone-400 font-normal">
                                                {ord.date}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Logs Section */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <h3 className="font-semibold text-stone-900 text-sm">Journal d'Activité Récent</h3>
                    </div>

                    <div className="p-5 divide-y divide-stone-100 text-xs">
                        {dbActivities.length === 0 ? (
                            <p className="text-stone-400 font-normal text-center py-4">Aucune activité récente enregistrée.</p>
                        ) : (
                            dbActivities.slice(0, 5).map(log => (
                                <div key={log.id} className="py-2.5 flex items-center justify-between text-stone-600 font-normal">
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
