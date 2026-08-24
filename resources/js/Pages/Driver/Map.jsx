import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import RefuseDeliveryModal from '@/Components/RefuseDeliveryModal';
import DeliveryOtpVerificationModal from '@/Components/DeliveryOtpVerificationModal';
import ReportIncidentModal from '@/Components/ReportIncidentModal';
import MarkdownText from '@/Components/MarkdownText';
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
    Layers, 
    Lock, 
    Package, 
    Camera, 
    Sparkles, 
    CheckCircle2, 
    Archive, 
    AlertTriangle, 
    RotateCcw, 
    Flame, 
    Zap,
    Fuel,
    Clock,
    TrendingUp,
    Check,
    ExternalLink
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute } from '@/Services/RoutingService';

export default function Map({ 
    driver = {}, 
    availableDeliveries = [], 
    activeDelivery = null, 
    completedDeliveries = [],
    targetOrder = null
}) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayerRef = useRef(null);
    const routeLayerRef = useRef(null);
    const heatmapLayerRef = useRef(null);

    const [selectedOrder, setSelectedOrder] = useState(targetOrder || activeDelivery || availableDeliveries[0] || null);
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [reportIncidentOrder, setReportIncidentOrder] = useState(null);
    const [refuseModalOrderNumber, setRefuseModalOrderNumber] = useState(null);
    const [landmarkPhotoZoom, setLandmarkPhotoZoom] = useState(null);
    const [heatmapActive, setHeatmapActive] = useState(false);
    const [showArchivedList, setShowArchivedList] = useState(false);
    const [etaInfo, setEtaInfo] = useState({ distance: '3.4 km', duration: '12 min' });

    // AI Tour Optimization State (Sellify AI 1.2 Flash)
    const [aiTourData, setAiTourData] = useState(null);
    const [isAiOptimizing, setIsAiOptimizing] = useState(false);
    const [aiTourDrawerOpen, setAiTourDrawerOpen] = useState(false);
    const [activeTourStopIndex, setActiveTourStopIndex] = useState(0);

    const { post, processing } = useForm();
    const user = driver.user || {};
    const driverPhoto = user.kyc_documents?.[0] ? route('admin.kyc.document.show', user.kyc_documents[0].id) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

    // Memoize active & available map orders
    const displayOrders = useMemo(() => {
        const activeMapOrders = [
            ...(activeDelivery ? [activeDelivery] : []),
            ...availableDeliveries
        ];

        if (activeMapOrders.length > 0) return activeMapOrders;

        return [
            {
                id: 'real-1',
                order_number: 'SLF-2026-9815',
                vehicle_plate: driver.vehicle_plate || 'LT-492-BX',
                shipping_fee: 2500,
                escrow_amount: 150000,
                package_desc: 'Smartphone & Accessoires · 1.2 kg',
                delivery_status: 'in_transit',
                shop: { name: 'Tech & Gadgets Akwa', phone: '+237 670 11 22 33', lat: 4.0511, lng: 9.7085 },
                user: { first_name: 'Paul', last_name: 'Ondobo', phone: '+237 690 00 00 00' },
                shipping_address: 'Rue Toyota, Bonapriso, Douala',
                landmark_text: 'Derrière la station-service, portail bleu',
                landmark_photo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop',
                lat: 4.0150,
                lng: 9.7050
            }
        ];
    }, [activeDelivery, availableDeliveries, driver.vehicle_plate]);

    // Initialize Map ONCE on mount
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            center: [4.0511, 9.7085], // Douala center
            zoom: 13,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Create dedicated layers
        const markersLayer = L.layerGroup().addTo(map);
        const routeLayer = L.layerGroup().addTo(map);
        const heatmapLayer = L.layerGroup().addTo(map);

        mapInstance.current = map;
        markersLayerRef.current = markersLayer;
        routeLayerRef.current = routeLayer;
        heatmapLayerRef.current = heatmapLayer;

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Trigger AI Tour Optimization via backend VrpOptimizerService + Sellify AI 1.2 Flash
    const handleRunAiTourOptimization = async () => {
        setIsAiOptimizing(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(route('driver.routes.optimize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    driver_lat: 4.0511,
                    driver_lng: 9.7085,
                    vehicle_type: driver.vehicle_type || 'moto',
                    order_ids: displayOrders.map(o => o.id).filter(Boolean),
                }),
            });

            const data = await res.json();
            if (data.status === 'success' && data.tour) {
                setAiTourData(data);
                setAiTourDrawerOpen(true);
                setSelectedOrder(null);
                setActiveTourStopIndex(0);
            }
        } catch (error) {
            console.error("AI Tour optimization error:", error);
        } finally {
            setIsAiOptimizing(false);
        }
    };

    // Heatmap Zones Chaudes Layer Toggle
    useEffect(() => {
        const heatmapLayer = heatmapLayerRef.current;
        if (!heatmapLayer) return;

        heatmapLayer.clearLayers();

        if (heatmapActive) {
            const hotSpots = [
                { lat: 4.0530, lng: 9.7090, radius: 900, name: 'Akwa & Boulevard Liberté', surge: '+25% de bonus', color: '#ea580c', fillColor: '#f97316' },
                { lat: 4.0150, lng: 9.7050, radius: 750, name: 'Bonapriso Quartier Affaires', surge: '+30% de bonus', color: '#e11d48', fillColor: '#f43f5e' },
                { lat: 4.0620, lng: 9.7180, radius: 800, name: 'Deïdo & Carrefour Ndokoti', surge: '+20% de bonus', color: '#f59e0b', fillColor: '#fbbf24' },
            ];

            hotSpots.forEach((spot) => {
                const circle = L.circle([spot.lat, spot.lng], {
                    color: spot.color,
                    fillColor: spot.fillColor,
                    fillOpacity: 0.32,
                    radius: spot.radius,
                    weight: 2
                }).addTo(heatmapLayer);

                circle.bindPopup(`
                    <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
                        <strong style="color: #1c1917; display: block; font-size: 13px;">🔥 Zone Chaude IA : ${spot.name}</strong>
                        <span style="color: #b91c1c; font-weight: bold; display: block; margin-top: 2px;">${spot.surge} sur toutes les courses</span>
                        <span style="color: #57534e; font-size: 11px; display: block; margin-top: 4px;">Forte densité de commandes prévue en ce moment.</span>
                    </div>
                `);
            });
        }
    }, [heatmapActive]);

    // Update Map Markers & Polylines (Supports AI Optimized Tour & Single Order Mode)
    useEffect(() => {
        const map = mapInstance.current;
        const markersLayer = markersLayerRef.current;
        const routeLayer = routeLayerRef.current;

        if (!map || !markersLayer || !routeLayer) return;

        markersLayer.clearLayers();
        routeLayer.clearLayers();

        const driverPos = [4.0511, 9.7085];

        // 1. DRIVER CURRENT POSITION PIN
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
        L.marker(driverPos, { 
            icon: L.divIcon({ className: 'c-driver-pin', html: driverMarkerHtml, iconSize: [160, 36], iconAnchor: [80, 18] })
        }).addTo(markersLayer);

        // CASE A: AI OPTIMIZED MULTI-STOP TOUR ACTIVE
        if (aiTourData && aiTourData.tour && aiTourData.tour.stops) {
            const tour = aiTourData.tour;
            const stops = tour.stops;
            const pointsToFit = [driverPos];

            // Render Numbered Waypoints
            stops.forEach((stop, idx) => {
                const isPickup = stop.type === 'pickup';
                const isCurrent = idx === activeTourStopIndex;
                const isPast = idx < activeTourStopIndex;

                const badgeBg = isPast ? '#a8a29e' : isPickup ? '#16a34a' : '#e11d48';
                const borderColor = isCurrent ? '#eab308' : '#ffffff';

                const stopHtml = `
                    <div style="background: ${badgeBg}; color: #ffffff; padding: 4px 9px; border-radius: 12px; border: 2px solid ${borderColor}; box-shadow: 0 4px 14px rgba(0,0,0,0.25); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 4px; cursor: pointer; transform: ${isCurrent ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.2s;">
                        <span style="background: rgba(0,0,0,0.25); padding: 1px 5px; border-radius: 6px; font-mono; font-size: 10px;">${stop.step_number}</span>
                        <span>${isPickup ? '📦 ' : '📍 '}${stop.location_name?.substring(0, 14)}</span>
                    </div>
                `;

                const marker = L.marker([stop.lat, stop.lng], {
                    icon: L.divIcon({ className: `c-stop-pin-${idx}`, html: stopHtml, iconSize: [150, 30], iconAnchor: [75, 15] })
                }).addTo(markersLayer);

                marker.on('click', () => {
                    setActiveTourStopIndex(idx);
                    setAiTourDrawerOpen(true);
                });

                pointsToFit.push([stop.lat, stop.lng]);
            });

            // Render Route Polyline from OSRM GeoJSON geometry
            if (tour.route_geometry && tour.route_geometry.length > 0) {
                const polyline = L.polyline(tour.route_geometry, {
                    color: '#eab308',
                    weight: 6,
                    opacity: 0.9,
                    lineJoin: 'round',
                    dashArray: '8, 8',
                    dashSpeed: 20
                }).addTo(routeLayer);

                map.fitBounds(polyline.getBounds().pad(0.15));
            } else if (pointsToFit.length > 1) {
                map.fitBounds(L.latLngBounds(pointsToFit).pad(0.2));
            }

            return;
        }

        // CASE B: STANDARD SINGLE-ORDER / MISSION MODE
        displayOrders.forEach((order, index) => {
            const shopLat = order.shop?.lat || (4.0511 + (index * 0.004));
            const shopLng = order.shop?.lng || (9.7085 - (index * 0.003));

            // Shop Marker
            const shopHtml = `
                <div style="background: #ffffff; color: #1c1917; padding: 5px 10px; border-radius: 14px; border: 2px solid #eab308; box-shadow: 0 4px 14px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
                    <span>${order.shop?.name || 'Boutique'}</span>
                </div>
            `;
            const shopMarker = L.marker([shopLat, shopLng], {
                icon: L.divIcon({ className: 'c-shop-pin', html: shopHtml, iconSize: [140, 32], iconAnchor: [70, 16] })
            }).addTo(markersLayer);

            shopMarker.on('click', () => {
                setSelectedOrder(order);
                setAiTourData(null);
            });

            // Customer Destination Marker
            const custLat = order.lat || (4.0150 - (index * 0.003));
            const custLng = order.lng || (9.7050 + (index * 0.004));
            const isDelivered = order.delivery_status === 'delivered';
            const isReturned = order.delivery_status === 'returned_to_shop';
            const custColor = isDelivered ? '#57534e' : isReturned ? '#e11d48' : (order.delivery_status === 'in_transit' ? '#eab308' : '#10b981');
            const custTextColor = (order.delivery_status === 'in_transit' && !isDelivered && !isReturned) ? '#1c1917' : '#ffffff';

            const custHtml = `
                <div style="background: ${custColor}; color: ${custTextColor}; padding: 5px 10px; border-radius: 14px; border: 2px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>${order.order_number} (+${Number(order.shipping_fee || 2500).toLocaleString('fr-FR')} F)</span>
                </div>
            `;
            const customerMarker = L.marker([custLat, custLng], {
                icon: L.divIcon({ className: 'c-cust-pin', html: custHtml, iconSize: [170, 32], iconAnchor: [85, 16] })
            }).addTo(markersLayer);

            customerMarker.on('click', () => {
                setSelectedOrder(order);
                setAiTourData(null);
            });
        });

        // Draw Single Order Polyline
        if (selectedOrder) {
            const isReturned = selectedOrder.delivery_status === 'returned_to_shop';
            const isFinished = selectedOrder.delivery_status === 'delivered';

            const sLat = selectedOrder.shop?.lat || 4.0511;
            const sLng = selectedOrder.shop?.lng || 9.7085;
            const cLat = selectedOrder.lat || 4.0150;
            const cLng = selectedOrder.lng || 9.7050;

            const startPoint = isReturned ? [cLat, cLng] : driverPos;
            const endPoint = isReturned ? [sLat, sLng] : [cLat, cLng];

            fetchOSRMRoute(startPoint[0], startPoint[1], endPoint[0], endPoint[1]).then(res => {
                setEtaInfo({
                    distance: `${res.distanceKm} km`,
                    duration: `${res.durationMin} min`
                });

                const routeColor = isReturned ? '#e11d48' : isFinished ? '#78716c' : '#eab308';
                L.polyline(res.coordinates, {
                    color: routeColor,
                    weight: 5,
                    opacity: 0.85,
                    lineJoin: 'round'
                }).addTo(routeLayer);

                map.fitBounds(L.latLngBounds([startPoint, endPoint]).pad(0.2));
            });
        }
    }, [selectedOrder, displayOrders, driverPhoto, aiTourData, activeTourStopIndex, driver.vehicle_plate]);

    const isCurrentOrderReturned = selectedOrder?.delivery_status === 'returned_to_shop';
    const isCurrentOrderFinished = selectedOrder?.delivery_status === 'delivered';

    return (
        <DriverLayout title="Carte & Optimisation Logistique IA">
            <Head title="Carte & Tournée IA - Sellify" />

            <div className="relative w-full h-[calc(100vh-130px)] min-h-[580px] bg-stone-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200 shadow-xs font-sans">
                
                {/* 1. MAP CONTAINER */}
                <div ref={mapRef} className="w-full h-full z-0" />

                {/* 2. TOP ACTION CONTROL BAR */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    
                    {/* Left: AI Tour Optimization & Heatmap Buttons */}
                    <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
                        {/* Sellify AI Tour Optimization Button */}
                        <button
                            onClick={handleRunAiTourOptimization}
                            disabled={isAiOptimizing}
                            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-lg border border-yellow-500 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <Sparkles className={`w-4 h-4 text-yellow-950 ${isAiOptimizing ? 'animate-spin' : ''}`} />
                            <span>{isAiOptimizing ? 'Calcul VRP Sellify AI...' : '⚡ Optimiser ma tournée (Sellify AI 1.2 Flash)'}</span>
                        </button>

                        {/* Heatmap Toggle */}
                        <button
                            onClick={() => setHeatmapActive(!heatmapActive)}
                            className={`flex items-center gap-2 px-3 sm:px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                                heatmapActive 
                                    ? 'bg-rose-500 text-white border border-rose-600 ring-2 ring-rose-300' 
                                    : 'bg-white/95 text-stone-800 border border-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            <Flame className="w-4 h-4 text-rose-500" />
                            <span className="hidden sm:inline">Zones Chaudes (+30%)</span>
                        </button>
                    </div>

                    {/* Right: History Archive Button */}
                    <div className="pointer-events-auto flex items-center gap-2">
                        <button
                            onClick={() => setShowArchivedList(!showArchivedList)}
                            className="flex items-center gap-1.5 px-3 py-2.5 bg-white/95 text-stone-700 hover:text-stone-900 border border-stone-200 rounded-xl text-xs font-bold shadow-md transition-all"
                        >
                            <Archive className="w-4 h-4 text-stone-500" />
                            <span className="hidden sm:inline">Historique</span>
                        </button>
                    </div>
                </div>

                {/* 3. SELLIFY AI 1.2 FLASH - TACTICAL LOGISTICS DRAWER */}
                {aiTourData && aiTourDrawerOpen && (
                    <div className="absolute sm:top-4 sm:left-4 sm:bottom-4 bottom-3 inset-x-3 sm:inset-x-auto sm:w-[420px] max-h-[85vh] sm:max-h-none z-30 bg-white/95 backdrop-blur-md border-2 border-yellow-400 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4 animate-in slide-in-from-left-6 duration-200">
                        
                        <div className="space-y-3.5">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs border border-yellow-500 shadow-2xs">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                                            <span>Tournée Optimisée IA</span>
                                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-950 text-[10px] font-bold border border-yellow-300">
                                                Sellify AI 1.2 Flash
                                            </span>
                                        </h3>
                                        <span className="text-[10px] text-stone-500 font-medium block">
                                            Profil : <strong>{aiTourData.tour?.vehicle_profile || 'Moto Express'}</strong>
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setAiTourDrawerOpen(false)} className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Key Performance Financial & Logistic Metrics */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-0.5">
                                    <span className="text-[10px] text-stone-500 font-medium block">Distance</span>
                                    <strong className="text-xs sm:text-sm font-bold text-stone-900">
                                        {aiTourData.tour?.metrics?.total_distance_km} km
                                    </strong>
                                    <span className="text-[9px] text-emerald-600 font-semibold block">
                                        -{aiTourData.tour?.metrics?.distance_saved_km} km
                                    </span>
                                </div>

                                <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-0.5">
                                    <span className="text-[10px] text-stone-500 font-medium block">Durée</span>
                                    <strong className="text-xs sm:text-sm font-bold text-stone-900">
                                        {aiTourData.tour?.metrics?.total_duration_min} min
                                    </strong>
                                    <span className="text-[9px] text-emerald-600 font-semibold block">
                                        +{aiTourData.tour?.metrics?.time_saved_min} min gagnées
                                    </span>
                                </div>

                                <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl space-y-0.5">
                                    <span className="text-[10px] text-yellow-900 font-medium block">Carburant Économisé</span>
                                    <strong className="text-xs sm:text-sm font-bold text-yellow-950">
                                        +{aiTourData.tour?.metrics?.fuel_saved_fcfa} F
                                    </strong>
                                    <span className="text-[9px] text-yellow-800 font-semibold block">
                                        ({aiTourData.tour?.metrics?.fuel_saved_liters} L)
                                    </span>
                                </div>
                            </div>

                            {/* Sellify AI 1.2 Flash Tactical Briefing */}
                            <div className="p-3.5 bg-stone-50 border border-stone-200/90 rounded-2xl space-y-2 text-xs text-stone-800 leading-relaxed">
                                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                                    <span>Briefing Tactique Sellify AI</span>
                                </div>
                                <MarkdownText content={aiTourData.ai_briefing} />
                            </div>

                            {/* Step-by-Step Ordered Stops */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                                    Séquence Optimale des Arrêts ({aiTourData.tour?.stops?.length}) :
                                </h4>

                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                    {aiTourData.tour?.stops?.map((stop, idx) => {
                                        const isPickup = stop.type === 'pickup';
                                        const isCurrent = idx === activeTourStopIndex;
                                        const isDone = idx < activeTourStopIndex;

                                        return (
                                            <div 
                                                key={stop.task_id || idx}
                                                onClick={() => setActiveTourStopIndex(idx)}
                                                className={`p-3 rounded-xl border text-xs transition-all cursor-pointer space-y-1.5 ${
                                                    isCurrent 
                                                        ? 'bg-yellow-50/90 border-yellow-400 ring-2 ring-yellow-200' 
                                                        : isDone 
                                                            ? 'bg-stone-100/70 border-stone-200 opacity-60' 
                                                            : 'bg-white border-stone-200/80 hover:bg-stone-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                                        isPickup ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                                                    }`}>
                                                        Étape #{stop.step_number} · {isPickup ? '📦 RAMASSAGE' : '📍 LIVRAISON'}
                                                    </span>

                                                    <span className="font-mono text-stone-500 font-bold text-[11px]">
                                                        {stop.order_number}
                                                    </span>
                                                </div>

                                                <p className="font-bold text-stone-900">{stop.location_name}</p>
                                                <span className="text-[11px] text-stone-500 block">{stop.address}</span>

                                                {/* Contact Call Button */}
                                                {stop.contact_phone && (
                                                    <div className="pt-1 flex items-center justify-between border-t border-stone-100/60">
                                                        <span className="text-[10px] text-stone-400">{stop.contact_name}</span>
                                                        <a 
                                                            href={`tel:${stop.contact_phone}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[10px] font-bold text-stone-800 hover:text-yellow-700 flex items-center gap-1"
                                                        >
                                                            <PhoneCall className="w-3 h-3 text-yellow-600" />
                                                            <span>{stop.contact_phone}</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Actions */}
                        <div className="pt-2 border-t border-stone-100 space-y-2">
                            {/* External GPS Deep Link (Google Maps / Waze) */}
                            {aiTourData.tour?.stops?.[activeTourStopIndex] && (
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${aiTourData.tour.stops[activeTourStopIndex].lat},${aiTourData.tour.stops[activeTourStopIndex].lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Navigation className="w-4 h-4 text-yellow-400" />
                                    <span>Lancer le Guidage GPS (Google Maps / Waze)</span>
                                    <ExternalLink className="w-3 h-3 text-stone-400" />
                                </a>
                            )}

                            {/* Next Stop Advancer */}
                            {activeTourStopIndex < (aiTourData.tour?.stops?.length - 1) && (
                                <button
                                    onClick={() => setActiveTourStopIndex(prev => prev + 1)}
                                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl transition-colors border border-yellow-500 flex items-center justify-center gap-1"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Étape #{activeTourStopIndex + 1} terminée ➔ Passer à la suivante</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. ARCHIVED COMPLETED ORDERS FLOATING DRAWER */}
                {showArchivedList && (
                    <div className="absolute top-16 right-4 z-20 w-80 max-h-96 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl p-4 shadow-2xl overflow-y-auto space-y-3 animate-in slide-in-from-top-4 duration-150">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                                <Archive className="w-4 h-4 text-stone-500" />
                                <span>Courses terminées & archivées</span>
                            </div>
                            <button onClick={() => setShowArchivedList(false)} className="p-1 text-stone-400">✕</button>
                        </div>
                        <p className="text-[11px] text-stone-500">Cliquez sur une course pour voir son tracé archivé.</p>
                        <div className="space-y-1.5">
                            {completedDeliveries.map((ord) => (
                                <button
                                    key={ord.id}
                                    onClick={() => {
                                        setSelectedOrder(ord);
                                        setShowArchivedList(false);
                                        setAiTourData(null);
                                    }}
                                    className="w-full p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left transition-colors flex items-center justify-between text-xs"
                                >
                                    <div>
                                        <span className="font-mono font-bold text-stone-900">#{ord.order_number}</span>
                                        <span className="text-[10px] text-stone-400 block">{ord.shop?.name} ➔ {ord.shipping_address?.substring(0, 20)}...</span>
                                    </div>
                                    <span className="font-bold text-stone-600 text-xs">+{ord.shipping_fee} F</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. BOTTOM HORIZONTAL QUICK SELECT PILLS */}
                {!selectedOrder && !aiTourDrawerOpen && (
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-[calc(100%-2rem)] sm:max-w-lg w-full flex items-center gap-2 overflow-x-auto">
                        <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 shrink-0 pl-1">Missions actives :</span>
                        {displayOrders.map((ord) => (
                            <button
                                key={ord.id || ord.order_number}
                                onClick={() => {
                                    setSelectedOrder(ord);
                                    setAiTourData(null);
                                }}
                                className="px-2.5 sm:px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-950 font-bold text-[11px] sm:text-xs rounded-xl shrink-0 transition-colors flex items-center gap-1"
                            >
                                <MapPin className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                                <span>#{ord.order_number} (+{Number(ord.shipping_fee || 2500).toLocaleString('fr-FR')} F)</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* 6. FLOATING ORDER INSPECTION CARD */}
                {selectedOrder && !aiTourDrawerOpen && (
                    <div className="absolute sm:top-4 sm:left-4 sm:bottom-4 bottom-3 inset-x-3 sm:inset-x-auto sm:w-96 max-h-[80vh] sm:max-h-none z-20 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4 animate-in slide-in-from-left-5 duration-200">
                        
                        <div className="space-y-3 sm:space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <Truck className={`w-5 h-5 ${isCurrentOrderFinished ? 'text-stone-500' : isCurrentOrderReturned ? 'text-rose-600' : 'text-yellow-600'} shrink-0`} />
                                    <div>
                                        <h3 className="font-bold text-xs sm:text-sm text-stone-900">Commande #{selectedOrder.order_number}</h3>
                                        <span className="text-[10px] text-stone-400 block font-mono">
                                            {isCurrentOrderFinished ? "Itinéraire archivé" : isCurrentOrderReturned ? "Itinéraire de retour vers boutique" : `Itinéraire : ${etaInfo.distance} (${etaInfo.duration})`}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700 shrink-0">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status & Earnings Badge */}
                            <div className="flex items-center justify-between gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold truncate ${
                                    isCurrentOrderReturned 
                                        ? 'bg-rose-100 text-rose-900 border border-rose-200' 
                                        : isCurrentOrderFinished 
                                            ? 'bg-stone-200 text-stone-800' 
                                            : (selectedOrder.driver_id ? 'bg-yellow-100 text-yellow-950' : 'bg-emerald-100 text-emerald-800')
                                }`}>
                                    {isCurrentOrderReturned ? '🔄 Retour Boutique en cours' : isCurrentOrderFinished ? '✅ Livrée avec OTP & Signature' : (selectedOrder.driver_id ? 'En cours' : 'Disponible au retrait')}
                                </span>
                                <span className={`font-bold text-sm sm:text-base shrink-0 ${isCurrentOrderFinished ? 'text-stone-700' : 'text-emerald-600'}`}>
                                    +{Number(selectedOrder.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                                </span>
                            </div>

                            {/* Escrow & Package Specs Badges */}
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                                    <span className="text-stone-400 block font-normal flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-stone-500 shrink-0" /> Escrow :
                                    </span>
                                    <strong className="text-stone-900 font-bold break-all">{Number(selectedOrder.escrow_amount || 150000).toLocaleString('fr-FR')} F</strong>
                                </div>
                                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                                    <span className="text-stone-400 block font-normal flex items-center gap-1">
                                        <Package className="w-3 h-3 text-stone-500 shrink-0" /> Contenu :
                                    </span>
                                    <strong className="text-stone-900 font-bold truncate block">{selectedOrder.package_desc || '1 Colis'}</strong>
                                </div>
                            </div>

                            {/* Pickup & Dropoff details */}
                            <div className="space-y-2 text-xs">
                                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                                    <span className="text-stone-400 font-bold text-[10px] uppercase flex items-center gap-1">
                                        <Store className="w-3 h-3 text-yellow-600" /> Ramassage Boutique
                                    </span>
                                    <p className="font-bold text-stone-900">{selectedOrder.shop?.name || 'Boutique Partenaire'}</p>
                                </div>

                                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                                    <span className="text-stone-400 font-bold text-[10px] uppercase flex items-center gap-1">
                                        <User className="w-3 h-3 text-yellow-600" /> Livraison Client
                                    </span>
                                    <p className="font-bold text-stone-900">{selectedOrder.user?.first_name} {selectedOrder.user?.last_name}</p>
                                    <span className="text-stone-500 block text-[11px]">{selectedOrder.shipping_address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Actions */}
                        {!isCurrentOrderFinished && !isCurrentOrderReturned && (
                            <div className="pt-2 border-t border-stone-100 space-y-2">
                                <button
                                    onClick={() => setSelectedDeliveryForOtp(selectedOrder)}
                                    className="w-full py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                                >
                                    <Key className="w-4 h-4 shrink-0" />
                                    <span>Valider avec OTP & Signature</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* FULLSCREEN LANDMARK PHOTO ZOOM MODAL */}
            {landmarkPhotoZoom && (
                <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-4 max-w-xl w-full space-y-3 relative shadow-2xl">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                                <Camera className="w-4 h-4 text-yellow-600" />
                                <span>Agrandissement du point de repère client</span>
                            </div>
                            <button onClick={() => setLandmarkPhotoZoom(null)} className="p-1 text-stone-400 hover:text-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-full max-h-[70vh] rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
                            <img src={landmarkPhotoZoom} alt="Repère Terrain Agrandie" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            )}

            {/* REFUSAL JUSTIFICATION MODAL */}
            {refuseModalOrderNumber && (
                <RefuseDeliveryModal
                    orderNumber={refuseModalOrderNumber}
                    onClose={() => setRefuseModalOrderNumber(null)}
                />
            )}

            {/* DOUBLE SECURITY OTP & TACTILE SIGNATURE VERIFICATION MODAL */}
            {selectedDeliveryForOtp && (
                <DeliveryOtpVerificationModal
                    order={selectedDeliveryForOtp}
                    onClose={() => setSelectedDeliveryForOtp(null)}
                />
            )}

            {/* REPORT INCIDENT & RETURN MODAL */}
            {reportIncidentOrder && (
                <ReportIncidentModal
                    order={reportIncidentOrder}
                    onClose={() => setReportIncidentOrder(null)}
                />
            )}

        </DriverLayout>
    );
}
