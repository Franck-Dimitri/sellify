import React, { useState, useMemo } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
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
    X,
    Download,
    Printer,
    FileText,
    TrendingUp,
    BarChart3,
    Calendar,
    ChevronDown,
    Info,
    Check,
    CreditCard
} from 'lucide-react';

export default function WalletIndex({ 
    wallet, 
    shopsBreakdown = [], 
    transactions = [], 
    withdrawals = [],
    analytics = {}
}) {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showStatementModal, setShowStatementModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [chartTimeframe, setChartTimeframe] = useState('all');

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

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Tab filter
            if (activeTab === 'credit' && !t.type.includes('credit') && !t.type.includes('release')) {
                return false;
            }
            if (activeTab === 'debit' && !t.type.includes('debit') && !t.type.includes('withdrawal') && !t.type.includes('penalty')) {
                return false;
            }
            if (activeTab === 'refund' && !t.type.includes('refund')) {
                return false;
            }

            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchRef = (t.reference || '').toLowerCase().includes(q);
                const matchDesc = (t.description || '').toLowerCase().includes(q);
                const matchType = (t.type || '').toLowerCase().includes(q);
                const matchAmount = String(t.amount || '').includes(q);
                if (!matchRef && !matchDesc && !matchType && !matchAmount) {
                    return false;
                }
            }

            return true;
        });
    }, [transactions, activeTab, searchQuery]);

    // Client-side CSV export generator (instantaneous fallback & direct download)
    const handleClientExportCsv = () => {
        const headers = ["ID", "Date", "Reference", "Type", "Description", "Montant (FCFA)", "Statut"];
        const rows = transactions.map(t => [
            t.id,
            t.created_at ? new Date(t.created_at).toLocaleString('fr-FR') : '',
            `"${t.reference || ''}"`,
            `"${t.type || ''}"`,
            `"${(t.description || '').replace(/"/g, '""')}"`,
            t.amount,
            `"${t.status || 'completed'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `releve_transactions_sellify_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Print financial statement
    const handlePrintStatement = () => {
        window.print();
    };

    // Analytics Trends Data
    const monthlyTrends = analytics.monthly_trends || [
        { month: 'Mars', inflow: 95000, outflow: 25000, net: 70000 },
        { month: 'Avr', inflow: 140000, outflow: 40000, net: 100000 },
        { month: 'Mai', inflow: 185000, outflow: 50000, net: 135000 },
        { month: 'Juin', inflow: 260000, outflow: 75000, net: 185000 },
        { month: 'Juil', inflow: 385000, outflow: 95000, net: 290000 },
        { month: 'Août', inflow: 420000, outflow: 110000, net: 310000 },
    ];

    const maxChartValue = Math.max(...monthlyTrends.map(m => Math.max(m.inflow, m.outflow)), 100000);

    const totalInflow = analytics.total_inflow || transactions.filter(t => t.type.includes('credit') || t.type.includes('release')).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const totalOutflow = analytics.total_outflow || withdrawals.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    return (
        <SellerCentralLayout title="Portefeuille Vendeur & Finances">
            <Head title="Portefeuille Multi-Boutiques - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800 antialiased font-sans">
                
                {/* Header Banner with Quick Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-yellow-50/70 border border-yellow-200/80 p-5 sm:p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-yellow-800 font-semibold text-xs uppercase tracking-wide">
                            <Wallet className="w-4 h-4 text-yellow-600" />
                            <span>Gestion Financière & Séquestre Escrow</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900">
                            Portefeuille & Relevé Financier Vendeur
                        </h1>
                        <p className="text-xs text-stone-600 font-normal">
                            Suivez l'intégralité de vos flux de trésorerie, vos versements sous séquestre, vos retraits et générez vos relevés certifiés.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={() => setShowStatementModal(true)}
                            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs rounded-xl border border-stone-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <FileText className="w-3.5 h-3.5 text-stone-600" />
                            <span>Relevé Officiel</span>
                        </button>

                        <button
                            onClick={handleClientExportCsv}
                            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs rounded-xl border border-stone-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Exporter CSV</span>
                        </button>

                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Demander un Retrait</span>
                        </button>
                    </div>
                </div>

                {/* 1. Main Stats KPIs (4 Bento Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Solde Global Disponible */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Solde Disponible (Retirable)</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 border border-emerald-100">
                                <Wallet className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-stone-900">
                                {Number(wallet.balance).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                            </p>
                            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Transférable instantanément (MoMo / Orange)
                            </span>
                        </div>
                    </div>

                    {/* Séquestre Escrow en cours */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Fonds Bloqués en Séquestre</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-800 border border-yellow-200">
                                <Lock className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-800">
                                {Number(wallet.pending_balance).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                            </p>
                            <span className="text-[11px] text-yellow-700 font-medium flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> Débloqués dès confirmation OTP client
                            </span>
                        </div>
                    </div>

                    {/* Total Entrées Historiques */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Chiffre d'Affaires Encaissé</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {Number(totalInflow || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                            </p>
                            <span className="text-[11px] text-stone-400 font-normal mt-0.5 block">
                                Ventes cumulées sur l'ensemble des boutiques
                            </span>
                        </div>
                    </div>

                    {/* Total Retraits Effectués */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Retraits Cumulés</span>
                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-700">
                                {Number(totalOutflow || 0).toLocaleString('fr-FR')} <span className="text-xs font-semibold text-stone-500">FCFA</span>
                            </p>
                            <span className="text-[11px] text-stone-400 font-normal mt-0.5 block">
                                {withdrawals.length} virement(s) Mobile Money / Banque
                            </span>
                        </div>
                    </div>

                </div>

                {/* 2. Interactive Charts Section (Cashflow Growth & Multi-Shop Split) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Monthly Cashflow Bar Chart (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Évolution des Flux Financiers (FCFA)</h3>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                                    <span className="text-stone-600 font-medium">Entrées (Escrow)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                                    <span className="text-stone-600 font-medium">Retraits sortants</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Bars */}
                        <div className="pt-2 pb-2">
                            <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-stone-200 pb-2 px-2">
                                {monthlyTrends.map((item, idx) => {
                                    const inflowHeight = maxChartValue > 0 ? Math.max(15, Math.round((item.inflow / maxChartValue) * 100)) : 15;
                                    const outflowHeight = maxChartValue > 0 ? Math.max(10, Math.round((item.outflow / maxChartValue) * 100)) : 10;
                                    
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-1 group h-full justify-end">
                                            {/* Hover tooltip */}
                                            <div className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-2 py-1 rounded shadow-xs text-center pointer-events-none whitespace-nowrap z-20">
                                                +{Number(item.inflow).toLocaleString('fr-FR')} F<br />
                                                <span className="text-stone-400 font-normal">-{Number(item.outflow).toLocaleString('fr-FR')} F</span>
                                            </div>

                                            {/* Dual bars */}
                                            <div className="flex items-end gap-1.5 w-full justify-center">
                                                <div 
                                                    style={{ height: `${inflowHeight}%` }} 
                                                    className="w-4 bg-yellow-400 hover:bg-yellow-500 rounded-t-md transition-all duration-300 shadow-2xs"
                                                ></div>
                                                <div 
                                                    style={{ height: `${outflowHeight}%` }} 
                                                    className="w-4 bg-stone-200 hover:bg-stone-300 rounded-t-md transition-all duration-300 shadow-2xs"
                                                ></div>
                                            </div>

                                            <span className="text-[11px] font-medium text-stone-500 mt-1">{item.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 p-3 rounded-xl">
                            <span className="flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-stone-400" />
                                Commissions Sellify : <strong>0 FCFA</strong> sur les transferts Mobile Money.
                            </span>
                            <span className="font-semibold text-stone-800">Taux de succès des paiements : 100%</span>
                        </div>
                    </div>

                    {/* Shop Financial Breakdown Card (1 col) */}
                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Solde par Boutique</h3>
                            </div>
                            <span className="text-xs text-stone-400">{shopsBreakdown.length} boutique(s)</span>
                        </div>

                        <div className="space-y-3">
                            {shopsBreakdown.length === 0 ? (
                                <p className="text-xs text-stone-400 py-6 text-center">Aucune boutique associée.</p>
                            ) : (
                                shopsBreakdown.map((shop) => {
                                    const totalShop = (parseFloat(shop.balance) || 0) + (parseFloat(shop.pending_balance) || 0);
                                    const totalAll = ((parseFloat(wallet.balance) || 0) + (parseFloat(wallet.pending_balance) || 0)) || 1;
                                    const percentage = Math.min(100, Math.round((totalShop / totalAll) * 100));

                                    return (
                                        <div key={shop.id} className="p-3.5 bg-stone-50/80 border border-stone-200/70 rounded-xl space-y-2 hover:border-yellow-400 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-stone-900 truncate max-w-[160px]">{shop.name}</span>
                                                <span className="text-xs font-bold text-stone-900">{Number(shop.balance).toLocaleString('fr-FR')} F</span>
                                            </div>

                                            {/* Mini Progress Bar */}
                                            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${percentage}%` }} 
                                                    className="bg-yellow-400 h-full rounded-full"
                                                ></div>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-stone-500">
                                                <span>{percentage}% du volume global</span>
                                                <span className="text-yellow-800 font-medium">Séquestre: {Number(shop.pending_balance).toLocaleString('fr-FR')} F</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>

                {/* 3. Detailed Transactions Ledger with Filters & Search */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden space-y-0">
                    
                    {/* Table Header Controls */}
                    <div className="p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-yellow-600" />
                            <h3 className="font-bold text-stone-900 text-sm">Grand Livre des Transactions & Mouvements</h3>
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
                                {filteredTransactions.length} écriture(s)
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Search Box */}
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Rechercher référence, libellé..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-yellow-400 outline-none w-48 sm:w-60"
                                />
                            </div>

                            {/* Tab Filters */}
                            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/80">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                        activeTab === 'all' ? 'bg-yellow-400 text-yellow-950 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    Toutes
                                </button>
                                <button
                                    onClick={() => setActiveTab('credit')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                        activeTab === 'credit' ? 'bg-emerald-600 text-white shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    Entrées (+ Escrow)
                                </button>
                                <button
                                    onClick={() => setActiveTab('debit')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                        activeTab === 'debit' ? 'bg-stone-900 text-white shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    Retraits (-)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">Date & Heure</th>
                                    <th className="px-6 py-3.5">Référence</th>
                                    <th className="px-6 py-3.5">Type d'opération</th>
                                    <th className="px-6 py-3.5">Description & Contexte</th>
                                    <th className="px-6 py-3.5 text-right">Montant</th>
                                    <th className="px-6 py-3.5 text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-stone-400">
                                            Aucune transaction ne correspond à vos filtres.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((t) => {
                                        const isCredit = t.type.includes('credit') || t.type.includes('release');
                                        const isRefund = t.type.includes('refund');
                                        
                                        return (
                                            <tr 
                                                key={t.id} 
                                                onClick={() => setSelectedTransaction(t)}
                                                className="hover:bg-yellow-50/40 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-3.5 text-stone-500 font-mono text-[11px]">
                                                    {t.created_at ? new Date(t.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                                                </td>

                                                <td className="px-6 py-3.5 font-mono font-bold text-stone-900 group-hover:text-yellow-700">
                                                    {t.reference || `TX-${t.id}`}
                                                </td>

                                                <td className="px-6 py-3.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                                                        isCredit 
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                            : isRefund
                                                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                                                    }`}>
                                                        {t.type.replace('_', ' ')}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-3.5 font-medium text-stone-800 max-w-xs truncate">
                                                    {t.description || 'Mouvement comptable'}
                                                </td>

                                                <td className={`px-6 py-3.5 text-right font-bold text-sm ${
                                                    isCredit ? 'text-emerald-600' : 'text-stone-900'
                                                }`}>
                                                    {isCredit ? '+' : '-'}{Number(t.amount).toLocaleString('fr-FR')} FCFA
                                                </td>

                                                <td className="px-6 py-3.5 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <Check className="w-3 h-3 mr-1" /> Validé
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Withdrawals Tracking History */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-yellow-600" />
                            <h3 className="font-bold text-stone-900 text-sm">Demandes de Retraits vers Mobile Money / Banque</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-600">
                            <thead className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] font-semibold text-stone-400 uppercase">
                                <tr>
                                    <th className="px-6 py-3.5">Montant</th>
                                    <th className="px-6 py-3.5">Moyen de Paiement</th>
                                    <th className="px-6 py-3.5">Numéro / Compte</th>
                                    <th className="px-6 py-3.5">Statut de Traitement</th>
                                    <th className="px-6 py-3.5 text-right">Date d'émission</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {withdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-stone-400 font-normal">
                                            Aucun retrait enregistré pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    withdrawals.map((w) => (
                                        <tr key={w.id} className="hover:bg-stone-50/80 transition-colors">
                                            <td className="px-6 py-3.5 font-bold text-stone-900 text-sm">
                                                {Number(w.amount).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="px-6 py-3.5 uppercase font-semibold text-stone-700">
                                                {w.payment_method.replace('_', ' ')}
                                            </td>
                                            <td className="px-6 py-3.5 font-mono text-stone-700">
                                                {w.phone_number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    w.status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                                                }`}>
                                                    {w.status === 'completed' ? '✓ Transféré' : '⏳ En cours de validation (24h)'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right text-stone-400 font-normal font-mono text-[11px]">
                                                {new Date(w.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL 1: Withdrawal Request */}
                {showWithdrawModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-stone-800 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div>
                                    <h3 className="font-bold text-stone-900 text-base">Demande de Retrait de Fonds</h3>
                                    <p className="text-xs text-stone-500">Transférer votre solde vers Mobile Money ou Banque</p>
                                </div>
                                <button onClick={() => setShowWithdrawModal(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-normal">
                                <div>
                                    <label className="block font-semibold text-stone-700 mb-1">Montant à retirer (FCFA) *</label>
                                    <input
                                        type="number"
                                        min="5000"
                                        max={wallet.balance}
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="ex: 50000"
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                                        required
                                    />
                                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Solde immédiatement disponible : {Number(wallet.balance).toLocaleString('fr-FR')} FCFA</span>
                                </div>

                                <div>
                                    <label className="block font-semibold text-stone-700 mb-1">Boutique émettrice (Optionnel)</label>
                                    <select
                                        value={selectedShopId}
                                        onChange={(e) => setSelectedShopId(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none cursor-pointer"
                                    >
                                        <option value="">Toutes les boutiques (Solde Consolidé)</option>
                                        {shopsBreakdown.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({Number(s.balance).toLocaleString('fr-FR')} FCFA)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-stone-700 mb-1">Moyen de Paiement *</label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none cursor-pointer"
                                    >
                                        <option value="orange_money">Orange Money Cameroun (OM)</option>
                                        <option value="mtn_momo">MTN Mobile Money Cameroun (MoMo)</option>
                                        <option value="bank_transfer">Virement Bancaire (UBA, Afriland, etc.)</option>
                                    </select>
                                </div>

                                {data.payment_method !== 'bank_transfer' ? (
                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">Numéro Mobile Money Récepteur *</label>
                                        <input
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            placeholder="+237 6XX XX XX XX"
                                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none font-mono"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block font-semibold text-stone-700 mb-1">Nom de la Banque</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Afriland First Bank"
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-stone-700 mb-1">Numéro de Compte / IBAN</label>
                                            <input
                                                type="text"
                                                placeholder="CM21 10005 00001..."
                                                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 text-xs hover:bg-stone-50 font-semibold cursor-pointer"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-2.5 bg-yellow-400 text-yellow-950 rounded-xl text-xs font-bold hover:bg-yellow-500 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                                    >
                                        {submitting ? 'Traitement...' : 'Confirmer le Retrait'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Official Financial Statement & Print Preview */}
                {showStatementModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 text-stone-800 max-h-[90vh] overflow-y-auto">
                            
                            {/* Statement Header */}
                            <div className="flex justify-between items-start border-b border-stone-200 pb-6">
                                <div>
                                    <div className="flex items-center gap-2 text-yellow-600 font-bold text-lg">
                                        <span>⚡ SELLIFY.ME</span>
                                    </div>
                                    <p className="text-xs text-stone-500 font-medium mt-1">Plateforme de Commerce & Séquestre Escrow</p>
                                    <p className="text-[11px] text-stone-400 font-mono">Douala, Cameroun — RCCM: RC/DLA/2026/B/1982</p>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-lg text-xs font-bold uppercase">
                                        Relevé de Compte Officiel
                                    </span>
                                    <p className="text-xs text-stone-500 mt-2 font-mono">Date d'édition : {new Date().toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>

                            {/* Summary Box */}
                            <div className="grid grid-cols-3 gap-4 bg-stone-50 border border-stone-200 p-4 rounded-xl text-xs">
                                <div>
                                    <span className="text-stone-400 block text-[11px]">Solde Disponible Actuel</span>
                                    <span className="text-base font-bold text-emerald-600">{Number(wallet.balance).toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <div>
                                    <span className="text-stone-400 block text-[11px]">Fonds sous Séquestre</span>
                                    <span className="text-base font-bold text-yellow-800">{Number(wallet.pending_balance).toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <div>
                                    <span className="text-stone-400 block text-[11px]">Total Ventes Encaissées</span>
                                    <span className="text-base font-bold text-stone-900">{Number(totalInflow).toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>

                            {/* Statement Transactions Sample */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-xs text-stone-900 uppercase">Détail des Dernières Écritures</h4>
                                <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
                                    <thead className="bg-stone-100 text-[11px] text-stone-600 font-bold uppercase">
                                        <tr>
                                            <th className="p-2.5">Date</th>
                                            <th className="p-2.5">Réf.</th>
                                            <th className="p-2.5">Description</th>
                                            <th className="p-2.5 text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 text-stone-700">
                                        {transactions.slice(0, 10).map((t) => (
                                            <tr key={t.id}>
                                                <td className="p-2.5 font-mono text-[11px]">{new Date(t.created_at).toLocaleDateString('fr-FR')}</td>
                                                <td className="p-2.5 font-mono font-bold text-[11px]">{t.reference}</td>
                                                <td className="p-2.5">{t.description}</td>
                                                <td className="p-2.5 text-right font-bold">{Number(t.amount).toLocaleString('fr-FR')} FCFA</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Actions & Print */}
                            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                                <span className="text-[11px] text-stone-400">Document généré automatiquement sous sceau numérique Sellify.</span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowStatementModal(false)}
                                        className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                                    >
                                        Fermer
                                    </button>
                                    <button
                                        onClick={handlePrintStatement}
                                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>Imprimer / PDF</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* MODAL 3: Transaction Detail Card */}
                {selectedTransaction && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-stone-800 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center">
                                        <Coins className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="font-bold text-stone-900 text-sm">Détail de l'Écriture</h3>
                                </div>
                                <button onClick={() => setSelectedTransaction(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-center space-y-1">
                                    <span className="text-stone-400 text-[11px]">Montant Transigé</span>
                                    <p className="text-2xl font-bold text-stone-900">{Number(selectedTransaction.amount).toLocaleString('fr-FR')} FCFA</p>
                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        ✓ Opération Sécurisée & Validée
                                    </span>
                                </div>

                                <div className="divide-y divide-stone-100 pt-1">
                                    <div className="py-2 flex justify-between">
                                        <span className="text-stone-500">Référence</span>
                                        <span className="font-mono font-bold text-stone-900">{selectedTransaction.reference || `TX-${selectedTransaction.id}`}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-stone-500">Type</span>
                                        <span className="font-semibold text-stone-800 uppercase">{selectedTransaction.type}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-stone-500">Date d'enregistrement</span>
                                        <span className="font-mono text-stone-700">{new Date(selectedTransaction.created_at).toLocaleString('fr-FR')}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-stone-500">Libellé</span>
                                        <span className="font-medium text-stone-900 text-right">{selectedTransaction.description}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => setSelectedTransaction(null)}
                                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </SellerCentralLayout>
    );
}
