import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Store, 
    Search, 
    Eye, 
    CheckCircle2, 
    XCircle, 
    Sun
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

export default function Index({ shops = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const { post, processing } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.shops.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleTabChange = (st) => {
        setStatusFilter(st);
        router.get(route('admin.shops.index'), { search, status: st }, { preserveState: true });
    };

    const handleActivate = (shopId, shopName) => {
        if (confirm(`Voulez-vous réactiver la boutique "${shopName}" ?`)) {
            post(route('admin.shops.activate', shopId));
        }
    };

    const handleSuspend = (shopId, shopName) => {
        if (confirm(`Voulez-vous suspendre la boutique "${shopName}" ?`)) {
            post(route('admin.shops.suspend', shopId));
        }
    };

    // Chart.js Configuration
    const shopBarData = {
        labels: ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'],
        datasets: [
            {
                label: 'Nouvelles boutiques',
                data: [4, 8, 12, 19, 28, stats.total_shops || 35],
                backgroundColor: '#eab308',
                borderRadius: 6,
            }
        ]
    };

    const shopBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(231, 229, 228, 0.6)' } }
        }
    };

    const shopDoughnutData = {
        labels: ['Actives', 'Inactives / Suspendues', 'En vacances'],
        datasets: [
            {
                data: [stats.active_shops || 25, stats.inactive_shops || 6, stats.holiday_shops || 4],
                backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
                borderWidth: 0,
            }
        ]
    };

    const shopDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        cutout: '70%'
    };

    return (
        <AdminLayout title="Modération des boutiques">
            <Head title="Gestion des boutiques - Sellify Admin" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Store className="w-4 h-4 text-yellow-600" />
                            <span>Répertoire & modération des vendeurs</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Gestion globale des boutiques partenaires
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Supervisez les boutiques enregistrées, leur statut d'ouverture et leur catalogue de produits.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-xl text-xs font-bold text-yellow-950 shrink-0">
                        {stats.active_shops || 0} boutique(s) actives sur Sellify
                    </div>
                </div>

                {/* 4 Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Total boutiques</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <Store className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">{stats.total_shops || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Boutiques inscrites</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Actives & ouvertes</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.active_shops || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Accès catalogue actif</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Suspendues / Inactives</span>
                            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-200">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-rose-600">{stats.inactive_shops || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Ventes désactivées</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">En mode vacances</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <Sun className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{stats.holiday_shops || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Fermeture temporaire</span>
                    </div>
                </div>

                {/* CHART.JS CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Croissance des boutiques par mois</h3>
                            <span className="text-xs text-stone-400">Chart.js Graphique</span>
                        </div>
                        <div className="h-52">
                            <Bar data={shopBarData} options={shopBarOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Statuts d'exploitation</h3>
                        </div>
                        <div className="h-52 relative flex items-center justify-center">
                            <Doughnut data={shopDoughnutData} options={shopDoughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                            {[
                                { id: '', label: 'Toutes les boutiques' },
                                { id: 'active', label: 'Actives' },
                                { id: 'inactive', label: 'Inactives / Suspendues' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        statusFilter === tab.id
                                            ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500 font-bold'
                                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nom de boutique, vendeur ou entreprise..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </form>
                    </div>
                </div>

                {/* Shops Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shops.data && shops.data.length > 0 ? (
                        shops.data.map((s) => (
                            <div key={s.id} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-yellow-400 transition-colors">
                                <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-900 font-bold text-sm flex items-center justify-center border border-yellow-200 shrink-0">
                                            {s.logo_path ? <img src={s.logo_path} alt={s.name} className="w-full h-full object-cover rounded-xl" /> : s.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-stone-900 text-sm">{s.name}</h3>
                                            <span className="text-[11px] text-stone-400 font-normal">vendeur: {s.seller?.user ? `${s.seller.user.first_name} ${s.seller.user.last_name}` : 'Propriétaire'}</span>
                                        </div>
                                    </div>

                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                                        s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {s.is_active ? 'Active' : 'Suspendue'}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-xs text-stone-600 font-normal">
                                    <p className="line-clamp-2">{s.description || 'Aucune description disponible.'}</p>
                                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                                        <span>{s.products_count || 0} produit(s)</span>
                                        <span>{s.email_contact || s.phone_contact || 'Contact non renseigné'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Link
                                        href={route('admin.shops.show', s.id)}
                                        className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 border border-yellow-500"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Fiche boutique</span>
                                    </Link>

                                    {s.is_active ? (
                                        <button
                                            onClick={() => handleSuspend(s.id, s.name)}
                                            disabled={processing}
                                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs rounded-xl transition-colors border border-rose-200"
                                        >
                                            Suspendre
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleActivate(s.id, s.name)}
                                            disabled={processing}
                                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                                        >
                                            Activer
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white border border-stone-200/80 rounded-2xl text-stone-400 text-xs">
                            Aucune boutique ne correspond aux critères.
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
