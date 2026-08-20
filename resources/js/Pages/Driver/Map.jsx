import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
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
    ListFilter
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ driver = {}, activeDelivery }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [selectedPoint, setSelectedPoint] = useState(null);

    // Sample pickup and delivery points across Yaoundé / Douala
    const mapPoints = [
        {
            id: 1,
            title: "Tech Shop (Bastos)",
            type: "pickup",
            lat: 3.8780,
            lng: 11.5121,
            address: "Bastos, Face Pharmacie du Centre",
            order_number: "SLF-2026-X892",
            fee: 2500,
            status: "ready"
        },
        {
            id: 2,
            title: "Fashion Hub (Akwa)",
            type: "pickup",
            lat: 4.0511,
            lng: 9.7679,
            address: "Akwa, Boulevard de la Liberté",
            order_number: "SLF-2026-RDGUFA",
            fee: 1500,
            status: "ready"
        },
        {
            id: 3,
            title: "Marc Kamga (Acheteur)",
            type: "delivery",
            lat: 3.8650,
            lng: 11.5250,
            address: "Immeuble Rose, Yaoundé",
            order_number: "SLF-2026-X892",
            fee: 2500,
            status: "in_transit"
        }
    ];

    // Leaflet map initialization
    useEffect(() => {
        if (!mapRef.current) return;

        // Prevent double init
        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        const map = L.map(mapRef.current, {
            center: [3.8650, 11.5150],
            zoom: 13,
            zoomControl: true,
        });

        // OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Driver animated position marker
        const driverIcon = L.divIcon({
            className: 'custom-driver-pin',
            html: `<div style="background-color: #eab308; width: 36px; height: 36px; border-radius: 50%; border: 3px solid #1c1917; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 16px;">🚚</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const driverMarker = L.marker([3.8650, 11.5150], { icon: driverIcon }).addTo(map);
        driverMarker.bindPopup(`<b>Position Livreur en direct</b><br>Vitesse : 38 km/h`).openPopup();

        // Add pickup & delivery markers
        mapPoints.forEach((pt) => {
            const isPickup = pt.type === 'pickup';
            const icon = L.divIcon({
                className: `custom-pin-${pt.id}`,
                html: `<div style="background-color: ${isPickup ? '#f59e0b' : '#10b981'}; color: #ffffff; padding: 6px 10px; border-radius: 12px; font-weight: bold; font-size: 11px; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: sans-serif;">${isPickup ? '🏬 ' + pt.title : '📍 ' + pt.title}</div>`,
                iconSize: [120, 30],
                iconAnchor: [60, 15]
            });

            const marker = L.marker([pt.lat, pt.lng], { icon }).addTo(map);
            marker.bindPopup(`
                <div style="font-family: sans-serif; font-size: 12px;">
                    <strong>${pt.title}</strong><br>
                    ${pt.address}<br>
                    <span style="color: #059669; font-weight: bold;">+${pt.fee.toLocaleString('fr-FR')} FCFA</span>
                </div>
            `);

            marker.on('click', () => {
                setSelectedPoint(pt);
            });
        });

        // Add Polyline route connecting pickup to destination
        const polyline = L.polyline([
            [3.8780, 11.5121], // Shop
            [3.8650, 11.5150], // Driver
            [3.8650, 11.5250]  // Customer
        ], { color: '#eab308', weight: 4, dashArray: '8, 8' }).addTo(map);

        mapInstance.current = map;

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <DriverLayout title="Carte & itinéraire live">
            <Head title="Carte Live & GPS - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Navigation className="w-4 h-4 text-yellow-600 animate-pulse" />
                            <span>Cartographie interactive Leaflet & OpenStreetMap</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Cartographie & suivi des points de retrait
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Visualisez sur la carte réelle les boutiques de retrait et les itinéraires de livraison client.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-xl text-xs font-bold text-yellow-950 shrink-0">
                        GPS Actif : 38 km/h (Signal fort)
                    </div>
                </div>

                {/* Main Interactive Map & Side Points Stream */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* OpenStreetMap Real Canvas Container (2 cols) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs flex flex-col">
                        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                                <LocateFixed className="w-4 h-4 text-yellow-600" />
                                <span>Carte Douala / Yaoundé en direct</span>
                            </div>
                            <span className="text-[11px] text-stone-400 font-normal">Leaflet / OpenStreetMap</span>
                        </div>

                        {/* MAP HTML CANVAS MOUNT ELEMENT */}
                        <div ref={mapRef} className="w-full h-[480px] z-10" />
                    </div>

                    {/* Side Panel: Ready Pickup Points Stream (1 col) */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-bold text-sm text-stone-900">Points de retrait de la ville</h3>
                            </div>
                            <span className="text-xs text-stone-400 font-normal">{mapPoints.length} point(s)</span>
                        </div>

                        <div className="space-y-3 max-h-[420px] overflow-y-auto">
                            {mapPoints.map((pt) => (
                                <div
                                    key={pt.id}
                                    onClick={() => setSelectedPoint(pt)}
                                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                        selectedPoint?.id === pt.id
                                            ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400/30'
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xs text-stone-900">{pt.title}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            pt.type === 'pickup' ? 'bg-yellow-100 text-yellow-900' : 'bg-emerald-100 text-emerald-900'
                                        }`}>
                                            {pt.type === 'pickup' ? 'Retrait' : 'Livraison'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 font-normal mt-1">{pt.address}</p>
                                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-200/60 text-[11px]">
                                        <span className="font-mono text-stone-400">#{pt.order_number}</span>
                                        <span className="font-bold text-emerald-600">+{pt.fee.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </DriverLayout>
    );
}
