import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    Package, 
    User, 
    Store, 
    Truck, 
    MapPin, 
    CreditCard, 
    ShieldCheck, 
    Key, 
    Clock, 
    CheckCircle2, 
    XCircle,
    ShoppingBag
} from 'lucide-react';

export default function Show({ order }) {
    const statusBadge = (st) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livraison', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En cours (OTP)', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré & validé', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            cancelled: { label: 'Annulé', bg: 'bg-rose-50 text-rose-900 border-rose-200' },
        };
        const conf = map[st] || { label: st, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    return (
        <AdminLayout title={`Inspection commande #${order.order_number}`}>
            <Head title={`Commande #${order.order_number} - Sellify Admin`} />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.orders.index')}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                                <Package className="w-4 h-4 text-yellow-600" />
                                <span>Inspection détaillée de commande</span>
                            </div>
                            <h1 className="text-xl font-bold text-stone-900 mt-0.5 font-mono">
                                Commande #{order.order_number}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {statusBadge(order.delivery_status)}
                    </div>
                </div>

                {/* 4 KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Montant total</span>
                        <span className="text-2xl font-bold text-stone-900 block">
                            {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Toutes taxes & livraison</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Code OTP Secret</span>
                        <span className="text-2xl font-bold text-yellow-700 font-mono block">
                            {order.delivery_otp || 'N/A'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Validation à la livraison</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Statut paiement Escrow</span>
                        <span className="text-lg font-bold text-emerald-600 block uppercase text-xs">
                            {order.payment_status || 'escrow_held'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Consigne Mobile Money</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Date de création</span>
                        <span className="text-lg font-bold text-stone-900 block">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">à {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {/* 2-Column Grid: Buyer & Seller Details / Items breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Buyer & Seller Info */}
                    <div className="space-y-6">
                        
                        {/* Buyer Info Card */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-yellow-600" />
                                <span>Informations de l'Acheteur</span>
                            </h3>

                            <div className="space-y-2 text-xs text-stone-700 font-normal">
                                <p><strong>Nom client :</strong> {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Client anonyme'}</p>
                                <p><strong>Email :</strong> {order.user?.email || 'N/A'}</p>
                                <p><strong>Téléphone :</strong> {order.user?.phone || 'N/A'}</p>
                                <p className="pt-2 border-t border-stone-100">
                                    <strong>Adresse de livraison :</strong> {order.shipping_address || order.user?.default_delivery_address || 'Douala, Cameroun'}
                                </p>
                            </div>
                        </div>

                        {/* Seller & Shop Info Card */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                <Store className="w-4 h-4 text-yellow-600" />
                                <span>Informations de la Boutique</span>
                            </h3>

                            <div className="space-y-2 text-xs text-stone-700 font-normal">
                                <p><strong>Nom boutique :</strong> {order.shop?.name || 'N/A'}</p>
                                <p><strong>Vendeur :</strong> {order.shop?.seller?.user ? `${order.shop.seller.user.first_name} ${order.shop.seller.user.last_name}` : 'Vendeur'}</p>
                                <p><strong>Contact boutique :</strong> {order.shop?.email_contact || order.shop?.phone_contact || 'N/A'}</p>
                                {order.shop && (
                                    <Link
                                        href={route('admin.shops.show', order.shop.id)}
                                        className="inline-block mt-2 text-yellow-700 hover:underline text-xs font-semibold"
                                    >
                                        Consulter la fiche boutique →
                                    </Link>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Ordered Items & Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Ordered Items Table */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-yellow-600" />
                                <span>Articles de la commande</span>
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase text-[11px]">
                                            <th className="py-2">Produit</th>
                                            <th className="py-2">Prix unitaire</th>
                                            <th className="py-2">Quantité</th>
                                            <th className="py-2 text-right">Sous-total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="py-3 font-medium text-stone-900">
                                                        {item.product?.name || 'Produit commandé'}
                                                    </td>
                                                    <td className="py-3 text-stone-600">
                                                        {Number(item.price).toLocaleString('fr-FR')} FCFA
                                                    </td>
                                                    <td className="py-3 text-stone-600">
                                                        x{item.quantity}
                                                    </td>
                                                    <td className="py-3 text-right font-bold text-stone-900">
                                                        {Number(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-4 text-center text-stone-400">
                                                    Aucun article listé.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Escrow Link & Control Button */}
                        <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Garantie Escrow associée</span>
                                </span>
                                <h4 className="text-base font-bold mt-1">Consigne Mobile Money #{order.order_number}</h4>
                                <p className="text-xs text-stone-300 font-normal">Supervisez le déblocage et le remboursement des fonds sous séquestre.</p>
                            </div>

                            <Link
                                href={route('admin.escrow.show', order.order_number)}
                                className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0"
                            >
                                Inspecter la consigne Escrow →
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
