import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Zap, 
    Sparkles, 
    ShieldCheck, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Calculator, 
    History, 
    ArrowUpRight,
    TrendingUp,
    Lock,
    Coins,
    Award
} from 'lucide-react';

export default function LoansIndex({ creditData, loans = [], pack }) {
    const maxAmount = creditData?.max_loan_amount || 100000;
    const [amount, setAmount] = useState(maxAmount > 0 ? Math.min(250000, maxAmount) : 50000);
    const [duration, setDuration] = useState(6); // 3, 6, 12 mois
    const [submitting, setSubmitting] = useState(false);

    const rate = creditData?.interest_rate || 0.08;
    const interest = amount * rate * (duration / 12);
    const totalDue = amount + interest;
    const monthlyPayment = Math.round(totalDue / duration);

    const score = creditData?.score || 0;
    const isEligible = creditData?.is_eligible || false;
    const requirements = creditData?.requirements || {};

    const handleApply = (e) => {
        e.preventDefault();
        
        if (!isEligible) {
            alert('Votre compte ne remplit pas encore les critères d\'éligibilité pour souscrire un prêt.');
            return;
        }

        setSubmitting(true);

        router.post(route('seller.loans.request'), {
            amount: amount,
            duration_months: duration
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    return (
        <SellerCentralLayout title="SellifyPay — Micro-Financement Vendeur">
            <Head title="SellifyPay Prêts - Sellify" />

            <div className="max-w-7xl mx-auto space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Zap className="w-4 h-4 text-amber-600" />
                            <span>Micro-Financement Instantané</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            SellifyPay Crédit Vendeur
                        </h1>
                        <p className="text-xs text-stone-600">
                            Obtenez des fonds de trésorerie pour réapprovisionner votre stock, remboursés automatiquement sur vos ventes Escrow.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1.5 bg-amber-500/20 text-amber-900 font-medium rounded-xl text-xs flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            <span>Délivrance Instantanée</span>
                        </div>
                    </div>
                </div>

                {/* Score & Capacity Overview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* Score Card */}
                    <div className="md:col-span-6 bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-amber-600" />
                                Score de Crédit IA SellifyPay
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-semibold text-stone-900">{score}</span>
                                <span className="text-xs text-stone-400 font-medium">/ 100 Points</span>
                            </div>
                            <p className="text-[11px] text-stone-500">
                                Calculé automatiquement selon votre volume de ventes et votre historique d'expéditions.
                            </p>
                        </div>

                        {/* Progress Gauge */}
                        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 flex items-center justify-center relative flex-shrink-0 bg-amber-50/50">
                            <span className="text-sm font-semibold text-amber-900">{score}</span>
                        </div>
                    </div>

                    {/* Loan Capacity Card */}
                    <div className="md:col-span-6 bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
                                <Coins className="w-4 h-4 text-emerald-600" />
                                Plafond Maximum Autorisable
                            </span>
                            <p className="text-2xl font-semibold text-stone-900">
                                {Number(maxAmount).toLocaleString()} FCFA
                            </p>
                            <p className="text-[11px] text-stone-500">
                                Equivalent à 50% de votre volume d'affaires (GMV) moyen.
                            </p>
                        </div>

                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-medium">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                </div>

                {/* Main Grid: Simulator & Eligibility Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Simulator Studio (Left) */}
                    <div className="lg:col-span-7 bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <Calculator className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Simulateur de Prêt Interactif</h2>
                        </div>

                        {/* Amount Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="text-stone-600">Montant souhaité</span>
                                <span className="text-base font-semibold text-amber-950">
                                    {Number(amount).toLocaleString()} FCFA
                                </span>
                            </div>
                            <input
                                type="range"
                                min="50000"
                                max={Math.max(50000, maxAmount)}
                                step="10000"
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="flex justify-between text-[11px] text-stone-400">
                                <span>50 000 FCFA</span>
                                <span>{Number(maxAmount).toLocaleString()} FCFA</span>
                            </div>
                        </div>

                        {/* Duration Selector */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-stone-600">Durée du remboursement</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[3, 6, 12].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setDuration(m)}
                                        className={`py-2 rounded-xl text-xs font-medium transition-all ${
                                            duration === m
                                                ? 'bg-amber-500 text-amber-950 shadow-sm'
                                                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        {m} Mois
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-stone-50 p-4 rounded-xl space-y-2 text-xs text-stone-600 border border-stone-100">
                            <div className="flex justify-between">
                                <span>Taux d'intérêt annuel appliqué ({pack?.toUpperCase() || 'PRO'})</span>
                                <span className="font-medium text-stone-900">{rate * 100}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coût total des intérêts</span>
                                <span className="font-medium text-stone-900">{Number(interest).toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Montant total à rembourser</span>
                                <span className="font-medium text-stone-900">{Number(totalDue).toLocaleString()} FCFA</span>
                            </div>
                            <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-semibold text-stone-900">
                                <span>Mensualité estimée</span>
                                <span className="text-amber-950 text-sm">{Number(monthlyPayment).toLocaleString()} FCFA / mois</span>
                            </div>
                        </div>

                        {/* Apply Loan Button */}
                        <button
                            onClick={handleApply}
                            disabled={!isEligible || submitting}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Zap className="w-4 h-4" />
                            <span>
                                {submitting 
                                    ? 'Traitement...' 
                                    : isEligible 
                                        ? 'Demander le Prêt Immédiat' 
                                        : 'Critères d\'éligibilité non remplis'
                                }
                            </span>
                        </button>
                    </div>

                    {/* Prerequisites & Auto-repayment checklist (Right) */}
                    <div className="lg:col-span-5 bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Critères d'Éligibilité</h2>
                        </div>

                        <ul className="space-y-3 text-xs">
                            <li className="flex items-center justify-between py-1 border-b border-stone-100">
                                <span className="text-stone-600">Pack Pro ou Business</span>
                                {requirements.pack_eligible ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Valide
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-medium">
                                        <XCircle className="w-3.5 h-3.5" /> Requis
                                    </span>
                                )}
                            </li>

                            <li className="flex items-center justify-between py-1 border-b border-stone-100">
                                <span className="text-stone-600">KYC Vendeur Validé</span>
                                {requirements.kyc_verified ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-medium">
                                        <XCircle className="w-3.5 h-3.5" /> En attente
                                    </span>
                                )}
                            </li>

                            <li className="flex items-center justify-between py-1 border-b border-stone-100">
                                <span className="text-stone-600">Score IA ≥ 60 / 100</span>
                                <span className={`font-medium ${requirements.min_score_met ? 'text-emerald-600' : 'text-amber-700'}`}>
                                    {score} / 100
                                </span>
                            </li>

                            <li className="flex items-center justify-between py-1">
                                <span className="text-stone-600">Aucun prêt actif en cours</span>
                                {requirements.no_active_loan ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> Prêt Actif
                                    </span>
                                )}
                            </li>
                        </ul>

                        <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900 space-y-1">
                            <div className="flex items-center gap-1.5 font-medium">
                                <Lock className="w-3.5 h-3.5 text-amber-700" />
                                <span>Remboursement sur Escrow</span>
                            </div>
                            <p className="text-[11px] text-amber-800">
                                Les remboursements sont prélevés automatiquement (30% max) lors de la libération des fonds de chaque vente Escrow.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Loans History Table */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Historique de vos Prêts SellifyPay</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-6 py-3.5">Montant Emprunté</th>
                                    <th className="px-6 py-3.5">Durée</th>
                                    <th className="px-6 py-3.5">Total Dû</th>
                                    <th className="px-6 py-3.5">Montant Remboursé</th>
                                    <th className="px-6 py-3.5">Statut</th>
                                    <th className="px-6 py-3.5">Date Décaissement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {loans.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-stone-400 font-normal">
                                            Aucun prêt souscrit pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    loans.map(loan => {
                                        const progressPercent = Math.min(100, Math.round(((loan.amount_repaid || 0) / loan.total_amount_due) * 100));

                                        return (
                                            <tr key={loan.id} className="hover:bg-stone-50/80 transition-colors">
                                                <td className="px-6 py-3.5 font-semibold text-stone-900">
                                                    {Number(loan.amount).toLocaleString()} FCFA
                                                </td>
                                                <td className="px-6 py-3.5 font-normal">
                                                    {loan.duration_months} Mois
                                                </td>
                                                <td className="px-6 py-3.5 font-normal text-stone-800">
                                                    {Number(loan.total_amount_due).toLocaleString()} FCFA
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="space-y-1">
                                                        <span className="font-medium text-emerald-600">
                                                            {Number(loan.amount_repaid || 0).toLocaleString()} FCFA
                                                        </span>
                                                        <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-emerald-500 rounded-full" 
                                                                style={{ width: `${progressPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                                                        loan.status === 'active' || loan.status === 'approved'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : loan.status === 'completed'
                                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                            : 'bg-stone-100 text-stone-500'
                                                    }`}>
                                                        {loan.status === 'approved' ? 'Approuvé' : loan.status === 'active' ? 'Actif' : loan.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-stone-400 font-normal">
                                                    {loan.disbursed_at ? new Date(loan.disbursed_at).toLocaleDateString('fr-FR') : 'Immédiat'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </SellerCentralLayout>
    );
}
