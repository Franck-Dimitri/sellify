import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    ShieldCheck, 
    CreditCard, 
    Truck, 
    Lock, 
    ArrowLeft, 
    Package, 
    CheckCircle2, 
    Store,
    Smartphone,
    Tag,
    X,
    Check
} from 'lucide-react';

export default function Index({ 
    items = [], 
    subtotal = 0, 
    discount = 0,
    appliedPromo = null,
    shippingFee = 1500, 
    grandTotal = 0,
    customerName = '',
    customerPhone = '',
    defaultDeliveryAddress = '',
    defaultCity = 'Douala'
}) {
    const [promoInput, setPromoInput] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
        delivery_address: defaultDeliveryAddress || '',
        city: defaultCity || 'Douala',
        payment_method: 'orange_money',
        save_default_address: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.checkout.process'));
    };

    const handleApplyPromo = (e) => {
        e.preventDefault();
        if (!promoInput.trim()) return;
        router.post(route('public.checkout.promo.apply'), { code: promoInput }, {
            preserveScroll: true,
            onSuccess: () => setPromoInput(''),
        });
    };

    const handleRemovePromo = () => {
        router.post(route('public.checkout.promo.remove'), {}, { preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title="Tunnel de Commande Sécurisé - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 font-sans text-stone-800 antialiased">
                
                {/* HEADER BANNER */}
                <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={route('public.cart.index')} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-stone-900 tracking-tight">Tunnel de Commande Escrow</h1>
                                <p className="text-xs text-stone-500 font-normal">
                                    Vos fonds restent sous séquestre jusqu'à la livraison effective & conforme
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                            <ShieldCheck className="w-4 h-4 text-yellow-600" />
                            <span>Garantie Acheteur Active</span>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN: CUSTOMER DETAILS & PAYMENT METHOD (7 COLS) */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Delivery Information Box */}
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-yellow-600" />
                                    <span>1. Informations de Livraison & Contact</span>
                                </h3>

                                <div className="space-y-3 text-xs font-normal">
                                    <div>
                                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Nom Complet :</label>
                                        <input 
                                            type="text"
                                            required
                                            placeholder="Ex: Franck Dimitri"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400 font-normal"
                                        />
                                        {errors.customer_name && <span className="text-red-500 text-[10px]">{errors.customer_name}</span>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-stone-700 mb-1">Numéro Téléphone (Pour Code OTP SMS) :</label>
                                            <input 
                                                type="tel"
                                                required
                                                placeholder="Ex: 699000000"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400 font-normal"
                                            />
                                            {errors.customer_phone && <span className="text-red-500 text-[10px]">{errors.customer_phone}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-medium text-stone-700 mb-1">Ville de Livraison :</label>
                                            <select
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400 font-normal"
                                            >
                                                <option value="Douala">Douala</option>
                                                <option value="Yaoundé">Yaoundé</option>
                                                <option value="Bafoussam">Bafoussam</option>
                                                <option value="Bamenda">Bamenda</option>
                                                <option value="Garoua">Garoua</option>
                                                <option value="Maroua">Maroua</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Adresse Précise de Livraison :</label>
                                        <textarea 
                                            required
                                            rows="2"
                                            placeholder="Ex: Akwa, Rue Silo, Immeuble à côté de la pharmacie"
                                            value={data.delivery_address}
                                            onChange={(e) => setData('delivery_address', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400 font-normal"
                                        ></textarea>
                                        {errors.delivery_address && <span className="text-red-500 text-[10px]">{errors.delivery_address}</span>}
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="save_default_address"
                                            checked={data.save_default_address}
                                            onChange={(e) => setData('save_default_address', e.target.checked)}
                                            className="w-4 h-4 rounded border-stone-300 text-yellow-500 focus:ring-yellow-400"
                                        />
                                        <label htmlFor="save_default_address" className="text-[11px] text-stone-600">
                                            Définir comme adresse de livraison par défaut pour mes prochaines commandes
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selection Box */}
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-yellow-600" />
                                    <span>2. Mode de Paiement Mobile Money</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setData('payment_method', 'orange_money')}
                                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                            data.payment_method === 'orange_money'
                                                ? 'bg-yellow-50 border-yellow-400 font-bold text-yellow-950 shadow-2xs'
                                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                        }`}
                                    >
                                        <Smartphone className="w-5 h-5 text-yellow-600 shrink-0" />
                                        <div>
                                            <span className="block font-bold">Orange Money</span>
                                            <span className="text-[10px] text-stone-400 font-normal">Paiement Mobile Cameroun</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('payment_method', 'mtn_momo')}
                                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                            data.payment_method === 'mtn_momo'
                                                ? 'bg-yellow-50 border-yellow-400 font-bold text-yellow-950 shadow-2xs'
                                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                        }`}
                                    >
                                        <Smartphone className="w-5 h-5 text-yellow-500 shrink-0" />
                                        <div>
                                            <span className="block font-bold">MTN MoMo</span>
                                            <span className="text-[10px] text-stone-400 font-normal">Mobile Money MTN</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: ORDER SUMMARY & PROMO & SUBMIT (5 COLS) */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                                    Articles à Commander ({items.length})
                                </h3>

                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-stone-50 rounded-lg border border-stone-100">
                                            <div>
                                                <span className="font-semibold text-stone-900 block truncate max-w-xs">{item.name}</span>
                                                <span className="text-[10px] text-stone-400">{item.quantity} x {Number(item.unit_price).toLocaleString()} FCFA</span>
                                            </div>
                                            <span className="font-bold text-stone-900">{Number(item.subtotal).toLocaleString()} FCFA</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Promo Code Box */}
                                <div className="pt-3 border-t border-stone-100">
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-yellow-600" />
                                        <span>Code Promo Vendeur</span>
                                    </label>
                                    
                                    {appliedPromo ? (
                                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-xl text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                                <span className="font-semibold">Code "{appliedPromo.code}" appliqué</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemovePromo}
                                                className="text-stone-400 hover:text-rose-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Ex: SELLIFY10"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400 uppercase font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
                                            >
                                                Appliquer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-xs font-normal text-stone-600 border-t border-stone-100 pt-3">
                                    <div className="flex justify-between">
                                        <span>Sous-total :</span>
                                        <strong className="text-stone-900">{Number(subtotal).toLocaleString()} FCFA</strong>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-semibold">
                                            <span>Réduction Promo :</span>
                                            <span>-{Number(discount).toLocaleString()} FCFA</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Frais de livraison :</span>
                                        <strong className="text-stone-900">{Number(shippingFee).toLocaleString()} FCFA</strong>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-sm font-bold text-stone-900">
                                    <span>Total Général :</span>
                                    <span className="text-base text-yellow-700">{Number(grandTotal).toLocaleString()} FCFA</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-yellow-500 mt-2"
                                >
                                    <ShieldCheck className="w-4 h-4 text-yellow-950" />
                                    <span>{processing ? 'Validation en cours...' : `Confirmer & Payer ${Number(grandTotal).toLocaleString()} FCFA via Escrow`}</span>
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

            </div>
        </PublicLayout>
    );
}
