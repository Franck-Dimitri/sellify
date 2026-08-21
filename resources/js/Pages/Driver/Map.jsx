import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import RefuseDeliveryModal from '@/Components/RefuseDeliveryModal';
import DeliveryOtpVerificationModal from '@/Components/DeliveryOtpVerificationModal';
import ReportIncidentModal from '@/Components/ReportIncidentModal';
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
    ListFilter,
    Lock,
    Package,
    MessageSquare,
    Camera,
    Sparkles,
    Eye,
    Maximize2,
    CheckCircle2,
    Archive,
    History,
    AlertTriangle,
    RotateCcw
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute, solveMultiStopTSPRoute } from '@/Services/RoutingService';

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

    const [selectedOrder, setSelectedOrder] = useState(targetOrder || activeDelivery || availableDeliveries[0] || null);
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [reportIncidentOrder, setReportIncidentOrder] = useState(null);
    const [refuseModalOrderNumber, setRefuseModalOrderNumber] = useState(null);
    const [landmarkPhotoZoom, setLandmarkPhotoZoom] = useState(null);
    const [tspModeActive, setTspModeActive] = useState(false);
    const [tspRouteData, setTspRouteData] = useState(null);
    const [showArchivedList, setShowArchivedList] = useState(false);
    const [etaInfo, setEtaInfo] = useState({ distance: '3.4 km', duration: '12 min' });
    const { post, processing } = useForm();

    const user = driver.user || {};
    const driverPhoto = user.kyc_documents?.[0] ? route('admin.kyc.document.show', user.kyc_documents[0].id) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

    // Memoize active & available map orders so reference doesn't change on every render
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
                shop: { name: 'Tech & Gadgets Express', phone: '+237 670 11 22 33', lat: 3.8780, lng: 11.5121 },
                user: { first_name: 'Paul', last_name: 'Ondobo', phone: '+237 690 00 00 00' },
                shipping_address: 'Bastos, Rue des Ambassades, Yaoundé',
                landmark_text: 'Derrière le marché central, portail bleu près de la pharmacie du Soleil',
                landmark_photo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop',
                lat: 3.8620,
                lng: 11.5220
            }
        ];
    }, [activeDelivery, availableDeliveries, driver.vehicle_plate]);

    // Initialize Map ONCE on mount
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            center: [3.8680, 11.5180],
            zoom: 13,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Create dedicated layers for markers & route polylines
        const markersLayer = L.layerGroup().addTo(map);
        const routeLayer = L.layerGroup().addTo(map);

        mapInstance.current = map;
        markersLayerRef.current = markersLayer;
        routeLayerRef.current = routeLayer;

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // TSP Multi-Stop Optimization
    useEffect(() => {
        if (!tspModeActive) return;

        const driverPos = { lat: 3.8680, lng: 11.5180 };
        const stops = [];

        displayOrders.forEach((o) => {
            stops.push({
                id: `pickup-${o.order_number}`,
                order_number: o.order_number,
                type: 'pickup',
                name: `Retrait : ${o.shop?.name || 'Boutique'}`,
                lat: o.shop?.lat || 3.8780,
                lng: o.shop?.lng || 11.5121
            });
            stops.push({
                id: `dropoff-${o.order_number}`,
                order_number: o.order_number,
                type: 'dropoff',
                name: `Livraison : ${o.user?.first_name || 'Client'} (${o.shipping_address})`,
                lat: o.lat || 3.8620,
                lng: o.lng || 11.5220
            });
        });

        solveMultiStopTSPRoute(driverPos, stops).then((res) => {
            setTspRouteData(res);
        });
    }, [tspModeActive, displayOrders]);

    // Update Map Markers & Polylines without destroying the map instance
    useEffect(() => {
        const map = mapInstance.current;
        const markersLayer = markersLayerRef.current;
        const routeLayer = routeLayerRef.current;

        if (!map || !markersLayer || !routeLayer) return;

        // Clear previous markers and route lines cleanly
        markersLayer.clearLayers();
        routeLayer.clearLayers();

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
        L.marker([3.8680, 11.5180], { 
            icon: L.divIcon({ className: 'c-driver-pin', html: driverMarkerHtml, iconSize: [160, 36], iconAnchor: [80, 18] })
        }).addTo(markersLayer);

        // 2. RENDER PINS ONLY FOR ACTIVE & AVAILABLE ORDERS
        displayOrders.forEach((order, index) => {
            const shopLat = order.shop?.lat || (3.8780 + (index * 0.004));
            const shopLng = order.shop?.lng || (11.5121 - (index * 0.003));

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
                setTspModeActive(false);
            });

            // Customer Destination Marker
            const custLat = order.lat || (3.8620 - (index * 0.003));
            const custLng = order.lng || (11.5220 + (index * 0.004));
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
                setTspModeActive(false);
            });
        });

        // 3. DRAW ROUTE POLYLINE
        if (tspModeActive && tspRouteData?.coordinates) {
            L.polyline(tspRouteData.coordinates, {
                color: '#eab308',
                weight: 6,
                dashArray: '8, 8',
                opacity: 0.95
            }).addTo(routeLayer);
        } else if (selectedOrder) {
            const shopLat = selectedOrder.shop?.lat || 3.8780;
            const shopLng = selectedOrder.shop?.lng || 11.5121;
            const custLat = selectedOrder.lat || 3.8620;
            const custLng = selectedOrder.lng || 11.5220;

            const isFinished = selectedOrder.delivery_status === 'delivered';
            const isReturned = selectedOrder.delivery_status === 'returned_to_shop';
            const routeColor = isReturned ? '#e11d48' : isFinished ? '#57534e' : '#eab308'; // Red for return to vendor, Dark Gray for finished order

            fetchOSRMRoute(shopLat, shopLng, custLat, custLng).then((res) => {
                if (res.coordinates && routeLayerRef.current) {
                    routeLayerRef.current.clearLayers();
                    L.polyline(res.coordinates, {
                        color: routeColor,
                        weight: isFinished ? 5 : 6,
                        opacity: isFinished ? 0.75 : 0.95,
                        dashArray: (isFinished || isReturned) ? '4, 6' : undefined
                    }).addTo(routeLayerRef.current);

                    setEtaInfo({
                        distance: `${res.distanceKm} km`,
                        duration: `${res.durationMin} min`
                    });
                }
            });
        }
    }, [selectedOrder?.order_number, selectedOrder?.delivery_status, tspModeActive, tspRouteData, displayOrders, driverPhoto, driver.vehicle_plate]);

    const handleAcceptCourse = (orderNumber) => {
        if (confirm(`Accepter la livraison de la commande #${orderNumber} ?`)) {
            post(route('driver.delivery.accept', orderNumber));
        }
    };

    const isCurrentOrderFinished = selectedOrder?.delivery_status === 'delivered';
    const isCurrentOrderReturned = selectedOrder?.delivery_status === 'returned_to_shop';

    return (
        <DriverLayout title="Carte & itinéraire live">
            <Head title="Carte & Mapping Tracking - Sellify Express" />

            {/* FULL BLEED MAP CANVAS */}
            <div className="relative w-full h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-100">
                
                {/* REAL LEAFLET MAP */}
                <div ref={mapRef} className="absolute inset-0 z-0" />

                {/* TOP FLOATING BADGES */}
                <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-2 max-w-[calc(100%-2rem)]">
                    <div className="bg-white/95 backdrop-blur-md border border-stone-200 px-4 sm:px-5 py-2 rounded-full shadow-lg flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold text-stone-900 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <span className="truncate">Carte & Tracking Live · {displayOrders.length} mission(s) active(s)</span>
                    </div>

                    {/* TSP Multi-Stop Optimization Toggle Button */}
                    <button
                        onClick={() => {
                            setTspModeActive(!tspModeActive);
                            if (!tspModeActive) setSelectedOrder(null);
                        }}
                        className={`px-4 py-2 rounded-full shadow-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 border ${
                            tspModeActive 
                                ? 'bg-yellow-400 text-yellow-950 border-yellow-500 shadow-yellow-200 ring-2 ring-yellow-400' 
                                : 'bg-white/95 text-stone-800 border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-700 shrink-0" />
                        <span>{tspModeActive ? 'Routage IA Actif' : 'Activer Routage Groupé (TSP IA)'}</span>
                    </button>

                    {/* Archived Completed Deliveries Drawer Toggle */}
                    {completedDeliveries.length > 0 && (
                        <button
                            onClick={() => setShowArchivedList(!showArchivedList)}
                            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-full shadow-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1.5 border border-stone-700"
                        >
                            <History className="w-3.5 h-3.5 text-yellow-400" />
                            <span>Historique Livrées ({completedDeliveries.length})</span>
                        </button>
                    )}
                </div>

                {/* ARCHIVED COMPLETED ORDERS FLOATING DRAWER */}
                {showArchivedList && (
                    <div className="absolute top-16 right-4 z-20 w-80 max-h-96 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl p-4 shadow-2xl overflow-y-auto space-y-3 animate-in slide-in-from-top-4 duration-150">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                                <Archive className="w-4 h-4 text-stone-500" />
                                <span>Courses terminées & archivées</span>
                            </div>
                            <button onClick={() => setShowArchivedList(false)} className="p-1 text-stone-400">✕</button>
                        </div>
                        <p className="text-[11px] text-stone-500">Cliquez sur une course pour voir son tracé archivé (en gris foncé sur la carte).</p>
                        <div className="space-y-1.5">
                            {completedDeliveries.map((ord) => (
                                <button
                                    key={ord.id}
                                    onClick={() => {
                                        setSelectedOrder(ord);
                                        setShowArchivedList(false);
                                        setTspModeActive(false);
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

                {/* BOTTOM HORIZONTAL QUICK SELECT PILLS (ONLY ACTIVE / AVAILABLE) */}
                {!selectedOrder && !tspModeActive && (
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-[calc(100%-2rem)] sm:max-w-lg w-full flex items-center gap-2 overflow-x-auto">
                        <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 shrink-0 pl-1">Missions actives :</span>
                        {displayOrders.map((ord) => (
                            <button
                                key={ord.id || ord.order_number}
                                onClick={() => setSelectedOrder(ord)}
                                className="px-2.5 sm:px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-950 font-bold text-[11px] sm:text-xs rounded-xl shrink-0 transition-colors flex items-center gap-1"
                            >
                                <MapPin className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                                <span>#{ord.order_number} (+{Number(ord.shipping_fee || 2500).toLocaleString('fr-FR')} F)</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* TSP MULTI-STOP IA DISPATCH PANEL */}
                {tspModeActive && tspRouteData && (
                    <div className="absolute sm:top-4 sm:left-4 sm:bottom-4 bottom-3 inset-x-3 sm:inset-x-auto sm:w-96 max-h-[80vh] sm:max-h-none z-20 bg-white/95 backdrop-blur-md border-2 border-yellow-400 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4 animate-in slide-in-from-left-5 duration-200">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 animate-spin" />
                                    <div>
                                        <h3 className="font-bold text-xs sm:text-sm text-stone-900">Routage Optimisé IA (TSP)</h3>
                                        <span className="text-[10px] text-yellow-800 font-bold block">Résolution du problème du voyageur de commerce</span>
                                    </div>
                                </div>
                                <button onClick={() => setTspModeActive(false)} className="p-1 text-stone-400 hover:text-stone-700">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between text-xs font-bold text-yellow-950">
                                <span>Distance totale : {tspRouteData.distanceKm} km</span>
                                <span>Durée estimée : {tspRouteData.durationMin} min</span>
                            </div>

                            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Ordre idéal des arrêts :</h4>
                            
                            <div className="space-y-2 text-xs">
                                {tspRouteData.optimizedStops.map((stop, idx) => (
                                    <div key={stop.id} className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                                stop.type === 'pickup' ? 'bg-yellow-200 text-yellow-950' : 'bg-emerald-200 text-emerald-950'
                                            }`}>
                                                Arrêt #{idx + 1} · {stop.type === 'pickup' ? 'RETRAIT' : 'LIVRAISON'}
                                            </span>
                                            <span className="font-mono text-stone-500 font-bold text-[11px]">#{stop.order_number}</span>
                                        </div>
                                        <p className="font-bold text-stone-900">{stop.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => alert("Itinéraire multi-points TSP validé ! Suivez l'ordre des arrêts sur la carte.")}
                            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500"
                        >
                            Démarrer la tournée groupée IA
                        </button>
                    </div>
                )}

                {/* FLOATING ORDER INSPECTION CARD */}
                {selectedOrder && !tspModeActive && (
                    <div className="absolute sm:top-4 sm:left-4 sm:bottom-4 bottom-3 inset-x-3 sm:inset-x-auto sm:w-96 max-h-[80vh] sm:max-h-none z-20 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4 animate-in slide-in-from-left-5 duration-200">
                        
                        <div className="space-y-3 sm:space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <Truck className={`w-5 h-5 ${isCurrentOrderFinished ? 'text-stone-500' : isCurrentOrderReturned ? 'text-rose-600' : 'text-yellow-600'} shrink-0`} />
                                    <div>
                                        <h3 className="font-bold text-xs sm:text-sm text-stone-900">Commande #{selectedOrder.order_number}</h3>
                                        <span className="text-[10px] text-stone-400 block font-mono">
                                            {isCurrentOrderFinished ? "Itinéraire archivé (Gris foncé)" : isCurrentOrderReturned ? "Itinéraire de retour vers boutique (Rouge)" : `Itinéraire OSRM : ${etaInfo.distance} (${etaInfo.duration})`}
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

                            {/* Return Notice if order is returned */}
                            {isCurrentOrderReturned && (
                                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-900">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <RotateCcw className="w-4 h-4 text-rose-600" />
                                        <span>Retour Boutique Déclenché</span>
                                    </div>
                                    <p className="text-[11px] text-rose-800 leading-snug">
                                        Le client a refusé le colis. Vos frais de course sont crédités. Restituez le colis intact à la boutique ({selectedOrder.shop?.name}).
                                    </p>
                                </div>
                            )}

                            {/* Finished Order Archive Banner */}
                            {isCurrentOrderFinished && (
                                <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl space-y-1 text-xs text-stone-700">
                                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Course clôturée avec succès</span>
                                    </div>
                                    <p className="text-[11px] text-stone-500">
                                        Cette livraison a été validée par code secret OTP et signature client. Les frais ont été crédités à votre portefeuille.
                                    </p>
                                </div>
                            )}

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
                                        <Package className="w-3 h-3 text-stone-500 shrink-0" /> Colis :
                                    </span>
                                    <strong className="text-stone-900 font-medium truncate block">{selectedOrder.package_desc || 'Électronique · 1.2 kg'}</strong>
                                </div>
                            </div>

                            {/* Vendor Information & Direct Contact */}
                            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1 text-xs">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] text-yellow-700 font-bold uppercase truncate">Point A · Boutique</span>
                                    <a
                                        href={`tel:${selectedOrder.shop?.phone || '+237670112233'}`}
                                        className="text-[10px] bg-stone-200 hover:bg-stone-300 text-stone-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1 shrink-0"
                                    >
                                        <PhoneCall className="w-2.5 h-2.5" /> Appeler Vendeur
                                    </a>
                                </div>
                                <strong className="text-stone-900 block font-bold text-xs sm:text-sm break-words">{selectedOrder.shop?.name || 'Tech & Gadgets Express'}</strong>
                                <span className="text-[11px] text-stone-500 block truncate">Tél: {selectedOrder.shop?.phone || '+237 670 11 22 33'}</span>
                            </div>

                            {/* Customer Information, Textual Landmark & Photo Preview */}
                            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2 text-xs">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] text-emerald-700 font-bold uppercase truncate">Point B · Client</span>
                                    <a
                                        href={`tel:${selectedOrder.user?.phone || '+237690000000'}`}
                                        className="text-[10px] bg-stone-200 hover:bg-stone-300 text-stone-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1 shrink-0"
                                    >
                                        <PhoneCall className="w-2.5 h-2.5" /> Appeler Client
                                    </a>
                                </div>
                                <strong className="text-stone-900 block font-bold text-xs sm:text-sm break-words">{selectedOrder.user ? `${selectedOrder.user.first_name} ${selectedOrder.user.last_name}` : 'Paul Ondobo'}</strong>
                                <span className="text-[11px] text-stone-500 block leading-snug break-words">{selectedOrder.shipping_address || 'Bastos, Rue des Ambassades, Yaoundé'}</span>

                                {/* NON-STANDARDIZED TEXTUAL LANDMARK INSTRUCTION */}
                                {selectedOrder.landmark_text && (
                                    <div className="p-2 bg-yellow-50/80 border border-yellow-200 rounded-lg text-[11px] text-yellow-950 font-normal space-y-1">
                                        <div className="flex items-center gap-1 font-bold text-yellow-800">
                                            <Compass className="w-3 h-3 text-yellow-600 shrink-0" />
                                            <span>Indication de repère terrain :</span>
                                        </div>
                                        <p className="leading-snug italic font-serif">"{selectedOrder.landmark_text}"</p>
                                    </div>
                                )}

                                {/* LANDMARK PHOTO THUMBNAIL WITH ZOOM */}
                                {selectedOrder.landmark_photo_url && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                                            <Camera className="w-3 h-3 text-stone-400" /> Photo du point de repère client :
                                        </span>
                                        <div 
                                            onClick={() => setLandmarkPhotoZoom(selectedOrder.landmark_photo_url)}
                                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-stone-200 h-24 bg-stone-200"
                                        >
                                            <img
                                                src={selectedOrder.landmark_photo_url}
                                                alt="Point de repère client"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                <Maximize2 className="w-4 h-4" />
                                                <span>Agrandir</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isCurrentOrderFinished && !isCurrentOrderReturned ? (
                            <div className="pt-3 border-t border-stone-100 space-y-2">
                                {!selectedOrder.driver_id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAcceptCourse(selectedOrder.order_number)}
                                            disabled={processing}
                                            className="flex-1 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1"
                                        >
                                            <span>Accepter la course</span>
                                            <ArrowRight className="w-4 h-4 shrink-0" />
                                        </button>
                                        <button
                                            onClick={() => setRefuseModalOrderNumber(selectedOrder.order_number)}
                                            className="px-3 py-2.5 sm:py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 shrink-0"
                                        >
                                            Refuser
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`tel:${selectedOrder.user?.phone || '+237690000000'}`}
                                                className="p-2.5 sm:p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors shrink-0"
                                                title="Appeler le client"
                                            >
                                                <PhoneCall className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => setSelectedDeliveryForOtp(selectedOrder)}
                                                className="flex-1 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                                            >
                                                <Key className="w-4 h-4 shrink-0" />
                                                <span>Valider avec OTP & Signature</span>
                                            </button>
                                        </div>

                                        {/* REPORT INCIDENT & RETURN BUTTON */}
                                        <button
                                            onClick={() => setReportIncidentOrder(selectedOrder)}
                                            className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                            <span>Signaler un litige / Refus client (Retour boutique)</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-stone-100">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200"
                                >
                                    Fermer la fiche
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

            {/* REPORT INCIDENT & RETURN MODAL (2.3.7 SPEC) */}
            {reportIncidentOrder && (
                <ReportIncidentModal
                    order={reportIncidentOrder}
                    onClose={() => setReportIncidentOrder(null)}
                />
            )}

        </DriverLayout>
    );
}
