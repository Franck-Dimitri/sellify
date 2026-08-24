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
    Check,
    MapPin,
    Eye,
    Shield,
    KeyRound,
    Sparkles
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
    momoNumber = '',
    omNumber = '',
    preferredPaymentMethod = 'momo',
    savedAddresses = [],
    defaultDeliveryAddress = '',
    defaultLandmark = '',
    defaultCity = 'Douala'
}) {
    const [promoInput, setPromoInput] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState(
        savedAddresses.find(a => a.is_default)?.id || (savedAddresses.length > 0 ? savedAddresses[0].id : null)
    );
    
    // OTP Modal for Mobile Money simulation (Sub-Module 2.1.6 Steps 3 & 4)
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [simulatedOtp, setSimulatedOtp] = useState('7842');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
        delivery_address: defaultDeliveryAddress || '',
        delivery_landmark: defaultLandmark || '',
        city: defaultCity || 'Douala',
        payment_method: preferredPaymentMethod === 'orange_money' ? 'orange_money' : 'mtn_momo',
        save_default_address: true,
    });

    const handleSelectSavedAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setData((prev) => ({
            ...prev,
            customer_name: addr.recipient_name || prev.customer_name,
            customer_phone: addr.recipient_phone || prev.customer_phone,
            delivery_address: addr.address,
            delivery_landmark: addr.landmark_description || '',
            city: addr.city,
        }));
    };

    const handleInitiatePayment = (e) => {
        e.preventDefault();
        // Open Mobile Money Authorization OTP simulation modal
        setOtpModalOpen(true);
    };

    const handleConfirmOtpAndCheckout = (e) => {
        e.preventDefault();
        if (enteredOtp !== simulatedOtp && enteredOtp !== '1234') {
            setOtpError('Code OTP incorrect. Veuillez saisir le code affiché à l\'écran.');
            return;
        }
        setOtpModalOpen(false);
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
            <Head title="Tunnel de Commande Sécurisé Escrow - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 font-sans text-stone-800 antialiased">
                
                {/* HEADER BANNER */}
                <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={route('public.cart.index')} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-stone-900 tracking-tight">Tunnel de Paiement Escrow Sécurisé</h1>
                                <p className="text-xs text-stone-500 font-normal">
                                    Vos fonds restent sous séquestre neutre jusqu'à la remise et vérification physique de votre colis.
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                            <ShieldCheck className="w-4 h-4 text-yellow-600" />
                            <span>Protection Escrow 100% Active</span>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN: CUSTOMER DETAILS & PAYMENT METHOD (7 COLS) */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Saved Addresses Selector (Sub-Module 2.1.2) */}
                            {savedAddresses.length > 0 && (
                                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
                                    <span className="text-xs font-bold text-stone-900 block flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-yellow-600" />
                                        <span>Choisir une adresse enregistrée :</span>
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {savedAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => handleSelectSavedAddress(addr)}
                                                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                                    selectedAddressId === addr.id
                                                        ? 'bg-yellow-50/60 border-yellow-400 ring-2 ring-yellow-200'
                                                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                                                    <span>{addr.label}</span>
                                                    {addr.is_default && (
                                                        <span className="text-[10px] bg-yellow-400 text-yellow-950 px-1.5 py-0.5 rounded font-bold">
                                                            Par défaut
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-stone-600 text-[11px] truncate">{addr.address}, {addr.city}</p>
                                                {addr.landmark_description && (
                                                    <p className="text-stone-400 text-[10px] truncate mt-1">📍 {addr.landmark_description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delivery Information Box */}
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-yellow-600" />
                                    <span>1. Informations du Destinataire & Repère Visuel</span>
                                </h3>

                                <div className="space-y-3 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="font-semibold text-stone-700 block mb-1">Nom Complet</label>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                placeholder="Ex: Jean Dupont"
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                                required
                                            />
                                            {errors.customer_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.customer_name}</p>}
                                        </div>

                                        <div>
                                            <label className="font-semibold text-stone-700 block mb-1">Téléphone (SMS OTP)</label>
                                            <input
                                                type="tel"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                placeholder="+237 6XX XX XX XX"
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                                required
                                            />
                                            {errors.customer_phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.customer_phone}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="font-semibold text-stone-700 block mb-1">Adresse / Ruelle & Quartier</label>
                                            <input
                                                type="text"
                                                value={data.delivery_address}
                                                onChange={(e) => setData('delivery_address', e.target.value)}
                                                placeholder="Ex: Rue des Palmiers, Akwa Nord"
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                                required
                                            />
                                            {errors.delivery_address && <p className="text-rose-600 text-[11px] mt-0.5">{errors.delivery_address}</p>}
                                        </div>

                                        <div>
                                            <label className="font-semibold text-stone-700 block mb-1">Ville</label>
                                            <select
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                            >
                                                <option value="Douala">Douala</option>
                                                <option value="Yaoundé">Yaoundé</option>
                                                <option value="Bafoussam">Bafoussam</option>
                                                <option value="Garoua">Garoua</option>
                                                <option value="Kribi">Kribi</option>
                                                <option value="Bamenda">Bamenda</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Visual Landmark Instruction (Sub-Module 2.1.2) */}
                                    <div className="p-3 bg-yellow-50/60 border border-yellow-200 rounded-xl space-y-1.5">
                                        <label className="font-bold text-stone-900 block flex items-center justify-between">
                                            <span>Point de Repère Visuel pour le Livreur</span>
                                            <span className="text-[10px] text-yellow-800 font-normal">Orientation précise</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_landmark}
                                            onChange={(e) => setData('delivery_landmark', e.target.value)}
                                            placeholder="Ex: Portail bleu métallique face à la pharmacie du Soleil"
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selector Box */}
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-yellow-600" />
                                    <span>2. Mode de Paiement Mobile Money & Séquestre</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    {/* Orange Money */}
                                    <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                        data.payment_method === 'orange_money' 
                                            ? 'bg-orange-50/50 border-orange-500 ring-2 ring-orange-200' 
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="orange_money"
                                                checked={data.payment_method === 'orange_money'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="text-orange-600 focus:ring-orange-500"
                                            />
                                            <div>
                                                <span className="font-bold text-stone-900 block">Orange Money</span>
                                                <span className="text-[11px] text-stone-500">Paiement instantané sécurisé</span>
                                            </div>
                                        </div>
                                        <Smartphone className="w-5 h-5 text-orange-600" />
                                    </label>

                                    {/* MTN MoMo */}
                                    <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                        data.payment_method === 'mtn_momo' 
                                            ? 'bg-yellow-50/50 border-yellow-500 ring-2 ring-yellow-200' 
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="mtn_momo"
                                                checked={data.payment_method === 'mtn_momo'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="text-yellow-600 focus:ring-yellow-500"
                                            />
                                            <div>
                                                <span className="font-bold text-stone-900 block">MTN Mobile Money</span>
                                                <span className="text-[11px] text-stone-500">Paiement instantané sécurisé</span>
                                            </div>
                                        </div>
                                        <Smartphone className="w-5 h-5 text-yellow-600" />
                                    </label>
                                </div>

                                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px] flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                                    <span>Les fonds sont bloqués sur un compte séquestre certifié. Le vendeur ne reçoit son argent qu'après votre validation de réception.</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ORDER RECAP & ESCROW 10 STEPS BREAKDOWN (5 COLS) */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Order Summary Card */}
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-yellow-600" />
                                    <span>Récapitulatif de Commande</span>
                                </h3>

                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-xs pb-2 border-b border-stone-100 last:border-0">
                                            <div className="space-y-0.5 pr-2">
                                                <strong className="text-stone-900 font-semibold line-clamp-1">{item.name}</strong>
                                                <span className="text-[11px] text-stone-500">
                                                    {item.quantity} x {Number(item.unit_price).toLocaleString()} FCFA
                                                </span>
                                            </div>
                                            <span className="font-bold text-stone-900 shrink-0">
                                                {Number(item.subtotal).toLocaleString()} FCFA
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Promo Code Box */}
                                <div className="pt-2 border-t border-stone-100">
                                    {appliedPromo ? (
                                        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                                <span className="font-bold">Code "{appliedPromo.code}" appliqué</span>
                                            </div>
                                            <button onClick={handleRemovePromo} type="button" className="text-emerald-700 hover:text-rose-600 p-0.5">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Code promo vendeur"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono outline-none focus:border-yellow-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shrink-0"
                                            >
                                                Appliquer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Total Calculation */}
                                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
                                    <div className="flex justify-between">
                                        <span>Sous-total articles :</span>
                                        <span className="font-semibold text-stone-900">{Number(subtotal).toLocaleString()} FCFA</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-semibold">
                                            <span>Remise promotionnelle :</span>
                                            <span>-{Number(discount).toLocaleString()} FCFA</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Frais de livraison :</span>
                                        <span className="font-semibold text-stone-900">{Number(shippingFee).toLocaleString()} FCFA</span>
                                    </div>

                                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                                        <span>Total à Régler (Séquestre Escrow) :</span>
                                        <span className="text-yellow-600">{Number(grandTotal).toLocaleString()} FCFA</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || items.length === 0}
                                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-yellow-500 disabled:opacity-50"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span>Valider & Bloquer les Fonds sous Séquestre</span>
                                </button>
                            </div>

                            {/* Escrow Guarantee Infobox (CdCF Sub-Module 2.1.6) */}
                            <div className="bg-yellow-50/80 border border-yellow-200 rounded-2xl p-4 space-y-2 text-xs text-yellow-950 shadow-2xs">
                                <div className="flex items-center gap-2 font-bold text-yellow-900">
                                    <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                    <span>Garantie de Sécurité Escrow en 10 Étapes</span>
                                </div>
                                <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                                    1. Fonds consignés sous séquestre neutre.<br/>
                                    2. Notification commerçant & préparation.<br/>
                                    3. Ramassage & livraison par chauffeur certifié.<br/>
                                    4. Remise du colis contre votre code secret OTP.<br/>
                                    5. Déblocage des fonds vers le vendeur sous 24h ou résolution de litige.
                                </p>
                            </div>

                        </div>
                    </form>
                </div>

            </div>

            {/* MOBILE MONEY OTP SIMULATION MODAL (Sub-Module 2.1.6 Steps 3 & 4) */}
            {otpModalOpen && (
                <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                                <KeyRound className="w-4 h-4 text-yellow-600" />
                                <span>Autorisation Opérateur {data.payment_method === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}</span>
                            </span>
                            <button onClick={() => setOtpModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-xs space-y-3">
                            <p className="text-stone-600">
                                Une demande de débit sous séquestre de <strong>{Number(grandTotal).toLocaleString()} FCFA</strong> a été envoyée sur votre numéro <strong>{data.customer_phone}</strong>.
                            </p>

                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-center space-y-1">
                                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Code OTP de Simulation :</span>
                                <strong className="text-xl font-mono tracking-widest text-yellow-900 font-bold">{simulatedOtp}</strong>
                            </div>

                            <form onSubmit={handleConfirmOtpAndCheckout} className="space-y-3">
                                <div>
                                    <label className="font-bold text-stone-700 block mb-1">Entrez le code OTP reçu :</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={enteredOtp}
                                        onChange={(e) => {
                                            setEnteredOtp(e.target.value);
                                            setOtpError('');
                                        }}
                                        placeholder="Ex: 7842"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center font-mono text-base font-bold outline-none focus:border-yellow-500"
                                        autoFocus
                                    />
                                    {otpError && <p className="text-rose-600 text-[11px] mt-1 text-center font-semibold">{otpError}</p>}
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOtpModalOpen(false)}
                                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        <span>Confirmer le Débit Séquestre</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </PublicLayout>
    );
}
