import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { 
    Package, 
    ShieldCheck, 
    Truck, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Eye, 
    Store, 
    Key, 
    XCircle,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';

export default function Index({ orders }) {
    const [disputeModalOrder, setDisputeModalOrder] = useState(null);
    const [disputeReason, setDisputeReason] = useState('');

    const handleConfirmDelivery = (orderNumber) => {
        if (confirm('Voulez-vous vraiment confirmer la réception de votre colis ? Cette action libèrera définitivement les fonds au vendeur.')) {
            router.post(route('customer.orders.confirm', orderNumber), {}, { preserveScroll: true });
        }
    };

    const handleOpenDispute = (e) => {
        e.preventDefault();
        if (!disputeModalOrder) return;
        router.post(route('customer.orders.dispute', disputeModalOrder.order_number), {
            reason: disputeReason
        }, {
            onSuccess: () => {
                setDisputeModalOrder(null);
                setDisputeReason('');
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Mes Commandes & Suivi Escrow - Sellify.me" />

            <div className="w-full bg-[#f4f4f4] min-h-screen pb-20 font-sans text-stone-800 antialiased">
                
                {/* HEADER BANNER */}
                <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold shadow-xs border border-yellow-500">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-stone-900 tracking-tight">Mes Commandes Client</h1>
                                <p className="text-xs text-stone-500 font-normal">
                                    Suivez vos colis, consultez votre code OTP de livraison et gérez vos confirmations Escrow
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                    
                    {orders.data.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80 space-y-4 max-w-lg mx-auto shadow-2xs">
                            <Package className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5]" />
                            <h3 className="font-bold text-stone-900 text-base">Aucune commande enregistrée</h3>
                            <p className="text-xs text-stone-500 font-normal">
                                Vous n'avez pas encore passé de commande sur Sellify.me.
                            </p>
                            <Link href={route('public.products.index')}>
                                <button className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-full shadow-xs transition-colors border border-yellow-500">
                                    Explorer les Produits
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => {
                                const isDelivered = order.delivery_status === 'delivered';
                                const isDisputed = order.dispute !== null || order.delivery_status === 'cancelled';

                                return (
                                    <div 
                                        key={order.id} 
                                        className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-4 hover:border-yellow-400 transition-all"
                                    >
                                        {/* Order Header Bar */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 text-xs">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-bold text-stone-900 text-sm">
                                                    #{order.order_number}
                                                </span>
                                                <span className="text-stone-400">•</span>
                                                <span className="text-stone-500 flex items-center gap-1 font-medium">
                                                    <Store className="w-3.5 h-3.5 text-stone-400" />
                                                    <span>{order.shop?.name}</span>
                                                </span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2">
                                                {isDelivered ? (
                                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>Livré & Conforme</span>
                                                    </span>
                                                ) : isDisputed ? (
                                                    <span className="bg-red-50 text-red-800 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                                        <span>Litige Ouvert</span>
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-50 text-yellow-900 border border-yellow-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5 text-yellow-600" />
                                                        <span>En Cours de Livraison (Escrow Consigné)</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Info & Delivery OTP Code */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-normal">
                                            
                                            {/* Products Summary (6 cols) */}
                                            <div className="md:col-span-6 space-y-2">
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Articles commandés :</span>
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center bg-stone-50 p-2 rounded-lg border border-stone-100">
                                                        <span className="font-semibold text-stone-800 truncate max-w-xs">{item.product_name}</span>
                                                        <span className="text-stone-600">{item.quantity} x {Number(item.unit_price).toLocaleString()} FCFA</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Delivery OTP & Total Amount (6 cols) */}
                                            <div className="md:col-span-6 bg-stone-50/80 border border-stone-200/60 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
                                                
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Code OTP à Donner au Livreur :</span>
                                                        <strong className="text-lg font-mono font-black text-amber-700 tracking-widest block pt-0.5">
                                                            {order.delivery_otp}
                                                        </strong>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Réglé :</span>
                                                        <strong className="text-sm font-bold text-stone-900">{Number(order.total_amount).toLocaleString()} FCFA</strong>
                                                    </div>
                                                </div>

                                                {/* Customer Action Buttons */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60">
                                                    {!isDelivered && !isDisputed && (
                                                        <>
                                                            <button
                                                                onClick={() => handleConfirmDelivery(order.order_number)}
                                                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1"
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span>Colis Reçu & Conforme</span>
                                                            </button>

                                                            <button
                                                                onClick={() => setDisputeModalOrder(order)}
                                                                className="px-3.5 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 font-medium text-xs rounded-xl transition-colors"
                                                            >
                                                                Signaler Problème
                                                            </button>
                                                        </>
                                                    )}

                                                    <Link href={route('public.order_tracking', order.order_number)} className="ml-auto">
                                                        <button className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            <span>Suivi En Direct</span>
                                                        </button>
                                                    </Link>
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

            </div>

            {/* DISPUTE MODAL */}
            {disputeModalOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
                        <div className="flex items-center gap-2 text-red-600 border-b border-stone-100 pb-3">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-bold text-stone-900 text-sm">Ouvrir un Litige Commercial (#{disputeModalOrder.order_number})</h3>
                        </div>

                        <form onSubmit={handleOpenDispute} className="space-y-4 text-xs font-normal">
                            <p className="text-stone-600 leading-relaxed">
                                Décrivez en détail le motif de votre réclamation (ex: produit défectueux, article manquant ou non livré). Le service d'arbitrage Sellify suspendra les fonds.
                            </p>

                            <div>
                                <label className="block text-[11px] font-medium text-stone-700 mb-1">Motif de la réclamation :</label>
                                <textarea 
                                    required
                                    rows="4"
                                    placeholder="Expliquez précisément le problème rencontré..."
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-400 font-normal"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDisputeModalOrder(null)}
                                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                                >
                                    Transmettre au Service Arbitrage
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
