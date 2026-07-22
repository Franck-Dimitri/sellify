import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Boxes, 
    Search, 
    AlertTriangle, 
    CheckCircle2, 
    XCircle, 
    Save, 
    Plus, 
    Minus,
    Store,
    Layers,
    Clock,
    Tag,
    TrendingUp,
    Sparkles,
    Flame,
    Calendar,
    ArrowRight
} from 'lucide-react';

export default function Index({ products = [], promoItems = [], topSellingPromos = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editedStocks, setEditedStocks] = useState({});
    const [saving, setSaving] = useState(false);

    const { post } = useForm();

    const handleStockChange = (productId, currentStock, delta) => {
        const existing = editedStocks[productId] !== undefined ? editedStocks[productId] : currentStock;
        const newStock = Math.max(0, existing + delta);
        setEditedStocks(prev => ({ ...prev, [productId]: newStock }));
    };

    const handleStockInput = (productId, value) => {
        const num = Math.max(0, parseInt(value) || 0);
        setEditedStocks(prev => ({ ...prev, [productId]: num }));
    };

    const handleSaveBatch = (e) => {
        e.preventDefault();
        const updates = Object.keys(editedStocks).map(id => ({
            id: parseInt(id),
            stock: editedStocks[id]
        }));

        if (updates.length === 0) return;

        setSaving(true);
        post(route('seller.inventory.batch'), {
            updates: updates,
            preserveScroll: true,
            onSuccess: () => {
                setEditedStocks({});
                setSaving(false);
            },
            onError: () => setSaving(false)
        });
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
                               (product.shop?.name && product.shop.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const currentStock = editedStocks[product.id] !== undefined ? editedStocks[product.id] : product.stock;
        
        if (statusFilter === 'low') {
            return matchesSearch && currentStock > 0 && currentStock <= product.alert_threshold;
        }
        if (statusFilter === 'out') {
            return matchesSearch && currentStock === 0;
        }
        if (statusFilter === 'in_stock') {
            return matchesSearch && currentStock > product.alert_threshold;
        }
        if (statusFilter === 'promo') {
            return matchesSearch && product.promotions && product.promotions.length > 0;
        }
        return matchesSearch;
    });

    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.alert_threshold).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const inStockCount = products.filter(p => p.stock > p.alert_threshold).length;

    const hasChanges = Object.keys(editedStocks).length > 0;

    return (
        <SellerCentralLayout title="Inventaire & Produits Promotionnels">
            <Head title="Inventaire & Produits - Sellify" />

            {/* FULL WIDTH CONTAINER (w-full instead of max-w-7xl) */}
            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Layers className="w-4 h-4 text-amber-600" />
                            <span>Gestion du Catalogue & Produits Promotionnels</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Inventaire des Stocks & Suivi des Promotions
                        </h1>
                        <p className="text-xs text-stone-600">
                            Supervisez les dates d'échéance des remises, découvrez les produits en promotion les plus vendus et ajustez vos stocks.
                        </p>
                    </div>

                    {hasChanges && (
                        <button
                            onClick={handleSaveBatch}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-medium text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                        >
                            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                            <span>Enregistrer {Object.keys(editedStocks).length} modification(s)</span>
                        </button>
                    )}
                </div>

                {/* SECTION 1: DIV ÉCHÉANCE DES PRODUITS PROMOTIONNELS (COUNTDOWN & DEADLINE BANNER) */}
                <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Échéance & Compte à Rebours des Promotions en Cours</h2>
                        </div>
                        <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                            {promoItems.length} promotion(s) active(s)
                        </span>
                    </div>

                    {promoItems.length === 0 ? (
                        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200/60 text-center text-xs text-stone-500 font-normal">
                            Aucune promotion en cours d'échéance. Créez des remises temporaires pour stimuler vos ventes.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {promoItems.map(item => (
                                <div key={item.id} className="p-4 bg-amber-50/40 border border-amber-200/70 rounded-xl space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                                            -{item.discount_percentage}% De Réduction
                                        </span>
                                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-950">
                                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                                            <span>Reste : {item.days_remaining} jour(s)</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-amber-200 flex-shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Tag className="w-5 h-5 text-amber-600 m-auto" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-stone-900 text-xs">{item.product_name}</h4>
                                            <p className="text-[11px] text-stone-500 font-normal">{item.shop_name}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="font-semibold text-stone-900">{Number(item.promo_price).toLocaleString()} FCFA</span>
                                            <span className="text-[10px] text-stone-400 line-through font-normal">{Number(item.original_price).toLocaleString()} FCFA</span>
                                        </div>
                                        <span className="text-[10px] text-amber-800 font-medium">Fin le {new Date(item.end_date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SECTION 2: ZONE TOP PRODUITS PROMOTIONNELS LES PLUS VENDUS */}
                <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Top Produits Promotionnels les Plus Vendus</h2>
                        </div>
                        <span className="text-xs text-stone-400 font-normal">Best-sellers en solde</span>
                    </div>

                    {topSellingPromos.length === 0 ? (
                        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200/60 text-center text-xs text-stone-400 font-normal">
                            Les statistiques de vente des offres promotionnelles apparaîtront ici.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topSellingPromos.map((promo, idx) => (
                                <div key={idx} className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl space-y-3 hover:border-amber-400 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            🏆 Top #{idx + 1} Ventes
                                        </span>
                                        <span className="text-[10px] font-semibold text-amber-800">
                                            -{promo.discount_percentage}% Offerts
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-stone-900 text-xs">{promo.product_name}</h4>
                                        <p className="text-[11px] text-stone-400 font-normal">{promo.shop_name}</p>
                                    </div>

                                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                                        <div>
                                            <span className="text-[10px] text-stone-400 block font-normal">Prix Promotionnel</span>
                                            <span className="font-semibold text-stone-900">{Number(promo.promo_price).toLocaleString()} FCFA</span>
                                        </div>
                                        <Link 
                                            href={route('seller.smart_links.index')}
                                            className="px-3 py-1 bg-amber-500 text-amber-950 rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors shadow-xs flex items-center gap-1"
                                        >
                                            <span>Créer Lien</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Total Produits</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                <Boxes className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900 mt-2">{totalProducts}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">En Stock</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-emerald-600 mt-2">{inStockCount}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-amber-700">Stock Faible</span>
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-amber-700 mt-2">{lowStockCount}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-red-600">Ruptures</span>
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-red-600 mt-2">{outOfStockCount}</p>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white border border-stone-200/70 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, SKU ou boutique..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                                statusFilter === 'all'
                                    ? 'bg-amber-500 text-amber-950 shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            Tous ({totalProducts})
                        </button>
                        <button
                            onClick={() => setStatusFilter('in_stock')}
                            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                                statusFilter === 'in_stock'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            En Stock ({inStockCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('low')}
                            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                                statusFilter === 'low'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            Alertes ({lowStockCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('out')}
                            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                                statusFilter === 'out'
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                            Ruptures ({outOfStockCount})
                        </button>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-6 py-3.5">Produit & SKU</th>
                                    <th className="px-6 py-3.5">Boutique</th>
                                    <th className="px-6 py-3.5">Prix Unitaire</th>
                                    <th className="px-6 py-3.5">Statut Stock</th>
                                    <th className="px-6 py-3.5 text-center">Quantité & Ajustement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                                            <Boxes className="w-10 h-10 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
                                            <p className="font-medium text-stone-600">Aucun produit trouvé dans votre inventaire.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => {
                                        const currentStock = editedStocks[product.id] !== undefined 
                                            ? editedStocks[product.id] 
                                            : product.stock;

                                        const isModified = editedStocks[product.id] !== undefined;

                                        let statusBadge = (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-medium">
                                                En Stock
                                            </span>
                                        );

                                        if (currentStock === 0) {
                                            statusBadge = (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-[11px] font-medium">
                                                    Rupture
                                                </span>
                                            );
                                        } else if (currentStock <= product.alert_threshold) {
                                            statusBadge = (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-md text-[11px] font-medium">
                                                    Alerte ({product.alert_threshold})
                                                </span>
                                            );
                                        }

                                        return (
                                            <tr key={product.id} className={`hover:bg-stone-50/80 transition-colors ${isModified ? 'bg-amber-50/30' : ''}`}>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex-shrink-0 overflow-hidden">
                                                            {product.images && product.images[0] ? (
                                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                                                    <Boxes className="w-5 h-5 stroke-[1.5]" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-stone-900">{product.name}</p>
                                                            <p className="text-[11px] text-stone-400 font-mono">SKU: {product.sku || `PROD-${product.id}`}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-1.5 text-stone-600">
                                                        <Store className="w-3.5 h-3.5 text-stone-400" />
                                                        <span>{product.shop?.name || 'Boutique'}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-3.5 font-medium text-stone-900">
                                                    {Number(product.price).toLocaleString()} FCFA
                                                </td>

                                                <td className="px-6 py-3.5">
                                                    {statusBadge}
                                                </td>

                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStockChange(product.id, currentStock, -1)}
                                                            className="w-7 h-7 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors font-medium active:scale-95"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={currentStock}
                                                            onChange={(e) => handleStockInput(product.id, e.target.value)}
                                                            className={`w-14 text-center py-1 font-medium rounded-md border text-xs focus:ring-2 focus:ring-amber-500 outline-none ${
                                                                isModified 
                                                                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-semibold' 
                                                                    : 'bg-white border-stone-200 text-stone-900'
                                                            }`}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => handleStockChange(product.id, currentStock, 1)}
                                                            className="w-7 h-7 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors font-medium active:scale-95"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </SellerCentralLayout>
    );
}
