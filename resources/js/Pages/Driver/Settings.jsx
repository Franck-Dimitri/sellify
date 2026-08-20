import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { Settings, Truck, User, ShieldCheck, Save, Phone, MapPin, FileText } from 'lucide-react';

export default function SettingsView({ driver = {} }) {
    const user = driver.user || {};

    const { data, setData, post, processing } = useForm({
        vehicle_type: driver.vehicle_type || 'moto',
        vehicle_plate: driver.vehicle_plate || 'LT-492-BX',
        license_number: driver.license_number || 'PERM-2026-8910',
        coverage_zone: driver.coverage_zone || 'Douala (Bastos / Akwa)',
    });

    const handleSave = (e) => {
        e.preventDefault();
        alert("Informations de votre véhicule et zone de livraison mises à jour !");
    };

    return (
        <DriverLayout title="Paramètres & véhicule">
            <Head title="Paramètres & Véhicule - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Settings className="w-4 h-4 text-yellow-600" />
                            <span>Configuration du compte livreur & du véhicule</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Paramètres du véhicule & zone de couverture
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez les spécifications de votre moyen de transport, votre permis de conduire et votre secteur d'activité.
                        </p>
                    </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Moyen de transport</span>
                        <p className="text-2xl font-bold text-stone-900 capitalize">{data.vehicle_type}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Véhicule principal</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Immatriculation</span>
                        <p className="text-2xl font-bold text-yellow-700 font-mono">{data.vehicle_plate}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Plaque d'immatriculation</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">N° Permis de conduire</span>
                        <p className="text-2xl font-bold text-blue-600 font-mono">{data.license_number}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Pièce d'homologation</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Secteur couvert</span>
                        <p className="text-2xl font-bold text-emerald-600 truncate">Douala / Ydé</p>
                        <span className="text-[11px] text-stone-400 font-normal">Zone de livraison</span>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-6 max-w-3xl">
                    <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-bold text-sm text-stone-900">Spécifications du véhicule de livraison</h3>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4 text-xs font-normal">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Type de véhicule :</label>
                                <select
                                    value={data.vehicle_type}
                                    onChange={(e) => setData('vehicle_type', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-normal"
                                >
                                    <option value="moto">Moto de livraison</option>
                                    <option value="voiture">Voiture commerciale</option>
                                    <option value="camionnette">Camionnette / Van</option>
                                    <option value="tricycle">Tricycle</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Immatriculation / Plaque :</label>
                                <input
                                    type="text"
                                    value={data.vehicle_plate}
                                    onChange={(e) => setData('vehicle_plate', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">N° Permis de conduire :</label>
                                <input
                                    type="text"
                                    value={data.license_number}
                                    onChange={(e) => setData('license_number', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Zone principale de livraison :</label>
                                <input
                                    type="text"
                                    value={data.coverage_zone}
                                    onChange={(e) => setData('coverage_zone', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 border border-yellow-500"
                            >
                                <Save className="w-4 h-4" />
                                <span>Enregistrer les modifications</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </DriverLayout>
    );
}
