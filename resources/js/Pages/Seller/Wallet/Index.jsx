import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Wallet, 
    Lock, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Store, 
    Building2, 
    Smartphone, 
    ShieldCheck, 
    History, 
    Plus, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Coins,
    Search,
    Filter,
    X
} from 'lucide-react';

export default function WalletIndex({ wallet, shopsBreakdown = [], transactions = [], withdrawals = [] }) {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const { data, setData, errors } = useForm({
        amount: '',
        payment_method: 'orange_money',
        phone_number: '',
        bank_details: { bank_name: '', iban: '', account_name: '' },
        shop_id: '',
    });

    const handleWithdrawSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            amount: parseFloat(data.amount),
            payment_method: data.payment_method,
            phone_number: data.phone_number,
            bank_details: data.bank_details,
            shop_id: selectedShopId || null,
        };

        router.post(route('seller.wallet.withdraw'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setShowWithdrawModal(false);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    const filteredTransactions = transactions.filter(t => {
        if (activeTab === 'credit') return t.type.includes('credit') || t.type.includes('release');
        if (activeTab === 'debit') return t.type.includes('debit') || t.type.includes('withdrawal');
        return true;
    });

    return (
        <SellerCentralLayout title="Portefeuille Vendeur & Finances">
            <Head title="Portefeuille Multi-Boutiques - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Wallet className="w-4 h-4 text-amber-600" />
                            <span>Gestion Financière Centralisée</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Portefeuille & Retraits Multi-Boutiques
                        </h1>
                        <p className="text-xs text-stone-600">
                            Consultez l'ensemble de vos soldes et fonds sous compte séquestre Escrow pour l'ensemble de vos boutiques.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Demander un Retrait</span>
                    </button>
                </div>

                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Available Balance */}
                    <div className="bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Solde Global Disponible</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700">
                                <Wallet className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-stone-900">
                                {Number(wallet.balance).toLocaleString()} FCFA
                            </p>
                            <p className="text-[11px] text-stone-400 mt-1">
                                Fonds immédiatement transférables par Orange Money / MTN MoMo.
                            </p>
                        </div>
                    </div>

                    {/* Pending Escrow Locked Funds */}
                    <div className="bg-white border border-stone-200/70 p-5 rounded-2xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-stone-500">Fonds Bloqués sur Séquestre (Escrow)</span>
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800">
                                <Lock className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-amber-800">
                                {Number(wallet.pending_balance).toLocaleString()} FCFA
                            </p>
                            <p className="text-[11px] text-stone-400 mt-1">
                                Débloqués sur votre solde dès confirmation de livraison par le client.
                            </p>
                        </div>
                    </div>

                    {/* Escrow Guarantee Callout */}
                    <div className="bg-amber-50/60 border border-amber-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-medium text-xs">
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            <span>Garantie Anti-Fraude Escrow</span>
                        </div>
                        <p className="text-xs text-amber-800 font-normal">
                            Toutes vos transactions sont protégées par le système séquestre Sellify pour assurer la confiance entre vos boutiques et vos acheteurs.
                        </p>
                        <div className="text-[11px] text-amber-700 font-medium pt-1">
                            {shopsBreakdown.length} boutique(s) rattachée(s)
                        </div>
                    </div>

                </div>

                {/* Shop Financial Breakdown Section */}
                <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-amber-600" />
                            <h2 className="font-semibold text-stone-900 text-sm">Ventilation Financière par Boutique</h2>
                        </div>
                        <span className="text-xs text-stone-400">Total : {shopsBreakdown.length} boutique(s)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shopsBreakdown.length === 0 ? (
                            <p className="text-xs text-stone-400 col-span-full py-4 text-center">Aucune boutique enregistrée pour le moment.</p>
                        ) : (
                            shopsBreakdown.map(shop => (
                                <div key={shop.id} className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl space-y-3 hover:border-amber-400 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-medium text-xs">
                                                <Store className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-stone-900 text-xs">{shop.name}</h3>
                                                <p className="text-[10px] text-stone-400">{shop.products_count} produit(s)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-stone-200/60 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-[10px] text-stone-400 block">Disponible</span>
                                            <span className="font-semibold text-stone-900">{Number(shop.balance).toLocaleString()} FCFA</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-stone-400 block">En Séquestre</span>
                                            <span className="font-semibold text-amber-800">{Number(shop.pending_balance).toLocaleString()} FCFA</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Withdrawals History Table */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Demandes de Retrait Effectuées</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-6 py-3.5">Montant</th>
                                    <th className="px-6 py-3.5">Moyen de Paiement</th>
                                    <th className="px-6 py-3.5">Numéro / Compte</th>
                                    <th className="px-6 py-3.5">Statut</th>
                                    <th className="px-6 py-3.5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {withdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-stone-400 font-normal">
                                            Aucune demande de retrait effectuée.
                                        </td>
                                    </tr>
                                ) : (
                                    withdrawals.map(w => (
                                        <tr key={w.id} className="hover:bg-stone-50/80 transition-colors">
                                            <td className="px-6 py-3.5 font-semibold text-stone-900">
                                                {Number(w.amount).toLocaleString()} FCFA
                                            </td>
                                            <td className="px-6 py-3.5 uppercase font-medium text-stone-700">
                                                {w.payment_method.replace('_', ' ')}
                                            </td>
                                            <td className="px-6 py-3.5 text-stone-600 font-mono">
                                                {w.phone_number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                                                    w.status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                                                }`}>
                                                    {w.status === 'completed' ? '✓ Effectué' : '⏳ En cours'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-stone-400 font-normal">
                                                {new Date(w.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Historique Récent des Transactions</h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                    activeTab === 'all' ? 'bg-amber-500 text-amber-950' : 'bg-stone-100 text-stone-600'
                                }`}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setActiveTab('credit')}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                    activeTab === 'credit' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                                }`}
                            >
                                Crédits
                            </button>
                            <button
                                onClick={() => setActiveTab('debit')}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                    activeTab === 'debit' ? 'bg-red-500 text-white' : 'bg-stone-100 text-stone-600'
                                }`}
                            >
                                Débits
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 border-b border-stone-200/70 text-xs font-medium text-stone-500">
                                <tr>
                                    <th className="px-6 py-3.5">Description & Référence</th>
                                    <th className="px-6 py-3.5">Type</th>
                                    <th className="px-6 py-3.5 text-right">Montant</th>
                                    <th className="px-6 py-3.5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-stone-400 font-normal">
                                            Aucune transaction enregistrée.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map(t => {
                                        const isCredit = t.type.includes('credit') || t.type.includes('release');
                                        return (
                                            <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                                                <td className="px-6 py-3.5">
                                                    <p className="font-medium text-stone-900">{t.description || 'Transaction'}</p>
                                                    <p className="text-[11px] text-stone-400 font-mono">Ref: {t.reference || `TX-${t.id}`}</p>
                                                </td>
                                                <td className="px-6 py-3.5 font-medium uppercase text-stone-500">
                                                    {t.type}
                                                </td>
                                                <td className={`px-6 py-3.5 text-right font-semibold ${isCredit ? 'text-emerald-600' : 'text-stone-900'}`}>
                                                    {isCredit ? '+' : '-'}{Number(t.amount).toLocaleString()} FCFA
                                                </td>
                                                <td className="px-6 py-3.5 text-stone-400 font-normal">
                                                    {new Date(t.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Withdraw Modal */}
                {showWithdrawModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-stone-800">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <h3 className="font-semibold text-stone-900 text-sm">Demande de Retrait Mobile Money</h3>
                                <button onClick={() => setShowWithdrawModal(false)} className="text-stone-400 hover:text-stone-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-normal">
                                <div>
                                    <label className="block font-medium text-stone-600 mb-1">Montant à retirer (FCFA) *</label>
                                    <input
                                        type="number"
                                        min="5000"
                                        max={wallet.balance}
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="ex: 50000"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                    <span className="text-[10px] text-stone-400 mt-1 block">Solde disponible : {Number(wallet.balance).toLocaleString()} FCFA</span>
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-600 mb-1">Boutique associée (Optionnel)</label>
                                    <select
                                        value={selectedShopId}
                                        onChange={e => setSelectedShopId(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value="">Toutes les boutiques (Solde Global)</option>
                                        {shopsBreakdown.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({Number(s.balance).toLocaleString()} FCFA disponible)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-medium text-stone-600 mb-1">Moyen de Paiement *</label>
                                    <select
                                        value={data.payment_method}
                                        onChange={e => setData('payment_method', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value="orange_money">Orange Money</option>
                                        <option value="mtn_momo">MTN Mobile Money</option>
                                        <option value="bank_transfer">Virement Bancaire</option>
                                    </select>
                                </div>

                                {data.payment_method !== 'bank_transfer' && (
                                    <div>
                                        <label className="block font-medium text-stone-600 mb-1">Numéro Mobile Money *</label>
                                        <input
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            placeholder="ex: 690 12 34 56"
                                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="pt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 text-xs hover:bg-stone-50 font-medium transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-2.5 bg-amber-500 text-amber-950 rounded-xl text-xs font-medium hover:bg-amber-600 transition-colors shadow-xs disabled:opacity-50"
                                    >
                                        {submitting ? 'Traitement...' : 'Confirmer le Retrait'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </SellerCentralLayout>
    );
}
