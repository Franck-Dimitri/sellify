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
    CheckCircle2,
    MessageCircle,
    Send
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

    const subtotal = selectedProducts.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    const totalPrice = Math.max(0, subtotal - parseFloat(discountAmount || 0) + parseFloat(shippingFee || 0));

    const totalLinks = smartLinks.length;
    const totalClicks = smartLinks.reduce((acc, link) => acc + (link.clicks_count || 0), 0);
    const totalConversions = smartLinks.reduce((acc, link) => acc + (link.conversions_count || 0), 0);
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
            onFinish: () => {
                setSubmitting(false);
                setTitle('');
                setDiscountAmount(0);
                setShippingFee(0);
                setNotes('');
            }
        });
    };

    const handleCopy = (token) => {
        const fullUrl = `${baseUrl}${token}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2500);
    };

    return (
        <SellerCentralLayout title="Smart-Links (Réseaux Sociaux)">
            <Head title="Smart-Links - Vente Sociale Sellify" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-yellow-700 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Vente Directe & Social Commerce</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Smart-Links de Paiement Escrow
                        </h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Créez des liens de paiement instantanés avec séquestre Mobile Money à envoyer directement par WhatsApp, Instagram, TikTok et Facebook.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-lg text-xs font-medium flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5 text-yellow-600" />
                            <span>{totalLinks} lien(s) actif(s)</span>
                        </div>
                    </div>
                </div>

                {/* Performance Analytics Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Total Liens Générés</p>
                        <p className="text-xl font-semibold text-stone-900 mt-1">{totalLinks}</p>
                    </div>
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Clics Reçus</p>
                        <p className="text-xl font-semibold text-blue-600 mt-1">{totalClicks}</p>
                    </div>
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Ventes Conclues</p>
                        <p className="text-xl font-semibold text-emerald-600 mt-1">{totalConversions}</p>
                    </div>
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Taux de Conversion</p>
                        <p className="text-xl font-semibold text-yellow-600 mt-1">{conversionRate}%</p>
                    </div>
                </div>

                {/* Main 2-column Grid: Form vs Recent Links */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Left Column: Creator Form */}
                    <div className="lg:col-span-7 bg-white border border-stone-200 p-5 rounded-xl shadow-xs space-y-4">
                        <div className="border-b border-stone-100 pb-3">
                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-yellow-600" />
                                <span>Générateur de Smart-Link Personnalisé</span>
                            </h2>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Composez un panier sur-mesure pour votre client WhatsApp.
                            </p>
                        </div>

                        <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
                            {/* Title */}
                            <div>
                                <label className="block font-medium text-stone-700 mb-1">
                                    Titre / Référence du lien
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Lot 2 Robes Soirée + Sacoche (Client WhatsApp Eric)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:border-yellow-500 focus:bg-white outline-none"
                                />
                            </div>

                            {/* Product Rows */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="font-medium text-stone-700">Articles inclus dans le lien</label>
                                    <button
                                        type="button"
                                        onClick={handleAddProductRow}
                                        className="text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span>Ajouter un autre article</span>
                                    </button>
                                </div>

                                {selectedProducts.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-medium text-stone-500">Article #{idx + 1}</span>
                                            {selectedProducts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProductRow(idx)}
                                                    className="text-stone-400 hover:text-rose-600"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                            <div className="sm:col-span-6">
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) => handleProductSelectChange(idx, e.target.value)}
                                                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-stone-800 outline-none focus:border-yellow-500"
                                                >
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({Number(p.price).toLocaleString()} FCFA)</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="sm:col-span-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                                    placeholder="Qté"
                                                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-stone-800 text-center outline-none focus:border-yellow-500"
                                                />
                                            </div>
                                            <div className="sm:col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleUnitPriceChange(idx, e.target.value)}
                                                    placeholder="Prix unit."
                                                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-stone-800 text-right outline-none focus:border-yellow-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Discount & Shipping */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Remise spéciale (FCFA)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discountAmount}
                                        onChange={(e) => setDiscountAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 outline-none focus:border-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Frais de livraison (FCFA)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={shippingFee}
                                        onChange={(e) => setShippingFee(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 outline-none focus:border-yellow-500"
                                    />
                                </div>
                            </div>

                            {/* Summary & Submit */}
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-stone-500 text-[11px]">Total à payer par le client :</span>
                                    <p className="text-lg font-semibold text-stone-950">{totalPrice.toLocaleString('fr-FR')} FCFA</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>{submitting ? 'Génération...' : 'Générer Smart-Link'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Existing Smart-Links List */}
                    <div className="lg:col-span-5 space-y-3.5">
                        <h2 className="text-sm font-semibold text-stone-900">Vos Smart-Links Récents ({smartLinks.length})</h2>

                        {smartLinks.length > 0 ? (
                            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                                {smartLinks.map((link) => {
                                    const shareUrl = `${baseUrl}${link.token}`;
                                    const displayTitle = link.title || link.product?.name || 'Commande Sellify';
                                    const shareTextWhatsApp = encodeURIComponent(`Bonjour ! Voici votre lien de commande sécurisé Sellify avec paiement Escrow Mobile Money (${displayTitle}) : ${shareUrl}`);
                                    const shareUrlWhatsApp = `https://api.whatsapp.com/send?text=${shareTextWhatsApp}`;
                                    const shareUrlFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

                                    return (
                                        <div key={link.id} className="bg-white border border-stone-200 p-4 rounded-xl space-y-3 shadow-xs">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-semibold text-xs text-stone-900">{displayTitle}</p>
                                                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">{link.tracking_code}</p>
                                                </div>
                                                <span className="text-xs font-semibold text-stone-900">
                                                    {Number(link.total_price || link.price_at_time).toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </div>

                                            <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between text-[11px] text-stone-600 font-mono truncate">
                                                <span className="truncate">{shareUrl}</span>
                                                <button
                                                    onClick={() => handleCopy(link.token)}
                                                    className="ml-2 px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded border border-stone-200 font-sans text-xs flex items-center gap-1 shrink-0"
                                                >
                                                    {copiedToken === link.token ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                    <span>{copiedToken === link.token ? 'Copié !' : 'Copier'}</span>
                                                </button>
                                            </div>

                                            {/* Social Sharing Quick Buttons */}
                                            <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                                                <a
                                                    href={shareUrlWhatsApp}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    <span>Partager WhatsApp</span>
                                                </a>

                                                <a
                                                    href={shareUrlFacebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                    <span>Partager Facebook</span>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white border border-stone-200 p-8 rounded-xl text-center text-stone-400 space-y-2">
                                <Link2 className="w-8 h-8 text-stone-300 mx-auto mb-1" />
                                <p className="text-xs font-medium text-stone-700">Aucun Smart-Link actif</p>
                                <p className="text-[11px] text-stone-400">Remplissez le formulaire à gauche pour créer votre premier lien.</p>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </SellerCentralLayout>
    );
}
