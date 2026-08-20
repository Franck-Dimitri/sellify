import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    ShieldCheck, 
    DollarSign, 
    CreditCard, 
    User, 
    Store, 
    Lock, 
    Unlock, 
    RotateCcw,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Key,
    FileText
} from 'lucide-react';

export default function Show({ order }) {
    const { post, processing } = useForm();

    const handleForceRelease = () => {
        if (confirm(`Voulez-vous libérer les fonds Escrow de la commande #${order.order_number} au vendeur ?`)) {
            post(route('admin.escrow.release', order.order_number));
        }
    };

    const handleForceRefund = () => {
        if (confirm(`Voulez-vous forcer le remboursement intégral de la commande #${order.order_number} à l'acheteur ?`)) {
            post(route('admin.escrow.refund', order.order_number));
        }
    };

    const handleLockEscrow = () => {
        if (confirm(`Voulez-vous geler/bloquer les fonds Escrow de la commande #${order.order_number} pour litige ?`)) {
            post(route('admin.escrow.lock', order.order_number));
        }
    };

    return (
        <AdminLayout title={`Inspection séquestre #${order.order_number}`}>
            <Head title={`Séquestre Escrow #${order.order_number} - Sellify Admin`} />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.escrow.index')}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                <span>Inspection de consigne Mobile Money</span>
                            </div>
                            <h1 className="text-xl font-bold text-stone-900 mt-0.5 font-mono">
                                Consigne Escrow #{order.order_number}
                            </h1>
                        </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-950 uppercase border border-yellow-300">
                        Statut : {order.payment_status || 'escrow_held'}
                    </span>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Montant en consigne</span>
                        <span className="text-2xl font-bold text-stone-900 block">
                            {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Fonds sous séquestre</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Commission Sellify (3%)</span>
                        <span className="text-2xl font-bold text-purple-700 block">
                            {Number(order.total_amount * 0.03).toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Revenus de la plateforme</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Code OTP de livraison</span>
                        <span className="text-2xl font-bold text-yellow-700 font-mono block">
                            {order.delivery_otp || 'N/A'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Requis pour déblocage auto</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Règlement au Vendeur</span>
                        <span className="text-2xl font-bold text-emerald-600 block">
                            {Number(order.total_amount * 0.97).toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Net à verser (97%)</span>
                    </div>
                </div>

                {/* Audit & Detailed Control Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Buyer & Shop Info */}
                    <div className="space-y-6">
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-3 text-xs text-stone-700">
                            <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2">Acheteur (Déposant)</h3>
                            <p>Nom : <strong>{order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Acheteur'}</strong></p>
                            <p>Email : <strong>{order.user?.email || 'N/A'}</strong></p>
                            <p>Téléphone : <strong>{order.user?.phone || 'N/A'}</strong></p>
                        </div>

                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-3 text-xs text-stone-700">
                            <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2">Boutique (Bénéficiaire)</h3>
                            <p>Boutique : <strong>{order.shop?.name || 'N/A'}</strong></p>
                            <p>Vendeur : <strong>{order.shop?.seller?.user ? `${order.shop.seller.user.first_name} ${order.shop.seller.user.last_name}` : 'Vendeur'}</strong></p>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
                        <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3">Panneau d'arbitrage & déblocage des fonds</h3>

                        <p className="text-xs text-stone-500 font-normal">
                            En cas de litige ou de blocage technique lors de la livraison, l'administrateur possède le contrôle souverain sur la destination des fonds sous séquestre.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                onClick={handleForceRelease}
                                disabled={processing}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2"
                            >
                                <Unlock className="w-4 h-4" />
                                <span>Débloquer les fonds au vendeur</span>
                            </button>

                            <button
                                onClick={handleLockEscrow}
                                disabled={processing}
                                className="py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition-colors border border-amber-300 flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Geler les fonds</span>
                            </button>

                            <button
                                onClick={handleForceRefund}
                                disabled={processing}
                                className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Rembourser l'acheteur</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
