import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Lock, 
    Truck, 
    Phone, 
    User, 
    MapPin, 
    FileText, 
    Smartphone,
    ShoppingBag,
    ArrowRight,
    Store
} from 'lucide-react';

export default function FastCheckout({ smartLink, product, shop }) {
    const [paymentMethod, setPaymentMethod] = useState('orange_money');

    const items = smartLink.items || (product ? [{
        name: product.name,
        quantity: 1,
        unit_price: smartLink.price_at_time,
        total_price: smartLink.price_at_time,
        image_url: is_array(product.images) ? product.images[0] : null
    }] : []);

    const subtotal = smartLink.subtotal || smartLink.price_at_time;
    const discountAmount = smartLink.discount_amount || 0;
    const shippingFee = smartLink.shipping_fee || 0;
    const totalPrice = smartLink.total_price || smartLink.price_at_time;
    const shopName = shop?.name || smartLink.seller?.shops[0]?.name || 'Boutique Partenaire Sellify';

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        phone_number: '',
        delivery_address: '',
        city_neighborhood: '',
        delivery_notes: '',
        payment_method: paymentMethod,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('smartlink.pay', { token: smartLink.token }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-500/10 via-stone-50 to-stone-100 font-sans text-stone-800 pb-16">
            <Head title={`Paiement Sécurisé - ${smartLink.title || shopName}`} />

            {/* Header Shariow Style */}
            <header className="bg-white border-b border-stone-200/70 sticky top-0 z-30 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center font-bold text-amber-950 text-lg shadow-sm">
                            S
                        </div>
                        <div>
                            <span className="font-semibold text-stone-900 text-sm block">Sellify.me</span>
                            <span className="text-xs text-stone-500 font-normal flex items-center gap-1">
                                <Store className="w-3 h-3 text-amber-600" />
                                {shopName}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Paiement Escrow Garanti</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 pt-6 space-y-5">
                
                {/* Title Banner */}
                <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[11px] font-semibold uppercase tracking-wider">
                        Commande Express
                    </span>
                    <h1 className="text-xl font-semibold text-stone-900">
                        {smartLink.title || `Commande auprès de ${shopName}`}
                    </h1>
                    <p className="text-xs text-stone-500">
                        Renseignez vos coordonnées de livraison. Vos fonds restent protégés sur compte séquestre jusqu'à la réception de votre colis.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Order Items Breakdown */}
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Récapitulatif de votre Commande</h2>
                        </div>

                        <div className="divide-y divide-stone-100">
                            {items.map((item, idx) => (
                                <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center font-semibold text-amber-900 text-xs">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900 text-xs">{item.name}</p>
                                            {item.variant && <p className="text-[11px] text-stone-400">Variante: {item.variant}</p>}
                                        </div>
                                    </div>
                                    <span className="font-medium text-stone-900 text-xs">
                                        {Number(item.unit_price * item.quantity).toLocaleString()} FCFA
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price Details */}
                        <div className="bg-stone-50 p-3.5 rounded-xl space-y-2 text-xs font-normal text-stone-600 border border-stone-100">
                            <div className="flex justify-between">
                                <span>Sous-total articles</span>
                                <span className="font-medium text-stone-900">{Number(subtotal).toLocaleString()} FCFA</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Réduction accordée par le vendeur</span>
                                    <span className="font-medium">- {Number(discountAmount).toLocaleString()} FCFA</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Frais de livraison</span>
                                <span className="font-medium text-stone-900">{Number(shippingFee).toLocaleString()} FCFA</span>
                            </div>

                            <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-semibold text-stone-900">
                                <span>Total à payer</span>
                                <span className="text-amber-950 text-base">{Number(totalPrice).toLocaleString()} FCFA</span>
                            </div>
                        </div>

                        {smartLink.notes && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                                <span className="font-medium">Note du vendeur : </span>
                                {smartLink.notes}
                            </div>
                        )}
                    </div>

                    {/* Delivery Information Form */}
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <Truck className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Adresse & Contact pour la Livraison</h2>
                        </div>

                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-stone-400" />
                                    <span>Votre Nom Complet *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: Paul Biya"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                                {errors.customer_name && <p className="text-xs text-red-600 mt-1 font-normal">{errors.customer_name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                                        <span>Numéro de Téléphone (Mobile Money) *</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="ex: 690 12 34 56"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                    {errors.phone_number && <p className="text-xs text-red-600 mt-1 font-normal">{errors.phone_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                        <span>Ville / Quartier *</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Douala, Akwa Nord"
                                        value={data.city_neighborhood}
                                        onChange={(e) => setData('city_neighborhood', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                    {errors.city_neighborhood && <p className="text-xs text-red-600 mt-1 font-normal">{errors.city_neighborhood}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-stone-600 mb-1">
                                    Adresse Précise de Livraison *
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="ex: Rue Deido, Carrefour Camair, Immeuble à côté de la pharmacie"
                                    value={data.delivery_address}
                                    onChange={(e) => setData('delivery_address', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                                {errors.delivery_address && <p className="text-xs text-red-600 mt-1 font-normal">{errors.delivery_address}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-stone-400" />
                                    <span>Instructions pour le Livreur (Optionnel)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="ex: Appeler 10 minutes avant d'arriver."
                                    value={data.delivery_notes}
                                    onChange={(e) => setData('delivery_notes', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-normal text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <Smartphone className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Mode de Paiement Mobile Money</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                            <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                                paymentMethod === 'orange_money' 
                                    ? 'border-amber-500 bg-amber-50/40 shadow-sm' 
                                    : 'border-stone-200 bg-white hover:bg-stone-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="orange_money"
                                    checked={paymentMethod === 'orange_money'}
                                    onChange={() => {
                                        setPaymentMethod('orange_money');
                                        setData('payment_method', 'orange_money');
                                    }}
                                    className="sr-only"
                                />
                                <div className="w-9 h-9 bg-orange-500 text-white font-bold rounded-lg flex items-center justify-center text-xs">
                                    OM
                                </div>
                                <span className="font-medium text-stone-900 text-xs">Orange Money</span>
                            </label>

                            <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                                paymentMethod === 'mtn_momo' 
                                    ? 'border-amber-500 bg-amber-50/40 shadow-sm' 
                                    : 'border-stone-200 bg-white hover:bg-stone-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="mtn_momo"
                                    checked={paymentMethod === 'mtn_momo'}
                                    onChange={() => {
                                        setPaymentMethod('mtn_momo');
                                        setData('payment_method', 'mtn_momo');
                                    }}
                                    className="sr-only"
                                />
                                <div className="w-9 h-9 bg-yellow-400 text-yellow-950 font-bold rounded-lg flex items-center justify-center text-xs">
                                    MoMo
                                </div>
                                <span className="font-medium text-stone-900 text-xs">MTN MoMo</span>
                            </label>
                        </div>

                        {/* Escrow Guarantee Callout */}
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-emerald-900 space-y-0.5">
                                <p className="font-medium">Garantie Anti-Arnaque Sellify Escrow</p>
                                <p className="text-emerald-700 text-[11px]">Votre paiement est sécurisé. Le vendeur et le livreur ne seront payés qu'une fois votre colis bien reçu.</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Checkout Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-amber-950 font-medium text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>Payer {Number(totalPrice).toLocaleString()} FCFA & Obtenir le Suivi Colis</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

            </main>
        </div>
    );
}
