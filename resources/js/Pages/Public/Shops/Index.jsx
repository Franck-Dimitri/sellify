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
    Sparkles,
    CheckCircle2,
    Building2,
    BadgeCheck,
    Clock,
    Award
} from 'lucide-react';

export default function Index({ shops, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('public.shops.index'), { search }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Annuaire des Fabricants Verified & Boutiques Certifiées - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 antialiased font-sans text-stone-800">
                
                {/* HERO BANNER */}
                <div className="bg-white border-b border-stone-200 py-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold text-yellow-900">
                            <BadgeCheck className="w-4 h-4 text-yellow-600" />
                            <span>Boutiques & Fabricants Agréés (Verified Suppliers)</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                            Annuaire des Fabricants & Boutiques Vérifiés sur Sellify.me
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-3xl">
                            Parcourez les vitrines officielles de nos commerçants immatriculés au Registre du Commerce (RCCM). Approvisionnez-vous en toute sérénité avec la garantie séquestre Escrow.
                        </p>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                    
                    {/* SEARCH & FILTERS BAR */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une boutique par nom, slogan, ville (ex: Douala, Yaoundé) ou numéro RCCM..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none font-normal"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-xl shadow-xs transition-colors w-full sm:w-auto border border-yellow-500"
                            >
                                Rechercher Vendeur
                            </button>
                        </form>
                    </div>

                    {/* SHOPS LISTING GRID */}
                    {shops.data.length === 0 ? (
                        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-3">
                            <Store className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5]" />
                            <h4 className="font-bold text-stone-800 text-sm">Aucune boutique trouvée</h4>
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
                                                    <div className="w-full h-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/40 flex items-center justify-center">
                                                        <Building2 className="w-10 h-10 text-yellow-600/40 stroke-[1.5]" />
                                                    </div>
                                                )}

                                                <span className="absolute top-2.5 right-2.5 bg-stone-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                                                    <span>Verified Gold</span>
                                                </span>
                                            </div>

                                            {/* Shop Identity & Logo */}
                                            <div className="p-5 space-y-3 relative pt-0">
                                                <div className="-mt-10 w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                                                    {shop.logo_path ? (
                                                        <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Store className="w-7 h-7 text-stone-400 stroke-[1.5]" />
                                                    )}
                                                </div>

                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <h3 className="font-bold text-stone-900 text-sm truncate">{shop.name}</h3>
                                                        <BadgeCheck className="w-4 h-4 text-yellow-600 shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-stone-500 font-normal line-clamp-1">
                                                        {shop.slogan || 'Boutique Officielle Certifiée'}
                                                    </p>
                                                </div>

                                                {/* Verification & RCCM Details Table */}
                                                <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 space-y-1.5 text-xs font-normal">
                                                    {sellerUser && (
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-stone-400">Gérant responsable :</span>
                                                            <strong className="text-stone-800 font-semibold">{sellerUser.first_name} {sellerUser.last_name}</strong>
                                                        </div>
                                                    )}
                                                    {shop.rccm_number && (
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-stone-400">RCCM / Patente :</span>
                                                            <strong className="text-stone-700 font-mono">{shop.rccm_number}</strong>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-[11px]">
                                                        <span className="text-stone-400">Siège social :</span>
                                                        <span className="font-medium text-stone-700">{shop.city || 'Douala'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px] pt-1 border-t border-stone-200/50">
                                                        <span className="text-stone-400">Taux de réponse :</span>
                                                        <span className="font-bold text-emerald-700">98.8% (&lt; 1h)</span>
                                                    </div>
                                                </div>

                                                {/* Catalog Products Thumbnail Preview */}
                                                {shopProductsPreview.length > 0 && (
                                                    <div className="pt-2 space-y-1.5">
                                                        <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Aperçu du catalogue :</span>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {shopProductsPreview.map((prod) => {
                                                                const pImg = prod.image_paths && prod.image_paths[0] ? `/storage/${prod.image_paths[0]}` : null;
                                                                return (
                                                                    <div key={prod.id} className="aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center p-1 text-center">
                                                                        {pImg ? (
                                                                            <img src={pImg} alt={prod.name} className="w-full h-full object-cover rounded" />
                                                                        ) : (
                                                                            <Package className="w-4 h-4 text-stone-300" />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="p-5 pt-0">
                                            <Link href={route('shop.public', shop.slug)}>
                                                <button className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 border border-yellow-500">
                                                    <span>Visiter le Store Officiel</span>
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
                        <div className="flex justify-center items-center gap-1 pt-6">
                            {shops.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                        link.active
                                            ? 'bg-yellow-400 text-yellow-950 border-yellow-500 font-bold'
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
