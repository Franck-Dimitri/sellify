import React from 'react';
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
    Percent
} from 'lucide-react';

export default function Index({ shop, products = [], totalStock = 0, maxStockLimit = 30, remainingStock = 30 }) {
    const activeColor = shop.theme_color || '#CA8A04';
    
    // Percentage of stock used
    const stockPercent = Math.min(100, (totalStock / maxStockLimit) * 100);

    const handleDelete = (product) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ? Cette action est irréversible.`)) {
            router.delete(route('seller.shop.products.destroy', { shop: shop.slug, product: product.slug }));
        }
    };

    return (
        <ShopConsoleLayout shop={shop} title="Catalogue Produits">
            <Head title={`Catalogue Produits - ${shop.name}`} />

            <div className="space-y-6 px-1">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-surface-700 tracking-tight">Catalogue Produits</h2>
                        <p className="text-xs text-surface-450 mt-0.5">Gérez le catalogue, les prix et les stocks de votre boutique locale</p>
                    </div>

                    <Link href={route('seller.shop.products.create', shop.slug)}>
                        <Button 
                            className="text-white font-medium flex items-center space-x-1.5 shadow-sm text-xs"
                            style={{ backgroundColor: activeColor }}
                            disabled={remainingStock <= 0}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter un produit</span>
                        </Button>
                    </Link>
                </div>

                {/* Stock Counter Premium Banner */}
                <div className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-surface-750">Stock Vendeur Cumulé</span>
                                <span className="text-[10px] bg-surface-100 text-surface-500 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Limite : {maxStockLimit} Unités
                                </span>
                            </div>
                            <p className="text-xs text-surface-450 leading-relaxed font-normal">
                                Règle Sellify : Le total cumulé des stocks de toutes vos boutiques ne doit pas dépasser {maxStockLimit} unités.
                                {remainingStock <= 0 ? (
                                    <span className="text-rose-600 font-medium block mt-1">
                                        ⚠️ Limite atteinte. Vendez vos produits ou réduisez les stocks existants pour en créer de nouveaux.
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

                {/* Product List */}
                {products.length === 0 ? (
                    <div className="bg-white border border-surface-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                            <Package className="w-10 h-10" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                            <p className="text-sm font-semibold text-surface-700">Aucun produit dans cette boutique</p>
                            <p className="text-xs text-surface-400 leading-relaxed font-normal">
                                Commencez à vendre en ajoutant le premier produit de votre catalogue dans {shop.name}.
                             </p>
                        </div>
                        <Link href={route('seller.shop.products.create', shop.slug)}>
                            <Button className="text-white font-medium shadow-sm text-xs" style={{ backgroundColor: activeColor }}>
                                Créer mon premier produit
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-surface-50 border-b border-surface-150 text-surface-400 font-bold uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Produit</th>
                                        <th className="p-4 font-semibold text-center">Stock</th>
                                        <th className="p-4 font-semibold text-right">Prix normal</th>
                                        <th className="p-4 font-semibold text-center">Promotion active</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-100 text-surface-600 font-semibold">
                                    {products.map((product) => {
                                        const hasPromo = product.active_promotion !== null;
                                        const firstImage = product.image_paths && product.image_paths.length > 0 
                                            ? `/storage/${product.image_paths[0]}` 
                                            : null;

                                        return (
                                            <tr key={product.id} className="hover:bg-surface-50/30 transition-colors">
                                                {/* Product Image & Details */}
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
                                                    {numberFormat(product.price)} €
                                                </td>

                                                {/* Promotion Badge */}
                                                <td className="p-4 text-center">
                                                    {hasPromo ? (
                                                        <div className="inline-flex flex-col items-center">
                                                            <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold flex items-center space-x-0.5 text-[9px] py-0.5">
                                                                <Percent className="w-2.5 h-2.5" />
                                                                <span>-{product.active_promotion.discount_percentage}%</span>
                                                            </Badge>
                                                            <span className="text-[9px] text-surface-400 font-medium mt-1">
                                                                {numberFormat(product.active_promotion.promo_price)} €
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
        </ShopConsoleLayout>
    );
}

// Utility function to format prices
function numberFormat(val) {
    return parseFloat(val).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
