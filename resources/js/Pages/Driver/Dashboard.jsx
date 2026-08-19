import React, { useState } from 'react';
import { usePage, Link, Head, useForm } from '@inertiajs/react';
import { 
    ShieldAlert, 
    ShieldCheck, 
    LogOut, 
    Truck, 
    LayoutDashboard, 
    MapPin, 
    Phone, 
    Package, 
    CheckCircle2, 
    Clock, 
    Key, 
    Store,
    DollarSign,
    Star,
    Navigation
} from 'lucide-react';

export default function Dashboard({ 
    driver, 
    availableDeliveries = [], 
    activeDeliveries = [], 
    completedDeliveries = [], 
    stats = {} 
}) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const isVerified = user.kyc_status === 'verified';

    const [selectedTab, setSelectedTab] = useState('available');
    const [otpValues, setOtpValues] = useState({});

    const { post: acceptPost, processing: acceptProcessing } = useForm();
    const { data: otpData, setData: setOtpData, post: otpPost, processing: otpProcessing } = useForm({
        otp: '',
    });

    const handleAccept = (orderNumber) => {
        if (confirm(`Voulez-vous accepter la livraison de la commande ${orderNumber} ?`)) {
            acceptPost(route('driver.delivery.accept', orderNumber));
        }
    };

    const handleOtpSubmit = (e, orderNumber) => {
        e.preventDefault();
        const otp = otpValues[orderNumber];
        if (!otp || otp.length !== 6) {
            alert('Veuillez renseigner le code OTP à 6 chiffres communiqué par le client.');
            return;
        }
        otpPost(route('driver.delivery.verify_otp', { order_number: orderNumber, otp: otp }));
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-800 antialiased pb-16">
            <Head title="Tableau de bord Livreur - Sellify" />

            {/* Top Navigation */}
            <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-2xs">
                <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center font-bold text-stone-950 text-sm">S</span>
                    <div>
                        <span className="font-semibold text-sm tracking-tight text-stone-900">
                            Sellify<span className="text-yellow-600">.me</span>
                        </span>
                        <span className="block text-[10px] text-stone-400 font-medium uppercase">
                            Console Livreur
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-xs font-medium text-yellow-900 uppercase">
                            {user.first_name[0]}
                        </div>
                        <span className="text-xs font-medium text-stone-800 hidden sm:inline">
                            {user.first_name} {user.last_name}
                        </span>
                    </div>

                    <Link href={route('logout')} method="post" as="button" className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* Flash notifications */}
            {flash?.success && (
                <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-4">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-4">
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs font-medium">
                        {flash.error}
                    </div>
                </div>
            )}

            <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
                
                {/* KYC Alert if not verified */}
                {!isVerified && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3 text-xs text-yellow-950">
                        <ShieldAlert className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-stone-900">Vérification de votre dossier Livreur en cours</p>
                            <p className="text-yellow-800 font-normal mt-0.5">
                                Vos pièces justificatives (permis, carte grise, photo véhicule) sont en cours d'examen. Dès approbation par un administrateur, vous pourrez accepter des colis et démarrer vos tournées.
                            </p>
                        </div>
                    </div>
                )}

                {/* Driver Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Gains Livraisons</p>
                        <p className="text-xl font-semibold text-stone-900 mt-1">
                            {Number(stats.total_earned || 0).toLocaleString('fr-FR')} FCFA
                        </p>
                        <span className="text-[10px] text-emerald-600 font-medium">Frais cumulés</span>
                    </div>

                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">En Cours</p>
                        <p className="text-xl font-semibold text-yellow-600 mt-1">{stats.active_count || 0}</p>
                        <span className="text-[10px] text-stone-400">Courses actives</span>
                    </div>

                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Colis Livrés</p>
                        <p className="text-xl font-semibold text-emerald-600 mt-1">{stats.delivered_count || 0}</p>
                        <span className="text-[10px] text-stone-400">Avec validation OTP</span>
                    </div>

                    <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                        <p className="text-xs font-medium text-stone-500">Note & Avis</p>
                        <div className="flex items-center gap-1 mt-1">
                            <p className="text-xl font-semibold text-stone-900">{stats.rating || 4.9}</p>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                        <span className="text-[10px] text-stone-400">Score de fiabilité</span>
                    </div>
                </div>

                {/* Active Deliveries Section (if any in transit) */}
                {activeDeliveries.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-yellow-600" />
                            <span>Course(s) en cours de livraison ({activeDeliveries.length})</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeDeliveries.map((order) => (
                                <div key={order.id} className="bg-white border-2 border-yellow-400 rounded-xl p-5 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-mono font-bold text-xs text-stone-900">{order.order_number}</span>
                                            <p className="text-xs text-stone-500 mt-0.5">Boutique : {order.shop?.name}</p>
                                        </div>
                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-md text-[11px] font-medium">
                                            En cours d'acheminement
                                        </span>
                                    </div>

                                    {/* Customer & Address details */}
                                    <div className="space-y-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-stone-900">{order.customer_name}</span>
                                            <a href={`tel:${order.customer_phone}`} className="text-yellow-700 hover:underline flex items-center gap-1 font-medium">
                                                <Phone className="w-3 h-3" />
                                                <span>{order.customer_phone}</span>
                                            </a>
                                        </div>
                                        <p className="text-stone-600 flex items-start gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                            <span>{order.delivery_address}, {order.city}</span>
                                        </p>
                                        <p className="text-stone-500 text-[11px]">
                                            Colis : {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                                        </p>
                                    </div>

                                    {/* OTP Validation Input Form */}
                                    <form onSubmit={(e) => handleOtpSubmit(e, order.order_number)} className="space-y-2 pt-1">
                                        <label className="text-[11px] font-semibold text-stone-700 block">
                                            Entrez le code OTP à 6 chiffres du client à la remise du colis :
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                maxLength="6"
                                                placeholder="Code OTP..."
                                                value={otpValues[order.order_number] || ''}
                                                onChange={(e) => setOtpValues({ ...otpValues, [order.order_number]: e.target.value })}
                                                className="w-32 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-center font-mono text-sm tracking-widest outline-none focus:border-yellow-500 font-bold"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={otpProcessing}
                                                className="flex-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Valider & Débloquer</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Deliveries vs Past Deliveries Navigation */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="border-b border-stone-200 p-2 flex gap-2">
                        <button
                            onClick={() => setSelectedTab('available')}
                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                                selectedTab === 'available'
                                    ? 'bg-yellow-500 text-stone-950'
                                    : 'text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            Colis Disponibles à l'Enlèvement ({availableDeliveries.length})
                        </button>
                        <button
                            onClick={() => setSelectedTab('history')}
                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                                selectedTab === 'history'
                                    ? 'bg-yellow-500 text-stone-950'
                                    : 'text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            Historique des Livraisons ({completedDeliveries.length})
                        </button>
                    </div>

                    <div className="p-5">
                        {selectedTab === 'available' && (
                            <div className="space-y-4">
                                {availableDeliveries.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableDeliveries.map((order) => (
                                            <div key={order.id} className="border border-stone-200 rounded-xl p-4 space-y-3 hover:border-yellow-400 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-mono font-medium text-xs text-stone-900">{order.order_number}</span>
                                                        <p className="text-[11px] text-stone-400 mt-0.5">
                                                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-md text-[11px] font-semibold">
                                                        +{Number(order.shipping_fee || 1500).toLocaleString('fr-FR')} FCFA
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5 text-xs text-stone-600">
                                                    <div className="flex items-start gap-1.5">
                                                        <Store className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                                        <span><span className="font-medium text-stone-800">{order.shop?.name}</span> ({order.shop?.address || 'Douala'})</span>
                                                    </div>
                                                    <div className="flex items-start gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                                                        <span>Destination : <span className="font-medium text-stone-800">{order.delivery_address}, {order.city}</span></span>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                                    <span className="text-[11px] text-stone-500">
                                                        {order.items?.length || 0} article(s) à récupérer
                                                    </span>
                                                    <button
                                                        onClick={() => handleAccept(order.order_number)}
                                                        disabled={!isVerified || acceptProcessing}
                                                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        Prendre en charge
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-stone-400 space-y-2">
                                        <Package className="w-8 h-8 text-stone-300 mx-auto" />
                                        <p className="text-xs font-medium text-stone-700">Aucun colis en attente d'enlèvement</p>
                                        <p className="text-[11px] text-stone-400">Les nouvelles courses disponibles s'afficheront ici en temps réel.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedTab === 'history' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-stone-100 text-[11px] font-medium text-stone-400 uppercase">
                                            <th className="py-2.5 px-3">Commande</th>
                                            <th className="py-2.5 px-3">Boutique</th>
                                            <th className="py-2.5 px-3">Client</th>
                                            <th className="py-2.5 px-3">Gain Course</th>
                                            <th className="py-2.5 px-3">Date de Livraison</th>
                                            <th className="py-2.5 px-3 text-right">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {completedDeliveries.length > 0 ? (
                                            completedDeliveries.map((order) => (
                                                <tr key={order.id} className="hover:bg-stone-50/60">
                                                    <td className="py-2.5 px-3 font-mono font-medium text-stone-900">{order.order_number}</td>
                                                    <td className="py-2.5 px-3 text-stone-700">{order.shop?.name}</td>
                                                    <td className="py-2.5 px-3 text-stone-800">{order.customer_name} ({order.city})</td>
                                                    <td className="py-2.5 px-3 font-semibold text-emerald-700">
                                                        +{Number(order.shipping_fee || 1500).toLocaleString('fr-FR')} FCFA
                                                    </td>
                                                    <td className="py-2.5 px-3 text-stone-500 text-[11px]">
                                                        {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString('fr-FR', {
                                                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        }) : '-'}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>Livré</span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-stone-400">
                                                    <Truck className="w-8 h-8 text-stone-300 mx-auto mb-1" />
                                                    <p className="text-xs">Aucune livraison archivée pour le moment.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
