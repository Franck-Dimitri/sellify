import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Truck, 
    Search, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    Key, 
    ArrowRight,
    ShoppingBag,
    PackageCheck,
    TrendingUp
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Deliveries({ driver = {}, deliveries = { data: [] }, filters = {} }) {
    const [tab, setTab] = useState(filters.tab || 'all');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const { post, processing } = useForm();

    const handleTabChange = (t) => {
        setTab(t);
        router.get(route('driver.deliveries'), { tab: t, search }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('driver.deliveries'), { tab, search }, { preserveState: true });
    };

    const handleAccept = (orderNumber) => {
        if (confirm(`Voulez-vous prendre en charge la livraison de la commande #${orderNumber} ?`)) {
            post(route('driver.delivery.accept', orderNumber));
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        post(route('driver.delivery.verify_otp', selectedDeliveryForOtp.order_number), {
            data: { otp: otpInput },
            onSuccess: () => {
                setSelectedDeliveryForOtp(null);
                setOtpInput('');
            }
        });
    };

    // Chart.js Configuration
    const deliveriesBarData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Livraisons exécutées',
                data: [5, 8, 7, 12, 16, 19, 14],
                backgroundColor: '#eab308',
                borderRadius: 6,
            }
        ]
    };

    const deliveriesBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(231, 229, 228, 0.6)' } }
        }
    };

    const statusDoughnutData = {
        labels: ['Livrées avec OTP', 'En acheminement', 'Disponibles'],
        datasets: [
            {
                data: [48, 3, 5],
                backgroundColor: ['#10b981', '#eab308', '#3b82f6'],
                borderWidth: 0,
            }
        ]
    };

    const statusDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        cutout: '70%'
    };

    return (
        <DriverLayout title="Gestion des courses & livraisons">
            <Head title="Livraisons & Courses - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Truck className="w-4 h-4 text-yellow-600" />
                            <span>Répertoire des livraisons attribuées & disponibles</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Gestion des courses & livraisons
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Acceptez de nouvelles courses, effectuez le suivi des colis en cours et saisissez les OTP de clôture.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Total livraisons</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">56</p>
                        <span className="text-[11px] text-stone-400 font-normal">Historique cumulé</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Prêtes au retrait</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">5</p>
                        <span className="text-[11px] text-stone-400 font-normal">Disponibles dans votre secteur</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">En acheminement</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <Truck className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">3</p>
                        <span className="text-[11px] text-stone-400 font-normal">Prise en charge active</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Livrées avec OTP</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">48</p>
                        <span className="text-[11px] text-stone-400 font-normal">Validation OTP confirmée</span>
                    </div>
                </div>

                {/* CHART.JS CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Volume quotidien des courses exécutées</h3>
                            <span className="text-xs text-stone-400">Chart.js Graphique</span>
                        </div>
                        <div className="h-52">
                            <Bar data={deliveriesBarData} options={deliveriesBarOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Répartition par statut</h3>
                        </div>
                        <div className="h-52 relative flex items-center justify-center">
                            <Doughnut data={statusDoughnutData} options={statusDoughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                            {[
                                { id: 'all', label: 'Toutes les courses' },
                                { id: 'available', label: 'Disponibles au retrait' },
                                { id: 'active', label: 'En cours' },
                                { id: 'completed', label: 'Terminées' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleTabChange(t.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        tab === t.id
                                            ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs border border-yellow-500'
                                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par N° commande, client..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </form>
                    </div>
                </div>

                {/* Deliveries Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Commande</th>
                                    <th className="py-3 px-4">Boutique (Retrait)</th>
                                    <th className="py-3 px-4">Client (Livraison)</th>
                                    <th className="py-3 px-4">Frais livreur</th>
                                    <th className="py-3 px-4">Statut</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {deliveries.data && deliveries.data.length > 0 ? (
                                    deliveries.data.map((d) => (
                                        <tr key={d.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                                                #{d.order_number}
                                                <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                                    {new Date(d.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-800 font-medium">
                                                {d.shop?.name || 'Boutique'}
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-700">
                                                <span className="block font-semibold">{d.user ? `${d.user.first_name} ${d.user.last_name}` : 'Client'}</span>
                                                <span className="text-[11px] text-stone-400">{d.shipping_address || 'Douala'}</span>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-600">
                                                +{Number(d.shipping_fee || 1500).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    d.delivery_status === 'delivered' 
                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                        : d.delivery_status === 'in_transit'
                                                        ? 'bg-yellow-100 text-yellow-900'
                                                        : 'bg-amber-100 text-amber-900'
                                                }`}>
                                                    {d.delivery_status === 'delivered' ? 'Livré' : d.delivery_status === 'in_transit' ? 'En cours' : 'Dispo'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {d.delivery_status === 'ready_for_pickup' && !d.driver_id && (
                                                    <button
                                                        onClick={() => handleAccept(d.order_number)}
                                                        disabled={processing}
                                                        className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-[11px] rounded-xl shadow-2xs transition-colors border border-yellow-500"
                                                    >
                                                        Accepter la course
                                                    </button>
                                                )}
                                                {d.delivery_status === 'in_transit' && (
                                                    <button
                                                        onClick={() => setSelectedDeliveryForOtp(d)}
                                                        className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-[11px] rounded-xl shadow-2xs transition-colors border border-yellow-500 inline-flex items-center gap-1"
                                                    >
                                                        <Key className="w-3.5 h-3.5" />
                                                        <span>Valider OTP</span>
                                                    </button>
                                                )}
                                                {d.delivery_status === 'delivered' && (
                                                    <span className="text-[11px] text-stone-400 font-normal">Terminée</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-stone-400">
                                            Aucune course ne correspond aux critères.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* OTP Modal */}
            {selectedDeliveryForOtp && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleVerifyOtp} className="bg-white border border-stone-200/90 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-base text-stone-900">Code OTP #{selectedDeliveryForOtp.order_number}</h3>
                            <button type="button" onClick={() => setSelectedDeliveryForOtp(null)} className="p-1 text-stone-400">✕</button>
                        </div>

                        <div className="space-y-3 text-xs text-stone-600 font-normal">
                            <p>Saisissez le code secret à 6 chiffres affiché sur le reçu du client.</p>
                            <input
                                type="text"
                                maxLength="6"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value)}
                                placeholder="Code à 6 chiffres"
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl border border-yellow-500"
                            >
                                Valider la livraison
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </DriverLayout>
    );
}
