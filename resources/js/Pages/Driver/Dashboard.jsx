import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import DeliveryOtpVerificationModal from '@/Components/DeliveryOtpVerificationModal';
import { 
    Truck, 
    CheckCircle2, 
    Clock, 
    Wallet, 
    Star, 
    MapPin, 
    Key, 
    ArrowRight, 
    Navigation,
    ShoppingBag,
    TrendingUp,
    Check,
    WifiOff
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { OfflineStorageService } from '@/Services/OfflineStorageService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ 
    driver = {}, 
    availableDeliveries = [], 
    activeDeliveries = [], 
    completedDeliveries = [], 
    stats = {} 
}) {
    const { post, processing } = useForm();
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [cachedDeliveries, setCachedDeliveries] = useState(activeDeliveries);

    // Save active deliveries into IndexedDB/LocalStorage when online for PWA offline resilience
    useEffect(() => {
        if (navigator.onLine && activeDeliveries.length > 0) {
            OfflineStorageService.saveActiveDeliveries(activeDeliveries);
            setCachedDeliveries(activeDeliveries);
        } else if (!navigator.onLine) {
            const offlineData = OfflineStorageService.getActiveDeliveries();
            if (offlineData && offlineData.length > 0) {
                setCachedDeliveries(offlineData);
            }
        }
    }, [activeDeliveries]);

    const handleAccept = (orderNumber) => {
        if (confirm(`Voulez-vous accepter la livraison de la commande #${orderNumber} ?`)) {
            post(route('driver.delivery.accept', orderNumber));
        }
    };

    const earningsChartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Gains quotidiens (FCFA)',
                data: [4500, 7000, 6000, 9500, 12000, 15500, 11000],
                borderColor: '#eab308',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
            }
        ]
    };

    const earningsChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(231, 229, 228, 0.6)' } }
        }
    };

    const displayActiveDeliveries = cachedDeliveries.length > 0 ? cachedDeliveries : activeDeliveries;

    return (
        <DriverLayout title="Tableau de bord livreur PWA">
            <Head title="Tableau de bord Livreur PWA - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Truck className="w-4 h-4 text-yellow-600" />
                            <span>Vue d'ensemble PWA des métriques & activités</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Bonjour, {driver.user?.first_name || 'Livreur'} 👋
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Supervisez vos statistiques de livraison, revenus accumulés et courses disponibles.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-xl text-xs font-bold text-yellow-950">
                            Véhicule : <span className="capitalize">{driver.vehicle_type || 'Moto'}</span> ({driver.vehicle_plate || 'LT-492-BX'})
                        </div>
                    </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Gains cumulés</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <Wallet className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_earned || 0).toLocaleString('fr-FR')} <span className="text-xs text-stone-500 font-normal">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Frais de livraison perçus</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Courses en cours</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <Truck className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-yellow-700">{displayActiveDeliveries.length}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Colis en acheminement</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Livraisons effectuées</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{stats.delivered_count || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Commandes livrées avec OTP</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Note de satisfaction</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <Star className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{stats.rating || 4.90} / 5</p>
                        <span className="text-[11px] text-stone-400 font-normal">Évaluation des acheteurs</span>
                    </div>
                </div>

                {/* ACTIVE DELIVERY CARD */}
                {displayActiveDeliveries && displayActiveDeliveries.length > 0 && (
                    <div className="bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-yellow-600 animate-bounce" />
                                <h3 className="font-bold text-base text-stone-900">Mission de livraison active #{displayActiveDeliveries[0].order_number}</h3>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-950 text-xs font-bold rounded-full border border-yellow-300">
                                En acheminement
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700 font-normal">
                            <div className="p-3 bg-stone-50 rounded-xl space-y-0.5 border border-stone-200/70">
                                <span className="text-stone-400 block font-normal">Boutique de retrait (Point A) :</span>
                                <strong className="text-stone-900 text-sm block font-bold">{displayActiveDeliveries[0].shop?.name}</strong>
                                <span className="text-[11px] text-stone-500">Prise en charge colis</span>
                            </div>

                            <div className="p-3 bg-stone-50 rounded-xl space-y-0.5 border border-stone-200/70">
                                <span className="text-stone-400 block font-normal">Adresse du client (Point B) :</span>
                                <strong className="text-stone-900 text-sm block font-bold">{displayActiveDeliveries[0].shipping_address || 'Douala, Cameroun'}</strong>
                                <span className="text-[11px] text-stone-500">Destination finale</span>
                            </div>

                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
                                <span className="text-emerald-800 block font-semibold">Frais de course livreur :</span>
                                <strong className="text-emerald-700 text-base block font-bold">{Number(displayActiveDeliveries[0].shipping_fee || 1500).toLocaleString('fr-FR')} FCFA</strong>
                                <span className="text-[11px] text-emerald-600">Crédité à la validation OTP & Signature</span>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs text-stone-500 font-normal">
                                Demandez au client son code OTP et faites-le signer sur l'écran tactile pour encaisser vos frais.
                            </p>
                            <button
                                onClick={() => setSelectedDeliveryForOtp(displayActiveDeliveries[0])}
                                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 border border-yellow-500"
                            >
                                <Key className="w-4 h-4 text-yellow-950" />
                                <span>Valider avec OTP & Signature</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Gains Trend & Courses disponibles Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Available Courses Stream */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Courses prêtes au retrait</h3>
                            </div>
                            <span className="text-xs text-stone-400 font-normal">{availableDeliveries.length} course(s) disponible(s)</span>
                        </div>

                        <div className="space-y-3">
                            {availableDeliveries && availableDeliveries.length > 0 ? (
                                availableDeliveries.map((del) => (
                                    <div key={del.id} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3 hover:border-yellow-400 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-mono font-bold text-stone-900 text-xs">#{del.order_number}</span>
                                                <span className="text-[11px] text-stone-400 block">Prêt chez {del.shop?.name}</span>
                                            </div>
                                            <span className="font-bold text-emerald-600 text-sm">
                                                +{Number(del.shipping_fee || 1500).toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                                <span>Livraison : {del.shipping_address || 'Douala'}</span>
                                            </div>

                                            <button
                                                onClick={() => handleAccept(del.order_number)}
                                                disabled={processing}
                                                className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1 border border-yellow-500"
                                            >
                                                <span>Accepter la course</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-stone-400 text-xs space-y-1">
                                    <Clock className="w-8 h-8 mx-auto text-stone-300" />
                                    <p>Aucune nouvelle course disponible pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart.js Gains Trend */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Évolution hebdomadaire des gains</h3>
                        </div>

                        <div className="h-56">
                            <Line data={earningsChartData} options={earningsChartOptions} />
                        </div>
                    </div>

                </div>

            </div>

            {/* DOUBLE SECURITY OTP & DIGITAL SIGNATURE VERIFICATION MODAL */}
            {selectedDeliveryForOtp && (
                <DeliveryOtpVerificationModal
                    order={selectedDeliveryForOtp}
                    onClose={() => setSelectedDeliveryForOtp(null)}
                />
            )}

        </DriverLayout>
    );
}
