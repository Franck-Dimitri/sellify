import React from 'react';
import { Head } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { Bell, Truck, Wallet, CheckCircle2, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function Notifications() {
    const notificationsList = [
        {
            id: 1,
            title: "Nouvelle course à proximité !",
            description: "Colis #SLF-2026-X892 prêt au retrait chez Tech Shop (Bastos).",
            time: "Il y a 2 min",
            type: "course",
            unread: true
        },
        {
            id: 2,
            title: "Paiement de livraison crédité",
            description: "Frais de course + 2 500 FCFA ajoutés à votre portefeuille Sellify Express.",
            time: "Il y a 1 heure",
            type: "earnings",
            unread: false
        },
        {
            id: 3,
            title: "Validation par code OTP réussie",
            description: "La commande #SLF-2026-9021 a été clôturée avec succès.",
            time: "Hier, 16:45",
            type: "system",
            unread: false
        }
    ];

    return (
        <DriverLayout title="Notifications & alertes">
            <Head title="Notifications Livreur - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Bell className="w-4 h-4 text-yellow-600" />
                            <span>Journal des alertes de livraison</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Notifications & alertes livreur
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Recevez en direct toutes les assignations de courses, les crédits de solde et les alertes.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Notifications totales</span>
                        <p className="text-2xl font-bold text-stone-900">3</p>
                        <span className="text-[11px] text-stone-400 font-normal">Journal complet</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Alertes non lues</span>
                        <p className="text-2xl font-bold text-yellow-700">1</p>
                        <span className="text-[11px] text-stone-400 font-normal">Nouveau colis à proximité</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Alertes de courses</span>
                        <p className="text-2xl font-bold text-blue-600">2</p>
                        <span className="text-[11px] text-stone-400 font-normal">Prise en charge & OTP</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Crédits de solde</span>
                        <p className="text-2xl font-bold text-emerald-600">1</p>
                        <span className="text-[11px] text-stone-400 font-normal">Transfert d'honoraires</span>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
                    {notificationsList.map((n) => (
                        <div key={n.id} className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                            n.unread ? 'bg-yellow-50/80 border-yellow-300' : 'bg-stone-50 border-stone-200/80'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-xl shrink-0">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-xs text-stone-900">{n.title}</h4>
                                    <p className="text-xs text-stone-600 font-normal">{n.description}</p>
                                    <span className="text-[10px] text-stone-400 font-medium block pt-1">{n.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DriverLayout>
    );
}
