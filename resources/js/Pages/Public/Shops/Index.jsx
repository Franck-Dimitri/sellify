import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Search, 
    Store, 
    ShieldCheck, 
    Star, 
    Package, 
    ArrowRight, 
    MapPin, 
    User,
    Sparkles
} from 'lucide-react';

export default function Index({ shops, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('public.shops.index'), { search }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Annuaire des Boutiques Vérifiées - Sellify.me" />

            <div className="w-full bg-stone-50 min-h-screen pb-20 antialiased font-sans text-stone-800">
                
                {/* HERO BANNER */}
                <div className="bg-white border-b border-stone-200/70 py-10 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto space-y-3 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold text-amber-900">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Boutiques Certifiées Gold Supplier</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
                            Annuaire des Boutiques & Commerçants Vérifiés
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-2xl">
                            Explorez les vitrines officielles de nos vendeurs enregistrés avec leur numéro RCCM et leur localisation.
                        </p>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                    
                    {/* SEARCH BAR */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une boutique par nom, slogan ou ville (ex: Douala)..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-lg shadow-xs transition-colors w-full sm:w-auto"
                            >
                                Rechercher
                            </button>
                        </form>
                    </div>

                    {/* SHOPS GRID */}
                    {shops.data.length === 0 ? (
                        <div className="bg-white border border-stone-200/70 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                            <Store className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-stone-800">Aucune boutique trouvée</p>
                                <p className="text-xs text-stone-500 font-normal">
                                    Modifiez vos critères de recherche.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {shops.data.map((shop) => {
                                const sellerUser = shop.seller?.user;
                                const activeProductsCount = shop.products ? shop.products.length : 0;

                                return (
                                    <div 
                                        key={shop.id} 
                                        className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Cover / Header Box */}
                                            <div className="h-24 bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-stone-100">
                                                {shop.banner_path ? (
                                                    <img src={`/storage/${shop.banner_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-r from-amber-500/10 to-amber-500/30 flex items-center justify-center">
                                                        <Store className="w-8 h-8 text-amber-600/30 stroke-[1.5]" />
                                                    </div>
                                                )}

                                                <span className="absolute top-2 right-2 bg-amber-50 text-amber-950 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                                                    <span>Gold Supplier</span>
                                                </span>
                                            </div>

                                            {/* Logo & Shop Info */}
                                            <div className="p-5 space-y-3 relative pt-0">
                                                {/* Floating Logo */}
                                                <div className="-mt-8 w-14 h-14 rounded-xl bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                                    {shop.logo_path ? (
                                                        <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Store className="w-6 h-6 text-stone-400 stroke-[1.5]" />
                                                    )}
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-stone-900 text-sm">{shop.name}</h3>
                                                    <p className="text-xs text-stone-400 font-normal line-clamp-1 mt-0.5">
                                                        {shop.slogan || 'Boutique Officielle Certifiée'}
                                                    </p>
                                                </div>

                                                <div className="space-y-1.5 text-xs text-stone-500 font-normal pt-2 border-t border-stone-100">
                                                    {sellerUser && (
                                                        <div className="flex items-center gap-1.5 text-[11px]">
                                                            <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                                            <span>Gérant : <strong className="text-stone-700 font-semibold">{sellerUser.first_name} {sellerUser.last_name}</strong></span>
                                                        </div>
                                                    )}
                                                    {shop.city && (
                                                        <div className="flex items-center gap-1.5 text-[11px]">
                                                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                                            <span>{shop.city}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between text-[11px] pt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Package className="w-3.5 h-3.5 text-amber-600" />
                                                            <strong>{activeProductsCount}</strong> articles
                                                        </span>
                                                        <span className="flex items-center gap-1 font-semibold text-stone-900">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            <span>4.8 / 5</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 pt-0">
                                            <Link href={route('shop.public', shop.slug)}>
                                                <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5">
                                                    <span>Visiter la boutique</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* PAGINATION LINKS */}
                    {shops.links && shops.links.length > 3 && (
                        <div className="flex justify-center items-center gap-1 pt-6">
                            {shops.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                        link.active
                                            ? 'bg-amber-500 text-amber-950 border-amber-500 font-semibold'
                                            : link.url
                                                ? 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                                : 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </PublicLayout>
    );
}
