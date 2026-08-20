import React from 'react';
import { Head } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { Star, ThumbsUp, ShieldCheck, User, Award, CheckCircle2, Clock } from 'lucide-react';
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

export default function Reviews({ driver = {} }) {
    const reviewsList = [
        {
            id: 1,
            author: "Marc K.",
            rating: 5,
            comment: "Livreur très courtois et ultra rapide ! Colis arrivé sans aucun choc.",
            date: "Il y a 2 jours"
        },
        {
            id: 2,
            author: "Sandrine T.",
            rating: 5,
            comment: "Parfait respect des horaires et vérification OTP très professionnelle.",
            date: "Il y a 5 jours"
        }
    ];

    // Chart.js Data
    const ratingDistributionData = {
        labels: ['5 Étoiles', '4 Étoiles', '3 Étoiles', '2 Étoiles', '1 Étoile'],
        datasets: [
            {
                label: 'Nombre d\'avis',
                data: [42, 5, 1, 0, 0],
                backgroundColor: '#eab308',
                borderRadius: 6,
            }
        ]
    };

    const ratingDistributionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(231, 229, 228, 0.6)' } }
        }
    };

    const qualityDoughnutData = {
        labels: ['Ponctualité (98%)', 'Courtoisie (100%)', 'Conformité OTP (100%)'],
        datasets: [
            {
                data: [98, 100, 100],
                backgroundColor: ['#10b981', '#eab308', '#3b82f6'],
                borderWidth: 0,
            }
        ]
    };

    const qualityDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        cutout: '70%'
    };

    return (
        <DriverLayout title="Avis & évaluations livreur">
            <Head title="Avis & Évaluations - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                            <span>Qualité de service & réputation</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Avis & évaluations des acheteurs
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Consultez les notes attribuées par les clients après la livraison de leurs commandes.
                        </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-xl text-stone-900 text-center shrink-0">
                        <span className="text-2xl font-bold text-amber-600 block">{driver.rating || 4.90} / 5</span>
                        <span className="text-[10px] text-stone-500 font-semibold uppercase">Note globale</span>
                    </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Note moyenne</span>
                        <p className="text-2xl font-bold text-amber-600">{driver.rating || 4.90} / 5</p>
                        <span className="text-[11px] text-stone-400 font-normal">Basé sur 48 évaluations</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Taux de ponctualité</span>
                        <p className="text-2xl font-bold text-emerald-600">98.5%</p>
                        <span className="text-[11px] text-stone-400 font-normal">Livraisons à l'heure</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Avis 5 étoiles</span>
                        <p className="text-2xl font-bold text-yellow-700">42</p>
                        <span className="text-[11px] text-stone-400 font-normal">Excellence confirmée</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Validation OTP réussie</span>
                        <p className="text-2xl font-bold text-blue-600">100%</p>
                        <span className="text-[11px] text-stone-400 font-normal">Aucun litige signalé</span>
                    </div>
                </div>

                {/* CHART.JS CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Distribution des notes (1 à 5 Étoiles)</h3>
                            <span className="text-xs text-stone-400">Chart.js Graphique</span>
                        </div>
                        <div className="h-52">
                            <Bar data={ratingDistributionData} options={ratingDistributionOptions} />
                        </div>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Indice de ponctualité & qualité</h3>
                        </div>
                        <div className="h-52 relative flex items-center justify-center">
                            <Doughnut data={qualityDoughnutData} options={qualityDoughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                    <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3">Commentaires récents des acheteurs</h3>

                    <div className="space-y-3">
                        {reviewsList.map((r) => (
                            <div key={r.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 font-bold text-xs flex items-center justify-center border border-yellow-500">
                                            {r.author[0]}
                                        </div>
                                        <span className="font-bold text-xs text-stone-900">{r.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        {[...Array(r.rating)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-stone-600 font-normal italic">"{r.comment}"</p>
                                <span className="text-[10px] text-stone-400 font-normal block">{r.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DriverLayout>
    );
}
