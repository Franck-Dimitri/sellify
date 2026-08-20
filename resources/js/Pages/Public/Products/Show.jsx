import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Package, 
    ShieldCheck, 
    Store, 
    Star, 
    Truck, 
    CreditCard, 
    CheckCircle2, 
    ArrowLeft, 
    Plus, 
    Minus, 
    X,
    ShoppingCart, 
    Share2,
    Sparkles,
    Check,
    AlertCircle,
    BadgeCheck,
    Clock,
    Lock,
    Building2,
    FileText,
    RefreshCw,
    Award,
    Layers,
    Info,
    HelpCircle,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    Heart,
    MessageSquare
} from 'lucide-react';

export default function Show({ 
    product, 
    shop, 
    seller, 
    sellerUser, 
    relatedProducts = [], 
    reviews = [], 
    averageRating = 5.0, 
    totalReviews = 0, 
    isWishlisted = false 
}) {
    const images = product.image_paths && product.image_paths.length > 0 
        ? product.image_paths.map(p => `/storage/${p}`) 
        : [];
    
    const [selectedImage, setSelectedImage] = useState(images[0] || null);
    const [activeTab, setActiveTab] = useState('specs');

    // Direct Checkout Modal State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const hasPromo = product.active_promotion !== null;
    const baseUnitPrice = hasPromo ? parseFloat(product.active_promotion.promo_price) : parseFloat(product.price);
    
    // Calculate wholesale discount based on quantity (Alibaba Tier Pricing)
    let unitPrice = baseUnitPrice;
    if (quantity >= 10) {
        unitPrice = baseUnitPrice * 0.90; // 10% discount for 10+
    } else if (quantity >= 5) {
        unitPrice = baseUnitPrice * 0.95; // 5% discount for 5+
    }
    const totalPrice = unitPrice * quantity;

    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: 1,
        customer_name: '',
        customer_phone: '',
        delivery_address: '',
        city: shop?.city || 'Douala',
        payment_method: 'orange_money',
    });

    const handleQuantityChange = (newQty) => {
        if (newQty < 1 || newQty > product.stock) return;
        setQuantity(newQty);
        setData('quantity', newQty);
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        post(route('shop.direct_checkout'), {
            onSuccess: () => {
                setIsCheckoutOpen(false);
            }
        });
    };

    return (
        <PublicLayout>
            <Head title={`${product.name} - Fiche Produit Alibaba - ${shop?.name || 'Sellify.me'}`} />

            <div className="w-full bg-stone-100/70 min-h-screen pb-20 antialiased font-sans text-stone-800">
                
                {/* TOP TRADE ASSURANCE BANNER */}
                <div className="bg-gradient-to-r from-stone-900 via-yellow-950 to-stone-900 text-white text-xs py-2 px-4 border-b border-stone-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-normal">
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-yellow-500">
                                Trade Assurance
                            </span>
                            <span className="text-stone-300 text-[11px]">
                                Produit Vérifié & Commande Protégée par le Séquestre Sellify. Remboursement garanti si non conforme.
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-yellow-400 font-medium">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Paiement Sécurisé MoMo</span>
                            <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Expédition Sous 24h-48h</span>
                        </div>
                    </div>
                </div>

                {/* BREADCRUMB NAVIGATION */}
                <div className="bg-white border-b border-stone-200 py-3 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-normal">
                        <Link 
                            href={route('public.products.index')} 
                            className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Retour au Catalogue Marketplace</span>
                        </Link>

                        <div className="hidden sm:flex items-center gap-2 text-stone-400">
                            <Link href="/" className="hover:underline">Accueil</Link>
                            <span>/</span>
                            <Link href={route('public.products.index')} className="hover:underline">Store</Link>
                            <span>/</span>
                            {shop && (
                                <>
                                    <Link href={route('shop.public', shop.slug)} className="hover:underline text-stone-600">{shop.name}</Link>
                                    <span>/</span>
                                </>
                            )}
                            <span className="text-stone-800 font-medium truncate max-w-xs">{product.name}</span>
                        </div>
                    </div>
                </div>

                {/* MAIN PRODUCT DETAIL GRID */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN: IMAGE GALLERY (5 COLS) */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden flex items-center justify-center min-h-[360px]">
                                {selectedImage ? (
                                    <img 
                                        src={selectedImage} 
                                        alt={product.name} 
                                        className="w-full max-h-[400px] object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="text-center py-12 text-stone-300">
                                        <Package className="w-16 h-16 mx-auto stroke-[1.5]" />
                                        <span className="text-xs text-stone-400 block mt-2">Visuel principal indisponible</span>
                                    </div>
                                )}

                                {hasPromo && (
                                    <span className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                                        -{product.active_promotion.discount_percentage}% OFF
                                    </span>
                                )}

                                <span className="absolute bottom-4 left-4 bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <BadgeCheck className="w-3.5 h-3.5 text-yellow-400" />
                                    <span>Stock Vérifié : {product.stock} unités</span>
                                </span>
                            </div>

                            {/* Image Thumbnails Strip */}
                            {images.length > 1 && (
                                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-18 h-18 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                                                selectedImage === img 
                                                    ? 'border-yellow-400 ring-2 ring-yellow-400/20' 
                                                    : 'border-stone-200 opacity-75 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt={`Miniature ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Trade Protection Summary Card */}
                            <div className="bg-yellow-50/80 border border-yellow-200/80 rounded-2xl p-4 space-y-3 text-xs text-yellow-950 font-normal shadow-2xs">
                                <div className="flex items-center gap-2 font-semibold text-yellow-900 border-b border-yellow-200/60 pb-2">
                                    <ShieldCheck className="w-4.5 h-4.5 text-yellow-600" />
                                    <span>Engagement Acheteur Sellify Escrow</span>
                                </div>
                                <p className="text-[11px] text-stone-600 leading-relaxed">
                                    Vos fonds restent sécurisés sur un compte séquestre neutre. Le vendeur ne perçoit son paiement qu'après votre confirmation de réception et conformité sous 48h.
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 pt-1">
                                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-yellow-600" /> Expédié sous 24h</span>
                                    <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-yellow-600" /> Orange / MTN MoMo</span>
                                    <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-yellow-600" /> Retour gratuit si défaut</span>
                                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-yellow-600" /> Facture Certifiée</span>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE COLUMN: SPECS, WHOLESALE MOQs & BUY ACTION (4 COLS) */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-5 lg:col-span-4">
                            
                            {/* Product Header & SKU */}
                            <div className="space-y-2 border-b border-stone-100 pb-3">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="bg-yellow-100 text-yellow-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-yellow-300">
                                        Fournisseur Certifié
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => router.post(route('customer.wishlist.toggle', product.id), {}, { preserveScroll: true })}
                                            className={`p-1.5 rounded-lg border transition-colors ${
                                                isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-rose-500'
                                            }`}
                                            title={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                        >
                                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                                        </button>
                                        <span className="text-stone-400 font-mono">SKU : {product.sku || `PROD-${product.id}`}</span>
                                    </div>
                                </div>
                                <h1 className="text-xl font-semibold text-stone-900 leading-snug">{product.name}</h1>
                                
                                <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                                    <span className="flex items-center gap-1 font-semibold text-stone-900">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        <span>{averageRating} / 5 ({totalReviews} avis)</span>
                                    </span>
                                    <span>•</span>
                                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>En Stock (Prêt à expédier)</span>
                                    </span>
                                </div>
                            </div>

                            {/* WHOLESALE TIER PRICING TABLE (ALIBABA STYLE MOQs) */}
                            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 space-y-2">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                                    Grille Tarifaire par Quantité (Prix Grossiste)
                                </span>
                                
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className={`p-2 rounded-lg border transition-all ${quantity < 5 ? 'bg-yellow-50 border-yellow-400 font-semibold text-yellow-950' : 'bg-white border-stone-200 text-stone-600'}`}>
                                        <span className="block text-[10px] text-stone-400">1 - 4 unités</span>
                                        <span className="font-bold">{Number(baseUnitPrice).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className={`p-2 rounded-lg border transition-all ${quantity >= 5 && quantity < 10 ? 'bg-yellow-50 border-yellow-400 font-semibold text-yellow-950' : 'bg-white border-stone-200 text-stone-600'}`}>
                                        <span className="block text-[10px] text-stone-400">5 - 9 unités (-5%)</span>
                                        <span className="font-bold">{Number(baseUnitPrice * 0.95).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className={`p-2 rounded-lg border transition-all ${quantity >= 10 ? 'bg-yellow-50 border-yellow-400 font-semibold text-yellow-950' : 'bg-white border-stone-200 text-stone-600'}`}>
                                        <span className="block text-[10px] text-stone-400">10+ unités (-10%)</span>
                                        <span className="font-bold">{Number(baseUnitPrice * 0.90).toLocaleString()} FCFA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Key Technical Summary Matrix */}
                            <div className="space-y-2 text-xs font-normal border-t border-stone-100 pt-3">
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                                        <span className="text-stone-400 block text-[10px]">Origine Expédition</span>
                                        <strong className="text-stone-800 font-semibold">{shop?.city || 'Douala, Cameroun'}</strong>
                                    </div>
                                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                                        <span className="text-stone-400 block text-[10px]">Délai de Livraison</span>
                                        <strong className="text-stone-800 font-semibold">24h à 48h max</strong>
                                    </div>
                                    {product.weight && (
                                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                                            <span className="text-stone-400 block text-[10px]">Poids Unitaire</span>
                                            <strong className="text-stone-800 font-semibold">{product.weight} kg</strong>
                                        </div>
                                    )}
                                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                                        <span className="text-stone-400 block text-[10px]">Commande Min. (MOQ)</span>
                                        <strong className="text-stone-800 font-semibold">1 pièce</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Counter & Total Price */}
                            <div className="space-y-3 pt-2 border-t border-stone-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-stone-700">Quantité désirée :</span>
                                    <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-lg p-1">
                                        <button 
                                            type="button" 
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            className="p-1 hover:bg-white rounded text-stone-600 transition-colors"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-bold text-xs px-2 text-stone-900">{quantity}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            className="p-1 hover:bg-white rounded text-stone-600 transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-stone-900 text-white rounded-xl p-3.5 flex justify-between items-center">
                                    <span className="text-xs text-stone-300 font-normal">Montant Total à Régler :</span>
                                    <span className="text-lg font-bold text-yellow-400">{Number(totalPrice).toLocaleString()} FCFA</span>
                                </div>

                                {/* Main Action Buttons */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            router.post(route('public.cart.add'), {
                                                product_id: product.id,
                                                quantity: quantity
                                            }, {
                                                onSuccess: () => {
                                                    router.get(route('public.cart.index'));
                                                }
                                            });
                                        }}
                                        disabled={product.stock <= 0}
                                        className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-yellow-500"
                                    >
                                        <ShoppingCart className="w-4.5 h-4.5 text-yellow-950" />
                                        <span>Ajouter au Panier & Voir le Panier</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        disabled={product.stock <= 0}
                                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-yellow-400" />
                                        <span>Achat Rapide 1-Click via Escrow</span>
                                    </button>
                                    <p className="text-[10px] text-stone-400 text-center font-normal">
                                        Validation instantanée avec Mobile Money (Orange / MTN MoMo).
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: VERIFIED SUPPLIER & SHOP PROFILE CARD (3 COLS) */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4 lg:col-span-3">
                            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Profil Fournisseur</h3>
                                <span className="bg-yellow-50 text-yellow-900 border border-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-yellow-600" />
                                    <span>Gold Supplier</span>
                                </span>
                            </div>

                            {shop && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                                            {shop.logo_path ? (
                                                <img src={`/storage/${shop.logo_path}`} alt={shop.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Store className="w-6 h-6 text-stone-400 stroke-[1.5]" />
                                            )}
                                        </div>
                                        <div className="truncate">
                                            <div className="flex items-center gap-1">
                                                <h4 className="font-semibold text-stone-900 text-xs truncate">{shop.name}</h4>
                                                <BadgeCheck className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                                            </div>
                                            <p className="text-[11px] text-stone-400 font-normal truncate">{shop.slogan || 'Boutique Certifiée'}</p>
                                        </div>
                                    </div>

                                    {/* Supplier Performance Metrics */}
                                    <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-3 space-y-2 text-xs font-normal">
                                        <div className="flex justify-between items-center">
                                            <span className="text-stone-400 text-[11px]">Note Vendeur :</span>
                                            <span className="font-bold text-stone-900 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span>4.9 / 5.0</span>
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-stone-400">Taux de Réponse :</span>
                                            <span className="font-semibold text-emerald-700">98.5% (&lt; 1h)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-stone-400">Expéditions à Temps :</span>
                                            <span className="font-semibold text-emerald-700">99.2%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-stone-600 font-normal pt-2 border-t border-stone-100">
                                        {sellerUser && (
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-stone-400">Gérant Agréé :</span>
                                                <strong className="text-stone-800 font-semibold">{sellerUser.first_name} {sellerUser.last_name}</strong>
                                            </div>
                                        )}
                                        {shop.rccm_number && (
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-stone-400">RCCM / Patente :</span>
                                                <strong className="text-stone-700 font-medium">{shop.rccm_number}</strong>
                                            </div>
                                        )}
                                        {shop.city && (
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-stone-400">Siège Social :</span>
                                                <span className="font-medium text-stone-700">{shop.city}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Link href={route('shop.public', shop.slug)}>
                                        <button className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors mt-2 shadow-2xs">
                                            Visiter le Store du Vendeur
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* DETAILED TABBED INFORMATION SECTIONS */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                        
                        {/* Tab Headers */}
                        <div className="flex items-center gap-3 border-b border-stone-200 pb-3 overflow-x-auto">
                            {[
                                { id: 'specs', label: 'Spécifications Techniques', icon: Layers },
                                { id: 'description', label: 'Description & Fiche Complète', icon: FileText },
                                { id: 'reviews', label: `Avis Clients Vérifiés (${totalReviews})`, icon: MessageSquare },
                                { id: 'supplier', label: 'Profil Officiel du Fournisseur', icon: Building2 },
                                { id: 'escrow', label: 'Garanties & Expédition Escrow', icon: ShieldCheck }
                            ].map((t) => {
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTab(t.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                                            activeTab === t.id
                                                ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500 font-bold'
                                                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{t.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Contents */}
                        <div className="pt-2">
                            {activeTab === 'specs' && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                                        Caractéristiques Techniques du Produit
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div className="flex justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                                            <span className="text-stone-400">Code Article / SKU :</span>
                                            <strong className="text-stone-800 font-mono">{product.sku || `SKU-${product.id}`}</strong>
                                        </div>
                                        <div className="flex justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                                            <span className="text-stone-400">Poids d'expédition :</span>
                                            <strong className="text-stone-800 font-semibold">{product.weight ? `${product.weight} kg` : 'Standard (< 1kg)'}</strong>
                                        </div>
                                        <div className="flex justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                                            <span className="text-stone-400">Disponibilité du Stock :</span>
                                            <strong className="text-emerald-700 font-semibold">{product.stock} pièces prêtes</strong>
                                        </div>
                                        <div className="flex justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                                            <span className="text-stone-400">Garantie & Support :</span>
                                            <strong className="text-stone-800 font-semibold">Garantie Retrait & Remboursement 48h</strong>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'description' && (
                                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Description Détaillée</h3>
                                    <p className="whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-200/60">
                                        {product.description || 'Aucune description spécifique fournie par le vendeur pour cet article.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-4 text-xs">
                                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                        <div>
                                            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Avis Client Authentiques & Vérifiés</h3>
                                            <p className="text-[11px] text-stone-500 mt-0.5">Seuls les acheteurs ayant confirmé la réception de leur commande peuvent publier un avis.</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-stone-900 text-sm">{averageRating} / 5</span>
                                            <span className="text-stone-500 text-[11px]">({totalReviews} avis)</span>
                                        </div>
                                    </div>

                                    {reviews && reviews.length > 0 ? (
                                        <div className="space-y-3">
                                            {reviews.map((rev) => (
                                                <div key={rev.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-stone-900">{rev.user ? `${rev.user.first_name} ${rev.user.last_name}` : 'Acheteur Vérifié'}</span>
                                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-medium">Achat Vérifié</span>
                                                        </div>
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-stone-700 text-xs">{rev.comment || 'Aucun commentaire écrit.'}</p>
                                                    <span className="text-[10px] text-stone-400 block pt-1">{new Date(rev.created_at).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-200/60 text-stone-400 space-y-1">
                                            <MessageSquare className="w-8 h-8 mx-auto text-stone-300" />
                                            <p className="font-medium text-stone-600">Aucun avis publié pour le moment</p>
                                            <p className="text-[11px]">Soyez le premier à commander et évaluer ce produit après livraison !</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'supplier' && shop && (
                                <div className="space-y-4 text-xs">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Informations d'Immatriculation du Vendeur</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 space-y-2">
                                            <span className="font-bold text-stone-900 block text-xs border-b pb-1">Boutique Officielle</span>
                                            <p className="flex justify-between"><span>Nom :</span> <strong className="text-stone-800">{shop.name}</strong></p>
                                            <p className="flex justify-between"><span>Slogan :</span> <span className="text-stone-600">{shop.slogan || 'N/A'}</span></p>
                                            <p className="flex justify-between"><span>Ville :</span> <span className="text-stone-800 font-medium">{shop.city || 'Douala'}</span></p>
                                        </div>
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 space-y-2">
                                            <span className="font-bold text-stone-900 block text-xs border-b pb-1">Conformité Légale</span>
                                            <p className="flex justify-between"><span>RCCM / Patente :</span> <strong className="text-stone-800 font-mono">{shop.rccm_number || 'En cours de vérification'}</strong></p>
                                            <p className="flex justify-between"><span>Statut KYC Vendeur :</span> <strong className="text-emerald-700 font-semibold">Vérifié & Validé</strong></p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'escrow' && (
                                <div className="space-y-3 text-xs text-stone-700">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Protection de l'Acheteur par Séquestre</h3>
                                    <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 space-y-2">
                                        <p className="font-medium text-yellow-950">Comment fonctionne la garantie Escrow Sellify ?</p>
                                        <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
                                            <li>Votre paiement Mobile Money est consigné sur un compte séquestre de garantie.</li>
                                            <li>Le vendeur prépare et expédie votre commande sous 24 à 48 heures.</li>
                                            <li>Une fois le colis livré, vous avez 48 heures pour vérifier sa conformité.</li>
                                            <li>Les fonds ne sont débloqués vers le vendeur qu'après votre accord final.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>

            {/* DIRECT FAST-CHECKOUT MODAL */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4 relative">
                        <button 
                            onClick={() => setIsCheckoutOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-yellow-700 border-b border-stone-100 pb-3">
                            <ShieldCheck className="w-5 h-5 text-yellow-600" />
                            <h3 className="font-bold text-stone-900 text-sm">Commande Rapide via Séquestre Escrow</h3>
                        </div>

                        <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-normal">
                            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex justify-between items-center">
                                <div>
                                    <strong className="text-stone-900 text-xs block">{product.name}</strong>
                                    <span className="text-[10px] text-stone-400">{quantity} unité(s) &bull; {Number(unitPrice).toLocaleString()} FCFA / unit</span>
                                </div>
                                <span className="font-bold text-stone-900 text-sm">{Number(totalPrice).toLocaleString()} FCFA</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Nom Complet :</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Ex: Jean Dupont"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Numéro Mobile Money (Payeur) :</label>
                                    <input 
                                        type="tel" 
                                        required
                                        placeholder="Ex: 699000000"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Adresse Précise de Livraison :</label>
                                    <textarea 
                                        required
                                        rows="2"
                                        placeholder="Ex: Douala, Quartier Akwa, Rue Silo"
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-yellow-400"
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors border border-yellow-500"
                            >
                                {processing ? 'Validation du paiement...' : `Payer ${Number(totalPrice).toLocaleString()} FCFA via Escrow`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
