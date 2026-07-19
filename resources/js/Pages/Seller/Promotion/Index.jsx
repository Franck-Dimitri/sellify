import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { Card, CardContent } from '../../../Components/ui/Card';
import Input from '../../../Components/ui/Input';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import { 
    Percent, 
    Trash2, 
    Calendar,
    PlusCircle,
    Info,
    AlertCircle,
    Tag
} from 'lucide-react';

export default function Index({ shop, promotions = [], products = [] }) {
    const activeColor = shop.theme_color || '#CA8A04';
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        promo_price: '',
        start_date: '',
        end_date: '',
    });

    // Recalculate discount percentage when product or promo_price changes
    useEffect(() => {
        const product = products.find(p => p.id === parseInt(data.product_id));
        setSelectedProduct(product);

        if (product && data.promo_price) {
            const original = parseFloat(product.price);
            const reduced = parseFloat(data.promo_price);
            if (original > 0 && reduced > 0 && reduced < original) {
                const pct = Math.round((1 - (reduced / original)) * 100);
                setDiscountPercentage(pct);
            } else {
                setDiscountPercentage(0);
            }
        } else {
            setDiscountPercentage(0);
        }
    }, [data.product_id, data.promo_price, products]);

    const submit = (e) => {
        e.preventDefault();
        post(route('seller.shop.promotions.store', shop.slug), {
            onSuccess: () => {
                reset();
                setDiscountPercentage(0);
            }
        });
    };

    const handleDelete = (promoId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette promotion ? Le produit repassera au prix normal.")) {
            router.delete(route('seller.shop.promotions.destroy', { shop: shop.slug, promotion: promoId }));
        }
    };

    return (
        <ShopConsoleLayout shop={shop} title="Promotions de la Boutique">
            <Head title={`Promotions - ${shop.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-1">
                {/* Left Side: Create Promotion Form (1 column) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-surface-200">
                        <div className="border-b border-surface-100 p-5">
                            <h3 className="text-sm font-bold text-surface-750 flex items-center space-x-2">
                                <PlusCircle className="w-4.5 h-4.5" style={{ color: activeColor }} />
                                <span>Créer une Promotion</span>
                            </h3>
                            <p className="text-[10px] text-surface-400 mt-1">Configurez une promotion temporaire sur un produit.</p>
                        </div>

                        <CardContent className="p-5">
                            <form onSubmit={submit} className="space-y-4">
                                {/* Product Selector */}
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-xs font-semibold text-surface-600">Sélectionner un produit</label>
                                    <select
                                        className="w-full px-3 py-2 text-surface-700 bg-white border border-surface-200 rounded-lg outline-none text-xs h-9 focus:border-surface-300 transition-all font-semibold"
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choisir un produit --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({parseFloat(p.price).toFixed(2)} €)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_id && <p className="text-xs text-rose-600 font-medium">{errors.product_id}</p>}
                                </div>

                                {/* Promo Price & Percentage Display */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Prix réduit (€)"
                                        name="promo_price"
                                        type="number"
                                        step="0.01"
                                        value={data.promo_price}
                                        onChange={e => setData('promo_price', e.target.value)}
                                        placeholder="0.00"
                                        required
                                        disabled={!data.product_id}
                                        error={errors.promo_price}
                                    />

                                    <div className="flex flex-col justify-end pb-2">
                                        <div className="bg-surface-50 border border-surface-200 rounded-lg p-2 text-center h-9 flex items-center justify-center">
                                            {discountPercentage > 0 ? (
                                                <span className="text-xs font-bold text-emerald-600">
                                                    -{discountPercentage}%
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-surface-400 font-medium">0% remise</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Date range selection */}
                                <div className="grid grid-cols-1 gap-3">
                                    <Input
                                        label="Date de début"
                                        name="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        required
                                        error={errors.start_date}
                                    />
                                    <Input
                                        label="Date de fin"
                                        name="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        required
                                        error={errors.end_date}
                                    />
                                </div>

                                {/* Hint info */}
                                {selectedProduct && (
                                    <div className="bg-surface-50 border border-surface-150 rounded-xl p-3 flex items-start space-x-2 text-[10px] text-surface-450 leading-relaxed font-normal">
                                        <Info className="w-3.5 h-3.5 text-surface-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span>Prix normal : <strong>{parseFloat(selectedProduct.price).toFixed(2)} €</strong>.</span>
                                            <span className="block mt-0.5">La promotion remplacera automatiquement le prix d'affichage durant la période définie.</span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={processing || !data.product_id || discountPercentage <= 0}
                                    className="w-full text-white font-semibold text-xs py-2 shadow-sm"
                                    style={{ backgroundColor: activeColor }}
                                >
                                    {processing ? 'Planification...' : 'Activer la Promotion'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Active Promotions Table (2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-surface-700 tracking-tight flex items-center space-x-2">
                            <Tag className="w-5 h-5 text-yellow-600" />
                            <span>Promotions Actives</span>
                        </h2>
                        <span className="text-[10px] text-surface-400 font-semibold font-mono">
                            {promotions.length} Promo{promotions.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    {promotions.length === 0 ? (
                        <div className="bg-white border border-surface-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                                <Percent className="w-10 h-10" />
                            </div>
                            <div className="space-y-1 max-w-sm">
                                <p className="text-sm font-semibold text-surface-700 font-semibold">Aucune promotion en cours</p>
                                <p className="text-xs text-surface-400 leading-relaxed font-normal">
                                    Vos produits sont tous vendus au tarif standard. Utilisez le formulaire de gauche pour planifier des soldes.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-surface-50 border-b border-surface-150 text-surface-400 font-bold uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Produit</th>
                                            <th className="p-4 font-semibold text-center">Remise</th>
                                            <th className="p-4 font-semibold text-right">Ancien prix</th>
                                            <th className="p-4 font-semibold text-right">Prix soldé</th>
                                            <th className="p-4 font-semibold text-center">Période</th>
                                            <th className="p-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100 text-surface-600 font-semibold">
                                        {promotions.map((promo) => {
                                            const isExpired = new Date(promo.end_date) < new Date(new Date().toDateString());
                                            return (
                                                <tr key={promo.id} className="hover:bg-surface-50/30 transition-colors">
                                                    {/* Product Name */}
                                                    <td className="p-4">
                                                        <h4 className="font-bold text-surface-750 text-sm leading-snug">{promo.product?.name || 'Produit inconnu'}</h4>
                                                    </td>

                                                    {/* Discount Percentage */}
                                                    <td className="p-4 text-center">
                                                        <Badge variant={isExpired ? 'neutral' : 'success'} className="font-bold">
                                                            -{promo.discount_percentage}%
                                                        </Badge>
                                                    </td>

                                                    {/* Original Price */}
                                                    <td className="p-4 text-right text-surface-400 font-normal line-through">
                                                        {parseFloat(promo.product?.price || 0).toFixed(2)} €
                                                    </td>

                                                    {/* Discounted Price */}
                                                    <td className="p-4 text-right font-bold text-surface-750 text-sm">
                                                        {parseFloat(promo.promo_price).toFixed(2)} €
                                                    </td>

                                                    {/* Date Period */}
                                                    <td className="p-4 text-center text-[10px] text-surface-450 font-normal">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                                                            <span>
                                                                {formatDate(promo.start_date)} au {formatDate(promo.end_date)}
                                                            </span>
                                                        </div>
                                                        {isExpired && (
                                                            <span className="text-red-500 font-semibold text-[8px] uppercase tracking-wider block mt-0.5">Expiré</span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleDelete(promo.id)}
                                                            title="Supprimer la promotion"
                                                            className="p-2 border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-colors bg-white shadow-xs"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
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
            </div>
        </ShopConsoleLayout>
    );
}

// Utility to format dates
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
    });
}
