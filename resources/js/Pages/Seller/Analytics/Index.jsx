import React from 'react';
import { Head } from '@inertiajs/react';
import SellerCentralLayout from '../../../Layouts/SellerCentralLayout';
import { 
    Sparkles, 
    TrendingUp, 
    Award, 
    Boxes, 
    Lightbulb, 
    CheckCircle2, 
    ArrowUpRight,
    Search,
    BarChart2
} from 'lucide-react';

export default function AnalyticsIndex({ report }) {
    const summary = report?.summary || { total_analyzed: 0, top_performers: 0 };
    const marketTrends = report?.market_trends || [];
    const products = report?.products || [];

    return (
        <SellerCentralLayout title="Rapports IA & Qualité des Ventes">
            <Head title="Rapports IA & Analytics - Sellify" />

            <div className="w-full space-y-6 pb-16 text-stone-800">
                
                {/* Header Banner Shariow Style */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-medium text-xs uppercase tracking-wide">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>Moteur d'Intelligence Artificielle Vendeur</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            Rapports IA & Optimisation des Fiches Produits
                        </h1>
                        <p className="text-xs text-stone-600">
                            L'IA analyse vos fiches produits, détecte les opportunités de marché et vous conseille pour maximiser vos conversions.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
                            <span className="text-[10px] text-amber-800 block font-medium">Analyses Effectuées</span>
                            <span className="text-base font-semibold text-amber-950">{summary.total_analyzed} produit(s)</span>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                            <span className="text-[10px] text-emerald-800 block font-medium">Top Performers</span>
                            <span className="text-base font-semibold text-emerald-700">{summary.top_performers} produit(s)</span>
                        </div>
                    </div>
                </div>

                {/* Market Trends & Recommendations Card */}
                <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <h2 className="font-semibold text-stone-900 text-sm">Recommandations & Tendances de Marché Locales</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {marketTrends.map((trend, i) => (
                            <div key={i} className="flex items-start gap-2.5 bg-amber-50/50 border border-amber-200/60 p-3.5 rounded-xl text-xs text-stone-700 font-normal">
                                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span>{trend}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Quality Scores List */}
                <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-stone-900 text-sm">Score de Qualité des Fiches Produits (0 - 100)</h3>
                        </div>
                    </div>

                    <div className="divide-y divide-stone-100">
                        {products.length === 0 ? (
                            <div className="p-8 text-center text-stone-400 text-xs font-normal">
                                Aucune fiche produit analysée. Ajoutez des articles dans votre catalogue pour générer un rapport IA.
                            </div>
                        ) : (
                            products.map(item => {
                                let scoreColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
                                if (item.quality_score < 60) scoreColor = 'text-red-600 bg-red-50 border-red-200';
                                else if (item.quality_score < 80) scoreColor = 'text-amber-700 bg-amber-50 border-amber-200';

                                return (
                                    <div key={item.id} className="p-5 hover:bg-stone-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-stone-900 text-sm">{item.name}</h4>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-600">
                                                    {item.potential || 'Potentiel Fort'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-stone-500 font-normal">
                                                <span>Prix actuel : <strong className="font-medium text-stone-900">{Number(item.price).toLocaleString()} FCFA</strong></span>
                                                <span>•</span>
                                                <span>Prix suggéré IA : <strong className="font-medium text-amber-900">{Number(item.suggested_price || item.price).toLocaleString()} FCFA</strong></span>
                                            </div>

                                            {item.optimization_tips && item.optimization_tips.length > 0 && (
                                                <div className="pt-2 space-y-1">
                                                    <span className="text-[11px] font-medium text-stone-600">Conseils d'optimisation IA :</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.optimization_tips.map((tip, idx) => (
                                                            <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-normal">
                                                                • {tip}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="text-[10px] text-stone-400 block font-normal">Score Qualité</span>
                                                <span className={`inline-block px-3 py-1 rounded-xl text-sm font-semibold border ${scoreColor}`}>
                                                    {item.quality_score} / 100
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </SellerCentralLayout>
    );
}
