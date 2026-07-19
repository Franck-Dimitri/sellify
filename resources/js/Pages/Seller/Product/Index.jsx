import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { Card, CardContent } from '../../../Components/ui/Card';
import Badge from '../../../Components/ui/Badge';
import Button from '../../../Components/ui/Button';
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
    CheckCircle,
    ShoppingBag,
    ArrowUpRight
} from 'lucide-react';

export default function Index({ shop, products = [], totalStock = 0, maxStockLimit = 30, remainingStock = 30 }) {
    const activeColor = shop.theme_color || '#CA8A04';
    
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

            <div className="space-y-6 px-1">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-surface-700 tracking-tight">Catalogue Produits</h2>
                        <p className="text-xs text-surface-450 mt-0.5">Pilotez le catalogue d'articles, les stocks et les prix de votre vitrine locale.</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href={route('seller.shop.products.create', shop.slug)}>
                            <Button 
                                className="text-white flex items-center space-x-1.5 shadow-sm text-xs"
                                style={{ backgroundColor: activeColor }}
                                disabled={remainingStock <= 0}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Créer un produit</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stock Counter Premium Banner */}
                <div className="bg-white border border-surface-200 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-yellow-500">Stock Vendeur Cumulé</span>
                                <span className="text-[10px] bg-yellow-100/20 text-yellow-500 font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    Limite : {maxStockLimit} Unités
                                </span>
                            </div>
                            <p className="text-xs text-surface-450 leading-relaxed font-normal">
                                Règle Sellify : Le total cumulé des stocks de toutes vos boutiques ne doit pas dépasser {maxStockLimit} unités.
                                {remainingStock <= 0 ? (
                                    <span className="text-rose-600 font-medium block mt-1">
                                        Limite atteinte. Vendez vos produits ou réduisez les stocks existants pour en créer de nouveaux.
                                    </span>
                                ) : (
                                    <span className="text-surface-500 block mt-0.5">
                                        Il vous reste <strong>{remainingStock}</strong> unités de stock libres.
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-surface-500">Utilisation :</span>
                                <span style={{ color: activeColor }}>{totalStock} / {maxStockLimit} ({Math.round(stockPercent)}%)</span>
                            </div>
                            <div className="w-full bg-surface-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${stockPercent}%`, 
                                        backgroundColor: totalStock >= maxStockLimit ? '#EF4444' : activeColor 
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 Premium Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1: Total */}
                    <div className="bg-white border border-surface-200 rounded-xl p-4  flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Total Produits</span>
                            <span className="text-xl font-bold text-surface-700 block mt-0.5">{totalShopProducts}</span>
                        </div>
                        <div className="p-2.5 bg-surface-50 text-surface-600 border border-surface-150 rounded-xl">
                            <ShoppingBag className="w-4.5 h-4.5" />
                        </div>
                    </div>

                    {/* Stat 2: In stock */}
                    <div className="bg-white border border-surface-200 rounded-xl p-4  flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">En Stock</span>
                            <span className="text-xl font-bold text-surface-700 block mt-0.5">{inStockCount}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                            <CheckCircle className="w-4.5 h-4.5" />
                        </div>
                    </div>

                    {/* Stat 3: Low stock */}
                    <div className="bg-white border border-surface-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Stock Critique</span>
                            <span className="text-xl font-bold text-surface-700 block mt-0.5">{lowStockCount}</span>
                        </div>
                        <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
                            <AlertTriangle className="w-4.5 h-4.5" />
                        </div>
                    </div>

                    {/* Stat 4: On Sale */}
                    <div className="bg-white border border-surface-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">En Promotion</span>
                            <span className="text-xl font-bold text-surface-700 block mt-0.5">{onSaleCount}</span>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                            <Percent className="w-4.5 h-4.5" />
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white border border-surface-200 rounded-xl p-4  space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 border border-surface-200 rounded-md text-xs text-surface-700 focus:outline-none focus:border-yellow-600 transition-colors bg-surface-50/20"
                                placeholder="Rechercher un produit par nom, caractéristiques..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Quick Filters */}
                        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                            {[
                                { id: 'all', label: 'Tous' },
                                { id: 'in_stock', label: 'Stock ok' },
                                { id: 'low_stock', label: 'Critique' },
                                { id: 'on_sale', label: 'Promos' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setStatusFilter(filter.id)}
                                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all shrink-0
                                        ${statusFilter === filter.id
                                            ? 'text-white border-transparent shadow-sm'
                                            : 'bg-white text-surface-555 border-surface-200 hover:bg-surface-50/50'}`}
                                    style={statusFilter === filter.id ? { backgroundColor: activeColor } : {}}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    <div className='lg:col-span-8 space-y-6'>
                        {/* Products List Rendering */}
                        {filteredProducts.length === 0 ? (
                                <div className="bg-white border border-surface-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
                                    <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                                        <Package className="w-9 h-9" />
                                    </div>
                                <div className="space-y-1 max-w-sm">
                                    <p className="text-sm font-semibold text-surface-700">Aucun produit trouvé</p>
                                    <p className="text-xs text-surface-400 leading-relaxed font-normal">
                                        Modifiez vos critères de recherche ou ajoutez un nouvel article au catalogue.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-surface-100 rounded-2xl overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-surface-50 border-b border-surface-150 text-surface-400 font-bold uppercase tracking-wider">
                                                <th className="p-4 font-semibold">Produit</th>
                                                <th className="p-4 font-semibold text-center">Stock</th>
                                                <th className="p-4 font-semibold text-right">Prix normal</th>
                                                <th className="p-4 font-semibold text-center">Remise active</th>
                                                <th className="p-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-100 text-surface-600 font-semibold">
                                            {filteredProducts.map((product) => {
                                                const hasPromo = product.active_promotion !== null;
                                                const firstImage = product.image_paths && product.image_paths.length > 0 
                                                    ? `/storage/${product.image_paths[0]}` 
                                                    : null;

                                                return (
                                                    <tr key={product.id} className="hover:bg-surface-50/30 transition-colors">
                                                        {/* Product */}
                                                        <td className="p-4">
                                                            <div className="flex items-center space-x-3.5">
                                                                <div className="w-11 h-11 bg-surface-50 border border-surface-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                                                                    {firstImage ? (
                                                                        <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package className="w-5 h-5 text-surface-300" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-surface-750 text-sm leading-snug">{product.name}</h4>
                                                                    <p className="text-[10px] text-surface-400 font-normal mt-0.5 line-clamp-1">
                                                                        {product.description || 'Aucune description rédigée'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Stock Status */}
                                                        <td className="p-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border
                                                                ${product.stock === 0 
                                                                    ? 'bg-rose-50 text-rose-700 border-rose-150' 
                                                                    : product.stock <= 3 
                                                                        ? 'bg-amber-50 text-amber-700 border-amber-150 animate-pulse'
                                                                        : 'bg-surface-50 text-surface-600 border-surface-200'
                                                                }`}>
                                                                {product.stock} {product.stock <= 1 ? 'unité' : 'unités'}
                                                            </span>
                                                        </td>

                                                        {/* Price */}
                                                        <td className="p-4 text-right text-sm font-bold text-surface-750">
                                                            {parseFloat(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                        </td>

                                                        {/* Promo */}
                                                        <td className="p-4 text-center">
                                                            {hasPromo ? (
                                                                <div className="inline-flex flex-col items-center">
                                                                    <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold flex items-center space-x-0.5 text-[9px] py-0.5">
                                                                        <Percent className="w-2.5 h-2.5" />
                                                                        <span>-{product.active_promotion.discount_percentage}%</span>
                                                                    </Badge>
                                                                    <span className="text-[9px] text-surface-400 font-medium mt-1">
                                                                        {parseFloat(product.active_promotion.promo_price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-surface-350 font-medium">Aucune</span>
                                                            )}
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end items-center space-x-2">
                                                                <Link href={route('seller.shop.products.edit', { shop: shop.slug, product: product.slug })}>
                                                                    <button 
                                                                        title="Modifier le produit"
                                                                        className="p-2 border border-surface-200 hover:bg-white text-surface-450 hover:text-surface-700 rounded-xl transition-colors bg-white shadow-xs"
                                                                    >
                                                                        <Edit className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </Link>
                                                                <button 
                                                                    onClick={() => handleDelete(product)}
                                                                    title="Supprimer le produit"
                                                                    className="p-2 border border-red-200 hover:bg-red-50 text-red-450 hover:text-red-700 rounded-xl transition-colors bg-white shadow-xs"
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

                    {/* Sidebar: Stats, Top Seller, Ratings & Tips */}
                    <div className='lg:col-span-4 space-y-6'>
                        {/* Star Product Widget */}
                        <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
                            {/* Decorative Top Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: activeColor }} />

                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-surface-700 uppercase tracking-wider">Produit Vedette</h3>
                                <Badge variant="success" className="bg-amber-50 text-amber-700 border-amber-100 flex items-center space-x-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span>Top Ventes</span>
                                </Badge>
                            </div>

                            {products.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center space-x-3.5">
                                        <div className="w-14 h-14 bg-surface-50 border border-surface-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                            {products[0].image_paths && products[0].image_paths.length > 0 ? (
                                                <img 
                                                    src={`/storage/${products[0].image_paths[0]}`} 
                                                    alt={products[0].name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-surface-300" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-750 text-sm">{products[0].name}</h4>
                                            <span className="text-[10px] text-surface-450 block mt-0.5">
                                                Prix : {parseFloat(products[0].price).toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-100 text-xs">
                                        <div className="space-y-0.5">
                                            <span className="text-surface-400 text-[10px] font-semibold block">Ventes ce mois</span>
                                            <span className="font-bold text-surface-750 text-sm">48 unités</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-surface-400 text-[10px] font-semibold block">Note moyenne</span>
                                            <span className="font-bold text-surface-750 text-sm flex items-center space-x-1">
                                                <span className="text-amber-500">★</span>
                                                <span>4.9 / 5</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 text-center py-6 text-surface-400 text-xs font-medium">
                                    Aucune vente enregistrée
                                </div>
                            )}
                        </div>

                        {/* Customer Feedback Summary Widget */}
                        <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs">
                            <h3 className="text-xs font-bold text-surface-700 uppercase tracking-wider mb-4">Satisfaction client</h3>
                            
                            <div className="flex items-center space-x-4">
                                <div className="space-y-1">
                                    <div className="text-3xl font-extrabold text-surface-750 tracking-tight">4.8</div>
                                    <div className="text-amber-500 text-sm tracking-widest">★★★★★</div>
                                    <span className="text-[10px] text-surface-400 font-semibold block">Basé sur 24 avis</span>
                                </div>

                                <div className="flex-1 space-y-2 text-[10px] font-semibold text-surface-500">
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Positif (4-5 ★)</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full bg-surface-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Neutre (3 ★)</span>
                                            <span>8%</span>
                                        </div>
                                        <div className="w-full bg-surface-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '8%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stock Optimization Tips */}
                        <div className="bg-amber-50/50 border border-amber-150 rounded-2xl p-4 flex space-x-3 text-xs leading-relaxed text-amber-800">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-amber-900">Conseil Stock & Ventes</h4>
                                <p className="text-[11px] font-normal text-amber-700 mt-1">
                                    Vos articles les plus vendus approchent d'un niveau critique. Pensez à rééquilibrer vos stocks ou planifier une offre de déstockage sur vos invendus.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </ShopConsoleLayout>
    );
}
