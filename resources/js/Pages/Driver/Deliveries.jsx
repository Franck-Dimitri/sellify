import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Truck, 
    Search, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    Key, 
    ArrowRight,
    ShoppingBag,
    PackageCheck,
    TrendingUp,
    Store,
    XCircle,
    Navigation,
    UserCheck
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute } from '@/Services/RoutingService';

export default function Deliveries({ driver = {}, deliveries = { data: [] }, filters = {} }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [tab, setTab] = useState(filters.tab || 'all');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [previewDelivery, setPreviewDelivery] = useState(deliveries.data?.[0] || null);
    const [otpInput, setOtpInput] = useState('');
    const [routeStats, setRouteStats] = useState({ distance: '3.4 km', duration: '12 min' });
    const { post, processing } = useForm();

    const handleTabChange = (t) => {
        setTab(t);
        router.get(route('driver.deliveries'), { tab: t, search }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('driver.deliveries'), { tab, search }, { preserveState: true });
    };

    const handleAccept = (orderNumber) => {
        if (confirm(`Voulez-vous prendre en charge la livraison de la commande #${orderNumber} ?`)) {
            post(route('driver.delivery.accept', orderNumber));
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        post(route('driver.delivery.verify_otp', selectedDeliveryForOtp.order_number), {
            data: { otp: otpInput },
            onSuccess: () => {
                setSelectedDeliveryForOtp(null);
                setOtpInput('');
            }
        });
    };

    // Initialize Map Dispatch Preview (Matching Screenshot 1 & 2)
    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        const map = L.map(mapRef.current, {
            center: [3.8650, 11.5150],
            zoom: 13,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const pShop = [3.8780, 11.5121];
        const pCustomer = [3.8650, 11.5250];

        // Shop Marker
        const shopIcon = L.divIcon({
            className: 'custom-shop-pin',
            html: `<div style="background-color: #eab308; color: #1c1917; padding: 6px 10px; border-radius: 12px; border: 2px solid #1c1917; font-weight: bold; font-size: 11px; font-family: sans-serif;">🏬 Retrait: ${previewDelivery?.shop?.name || 'Bastos Shop'}</div>`,
            iconSize: [140, 32],
            iconAnchor: [70, 16]
        });
        L.marker(pShop, { icon: shopIcon }).addTo(map);

        // Customer Marker
        const customerIcon = L.divIcon({
            className: 'custom-customer-pin',
            html: `<div style="background-color: #10b981; color: #ffffff; padding: 6px 10px; border-radius: 12px; font-weight: bold; font-size: 11px; font-family: sans-serif;">📍 Destination: ${previewDelivery?.user?.first_name || 'Client'}</div>`,
            iconSize: [140, 32],
            iconAnchor: [70, 16]
        });
        L.marker(pCustomer, { icon: customerIcon }).addTo(map);

        // Fetch OSRM Route
        fetchOSRMRoute(pShop[0], pShop[1], pCustomer[0], pCustomer[1]).then((res) => {
            if (res.coordinates) {
                L.polyline(res.coordinates, {
                    color: '#eab308',
                    weight: 5,
                    dashArray: '10, 8'
                }).addTo(map);

                setRouteStats({
                    distance: `${res.distanceKm} km`,
                    duration: `${res.durationMin} min`
                });
            }
        });

        mapInstance.current = map;

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [previewDelivery]);

    return (
        <DriverLayout title="Gestion des courses & livraisons">
            <Head title="Livraisons & Courses - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Truck className="w-4 h-4 text-yellow-600" />
                            <span>Dispatching de course & itinéraire de livraison</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Inspection des courses & validation
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Visualisez l'itinéraire complet sur carte avant d'accepter ou décliner la prise en charge d'un colis.
                        </p>
                    </div>
                </div>

                {/* TRIP PREVIEW MAP & DISPATCH SHEET ROW (Matching Screenshots 1 & 2) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Interactive Leaflet Map Preview (2 cols) */}
                    <div className="lg:col-span-2 bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs relative min-h-[380px] flex flex-col justify-between">
                        <div ref={mapRef} className="absolute inset-0 z-0" />

                        {/* Top Distance / ETA Floating Badge (Matching Screenshot 1) */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200 px-5 py-2 rounded-full shadow-md flex items-center gap-3 text-xs font-bold text-stone-900">
                            <span className="text-yellow-600 font-extrabold">{routeStats.distance}</span>
                            <span className="text-stone-400">·</span>
                            <span>{routeStats.duration} de trajet estimé</span>
                        </div>
                    </div>

                    {/* DISPATCH SHEET CARD (Matching Screenshot 2 Trip Card) */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                <h3 className="font-bold text-sm text-stone-900">Détails de la course sélectionnée</h3>
                                <span className="text-xs bg-yellow-100 text-yellow-950 px-2.5 py-0.5 rounded-full font-bold">
                                    +{Number(previewDelivery?.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                                </span>
                            </div>

                            {previewDelivery ? (
                                <div className="space-y-3 text-xs text-stone-700 font-normal">
                                    <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                                        <span className="text-stone-400 block font-normal">Numéro de commande :</span>
                                        <strong className="text-stone-900 font-mono text-sm">#{previewDelivery.order_number}</strong>
                                    </div>

                                    {/* Timeline Address (Matching Screenshot 2) */}
                                    <div className="relative border-l-2 border-dashed border-yellow-400 pl-4 space-y-3 ml-2 text-xs">
                                        <div>
                                            <span className="text-[10px] text-yellow-700 font-bold uppercase block">Retrait Boutique</span>
                                            <strong className="text-stone-900 block">{previewDelivery.shop?.name || 'Tech Shop'}</strong>
                                        </div>

                                        <div>
                                            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Livraison Client</span>
                                            <strong className="text-stone-900 block">{previewDelivery.user ? `${previewDelivery.user.first_name} ${previewDelivery.user.last_name}` : 'Marc Kamga'}</strong>
                                            <span className="text-[11px] text-stone-400 block">{previewDelivery.shipping_address || 'Douala / Yaoundé'}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400 py-6 text-center">Sélectionnez une commande dans la liste ci-dessous.</p>
                            )}
                        </div>

                        {/* Action Buttons (Matching Screenshot 2 Request Car / Accept) */}
                        <div className="pt-3 border-t border-stone-100 space-y-2">
                            {previewDelivery && previewDelivery.delivery_status === 'ready_for_pickup' && !previewDelivery.driver_id && (
                                <button
                                    onClick={() => handleAccept(previewDelivery.order_number)}
                                    disabled={processing}
                                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                                >
                                    <span>Accepter la course</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

                            {previewDelivery && previewDelivery.delivery_status === 'in_transit' && (
                                <button
                                    onClick={() => setSelectedDeliveryForOtp(previewDelivery)}
                                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                                >
                                    <Key className="w-4 h-4" />
                                    <span>Saisir l'OTP de livraison</span>
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {/* Filter Tabs & Search */}
                <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                            {[
                                { id: 'all', label: 'Toutes les courses' },
                                { id: 'available', label: 'Disponibles au retrait' },
                                { id: 'active', label: 'En cours' },
                                { id: 'completed', label: 'Terminées' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleTabChange(t.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        tab === t.id
                                            ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs border border-yellow-500'
                                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par N° commande, client..."
                                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-800"
                            />
                        </form>
                    </div>
                </div>

                {/* Deliveries Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-400 uppercase">
                                    <th className="py-3 px-4">Commande</th>
                                    <th className="py-3 px-4">Boutique (Retrait)</th>
                                    <th className="py-3 px-4">Client (Livraison)</th>
                                    <th className="py-3 px-4">Frais livreur</th>
                                    <th className="py-3 px-4">Statut</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {deliveries.data && deliveries.data.length > 0 ? (
                                    deliveries.data.map((d) => (
                                        <tr 
                                            key={d.id} 
                                            onClick={() => setPreviewDelivery(d)}
                                            className={`hover:bg-stone-50/60 transition-colors cursor-pointer ${
                                                previewDelivery?.id === d.id ? 'bg-yellow-50/50 font-semibold' : ''
                                            }`}
                                        >
                                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                                                #{d.order_number}
                                                <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                                    {new Date(d.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-800 font-medium">
                                                {d.shop?.name || 'Boutique'}
                                            </td>
                                            <td className="py-3.5 px-4 text-stone-700">
                                                <span className="block font-semibold">{d.user ? `${d.user.first_name} ${d.user.last_name}` : 'Client'}</span>
                                                <span className="text-[11px] text-stone-400">{d.shipping_address || 'Douala'}</span>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-600">
                                                +{Number(d.shipping_fee || 1500).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    d.delivery_status === 'delivered' 
                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                        : d.delivery_status === 'in_transit'
                                                        ? 'bg-yellow-100 text-yellow-900'
                                                        : 'bg-amber-100 text-amber-900'
                                                }`}>
                                                    {d.delivery_status === 'delivered' ? 'Livré' : d.delivery_status === 'in_transit' ? 'En cours' : 'Dispo'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {d.delivery_status === 'ready_for_pickup' && !d.driver_id && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAccept(d.order_number); }}
                                                        disabled={processing}
                                                        className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-[11px] rounded-xl shadow-2xs transition-colors border border-yellow-500"
                                                    >
                                                        Accepter la course
                                                    </button>
                                                )}
                                                {d.delivery_status === 'in_transit' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedDeliveryForOtp(d); }}
                                                        className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-[11px] rounded-xl shadow-2xs transition-colors border border-yellow-500 inline-flex items-center gap-1"
                                                    >
                                                        <Key className="w-3.5 h-3.5" />
                                                        <span>Valider OTP</span>
                                                    </button>
                                                )}
                                                {d.delivery_status === 'delivered' && (
                                                    <span className="text-[11px] text-stone-400 font-normal">Terminée</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-stone-400">
                                            Aucune course ne correspond aux critères.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* OTP Modal */}
            {selectedDeliveryForOtp && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleVerifyOtp} className="bg-white border border-stone-200/90 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-base text-stone-900">Code OTP #{selectedDeliveryForOtp.order_number}</h3>
                            <button type="button" onClick={() => setSelectedDeliveryForOtp(null)} className="p-1 text-stone-400">✕</button>
                        </div>

                        <div className="space-y-3 text-xs text-stone-600 font-normal">
                            <p>Saisissez le code secret à 6 chiffres affiché sur le reçu du client.</p>
                            <input
                                type="text"
                                maxLength="6"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value)}
                                placeholder="Code à 6 chiffres"
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl border border-yellow-500"
                            >
                                Valider la livraison
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </DriverLayout>
    );
}
