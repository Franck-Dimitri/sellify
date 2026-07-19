import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SellerCentralLayout from '../../Layouts/SellerCentralLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';
import Badge from '../../Components/ui/Badge';
import Button from '../../Components/ui/Button';
import { 
    DollarSign, 
    ShoppingBag, 
    Package, 
    Users, 
    Plus, 
    Store, 
    ExternalLink, 
    ArrowRight,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    
    const user = auth.user;
    const seller = user?.seller;
    const shops = seller?.shops || [];

    // Aggregated stats calculations
    const stats = {
        revenue: shops.length > 0 ? '148 500 CFA' : '0 CFA',
        orders: shops.length > 0 ? 18 : 0,
        products: shops.length > 0 ? '4 / 30' : '0 / 30',
        shopsCount: shops.length
    };

    const hasReachedLimit = seller?.pack === 'starter' && shops.length >= 1;

    return (
        <SellerCentralLayout title="Sellify Central">
            <Head title="Tableau de bord Central - Sellify" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-surface-900 tracking-tight">Tableau de bord Central</h1>
                        <p className="text-sm text-surface-500 font-medium">
                            Pilotez l'ensemble de votre activité de vendeur et vos boutiques
                        </p>
                    </div>
                </div>

                {/* Welcome & Account Status banner */}
                <div className="bg-gradient-to-br from-surface-900 to-surface-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-radial-gradient pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #EAB308 0%, transparent 80%)` }} />
                    <div className="max-w-2xl space-y-4 relative z-10">
                        <div className="flex items-center space-x-2 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20 w-fit">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Compte Vendeur Vérifié & Actif</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                            Bienvenue sur Sellify Central, {user.first_name} !
                        </h2>
                        <p className="text-sm text-surface-300 leading-relaxed font-medium">
                            Depuis cet espace central, vous pilotez toutes vos boutiques. Sélectionnez une boutique ci-dessous pour modifier son design, gérer ses commandes ou ajouter des produits.
                        </p>
                    </div>
                </div>

                {/* Aggregated Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Boutiques créées</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.shopsCount}</span>
                            <span className="text-[10px] text-surface-400 font-bold block pt-1">
                                {seller?.pack === 'starter' ? 'Pack Starter : Max 1' : 'Pack Pro : Illimité'}
                            </span>
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                            <Store className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">CA Cumulé</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.revenue}</span>
                            <div className="flex items-center space-x-1 pt-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-500">+12%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Commandes Totales</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.orders}</span>
                            <span className="text-[10px] text-surface-400 block pt-1.5 font-bold">Toutes boutiques confondues</span>
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs text-surface-400 font-bold uppercase tracking-wider block">Catalogue global</span>
                            <span className="text-2xl font-black text-surface-950 block">{stats.products}</span>
                            <span className="text-[10px] text-surface-400 block pt-1.5 font-bold">Produits en ligne</span>
                        </div>
                        <div className="p-3 bg-surface-50 text-surface-655 rounded-2xl border border-surface-150">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex justify-between items-center pt-2">
                    <h3 className="text-lg font-extrabold text-surface-900 tracking-tight">Mes Boutiques</h3>
                    {!hasReachedLimit && (
                        <Link href={route('seller.shop.create')}>
                            <Button size="sm" className="space-x-1.5 bg-yellow-500 hover:bg-yellow-600 text-surface-950 font-bold">
                                <Plus className="w-4 h-4" />
                                <span>Créer une boutique</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Shops List */}
                {shops.length === 0 ? (
                    <div className="bg-white border border-surface-200 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                            <Store className="w-10 h-10" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                            <p className="text-sm font-bold text-surface-850">Vous n'avez créé aucune boutique</p>
                            <p className="text-xs text-surface-400">
                                Pour commencer à vendre, vous devez configurer votre première vitrine de boutique professionnelle.
                            </p>
                        </div>
                        <Link href={route('seller.shop.create')}>
                            <Button className="bg-yellow-500 text-surface-950 font-bold hover:scale-[1.01] transition-all">
                                Configurer ma première boutique
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {shops.map((shop) => (
                            <Card key={shop.id} className="border-surface-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-12 h-12 bg-white rounded-2xl p-1 border border-surface-200 overflow-hidden flex items-center justify-center shrink-0">
                                                {shop.logo_path ? (
                                                    <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <Store className="w-6 h-6 text-surface-300" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-base text-surface-900 leading-snug">{shop.name}</h4>
                                                <a href={route('shop.public', shop.slug)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-surface-400 font-bold hover:underline flex items-center space-x-0.5">
                                                    <span>Lien public</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                        </div>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    
                                    <p className="text-xs text-surface-500 italic">
                                        {shop.slogan ? `"${shop.slogan}"` : 'Pas de slogan configuré'}
                                    </p>

                                    <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-surface-50 text-[10px] text-surface-500 font-bold uppercase tracking-wider">
                                        <div>
                                            <span className="block text-surface-400">Catalogue</span>
                                            <span className="text-sm font-black text-surface-850">0 / 30</span>
                                        </div>
                                        <div>
                                            <span className="block text-surface-400">Commandes</span>
                                            <span className="text-sm font-black text-surface-850">18</span>
                                        </div>
                                        <div>
                                            <span className="block text-surface-400">Thème</span>
                                            <span className="flex items-center space-x-1.5 mt-0.5">
                                                <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: shop.theme_color }} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-surface-100 flex space-x-2">
                                    <Link href={route('seller.shop.dashboard', shop.slug)} className="flex-1">
                                        <Button className="w-full font-bold flex items-center justify-center space-x-1.5 text-white shadow-sm" style={{ backgroundColor: shop.theme_color }}>
                                            <span>Gérer la boutique</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </SellerCentralLayout>
    );
}
