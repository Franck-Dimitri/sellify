import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
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
    Sparkles
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
        if (confirm('Voulez-vous vraiment vider votre panier ?')) {
            router.post(route('public.cart.clear'), {}, { preserveScroll: true });
        }
    };

    return (
        <PublicLayout>
            <Head title="Votre Panier d'Achat - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 font-sans text-stone-800 antialiased">
                
                {/* HEADER BANNER */}
                <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold shadow-xs border border-yellow-500">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-stone-900 tracking-tight">Votre Panier Personnel</h1>
                                <p className="text-xs text-stone-500 font-normal">
                                    {cartItems.length} article(s) sélectionné(s) &bull; Tarifs dégressifs grossistes (MOQ) calculés automatiquement
                                </p>
                            </div>
                        </div>

                        {cartItems.length > 0 && (
                            <button 
                                onClick={handleClearCart}
                                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Vider le panier</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    
                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80 space-y-4 max-w-lg mx-auto my-10 shadow-2xs">
                            <div className="w-16 h-16 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 mx-auto flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-base">Votre panier est actuellement vide</h3>
                            <p className="text-xs text-stone-500 font-normal">
                                Explorez nos milliers de produits grossistes et détaillants certifiés Verified sur Sellify.me.
                            </p>
                            <Link href={route('public.products.index')}>
                                <button className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-full shadow-xs transition-colors border border-yellow-500">
                                    Découvrir le Catalogue Marketplace
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* LEFT COLUMN: ITEMS GROUPED BY SHOP (8 COLS) */}
                            <div className="lg:col-span-8 space-y-6">
                                {Object.keys(groupedShops).map((shopId) => {
                                    const shopItems = groupedShops[shopId];
                                    const shopInfo = shopItems[0]?.shop;

                                    return (
                                        <div key={shopId} className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                            
                                            {/* Shop Header */}
                                            <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-4 h-4 text-yellow-600" />
                                                    <span className="font-bold text-stone-900 text-sm">{shopInfo?.name}</span>
                                                    <span className="text-[10px] text-stone-400 font-normal flex items-center gap-1">
                                                        <span>🇨🇲 {shopInfo?.city}</span>
                                                    </span>
                                                </div>
                                                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                    Vendeur Certifié
                                                </span>
                                            </div>

                                            {/* Shop Items List */}
                                            <div className="space-y-3">
                                                {shopItems.map((item) => (
                                                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
                                                        
                                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                                            <div className="w-16 h-16 bg-white border border-stone-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                                                                {item.image ? (
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                                                ) : (
                                                                    <Package className="w-6 h-6 text-stone-300" />
                                                                )}
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <Link href={route('public.products.show', item.slug)} className="font-semibold text-stone-900 text-xs hover:text-yellow-600 transition-colors line-clamp-1">
                                                                    {item.name}
                                                                </Link>
                                                                <div className="text-[11px] text-stone-500 font-normal">
                                                                    Prix unitaire appliqué : <strong className="text-stone-900">{Number(item.unit_price).toLocaleString()} FCFA</strong>
                                                                    {item.quantity >= 5 && (
                                                                        <span className="text-emerald-700 font-bold ml-1 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                                                                            {item.quantity >= 10 ? '-10% Grossiste' : '-5% Remise'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quantity & Action Controls */}
                                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-1">
                                                                <button 
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                    className="p-1 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5" />
                                                                </button>
                                                                <span className="font-bold text-xs px-2">{item.quantity}</span>
                                                                <button 
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                    className="p-1 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>

                                                            <div className="text-right">
                                                                <span className="font-bold text-stone-900 text-xs block">
                                                                    {Number(item.subtotal).toLocaleString()} FCFA
                                                                </span>
                                                                <button 
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="text-[10px] text-red-500 hover:text-red-700 font-medium underline"
                                                                >
                                                                    Supprimer
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                            {/* RIGHT COLUMN: ORDER SUMMARY (4 COLS) */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
                                    <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                                        Récapitulatif de Commande
                                    </h3>

                                    <div className="space-y-2 text-xs font-normal text-stone-600">
                                        <div className="flex justify-between">
                                            <span>Sous-total des produits :</span>
                                            <strong className="text-stone-900 font-semibold">{Number(grandTotal).toLocaleString()} FCFA</strong>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Frais de livraison estimés :</span>
                                            <strong className="text-stone-900 font-semibold">1 500 FCFA</strong>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-[#12b886] pt-1">
                                            <span>Garantie Séquestre Escrow :</span>
                                            <span>Inclus 🛡️</span>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-sm font-bold text-stone-900">
                                        <span>Total à Régler :</span>
                                        <span className="text-base text-yellow-700">{Number(grandTotal + 1500).toLocaleString()} FCFA</span>
                                    </div>

                                    <Link href={route('public.checkout.index')}>
                                        <button className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-yellow-500 mt-2">
                                            <span>Procéder au Paiement Escrow</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>

                                {/* Trust Protection Banner */}
                                <div className="bg-yellow-50/80 border border-yellow-200/80 rounded-2xl p-4 text-xs font-normal text-yellow-950 space-y-2">
                                    <div className="flex items-center gap-1.5 font-bold text-yellow-900">
                                        <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                        <span>Paiement 100% Protégé par Escrow</span>
                                    </div>
                                    <p className="text-[11px] text-stone-600 leading-relaxed">
                                        Votre argent est conservé en lieu sûr. Le vendeur ne reçoit les fonds qu'après votre confirmation de réception du colis conforme.
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </PublicLayout>
    );
}
