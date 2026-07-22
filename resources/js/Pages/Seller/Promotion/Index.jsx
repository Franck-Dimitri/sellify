import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { 
    Percent, 
    Trash2, 
    Calendar,
    Plus,
    Tag,
    X,
    TrendingUp,
    ShoppingBag,
    CheckCircle2,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';

export default function Index({ shop, promotions = [], products = [] }) {
    const activeColor = shop.theme_color || '#F59E0B';
    
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

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* TOP HEADER BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/70 p-5 rounded-xl shadow-xs">
                    <div>
                        <h1 className="text-base font-semibold text-stone-900">Gestion des Promotions Locales</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Planifiez des réductions de prix temporaires pour stimuler les ventes de <span className="font-semibold text-stone-900">{shop.name}</span>
                        </p>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouvelle promotion</span>
                    </button>
                </div>

                {/* 3 COMPACT REFINED KPI METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Promotions en Cours</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{activePromos} / {totalPromos}</span>
                            <span className="text-[11px] text-emerald-600 font-medium block pt-0.5">Actives aujourd'hui</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200/60">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Remise Moyenne</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{avgDiscount}%</span>
                            <span className="text-[11px] text-stone-400 font-normal block pt-0.5">Sur prix catalogue</span>
                        </div>
                        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200/60">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">Produits Éligibles</span>
                            <span className="text-lg font-semibold text-stone-900 block mt-0.5">{eligibleCount}</span>
                            <span className="text-[11px] text-stone-400 font-normal block pt-0.5">Articles au catalogue</span>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200/60">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* MAIN PROMOTIONS TABLE AND IMPACT WIDGET */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Table (8 Cols) */}
                    <div className="lg:col-span-8 space-y-3">
                        <div className="bg-white border border-stone-200/70 rounded-xl shadow-xs overflow-hidden">
                            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                                <h3 className="font-semibold text-stone-900 text-sm">Toutes les Offres de la Boutique</h3>
                            </div>

                            {promotions.length === 0 ? (
                                <div className="p-10 text-center space-y-3 font-normal">
                                    <Percent className="w-8 h-8 text-stone-300 mx-auto stroke-[1.5]" />
                                    <p className="text-xs text-stone-500">Aucune promotion active pour l'instant.</p>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-semibold rounded-lg shadow-xs transition-colors"
                                    >
                                        Planifier une promotion
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs font-normal">
                                        <thead>
                                            <tr className="bg-stone-50 border-b border-stone-200/70 text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                                                <th className="p-4">Produit</th>
                                                <th className="p-4 text-center">Remise</th>
                                                <th className="p-4 text-right">Prix d'Origine</th>
                                                <th className="p-4 text-right">Prix Soldé</th>
                                                <th className="p-4 text-center">Période</th>
                                                <th className="p-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100 text-stone-700">
                                            {promotions.map((promo) => {
                                                const end = new Date(promo.end_date);
                                                const isExpired = end < today;
                                                return (
                                                    <tr key={promo.id} className="hover:bg-stone-50/60 transition-colors">
                                                        <td className="p-4 font-semibold text-stone-900">
                                                            {promo.product?.name || 'Produit inconnu'}
                                                        </td>

                                                        <td className="p-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                                                isExpired ? 'bg-stone-100 text-stone-500' : 'bg-red-50 text-red-700 border border-red-200'
                                                            }`}>
                                                                -{promo.discount_percentage}% OFF
                                                            </span>
                                                        </td>

                                                        <td className="p-4 text-right text-stone-400 font-normal line-through">
                                                            {Number(promo.product?.price || 0).toLocaleString()} FCFA
                                                        </td>

                                                        <td className="p-4 text-right font-semibold text-stone-900">
                                                            {Number(promo.promo_price).toLocaleString()} FCFA
                                                        </td>

                                                        <td className="p-4 text-center text-[11px] text-stone-500">
                                                            <span>{formatDate(promo.start_date)} au {formatDate(promo.end_date)}</span>
                                                        </td>

                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleDelete(promo.id)}
                                                                title="Supprimer la promotion"
                                                                className="p-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
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
                            )}
                        </div>
                    </div>

                    {/* Right Advisory Cards (4 Cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white border border-stone-200/70 rounded-xl p-5 shadow-xs space-y-3">
                            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
                                Impact Estimé
                            </h3>
                            <div className="space-y-2 text-xs font-normal text-stone-600">
                                <div className="flex justify-between items-center">
                                    <span>Taux d'attractivité</span>
                                    <span className="font-semibold text-emerald-600">+24% clics</span>
                                </div>
                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }} />
                                </div>
                                <p className="text-[11px] text-stone-400 leading-relaxed pt-1">
                                    Les produits accompagnés de prix barrés enregistrent une conversion plus élevée sur la vitrine.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* MODAL FORM FOR NEW PROMOTION */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl space-y-4 text-stone-800">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-amber-600" />
                                    <h3 className="font-semibold text-stone-900 text-sm">Planifier une Promotion</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-3 text-xs font-normal">
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Sélectionner un produit *</label>
                                    <select
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choisir un produit du catalogue --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({Number(p.price).toLocaleString()} FCFA)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_id && <p className="text-[11px] text-red-600 mt-1">{errors.product_id}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-medium text-stone-700 mb-1">Prix réduit (FCFA) *</label>
                                        <input
                                            type="number"
                                            value={data.promo_price}
                                            onChange={e => setData('promo_price', e.target.value)}
                                            placeholder="ex: 18000"
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            required
                                            disabled={!data.product_id}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end">
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center h-9 flex items-center justify-center">
                                            {discountPercentage > 0 ? (
                                                <span className="font-semibold text-red-600 text-xs">
                                                    -{discountPercentage}% OFF
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-stone-400">0% remise</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-medium text-stone-700 mb-1">Date de début *</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-stone-700 mb-1">Date de fin *</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.product_id || discountPercentage <= 0}
                                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 font-semibold rounded-lg shadow-xs transition-colors"
                                    >
                                        {processing ? 'Lancement...' : 'Lancer l\'Offre'}
                                    </button>
                                </div>
                            </form>
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
