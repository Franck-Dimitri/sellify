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
    Key, 
    PhoneCall, 
    X,
    ArrowRight,
    Compass,
    PackageCheck,
    Layers,
    ListFilter
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute } from '@/Services/RoutingService';

export default function Map({ driver = {}, availableDeliveries = [], activeDelivery }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [selectedOrder, setSelectedOrder] = useState(activeDelivery || null);
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [etaInfo, setEtaInfo] = useState({ distance: '3.4 km', duration: '12 min' });
    const { post, processing } = useForm();

    const user = driver.user || {};
    const driverPhoto = user.kyc_documents?.[0] ? route('admin.kyc.document.show', user.kyc_documents[0].id) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

    // List of map orders (available + active)
    const mapOrders = [
        ...(activeDelivery ? [activeDelivery] : []),
        ...availableDeliveries,
        // Fallback default sample orders if empty
        {
            id: 'samp-1',
            order_number: 'SLF-2026-X892',
            vehicle_plate: driver.vehicle_plate || 'LT-492-BX',
            shipping_fee: 2500,
            delivery_status: 'ready_for_pickup',
            shop: { name: 'Tech Shop (Bastos)', lat: 3.8780, lng: 11.5121 },
            user: { first_name: 'Marc', last_name: 'Kamga', phone: '+237 690 00 00 00' },
            shipping_address: 'Akwa, Immeuble Rose, Douala',
            lat: 3.8620,
            lng: 11.5220
        },
        {
            id: 'samp-2',
            order_number: 'SLF-2026-B401',
            vehicle_plate: driver.vehicle_plate || 'LT-492-BX',
            shipping_fee: 3000,
            delivery_status: 'ready_for_pickup',
            shop: { name: 'Fashion Store (Bonanjo)', lat: 3.8820, lng: 11.5050 },
            user: { first_name: 'Sophie', last_name: 'Nguema', phone: '+237 699 11 22 33' },
            shipping_address: 'Bonapriso, Rue 12, Douala',
            lat: 3.8590,
            lng: 11.5300
        }
    ];

    // Initialize Fullscreen Leaflet Map
    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        const map = L.map(mapRef.current, {
            center: [3.8680, 11.5180],
            zoom: 13,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // 1. DRIVER CURRENT POSITION MARKER
        const driverMarkerHtml = `
            <div style="display: flex; align-items: center; gap: 8px; background: #ffffff; padding: 4px 10px 4px 4px; border-radius: 20px; border: 2px solid #eab308; box-shadow: 0 6px 18px rgba(0,0,0,0.25); font-family: sans-serif; font-size: 11px; font-weight: bold; color: #1c1917; cursor: pointer;">
                <img src="${driverPhoto}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" onError="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'" />
                <div style="display: flex; flex-direction: column;">
                    <span style="display: flex; align-items: center; gap: 4px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        Ma Position (${driver.vehicle_plate || 'LT-492-BX'})
                    </span>
                </div>
            </div>
        `;
        const driverIcon = L.divIcon({
            className: 'custom-driver-pos-pin',
            html: driverMarkerHtml,
            iconSize: [160, 36],
            iconAnchor: [80, 18]
        });
        L.marker([3.8680, 11.5180], { icon: driverIcon }).addTo(map);

        // 2. RENDER PINS FOR ALL ORDERS ON MAP
        mapOrders.forEach((order) => {
            const shopLat = order.shop?.lat || 3.8780;
            const shopLng = order.shop?.lng || 11.5121;

            // Shop Marker
            const shopHtml = `
                <div style="background: #ffffff; color: #1c1917; padding: 5px 10px; border-radius: 14px; border: 2px solid #eab308; box-shadow: 0 4px 14px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
                    <span>${order.shop?.name || 'Boutique'}</span>
                </div>
            `;
            const shopMarker = L.marker([shopLat, shopLng], {
                icon: L.divIcon({ className: 'c-shop-pin', html: shopHtml, iconSize: [140, 32], iconAnchor: [70, 16] })
            }).addTo(map);

            shopMarker.on('click', () => {
                setSelectedOrder(order);
            });

            // Customer Destination Marker
            const custLat = order.lat || 3.8620;
            const custLng = order.lng || 11.5220;
            const custHtml = `
                <div style="background: ${order.delivery_status === 'in_transit' ? '#eab308' : '#10b981'}; color: ${order.delivery_status === 'in_transit' ? '#1c1917' : '#ffffff'}; padding: 5px 10px; border-radius: 14px; border: 2px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>${order.order_number} (+${Number(order.shipping_fee || 2500).toLocaleString('fr-FR')} F)</span>
                </div>
            `;
            const customerMarker = L.marker([custLat, custLng], {
                icon: L.divIcon({ className: 'c-cust-pin', html: custHtml, iconSize: [170, 32], iconAnchor: [85, 16] })
            }).addTo(map);

            customerMarker.on('click', () => {
                setSelectedOrder(order);
            });
        });

        // 3. IF AN ORDER IS SELECTED, FETCH OSRM ROUTE AND DRAW POLYLINE
        if (selectedOrder) {
            const shopLat = selectedOrder.shop?.lat || 3.8780;
            const shopLng = selectedOrder.shop?.lng || 11.5121;
            const custLat = selectedOrder.lat || 3.8620;
            const custLng = selectedOrder.lng || 11.5220;

            fetchOSRMRoute(shopLat, shopLng, custLat, custLng).then((res) => {
                if (res.coordinates) {
                    L.polyline(res.coordinates, {
                        color: '#eab308',
                        weight: 5,
                        opacity: 0.95
                    }).addTo(map);

                    setEtaInfo({
                        distance: `${res.distanceKm} km`,
                        duration: `${res.durationMin} min`
                    });
                }
            });
        }

        mapInstance.current = map;

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [selectedOrder]);

    const handleAcceptCourse = (orderNumber) => {
        if (confirm(`Accepter la livraison de la commande #${orderNumber} ?`)) {
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
        <DriverLayout title="Carte & itinéraire live">
            <Head title="Carte & Mapping Tracking - Sellify Express" />

            {/* FULL BLEED MAP CANVAS */}
            <div className="relative w-full h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-100">
                
                {/* REAL LEAFLET MAP */}
                <div ref={mapRef} className="absolute inset-0 z-0" />

                {/* TOP FLOATING BADGE */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200 px-5 py-2 rounded-full shadow-lg flex items-center gap-3 text-xs font-bold text-stone-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Carte & Tracking Live · {mapOrders.length} course(s) géolocalisée(s)</span>
                </div>

                {/* BOTTOM HORIZONTAL QUICK SELECT PILLS (When no order is explicitly open) */}
                {!selectedOrder && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-3 shadow-xl max-w-lg w-full flex items-center gap-2 overflow-x-auto">
                        <span className="text-[11px] font-bold text-stone-500 shrink-0 pl-1">Sélectionner une course :</span>
                        {mapOrders.map((ord) => (
                            <button
                                key={ord.id || ord.order_number}
                                onClick={() => setSelectedOrder(ord)}
                                className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-950 font-bold text-xs rounded-xl shrink-0 transition-colors flex items-center gap-1.5"
                            >
                                <MapPin className="w-3.5 h-3.5 text-yellow-600" />
                                <span>#{ord.order_number} (+{Number(ord.shipping_fee || 2500).toLocaleString('fr-FR')} F)</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* FLOATING ORDER INSPECTION CARD (Opens ON CLICK on a Map Marker) */}
                {selectedOrder && (
                    <div className="absolute top-4 left-4 bottom-4 z-20 w-96 max-w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4 animate-in slide-in-from-left-5 duration-200">
                        
                        <div className="space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-yellow-600" />
                                    <div>
                                        <h3 className="font-bold text-sm text-stone-900">Commande #{selectedOrder.order_number}</h3>
                                        <span className="text-[10px] text-stone-400 block font-mono">Distance estimée : {etaInfo.distance} ({etaInfo.duration})</span>
                                    </div>
                                </div>

                                <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    selectedOrder.driver_id ? 'bg-yellow-100 text-yellow-950' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                    {selectedOrder.driver_id ? 'Prise en charge en cours' : 'Disponible au retrait'}
                                </span>
                                <span className="font-bold text-emerald-600 text-base">
                                    +{Number(selectedOrder.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                                </span>
                            </div>

                            {/* Trip Address Timeline */}
                            <div className="space-y-3 text-xs text-stone-700 font-normal">
                                <div className="p-3 bg-stone-50 rounded-xl space-y-1 border border-stone-200/70">
                                    <span className="text-[10px] text-yellow-700 font-bold uppercase block">Point A · Retrait Boutique</span>
                                    <strong className="text-stone-900 block font-bold">{selectedOrder.shop?.name || 'Tech Shop (Bastos)'}</strong>
                                </div>

                                <div className="p-3 bg-stone-50 rounded-xl space-y-1 border border-stone-200/70">
                                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Point B · Destination Client</span>
                                    <strong className="text-stone-900 block font-bold">{selectedOrder.user ? `${selectedOrder.user.first_name} ${selectedOrder.user.last_name}` : 'Marc Kamga'}</strong>
                                    <span className="text-[11px] text-stone-500 block">{selectedOrder.shipping_address || 'Akwa, Douala'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-stone-100 space-y-2">
                            {!selectedOrder.driver_id ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptCourse(selectedOrder.order_number)}
                                        disabled={processing}
                                        className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                                    >
                                        <span>Accepter la course</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="px-3 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200"
                                    >
                                        Refuser
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`tel:${selectedOrder.user?.phone || '+237690000000'}`}
                                        className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors shrink-0"
                                        title="Appeler le client"
                                    >
                                        <PhoneCall className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => setSelectedDeliveryForOtp(selectedOrder)}
                                        className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                                    >
                                        <Key className="w-4 h-4" />
                                        <span>Saisir le Code OTP</span>
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                )}

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
                                Valider et encaisser la livraison
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </DriverLayout>
    );
}
