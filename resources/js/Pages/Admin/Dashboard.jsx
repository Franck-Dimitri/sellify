import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';
import Badge from '../../Components/ui/Badge';
import Button from '../../Components/ui/Button';
import { 
    Users as UsersIcon, 
    Store, 
    Truck, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight, 
    Download, 
    Clock, 
    ShoppingBag, 
    ArrowRight,
    Award
} from 'lucide-react';

export default function Dashboard({ stats, recentKyc, activities }) {
    const [timeframe, setTimeframe] = useState('week');

    // Recent orders mock data
    const recentOrders = [
        { id: '#ORD-1249', customer: 'Amina Bello', amount: '18 500 CFA', status: 'delivered', date: 'Aujourd\'hui, 13:12' },
        { id: '#ORD-1248', customer: 'Jean-Pierre Etoa', amount: '35 000 CFA', status: 'pending', date: 'Aujourd\'hui, 11:45' },
        { id: '#ORD-1247', customer: 'Marie Ngo', amount: '8 200 CFA', status: 'delivered', date: 'Hier, 18:30' },
        { id: '#ORD-1246', customer: 'Ousmanou Ibrahim', amount: '125 000 CFA', status: 'cancelled', date: 'Hier, 15:10' },
        { id: '#ORD-1245', customer: 'Ferdinand Tchakounte', amount: '22 000 CFA', status: 'delivered', date: '16 Juil, 10:22' }
    ];

    // Top Sellers mock data
    const topSellers = [
        { name: 'Électronique Douala', category: 'High-Tech', sales: 142, revenue: '2 840 000 CFA' },
        { name: 'Boutique de Mode Yaoundé', category: 'Vêtements', sales: 98, revenue: '1 470 000 CFA' },
        { name: 'Maison & Déco Cameroun', category: 'Maison', sales: 74, revenue: '1 110 000 CFA' }
    ];

    return (
        <AdminLayout title="Tableau de bord">
            <Head title="Tableau de bord - Sellify Admin" />

            <div className="space-y-6 px-1">
                {/* 1. Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 tracking-tight">Tableau de bord</h2>
                        <p className="text-sm text-surface-500 mt-1">Bienvenue sur votre espace d'administration</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white border border-surface-200 p-1 rounded-2xl shadow-sm">
                        <div className="flex space-x-1">
                            {[
                                { id: 'week', label: 'Semaine' },
                                { id: 'month', label: 'Mois' },
                                { id: 'year', label: 'Année' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTimeframe(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                                        ${timeframe === tab.id
                                            ? 'text-amber-600 bg-amber-50'
                                            : 'text-surface-500 hover:text-surface-800'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="h-4 w-px bg-surface-200" />
                        <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-surface-600 hover:text-surface-900 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            <span>Exporter</span>
                        </button>
                    </div>
                </div>

                {/* 2. Welcome Banner */}
                <div className="bg-amber-500 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-center min-h-[100px] relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-full opacity-10 bg-gradient-to-l from-white pointer-events-none" />
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <span>Bonjour, Administrateur</span>
                        <span className="ml-1.5">👋</span>
                    </h3>
                    <p className="text-xs text-amber-50 mt-1">Voici ce qui se passe sur votre plateforme aujourd'hui</p>
                </div>

                {/* 3. Four Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Users */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Utilisateurs</span>
                            <span className="text-2xl font-bold text-surface-950 block">{stats.total_users || 1248}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">12.5% ce mois</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">+156 nouveaux ce mois</span>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Sellers */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Vendeurs</span>
                            <span className="text-2xl font-bold text-surface-950 block">{stats.total_sellers || 234}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">8.3% ce mois</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">En attente de validation: {stats.pending_sellers || 12}</span>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <Store className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Drivers */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Livreurs</span>
                            <span className="text-2xl font-bold text-surface-950 block">{stats.total_drivers || 89}</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                                <span className="text-xs font-semibold text-rose-500">2.1% ce mois</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">En service: {stats.verified_drivers || 67}</span>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Truck className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 4: Revenue */}
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-semibold block">Chiffre d'affaires</span>
                            <span className="text-2xl font-bold text-surface-950 block">45 280 CFA</span>
                            <div className="flex items-center space-x-1 pt-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-500">18.7% ce mois</span>
                            </div>
                            <span className="text-[10px] text-surface-400 block pt-1">Commissions: 4,528 CFA</span>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* 4. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Sales & Orders Combination Chart */}
                    <div className="lg:col-span-2 bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-sm font-bold text-surface-900">Aperçu des ventes</h4>
                                <span className="text-[11px] text-surface-400 mt-0.5 block">Évolution des ventes et commandes</span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs font-semibold">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
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
                                    stroke="#f59e0b"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />

                                {/* Dot markers on the line */}
                                <circle cx="90" cy="160" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="170" cy="130" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="250" cy="140" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="330" cy="115" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="410" cy="70" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="490" cy="90" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                                <circle cx="570" cy="120" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

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
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-surface-900">Ventes par catégorie</h4>
                            <span className="text-[11px] text-surface-400 mt-0.5 block">Répartition sur le mois en cours</span>
                        </div>

                        {/* SVG Donut Chart */}
                        <div className="flex justify-center items-center my-4">
                            <svg className="w-32 h-32" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                                {/* Blue (Electronics) - 35% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" 
                                    strokeDasharray="35 65" strokeDashoffset="25" />
                                {/* Amber (Fashion) - 25% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" 
                                    strokeDasharray="25 75" strokeDashoffset="90" />
                                {/* Purple (Home) - 20% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" 
                                    strokeDasharray="20 80" strokeDashoffset="115" />
                                {/* Emerald (Beauty) - 12% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" 
                                    strokeDasharray="12 88" strokeDashoffset="135" />
                                {/* Rose (Sports) - 8% */}
                                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="4" 
                                    strokeDasharray="8 92" strokeDashoffset="143" />
                            </svg>
                        </div>

                        {/* Breakdown List */}
                        <div className="space-y-2 text-xs font-semibold text-surface-600">
                            {[
                                { name: 'Électronique', percent: '35%', color: 'bg-blue-500' },
                                { name: 'Mode', percent: '25%', color: 'bg-amber-500' },
                                { name: 'Maison', percent: '20%', color: 'bg-purple-500' },
                                { name: 'Beauté', percent: '12%', color: 'bg-emerald-500' },
                                { name: 'Sports', percent: '8%', color: 'bg-rose-500' }
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

                {/* 5. Details Lists (KYC, Orders, Top Sellers) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Demandes KYC Récentes & Commandes Récentes */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* A. Demandes KYC Récentes */}
                        <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-900 flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>Demandes KYC Récentes</span>
                                </h4>
                                <Link href={route('admin.users.all')} className="text-xs font-semibold text-amber-600 hover:underline">
                                    Tout voir &rarr;
                                </Link>
                            </div>
                            {recentKyc.length === 0 ? (
                                <div className="py-6 text-center text-surface-400 text-xs font-semibold">
                                    Aucun dossier KYC en attente de traitement.
                                </div>
                            ) : (
                                <div className="divide-y divide-surface-50">
                                    {recentKyc.map((req) => (
                                        <div key={req.id} className="py-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-surface-50 border border-surface-150 flex items-center justify-center font-bold text-xs text-surface-600">
                                                    {req.user.first_name[0]}{req.user.last_name[0]}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-surface-900 block">{req.user.first_name} {req.user.last_name}</span>
                                                    <span className="text-[10px] text-surface-400 block capitalize mt-0.5">
                                                        {req.type === 'seller' ? 'Vendeur' : 'Livreur'} • Soumis le {new Date(req.submitted_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Badge variant={req.status === 'pending' ? 'warning' : 'neutral'}>
                                                    {req.status === 'pending' ? 'En attente' : req.status}
                                                </Badge>
                                                <Link href={route('admin.kyc.show', req.id)}>
                                                    <Button variant="outline" size="sm" className="p-1.5 border border-surface-200 text-surface-500 hover:bg-surface-50 rounded-xl">
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* B. Commandes Récentes */}
                        <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-900 flex items-center space-x-2">
                                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                                    <span>Commandes récentes</span>
                                </h4>
                                <span className="text-[10px] text-surface-400 font-mono font-bold">12 nouvelles aujourd'hui</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-surface-400 font-bold uppercase tracking-wider border-b border-surface-100 pb-2">
                                            <th className="pb-2.5 font-semibold">Commande ID</th>
                                            <th className="pb-2.5 font-semibold">Client</th>
                                            <th className="pb-2.5 font-semibold">Date</th>
                                            <th className="pb-2.5 font-semibold">Montant</th>
                                            <th className="pb-2.5 font-semibold">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-50 text-surface-700 font-semibold">
                                        {recentOrders.map((ord) => (
                                            <tr key={ord.id} className="hover:bg-surface-50/50">
                                                <td className="py-2.5 font-mono text-surface-900">{ord.id}</td>
                                                <td className="py-2.5">{ord.customer}</td>
                                                <td className="py-2.5 text-surface-400">{ord.date}</td>
                                                <td className="py-2.5 font-mono text-surface-900">{ord.amount}</td>
                                                <td className="py-2.5">
                                                    <Badge variant={
                                                        ord.status === 'delivered' ? 'success' :
                                                        ord.status === 'pending' ? 'warning' : 'danger'
                                                    }>
                                                        {ord.status === 'delivered' ? 'Livrée' : ord.status === 'pending' ? 'En cours' : 'Annulée'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Top Sellers List & Recent Operations */}
                    <div className="space-y-6">
                        {/* A. Top Vendeurs */}
                        <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-900 flex items-center space-x-2">
                                    <Award className="w-4 h-4 text-purple-500" />
                                    <span>Top Vendeurs</span>
                                </h4>
                                <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Ce mois</span>
                            </div>
                            <div className="space-y-3.5 text-xs font-semibold text-surface-600">
                                {topSellers.map((seller, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                                                {seller.name[0]}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-surface-900 block">{seller.name}</span>
                                                <span className="text-[10px] text-surface-400 block mt-0.5">{seller.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-surface-900 block font-mono">{seller.revenue}</span>
                                            <span className="text-[10px] text-surface-400 block font-mono mt-0.5">{seller.sales} commandes</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* B. Activités Récentes */}
                        <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-900 flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>Activités Récentes</span>
                                </h4>
                            </div>
                            {activities.length === 0 ? (
                                <div className="py-4 text-center text-surface-400 text-xs font-semibold">
                                    Aucune activité enregistrée.
                                </div>
                            ) : (
                                <div className="space-y-4 relative border-l border-surface-150 pl-3.5 ml-2 py-1">
                                    {activities.slice(0, 5).map((log) => (
                                        <div key={log.id} className="relative text-xs">
                                            <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-surface-900">
                                                    {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'Système'}
                                                </span>
                                                <span className="text-[10px] text-surface-400 font-mono">
                                                    {new Date(log.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-surface-500 leading-relaxed mt-0.5 font-medium">
                                                {log.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
