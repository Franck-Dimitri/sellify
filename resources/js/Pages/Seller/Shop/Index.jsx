import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Store, 
    Plus, 
    Trash2, 
    Settings, 
    ExternalLink, 
    ArrowRight, 
    Clock, 
    AlertTriangle,
    ShieldCheck,
    Boxes,
    Sparkles,
    Eye,
    Search,
    ShoppingBag,
    Tag,
    Palette
} from 'lucide-react';

export default function Index({ shops = [], logs = [], pack = 'starter' }) {
    const [searchTerm, setSearchTerm] = useState('');

    const isStarter = pack === 'starter';
    const isPro = pack === 'pro';
    const maxAllowed = isPro ? 2 : (pack === 'business' ? 999 : 1);
    const reachedLimit = shops.length >= maxAllowed;

    const filteredShops = shops.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (shop) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la boutique "${shop.name}" ? Cette action est irréversible et effacera tous les articles rattachés.`)) {
            router.delete(route('seller.shop.destroy', shop.slug));
        }
    };

    return (
        <SellerCentralLayout title="Gestion des Boutiques">
            <Head title="Mes Boutiques - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Store className="w-4 h-4 text-amber-600" />
                            <span>Vitrines & Points de Vente Vendeur</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Gestion Pro & Aperçu des Boutiques
                        </h1>
                        <p className="text-xs text-stone-600">
                            Configurez l'apparence, l'identité visuelle, visualisez un aperçu en direct et accédez aux consoles locales.
                        </p>
                    </div>

                    {!reachedLimit && (
                        <Link
                            href={route('seller.shop.create')}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Créer une Nouvelle Boutique</span>
                        </Link>
                    )}
                </div>

                {/* Pack Quota Alert Banner */}
                {isStarter ? (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-amber-900">Formule Pack Starter ({shops.length} / 1 Boutique)</h4>
                                <p className="text-amber-800 font-normal mt-0.5">Passez au Pack Pro pour créer jusqu'à 2 boutiques et bénéficier de plus de fonctionnalités.</p>
                            </div>
                        </div>
                        <Link 
                            href={route('seller.subscription.index')}
                            className="px-3.5 py-1.5 bg-amber-500 text-amber-950 rounded-lg font-medium text-xs hover:bg-amber-600 transition-colors whitespace-nowrap shadow-xs"
                        >
                            Passer au Pack Pro &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-xs">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-emerald-900">Formule Pack {pack.toUpperCase()} Actif ({shops.length} / {maxAllowed > 100 ? 'Illimité' : maxAllowed} Boutiques)</h4>
                            <p className="text-emerald-800 font-normal">Vous bénéficiez de toutes les fonctionnalités avancées multi-boutiques.</p>
                        </div>
                    </div>
                )}

                {/* Toolbar & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/70 shadow-sm">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Rechercher une boutique par nom..."
                            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                        />
                    </div>

                    <div className="text-xs text-stone-500 font-normal">
                        Total : <strong className="font-semibold text-stone-900">{filteredShops.length} boutique(s)</strong>
                    </div>
                </div>

                {/* Structured Shops Cards Grid with Live Preview */}
                {filteredShops.length === 0 ? (
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-10 text-center space-y-3">
                        <Store className="w-10 h-10 text-stone-300 mx-auto" />
                        <h3 className="font-semibold text-stone-900 text-sm">Aucune boutique trouvée</h3>
                        <p className="text-xs text-stone-500 font-normal max-w-sm mx-auto">
                            {shops.length === 0 
                                ? 'Vous n\'avez pas encore créé de boutique. Configurez votre premier point de vente.' 
                                : 'Aucune boutique ne correspond à votre recherche.'
                            }
                        </p>
                        {shops.length === 0 && (
                            <div className="pt-2">
                                <Link 
                                    href={route('seller.shop.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-amber-950 rounded-xl font-medium text-xs hover:bg-amber-600 transition-colors shadow-xs"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Créer ma Première Boutique</span>
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredShops.map(shop => {
                            const themeColor = shop.theme_color || '#CA8A04';
                            const productCount = shop.products?.length || 0;

                            return (
                                <div key={shop.id} className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-400 transition-colors">
                                    
                                    {/* Top Bar with Shop Color Theme Accent */}
                                    <div className="h-2 w-full" style={{ backgroundColor: themeColor }} />

                                    <div className="p-5 space-y-4">
                                        {/* Shop Header Identity */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-stone-200 overflow-hidden flex items-center justify-center font-semibold text-stone-900 text-base shadow-xs">
                                                    {shop.logo_path ? (
                                                        <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{shop.name[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-stone-900 text-sm">{shop.name}</h3>
                                                    <span className="text-[11px] text-stone-400 font-mono block">/{shop.slug}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {shop.holiday_mode ? (
                                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                        Mode Vacances
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        En Ligne
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Live Storefront Miniature Preview Frame */}
                                        <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-stone-50 space-y-2">
                                            {/* Fake browser bar */}
                                            <div className="bg-stone-200/60 px-3 py-1.5 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                                    <span className="ml-1 text-stone-600 truncate">sellify.me/boutique/{shop.slug}</span>
                                                </div>
                                                <a 
                                                    href={route('shop.public', shop.slug)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-amber-800 font-medium hover:underline flex items-center gap-0.5"
                                                >
                                                    <span>Voir Vitrine</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>

                                            {/* Storefront Hero Preview */}
                                            <div 
                                                className="p-4 text-white rounded-b-xl relative overflow-hidden"
                                                style={{ 
                                                    backgroundColor: themeColor,
                                                    backgroundImage: shop.banner_path ? `url(/storage/${shop.banner_path})` : 'none',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                <div className="bg-black/30 backdrop-blur-xs -m-4 p-4 space-y-1">
                                                    <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-200 block">
                                                        Vitrine Publique
                                                    </span>
                                                    <h4 className="font-semibold text-sm text-white">{shop.name}</h4>
                                                    <p className="text-[11px] text-stone-200 font-normal italic truncate">
                                                        {shop.slogan ? `"${shop.slogan}"` : 'Bienvenue sur notre boutique en ligne.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Performance Summary Metrics */}
                                        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                                                <span className="text-[10px] text-stone-400 block font-normal">Catalogue</span>
                                                <span className="font-semibold text-stone-900">{productCount} article(s)</span>
                                            </div>
                                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                                                <span className="text-[10px] text-stone-400 block font-normal">Commandes</span>
                                                <span className="font-semibold text-stone-900">18 reçues</span>
                                            </div>
                                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                                                <span className="text-[10px] text-stone-400 block font-normal">Thème Visuel</span>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: themeColor }} />
                                                    <span className="text-[10px] font-mono text-stone-600">{themeColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Bar */}
                                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <Link 
                                                href={route('seller.shop.edit', shop.slug)}
                                                className="p-2 border border-stone-200 text-stone-600 hover:bg-white rounded-xl transition-colors bg-white shadow-xs"
                                                title="Modifier les paramètres"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(shop)}
                                                className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors bg-white shadow-xs"
                                                title="Supprimer la boutique"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a 
                                                href={route('shop.public', shop.slug)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-2 border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 rounded-xl font-medium text-xs transition-colors shadow-xs flex items-center gap-1"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Aperçu</span>
                                            </a>

                                            <Link 
                                                href={route('seller.shop.dashboard', shop.slug)}
                                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-xl font-medium text-xs transition-all shadow-xs flex items-center gap-1.5"
                                            >
                                                <span>Console Gérer</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Activity Logs Section */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <h3 className="font-semibold text-stone-900 text-sm">Journal d'Opérations des Boutiques</h3>
                    </div>

                    <div className="p-5 divide-y divide-stone-100 text-xs font-normal">
                        {logs.length === 0 ? (
                            <p className="text-stone-400 text-center py-4">Aucun historique d'opération enregistré.</p>
                        ) : (
                            logs.slice(0, 5).map(log => (
                                <div key={log.id} className="py-2.5 flex items-center justify-between text-stone-600">
                                    <span>{log.description}</span>
                                    <span className="text-stone-400 text-[11px] font-mono">
                                        {new Date(log.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </SellerCentralLayout>
    );
}
