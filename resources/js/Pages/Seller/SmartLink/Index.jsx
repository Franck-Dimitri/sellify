import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Link2, 
    Plus, 
    Trash2, 
    Copy, 
    Share2, 
    Check, 
    Sparkles, 
    Clock, 
    Tag, 
    Truck, 
    FileText, 
    ExternalLink,
    TrendingUp,
    MousePointerClick,
    CheckCircle2
} from 'lucide-react';

export default function Index({ smartLinks = [], products = [], baseUrl = '' }) {
    const [copiedToken, setCopiedToken] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Multi-item form state
    const [selectedProducts, setSelectedProducts] = useState([
        { 
            product_id: products[0]?.id || '', 
            quantity: 1, 
            unit_price: products[0]?.price || 0, 
            name: products[0]?.name || '' 
        }
    ]);
    const [title, setTitle] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [notes, setNotes] = useState('');
    const [validityHours, setValidityHours] = useState(48);

    const handleAddProductRow = () => {
        if (products.length === 0) return;
        const defaultProd = products[0];
        setSelectedProducts(prev => [
            ...prev,
            { product_id: defaultProd.id, quantity: 1, unit_price: defaultProd.price, name: defaultProd.name }
        ]);
    };

    const handleRemoveProductRow = (index) => {
        if (selectedProducts.length <= 1) return;
        setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    };

    const handleProductSelectChange = (index, productId) => {
        const prod = products.find(p => p.id === parseInt(productId));
        if (!prod) return;
        setSelectedProducts(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                product_id: prod.id,
                unit_price: prod.price,
                name: prod.name
            };
            return updated;
        });
    };

    const handleQuantityChange = (index, qty) => {
        const num = Math.max(1, parseInt(qty) || 1);
        setSelectedProducts(prev => {
            const updated = [...prev];
            updated[index].quantity = num;
            return updated;
        });
    };

    const handleUnitPriceChange = (index, price) => {
        const num = Math.max(0, parseFloat(price) || 0);
        setSelectedProducts(prev => {
            const updated = [...prev];
            updated[index].unit_price = num;
            return updated;
        });
    };

    // Calculate totals for link creator
    const subtotal = selectedProducts.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    const totalPrice = Math.max(0, subtotal - parseFloat(discountAmount || 0) + parseFloat(shippingFee || 0));

    // Calculate overall statistics across all smart links
    const totalLinks = smartLinks.length;
    const totalClicks = smartLinks.reduce((acc, link) => acc + (link.clicks_count || 0), 0);
    const totalConversions = smartLinks.reduce((acc, link) => acc + (link.conversions_count || 0), 0);
    const totalRevenue = smartLinks
        .filter(link => link.status === 'paid' || link.conversions_count > 0)
        .reduce((acc, link) => acc + (parseFloat(link.total_price || link.price_at_time) * (link.conversions_count || 1)), 0);
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

    const handleCreateLink = (e) => {
        e.preventDefault();
        
        if (selectedProducts.length === 0 || !selectedProducts[0].product_id) {
            alert('Veuillez choisir au moins un produit.');
            return;
        }

        setSubmitting(true);

        const payload = {
            title: title || `Commande #${Math.floor(1000 + Math.random() * 9000)}`,
            items: selectedProducts,
            discount_amount: parseFloat(discountAmount || 0),
            shipping_fee: parseFloat(shippingFee || 0),
            notes: notes,
            validity_hours: parseInt(validityHours),
            product_id: selectedProducts[0]?.product_id
        };

        router.post(route('seller.smart_links.store'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setTitle('');
                setDiscountAmount(0);
                setShippingFee(0);
                setNotes('');
                if (products[0]) {
                    setSelectedProducts([{ product_id: products[0].id, quantity: 1, unit_price: products[0].price, name: products[0].name }]);
                }
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    const handleCopy = (token) => {
        const url = `${baseUrl}${token}`;
        navigator.clipboard.writeText(url);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2500);
    };

    const handleShareWhatsapp = (token, linkTitle) => {
        const url = `${baseUrl}${token}`;
        const message = `Bonjour ! Voici votre lien de paiement sécurisé sur Sellify pour "${linkTitle || 'votre commande'}" : ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <SellerCentralLayout title="Smart-Link Studio (Vente Sociale)">
            <Head title="Smart-Links Multi-Produits - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Shariow Human Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>Social Commerce & Fast Checkout</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Générateur de Smart-Links Multi-Produits
                        </h1>
                        <p className="text-xs text-stone-600">
                            Créez un lien de paiement pour vos clients sur WhatsApp & Réseaux Sociaux avec plusieurs articles et réductions.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1.5 bg-amber-500/20 text-amber-900 font-medium rounded-xl text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-700" />
                            <span>Compte Séquestre Escrow</span>
                        </div>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Liens Générés</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                                <Link2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900 mt-2">{totalLinks}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Total Clics</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <MousePointerClick className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900 mt-2">{totalClicks.toLocaleString()}</p>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Ventes & Taux</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-xl font-semibold text-emerald-600">{totalConversions}</span>
                            <span className="text-xs font-medium text-stone-500">({conversionRate}%)</span>
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/70 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Revenu Généré</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-stone-900 mt-2">{totalRevenue.toLocaleString()} FCFA</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Panel: Link Creator Studio */}
                    <div className="lg:col-span-7 bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-medium">
                                    <Link2 className="w-4 h-4" />
                                </div>
                                <h2 className="font-semibold text-stone-900 text-sm">Configurer une nouvelle commande</h2>
                            </div>
                        </div>

                        <form onSubmit={handleCreateLink} className="space-y-5">
                            
                            {/* Order Title */}
                            <div>
                                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                                    Titre ou Référence de la Commande
                                </label>
                                <input
                                    type="text"
                                    placeholder="ex: Pack Accessoires Client #SL-928"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            {/* Products Selector List */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-medium text-stone-600">
                                        Produits inclus ({selectedProducts.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddProductRow}
                                        className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Ajouter un produit</span>
                                    </button>
                                </div>

                                {selectedProducts.map((item, idx) => (
                                    <div key={idx} className="p-3.5 bg-stone-50 border border-stone-200/60 rounded-xl space-y-2.5">
                                        <div className="flex items-center justify-between text-xs text-stone-500">
                                            <span>Article #{idx + 1}</span>
                                            {selectedProducts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProductRow(idx)}
                                                    className="text-stone-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                                            {/* Select Product */}
                                            <div className="md:col-span-6">
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) => handleProductSelectChange(idx, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-normal text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none"
                                                >
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name} ({Number(p.price).toLocaleString()} FCFA)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-normal text-center text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none"
                                                    placeholder="Qté"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div className="md:col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleUnitPriceChange(idx, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-normal text-right text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none"
                                                    placeholder="Prix (FCFA)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Advanced Pricing Config (Discounts & Shipping) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Réduction Globale (FCFA)</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discountAmount}
                                        onChange={(e) => setDiscountAmount(e.target.value)}
                                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Frais de Livraison (FCFA)</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={shippingFee}
                                        onChange={(e) => setShippingFee(e.target.value)}
                                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Validity & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                                <div className="md:col-span-5">
                                    <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Durée de Validité</span>
                                    </label>
                                    <select
                                        value={validityHours}
                                        onChange={(e) => setValidityHours(e.target.value)}
                                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-800 focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value={24}>24 Heures</option>
                                        <option value={48}>48 Heures (Recommandé)</option>
                                        <option value={72}>72 Heures</option>
                                        <option value={168}>7 Jours</option>
                                    </select>
                                </div>

                                <div className="md:col-span-7">
                                    <label className="block text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Instructions au client (Optionnel)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ex: Merci de préciser la couleur souhaitée lors de la livraison."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Summary Card & Generate Button */}
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs text-stone-600">Montant total du lien</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-semibold text-stone-900">{totalPrice.toLocaleString()} FCFA</span>
                                        {discountAmount > 0 && (
                                            <span className="text-xs text-stone-400 line-through">
                                                {(subtotal + parseFloat(shippingFee || 0)).toLocaleString()} FCFA
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full md:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-amber-950 font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>{submitting ? 'Génération...' : 'Générer le Smart-Link'}</span>
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Right Panel: Smart-Links List & Share Actions */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="px-1">
                            <h3 className="font-semibold text-stone-900 text-sm">Vos Smart-Links récents ({smartLinks.length})</h3>
                        </div>

                        {smartLinks.length === 0 ? (
                            <div className="bg-white border border-stone-200/70 rounded-2xl p-8 text-center text-stone-400 space-y-3">
                                <Link2 className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                                <p className="font-medium text-stone-600 text-xs">Aucun Smart-Link généré pour l'instant.</p>
                                <p className="text-xs text-stone-400">Configurez une commande à gauche pour obtenir un lien à partager.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                {smartLinks.map(link => {
                                    const isCopied = copiedToken === link.token;
                                    const itemsList = link.items || (link.product ? [{ name: link.product.name, quantity: 1, unit_price: link.price_at_time }] : []);
                                    const displayTitle = link.title || (link.product ? link.product.name : 'Commande');

                                    return (
                                        <div key={link.id} className="bg-white border border-stone-200/70 rounded-xl p-4 shadow-sm space-y-3 hover:border-amber-400 transition-colors">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                                        link.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        link.status === 'paid' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                                        'bg-stone-100 text-stone-500'
                                                    }`}>
                                                        {link.status === 'active' ? 'Actif' : link.status === 'paid' ? 'Payé' : link.status}
                                                    </span>
                                                    <h4 className="font-medium text-stone-900 text-xs mt-1">{displayTitle}</h4>
                                                    <p className="text-[11px] text-stone-400">{itemsList.length} article(s)</p>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-sm font-semibold text-stone-900">
                                                        {Number(link.total_price || link.price_at_time).toLocaleString()} FCFA
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[11px] text-stone-400 justify-end mt-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <MousePointerClick className="w-3 h-3 text-stone-400" />
                                                            {link.clicks_count}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                            {link.conversions_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Itemized preview */}
                                            <div className="bg-stone-50 p-2.5 rounded-lg text-xs text-stone-600 space-y-1">
                                                {itemsList.slice(0, 2).map((it, idx) => (
                                                    <div key={idx} className="flex justify-between font-normal">
                                                        <span>• {it.quantity}x {it.name}</span>
                                                        <span className="font-medium text-stone-800">{Number(it.unit_price * it.quantity).toLocaleString()} FCFA</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <button
                                                    onClick={() => handleCopy(link.token)}
                                                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                                                        isCopied 
                                                            ? 'bg-emerald-600 text-white' 
                                                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                                    }`}
                                                >
                                                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                    <span>{isCopied ? 'Copié !' : 'Copier'}</span>
                                                </button>

                                                <button
                                                    onClick={() => handleShareWhatsapp(link.token, displayTitle)}
                                                    className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-emerald-200"
                                                >
                                                    <Share2 className="w-3.5 h-3.5" />
                                                    <span>WhatsApp</span>
                                                </button>

                                                <a
                                                    href={`${baseUrl}${link.token}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors"
                                                    title="Ouvrir le lien"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </SellerCentralLayout>
    );
}
