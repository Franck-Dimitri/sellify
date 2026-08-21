import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Star, 
    Award, 
    ShieldCheck, 
    User, 
    Store, 
    CheckCircle2, 
    Clock, 
    Sparkles, 
    AlertTriangle, 
    ChevronRight,
    TrendingUp,
    HeartHandshake,
    Package,
    Smile,
    Coins,
    ShieldAlert
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

export default function Reviews({ 
    driver = {}, 
    tier = {}, 
    securityStatus = {}, 
    ratings = {}, 
    reviewsList = [] 
}) {
    const [filterType, setFilterType] = useState('all');

    const filteredReviews = reviewsList.filter((r) => {
        if (filterType === 'all') return true;
        return r.type === filterType;
    });

    return (
        <DriverLayout title="Évaluations, Badges & Réputation">
            <Head title="Évaluations, Badges & Réputation - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span>Système d'échelons & Double évaluation</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Badges, Avis & Réputation Chauffeur
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Consultez vos notes clients et vendeurs, débloquez les échelons supérieurs et suivez vos pourboires.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border shadow-2xs ${tier.color || 'bg-yellow-100 text-yellow-950 border-yellow-300'}`}>
                            {tier.badge || 'Chauffeur Pro 🏆'}
                        </span>
                    </div>
                </div>

                {/* SECURITY STATUS ALERT (If warning or suspension) */}
                {securityStatus.status === 'warning' && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-center gap-3 text-xs text-amber-950 shadow-2xs animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <strong className="font-bold block text-sm">Avertissement Qualité Chauffeur</strong>
                            <p className="leading-snug">{securityStatus.warningMessage}</p>
                        </div>
                    </div>
                )}

                {securityStatus.status === 'suspended' && (
                    <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl flex items-center gap-3 text-xs text-rose-950 shadow-2xs">
                        <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
                        <div>
                            <strong className="font-bold block text-sm">Compte Chauffeur Suspendu</strong>
                            <p className="leading-snug">{securityStatus.warningMessage}</p>
                        </div>
                    </div>
                )}

                {/* TIER PROGRESSION & PRIVILEGES HERO CARD (2.3.9 SPEC) */}
                <div className="bg-white border-2 border-yellow-400/90 rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-sm shadow-2xs border border-yellow-500">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-yellow-700 font-bold uppercase">Échelon Actuel :</span>
                                <h3 className="font-bold text-base text-stone-900">{tier.badge}</h3>
                            </div>
                        </div>

                        {tier.next_tier && (
                            <div className="text-right text-xs">
                                <span className="text-stone-400 block font-normal">Prochain palier visé :</span>
                                <strong className="text-stone-900 font-bold">Chauffeur {tier.next_tier}</strong>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                        {/* Privileges unlocked */}
                        <div className="p-3.5 bg-yellow-50/70 border border-yellow-200 rounded-xl space-y-1">
                            <span className="text-yellow-800 font-bold block flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-yellow-600" /> Avantages & Privilèges Débloqués :
                            </span>
                            <p className="text-stone-700 leading-snug">{tier.privileges}</p>
                        </div>

                        {/* Progression bar to next tier */}
                        {tier.next_tier ? (
                            <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2 flex flex-col justify-center">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-bold text-stone-700">Progression vers le rang {tier.next_tier}</span>
                                    <strong className="text-yellow-700 font-bold">{tier.progress_percent}%</strong>
                                </div>
                                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                        style={{ width: `${tier.progress_percent}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-stone-500 block">
                                    Plus que <strong>{tier.deliveries_needed} livraisons</strong> et note minimale ≥ <strong>{tier.min_rating_needed}/5</strong> pour passer {tier.next_tier}.
                                </span>
                            </div>
                        ) : (
                            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2 text-purple-900">
                                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                                <div>
                                    <strong className="font-bold block">Échelon Maximal Atteint !</strong>
                                    <span className="text-[11px]">Vous bénéficiez du rang le plus prestigieux sur Sellify Express.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* DOUBLE RATING (CLIENT & VENDEUR) & CRITERIA GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Note Globale */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Note Globale Certifiée</span>
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                <Star className="w-4 h-4 fill-amber-400" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-amber-600">{ratings.global || 4.90}</p>
                            <span className="text-xs text-stone-400 font-bold">/ 5</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal">Basée sur {ratings.total_reviews || 180} avis</span>
                    </div>

                    {/* Note Clients (Acheteurs) */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Note des Acheteurs</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200">
                                <User className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-blue-600">{ratings.client || 4.92}</p>
                            <span className="text-xs text-stone-400 font-bold">/ 5</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal">Courtoisie & vérification OTP</span>
                    </div>

                    {/* Note Vendeurs (Boutiques) */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Note des Boutiques</span>
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-200">
                                <Store className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-emerald-600">{ratings.vendor || 4.88}</p>
                            <span className="text-xs text-stone-400 font-bold">/ 5</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal">Prise en charge & respect colis</span>
                    </div>

                    {/* Pourboires Reçus */}
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Pourboires Clients</span>
                            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-700 border border-yellow-200">
                                <Coins className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-stone-900">
                            {Number(ratings.tips_total || 17500).toLocaleString('fr-FR')} <span className="text-xs text-stone-500 font-normal">FCFA</span>
                        </p>
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Gratifications directes
                        </span>
                    </div>

                </div>

                {/* DETAILED CRITERIA BREAKDOWN BARS */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="border-b border-stone-100 pb-3">
                        <h3 className="font-bold text-sm text-stone-900">Indicateurs de Performance & Critères Qualité</h3>
                        <span className="text-[11px] text-stone-400">Évaluation détaillée par catégorie de prestation</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Ponctualité */}
                        <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-emerald-600" /> Ponctualité & Délais
                                </span>
                                <strong className="text-emerald-700 font-bold">{ratings.punctuality || 4.95} / 5</strong>
                            </div>
                            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99%' }} />
                            </div>
                            <span className="text-[10px] text-stone-500">99.4% des colis livrés dans le temps estimé OSRM</span>
                        </div>

                        {/* Amabilité */}
                        <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                                    <Smile className="w-4 h-4 text-yellow-600" /> Courtoisie & Amabilité
                                </span>
                                <strong className="text-yellow-800 font-bold">{ratings.courtesy || 4.90} / 5</strong>
                            </div>
                            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '98%' }} />
                            </div>
                            <span className="text-[10px] text-stone-500">Excellente attitude rapportée par les clients</span>
                        </div>

                        {/* Soin du colis */}
                        <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                                    <Package className="w-4 h-4 text-blue-600" /> Soin apporté au colis
                                </span>
                                <strong className="text-blue-700 font-bold">{ratings.package_care || 4.85} / 5</strong>
                            </div>
                            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '97%' }} />
                            </div>
                            <span className="text-[10px] text-stone-500">Aucun produit abîmé ou endommagé en transport</span>
                        </div>

                    </div>
                </div>

                {/* RECENT REVIEWS STREAM WITH FILTERS */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                        <div>
                            <h3 className="font-bold text-sm text-stone-900">Avis Vérifiés Récents</h3>
                            <span className="text-[11px] text-stone-400">Commentaires certifiés des acheteurs et commerçants</span>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold shrink-0">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    filterType === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Tous ({reviewsList.length})
                            </button>
                            <button
                                onClick={() => setFilterType('client')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    filterType === 'client' ? 'bg-blue-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Acheteurs
                            </button>
                            <button
                                onClick={() => setFilterType('vendor')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    filterType === 'vendor' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Boutiques
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((rev) => (
                                <div key={rev.id} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                                rev.type === 'vendor' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {rev.type === 'vendor' ? <Store className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                            </div>
                                            <div>
                                                <span className="font-bold text-stone-900 block">{rev.author}</span>
                                                <span className="text-[10px] text-stone-400">{rev.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {rev.tip_amount > 0 && (
                                                <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-950 font-bold text-[10px] rounded-full border border-yellow-300 flex items-center gap-1">
                                                    <Coins className="w-3 h-3 text-yellow-700" />
                                                    <span>+{Number(rev.tip_amount).toLocaleString('fr-FR')} F Pourboire</span>
                                                </span>
                                            )}
                                            <div className="flex items-center text-amber-500">
                                                {[...Array(rev.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-stone-700 italic leading-relaxed">"{rev.comment}"</p>

                                    {rev.criteria && rev.criteria.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {rev.criteria.map((c, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-white border border-stone-200 text-stone-600 rounded text-[10px] font-semibold">
                                                    ✓ {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-stone-400 text-xs">
                                Aucun avis trouvé pour ce filtre.
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </DriverLayout>
    );
}
