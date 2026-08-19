import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';
import { 
    ArrowLeft, 
    Printer, 
    Package, 
    Truck, 
    User, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Store,
    DollarSign,
    CreditCard
} from 'lucide-react';

export default function Show({ order }) {
    const { data, setData, post, processing } = useForm({
        status: order.delivery_status,
    });

    const handleStatusUpdate = (newStatus) => {
        post(route('seller.orders.status', { order_number: order.order_number, status: newStatus }));
    };

    const statusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livreur', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
            in_transit: { label: 'En livraison', bg: 'bg-purple-50 text-purple-800 border-purple-200' },
            delivered: { label: 'Livré', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            cancelled: { label: 'Annulé', bg: 'bg-rose-50 text-rose-800 border-rose-200' },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <SellerCentralLayout title={`Commande ${order.order_number}`}>
            <Head title={`Commande ${order.order_number} - Sellify`} />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16 max-w-6xl mx-auto">
                
                {/* Back & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Link 
                            href={route('seller.orders.index')}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-stone-900">{order.order_number}</h1>
                                {statusBadge(order.delivery_status)}
                            </div>
                            <p className="text-xs text-stone-500 font-normal">
                                Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })} • Boutique : {order.shop?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('seller.orders.print', order.order_number)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimer Bordereau</span>
                        </a>

                        {order.delivery_status === 'pending' && (
                            <button
                                onClick={() => handleStatusUpdate('preparing')}
                                disabled={processing}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                Commencer la préparation
                            </button>
                        )}

                        {order.delivery_status === 'preparing' && (
                            <button
                                onClick={() => handleStatusUpdate('ready_for_pickup')}
                                disabled={processing}
                                className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 text-xs font-medium rounded-lg transition-colors"
                            >
                                Prêt pour enlèvement livreur
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Left 2 Cols: Order Items & Financials */}
                    <div className="lg:col-span-2 space-y-5">
                        
                        {/* Items Card */}
                        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                <Package className="w-4 h-4 text-stone-500" />
                                <span>Articles Commandés ({order.items?.length || 0})</span>
                            </h2>

                            <div className="divide-y divide-stone-100">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-medium text-stone-900">{item.product_name}</p>
                                            <p className="text-[11px] text-stone-500">
                                                Prix unitaire : {Number(item.unit_price).toLocaleString('fr-FR')} FCFA • Quantité : {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-xs font-semibold text-stone-900">
                                            {Number(item.subtotal).toLocaleString('fr-FR')} FCFA
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs">
                                <div className="flex justify-between text-stone-500">
                                    <span>Sous-total articles</span>
                                    <span>{Number(order.subtotal).toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <div className="flex justify-between text-stone-500">
                                    <span>Frais de livraison</span>
                                    <span>{Number(order.shipping_fee || 0).toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <div className="flex justify-between text-stone-900 font-semibold text-sm pt-2 border-t border-stone-100">
                                    <span>Montant Total</span>
                                    <span>{Number(order.total_amount).toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Guarantee Card */}
                        <div className="bg-yellow-50/60 border border-yellow-200/80 p-4 rounded-xl flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-xs font-semibold text-yellow-950">Garantie Séquestre Escrow Mobile Money</h3>
                                <p className="text-xs text-yellow-800 font-normal leading-relaxed">
                                    Le paiement du client ({Number(order.total_amount).toLocaleString('fr-FR')} FCFA via {order.payment_method === 'orange_money' ? 'Orange Money' : order.payment_method === 'mtn_momo' ? 'MTN MoMo' : order.payment_method}) est actuellement bloqué sur le compte séquestre. Les fonds seront crédités automatiquement sur votre solde disponible dès confirmation de livraison.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Right Col: Customer & Delivery Driver info */}
                    <div className="space-y-5">
                        
                        {/* Customer Info */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3.5">
                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-stone-500" />
                                <span>Informations Client</span>
                            </h2>
                            <div className="space-y-2 text-xs">
                                <div>
                                    <p className="text-[11px] text-stone-400">Nom complet</p>
                                    <p className="font-medium text-stone-900">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-stone-400">Téléphone</p>
                                    <a href={`tel:${order.customer_phone}`} className="font-medium text-yellow-700 hover:underline flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        <span>{order.customer_phone}</span>
                                    </a>
                                </div>
                                <div>
                                    <p className="text-[11px] text-stone-400">Adresse de livraison & Ville</p>
                                    <p className="font-medium text-stone-800 flex items-start gap-1 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                        <span>{order.delivery_address}, {order.city}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery & Courier Status */}
                        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3.5">
                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-stone-500" />
                                <span>Livraison & Livreur</span>
                            </h2>

                            {order.driver ? (
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <p className="text-[11px] text-stone-400">Livreur assigné</p>
                                        <p className="font-medium text-stone-900">{order.driver.user?.first_name} {order.driver.user?.last_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-stone-400">Contact livreur</p>
                                        <p className="font-medium text-stone-800">{order.driver.user?.phone}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
                                    <p className="font-medium text-stone-700">Aucun livreur encore assigné</p>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                        Le livreur optimal sera automatiquement notifié dès que vous marquerez la commande comme « Prête pour enlèvement ».
                                    </p>
                                </div>
                            )}

                            {order.delivered_at && (
                                <div className="pt-2 border-t border-stone-100 text-xs text-emerald-700 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Livré le {new Date(order.delivered_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}</span>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </SellerCentralLayout>
    );
}
