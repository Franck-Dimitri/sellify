import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Wallet, 
    DollarSign, 
    ArrowUpRight, 
    CheckCircle2, 
    Clock, 
    Phone, 
    Smartphone,
    TrendingUp
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

export default function Earnings({ driver = {}, completedOrders = { data: [] }, stats = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        phone: driver.user?.phone || '',
        provider: 'mtn',
    });

    const handleWithdraw = (e) => {
        e.preventDefault();
        if (!data.amount || data.amount < 1000) {
            alert("Le montant minimum de retrait est de 1 000 FCFA.");
            return;
        }
        post(route('driver.withdraw'), {
            onSuccess: () => {
                setData({ ...data, amount: '' });
            }
        });
    };

    // Chart.js Configurations
    const earningsLineData = {
        labels: ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'],
        datasets: [
            {
                label: 'Revenus mensuels (FCFA)',
                data: [45000, 89000, 142000, 198000, 245000, stats.total_earned || 310000],
                borderColor: '#eab308',
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
            }
        ]
    };

    const earningsLineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(231, 229, 228, 0.6)' } }
        }
    };

    const channelDoughnutData = {
        labels: ['MTN Mobile Money', 'Orange Money'],
        datasets: [
            {
                data: [65, 35],
                backgroundColor: ['#eab308', '#f97316'],
                borderWidth: 0,
            }
        ]
    };

    const channelDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        cutout: '70%'
    };

    return (
        <DriverLayout title="Portefeuille & gains livreur">
            <Head title="Gains & Retraits Mobile Money - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Wallet className="w-4 h-4 text-yellow-600" />
                            <span>Gestion des revenus de livraison</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Portefeuille & solde de rémunération
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Suivez vos frais de course cumulés et transférez votre solde instantanément vers votre compte Mobile Money.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Gains totaux cumulés</span>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_earned || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Toutes livraisons confondues</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Solde disponible</span>
                        <p className="text-2xl font-bold text-emerald-600">
                            {Number(stats.available_balance || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Prêt au retrait Mobile Money</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Courses rémunérées</span>
                        <p className="text-2xl font-bold text-yellow-700">{stats.total_deliveries || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Nombre de livraisons validées</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Moyenne par livraison</span>
                        <p className="text-2xl font-bold text-blue-600">1 500 <span className="text-xs font-semibold text-stone-500">FCFA</span></p>
                        <span className="text-[11px] text-stone-400 font-normal">Tarif forfaitaire moyen</span>
                    </div>
                </div>

                {/* CHART.JS CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Évolution mensuelle des revenus livreur</h3>
                            <span className="text-xs text-stone-400">Chart.js Graphique</span>
                        </div>
                        <div className="h-52">
                            <Line data={earningsLineData} options={earningsLineOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Opérateurs de paiement</h3>
                        </div>
                        <div className="h-52 relative flex items-center justify-center">
                            <Doughnut data={channelDoughnutData} options={channelDoughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Form & Earnings History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Withdraw Form (1 col) */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Demander un virement Mobile Money</h3>
                            <p className="text-xs text-stone-500 font-normal">Transfert immédiat sans frais sur votre compte MTN/Orange.</p>
                        </div>

                        <form onSubmit={handleWithdraw} className="space-y-4 text-xs font-normal">
                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Montant à retirer (FCFA) :</label>
                                <input
                                    type="number"
                                    min="1000"
                                    step="500"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Ex: 10000"
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-bold"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Opérateur :</label>
                                <select
                                    value={data.provider}
                                    onChange={(e) => setData('provider', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-normal"
                                >
                                    <option value="mtn">MTN Mobile Money (MOMO)</option>
                                    <option value="orange">Orange Money (OM)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Numéro de téléphone récepteur :</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 border border-yellow-500"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                                <span>Confirmer le transfert</span>
                            </button>
                        </form>
                    </div>

                    {/* History Table (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Historique des livraisons rémunérées</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                        <th className="py-3 px-4">Commande</th>
                                        <th className="py-3 px-4">Date & heure</th>
                                        <th className="py-3 px-4">Gains course</th>
                                        <th className="py-3 px-4">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {completedOrders.data && completedOrders.data.length > 0 ? (
                                        completedOrders.data.map((o) => (
                                            <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-stone-900">#{o.order_number}</td>
                                                <td className="py-3.5 px-4 text-stone-600 font-normal">
                                                    {new Date(o.delivered_at || o.updated_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-emerald-600">
                                                    +{Number(o.shipping_fee || 1500).toLocaleString('fr-FR')} FCFA
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                        Crédité
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-stone-400">
                                                Aucune transaction enregistrée.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </DriverLayout>
    );
}
