import React, { useState, useEffect, useRef } from 'react';
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
    Sparkles,
    Loader2,
    AlertCircle,
    ExternalLink,
    RefreshCw,
    Radio
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
    defaultCity = 'Douala',
    hrpayConfig = {
        mode: 'live',
        isLive: true,
        isConfigured: false,
        country: 'CM',
        currency: 'XAF'
    }
}) {
    const [promoInput, setPromoInput] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState(
        savedAddresses.find(a => a.is_default)?.id || (savedAddresses.length > 0 ? savedAddresses[0].id : null)
    );
    
    // Gateway State
    const [gatewayModalOpen, setGatewayModalOpen] = useState(false);
    const [gatewayStage, setGatewayStage] = useState('idle'); // 'idle' | 'initiating' | 'pending' | 'success' | 'failed'
    const [paymentReference, setPaymentReference] = useState('');
    const [gatewayMessage, setGatewayMessage] = useState('');
    const [paymentCardUrl, setPaymentCardUrl] = useState('');
    const [orderRedirectUrl, setOrderRedirectUrl] = useState('');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const pollingIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);

    const initialMethod = preferredPaymentMethod === 'orange_money' ? 'orange_money' : 'mtn_momo';

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
        payment_phone: customerPhone || '',
        delivery_address: defaultDeliveryAddress || '',
        delivery_landmark: defaultLandmark || '',
        city: defaultCity || 'Douala',
        payment_method: initialMethod,
        save_default_address: true,
    });

    // Clean up timers on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    const handleSelectSavedAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setData((prev) => ({
            ...prev,
            customer_name: addr.recipient_name || prev.customer_name,
            customer_phone: addr.recipient_phone || prev.customer_phone,
            payment_phone: prev.payment_phone || addr.recipient_phone,
            delivery_address: addr.address,
            delivery_landmark: addr.landmark_description || '',
            city: addr.city,
        }));
    };

    // Initiate payment through HR-Skills Pay API
    const handleInitiatePayment = async (e) => {
        e.preventDefault();
        clearErrors();

        // Basic validation
        if (!data.customer_name || !data.customer_phone || !data.delivery_address || !data.city) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setGatewayModalOpen(true);
        setGatewayStage('initiating');
        setGatewayMessage('Initialisation sécurisée auprès de HR-Skills Pay...');
        setElapsedSeconds(0);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(route('public.checkout.process'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone,
                    payment_phone: data.payment_phone || data.customer_phone,
                    delivery_address: data.delivery_address,
                    delivery_landmark: data.delivery_landmark,
                    city: data.city,
                    payment_method: data.payment_method,
                    save_default_address: data.save_default_address,
                }),
            });

            const res = await response.json();

            if (!response.ok || !res.success) {
                setGatewayStage('failed');
                setGatewayMessage(res.message || 'Impossible d\'initier la transaction. Veuillez vérifier vos informations.');
                return;
            }

            setPaymentReference(res.reference);

            if (res.payment_type === 'card' && res.payment_url) {
                setPaymentCardUrl(res.payment_url);
                setGatewayStage('pending');
                setGatewayMessage('Veuillez finaliser le paiement sur l\'interface bancaire sécurisée.');
                startPolling(res.reference);
                startTimer();
                // Optionally open in new window
                window.open(res.payment_url, '_blank');
                return;
            }

            // Mobile Money Flow
            setGatewayStage('pending');
            setGatewayMessage(res.message || 'Une notification a été envoyée sur votre téléphone. Veuillez saisir votre code PIN.');
            startPolling(res.reference);
            startTimer();

        } catch (err) {
            console.error('Payment Error:', err);
            setGatewayStage('failed');
            setGatewayMessage('Erreur de connexion réseau avec la passerelle de paiement.');
        }
    };

    // Polling function for payment status
    const startPolling = (ref) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const checkRes = await fetch(route('public.checkout.payment.status', { reference: ref }), {
                    headers: { 'Accept': 'application/json' }
                });

                if (!checkRes.ok) return;

                const result = await checkRes.json();

                if (result.status === 'SUCCESS') {
                    stopAllTimers();
                    setGatewayStage('success');
                    setGatewayMessage(result.message || 'Paiement confirmé ! Fonds consignés sous séquestre Escrow.');
                    setOrderRedirectUrl(result.redirect_url);

                    // Redirect to order tracking or customer orders after short delay
                    setTimeout(() => {
                        window.location.href = result.redirect_url;
                    }, 1800);
                } else if (result.status === 'FAILED') {
                    stopAllTimers();
                    setGatewayStage('failed');
                    setGatewayMessage(result.message || 'La transaction a été rejetée ou a expiré.');
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000);
    };

    const startTimer = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
    };

    const stopAllTimers = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const handleCloseModal = () => {
        stopAllTimers();
        setGatewayModalOpen(false);
        setGatewayStage('idle');
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

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <PublicLayout>
            <Head title="Tunnel de Commande Sécurisé Escrow - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 font-sans text-stone-800 antialiased">
                
                {/* HEADER BANNER */}
                <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={route('public.cart.index')} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold text-stone-900 tracking-tight">Tunnel de Paiement Sécurisé</h1>
                                    <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                        HR-Skills Pay API
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500 font-normal">
                                    Vos fonds restent sous séquestre Escrow neutre jusqu'à la remise physique de votre colis.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                <span>Protection Escrow 100% Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN: CUSTOMER DETAILS & PAYMENT METHOD (7 COLS) */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Saved Addresses Selector */}
                            {savedAddresses.length > 0 && (
                                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
                                    <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
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
                                            <label className="font-semibold text-stone-700 block mb-1">Nom Complet *</label>
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
                                            <label className="font-semibold text-stone-700 block mb-1">Téléphone de Livraison *</label>
                                            <input
                                                type="tel"
                                                value={data.customer_phone}
                                                onChange={(e) => {
                                                    setData('customer_phone', e.target.value);
                                                    if (!data.payment_phone) setData('payment_phone', e.target.value);
                                                }}
                                                placeholder="Ex: 699001122"
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                                required
                                            />
                                            {errors.customer_phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.customer_phone}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="font-semibold text-stone-700 block mb-1">Adresse / Ruelle & Quartier *</label>
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
                                            <label className="font-semibold text-stone-700 block mb-1">Ville *</label>
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

                                    {/* Visual Landmark Instruction */}
                                    <div className="p-3 bg-yellow-50/60 border border-yellow-200 rounded-xl space-y-1.5">
                                        <label className="font-bold text-stone-900 flex items-center justify-between">
                                            <span>Point de Repère Visuel pour le Livreur</span>
                                            <span className="text-[10px] text-yellow-800 font-normal">Facilite l'acheminement</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_landmark}
                                            onChange={(e) => setData('delivery_landmark', e.target.value)}
                                            placeholder="Ex: Portail métallique vert, face à la boulangerie"
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selector Box - HR-SKILLS PAY INTEGRATION */}
                            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                    <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-yellow-600" />
                                        <span>2. Mode de Paiement Sécurisé (HR-Skills Pay)</span>
                                    </h3>
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                                        {hrpayConfig.mode === 'live' ? 'Mode Direct' : 'Mode Sandbox'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                    {/* Orange Money */}
                                    <label className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                                        data.payment_method === 'orange_money' 
                                            ? 'bg-orange-50/60 border-orange-500 ring-2 ring-orange-200 shadow-xs' 
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                    }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="orange_money"
                                                    checked={data.payment_method === 'orange_money'}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="text-orange-600 focus:ring-orange-500"
                                                />
                                                <span className="font-bold text-stone-900">Orange Money</span>
                                            </div>
                                            <img 
                                                src="/images/payments/orange_money.jpg" 
                                                alt="Logo Orange Money" 
                                                className="w-7 h-7 rounded-lg object-cover shadow-2xs border border-stone-200/80 shrink-0" 
                                            />
                                        </div>
                                        <span className="text-[10px] text-stone-500 leading-snug">Débit instantané par USSD / SMS</span>
                                    </label>

                                    {/* MTN MoMo */}
                                    <label className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                                        data.payment_method === 'mtn_momo' 
                                            ? 'bg-yellow-50/60 border-yellow-500 ring-2 ring-yellow-200 shadow-xs' 
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                    }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="mtn_momo"
                                                    checked={data.payment_method === 'mtn_momo'}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="text-yellow-600 focus:ring-yellow-500"
                                                />
                                                <span className="font-bold text-stone-900">MTN MoMo</span>
                                            </div>
                                            <img 
                                                src="/images/payments/mtn_momo.jpg" 
                                                alt="Logo MTN Mobile Money" 
                                                className="w-7 h-7 rounded-lg object-cover shadow-2xs border border-stone-200/80 shrink-0" 
                                            />
                                        </div>
                                        <span className="text-[10px] text-stone-500 leading-snug">Push de débit sur smartphone</span>
                                    </label>

                                    {/* Carte Bancaire Visa */}
                                    <label className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                                        data.payment_method === 'card' 
                                            ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-200 shadow-xs' 
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                    }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="card"
                                                    checked={data.payment_method === 'card'}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="font-bold text-stone-900">Carte Visa</span>
                                            </div>
                                            <img 
                                                src="/images/payments/visa.jpg" 
                                                alt="Logo Visa" 
                                                className="w-7 h-7 rounded-lg object-cover shadow-2xs border border-stone-200/80 shrink-0" 
                                            />
                                        </div>
                                        <span className="text-[10px] text-stone-500 leading-snug">Visa & Mastercard sécurisé 3DS</span>
                                    </label>
                                </div>

                                {/* Mobile Money Phone field if different from customer phone */}
                                {(data.payment_method === 'orange_money' || data.payment_method === 'mtn_momo') && (
                                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-xs animate-in fade-in duration-200">
                                        <label className="font-semibold text-stone-700 block">
                                            Numéro de compte {data.payment_method === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} à débiter :
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            <div className="px-3 py-2 bg-stone-200/70 border border-stone-300 rounded-lg text-stone-600 font-mono text-xs font-semibold">
                                                +237
                                            </div>
                                            <input
                                                type="tel"
                                                value={data.payment_phone}
                                                onChange={(e) => setData('payment_phone', e.target.value)}
                                                placeholder="Ex: 699001122"
                                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-mono outline-none focus:border-yellow-500"
                                            />
                                        </div>
                                        <p className="text-[10px] text-stone-400">
                                            Un prompt de confirmation s'affichera directement sur ce numéro.
                                        </p>
                                    </div>
                                )}

                                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px] flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                                    <span>Les fonds sont placés sous séquestre sécurisé. Le commerçant n'est crédité qu'après confirmation physique de la livraison.</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ORDER RECAP & ESCROW BREAKDOWN (5 COLS) */}
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
                                                placeholder="Code promo"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono outline-none focus:border-yellow-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shrink-0 transition"
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
                                        <span className="text-yellow-600 text-base">{Number(grandTotal).toLocaleString()} FCFA</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || items.length === 0}
                                    className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-yellow-500 disabled:opacity-50 cursor-pointer"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span>Valider & Payer sous Séquestre</span>
                                </button>
                            </div>

                            {/* Escrow Guarantee Infobox */}
                            <div className="bg-yellow-50/80 border border-yellow-200 rounded-2xl p-4 space-y-2 text-xs text-yellow-950 shadow-2xs">
                                <div className="flex items-center gap-2 font-bold text-yellow-900">
                                    <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                    <span>Garantie de Sécurité Escrow Sellify</span>
                                </div>
                                <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                                    1. Débit sécurisé via HR-Skills Pay API.<br/>
                                    2. Fonds consignés sous séquestre neutre garanti.<br/>
                                    3. Préparation & livraison par chauffeur certifié.<br/>
                                    4. Validation finale avec votre code OTP lors de la remise.<br/>
                                    5. Déblocage des fonds vers le vendeur ou remboursement sous 24h.
                                </p>

                                <div className="pt-2.5 border-t border-yellow-200/80 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-stone-700">Réseaux certifiés :</span>
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src="/images/payments/orange_money.jpg" 
                                            alt="Orange Money" 
                                            className="w-6 h-6 rounded-md object-cover shadow-2xs border border-stone-200" 
                                            title="Orange Money" 
                                        />
                                        <img 
                                            src="/images/payments/mtn_momo.jpg" 
                                            alt="MTN MoMo" 
                                            className="w-6 h-6 rounded-md object-cover shadow-2xs border border-stone-200" 
                                            title="MTN Mobile Money" 
                                        />
                                        <img 
                                            src="/images/payments/visa.jpg" 
                                            alt="Visa" 
                                            className="w-6 h-6 rounded-md object-cover shadow-2xs border border-stone-200" 
                                            title="Visa" 
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

            </div>

            {/* REAL-TIME HR-SKILLS PAY GATEWAY AUTHORIZATION MODAL */}
            {gatewayModalOpen && (
                <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 border border-stone-100">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-stone-200 shrink-0 bg-white">
                                    <img 
                                        src={data.payment_method === 'card' 
                                            ? '/images/payments/visa.jpg' 
                                            : (data.payment_method === 'orange_money' ? '/images/payments/orange_money.jpg' : '/images/payments/mtn_momo.jpg')
                                        } 
                                        alt="Logo opérateur" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div>
                                    <span className="font-bold text-xs text-stone-900 block">
                                        Paiement {data.payment_method === 'card' ? 'Carte Visa' : (data.payment_method === 'orange_money' ? 'Orange Money' : 'MTN MoMo')}
                                    </span>
                                    <span className="text-[10px] text-stone-400">Passerelle HR-Skills Pay v1</span>
                                </div>
                            </div>
                            
                            {gatewayStage !== 'initiating' && (
                                <button 
                                    onClick={handleCloseModal}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Modal Body depending on Stage */}
                        {gatewayStage === 'initiating' && (
                            <div className="py-8 text-center space-y-3">
                                <Loader2 className="w-10 h-10 text-yellow-600 animate-spin mx-auto" />
                                <h4 className="font-bold text-sm text-stone-900">Communication avec l'opérateur...</h4>
                                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                                    Sécurisation du tunnel et génération du jeton de transaction.
                                </p>
                            </div>
                        )}

                        {gatewayStage === 'pending' && (
                            <div className="space-y-4">
                                {/* Amount & Target Phone Recap */}
                                <div className="p-4 bg-yellow-50/70 border border-yellow-200 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Montant à régler</span>
                                        <span className="text-lg font-black text-stone-900">{Number(grandTotal).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="text-right flex items-center gap-2 justify-end">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Compte débité</span>
                                            <span className="text-xs font-mono font-bold text-stone-800">
                                                {data.payment_method === 'card' ? 'Carte Visa' : `+237 ${data.payment_phone || data.customer_phone}`}
                                            </span>
                                        </div>
                                        <img 
                                            src={data.payment_method === 'card' 
                                                ? '/images/payments/visa.jpg' 
                                                : (data.payment_method === 'orange_money' ? '/images/payments/orange_money.jpg' : '/images/payments/mtn_momo.jpg')
                                            } 
                                            alt="Logo opérateur" 
                                            className="w-7 h-7 rounded-lg object-cover border border-stone-200/80 shadow-2xs shrink-0" 
                                        />
                                    </div>
                                </div>

                                {/* Active radar status */}
                                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-center">
                                    <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-30 animate-ping"></span>
                                        <div className="relative w-10 h-10 rounded-full bg-yellow-500 text-yellow-950 flex items-center justify-center font-mono font-bold text-xs">
                                            {formatTimer(elapsedSeconds)}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-bold text-xs text-stone-900">
                                            {data.payment_method === 'card' 
                                                ? 'En attente de saisie sur le guichet bancaire...'
                                                : 'Invite USSD / Push envoyée sur votre téléphone'
                                            }
                                        </h4>
                                        <p className="text-[11px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                                            {data.payment_method === 'card'
                                                ? 'Finalisez la transaction sur l\'onglet bancaire sécurisé ouvert dans votre navigateur.'
                                                : 'Consultez votre écran de smartphone et validez la demande en composant votre code secret opérateur.'
                                            }
                                        </p>
                                    </div>

                                    {/* Card Action button if card payment */}
                                    {data.payment_method === 'card' && paymentCardUrl && (
                                        <div className="pt-2">
                                            <a
                                                href={paymentCardUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                                            >
                                                <span>Accéder au Guichet Bancaire</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    )}

                                    {paymentReference && (
                                        <div className="text-[10px] text-stone-400 font-mono">
                                            Réf: {paymentReference}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                                    <span className="flex items-center gap-1.5 text-stone-600">
                                        <RefreshCw className="w-3 h-3 text-stone-400 animate-spin" />
                                        <span>Détection automatique du paiement en direct...</span>
                                    </span>
                                </div>
                            </div>
                        )}

                        {gatewayStage === 'success' && (
                            <div className="py-6 text-center space-y-4">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-stone-900">Paiement Validé avec Succès !</h4>
                                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                                        {gatewayMessage}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-semibold">
                                    Redirection automatique vers le suivi de votre commande...
                                </div>
                            </div>
                        )}

                        {gatewayStage === 'failed' && (
                            <div className="space-y-4">
                                <div className="py-4 text-center space-y-2">
                                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-rose-50">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-sm text-stone-900">Échec ou Refus du Paiement</h4>
                                    <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 max-w-xs mx-auto">
                                        {gatewayMessage}
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition"
                                    >
                                        Modifier mes infos
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleInitiatePayment}
                                        className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition"
                                    >
                                        Réessayer le Paiement
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </PublicLayout>
    );
}
