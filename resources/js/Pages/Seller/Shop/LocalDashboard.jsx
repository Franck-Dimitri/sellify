import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import { 
    DollarSign, 
    ShoppingBag, 
    Package, 
    Users, 
    Plus, 
    ExternalLink, 
    TrendingUp, 
    Clock, 
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

export default function LocalDashboard({ shop }) {
    const { auth } = usePage().props;
    const activeThemeColor = shop?.theme_color || '#CA8A04';

    // Mock stats specific to this shop
    const stats = {
        revenue: '148 500 CFA',
        ordersCount: 18,
        productsCount: '4 / 30',
        customersCount: 12
    };

    const recentOrders = [
        { id: '#CMD-9821', customer: 'Hervé Ngueme', amount: '24 500 CFA', date: 'Il y a 10 min', status: 'pending', statusText: 'En attente' },
        { id: '#CMD-9819', customer: 'Clarisse Ngo', amount: '67 000 CFA', date: 'Il y a 1 h', status: 'processing', statusText: 'Préparation' },
        { id: '#CMD-9818', customer: 'Marc Kamga', amount: '12 000 CFA', date: 'Il y a 3 h', status: 'shipped', statusText: 'En cours de livraison' },
        { id: '#CMD-9812', customer: 'Amina Bello', amount: '45 000 CFA', date: 'Hier', status: 'delivered', statusText: 'Livré' }
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'info';
            case 'delivered': return 'success';
            default: return 'neutral';
        }
    };

    return (
        <ShopConsoleLayout shop={shop} title={`Dashboard - ${shop.name}`}>
            <Head title={`Tableau de bord - ${shop.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-surface-700 tracking-tight">Tableau de bord local</h1>
                        <p className="text-sm text-surface-500 font-normal">
                            Gérez les ventes, produits et commandes de <span className="font-semibold" style={{ color: activeThemeColor }}>{shop.name}</span>
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <a href={route('shop.public', shop.slug)} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="space-x-1.5 font-medium">
                                <span>Voir ma boutique</span>
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </a>
                        <Button size="sm" className="space-x-1.5 text-white font-medium" style={{ backgroundColor: activeThemeColor }}>
                            <Plus className="w-4 h-4" />
                            <span>Ajouter un produit</span>
                        </Button>
                    </div>
                </div>

                {/* Local Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-surface-200">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-xs text-surface-400 font-medium uppercase tracking-wider block">Chiffre d'affaires</span>
                                <span className="text-2xl font-bold text-surface-750 block">{stats.revenue}</span>
                                <div className="flex items-center space-x-1 pt-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-medium text-emerald-500">+18.4% ce mois</span>
                                </div>
                            </div>
                            <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                                <DollarSign className="w-5 h-5" style={{ color: activeThemeColor }} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-surface-200">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-xs text-surface-400 font-medium uppercase tracking-wider block">Commandes reçues</span>
                                <span className="text-2xl font-bold text-surface-750 block">{stats.ordersCount}</span>
                                <span className="text-[10px] text-surface-400 font-normal block pt-1.5">
                                    4 en attente de traitement
                                </span>
                            </div>
                            <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                                <ShoppingBag className="w-5 h-5" style={{ color: activeThemeColor }} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-surface-200">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-xs text-surface-400 font-medium uppercase tracking-wider block">Produits en ligne</span>
                                <span className="text-2xl font-bold text-surface-750 block">{stats.productsCount}</span>
                                <span className="text-[10px] text-surface-400 font-normal block pt-1.5">
                                    Limite {auth.user.seller?.pack === 'pro' ? 'Pro' : 'Starter'} Pack : 30 max
                                </span>
                            </div>
                            <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                                <Package className="w-5 h-5" style={{ color: activeThemeColor }} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-surface-200">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-xs text-surface-400 font-medium uppercase tracking-wider block">Clients uniques</span>
                                <span className="text-2xl font-bold text-surface-750 block">{stats.customersCount}</span>
                                <span className="text-[10px] text-surface-400 font-normal block pt-1.5">
                                    Fidélité & Historique local
                                </span>
                            </div>
                            <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                                <Users className="w-5 h-5" style={{ color: activeThemeColor }} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Dashboard grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main chart or sales info */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-surface-200">
                            <CardHeader className="flex justify-between items-center pb-2">
                                <div>
                                    <CardTitle>Performance de la Boutique</CardTitle>
                                    <p className="text-xs text-surface-400">Courbe d'activité et ventes de la boutique courante</p>
                                </div>
                                <div className="text-xs font-medium text-surface-500 bg-surface-100 px-2.5 py-1 rounded-lg">
                                    7 derniers jours
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex flex-col justify-end pt-4">
                                    {/* Beautiful simulated chart using SVG Area */}
                                    <div className="relative w-full h-full flex-1">
                                        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="gradient-color" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={activeThemeColor} stopOpacity="0.3"/>
                                                    <stop offset="100%" stopColor={activeThemeColor} stopOpacity="0.0"/>
                                                </linearGradient>
                                            </defs>
                                            
                                            {/* Grid Lines */}
                                            <line x1="0" y1="50" x2="600" y2="50" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
                                            <line x1="0" y1="100" x2="600" y2="100" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
                                            <line x1="0" y1="150" x2="600" y2="150" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />

                                            {/* Filled Area */}
                                            <path 
                                                d="M 0 180 L 100 160 L 200 90 L 300 120 L 400 40 L 500 70 L 600 20 L 600 200 L 0 200 Z" 
                                                fill="url(#gradient-color)" 
                                            />
                                            {/* Line Path */}
                                            <path 
                                                d="M 0 180 L 100 160 L 200 90 L 300 120 L 400 40 L 500 70 L 600 20" 
                                                fill="none" 
                                                stroke={activeThemeColor} 
                                                strokeWidth="3.5" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                            />
                                            
                                            {/* Data points */}
                                            <circle cx="200" cy="90" r="5" fill="white" stroke={activeThemeColor} strokeWidth="3" />
                                            <circle cx="400" cy="40" r="5" fill="white" stroke={activeThemeColor} strokeWidth="3" />
                                            <circle cx="600" cy="20" r="5" fill="white" stroke={activeThemeColor} strokeWidth="3" />
                                        </svg>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-surface-400 font-medium uppercase tracking-wider pt-3 px-1">
                                        <span>Lun</span>
                                        <span>Mar</span>
                                        <span>Mer</span>
                                        <span>Jeu</span>
                                        <span>Ven</span>
                                        <span>Sam</span>
                                        <span>Dim</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Quick Settings Action Card */}
                        <Card className="border-surface-200 bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-surface-700">Visibilité & Design</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-surface-500 leading-relaxed">
                                    Votre boutique est actuellement visible en ligne sous l'adresse publique de Sellify.
                                </p>
                                
                                <div className="flex flex-col space-y-2">
                                    <Link href={route('seller.shop.edit', shop.slug)}>
                                        <Button variant="outline" className="w-full text-xs font-medium py-2 flex items-center justify-center space-x-1.5">
                                            <span>Modifier la vitrine</span>
                                            <ChevronRight className="w-4.5 h-4.5" />
                                        </Button>
                                    </Link>
                                    
                                    <a href={route('shop.public', shop.slug)} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button className="w-full text-xs font-medium py-2 text-white flex items-center justify-center space-x-1.5" style={{ backgroundColor: activeThemeColor }}>
                                            <span>Ouvrir le lien public</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Orders table */}
                <Card className="border-surface-200">
                    <CardHeader className="pb-2 flex justify-between items-center">
                        <div>
                            <CardTitle>Dernières Commandes Locales</CardTitle>
                            <p className="text-xs text-surface-400">Commandes passées spécifiquement sur cette boutique</p>
                        </div>
                        <Button variant="outline" size="sm" className="font-medium text-xs">
                            Voir tout
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-surface-100 bg-surface-50/50 text-[10px] text-surface-400 font-medium uppercase tracking-wider">
                                    <th className="px-6 py-3">Réf/Client</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Montant</th>
                                    <th className="px-6 py-3">Statut</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100 font-medium text-surface-600">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-surface-50/40 transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div className="font-semibold text-surface-750">{order.id}</div>
                                            <div className="text-xs text-surface-400">{order.customer}</div>
                                        </td>
                                        <td className="px-6 py-3.5 text-xs text-surface-500">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3.5 h-3.5 text-surface-300" />
                                                <span>{order.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 font-bold text-surface-750">{order.amount}</td>
                                        <td className="px-6 py-3.5">
                                            <Badge variant={getStatusVariant(order.status)}>
                                                {order.statusText}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <Button variant="outline" size="sm" className="font-medium text-xs py-1.5 px-3">
                                                Gérer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </ShopConsoleLayout>
    );
}
