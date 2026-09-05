import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Wallet, 
    DollarSign, 
    ArrowUpRight, 
    CheckCircle2, 
    Clock, 
    Phone, 
    Smartphone,
    TrendingUp,
    CreditCard,
    Award,
    Sparkles,
    Zap,
    FileText,
    Printer,
    Download,
    X,
    ShieldCheck,
    Coins,
    Gift,
    ArrowRight,
    Building2,
    Calendar
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
import { Line, Bar } from 'react-chartjs-2';

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
    const [selectedTab, setSelectedTab] = useState('withdraw');
    const [payoutProvider, setPayoutProvider] = useState('mtn');
    const [pointsModalOpen, setPointsModalOpen] = useState(false);
    const [pointsConvertType, setPointsConvertType] = useState('cash');
    const [pointsToConvert, setPointsToConvert] = useState(500);
    const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);

    // Payout Form
    const { data: payoutData, setData: setPayoutData, post: postPayout, processing: payoutProcessing, errors: payoutErrors, reset: resetPayout } = useForm({
        amount: '',
        provider: 'mtn',
        phone: driver.user?.phone || '+237 670 11 22 33',
        card_number: '',
        card_holder: `${driver.user?.first_name || ''} ${driver.user?.last_name || ''}`.trim(),
        card_expiry: '',
    });

    // Points Conversion Form
    const { data: pointsData, setData: setPointsData, post: postPoints, processing: pointsProcessing } = useForm({
        type: 'cash',
        points: 500,
    });

    const handleWithdrawSubmit = (e) => {
        e.preventDefault();
        const minAmount = 1000;
        if (!payoutData.amount || payoutData.amount < minAmount) {
            alert(`Le montant minimum de retrait est de ${minAmount.toLocaleString('fr-FR')} FCFA.`);
            return;
        }
        if (payoutData.amount > stats.available_balance) {
            alert("Le montant demandé dépasse votre solde disponible.");
            return;
        }

        postPayout(route('driver.withdraw'), {
            onSuccess: () => {
                resetPayout('amount', 'card_number');
            }
        });
    };

    const handlePointsSubmit = (e) => {
        e.preventDefault();
        postPoints(route('driver.points.convert'), {
            onSuccess: () => {
                setPointsModalOpen(false);
            }
        });
    };

    // Financial Trend Chart Data
    const earningsLineData = {
        labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
        datasets: [
            {
                label: 'Frais de livraison perçus (FCFA)',
                data: [35000, 68000, 92000, stats.total_earned || 125000],
                borderColor: '#eab308',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
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

    return (
        <DriverLayout title="Portefeuille, Gains & Retraits">
            <Head title="Portefeuille, Gains & Retraits - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Wallet className="w-4 h-4 text-yellow-600" />
                            <span>Gestion financière & Programme de récompenses</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Portefeuille Chauffeur & Solde Disponible
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Retirez vos gains instantanément via MTN MoMo, Orange Money ou Carte Bancaire et convertissez vos points de fidélité.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setPointsModalOpen(true)}
                            className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-950 border border-yellow-300 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                        >
                            <Award className="w-4 h-4 text-yellow-600 animate-pulse" />
                            <span>{Number(stats.reward_points || 1200).toLocaleString('fr-FR')} Pts Fidélité</span>
                        </button>
                    </div>
                </div>

                {/* 4 STAT KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Solde Retirable */}
                    <div className="bg-white border-2 border-emerald-400 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Solde disponible au retrait</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <Wallet className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                            {Number(stats.available_balance || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Fonds débloqués transférables</span>
                    </div>

                    {/* Gains Totaux */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Gains totaux accumulés</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(stats.total_earned || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Toutes missions confondues</span>
                    </div>

                    {/* Points de Fidélité (100 pts par course) */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Points & Réputation IA</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <Coins className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">
                            {Number(stats.reward_points || 1200).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">pts</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">100 pts / livraison réussie</span>
                    </div>

                    {/* Ponctualité & Pourboires */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Pourboires & Ponctualité</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            {Number(stats.tips_total || 17500).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Taux de ponctualité : {stats.punctuality_rate || 99.4}%</span>
                    </div>

                </div>

                {/* REWARD POINTS BANNER (CONVERT POINTS) */}
                <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-100/70 border border-yellow-300/80 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-sm text-yellow-950">
                            <Award className="w-5 h-5 text-yellow-600" />
                            <span>Programme Chauffeur Élite Sellify — Vous avez {Number(stats.reward_points || 1200).toLocaleString('fr-FR')} points !</span>
                        </div>
                        <p className="text-xs text-yellow-900 leading-relaxed font-normal max-w-2xl">
                            Chaque livraison effectuée dans les délais vous rapporte <strong>100 points</strong>. Convertissez vos points en <strong>cash direct</strong> (1 pt = 1 FCFA) ou activez un <strong>Boost de Recommandation IA</strong> pour recevoir les courses en priorité.
                        </p>
                    </div>

                    <button
                        onClick={() => setPointsModalOpen(true)}
                        className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 border border-yellow-500"
                    >
                        <Gift className="w-4 h-4" />
                        <span>Utiliser mes points</span>
                    </button>
                </div>

                {/* PAYOUT FORM & FINANCIAL CHART GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* FORMULAIRE DE RETRAIT MULTI-MOYENS (1 col) */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <div className="border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-sm text-stone-900">Demander un Retrait Immédiat</h3>
                            </div>
                            <span className="text-[11px] text-stone-400 block mt-0.5">Transfert sous 15 minutes sans frais</span>
                        </div>

                        {/* Provider Selector Tabs */}
                        <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutProvider('mtn');
                                    setPayoutData('provider', 'mtn');
                                }}
                                className={`py-2 px-1 rounded-lg text-center transition-all ${
                                    payoutProvider === 'mtn' ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                MTN MoMo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutProvider('orange');
                                    setPayoutData('provider', 'orange');
                                }}
                                className={`py-2 px-1 rounded-lg text-center transition-all ${
                                    payoutProvider === 'orange' ? 'bg-orange-500 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Orange Money
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutProvider('bank_card');
                                    setPayoutData('provider', 'bank_card');
                                }}
                                className={`py-2 px-1 rounded-lg text-center transition-all ${
                                    payoutProvider === 'bank_card' ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Carte Bancaire
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
                            
                            {/* Montant */}
                            <div className="space-y-1">
                                <label className="font-bold text-stone-700 block">
                                    Montant à retirer (FCFA) :
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1000"
                                        max={stats.available_balance}
                                        value={payoutData.amount}
                                        onChange={(e) => setPayoutData('amount', e.target.value)}
                                        placeholder="Ex: 15 000"
                                        className="w-full pl-3 pr-14 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold outline-none focus:ring-2 focus:ring-yellow-400"
                                        required
                                    />
                                    <span className="absolute right-3 top-2.5 text-stone-400 font-bold">FCFA</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                                    <span>Min: 1 000 FCFA</span>
                                    <button
                                        type="button"
                                        onClick={() => setPayoutData('amount', stats.available_balance || 0)}
                                        className="text-yellow-700 font-bold hover:underline"
                                    >
                                        Tout retirer ({Number(stats.available_balance || 0).toLocaleString('fr-FR')} F)
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Money Phone Input */}
                            {payoutProvider !== 'bank_card' ? (
                                <div className="space-y-1">
                                    <label className="font-bold text-stone-700 block">
                                        Numéro de compte {payoutProvider === 'mtn' ? 'MTN MoMo' : 'Orange Money'} :
                                    </label>
                                    <div className="relative">
                                        <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                        <input
                                            type="tel"
                                            value={payoutData.phone}
                                            onChange={(e) => setPayoutData('phone', e.target.value)}
                                            placeholder="+237 6xx xx xx xx"
                                            className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono outline-none focus:ring-2 focus:ring-yellow-400"
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* Carte Bancaire Visa/Mastercard Inputs */
                                <div className="space-y-2.5">
                                    <div className="space-y-1">
                                        <label className="font-bold text-stone-700 block">Numéro de Carte (Visa / Mastercard) :</label>
                                        <div className="relative">
                                            <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                            <input
                                                type="text"
                                                maxLength="19"
                                                value={payoutData.card_number}
                                                onChange={(e) => setPayoutData('card_number', e.target.value)}
                                                placeholder="4234 5678 9012 3456"
                                                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="font-bold text-stone-700 block text-[11px]">Titulaire de la carte :</label>
                                            <input
                                                type="text"
                                                value={payoutData.card_holder}
                                                onChange={(e) => setPayoutData('card_holder', e.target.value)}
                                                placeholder="Nom & Prénom"
                                                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-stone-700 block text-[11px]">Expiration (MM/AA) :</label>
                                            <input
                                                type="text"
                                                maxLength="5"
                                                value={payoutData.card_expiry}
                                                onChange={(e) => setPayoutData('card_expiry', e.target.value)}
                                                placeholder="12/28"
                                                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs font-mono outline-none focus:ring-2 focus:ring-yellow-400"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reassurance Notice */}
                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Frais de retrait Sellify : <strong>0 FCFA (Gratuit)</strong></span>
                            </div>

                            <button
                                type="submit"
                                disabled={payoutProcessing}
                                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                            >
                                <ArrowUpRight className="w-4 h-4 shrink-0" />
                                <span>{payoutProcessing ? 'Traitement...' : 'Confirmer le Retrait Immédiat'}</span>
                            </button>
                        </form>
                    </div>

                    {/* GRAPHIQUE FINANCIER & STATISTIQUES (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div>
                                <h3 className="font-bold text-sm text-stone-900">Évolution Financière & Revenus de Livraison</h3>
                                <span className="text-[11px] text-stone-400 font-normal">Courbe des frais de course perçus ce mois</span>
                            </div>
                            <span className="px-3 py-1 bg-yellow-50 text-yellow-950 font-bold text-xs rounded-full border border-yellow-300">
                                Total : {Number(stats.total_earned || 0).toLocaleString('fr-FR')} FCFA
                            </span>
                        </div>

                        <div className="h-64 w-full">
                            <Line data={earningsLineData} options={earningsLineOptions} />
                        </div>

                        {/* Recent Payout History List */}
                        <div className="space-y-2 pt-2 border-t border-stone-100">
                            <span className="text-xs font-bold text-stone-700 block">Derniers retraits effectués :</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {(stats.withdrawals_history || []).map((wth) => (
                                    <div key={wth.id} className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-stone-900">+{Number(wth.amount).toLocaleString('fr-FR')} F</span>
                                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Effectué</span>
                                        </div>
                                        <span className="text-[10px] text-stone-500 block truncate">{wth.method} · {wth.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* COMPLETED DELIVERIES & PRINTABLE DELIVERY SLIPS */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-yellow-600" />
                            <h3 className="font-bold text-sm text-stone-900">Historique des Courses Clôturées & Bordereaux de Livraison</h3>
                        </div>
                        <span className="text-xs text-stone-400">{completedOrders.total || completedOrders.data?.length || 0} course(s)</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-stone-200/80">
                        <table className="w-full text-left text-xs text-stone-600 min-w-[650px]">
                            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200/80">
                                <tr>
                                    <th className="py-3 px-4">N° Commande</th>
                                    <th className="py-3 px-4">Boutique</th>
                                    <th className="py-3 px-4">Client</th>
                                    <th className="py-3 px-4">Frais Livreur</th>
                                    <th className="py-3 px-4">Points Gagnés</th>
                                    <th className="py-3 px-4 text-right">Bordereau / Facture</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {completedOrders.data && completedOrders.data.length > 0 ? (
                                    completedOrders.data.map((ord) => (
                                        <tr key={ord.id} className="hover:bg-yellow-50/40 transition-colors">
                                            <td className="py-3 px-4 font-mono font-bold text-stone-900">#{ord.order_number}</td>
                                            <td className="py-3 px-4 font-medium text-stone-800">{ord.shop?.name || 'Boutique'}</td>
                                            <td className="py-3 px-4 font-medium text-stone-800">{ord.user?.first_name} {ord.user?.last_name}</td>
                                            <td className="py-3 px-4 font-bold text-emerald-600">
                                                +{Number(ord.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-950 font-bold text-[10px]">
                                                    <Award className="w-3 h-3 text-yellow-700" />
                                                    <span>+100 pts</span>
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => setSelectedSlipOrder(ord)}
                                                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1 border border-stone-200"
                                                >
                                                    <Printer className="w-3.5 h-3.5 text-stone-600" />
                                                    <span>Reçu / Bordereau</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-stone-400 text-xs">
                                            Aucune course clôturée enregistrée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* POINTS CONVERTER & REWARDS MODAL */}
            {pointsModalOpen && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-150">
                        
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                                    <Award className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-stone-900">Boutique de Points Sellify</h3>
                                    <span className="text-[11px] text-stone-400 block font-mono">Solde : {stats.reward_points || 1200} points</span>
                                </div>
                            </div>
                            <button onClick={() => setPointsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePointsSubmit} className="space-y-4 text-xs">
                            
                            {/* Conversion Type Radio */}
                            <div className="space-y-2">
                                <label className="font-bold text-stone-700 block">Choisissez comment utiliser vos points :</label>
                                
                                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                    pointsData.type === 'cash' ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400' : 'bg-stone-50 border-stone-200'
                                }`}>
                                    <input
                                        type="radio"
                                        name="points_type"
                                        checked={pointsData.type === 'cash'}
                                        onChange={() => setPointsData('type', 'cash')}
                                        className="mt-1 text-yellow-500"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-stone-900">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Conversion en Cash Direct (1 pt = 1 FCFA)</span>
                                        </div>
                                        <p className="text-[11px] text-stone-500 mt-0.5">
                                            Crédite immédiatement le montant en FCFA sur votre solde disponible au retrait.
                                        </p>
                                    </div>
                                </label>

                                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                    pointsData.type === 'boost' ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400' : 'bg-stone-50 border-stone-200'
                                }`}>
                                    <input
                                        type="radio"
                                        name="points_type"
                                        checked={pointsData.type === 'boost'}
                                        onChange={() => setPointsData('type', 'boost')}
                                        className="mt-1 text-yellow-500"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-stone-900">
                                            <Zap className="w-3.5 h-3.5 text-yellow-600" />
                                            <span>Boost Priorité IA (500 pts = 24h priorité)</span>
                                        </div>
                                        <p className="text-[11px] text-stone-500 mt-0.5">
                                            L'algorithme IA vous assigne en priorité absolue les courses les plus rentables pendant 24h.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Points Input (If cash) */}
                            {pointsData.type === 'cash' && (
                                <div className="space-y-1">
                                    <label className="font-bold text-stone-700 block">Nombre de points à convertir :</label>
                                    <input
                                        type="number"
                                        min="100"
                                        max={stats.reward_points || 1200}
                                        step="100"
                                        value={pointsData.points}
                                        onChange={(e) => setPointsData('points', e.target.value)}
                                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    <span className="text-[10px] text-emerald-600 font-bold block">
                                        = +{Number(pointsData.points || 0).toLocaleString('fr-FR')} FCFA sur votre solde retirable
                                    </span>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => setPointsModalOpen(false)}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={pointsProcessing}
                                    className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs border border-yellow-500"
                                >
                                    {pointsProcessing ? 'Conversion...' : 'Valider la conversion'}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* PRINTABLE DELIVERY SLIP MODAL */}
            {selectedSlipOrder && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-150">
                        
                        {/* Printable Area */}
                        <div id="printable-delivery-slip" className="space-y-4 text-xs text-stone-800 p-4 border border-stone-200 rounded-xl bg-stone-50">
                            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                                <div>
                                    <h4 className="font-bold text-sm text-stone-900">BORDEREAU DE LIVRAISON SELLIFY</h4>
                                    <span className="text-[11px] text-stone-500 block font-mono">Commande #{selectedSlipOrder.order_number}</span>
                                </div>
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-md">
                                    LIVRAISON CERTIFIÉE
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div>
                                    <span className="text-stone-400 block">Livreur :</span>
                                    <strong className="text-stone-900">{driver.user?.first_name} {driver.user?.last_name} ({driver.vehicle_plate || 'LT-492-BX'})</strong>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Date & Heure :</span>
                                    <strong className="text-stone-900">{new Date(selectedSlipOrder.created_at).toLocaleString('fr-FR')}</strong>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Boutique d'expédition :</span>
                                    <strong className="text-stone-900">{selectedSlipOrder.shop?.name || 'Boutique Sellify'}</strong>
                                </div>
                                <div>
                                    <span className="text-stone-400 block">Destinataire Client :</span>
                                    <strong className="text-stone-900">{selectedSlipOrder.user?.first_name} {selectedSlipOrder.user?.last_name}</strong>
                                </div>
                            </div>

                            <div className="p-2.5 bg-white rounded-lg border border-stone-200 space-y-1 text-[11px]">
                                <div className="flex justify-between">
                                    <span>Frais de course livreur perçus :</span>
                                    <strong className="text-emerald-600 font-bold">+{Number(selectedSlipOrder.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Points fidélité attribués :</span>
                                    <strong className="text-yellow-700 font-bold">+100 Points</strong>
                                </div>
                                <div className="flex justify-between border-t border-stone-100 pt-1">
                                    <span>Mode de sécurisation :</span>
                                    <strong className="text-stone-900">Double Sécurité (OTP 6 chiffres + Signature Tactile)</strong>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                            <button
                                onClick={() => setSelectedSlipOrder(null)}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Imprimer le reçu</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </DriverLayout>
    );
}
