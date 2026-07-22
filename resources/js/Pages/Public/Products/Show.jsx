import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
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
    Mail
} from 'lucide-react';

export default function Show({ product, shop, seller, sellerUser, relatedProducts = [] }) {
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
                <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white text-xs py-2 px-4 border-b border-stone-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-normal">
                        <div className="flex items-center gap-2">
                            <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Trade Assurance
                            </span>
                            <span className="text-stone-300 text-[11px]">
                                Produit Vérifié & Commande Protégée par le Séquestre Sellify. Remboursement garanti si non conforme.
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-amber-400 font-medium">
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
                                    <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
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
                                                    ? 'border-amber-500 ring-2 ring-amber-500/20' 
                                                    : 'border-stone-200 opacity-75 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt={`Miniature ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Trade Protection Summary Card */}
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3 text-xs text-amber-950 font-normal shadow-2xs">
                                <div className="flex items-center gap-2 font-semibold text-amber-900 border-b border-amber-200/60 pb-2">
                                    <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
                                    <span>Engagement Acheteur Sellify Escrow</span>
                                </div>
                                <p className="text-[11px] text-stone-600 leading-relaxed">
                                    Vos fonds restent sécurisés sur un compte séquestre neutre. Le vendeur ne perçoit son paiement qu'après votre confirmation de réception et conformité sous 48h.
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 pt-1">
                                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-amber-600" /> Expédié sous 24h</span>
                                    <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-amber-600" /> Orange / MTN MoMo</span>
                                    <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Retour gratuit si défaut</span>
                                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-amber-600" /> Facture Certifiée</span>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE COLUMN: SPECS, WHOLESALE MOQs & BUY ACTION (4 COLS) */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-5 lg:col-span-4">
                            
                            {/* Product Header & SKU */}
                            <div className="space-y-2 border-b border-stone-100 pb-3">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="bg-amber-100 text-amber-950 font-semibold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                        Fournisseur Certifié
                                    </span>
                                    <span className="text-stone-400 font-mono">SKU : {product.sku || `PROD-${product.id}`}</span>
                                </div>
                                <h1 className="text-xl font-semibold text-stone-900 leading-snug">{product.name}</h1>
                                
                                <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                                    <span className="flex items-center gap-1 font-semibold text-stone-900">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span>4.9 / 5</span>
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
                                    <div className={`p-2 rounded-lg border transition-all ${quantity < 5 ? 'bg-amber-50 border-amber-400 font-semibold text-amber-950' : 'bg-white border-stone-200 text-stone-600'}`}>
                                        <span className="block text-[10px] text-stone-400">1 - 4 unités</span>
                                        <span className="font-bold">{Number(baseUnitPrice).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className={`p-2 rounded-lg border transition-all ${quantity >= 5 && quantity < 10 ? 'bg-amber-50 border-amber-400 font-semibold text-amber-950' : 'bg-white border-stone-200 text-stone-600'}`}>
                                        <span className="block text-[10px] text-stone-400">5 - 9 unités (-5%)</span>
                                        <span className="font-bold">{Number(baseUnitPrice * 0.95).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className={`p-2 rounded-lg border transition-all ${quantity >= 10 ? 'bg-amber-50 border-amber-400 font-semibold text-amber-950' : 'bg-white border-stone-200 text-stone-600'}`}>
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
                                    <span className="text-lg font-bold text-amber-400">{Number(totalPrice).toLocaleString()} FCFA</span>
                                </div>

                                {/* Main Action Buttons */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        disabled={product.stock <= 0}
                                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck className="w-4.5 h-4.5 text-amber-950" />
                                        <span>Commander Directement via Escrow</span>
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
                                <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-600" />
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
                                                <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                            </div>
                                            <p className="text-[11px] text-stone-400 font-normal truncate">{shop.slogan || 'Boutique Certifiée'}</p>
                                        </div>
                                    </div>

                                    {/* Supplier Performance Metrics (Alibaba Style) */}
                                    <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-3 space-y-2 text-xs font-normal">
                                        <div className="flex justify-between items-center">
                                            <span className="text-stone-400 text-[11px]">Note Vendeur :</span>
                                            <span className="font-bold text-stone-900 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
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

                    {/* DETAILED TABBED INFORMATION SECTIONS (ALIBABA STYLE SPECS & DETAILS) */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                        
                        {/* Tab Headers */}
                        <div className="flex items-center gap-3 border-b border-stone-200 pb-3 overflow-x-auto">
                            {[
                                { id: 'specs', label: 'Spécifications Techniques', icon: Layers },
                                { id: 'description', label: 'Description & Fiche Complète', icon: FileText },
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
                                                ? 'bg-amber-500 text-amber-950 shadow-2xs'
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
                                            <span className="text-stone-400">Commande Minimale (MOQ) :</span>
                                            <strong className="text-stone-800 font-semibold">1 pièce</strong>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'description' && (
                                <div className="space-y-3 text-xs text-stone-700 font-normal leading-relaxed whitespace-pre-line">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                                        Description & Conseils d'Utilisation
                                    </h3>
                                    <p className="p-4 bg-stone-50 rounded-xl border border-stone-200/60">
                                        {product.description || 'Aucune description détaillée n’a été rédigée pour cet article.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'supplier' && (
                                <div className="space-y-4 text-xs font-normal">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                                        Informations Légales & Certification Vendeur
                                    </h3>
                                    {shop && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                                                <span className="text-stone-400 text-[11px] block">Raison Sociale :</span>
                                                <strong className="text-stone-900 font-semibold text-sm">{shop.company_name}</strong>
                                            </div>
                                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                                                <span className="text-stone-400 text-[11px] block">Immatriculation RCCM :</span>
                                                <strong className="text-stone-900 font-semibold text-sm">{shop.rccm_number || 'Non Renseigné'}</strong>
                                            </div>
                                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                                                <span className="text-stone-400 text-[11px] block">Localisation Siège :</span>
                                                <strong className="text-stone-900 font-semibold text-sm">{shop.address}, {shop.city}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'escrow' && (
                                <div className="space-y-4 text-xs text-stone-700 font-normal">
                                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                                        Procédure de Protection Acheteur & Séquestre Escrow
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                                            <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 font-bold flex items-center justify-center text-xs">1</span>
                                            <h4 className="font-semibold text-amber-950">Paiement Sécurisé</h4>
                                            <p className="text-[11px] text-stone-600">Votre paiement est bloqué sur un compte neutre garanti.</p>
                                        </div>
                                        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                                            <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 font-bold flex items-center justify-center text-xs">2</span>
                                            <h4 className="font-semibold text-amber-950">Livraison Express</h4>
                                            <p className="text-[11px] text-stone-600">Le livreur partenaire vous remet le colis sous 24h-48h.</p>
                                        </div>
                                        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                                            <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 font-bold flex items-center justify-center text-xs">3</span>
                                            <h4 className="font-semibold text-amber-950">Libération des Fonds</h4>
                                            <p className="text-[11px] text-stone-600">Le vendeur est payé seulement après votre validation.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RELATED PRODUCTS FROM THE SAME SUPPLIER */}
                    {relatedProducts.length > 0 && (
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                <h3 className="text-sm font-semibold text-stone-900">
                                    Autres articles en stock chez {shop?.name}
                                </h3>
                                <Link href={route('shop.public', shop?.slug || '#')} className="text-xs text-amber-700 font-medium hover:underline">
                                    Voir tout le catalogue du vendeur
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedProducts.map((rel) => {
                                    const firstImg = rel.image_paths && rel.image_paths[0] ? `/storage/${rel.image_paths[0]}` : null;
                                    const relPromo = rel.active_promotion !== null;

                                    return (
                                        <div key={rel.id} className="border border-stone-200/70 rounded-xl p-3 bg-stone-50/40 hover:bg-white hover:shadow-sm transition-all space-y-2">
                                            <div className="w-full h-36 bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                {firstImg ? (
                                                    <img src={firstImg} alt={rel.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-stone-300 stroke-[1.5]" />
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-stone-900 text-xs truncate">{rel.name}</h4>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-stone-900">
                                                    {Number(relPromo ? rel.active_promotion.promo_price : rel.price).toLocaleString()} FCFA
                                                </span>
                                                <Link href={route('public.products.show', rel.slug)} className="text-[11px] text-amber-700 font-semibold hover:underline">
                                                    Voir
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>

                {/* MODAL CHECKOUT DIRECT ESCROW */}
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 text-stone-800">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-semibold text-stone-900 text-sm">Commande Directe Escrow</h3>
                                </div>
                                <button onClick={() => setIsCheckoutOpen(false)} className="text-stone-400 hover:text-stone-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-normal">
                                
                                {/* Product Summary & Quantity Selector */}
                                <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-3.5 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-stone-900 text-xs">{product.name}</h4>
                                        <p className="text-[11px] text-stone-500 font-normal">Prix unitaire : {Number(unitPrice).toLocaleString()} FCFA</p>
                                    </div>

                                    {/* Quantity Counter */}
                                    <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-1">
                                        <button 
                                            type="button" 
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            className="p-1 hover:bg-stone-100 rounded text-stone-600"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="font-semibold text-xs px-1 text-stone-900">{quantity}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            className="p-1 hover:bg-stone-100 rounded text-stone-600"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Customer info form */}
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Nom Complet du Destinataire *</label>
                                    <input
                                        type="text"
                                        value={data.customer_name}
                                        onChange={e => setData('customer_name', e.target.value)}
                                        placeholder="ex: Paul Biya"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                        required
                                    />
                                    {errors.customer_name && <p className="text-[11px] text-red-600 mt-1">{errors.customer_name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-medium text-stone-700 mb-1">Téléphone Livraison *</label>
                                        <input
                                            type="text"
                                            value={data.customer_phone}
                                            onChange={e => setData('customer_phone', e.target.value)}
                                            placeholder="ex: 690000000"
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            required
                                        />
                                        {errors.customer_phone && <p className="text-[11px] text-red-600 mt-1">{errors.customer_phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block font-medium text-stone-700 mb-1">Ville de Livraison *</label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Adresse ou Quartier de Livraison *</label>
                                    <input
                                        type="text"
                                        value={data.delivery_address}
                                        onChange={e => setData('delivery_address', e.target.value)}
                                        placeholder="ex: Akwa, Carrefour Douala"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                        required
                                    />
                                </div>

                                {/* Payment Method Selector */}
                                <div>
                                    <label className="block font-medium text-stone-700 mb-1">Mode de Paiement Séquestre *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setData('payment_method', 'orange_money')}
                                            className={`p-2.5 border rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                                                data.payment_method === 'orange_money' 
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold' 
                                                    : 'bg-white border-stone-200 text-stone-600'
                                            }`}
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                            <span>Orange Money</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('payment_method', 'mtn_momo')}
                                            className={`p-2.5 border rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                                                data.payment_method === 'mtn_momo' 
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold' 
                                                    : 'bg-white border-stone-200 text-stone-600'
                                            }`}
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                            <span>MTN MoMo</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Total Summary */}
                                <div className="bg-stone-900 text-white rounded-xl p-3.5 flex justify-between items-center">
                                    <span className="text-xs font-normal">Montant Total Escrow :</span>
                                    <span className="text-base font-semibold text-amber-400">{Number(totalPrice).toLocaleString()} FCFA</span>
                                </div>

                                <div className="pt-2 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCheckoutOpen(false)}
                                        className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold rounded-lg shadow-xs transition-colors"
                                    >
                                        {processing ? 'Traitement...' : 'Payer & Valider la Commande'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </PublicLayout>
    );
}
