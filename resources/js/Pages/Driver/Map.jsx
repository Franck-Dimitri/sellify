import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    MapPin, 
    Navigation, 
    Truck, 
    Store, 
    User, 
    Phone, 
    ShieldCheck, 
    Compass, 
    CheckCircle2,
    Layers,
    LocateFixed,
    Search,
    ListFilter,
    PhoneCall,
    MessageSquare,
    Key,
    Shield
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute } from '@/Services/RoutingService';

export default function Map({ driver = {}, activeDelivery }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [etaInfo, setEtaInfo] = useState({ distance: '0.8 km', duration: '2 min' });
    const { post, processing } = useForm();

    const currentOrder = activeDelivery || {
        order_number: 'SLF-2026-X892',
        vehicle_plate: driver.vehicle_plate || 'HIX625',
        vehicle_model: 'Moto Suzuki · Noir Brillant',
        driver_name: driver.user ? `${driver.user.first_name} ${driver.user.last_name}` : 'Pierre Livreur',
        rating: driver.rating || 4.98,
        shipping_fee: 2500,
        delivery_otp: '890124',
        user: { first_name: 'Marc', last_name: 'Kamga', phone: '+237 690 00 00 00' },
        shop: { name: 'Tech Shop (Bastos)' },
        shipping_address: 'Calle 76 #26-27, Akwa, Douala / Yaoundé'
    };

    // Initialize Full-bleed DiDi/Uber Style Map (Matching Screenshot 1)
    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        const map = L.map(mapRef.current, {
            center: [3.8680, 11.5180],
            zoom: 14,
            zoomControl: false,
        });

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Driver Pulse Vehicle Marker (Car / Moto icon matching Screenshot 1)
        const vehicleIcon = L.divIcon({
            className: 'custom-didi-vehicle-pin',
            html: `<div style="background-color: #1c1917; color: #eab308; width: 44px; height: 44px; border-radius: 50%; border: 3px solid #eab308; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.5); font-size: 20px;">🚗</div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22]
        });

        const driverMarker = L.marker([3.8680, 11.5180], { icon: vehicleIcon }).addTo(map);
        driverMarker.bindPopup(`<b>${currentOrder.driver_name}</b><br>Plaque: ${currentOrder.vehicle_plate}`).openPopup();

        // Customer Destination Marker
        const dropoffIcon = L.divIcon({
            className: 'custom-dropoff-pin',
            html: `<div style="background-color: #10b981; color: #ffffff; padding: 6px 12px; border-radius: 20px; font-weight: font-bold; font-size: 11px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid #ffffff;">📍 Destination Client</div>`,
            iconSize: [140, 32],
            iconAnchor: [70, 16]
        });
        L.marker([3.8620, 11.5220], { icon: dropoffIcon }).addTo(map);

        // Fetch OSRM Route
        fetchOSRMRoute(3.8680, 11.5180, 3.8620, 11.5220).then((res) => {
            if (res.coordinates) {
                L.polyline(res.coordinates, {
                    color: '#1c1917',
                    weight: 6,
                    opacity: 0.95
                }).addTo(map);

                setEtaInfo({
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
    }, [currentOrder]);

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        post(route('driver.delivery.verify_otp', currentOrder.order_number), {
            data: { otp: otpInput },
            onSuccess: () => {
                setSelectedDeliveryForOtp(null);
                setOtpInput('');
            }
        });
    };

    return (
        <DriverLayout title="Carte & itinéraire live">
            <Head title="Carte Live & Tracking GPS - Sellify Express" />

            {/* FULL BLEED MAP WRAPPER (Matching Screenshot 1 DiDi App) */}
            <div className="relative w-full h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-900">
                
                {/* REAL LEAFLET MAP CANVAS */}
                <div ref={mapRef} className="absolute inset-0 z-0" />

                {/* TOP FLOATING ETA BADGE (Matching Screenshot 1: 0.8 km · 2 min restante(s)) */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200 px-6 py-2.5 rounded-full shadow-xl flex items-center gap-3">
                    <span className="text-yellow-600 font-extrabold text-sm">{etaInfo.distance}</span>
                    <span className="text-stone-300 font-normal">·</span>
                    <span className="text-stone-900 font-bold text-xs">{etaInfo.duration} restante(s)</span>
                </div>

                {/* BOTTOM FLOATING DRIVER & TRIP CARD (Matching Screenshot 1 DiDi Bottom Sheet) */}
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 z-10 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-200">
                    
                    {/* Header Info */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-sm text-stone-900">Livraison en cours acheminement</h3>
                        </div>
                        <span className="bg-yellow-100 text-yellow-950 px-2.5 py-0.5 rounded-full font-bold text-xs">
                            +{Number(currentOrder.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>

                    {/* Driver & Vehicle Identity Block (Matching Screenshot 1 HIX625 Renault Stepway) */}
                    <div className="bg-stone-50 border border-stone-200/70 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div className="space-y-1">
                            <span className="text-xl font-extrabold text-stone-900 font-mono tracking-wider block">{currentOrder.vehicle_plate}</span>
                            <span className="text-xs text-stone-600 font-medium block">{currentOrder.vehicle_model}</span>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-normal pt-1">
                                <span className="font-semibold text-stone-900">{currentOrder.driver_name}</span>
                                <span className="text-amber-600 font-bold">{currentOrder.rating} ★</span>
                            </div>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-yellow-950 font-bold text-xl flex items-center justify-center border border-yellow-500 shadow-2xs shrink-0">
                            🚗
                        </div>
                    </div>

                    {/* Customer Destination Info */}
                    <div className="text-xs text-stone-700 space-y-1 font-normal">
                        <span className="text-stone-400 block">Adresse de livraison client :</span>
                        <strong className="text-stone-900 block font-semibold">{currentOrder.shipping_address}</strong>
                        <span className="text-[11px] text-stone-500 block">Client: {currentOrder.user?.first_name} {currentOrder.user?.last_name} ({currentOrder.user?.phone})</span>
                    </div>

                    {/* Call & OTP Action Buttons (Matching Screenshot 1 Call Button & Message) */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                        <a
                            href={`tel:${currentOrder.user?.phone}`}
                            className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors shrink-0"
                            title="Appeler le client"
                        >
                            <PhoneCall className="w-4 h-4" />
                        </a>

                        <button
                            onClick={() => setSelectedDeliveryForOtp(currentOrder)}
                            className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                        >
                            <Key className="w-4 h-4" />
                            <span>Valider le Code OTP client</span>
                        </button>
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
