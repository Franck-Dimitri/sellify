import React from 'react';
import { Head } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';

export default function AnalyticsIndex({ report }) {
    return (
        <SellerCentralLayout header="Rapport IA Vendeur & Produits Gagnants">
            <Head title="Analytics IA - Seller Central" />

            <div className="space-y-8">
                {/* Intro AI Banner */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                            Moteur IA Central
                        </span>
                        <h2 className="text-2xl font-black mt-2">Analyse Intelligente des Ventes & Tendances</h2>
                        <p className="text-sm text-purple-200 mt-1">
                            L'IA analyse le comportement des consommateurs et vous conseille pour maximiser vos revenus.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
                            <span className="text-xs text-purple-200 block">Produits Analysés</span>
                            <span className="text-xl font-bold">{report.summary.total_analyzed}</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
                            <span className="text-xs text-purple-200 block">Top Performers</span>
                            <span className="text-xl font-bold text-green-400">{report.summary.top_performers}</span>
                        </div>
                    </div>
                </div>

                {/* Market Trends Tips */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <span>💡</span> Tendances de Marché Locales (IA)
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {report.market_trends.map((trend, i) => (
                            <li key={i} className="flex items-start gap-2 bg-purple-50 p-3 rounded-xl text-purple-900 text-xs sm:text-sm">
                                <span>✦</span>
                                <span>{trend}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Product Scores List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Score de Qualité des Fiches Produits (0 - 100)</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {report.products.map(item => (
                            <div key={item.id} className="p-6 hover:bg-gray-50/50 transition flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                            {item.potential}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Prix actuel : <span className="font-semibold text-gray-800">{item.price} FCFA</span> • Prix suggéré IA : <span className="font-semibold text-indigo-600">{item.suggested_price} FCFA</span>
                                    </p>

                                    {item.optimization_tips.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                            <p className="text-xs font-bold text-gray-600">Recommandations d'optimisation :</p>
                                            <ul className="space-y-1">
                                                {item.optimization_tips.map((tip, idx) => (
                                                    <li key={idx} className="text-xs text-amber-700 flex items-center gap-1">
                                                        <span>•</span> {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Score Qualité</span>
                                        <span className={`text-2xl font-black ${
                                            item.quality_score >= 80 ? 'text-green-600' : item.quality_score >= 60 ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                            {item.quality_score} <span className="text-xs font-normal text-gray-400">/ 100</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SellerCentralLayout>
    );
}
