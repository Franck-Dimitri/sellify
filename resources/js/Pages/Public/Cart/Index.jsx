import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { 
    ShoppingCart, 
    Trash2, 
    Plus, 
    Minus, 
    ArrowRight, 
    Package, 
    ShieldCheck, 
    Store, 
    Truck, 
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Lock,
    CreditCard,
    BadgeCheck,
    Flame
} from 'lucide-react';

export default function Index({ cartItems = [], groupedShops = {}, grandTotal = 0 }) {

    const handleQuantityChange = (itemId, newQty) => {
        if (newQty < 1) return;
        router.post(route('public.cart.update', itemId), {
            quantity: newQty
        }, { preserveScroll: true });
    };

    const handleRemove = (itemId) => {
        router.delete(route('public.cart.remove', itemId), { preserveScroll: true });
    };

    const handleClearCart = () => {
        if (confirm('Voulez-vous vraiment vider l\'ensemble de votre panier ?')) {
            router.post(route('public.cart.clear'), {}, { preserveScroll: true });
        }
    };

    const shopIds = Object.keys(groupedShops || {});
    const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const estimatedShipping = shopIds.length > 0 ? shopIds.length * 1500 : 0;
    const finalTotal = grandTotal + estimatedShipping;

    return (
        <PublicLayout>
            <Head title="Votre Panier d'Achat Sécurisé - Sellify.me" />

            <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 font-sans text-stone-700 antialiased">
                
                {/* TOP HEADER */}
                <div className="bg-white border-b border-stone-200/80 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-yellow-700 flex items-center justify-center font-bold shadow-2xs">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                                        Mon Panier d'Achat
                                    </h1>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300">
                                        {totalCount} article{totalCount > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500 font-normal mt-0.5">
                                    Commandes groupées par boutique avec garantie sous séquestre Escrow et tarifs de gros automatiques.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <Link 
                                href={route('public.products.index')}
                                className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 hover:underline"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Continuer mes achats</span>
                            </Link>

                            {cartItems.length > 0 && (
                                <button 
                                    onClick={handleClearCart}
                                    className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Vider le panier</span>
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    
                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200/80 space-y-5 max-w-lg mx-auto my-8 shadow-2xs">
                            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-yellow-700 mx-auto flex items-center justify-center shadow-2xs">
                                <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="font-semibold text-stone-900 text-lg">Votre panier est actuellement vide</h3>
                                <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed max-w-sm mx-auto">
                                    Découvrez nos milliers d'articles vérifiés, promotions exclusives et boutiques certifiées partout en Afrique.
                                </p>
                            </div>
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href={route('public.products.index')}>
                                    <button className="w-full sm:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                        <span>Explorer le Marketplace</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </Link>
                                <Link href={route('public.products.index', { on_sale: 1 })}>
                                    <button className="w-full sm:w-auto px-5 py-3 bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-xs rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                        <Flame className="w-3.5 h-3.5 text-red-500" />
                                        <span>Ventes Flash</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* LEFT COLUMN: ITEMS GROUPED BY VENDOR (8 COLS) */}
                            <div className="lg:col-span-8 space-y-6">
                                {shopIds.map((shopId) => {
                                    const shopItems = groupedShops[shopId];
                                    const shopInfo = shopItems[0]?.shop;
                                    const shopSubtotal = shopItems.reduce((acc, it) => acc + (parseFloat(it.subtotal) || 0), 0);

                                    return (
                                        <div key={shopId} className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
                                            
                                            {/* Shop Header Pill */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-yellow-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                        <Store className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            {shopInfo?.slug ? (
                                                                <Link 
                                                                    href={route('shop.public', shopInfo.slug)} 
                                                                    className="font-semibold text-stone-900 text-sm hover:text-yellow-700 transition-colors"
                                                                >
                                                                    {shopInfo?.name || 'Boutique Certifiée'}
                                                                </Link>
                                                            ) : (
                                                                <span className="font-semibold text-stone-900 text-sm">{shopInfo?.name}</span>
                                                            )}
                                                            <BadgeCheck className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                                                        </div>
                                                        <span className="text-[11px] text-stone-400 font-normal">
                                                            📍 {shopInfo?.city || 'Douala, Cameroun'} &bull; Expédié sous 24h
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                    <span>Séquestre Escrow Protégé</span>
                                                </span>
                                            </div>

                                            {/* Shop Item Rows */}
                                            <div className="divide-y divide-stone-100">
                                                {shopItems.map((item) => (
                                                    <div key={item.id} className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        
                                                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                                                            <div className="w-18 h-18 bg-stone-50 border border-stone-200/80 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                                                                {item.image ? (
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-xl" />
                                                                ) : (
                                                                    <Package className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                                                )}
                                                            </div>

                                                            <div className="space-y-1">
                                                                <Link 
                                                                    href={route('public.products.show', item.slug)} 
                                                                    className="font-semibold text-stone-900 text-xs sm:text-sm hover:text-yellow-700 transition-colors line-clamp-1"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                                
                                                                <div className="flex items-center gap-2 text-xs text-stone-500 font-normal">
                                                                    <span>{Number(item.unit_price).toLocaleString()} FCFA / unité</span>
                                                                    {item.quantity >= 5 && (
                                                                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                                                            {item.quantity >= 10 ? '-10% Grossiste' : '-5% Remise'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Stepper & Subtotal Action */}
                                                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                                                            
                                                            {/* Stepper */}
                                                            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl p-1 shadow-2xs">
                                                                <button 
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                                                                    title="Diminuer la quantité"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5" />
                                                                </button>
                                                                <span className="font-semibold text-xs text-stone-900 w-8 text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button 
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                                                                    title="Augmenter la quantité"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>

                                                            {/* Item Total & Trash */}
                                                            <div className="text-right min-w-[100px]">
                                                                <span className="font-semibold text-stone-900 text-sm block">
                                                                    {Number(item.subtotal).toLocaleString()} FCFA
                                                                </span>
                                                                <button 
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium hover:underline inline-flex items-center gap-0.5 cursor-pointer mt-0.5"
                                                                >
                                                                    <span>Supprimer</span>
                                                                </button>
                                                            </div>

                                                        </div>

                                                    </div>
                                                ))}
                                            </div>

                                            {/* Subtotal of Shop */}
                                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-normal">
                                                <span>Sous-total pour {shopInfo?.name} :</span>
                                                <span className="font-semibold text-stone-900 text-xs">
                                                    {Number(shopSubtotal).toLocaleString()} FCFA
                                                </span>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                            {/* RIGHT COLUMN: STICKY ORDER SUMMARY (4 COLS) */}
                            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
                                
                                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-5">
                                    <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                                        <h3 className="font-semibold text-stone-900 text-sm">
                                            Récapitulatif de Commande
                                        </h3>
                                        <span className="text-[10px] font-semibold text-yellow-800 uppercase bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                            Séquestre Actif
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-xs font-normal text-stone-600">
                                        <div className="flex justify-between">
                                            <span>Sous-total articles ({totalCount}) :</span>
                                            <span className="text-stone-900 font-semibold">{Number(grandTotal).toLocaleString()} FCFA</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Livraison coursier estimée :</span>
                                            <span className="text-stone-900 font-semibold">{Number(estimatedShipping).toLocaleString()} FCFA</span>
                                        </div>

                                        <div className="flex justify-between text-emerald-700 font-medium bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl">
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                <span>Garantie Escrow Séquestre :</span>
                                            </span>
                                            <span className="font-semibold">Gratuit (0 FCFA)</span>
                                        </div>
                                    </div>

                                    {/* Total Box */}
                                    <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                                        <div>
                                            <span className="text-xs text-stone-400 font-normal block">Total à consigner :</span>
                                            <span className="text-xl font-semibold text-stone-950 tracking-tight">
                                                {Number(finalTotal).toLocaleString()} FCFA
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-stone-400 font-normal">TVA incluse</span>
                                    </div>

                                    {/* Checkout CTA */}
                                    <Link href={route('public.checkout.index')}>
                                        <button className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-500">
                                            <span>Procéder au Paiement Escrow</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>

                                    {/* Accepted payment methods */}
                                    <div className="pt-2 text-center space-y-2">
                                        <span className="text-[10px] text-stone-400 font-normal block">
                                            Paiements directs sécurisés par HR-Skills Pay :
                                        </span>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="flex items-center gap-1 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg shadow-2xs">
                                                <img 
                                                    src="/images/payments/orange_money.jpg" 
                                                    alt="Orange Money" 
                                                    className="w-4 h-4 rounded object-cover" 
                                                />
                                                <span className="text-[10px] font-semibold text-stone-800">Orange Money</span>
                                            </div>
                                            <div className="flex items-center gap-1 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg shadow-2xs">
                                                <img 
                                                    src="/images/payments/mtn_momo.jpg" 
                                                    alt="MTN MoMo" 
                                                    className="w-4 h-4 rounded object-cover" 
                                                />
                                                <span className="text-[10px] font-semibold text-stone-800">MTN MoMo</span>
                                            </div>
                                            <div className="flex items-center gap-1 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg shadow-2xs">
                                                <img 
                                                    src="/images/payments/visa.jpg" 
                                                    alt="Visa" 
                                                    className="w-4 h-4 rounded object-cover" 
                                                />
                                                <span className="text-[10px] font-semibold text-stone-800">Visa</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Reassurance Card */}
                                <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 text-xs font-normal text-yellow-950 space-y-3 shadow-2xs">
                                    <div className="flex items-center gap-2 font-semibold text-yellow-950 text-xs">
                                        <Lock className="w-4 h-4 text-yellow-700" />
                                        <span>Protocole Zéro Risque Sellify</span>
                                    </div>
                                    <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                                        Le montant reste verrouillé sur le compte séquestre. Le vendeur ne reçoit son virement qu'après remise en main propre et validation de votre <strong>code secret OTP</strong>.
                                    </p>
                                    <div className="space-y-1.5 text-[11px] text-stone-700 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span>Remboursement intégral sous 48h si litige</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span>Suivi du livreur par GPS en direct</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </PublicLayout>
    );
}
