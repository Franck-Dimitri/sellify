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
    Plus,
    Info,
    Tag,
    X,
    TrendingUp,
    ShoppingBag,
    CheckCircle,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';

export default function Index({ shop, promotions = [], products = [] }) {
    const activeColor = shop.theme_color || '#CA8A04';
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        promo_price: '',
        start_date: '',
        end_date: '',
    });

    // Compute stats
    const totalPromos = promotions.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activePromos = promotions.filter(p => {
        const start = new Date(p.start_date);
        const end = new Date(p.end_date);
        return start <= today && end >= today;
    }).length;

    const avgDiscount = totalPromos > 0 
        ? Math.round(promotions.reduce((sum, p) => sum + p.discount_percentage, 0) / totalPromos)
        : 0;

    const eligibleCount = products.length;

    // Recalculate percentage
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
                setIsModalOpen(false);
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

            <div className="space-y-6 px-1">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-surface-700 tracking-tight">Gestion des Promotions</h2>
                        <p className="text-xs text-surface-450 mt-0.5">Créez et suivez les offres promotionnelles appliquées aux produits de cette boutique.</p>
                    </div>

                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-white font-medium flex items-center space-x-1.5 shadow-sm text-xs"
                        style={{ backgroundColor: activeColor }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouvelle promotion</span>
                    </Button>
                </div>

                {/* 3 Premium Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Card 1: Active Promotions */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Promotions en cours</span>
                            <span className="text-2xl font-bold text-surface-750 block">{activePromos} / {totalPromos}</span>
                            <span className="text-xs text-emerald-600 font-semibold block pt-1">Actives aujourd'hui</span>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Average Discount */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Remise moyenne</span>
                            <span className="text-2xl font-bold text-surface-750 block">{avgDiscount}%</span>
                            <span className="text-xs text-surface-450 font-semibold block pt-1">Sur les prix d'origine</span>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Eligible Products */}
                    <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Produits éligibles</span>
                            <span className="text-2xl font-bold text-surface-750 block">{eligibleCount}</span>
                            <span className="text-xs text-surface-450 font-semibold block pt-1">Disponibles en catalogue</span>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-3">
                        <h3 className="text-sm font-bold text-surface-700">Toutes les offres</h3>

                        {promotions.length === 0 ? (
                            <div className="bg-white border border-surface-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 text-surface-300">
                                    <Percent className="w-9 h-9" style={{ color: activeColor }} />
                                </div>
                                <div className="space-y-1 max-w-sm">
                                    <p className="text-sm font-semibold text-surface-700">Aucune promotion active</p>
                                    <p className="text-xs text-surface-400 leading-relaxed font-normal">
                                        Boostez vos ventes en créant votre première promotion temporaire.
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-white font-medium text-xs shadow-sm"
                                    style={{ backgroundColor: activeColor }}
                                >
                                    Planifier une promotion
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-xs">
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
                                                const start = new Date(promo.start_date);
                                                const end = new Date(promo.end_date);
                                                const isExpired = end < today;
                                                return (
                                                    <tr key={promo.id} className="hover:bg-surface-50/30 transition-colors">
                                                        {/* Product */}
                                                        <td className="p-4">
                                                            <span className="font-bold text-surface-750 text-sm leading-snug">{promo.product?.name || 'Produit inconnu'}</span>
                                                        </td>

                                                        {/* Discount */}
                                                        <td className="p-4 text-center">
                                                            <Badge variant={isExpired ? 'neutral' : 'success'} className="font-bold">
                                                                -{promo.discount_percentage}%
                                                            </Badge>
                                                        </td>

                                                        {/* Old price */}
                                                        <td className="p-4 text-right text-surface-400 font-normal line-through">
                                                            {parseFloat(promo.product?.price || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                        </td>

                                                        {/* Promo price */}
                                                        <td className="p-4 text-right font-bold text-surface-750 text-sm">
                                                            {parseFloat(promo.promo_price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                        </td>

                                                        {/* Period */}
                                                        <td className="p-4 text-center text-[10px] text-surface-450 font-normal">
                                                            <div className="flex items-center justify-center space-x-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                                                                <span>
                                                                    {formatDate(promo.start_date)} au {formatDate(promo.end_date)}
                                                                </span>
                                                            </div>
                                                            {isExpired && (
                                                                <span className="text-red-500 font-semibold text-[8px] uppercase tracking-wider block mt-0.5">Expiré</span>
                                                            )}
                                                        </td>

                                                        {/* Delete */}
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

                    {/* Right side: Sidebar with campaign widgets */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Campaign Impact Widget */}
                        <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: activeColor }} />

                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-surface-700 uppercase tracking-wider">Impact Estimé</h3>
                                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center space-x-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span>+24% Trafic</span>
                                </Badge>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-surface-450 font-semibold">Taux de conversion</span>
                                    <span className="font-bold text-surface-750">+3.8%</span>
                                </div>
                                <div className="w-full bg-surface-50 h-2 rounded-full overflow-hidden border border-surface-150">
                                    <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: activeColor }} />
                                </div>
                                <p className="text-[10px] text-surface-400 font-normal leading-relaxed mt-2">
                                    Les produits à prix barrés attirent en moyenne 3 fois plus de clics sur les résultats de recherche.
                                </p>
                            </div>
                        </div>

                        {/* Campaign Optimization tip */}
                        <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-xs space-y-3">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
                                <h3 className="text-xs font-bold text-surface-700 uppercase tracking-wider">Conseil Marketing</h3>
                            </div>
                            <p className="text-[11px] text-surface-450 leading-relaxed font-semibold">
                                Privilégiez des réductions comprises entre <strong style={{ color: activeColor }}>15% et 35%</strong>. C’est la fourchette idéale pour déclencher l’achat impulsif sans dégrader votre marge nette.
                            </p>
                        </div>
                    </div>
                </div>                {/* --- MODAL FORM --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                            onClick={() => setIsModalOpen(false)}
                        />

                        {/* Modal Content */}
                        <div className="relative w-full max-w-md mx-auto my-6 z-55 px-4">
                            <Card className="border-none shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 scale-100 bg-white">
                                <div className="border-b border-surface-100 p-5 flex justify-between items-center bg-surface-50/50">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="w-4.5 h-4.5" style={{ color: activeColor }} />
                                        <h3 className="text-sm font-bold text-surface-750">Planifier une Promotion</h3>
                                    </div>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-surface-400 hover:text-surface-600 transition-colors p-1 hover:bg-surface-100 rounded-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <CardContent className="p-5">
                                    <form onSubmit={submit} className="space-y-4">
                                        {/* Product Selector */}
                                        <div className="flex flex-col space-y-1.5">
                                            <label className="text-xs font-semibold text-surface-650">Sélectionner un produit</label>
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

                                        {/* Date selection */}
                                        <div className="grid grid-cols-2 gap-3">
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

                                        {/* Info warning */}
                                        {selectedProduct && (
                                            <div className="bg-surface-50 border border-surface-150 rounded-xl p-3 flex items-start space-x-2 text-[10px] text-surface-450 leading-relaxed font-normal">
                                                <Info className="w-3.5 h-3.5 text-surface-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <span>Tarif standard : <strong>{parseFloat(selectedProduct.price).toFixed(2)} €</strong>.</span>
                                                    <span className="block mt-0.5">La promotion prendra effet aux dates indiquées.</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="border-t border-surface-100 pt-4 flex justify-end space-x-3">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="font-semibold text-xs py-1.5"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.product_id || discountPercentage <= 0}
                                                className="text-white font-semibold text-xs py-1.5 shadow-sm"
                                                style={{ backgroundColor: activeColor }}
                                            >
                                                {processing ? 'Enregistrement...' : 'Lancer l\'offre'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </ShopConsoleLayout>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
    });
}
