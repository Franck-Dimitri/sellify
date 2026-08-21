import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Settings, 
    Truck, 
    User, 
    ShieldCheck, 
    Save, 
    Phone, 
    MapPin, 
    FileText,
    Sliders,
    Flame,
    Navigation,
    Volume2,
    Hand,
    Sparkles,
    CheckCircle2,
    Clock,
    Zap,
    Scale,
    Box,
    Layers
} from 'lucide-react';

export default function SettingsView({ driver = {}, settingsData = {}, demandForecast = {} }) {
    const [activeTab, setActiveTab] = useState('vehicle');

    const { data, setData, post, processing, errors } = useForm({
        vehicle_type: settingsData.vehicle_type || driver.vehicle_type || 'moto',
        vehicle_plate: settingsData.vehicle_plate || driver.vehicle_plate || 'LT-492-BX',
        max_payload_kg: settingsData.max_payload_kg || 25,
        max_volume_liters: settingsData.max_volume_liters || 60,
        coverage_city: settingsData.coverage_city || 'Yaoundé / Douala',
        coverage_radius_km: settingsData.coverage_radius_km || 15,
        tactile_mode_active: settingsData.tactile_mode_active || false,
        sound_alerts_enabled: settingsData.sound_alerts_enabled !== false,
        accept_fragile_items: settingsData.accept_fragile_items !== false,
        accept_b2b_orders: settingsData.accept_b2b_orders !== false,
    });

    const handleSave = (e) => {
        e.preventDefault();
        post(route('driver.settings.update'));
    };

    return (
        <DriverLayout title="Paramètres & Véhicule">
            <Head title="Paramètres & Véhicule - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Settings className="w-4 h-4 text-yellow-600" />
                            <span>Configuration du compte & Préférences terrain</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Paramètres du Chauffeur & du Véhicule
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez votre moyen de transport, votre rayon d'action IA, l'ergonomie tactile et consultez les prédictions de demande.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('driver.map')}
                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5 border border-yellow-500"
                        >
                            <Flame className="w-4 h-4 text-yellow-950" />
                            <span>Ouvrir Heatmap sur la carte</span>
                        </Link>
                    </div>
                </div>

                {/* 4 STAT KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Véhicule homologué</span>
                        <p className="text-2xl font-bold text-stone-900 capitalize">{data.vehicle_type}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Plaque : <strong className="font-mono text-stone-700">{data.vehicle_plate}</strong></span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Rayon d'action IA</span>
                        <p className="text-2xl font-bold text-yellow-700">{data.coverage_radius_km} km</p>
                        <span className="text-[11px] text-stone-400 font-normal">Attribution automatique</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Capacité de charge</span>
                        <p className="text-2xl font-bold text-emerald-600">{data.max_payload_kg} kg</p>
                        <span className="text-[11px] text-stone-400 font-normal">Volume max : {data.max_volume_liters} Litres</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Conformité Documents</span>
                        <p className="text-2xl font-bold text-blue-600">100%</p>
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Dossier KYC Validé
                        </span>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('vehicle')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                            activeTab === 'vehicle' ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                    >
                        <Truck className="w-4 h-4" />
                        <span>Véhicule & Capacité</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('coverage')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                            activeTab === 'coverage' ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                    >
                        <MapPin className="w-4 h-4" />
                        <span>Zone & Rayon IA</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('ergonomics')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                            activeTab === 'ergonomics' ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                    >
                        <Hand className="w-4 h-4" />
                        <span>Ergonomie & Mode Guidon</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('forecast')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                            activeTab === 'forecast' ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                    >
                        <Flame className="w-4 h-4" />
                        <span>Prédiction de la Demande (IA)</span>
                    </button>
                </div>

                {/* TAB 1 : VÉHICULE & SPÉCIFICATIONS */}
                {activeTab === 'vehicle' && (
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-6 max-w-3xl animate-in fade-in-50 duration-150">
                        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Spécifications du véhicule</h3>
                            </div>
                            <span className="text-[11px] text-stone-400 font-mono">ID: {driver.vehicle_plate || 'LT-492-BX'}</span>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 text-xs font-normal">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block font-bold text-stone-700">Type de véhicule :</label>
                                    <select
                                        value={data.vehicle_type}
                                        onChange={(e) => setData('vehicle_type', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-medium"
                                    >
                                        <option value="moto">Moto de livraison (Standard)</option>
                                        <option value="scooter">Scooter urbain</option>
                                        <option value="voiture">Voiture commerciale / Berline</option>
                                        <option value="camionnette">Camionnette / Pick-up</option>
                                        <option value="tricycle">Tricycle utilitaire</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block font-bold text-stone-700">Plaque d'immatriculation :</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_plate}
                                        onChange={(e) => setData('vehicle_plate', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-mono font-bold uppercase"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block font-bold text-stone-700">Capacité de charge max (kg) :</label>
                                    <div className="relative">
                                        <Scale className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                        <input
                                            type="number"
                                            value={data.max_payload_kg}
                                            onChange={(e) => setData('max_payload_kg', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block font-bold text-stone-700">Volume disponible (Litres) :</label>
                                    <div className="relative">
                                        <Box className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                        <input
                                            type="number"
                                            value={data.max_volume_liters}
                                            onChange={(e) => setData('max_volume_liters', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KYC Documents Confirmation Badges */}
                            <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">
                                <span className="text-stone-700 font-bold block text-xs">Documents légaux & KYC homologués :</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                    <div className="p-2 bg-white rounded-lg border border-stone-200 flex items-center gap-1.5 text-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Permis valide</span>
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-stone-200 flex items-center gap-1.5 text-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Carte Grise vérifiée</span>
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-stone-200 flex items-center gap-1.5 text-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Assurance active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 border border-yellow-500"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{processing ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2 : ZONE & RAYON IA */}
                {activeTab === 'coverage' && (
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-6 max-w-3xl animate-in fade-in-50 duration-150">
                        <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-yellow-600" />
                            <h3 className="font-bold text-sm text-stone-900">Secteur d'activité & Rayon d'action IA</h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5 text-xs">
                            <div className="space-y-1">
                                <label className="font-bold text-stone-700 block">Ville principale d'opération :</label>
                                <input
                                    type="text"
                                    value={data.coverage_city}
                                    onChange={(e) => setData('coverage_city', e.target.value)}
                                    placeholder="Ex: Yaoundé (Bastos, Centre, Biyem-Assi)"
                                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Interactive Radius Slider */}
                            <div className="p-4 bg-yellow-50/60 border border-yellow-200 rounded-xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="font-bold text-yellow-950 flex items-center gap-1.5">
                                        <Navigation className="w-4 h-4 text-yellow-700" />
                                        <span>Rayon maximal d'attribution des courses :</span>
                                    </label>
                                    <span className="px-3 py-1 bg-yellow-400 text-yellow-950 font-bold text-xs rounded-full border border-yellow-500 shadow-2xs">
                                        {data.coverage_radius_km} km
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min="3"
                                    max="40"
                                    step="1"
                                    value={data.coverage_radius_km}
                                    onChange={(e) => setData('coverage_radius_km', e.target.value)}
                                    className="w-full accent-yellow-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-stone-500">
                                    <span>3 km (Ultra local / Centre-ville)</span>
                                    <span>20 km (Zone métropolitaine)</span>
                                    <span>40 km (Périphérie élargie)</span>
                                </div>
                            </div>

                            {/* Accepted types of delivery */}
                            <div className="space-y-2">
                                <label className="font-bold text-stone-700 block">Types de courses autorisées :</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.accept_fragile_items}
                                            onChange={(e) => setData('accept_fragile_items', e.target.checked)}
                                            className="text-yellow-500 rounded focus:ring-yellow-400"
                                        />
                                        <span className="font-bold text-stone-900">Articles électroniques & Objets fragiles sous Escrow</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.accept_b2b_orders}
                                            onChange={(e) => setData('accept_b2b_orders', e.target.checked)}
                                            className="text-yellow-500 rounded focus:ring-yellow-400"
                                        />
                                        <span className="font-bold text-stone-900">Courses groupées B2B haute priorité (Tournées TSP)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 border border-yellow-500"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Enregistrer le rayon</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 3 : ERGONOMIE TACTILE & MODE GUIDON */}
                {activeTab === 'ergonomics' && (
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-6 max-w-3xl animate-in fade-in-50 duration-150">
                        <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
                            <Hand className="w-5 h-5 text-yellow-600" />
                            <h3 className="font-bold text-sm text-stone-900">Ergonomie tactile & Mode Guidon moto</h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 text-xs">
                            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <strong className="font-bold text-stone-900 block flex items-center gap-1.5">
                                            <Hand className="w-4 h-4 text-yellow-600" /> Mode Guidon & Manipulation avec gants (+30% taille)
                                        </strong>
                                        <p className="text-[11px] text-stone-500">
                                            Agrandit tous les boutons d'action de l'application pour une utilisation sans effort sur support smartphone moto.
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.tactile_mode_active}
                                        onChange={(e) => setData('tactile_mode_active', e.target.checked)}
                                        className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <strong className="font-bold text-stone-900 block flex items-center gap-1.5">
                                            <Volume2 className="w-4 h-4 text-yellow-600" /> Bip sonore & Guidage d'alerte nouvelle course
                                        </strong>
                                        <p className="text-[11px] text-stone-500">
                                            Émet un signal sonore puissant et distinct lors de l'arrivée d'une proposition de mission.
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.sound_alerts_enabled}
                                        onChange={(e) => setData('sound_alerts_enabled', e.target.checked)}
                                        className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 border border-yellow-500"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Enregistrer les préférences</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 4 : PRÉDICTION DE LA DEMANDE & HEURES DE POINTE IA */}
                {activeTab === 'forecast' && (
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-6 max-w-4xl animate-in fade-in-50 duration-150">
                        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-rose-600" />
                                <h3 className="font-bold text-sm text-stone-900">Prédiction de la Demande & Créneaux Heures de Pointe (IA)</h3>
                            </div>
                            <span className="px-3 py-1 bg-rose-100 text-rose-900 font-bold text-xs rounded-full">
                                Surge Pricing Actif
                            </span>
                        </div>

                        {/* Top Hotspots Surge Pricing */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider">Zones à forte demande en temps réel :</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(demandForecast.hotspots || []).map((hot, idx) => (
                                    <div key={idx} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-stone-900">{hot.name}</span>
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-950 font-bold text-[10px] rounded">
                                                {hot.surge}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-stone-500 block">{hot.orders_pending} commandes en attente</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hourly Demand Table */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider">Prévisions horaires d'affluence :</h4>
                            <div className="overflow-x-auto rounded-xl border border-stone-200">
                                <table className="w-full text-left text-xs text-stone-600">
                                    <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                                        <tr>
                                            <th className="py-2.5 px-4">Créneau Horaire</th>
                                            <th className="py-2.5 px-4">Niveau de Demande</th>
                                            <th className="py-2.5 px-4">Multiplicateur Bonus</th>
                                            <th className="py-2.5 px-4 text-right">Recommandation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {(demandForecast.hourly || []).map((h, idx) => (
                                            <tr key={idx} className="hover:bg-stone-50">
                                                <td className="py-2.5 px-4 font-mono font-bold text-stone-900">{h.hour}</td>
                                                <td className="py-2.5 px-4">
                                                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${h.color}`}>
                                                        {h.demand}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-4 font-bold text-emerald-600">{h.multiplier}</td>
                                                <td className="py-2.5 px-4 text-right text-[11px] text-stone-500">
                                                    {h.demand.includes('Forte') ? 'Positionnez-vous en centre-ville' : 'Activité normale'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex justify-end">
                            <Link
                                href={route('driver.map')}
                                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 border border-yellow-500"
                            >
                                <Flame className="w-4 h-4" />
                                <span>Voir les cercles Heatmap sur la carte</span>
                            </Link>
                        </div>
                    </div>
                )}

            </div>

        </DriverLayout>
    );
}
