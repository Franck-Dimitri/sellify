import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { 
    Package, 
    Plus, 
    Trash2, 
    Edit, 
    AlertTriangle,
    Eye,
    Percent,
    SlidersHorizontal,
    Search,
    Download,
    CheckCircle2,
    ShoppingBag,
    ArrowUpRight,
    Flame,
    Star,
    Sparkles,
    CheckCircle
} from 'lucide-react';

export default function Index({ shop, products = [], totalStock = 0, maxStockLimit = 30, remainingStock = 30 }) {
    const activeColor = shop.theme_color || '#F59E0B';
    
    // States for search and quick filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, in_stock, low_stock, on_sale

    const stockPercent = Math.min(100, (totalStock / maxStockLimit) * 100);

    const handleDelete = (product) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ? Cette action est irréversible.`)) {
            router.delete(route('seller.shop.products.destroy', { shop: shop.slug, product: product.slug }));
        }
    };

    // Computations
    const totalShopProducts = products.length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 3).length;
    const inStockCount = products.filter(p => p.stock > 3).length;
    const onSaleCount = products.filter(p => p.active_promotion !== null).length;

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (statusFilter === 'in_stock') {
            return matchesSearch && p.stock > 3;
        } else if (statusFilter === 'low_stock') {
            return matchesSearch && p.stock > 0 && p.stock <= 3;
        } else if (statusFilter === 'on_sale') {
            return matchesSearch && p.active_promotion !== null;
        }
        return matchesSearch;
    });

    return (
        <ShopConsoleLayout shop={shop} title="Catalogue Produits">
            <Head title={`Catalogue Produits - ${shop.name}`} />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* COMPACT & ELEGANT TOP BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/70 p-5 rounded-xl shadow-xs">
                    <div>
                        <h1 className="text-base font-semibold text-stone-900">Catalogue & Gestion des Produits</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Pilotez vos articles en stock, mettez à jour les prix et suivez l'attractivité de vos offres.
                        </p>
                    </div>

                    <Link href={route('seller.shop.products.create', shop.slug)}>
                        <button 
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                            disabled={remainingStock <= 0}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Créer un produit</span>
                        </button>
                    </Link>
                </div>

                {/* STOCK QUOTA GAUGE BANNER */}
                <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-amber-900">Quota Stock Vendeur Cumulé</span>
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                                    Limite Pack : {maxStockLimit} Unités
                                </span>
                            </div>
                            <p className="text-xs text-stone-600 font-normal leading-relaxed">
                                Le stock cumulé sur vos boutiques est actuellement de <strong>{totalStock} / {maxStockLimit}</strong> unités.
                                {remainingStock <= 0 ? (
                                    <span className="text-red-600 font-medium block mt-0.5">
                                        Limite atteinte. Vendez ou réajustez vos stocks pour créer de nouveaux produits.
                                    </span>
                                ) : (
                                    <span className="text-stone-500 block mt-0.5">
                                        Il vous reste <strong>{remainingStock}</strong> unités de stock attribuables.
                                    </span>
                                )}
                            </p>
                        </div>
                        
                        <div className="w-full md:w-56 space-y-1.5 shrink-0">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-stone-500 font-normal">Utilisation :</span>
                                <span className="text-amber-900 font-semibold">{totalStock} / {maxStockLimit} ({Math.round(stockPercent)}%)</span>
                            </div>
                            <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${stockPercent}%`, 
                                        backgroundColor: totalStock >= maxStockLimit ? '#EF4444' : '#F59E0B' 
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 COMPACT REFINED KPI METRICS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Total Products */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Total Produits</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{totalShopProducts}</span>
                        </div>
                        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200/60">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </div>

                    {/* In Stock */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">En Stock Optimal</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{inStockCount}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200/60">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Stock Critique</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{lowStockCount}</span>
                        </div>
                        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200/60">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                    </div>

                    {/* On Sale */}
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">En Promotion</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{onSaleCount}</span>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200/60">
                            <Percent className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* SEARCH & QUICK FILTERS TOOLBAR */}
                <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-normal bg-stone-50/40"
                                placeholder="Rechercher par nom d'article ou description..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                            {[
                                { id: 'all', label: 'Tous' },
                                { id: 'in_stock', label: 'Stock ok' },
                                { id: 'low_stock', label: 'Critique' },
                                { id: 'on_sale', label: 'Promotions' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setStatusFilter(filter.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 ${
                                        statusFilter === filter.id
                                            ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-xs font-semibold'
                                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN PRODUCTS CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Products Table (8 Cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white border border-stone-200/70 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                                <Package className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-stone-800">Aucun produit trouvé</p>
                                    <p className="text-xs text-stone-500 font-normal">
                                        Modifiez votre recherche ou créez un nouvel article dans cette boutique.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-stone-200/70 rounded-xl overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs font-normal">
                                        <thead>
                                            <tr className="bg-stone-50 border-b border-stone-200/70 text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                                                <th className="p-4">Produit</th>
                                                <th className="p-4 text-center">Stock</th>
                                                <th className="p-4 text-right">Prix</th>
                                                <th className="p-4 text-center">Promotion</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100 text-stone-700">
                                            {filteredProducts.map((product) => {
                                                const hasPromo = product.active_promotion !== null;
                                                const firstImage = product.image_paths && product.image_paths.length > 0 
                                                    ? `/storage/${product.image_paths[0]}` 
                                                    : null;

                                                return (
                                                    <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-stone-100 border border-stone-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                                                    {firstImage ? (
                                                                        <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package className="w-5 h-5 text-stone-300 stroke-[1.5]" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-stone-900 text-xs leading-snug">{product.name}</h4>
                                                                    <p className="text-[11px] text-stone-400 font-normal line-clamp-1">
                                                                        {product.description || 'Aucune description'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="p-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                                                product.stock === 0 
                                                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                                                    : product.stock <= 3 
                                                                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                            }`}>
                                                                {product.stock} dispo
                                                            </span>
                                                        </td>

                                                        <td className="p-4 text-right font-semibold text-stone-900">
                                                            {Number(product.price).toLocaleString()} FCFA
                                                        </td>

                                                        <td className="p-4 text-center">
                                                            {hasPromo ? (
                                                                <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                                                                    -{product.active_promotion.discount_percentage}% OFF
                                                                </span>
                                                            ) : (
                                                                <span className="text-[11px] text-stone-400 font-normal">---</span>
                                                            )}
                                                        </td>

                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end items-center gap-1.5">
                                                                <Link href={route('seller.shop.products.edit', { shop: shop.slug, product: product.slug })}>
                                                                    <button 
                                                                        title="Modifier"
                                                                        className="p-1.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg transition-colors"
                                                                    >
                                                                        <Edit className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </Link>
                                                                <button 
                                                                    onClick={() => handleDelete(product)}
                                                                    title="Supprimer"
                                                                    className="p-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar Widgets (4 Cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        
                        {/* Top Selling Product Card */}
                        <div className="bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Article Vedette</h3>
                                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>Top Ventes</span>
                                </span>
                            </div>

                            {products.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                            {products[0].image_paths && products[0].image_paths[0] ? (
                                                <img src={`/storage/${products[0].image_paths[0]}`} alt={products[0].name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-5 h-5 text-stone-300 stroke-[1.5]" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-stone-900 text-xs">{products[0].name}</h4>
                                            <span className="text-[11px] text-stone-500 font-normal">
                                                Prix : {Number(products[0].price).toLocaleString()} FCFA
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs font-normal">
                                        <div>
                                            <span className="text-stone-400 text-[10px] block">Ventes mensuelles</span>
                                            <span className="font-semibold text-stone-900">48 unités</span>
                                        </div>
                                        <div>
                                            <span className="text-stone-400 text-[10px] block">Note clients</span>
                                            <span className="font-semibold text-stone-900 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                <span>4.9 / 5</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400 text-center py-4 font-normal">Aucun article disponible.</p>
                            )}
                        </div>

                        {/* Customer Feedback breakdown */}
                        <div className="bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs space-y-3">
                            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
                                Satisfaction Acheteurs
                            </h3>
                            
                            <div className="flex items-center gap-4">
                                <div className="space-y-0.5">
                                    <div className="text-2xl font-semibold text-stone-900">4.8</div>
                                    <div className="text-amber-500 text-xs flex gap-0.5">★★★★★</div>
                                    <span className="text-[10px] text-stone-400 font-normal block">24 avis vérifiés</span>
                                </div>

                                <div className="flex-1 space-y-1.5 text-[11px] text-stone-600 font-normal">
                                    <div className="space-y-0.5">
                                        <div className="flex justify-between text-[10px]">
                                            <span>Positif (4-5 ★)</span>
                                            <span className="font-semibold">92%</span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex justify-between text-[10px]">
                                            <span>Neutre (3 ★)</span>
                                            <span className="font-semibold">8%</span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '8%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Advisory Box */}
                        <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 flex gap-3 text-xs text-amber-950 font-normal">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-amber-950">Conseil de Gestion de Stock</h4>
                                <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed font-normal">
                                    Maintenez vos stocks à jour pour garantir l'expédition sous 24h et préserver votre badge de confiance Sellify Escrow.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </ShopConsoleLayout>
    );
}
