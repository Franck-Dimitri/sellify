import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import LiveOrderTrackingMap from '@/Components/LiveOrderTrackingMap';
import { 
    ArrowLeft, 
    ShieldCheck, 
    Truck, 
    Package, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Store, 
    Phone, 
    MapPin, 
    Key, 
    AlertTriangle,
    X,
    ExternalLink,
    FileText,
    Star,
    Ban,
    Navigation,
    Compass
} from 'lucide-react';

export default function Show({ order }) {
    const [isDisputeOpen, setIsDisputeOpen] = useState(false);
    const [reviewModalItem, setReviewModalItem] = useState(null);
    const [rating, setRating] = useState(5);
    const [driverRating, setDriverRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewPhoto, setReviewPhoto] = useState(null);

    const { post: confirmPost, processing: confirmProcessing } = useForm();
    const { post: cancelPost, processing: cancelProcessing } = useForm();
    
    const { data: disputeData, setData: setDisputeData, post: disputePost, processing: disputeProcessing } = useForm({
        reason: '',
        evidence: '',
    });

    const handleConfirmDelivery = () => {
        if (confirm('Confirmez-vous que vous avez bien reçu et vérifié votre commande ? Cette action débloquera définitivement le paiement au vendeur.')) {
            confirmPost(route('customer.orders.confirm', order.order_number));
        }
    };

    const handleCancelOrder = () => {
        if (confirm('Voulez-vous vraiment annuler cette commande ? Les fonds sous séquestre vous seront totalement remboursés.')) {
            cancelPost(route('customer.orders.cancel', order.order_number));
        }
    };

    const handleReorder = () => {
        router.post(route('customer.orders.reorder', order.order_number));
    };

    const handleDisputeSubmit = (e) => {
        e.preventDefault();
        disputePost(route('customer.orders.dispute', order.order_number), {
            onSuccess: () => setIsDisputeOpen(false)
        });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewModalItem) return;
        
        const formData = new FormData();
        formData.append('product_id', reviewModalItem.product_id);
        formData.append('rating', rating);
        formData.append('driver_rating', driverRating);
        formData.append('comment', comment);
        if (reviewPhoto) {
            formData.append('photo', reviewPhoto);
        }

        router.post(route('customer.orders.review', order.order_number), formData, {
            forceFormData: true,
            onSuccess: () => {
                setReviewModalItem(null);
                setComment('');
                setRating(5);
                setDriverRating(5);
                setReviewPhoto(null);
            }
        });
    };

    const steps = [
        { key: 'ordered', label: 'Commande passée', done: true },
        { key: 'paid', label: 'Escrow sécurisé', done: order.payment_status === 'escrow_held' || order.payment_status === 'released' },
        { key: 'prep', label: 'En préparation', done: ['preparing', 'ready_for_pickup', 'in_transit', 'delivered'].includes(order.delivery_status) },
        { key: 'transit', label: 'En livraison', done: ['in_transit', 'delivered'].includes(order.delivery_status) },
        { key: 'delivered', label: 'Livré & Validé', done: order.delivery_status === 'delivered' || order.payment_status === 'released' },
    ];

    const canCancel = ['pending', 'preparing'].includes(order.delivery_status) && order.payment_status !== 'refunded';
    const isDelivered = order.delivery_status === 'delivered' || order.payment_status === 'released';

    return (
        <CustomerLayout title={`Commande ${order.order_number}`}>
            <Head title={`Commande ${order.order_number} - Sellify`} />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16 max-w-5xl mx-auto">
                
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Link 
                            href={route('customer.orders.index')}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-stone-900">{order.order_number}</h1>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                                    order.delivery_status === 'cancelled'
                                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                                        : 'bg-yellow-50 text-yellow-900 border-yellow-200'
                                }`}>
                                    {order.delivery_status === 'cancelled' ? 'Commande Annulée' : 'Paiement Escrow Sécurisé'}
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Boutique : <span className="font-medium text-stone-800">{order.shop?.name}</span> • Commande du {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* 1-Click Re-order Button (Sub-Module 2.1.8) */}
                        <button
                            onClick={handleReorder}
                            className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <Package className="w-3.5 h-3.5" />
                            <span>Re-commander en 1 clic</span>
                        </button>

                        <a
                            href={route('customer.orders.invoice', order.order_number)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Facture PDF</span>
                        </a>

                        {/* Order Cancel Button */}
                        {canCancel && (
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelProcessing}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Annuler la commande</span>
                            </button>
                        )}

                        {/* Direct Escrow Release Button */}
                        {order.payment_status === 'escrow_held' && order.delivery_status !== 'cancelled' && (
                            <button
                                onClick={handleConfirmDelivery}
                                disabled={confirmProcessing}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirmer Réception (Débloquer)</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Timeline Progress */}
                {order.delivery_status !== 'cancelled' ? (
                    <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-4">
                        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">État d'avancement de votre livraison</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {steps.map((s, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border ${
                                        s.done ? 'bg-yellow-500 text-stone-950 border-yellow-500 font-semibold' : 'bg-stone-100 text-stone-400 border-stone-200'
                                    }`}>
                                        {s.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                    </div>
                                    <span className={`text-[11px] ${s.done ? 'font-medium text-stone-900' : 'text-stone-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-xs text-rose-800">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                            <span className="font-bold">Cette commande a été annulée.</span>
                            <p className="text-rose-700 mt-0.5">Les fonds consignés sous séquestre Escrow ont été intégralement remboursés et le stock a été remis à disposition.</p>
                        </div>
                    </div>
                )}

                {/* INTERACTIVE LIVE GPS TRACKING MAP */}
                {order.delivery_status !== 'cancelled' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-yellow-600 animate-pulse" />
                                <span>Suivi Cartographique en Direct · Trajet & Géolocalisation</span>
                            </h2>
                            <span className="text-[11px] text-stone-500 font-medium">
                                Itinéraire Boutique ➔ Livreur ➔ Votre Domicile
                            </span>
                        </div>
                        <LiveOrderTrackingMap order={order} />
                    </div>
                )}

                {/* OTP Highlight Banner */}
                {order.delivery_status !== 'cancelled' && (
                    <div className="bg-yellow-500 text-stone-950 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-stone-950 text-yellow-400 flex items-center justify-center shrink-0">
                                <Key className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Votre Code Secret de Livraison (OTP)</h3>
                                <p className="text-xs text-stone-900 opacity-90 mt-0.5">
                                    Communiquez ce code au livreur uniquement après avoir vérifié le contenu de votre colis.
                                </p>
                            </div>
                        </div>
                        <div className="bg-stone-950 text-yellow-400 font-mono text-2xl font-bold px-4 py-2 rounded-lg tracking-widest">
                            {order.delivery_otp || '------'}
                        </div>
                    </div>
                )}

                {/* Order Details & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Package className="w-4 h-4 text-stone-500" />
                            <span>Détail des Articles</span>
                        </h3>

                        <div className="divide-y divide-stone-100">
                            {order.items?.map((item) => {
                                const existingReview = order.reviews?.find(r => r.product_id === item.product_id);
                                return (
                                    <div key={item.id} className="py-3 flex justify-between items-center text-xs gap-3">
                                        <div className="flex-1">
                                            <p className="font-medium text-stone-900">{item.product_name}</p>
                                            <p className="text-stone-500 text-[11px]">Qté : {item.quantity} × {Number(item.unit_price).toLocaleString('fr-FR')} FCFA</p>
                                            
                                            {/* Review status or trigger button */}
                                            {isDelivered && (
                                                <div className="mt-1.5">
                                                    {existingReview ? (
                                                        <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                                                            <Star className="w-3 h-3 fill-emerald-600" />
                                                            <span>Avis déposé ({existingReview.rating}/5 étoiles)</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setReviewModalItem(item);
                                                                setRating(5);
                                                                setComment('');
                                                            }}
                                                            className="text-yellow-700 hover:text-yellow-800 text-[11px] font-semibold flex items-center gap-1 underline"
                                                        >
                                                            <Star className="w-3 h-3 text-yellow-500" />
                                                            <span>Évaluer ce produit</span>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="font-semibold text-stone-900 shrink-0">{Number(item.subtotal).toLocaleString('fr-FR')} FCFA</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-stone-200 pt-3 space-y-1 text-xs">
                            <div className="flex justify-between text-stone-500">
                                <span>Sous-total</span>
                                <span>{Number(order.subtotal).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            <div className="flex justify-between text-stone-500">
                                <span>Frais de livraison</span>
                                <span>{Number(order.shipping_fee || 0).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            <div className="flex justify-between font-semibold text-stone-900 text-sm pt-2 border-t border-stone-100">
                                <span>Total payé</span>
                                <span>{Number(order.total_amount).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address & Dispute */}
                    <div className="space-y-4">
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 text-xs">
                            <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-stone-500" />
                                <span>Adresse de Livraison</span>
                            </h3>
                            <p className="text-stone-700 leading-relaxed font-normal">
                                {order.delivery_address}<br />
                                <span className="text-stone-500">{order.city}, Cameroun</span>
                            </p>
                            <div className="pt-2 border-t border-stone-100">
                                <p className="text-stone-400 text-[11px]">Destinataire :</p>
                                <p className="font-medium text-stone-900">{order.customer_name} ({order.customer_phone})</p>
                            </div>
                        </div>

                        {/* Dispute trigger button */}
                        {!order.dispute && order.payment_status === 'escrow_held' && order.delivery_status !== 'cancelled' && (
                            <button
                                onClick={() => setIsDisputeOpen(true)}
                                className="w-full py-2.5 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 hover:border-rose-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Un problème avec la commande ?</span>
                            </button>
                        )}

                        {order.dispute && (
                            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs space-y-1">
                                <div className="flex items-center gap-1.5 text-rose-800 font-semibold">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Litige ouvert</span>
                                </div>
                                <p className="text-rose-700">
                                    Motif : {order.dispute.reason}. Le service d'arbitrage Sellify examine actuellement le dossier.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Modal */}
                {reviewModalItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                        <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span>Évaluer : {reviewModalItem.product_name}</span>
                                </h3>
                                <button onClick={() => setReviewModalItem(null)} className="text-stone-400 hover:text-stone-700">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="font-semibold text-stone-700 block mb-1 text-center">1. Note du Produit & Vendeur :</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="p-1 hover:scale-110 transition-transform"
                                            >
                                                <Star className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-semibold text-stone-700 block mb-1 text-center">2. Note du Service Livreur :</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setDriverRating(star)}
                                                className="p-1 hover:scale-110 transition-transform"
                                            >
                                                <Star className={`w-5 h-5 ${star <= driverRating ? 'text-yellow-500 fill-yellow-500' : 'text-stone-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-semibold text-stone-700 block mb-1">Votre commentaire d'expérience :</label>
                                    <textarea
                                        rows="2"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Qualité du produit reçu, conformité à la description..."
                                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold text-stone-700 block mb-1">Photo du produit reçu (Optionnel) :</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setReviewPhoto(e.target.files[0])}
                                        className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800"
                                    />
                                </div>

                                <div className="pt-2 flex gap-2 justify-end border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => setReviewModalItem(null)}
                                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl shadow-xs"
                                    >
                                        Publier l'Avis
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Dispute Modal */}
                {isDisputeOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                        <div className="bg-white border border-stone-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <h3 className="text-sm font-semibold text-rose-900 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                                    <span>Ouvrir un Litige</span>
                                </h3>
                                <button onClick={() => setIsDisputeOpen(false)} className="text-stone-400 hover:text-stone-700">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleDisputeSubmit} className="space-y-3 text-xs">
                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Motif de la contestation</label>
                                    <textarea
                                        rows="3"
                                        value={disputeData.reason}
                                        onChange={(e) => setDisputeData('reason', e.target.value)}
                                        placeholder="Ex: Produit endommagé, article manquant ou non conforme à la description..."
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                        required
                                    />
                                </div>

                                <p className="text-[11px] text-stone-500 leading-normal">
                                    Dès l'ouverture du litige, les fonds restent bloqués en Escrow et le vendeur dispose de 48h pour fournir des éléments de réponse.
                                </p>

                                <div className="pt-3 flex gap-2 justify-end border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsDisputeOpen(false)}
                                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={disputeProcessing}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg"
                                    >
                                        Déclarer le litige
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
}
