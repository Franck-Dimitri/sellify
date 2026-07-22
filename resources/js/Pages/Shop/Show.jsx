import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    Store, 
    ShieldCheck, 
    MapPin, 
    Clock, 
    Share2, 
    Award, 
    ShoppingBag,
    Truck,
    Lock,
    RotateCcw,
    Star,
    Flame,
    Tag,
    Search,
    BadgeCheck,
    X,
    CreditCard,
    Plus,
    Minus,
    CheckCircle2,
    Shield
} from 'lucide-react';

export default function Show({ shop, products = [] }) {
    const [openStatus, setOpenStatus] = useState({ isOpen: false, text: 'Vérification...' });
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'promos', 'about', 'contact'
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state for direct on-platform checkout
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [cityNeighborhood, setCityNeighborhood] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('orange_money');
    const [submittingOrder, setSubmittingOrder] = useState(false);

    const themeColor = shop.theme_color || '#F59E0B';

    useEffect(() => {
        const checkIsOpen = () => {
            if (!shop.opening_hours) {
                setOpenStatus({ isOpen: false, text: 'Horaires non définis' });
                return;
            }

            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const now = new Date();
            const dayName = days[now.getDay()];
            const todayHours = shop.opening_hours[dayName];

            if (!todayHours || !todayHours.active) {
                setOpenStatus({ isOpen: false, text: 'Fermé aujourd\'hui' });
                return;
            }

            const timeToMinutes = (t) => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };

            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const openMinutes = timeToMinutes(todayHours.open);
            const closeMinutes = timeToMinutes(todayHours.close);

            if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
                setOpenStatus({ isOpen: true, text: `Ouvert • Ferme à ${todayHours.close}` });
            } else {
                setOpenStatus({ isOpen: false, text: `Fermé • Ouvre à ${todayHours.open}` });
            }
        };

        checkIsOpen();
        const interval = setInterval(checkIsOpen, 60000);
        return () => clearInterval(interval);
    }, [shop.opening_hours]);

    const daysTranslation = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: shop.name,
                text: shop.slogan,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Lien de la boutique copié dans le presse-papiers !");
        }
    };

    const handleOpenOrderModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    const handleDirectOrderSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setSubmittingOrder(true);

        const payload = {
            product_id: selectedProduct.id,
            quantity: quantity,
            customer_name: customerName,
            phone_number: phoneNumber,
            delivery_address: deliveryAddress,
            city_neighborhood: cityNeighborhood,
            payment_method: paymentMethod,
        };

        router.post(route('shop.direct_checkout'), payload, {
            onSuccess: () => {
                setSubmittingOrder(false);
                setSelectedProduct(null);
            },
            onError: () => {
                setSubmittingOrder(false);
            }
        });
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (activeTab === 'promos') {
            return matchesSearch && (product.promotions && product.promotions.length > 0);
        }
        return matchesSearch;
    });

    const promoProductsCount = products.filter(p => p.promotions && p.promotions.length > 0).length;

    return (
        <>
            <Head title={`${shop.name} - Achats Sécurisés en Ligne`} />

            <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased pb-20">
                
                {/* ALIBABA STYLE TOP ANNOUNCEMENT / REASSURANCE HEADER BAR */}
                <div className="bg-stone-900 text-white text-xs py-2 px-4 border-b border-stone-800">
                    <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                <BadgeCheck className="w-4 h-4 text-amber-400" />
                                <span>Vendeur Certifié Gold Sellify</span>
                            </span>
                            <span className="text-stone-500 hidden sm:inline">•</span>
                            <span className="text-stone-300 hidden sm:inline">Achats 100% Sécurisés sur la Plateforme</span>
                            <span className="text-stone-500 hidden md:inline">•</span>
                            <span className="text-stone-300 hidden md:inline">Garantie Séquestre Escrow & Suivi Colis</span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-stone-400">
                            <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3 text-emerald-400" />
                                <span>Orange Money & MTN MoMo Certifiés</span>
                            </span>
                            <button onClick={handleShare} className="hover:text-white transition-colors flex items-center gap-1">
                                <Share2 className="w-3 h-3" />
                                <span>Partager</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* COVER BANNER HEADER */}
                <div className="w-full h-48 md:h-64 relative bg-stone-900 overflow-hidden">
                    {shop.banner_path ? (
                        <img 
                            src={`/storage/${shop.banner_path}`} 
                            alt={shop.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${themeColor} 0%, #171717 100%)` }} />
                    )}
                    <div className="absolute inset-0 bg-black/40" />

                    <button 
                        onClick={handleShare}
                        className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20 transition-all z-10"
                        title="Partager la boutique"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* SHOP PROFILE HEADER & ALIBABA TRUST CARD */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20 relative z-10">
                    <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            
                            {/* Logo & Brand Identity */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left w-full md:w-auto">
                                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl p-1.5 shadow-lg border border-stone-200 flex items-center justify-center shrink-0">
                                    {shop.logo_path ? (
                                        <img 
                                            src={`/storage/${shop.logo_path}`} 
                                            alt={shop.name} 
                                            className="w-full h-full object-cover rounded-xl" 
                                        />
                                    ) : (
                                        <Store className="w-12 h-12 text-stone-400" />
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <h1 className="text-xl md:text-2xl font-semibold text-stone-900">{shop.name}</h1>
                                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5 text-amber-600" />
                                            <span>Vendeur Certifié Gold</span>
                                        </span>
                                    </div>

                                    <p className="text-xs md:text-sm text-stone-500 font-normal italic">
                                        "{shop.slogan || 'Vitrine officielle de vente en ligne.'}"
                                    </p>

                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pt-1 text-xs text-stone-600 font-normal">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${
                                            openStatus.isOpen 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                : 'bg-stone-100 text-stone-600 border-stone-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full mr-1.5 ${openStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                                            {openStatus.text}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                            <span>{shop.address}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Platform Order Banner */}
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-950 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    <span>Toutes les transactions sont protégées par le Séquestre Sellify</span>
                                </div>
                            </div>

                        </div>

                        {/* REASSURANCE TRUST BADGES BAR (ALIBABA STYLE) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-xs">
                            <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl">
                                <Shield className="w-5 h-5 text-amber-700 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Achat 100% Sur Plateforme</h4>
                                    <p className="text-[10px] text-stone-500 font-normal">Garantie anti-fraude intégrée</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl">
                                <Truck className="w-5 h-5 text-amber-700 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Suivi Colis Sans Compte</h4>
                                    <p className="text-[10px] text-stone-500 font-normal">Code de suivi direct par SMS</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl">
                                <RotateCcw className="w-5 h-5 text-amber-700 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Arbitrage Litige 48h</h4>
                                    <p className="text-[10px] text-stone-500 font-normal">Fonds bloqués jusqu'à réception</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl">
                                <Lock className="w-5 h-5 text-amber-700 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Mobile Money Certifié</h4>
                                    <p className="text-[10px] text-stone-500 font-normal">Orange Money & MTN MoMo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STORE NAVIGATION TABS & TOOLBAR */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-3">
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                                    activeTab === 'all' 
                                        ? 'bg-amber-500 text-amber-950 shadow-xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                Tous les Produits ({products.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('promos')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === 'promos' 
                                        ? 'bg-amber-500 text-amber-950 shadow-xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                <Flame className="w-3.5 h-3.5 text-amber-700" />
                                <span>Promotions Flash ({promoProductsCount})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                                    activeTab === 'about' 
                                        ? 'bg-amber-500 text-amber-950 shadow-xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                Profil & Garanties Légales
                            </button>
                            <button
                                onClick={() => setActiveTab('contact')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                                    activeTab === 'contact' 
                                        ? 'bg-amber-500 text-amber-950 shadow-xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                Horaires d'Ouverture
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un produit..."
                                className="w-full pl-9 pr-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                            />
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-6">
                    {activeTab === 'about' ? (
                        /* ABOUT STORE TAB */
                        <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3 mb-4">
                                    Présentation de la Boutique
                                </h3>
                                <p className="text-xs text-stone-600 leading-relaxed font-normal whitespace-pre-line">
                                    {shop.description || 'Aucune description rédigée pour le moment.'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
                                    <span>Informations Légales & Conformité Commerciale</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60">
                                        <span className="text-[10px] text-stone-400 block font-medium uppercase">Raison Sociale</span>
                                        <span className="font-semibold text-stone-900">{shop.company_name}</span>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60">
                                        <span className="text-[10px] text-stone-400 block font-medium uppercase">Enregistrement Commercial</span>
                                        <span className="font-semibold text-stone-900">{shop.registration_number || 'Conforme au registre commercial'}</span>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 md:col-span-2">
                                        <span className="text-[10px] text-stone-400 block font-medium uppercase">Adresse Officielle</span>
                                        <span className="font-semibold text-stone-900">{shop.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'contact' ? (
                        /* CONTACT & OPENING HOURS TAB */
                        <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-6">
                            <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3">
                                Horaires d'Ouverture
                            </h3>
                            <div className="border border-stone-200/70 rounded-xl divide-y divide-stone-100 text-xs">
                                {shop.opening_hours && Object.keys(shop.opening_hours).map((day) => (
                                    <div key={day} className="flex justify-between items-center p-3 font-normal">
                                        <span className="font-medium text-stone-800">{daysTranslation[day]}</span>
                                        {shop.opening_hours[day].active ? (
                                            <span className="font-semibold text-stone-900">
                                                {shop.opening_hours[day].open} - {shop.opening_hours[day].close}
                                            </span>
                                        ) : (
                                            <span className="font-medium text-red-600 uppercase text-[11px]">Fermé</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ALIBABA STYLE PRODUCT CATALOG GRID WITH DIRECT PLATFORM PURCHASE */
                        <div className="space-y-4">
                            {filteredProducts.length === 0 ? (
                                <div className="bg-white border border-stone-200/70 rounded-2xl p-12 text-center space-y-3">
                                    <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto stroke-[1.5]" />
                                    <h4 className="font-semibold text-stone-900 text-sm">Aucun produit disponible</h4>
                                    <p className="text-xs text-stone-500 font-normal max-w-sm mx-auto">
                                        {searchTerm ? 'Aucun article ne correspond à votre recherche.' : 'La boutique mettra à jour son catalogue très prochainement.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {filteredProducts.map(product => {
                                        const hasPromo = product.promotions && product.promotions.length > 0;
                                        const activePromo = hasPromo ? product.promotions[0] : null;
                                        
                                        const originalPrice = parseFloat(product.price);
                                        const finalPrice = activePromo ? parseFloat(activePromo.promo_price) : originalPrice;
                                        const discountPercentage = activePromo ? activePromo.discount_percentage : 0;

                                        const firstImage = product.images && product.images[0] ? product.images[0] : null;

                                        return (
                                            <div 
                                                key={product.id}
                                                className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
                                            >
                                                <div>
                                                    {/* Image Box */}
                                                    <div className="h-48 bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-stone-100">
                                                        {firstImage ? (
                                                            <img 
                                                                src={firstImage} 
                                                                alt={product.name} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <ShoppingBag className="w-10 h-10 text-stone-300 stroke-[1.5]" />
                                                        )}

                                                        {hasPromo && (
                                                            <span className="absolute top-3 left-3 bg-red-600 text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                                                                -{discountPercentage}% OFF
                                                            </span>
                                                        )}

                                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 font-medium text-[10px] px-2 py-0.5 rounded-md border border-stone-200">
                                                            {product.stock > 0 ? `${product.stock} dispo` : 'Rupture'}
                                                        </span>
                                                    </div>

                                                    {/* Details Box */}
                                                    <div className="p-4 space-y-2">
                                                        <div className="flex items-center gap-1 text-amber-500 text-[11px]">
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <span className="text-stone-400 ml-1 font-normal">(4.9)</span>
                                                        </div>

                                                        <h4 className="font-semibold text-stone-900 text-xs line-clamp-2 leading-snug">
                                                            {product.name}
                                                        </h4>

                                                        <div className="pt-1 flex items-baseline gap-2">
                                                            <span className="text-sm font-semibold text-stone-900">
                                                                {finalPrice.toLocaleString()} FCFA
                                                            </span>
                                                            {hasPromo && (
                                                                <span className="text-[11px] text-stone-400 line-through font-normal">
                                                                    {originalPrice.toLocaleString()} FCFA
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* On-Platform Purchase Action */}
                                                <div className="p-4 pt-0">
                                                    <button
                                                        onClick={() => handleOpenOrderModal(product)}
                                                        disabled={product.stock === 0}
                                                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 text-xs font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                                                    >
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                        <span>Acheter Maintenant</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ON-PLATFORM FAST DIRECT ORDER MODAL */}
                {selectedProduct && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-stone-800 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-semibold text-stone-900 text-sm">Commande Sécurisée sur la Plateforme</h3>
                                </div>
                                <button onClick={() => setSelectedProduct(null)} className="text-stone-400 hover:text-stone-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Product Summary */}
                            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-lg border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {selectedProduct.images && selectedProduct.images[0] ? (
                                        <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingBag className="w-6 h-6 text-stone-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-stone-900 text-xs">{selectedProduct.name}</h4>
                                    <p className="text-[11px] text-stone-500 font-normal">Boutique : {shop.name}</p>
                                    <span className="font-semibold text-amber-900 text-xs">
                                        {Number(selectedProduct.promotions && selectedProduct.promotions.length > 0 ? selectedProduct.promotions[0].promo_price : selectedProduct.price).toLocaleString()} FCFA / unité
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleDirectOrderSubmit} className="space-y-4 text-xs font-normal">
                                {/* Quantity Picker */}
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Quantité désirable</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-sm text-stone-900">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(q => Math.min(selectedProduct.stock || 99, q + 1))}
                                            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Nom Complet du Destinataire *</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="ex: Jean Dupuis"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Numéro de Téléphone (pour la livraison & suivi) *</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        placeholder="ex: 690 12 34 56"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Adresse de Livraison Précise *</label>
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={e => setDeliveryAddress(e.target.value)}
                                        placeholder="ex: Akwa, Rue Deido face Boulangerie"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Ville / Quartier</label>
                                    <input
                                        type="text"
                                        value={cityNeighborhood}
                                        onChange={e => setCityNeighborhood(e.target.value)}
                                        placeholder="ex: Douala / Akwa"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Moyen de Paiement Séquestre *</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                    >
                                        <option value="orange_money">Orange Money (Séquestre Protégé)</option>
                                        <option value="mtn_momo">MTN Mobile Money (Séquestre Protégé)</option>
                                    </select>
                                </div>

                                {/* Escrow Guarantee Reassurance Box */}
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-normal space-y-1">
                                    <div className="font-semibold flex items-center gap-1 text-amber-950">
                                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Garantie de Sécurité Escrow Sellify</span>
                                    </div>
                                    <p>
                                        Vos fonds restent bloqués sous séquestre jusqu'à la livraison complète et votre confirmation. Le vendeur ne sera payé qu'après validation.
                                    </p>
                                </div>

                                {/* Order Total & Submit */}
                                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-stone-400 block">Total à payer</span>
                                        <span className="text-base font-semibold text-stone-900">
                                            {Number((selectedProduct.promotions && selectedProduct.promotions.length > 0 ? selectedProduct.promotions[0].promo_price : selectedProduct.price) * quantity).toLocaleString()} FCFA
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProduct(null)}
                                            className="px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submittingOrder}
                                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-medium rounded-xl shadow-xs transition-colors disabled:opacity-50"
                                        >
                                            {submittingOrder ? 'Validation...' : 'Payer & Commander'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
