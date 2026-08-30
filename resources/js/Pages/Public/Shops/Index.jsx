import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Search, 
    Store, 
    ShieldCheck, 
    Package, 
    ArrowRight, 
    MapPin, 
    BadgeCheck,
    X,
    Building2
} from 'lucide-react';

export default function Index({ shops, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('public.shops.index'), { search: search || undefined }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Boutiques & Fabricants Vérifiés - Sellify.me" />

            <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 antialiased font-sans text-stone-700">
                
                {/* HERO BANNER */}
                <div className="bg-white border-b border-stone-200/80 py-10 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto space-y-3 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-medium text-amber-900">
                            <BadgeCheck className="w-4 h-4 text-yellow-600" />
                            <span>Commerçants Agréés & Immatriculés RCCM</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                            Annuaire des Boutiques & Fabricants Vérifiés
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-3xl leading-relaxed">
                            Parcourez les vitrines officielles de nos commerçants partenaires. Achetez au détail ou approvisionnez votre commerce en gros avec la garantie séquestre Escrow.
                        </p>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                    
                    {/* SEARCH BAR */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une boutique par nom, ville (ex: Douala, Yaoundé, Abidjan) ou spécialité..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:border-yellow-400 focus:bg-white outline-none font-normal shadow-2xs transition-all"
                                />
                                {search && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearch(''); router.get(route('public.shops.index')); }} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 text-xs font-semibold rounded-xl shadow-xs transition-all w-full sm:w-auto cursor-pointer"
                            >
                                Rechercher
                            </button>
                        </form>
                    </div>

                    {/* SHOPS LISTING GRID */}
                    {shops.data.length === 0 ? (
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center space-y-3">
                            <Store className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5]" />
                            <h3 className="font-semibold text-stone-800 text-sm">Aucune boutique trouvée</h3>
                            <p className="text-xs text-stone-500 font-normal">Modifiez vos mots-clés de recherche.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shops.data.map((shop) => {
                                const sellerUser = shop.seller?.user;
                                const shopProductsPreview = shop.products ? shop.products.slice(0, 3) : [];

                                return (
                                    <div 
                                        key={shop.id} 
                                        className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs hover:border-yellow-400 hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Cover Header */}
                                            <div className="h-28 bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-stone-100">
                                                {shop.banner_path ? (
                                                    <img src={`/storage/${shop.banner_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-r from-amber-100/50 to-yellow-100/50 flex items-center justify-center">
                                                        <Building2 className="w-10 h-10 text-yellow-600/30 stroke-[1.5]" />
                                                    </div>
                                                )}

                                                <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-stone-800 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs border border-stone-200">
                                                    <BadgeCheck className="w-3.5 h-3.5 text-yellow-600" />
                                                    <span>Verified</span>
                                                </span>
                                            </div>

                                            {/* Shop Identity & Logo */}
                                            <div className="p-5 space-y-3 relative pt-0">
                                                <div className="-mt-10 w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                                                    {shop.logo_path ? (
                                                        <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Store className="w-7 h-7 text-yellow-700" />
                                                    )}
                                                </div>

                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <h3 className="font-semibold text-stone-900 text-sm truncate">{shop.name}</h3>
                                                        <BadgeCheck className="w-4 h-4 text-yellow-600 shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-stone-500 font-normal line-clamp-1">
                                                        {shop.slogan || shop.description || 'Boutique Officielle Certifiée'}
                                                    </p>
                                                </div>

                                                {/* Details */}
                                                <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 space-y-1.5 text-xs font-normal">
                                                    <div className="flex justify-between text-[11px]">
                                                        <span className="text-stone-400">Localisation :</span>
                                                        <span className="font-medium text-stone-700 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-stone-400" />
                                                            <span>{shop.city || 'Douala, Cameroun'}</span>
                                                        </span>
                                                    </div>
                                                    {shop.rccm_number && (
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-stone-400">RCCM / Patente :</span>
                                                            <strong className="text-stone-700 font-mono font-normal">{shop.rccm_number}</strong>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-[11px]">
                                                        <span className="text-stone-400">Protection :</span>
                                                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                                                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                            <span>Séquestre Escrow Actif</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Mini Products Preview */}
                                                {shopProductsPreview.length > 0 && (
                                                    <div className="space-y-1.5 pt-1">
                                                        <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Articles populaires</span>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {shopProductsPreview.map((p) => {
                                                                const pImg = p.image_paths && p.image_paths[0] ? `/storage/${p.image_paths[0]}` : null;
                                                                return (
                                                                    <div key={p.id} className="bg-stone-50 border border-stone-100 rounded-xl p-1.5 text-center space-y-1">
                                                                        <div className="w-full aspect-square bg-stone-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                                            {pImg ? (
                                                                                <img src={pImg} alt={p.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <Package className="w-4 h-4 text-stone-400" />
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[10px] font-semibold text-stone-800 block truncate">
                                                                            {Number(p.price).toLocaleString()} F
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="p-4 pt-0">
                                            <Link href={route('shop.public', shop.slug)}>
                                                <button className="w-full py-2.5 bg-stone-50 hover:bg-yellow-400 text-stone-800 hover:text-stone-950 font-semibold text-xs rounded-xl border border-stone-200 hover:border-yellow-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
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

                    {/* PAGINATION */}
                    {shops.links && shops.links.length > 3 && (
                        <div className="flex justify-center items-center gap-1.5 pt-8">
                            {shops.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                                        link.active
                                            ? 'bg-yellow-400 text-stone-950 border-yellow-400 font-semibold shadow-2xs'
                                            : link.url
                                                ? 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
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
