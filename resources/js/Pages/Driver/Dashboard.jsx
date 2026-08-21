import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Truck, 
    CheckCircle2, 
    Clock, 
    Wallet, 
    Star, 
    MapPin, 
    Phone, 
    Key, 
    ArrowRight, 
    ShieldCheck, 
    Navigation,
    ShoppingBag,
    TrendingUp,
    LocateFixed,
    Layers,
    UserCheck,
    Store,
    Calendar,
    RefreshCw
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute } from '@/Services/RoutingService';

export default function Dashboard({ 
    driver = {}, 
    availableDeliveries = [], 
    activeDeliveries = [], 
    completedDeliveries = [], 
    stats = {} 
}) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const { post, processing } = useForm();
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [routeInfo, setRouteInfo] = useState({ distance: '3.4 km', duration: '12 min' });

    // Active trip or fallback default trip
    const currentMission = activeDeliveries[0] || {
        order_number: 'SLF-2026-X892',
        shop: { name: 'Tech Shop (Bastos)', lat: 3.8780, lng: 11.5121 },
        shipping_address: 'Akwa, Immeuble Rose (Client: Marc Kamga)',
        shipping_fee: 2500,
        user: { first_name: 'Marc', last_name: 'Kamga', phone: '+237 690 00 00 00' },
        lat: 3.8650,
        lng: 11.5250,
    };

    // Initialize Map-First Canvas (Matching Screenshot 3)
    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        const map = L.map(mapRef.current, {
            center: [3.8650, 11.5150],
            zoom: 13,
            zoomControl: false,
        });

        // OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Driver Pulse Vehicle Marker
        const driverIcon = L.divIcon({
            className: 'custom-driver-vehicle',
            html: `<div style="background-color: #eab308; width: 40px; height: 40px; border-radius: 50%; border: 3px solid #1c1917; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0,0,0,0.4); font-size: 18px;">🚚</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const driverMarker = L.marker([3.8650, 11.5150], { icon: driverIcon }).addTo(map);
        driverMarker.bindPopup(`<b>${driver.user?.first_name || 'Pierre'} (Livreur Sellify)</b><br>Plaque: ${driver.vehicle_plate || 'LT-492-BX'}`).openPopup();

        // Shop Pickup Marker (Yellow Pin)
        const shopIcon = L.divIcon({
            className: 'custom-shop-pin',
            html: `<div style="background-color: #1c1917; color: #eab308; padding: 6px 10px; border-radius: 12px; border: 2px solid #eab308; font-weight: bold; font-size: 11px; font-family: sans-serif; shadow: 0 4px 10px rgba(0,0,0,0.3);">🏬 ${currentMission.shop?.name || 'Bastos Shop'}</div>`,
            iconSize: [140, 32],
            iconAnchor: [70, 16]
        });
        L.marker([3.8780, 11.5121], { icon: shopIcon }).addTo(map);

        // Customer Dropoff Marker (Green Pin)
        const customerIcon = L.divIcon({
            className: 'custom-customer-pin',
            html: `<div style="background-color: #10b981; color: #ffffff; padding: 6px 10px; border-radius: 12px; font-weight: bold; font-size: 11px; font-family: sans-serif; shadow: 0 4px 10px rgba(0,0,0,0.3);">📍 Dropoff: ${currentMission.user?.first_name || 'Client'}</div>`,
            iconSize: [140, 32],
            iconAnchor: [70, 16]
        });
        L.marker([3.8650, 11.5250], { icon: customerIcon }).addTo(map);

        // OSRM Real Road Polyline Route
        fetchOSRMRoute(3.8780, 11.5121, 3.8650, 11.5250).then((res) => {
            if (res.coordinates) {
                L.polyline(res.coordinates, {
                    color: '#eab308',
                    weight: 5,
                    opacity: 0.9,
                    dashArray: '10, 8'
                }).addTo(map);

                setRouteInfo({
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
    }, []);

    const handleAccept = (orderNumber) => {
        if (confirm(`Voulez-vous accepter la livraison de la commande #${orderNumber} ?`)) {
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

    return (
        <DriverLayout title="Dashboard Map-Centric">
            <Head title="Tableau de bord Livreur Map-First - Sellify Express" />

            {/* FULL MAP BACKGROUND WRAPPER (Matching Screenshot 3 Fleet Dashboard) */}
            <div className="relative w-full h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-900">
                
                {/* REAL LEAFLET MAP CANVAS */}
                <div ref={mapRef} className="absolute inset-0 z-0" />

                {/* OVERLAY TOP FLOATING ETA BADGE (Matching Screenshot 1 & 2) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200 px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 animate-ping" />
                    <span className="text-xs font-bold text-stone-900">
                        {routeInfo.distance} <span className="text-stone-400 font-normal">·</span> {routeInfo.duration} restante(s)
                    </span>
                    <span className="text-[10px] bg-yellow-100 text-yellow-950 px-2 py-0.5 rounded-full font-bold">
                        Course Active
                    </span>
                </div>

                {/* LEFT FLOATING CONTROL PANEL CARD (Matching Screenshot 3) */}
                <div className="absolute top-4 left-4 bottom-4 z-10 w-96 max-w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4">
                    
                    {/* Header Driver Status */}
                    <div className="space-y-3 border-b border-stone-100 pb-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-yellow-700 uppercase tracking-wider">Flotte Sellify.Express</span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">Dernière MAJ: 17:22</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-yellow-950 font-bold text-lg flex items-center justify-center border border-yellow-500 shadow-2xs shrink-0">
                                {driver.user?.first_name ? driver.user.first_name[0] : 'L'}
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-stone-900">{driver.user?.first_name} {driver.user?.last_name}</h2>
                                <p className="text-xs text-stone-500 font-mono">Plaque: {driver.vehicle_plate || 'LT-492-BX'} · <span className="text-amber-600 font-bold">{driver.rating || 4.98} ★</span></p>
                            </div>
                        </div>
                    </div>

                    {/* 4 Stat Mini Cards */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-0.5">
                            <span className="text-[10px] text-stone-400 block font-normal">Gains cumulés</span>
                            <strong className="text-stone-900 font-bold text-sm">{Number(stats.total_earned || 0).toLocaleString('fr-FR')} FCFA</strong>
                        </div>
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-0.5">
                            <span className="text-[10px] text-stone-400 block font-normal">Livraisons OTP</span>
                            <strong className="text-emerald-600 font-bold text-sm">{stats.delivered_count || 48} col.</strong>
                        </div>
                    </div>

                    {/* Delivery Mission Timeline (Matching Screenshot 3 Vehicle Timeline) */}
                    <div className="space-y-3 pt-2">
                        <h4 className="font-bold text-xs text-stone-900 flex items-center justify-between">
                            <span>Itinéraire de la mission actuelle</span>
                            <RefreshCw className="w-3.5 h-3.5 text-stone-400 cursor-pointer" />
                        </h4>

                        <div className="relative border-l-2 border-dashed border-yellow-400 pl-4 space-y-4 ml-2 text-xs font-normal">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-yellow-400 ring-4 ring-yellow-100" />
                                <span className="text-[10px] text-yellow-700 font-bold uppercase block">Point A · Retrait Boutique</span>
                                <strong className="text-stone-900 block">{currentMission.shop?.name || 'Tech Shop'}</strong>
                                <span className="text-[11px] text-stone-500">Bastos, Yaoundé</span>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Point B · Destination Client</span>
                                <strong className="text-stone-900 block">{currentMission.user?.first_name} {currentMission.user?.last_name}</strong>
                                <span className="text-[11px] text-stone-500">{currentMission.shipping_address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                        {activeDeliveries && activeDeliveries.length > 0 ? (
                            <button
                                onClick={() => setSelectedDeliveryForOtp(activeDeliveries[0])}
                                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                            >
                                <Key className="w-4 h-4" />
                                <span>Saisir le Code OTP de livraison</span>
                            </button>
                        ) : (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-[11px] text-yellow-950 font-medium text-center">
                                Prêt à recevoir de nouvelles courses à proximité.
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {/* OTP VERIFICATION MODAL */}
            {selectedDeliveryForOtp && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleVerifyOtp} className="bg-white border border-stone-200/90 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-base text-stone-900">Validation OTP #{selectedDeliveryForOtp.order_number}</h3>
                            </div>
                            <button type="button" onClick={() => setSelectedDeliveryForOtp(null)} className="p-1 text-stone-400">✕</button>
                        </div>

                        <div className="space-y-3 text-xs text-stone-600 font-normal">
                            <p>Saisissez le code secret à 6 chiffres transmis par le client.</p>
                            <input
                                type="text"
                                maxLength="6"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value)}
                                placeholder="Ex: 890124"
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500"
                            >
                                Valider et encaisser la livraison
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </DriverLayout>
    );
}
