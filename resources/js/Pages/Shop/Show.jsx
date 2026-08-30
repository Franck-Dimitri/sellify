import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
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
    Shield,
    Package,
    ArrowRight,
    MessageCircle,
    Building2,
    Smartphone
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

    const safeProducts = Array.isArray(products) ? products : [];

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
                text: shop.slogan || "Découvrez notre boutique sur Sellify.me",
                url: window.location.href,
            }).catch(() => {});
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
    const filteredProducts = safeProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (activeTab === 'promos') {
            return matchesSearch && (product.promotions && product.promotions.length > 0);
        }
        return matchesSearch;
    });

    const promoProductsCount = safeProducts.filter(p => p.promotions && p.promotions.length > 0).length;

    const sellerUser = shop.seller?.user;

    return (
        <PublicLayout>
            <Head title={`${shop.name} - Boutique Officielle Certifiée`} />

            <div className="min-h-screen bg-[#fbf9f5] font-sans text-stone-700 antialiased pb-20">
                
                {/* 1. TOP REASSURANCE BADGE STRIP */}
                <div className="bg-white border-b border-stone-200/80 py-2 px-4 text-xs font-normal">
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-stone-600">
                            <span className="inline-flex items-center gap-1 text-yellow-800 font-medium bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px]">
                                <BadgeCheck className="w-3.5 h-3.5 text-yellow-600" />
                                <span>Boutique Agréée Sellify</span>
                            </span>
                            <span className="text-stone-300 hidden sm:inline">•</span>
                            <span className="text-stone-500 hidden sm:inline">Paiements sous séquestre Escrow</span>
                            <span className="text-stone-300 hidden md:inline">•</span>
                            <span className="text-stone-500 hidden md:inline">Livraison géolocalisée par coursier partenaire</span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-stone-500">
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Mobile Money Certifié</span>
                            </span>
                            <button onClick={handleShare} className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium cursor-pointer">
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Partager</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. COVER BANNER */}
                <div className="w-full h-44 sm:h-56 md:h-64 relative bg-stone-100 overflow-hidden border-b border-stone-200/80">
                    {shop.banner_path ? (
                        <img 
                            src={`/storage/${shop.banner_path}`} 
                            alt={shop.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-amber-100/60 via-yellow-100/60 to-stone-100 flex items-center justify-center pattern-grid-amber">
                            <Building2 className="w-16 h-16 text-yellow-600/30 stroke-[1.5]" />
                        </div>
                    )}
                </div>

                {/* 3. SHOP PROFILE HEADER CARD */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20 relative z-10">
                    <div className="bg-white border border-stone-200/80 rounded-3xl p-5 sm:p-6 shadow-lg space-y-6">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                            
                            {/* Logo & Identity */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left w-full md:w-auto">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-1.5 shadow-md border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden">
                                    {shop.logo_path ? (
                                        <img 
                                            src={`/storage/${shop.logo_path}`} 
                                            alt={shop.name} 
                                            className="w-full h-full object-cover rounded-xl" 
                                        />
                                    ) : (
                                        <Store className="w-10 h-10 text-yellow-700" />
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <h1 className="text-xl sm:text-2xl font-semibold text-stone-900">{shop.name}</h1>
                                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5 text-yellow-600" />
                                            <span>Vendeur Vérifié</span>
                                        </span>
                                    </div>

                                    <p className="text-xs text-stone-500 font-normal">
                                        {shop.slogan || shop.description || 'Vitrine officielle de vente en ligne sous garantie séquestre.'}
                                    </p>

                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pt-1 text-xs text-stone-600 font-normal">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                                            openStatus.isOpen 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                : 'bg-stone-100 text-stone-600 border-stone-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full mr-1.5 ${openStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                                            {openStatus.text}
                                        </span>
                                        <span className="text-stone-300">•</span>
                                        <span className="flex items-center gap-1 text-stone-600">
                                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                            <span>{shop.address || shop.city || 'Douala, Cameroun'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Action */}
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
                                <button
                                    onClick={handleShare}
                                    className="px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-stone-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>Partager la boutique</span>
                                </button>
                            </div>

                        </div>

                        {/* TRUST REASSURANCE PILLS (LIGHT & CLEAN) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-xs">
                            <div className="flex items-center gap-2.5 p-3 bg-[#fcfbf9] border border-stone-200/80 rounded-2xl">
                                <Shield className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Garantie Escrow</h4>
                                    <p className="text-[10px] text-stone-400 font-normal">Fonds bloqués jusqu'à réception</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-[#fcfbf9] border border-stone-200/80 rounded-2xl">
                                <Truck className="w-4.5 h-4.5 text-yellow-600 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Livraison Express</h4>
                                    <p className="text-[10px] text-stone-400 font-normal">Suivi par coursier certifié</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-[#fcfbf9] border border-stone-200/80 rounded-2xl">
                                <RotateCcw className="w-4.5 h-4.5 text-yellow-600 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Médiation Litige</h4>
                                    <p className="text-[10px] text-stone-400 font-normal">Remboursement garanti</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-[#fcfbf9] border border-stone-200/80 rounded-2xl">
                                <Smartphone className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-stone-900 text-xs">Mobile Money</h4>
                                    <p className="text-[10px] text-stone-400 font-normal">Orange Money & MTN MoMo</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 4. STORE TABS & SEARCH BAR */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200/80 pb-3">
                        
                        {/* Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'all' 
                                        ? 'bg-yellow-400 text-stone-950 font-semibold shadow-2xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                Tous les Produits ({safeProducts.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('promos')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                                    activeTab === 'promos' 
                                        ? 'bg-yellow-400 text-stone-950 font-semibold shadow-2xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                <Flame className="w-3.5 h-3.5 text-rose-500" />
                                <span>Promotions ({promoProductsCount})</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('about')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'about' 
                                        ? 'bg-yellow-400 text-stone-950 font-semibold shadow-2xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                Profil & Infos Légales
                            </button>

                            <button
                                onClick={() => setActiveTab('contact')}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'contact' 
                                        ? 'bg-yellow-400 text-stone-950 font-semibold shadow-2xs' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                Horaires d'Ouverture
                            </button>
                        </div>

                        {/* Search Input in this Shop */}
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Rechercher dans cette boutique..."
                                className="w-full pl-9 pr-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:border-yellow-400 outline-none font-normal shadow-2xs transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 5. MAIN CONTENT AREA */}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-6">
                    
                    {/* ABOUT STORE TAB */}
                    {activeTab === 'about' && (
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
                            <div>
                                <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3 mb-3">
                                    Présentation de la Boutique
                                </h3>
                                <p className="text-xs text-stone-600 leading-relaxed font-normal whitespace-pre-line">
                                    {shop.description || 'Cette boutique officielle propose une sélection d\'articles certifiés avec paiement sécurisé sous séquestre.'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3 mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-4.5 h-4.5 text-yellow-600" />
                                    <span>Informations Commerciales & Immatriculation</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-0.5">
                                        <span className="text-[10px] text-stone-400 font-medium uppercase">Raison Sociale</span>
                                        <p className="font-semibold text-stone-900">{shop.company_name || shop.name}</p>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-0.5">
                                        <span className="text-[10px] text-stone-400 font-medium uppercase">Numéro RCCM / Patente</span>
                                        <p className="font-semibold text-stone-900 font-mono">{shop.registration_number || shop.rccm_number || 'Enregistré & Vérifié Sellify'}</p>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 md:col-span-2 space-y-0.5">
                                        <span className="text-[10px] text-stone-400 font-medium uppercase">Adresse Physique Officielle</span>
                                        <p className="font-semibold text-stone-900">{shop.address || 'Douala, Cameroun'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPENING HOURS TAB */}
                    {activeTab === 'contact' && (
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                            <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-3">
                                Horaires d'Ouverture
                            </h3>
                            <div className="border border-stone-200/80 rounded-xl divide-y divide-stone-100 text-xs overflow-hidden">
                                {shop.opening_hours ? (
                                    Object.keys(shop.opening_hours).map((day) => (
                                        <div key={day} className="flex justify-between items-center p-3 font-normal">
                                            <span className="font-medium text-stone-800">{daysTranslation[day] || day}</span>
                                            {shop.opening_hours[day].active ? (
                                                <span className="font-semibold text-stone-900">
                                                    {shop.opening_hours[day].open} - {shop.opening_hours[day].close}
                                                </span>
                                            ) : (
                                                <span className="font-medium text-stone-400 uppercase text-[11px]">Fermé</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-stone-500 font-normal">
                                        Boutique ouverte 7j/7 pour les commandes en ligne.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS CATALOG GRID */}
                    {(activeTab === 'all' || activeTab === 'promos') && (
                        <div className="space-y-4">
                            {filteredProducts.length === 0 ? (
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center space-y-3">
                                    <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto stroke-[1.5]" />
                                    <h4 className="font-semibold text-stone-900 text-sm">Aucun produit disponible</h4>
                                    <p className="text-xs text-stone-500 font-normal max-w-sm mx-auto">
                                        {searchTerm ? 'Aucun article ne correspond à votre recherche.' : 'La boutique mettra à jour son catalogue très prochainement.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {filteredProducts.map(product => {
                                        const hasPromo = product.promotions && product.promotions.length > 0;
                                        const activePromo = hasPromo ? product.promotions[0] : null;
                                        
                                        const originalPrice = parseFloat(product.price);
                                        const finalPrice = activePromo ? parseFloat(activePromo.promo_price) : originalPrice;
                                        const discountPercentage = activePromo ? activePromo.discount_percentage : 0;

                                        const firstImage = (product.image_paths && product.image_paths[0])
                                            ? `/storage/${product.image_paths[0]}`
                                            : (product.images && product.images[0] ? product.images[0] : null);

                                        return (
                                            <div 
                                                key={product.id}
                                                className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs hover:border-yellow-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between group p-3 space-y-2.5"
                                            >
                                                <div className="space-y-2">
                                                    
                                                    {/* Image Box */}
                                                    <div className="relative w-full aspect-square bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center border border-stone-100">
                                                        {firstImage ? (
                                                            <img 
                                                                src={firstImage} 
                                                                alt={product.name} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <Package className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                                        )}

                                                        {hasPromo && (
                                                            <span className="absolute top-2 right-2 bg-rose-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                                                                -{discountPercentage}%
                                                            </span>
                                                        )}

                                                        <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-stone-800 text-[9px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                            <span>Escrow</span>
                                                        </span>
                                                    </div>

                                                    {/* Product Title */}
                                                    <Link href={route('public.products.show', product.slug)} className="block">
                                                        <h4 className="font-medium text-stone-900 text-xs line-clamp-2 hover:text-yellow-700 transition-colors leading-tight">
                                                            {product.name}
                                                        </h4>
                                                    </Link>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="pt-2 border-t border-stone-100 space-y-2">
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-semibold text-stone-900 tracking-tight">
                                                            {finalPrice.toLocaleString()} FCFA
                                                        </div>
                                                        {hasPromo && (
                                                            <div className="text-[10px] text-stone-400 line-through">
                                                                {originalPrice.toLocaleString()} FCFA
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleOpenOrderModal(product)}
                                                        disabled={product.stock === 0}
                                                        className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-stone-950 font-semibold text-[11px] rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                                                    >
                                                        <span>Commander</span>
                                                        <ArrowRight className="w-3 h-3" />
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

                {/* 6. ON-PLATFORM DIRECT FAST ORDER MODAL */}
                {selectedProduct && (
                    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-stone-700 max-h-[90vh] overflow-y-auto border border-stone-200 animate-scale-up">
                            
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-semibold text-stone-900 text-sm">Commande Sécurisée Escrow</h3>
                                </div>
                                <button onClick={() => setSelectedProduct(null)} className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Product Mini Summary */}
                            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-xl border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                                    {selectedProduct.image_paths && selectedProduct.image_paths[0] ? (
                                        <img src={`/storage/${selectedProduct.image_paths[0]}`} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-6 h-6 text-stone-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-stone-900 text-xs line-clamp-1">{selectedProduct.name}</h4>
                                    <p className="text-[11px] text-stone-500 font-normal">Boutique : {shop.name}</p>
                                    <span className="font-semibold text-stone-900 text-xs">
                                        {Number(selectedProduct.promotions && selectedProduct.promotions.length > 0 ? selectedProduct.promotions[0].promo_price : selectedProduct.price).toLocaleString()} FCFA / unité
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleDirectOrderSubmit} className="space-y-3.5 text-xs font-normal">
                                
                                {/* Quantity Picker */}
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Quantité souhaitée</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold cursor-pointer"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-semibold text-sm text-stone-900">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(q => Math.min(selectedProduct.stock || 99, q + 1))}
                                            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Votre Nom Complet *</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="Ex: Paul Mbarga"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Numéro Mobile Money (Livraison & Paiement) *</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        placeholder="+237 6XX XX XX XX"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Adresse de Livraison Précise *</label>
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={e => setDeliveryAddress(e.target.value)}
                                        placeholder="Ex: Douala, Akwa face Direction Orange"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:border-yellow-400 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Mode de Paiement Séquestre *</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:border-yellow-400 outline-none font-medium cursor-pointer"
                                    >
                                        <option value="orange_money">Orange Money (Séquestre Protégé)</option>
                                        <option value="mtn_momo">MTN Mobile Money (Séquestre Protégé)</option>
                                    </select>
                                </div>

                                {/* Reassurance Box */}
                                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-950 font-normal space-y-1">
                                    <div className="font-semibold flex items-center gap-1 text-amber-950">
                                        <ShieldCheck className="w-3.5 h-3.5 text-yellow-700" />
                                        <span>Garantie de Sécurité Escrow</span>
                                    </div>
                                    <p>
                                        Vos fonds restent verrouillés en sécurité chez Sellify. Le commerçant n'est payé qu'après validation de votre colis à la remise.
                                    </p>
                                </div>

                                {/* Total & Submit */}
                                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-stone-400 block">Total à régler</span>
                                        <span className="text-base font-semibold text-stone-900">
                                            {Number((selectedProduct.promotions && selectedProduct.promotions.length > 0 ? selectedProduct.promotions[0].promo_price : selectedProduct.price) * quantity).toLocaleString()} FCFA
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProduct(null)}
                                            className="px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 cursor-pointer"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submittingOrder}
                                            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                        >
                                            {submittingOrder ? 'Validation...' : 'Valider la commande'}
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

            </div>
        </PublicLayout>
    );
}
