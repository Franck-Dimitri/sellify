import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { Card, CardContent } from '../../../Components/ui/Card';
import Badge from '../../../Components/ui/Badge';
import Button from '../../../Components/ui/Button';
import { 
    Store, 
    Plus, 
    Trash2, 
    Settings, 
    ExternalLink, 
    ArrowRight, 
    Clock, 
    AlertTriangle,
    ShieldCheck
} from 'lucide-react';

export default function Index({ shops = [], logs = [], pack = 'starter' }) {
    const primaryColor = '#CA8A04';
    const isStarter = pack === 'starter';
    const reachedLimit = isStarter && shops.length >= 1;

    const handleDelete = (shop) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la boutique "${shop.name}" ? Cette action est irréversible et supprimera toutes les données associées.`)) {
            router.delete(route('seller.shop.destroy', shop.slug));
        }
    };

    return (
        <SellerCentralLayout title="Mes Boutiques">
            <Head title="Mes Boutiques - Sellify Central" />

            <div className="space-y-6 px-1">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-700 tracking-tight">Mes Boutiques</h2>
                        <p className="text-sm text-surface-500 mt-1">Consultez, modifiez ou gérez vos différentes vitrines de vente</p>
                    </div>

                    <Link href={route('seller.shop.create')}>
                        <Button 
                            className="text-white font-medium flex items-center space-x-1.5 shadow-sm"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Créer une boutique</span>
                        </Button>
                    </Link>
                </div>

                {/* Pack Limit Banner */}
                {isStarter && (
                    <div className="bg-yellow-50/50 border border-yellow-250 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start space-x-3.5">
                            <div className="p-2 bg-yellow-100/50 text-yellow-700 rounded-xl border border-yellow-200 mt-0.5">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-yellow-800">Compte Limité • Pack Starter ({shops.length}/1 Boutique)</h4>
                                <p className="text-xs text-yellow-700 mt-0.5 leading-relaxed font-normal">
                                    Vous êtes actuellement sous l'abonnement gratuit Starter. Passez au pack Pro pour créer des boutiques illimitées et bénéficier de plus de fonctionnalités.
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="bg-yellow-600 hover:bg-yellow-750 text-white font-medium w-full md:w-auto"
                        >
                            Devenir Pro &rarr;
                        </Button>
                    </div>
                )}

                {/* Shops Grid */}
                {shops.length === 0 ? (
                    <div className="bg-white border border-surface-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                            <Store className="w-10 h-10" />
                        </div>
                        <div className="space-y-1.5 max-w-sm">
                            <p className="text-sm font-semibold text-surface-700">Aucune boutique enregistrée</p>
                            <p className="text-xs text-surface-450 leading-relaxed font-normal">
                                Vous n'avez pas encore configuré de boutique. Créez votre première boutique professionnelle pour commencer à publier vos produits.
                            </p>
                        </div>
                        <Link href={route('seller.shop.create')}>
                            <Button className="text-white font-medium shadow-sm" style={{ backgroundColor: primaryColor }}>
                                Configurer ma première boutique
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {shops.map((shop) => (
                            <Card key={shop.id} className="border-surface-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-12 h-12 bg-white rounded-2xl p-1 border border-surface-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                                                {shop.logo_path ? (
                                                    <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <Store className="w-6 h-6 text-surface-350" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base text-surface-750 leading-snug">{shop.name}</h4>
                                                <a 
                                                    href={route('shop.public', shop.slug)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-[10px] text-surface-400 font-semibold hover:underline flex items-center space-x-0.5 mt-0.5"
                                                >
                                                    <span>Lien public</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-150 font-medium">Active</Badge>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-surface-500 italic font-normal">
                                        {shop.slogan ? `"${shop.slogan}"` : 'Pas de slogan configuré'}
                                    </p>

                                    <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-surface-100 text-[10px] text-surface-400 font-semibold uppercase tracking-wider">
                                        <div>
                                            <span className="block text-surface-400">Catalogue</span>
                                            <span className="text-sm font-bold text-surface-750 block mt-0.5">0 / 30</span>
                                        </div>
                                        <div>
                                            <span className="block text-surface-400">Commandes</span>
                                            <span className="text-sm font-bold text-surface-750 block mt-0.5">18</span>
                                        </div>
                                        <div>
                                            <span className="block text-surface-400">Thème Couleur</span>
                                            <span className="flex items-center space-x-1.5 mt-1">
                                                <span className="w-4 h-4 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: shop.theme_color || primaryColor }} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-surface-50 px-5 py-4 border-t border-surface-150 flex justify-between items-center gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Link href={route('seller.shop.edit', shop.slug)}>
                                            <button 
                                                title="Modifier la boutique"
                                                className="p-2 border border-surface-200 hover:bg-white text-surface-500 hover:text-surface-700 rounded-xl transition-colors bg-white shadow-xs"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(shop)}
                                            title="Supprimer la boutique"
                                            className="p-2 border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-colors bg-white shadow-xs"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <Link href={route('seller.shop.dashboard', shop.slug)} className="flex-1 max-w-[160px]">
                                        <Button 
                                            className="w-full font-semibold flex items-center justify-center space-x-1.5 text-white shadow-xs text-xs py-1.5 rounded-xl" 
                                            style={{ backgroundColor: shop.theme_color || primaryColor }}
                                        >
                                            <span>Console Gérer</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Activity Logs Table */}
                <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex justify-between items-center border-b border-surface-100 pb-3 mb-4">
                        <h4 className="text-sm font-bold text-surface-700 flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span>Journal d'activité des boutiques</span>
                        </h4>
                        <span className="text-[10px] text-surface-400 font-semibold font-mono">Dernières opérations</span>
                    </div>

                    {logs.length === 0 ? (
                        <div className="py-6 text-center text-surface-400 text-xs font-semibold">
                            Aucun historique enregistré pour vos boutiques.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-surface-400 font-bold uppercase tracking-wider border-b border-surface-100 pb-2">
                                        <th className="pb-2.5 font-semibold">Date</th>
                                        <th className="pb-2.5 font-semibold">Opération</th>
                                        <th className="pb-2.5 font-semibold">Détails de l'action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-50 text-surface-600 font-semibold">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-surface-50/50">
                                            <td className="py-2.5 text-surface-400 font-mono">
                                                {new Date(log.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="py-2.5">
                                                <Badge variant={
                                                    log.action === 'shop_created' ? 'success' :
                                                    log.action === 'shop_deleted' ? 'danger' : 'neutral'
                                                }>
                                                    {log.action === 'shop_created' ? 'Création' : 
                                                     log.action === 'shop_deleted' ? 'Suppression' : 'Mise à jour'}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5 text-surface-700 font-medium">{log.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </SellerCentralLayout>
    );
}
