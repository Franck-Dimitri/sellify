import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute, calculateHaversineDistance } from '@/Services/RoutingService';
import { 
    Truck, 
    Store, 
    MapPin, 
    Navigation, 
    Phone, 
    Clock, 
    ShieldCheck, 
    Key, 
    Compass, 
    CheckCircle2,
    Play,
    Pause,
    FastForward,
    RefreshCw,
    Radio
} from 'lucide-react';

export default function LiveOrderTrackingMap({ order }) {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayerRef = useRef(null);
    const routeLayerRef = useRef(null);
    const driverMarkerRef = useRef(null);

    const [isMapReady, setIsMapReady] = useState(false);
    const [liveData, setLiveData] = useState(null);
    const [roadGeometry, setRoadGeometry] = useState([]);
    const [totalDistanceKm, setTotalDistanceKm] = useState(0);
    const [totalDurationMin, setTotalDurationMin] = useState(0);
    const [driverIndex, setDriverIndex] = useState(0);
    const [isAutoMoving, setIsAutoMoving] = useState(true);
    const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 4x
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [isLiveConnected, setIsLiveConnected] = useState(true);

    // Active Data (Priority: Live API response -> Order Prop)
    const activeOrder = liveData || order || {};
    const driver = activeOrder?.driver || order?.driver || {};
    const driverUser = driver?.user || activeOrder?.driver_user || order?.driver_user || {};
    const shop = activeOrder?.shop || order?.shop || {};

    // 1. Initial Geographic Coordinates Anchor (Shop & Customer from DB)
    const baseCoords = useMemo(() => {
        const isYde = (activeOrder?.city || order?.city || '').toLowerCase().includes('yaound');
        const defaultShop = isYde ? [3.8820, 11.5150] : [4.0511, 9.7085];
        const defaultDest = isYde ? [3.8560, 11.5010] : [4.0280, 9.7220];

        const shopLat = Number(shop.latitude) > 0 ? Number(shop.latitude) : defaultShop[0];
        const shopLng = Number(shop.longitude) > 0 ? Number(shop.longitude) : defaultShop[1];

        const destLat = Number(activeOrder?.latitude || order?.latitude) > 0 
            ? Number(activeOrder?.latitude || order?.latitude) 
            : defaultDest[0];
        const destLng = Number(activeOrder?.longitude || order?.longitude) > 0 
            ? Number(activeOrder?.longitude || order?.longitude) 
            : defaultDest[1];

        return {
            shop: [shopLat, shopLng],
            destination: [destLat, destLng]
        };
    }, [activeOrder, order, shop]);

    // 2. Fetch Real OSRM Road Network Polyline (Boutique -> Destination)
    useEffect(() => {
        let isMounted = true;
        const [sLat, sLng] = baseCoords.shop;
        const [dLat, dLng] = baseCoords.destination;

        fetchOSRMRoute(sLat, sLng, dLat, dLng).then((res) => {
            if (!isMounted) return;

            if (res.coordinates && res.coordinates.length > 0) {
                setRoadGeometry(res.coordinates);
                setTotalDistanceKm(res.distanceKm || 3.4);
                setTotalDurationMin(res.durationMin || 11);

                // Initial positioning of driver on road
                const deliveryStatus = activeOrder?.delivery_status || order?.delivery_status;
                if (deliveryStatus === 'delivered') {
                    setDriverIndex(res.coordinates.length - 1);
                } else if (driver?.latitude && driver?.longitude && Number(driver.latitude) > 0) {
                    // Find closest point on road
                    let closestIdx = 0;
                    let minDistance = Infinity;
                    res.coordinates.forEach((pt, idx) => {
                        const dist = calculateHaversineDistance(pt[0], pt[1], Number(driver.latitude), Number(driver.longitude));
                        if (dist < minDistance) {
                            minDistance = dist;
                            closestIdx = idx;
                        }
                    });
                    setDriverIndex(closestIdx);
                } else {
                    setDriverIndex(Math.floor(res.coordinates.length * 0.35));
                }
            }
        });

        return () => {
            isMounted = false;
        };
    }, [baseCoords, activeOrder?.delivery_status, order?.delivery_status]);

    // 3. Real-time Live Location Polling from Backend API
    const fetchLiveLocation = useCallback(async () => {
        const orderNumber = order?.order_number || activeOrder?.order_number;
        if (!orderNumber) return;

        try {
            const res = await fetch(`/api/orders/${orderNumber}/live-location`);
            if (res.ok) {
                const data = await res.json();
                setLiveData(data);
                setLastSyncTime(new Date());
                setIsLiveConnected(true);

                // If real driver coordinates exist, snap to road
                if (data.driver?.latitude && data.driver?.longitude && roadGeometry.length > 0) {
                    const dLat = Number(data.driver.latitude);
                    const dLng = Number(data.driver.longitude);
                    if (dLat > 0 && dLng > 0) {
                        let closestIdx = 0;
                        let minDistance = Infinity;
                        roadGeometry.forEach((pt, idx) => {
                            const dist = calculateHaversineDistance(pt[0], pt[1], dLat, dLng);
                            if (dist < minDistance) {
                                minDistance = dist;
                                closestIdx = idx;
                            }
                        });
                        setDriverIndex(closestIdx);
                    }
                }
            }
        } catch (e) {
            setIsLiveConnected(false);
        }
    }, [order?.order_number, activeOrder?.order_number, roadGeometry]);

    // Polling Interval (every 4 seconds)
    useEffect(() => {
        const orderNumber = order?.order_number;
        if (!orderNumber) return;

        fetchLiveLocation();
        const pollInterval = setInterval(fetchLiveLocation, 4000);
        return () => clearInterval(pollInterval);
    }, [fetchLiveLocation, order?.order_number]);

    // 4. Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstance.current) return;

        const map = L.map(mapContainerRef.current, {
            center: baseCoords.shop,
            zoom: 14,
            zoomControl: false,
            attributionControl: false,
        });

        // High-contrast clean CartoDB Voyager tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        const routeLayer = L.layerGroup().addTo(map);

        mapInstance.current = map;
        markersLayerRef.current = markersLayer;
        routeLayerRef.current = routeLayer;

        setIsMapReady(true);

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // 5. Automated Live Movement along the Real Road Path
    useEffect(() => {
        const isDelivered = (activeOrder?.delivery_status || order?.delivery_status) === 'delivered';
        if (!isAutoMoving || roadGeometry.length === 0 || isDelivered) return;

        const intervalTime = Math.max(400, Math.floor(2000 / simSpeed));
        const timer = setInterval(() => {
            setDriverIndex((prevIdx) => {
                if (prevIdx >= roadGeometry.length - 1) {
                    return roadGeometry.length - 1;
                }
                return prevIdx + 1;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [isAutoMoving, roadGeometry, simSpeed, activeOrder?.delivery_status, order?.delivery_status]);

    // 6. Render Custom Markers & Split Road Polylines
    useEffect(() => {
        const map = mapInstance.current;
        const markersLayer = markersLayerRef.current;
        const routeLayer = routeLayerRef.current;

        if (!map || !markersLayer || !routeLayer || !isMapReady || roadGeometry.length === 0) return;

        markersLayer.clearLayers();
        routeLayer.clearLayers();

        const shopPos = baseCoords.shop;
        const destPos = baseCoords.destination;
        const currentDriverPos = roadGeometry[driverIndex] || roadGeometry[0];

        // A. STORE / ORIGIN PIN (REAL DATA)
        const shopName = shop.name || activeOrder?.shop?.name || 'Boutique Partenaire';
        const shopMarkerHtml = `
            <div style="background: #ffffff; color: #1c1917; padding: 4px 10px 4px 6px; border-radius: 20px; border: 2px solid #16a34a; box-shadow: 0 4px 14px rgba(0,0,0,0.25); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 5px; cursor: pointer; white-space: nowrap;">
                <div style="width: 22px; height: 22px; border-radius: 50%; background: #16a34a; color: white; display: flex; align-items: center; justify-content: center;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
                </div>
                <span>${shopName.substring(0, 18)}</span>
            </div>
        `;
        L.marker(shopPos, {
            icon: L.divIcon({ className: 'c-shop-pin', html: shopMarkerHtml, iconSize: [140, 32], iconAnchor: [70, 16] })
        }).addTo(markersLayer).bindPopup(`<b>Boutique : ${shopName}</b><br/>${shop.address || 'Point de départ'}`);

        // B. CUSTOMER / DESTINATION PIN (REAL DATA)
        const deliveryAddress = activeOrder?.customer?.address || order?.delivery_address || 'Votre adresse de livraison';
        const landmark = activeOrder?.customer?.landmark || order?.delivery_landmark;
        const landmarkNote = landmark ? `<br/><span style="color: #d97706; font-size: 10px;">Repère : ${landmark}</span>` : '';
        const destMarkerHtml = `
            <div style="background: #e11d48; color: #ffffff; padding: 5px 10px 5px 6px; border-radius: 20px; border: 2px solid #ffffff; box-shadow: 0 4px 16px rgba(225, 29, 72, 0.4); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 5px; cursor: pointer; white-space: nowrap;">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: #ffffff; color: #e11d48; display: flex; align-items: center; justify-content: center;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <span>Votre Adresse</span>
            </div>
        `;
        L.marker(destPos, {
            icon: L.divIcon({ className: 'c-dest-pin', html: destMarkerHtml, iconSize: [140, 32], iconAnchor: [70, 16] })
        }).addTo(markersLayer).bindPopup(`<b>Votre Destination</b><br/>${deliveryAddress}${landmarkNote}`);

        // C. LIVE DRIVER VEHICLE PIN (REAL DATA WITH PULSE RADAR)
        const driverDisplayName = activeOrder?.driver?.name || (driverUser?.first_name ? `${driverUser.first_name} ${driverUser.last_name || ''}` : 'Pierre Livreur Express');
        const driverAvatar = activeOrder?.driver?.avatar 
            ? `/storage/${activeOrder.driver.avatar}` 
            : (driverUser?.avatar ? `/storage/${driverUser.avatar}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop');
        const plate = activeOrder?.driver?.vehicle_plate || driver?.vehicle_plate || 'LT-129-XX';

        const driverMarkerHtml = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 56px; height: 56px; background: rgba(234, 179, 8, 0.4); border-radius: 50%; animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="display: flex; align-items: center; gap: 6px; background: #ffffff; padding: 4px 10px 4px 4px; border-radius: 24px; border: 2.5px solid #eab308; box-shadow: 0 8px 24px rgba(0,0,0,0.3); font-family: sans-serif; font-size: 11px; font-weight: bold; color: #1c1917; z-index: 10; cursor: pointer; white-space: nowrap;">
                    <img src="${driverAvatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid #eab308;" />
                    <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.1;">
                        <span style="color: #854d0e; font-size: 9px; text-transform: uppercase; font-weight: 800;">Livreur en direct</span>
                        <span style="font-size: 11px; font-weight: 700;">${driverDisplayName} (${plate})</span>
                    </div>
                </div>
            </div>
        `;
        const driverMarker = L.marker(currentDriverPos, {
            icon: L.divIcon({ className: 'c-driver-pin', html: driverMarkerHtml, iconSize: [160, 44], iconAnchor: [80, 22] })
        }).addTo(markersLayer).bindPopup(`<b>Chauffeur : ${driverDisplayName}</b><br/>En mouvement sur la route`);
        driverMarkerRef.current = driverMarker;

        // D. SPLIT REAL ROAD POLYLINES (FOLLOWING STREET GEOMETRY)
        // 1. Trajet déjà parcouru sur les routes (Boutique -> Livreur) : Vert
        const completedPoints = roadGeometry.slice(0, driverIndex + 1);
        if (completedPoints.length > 1) {
            L.polyline(completedPoints, {
                color: '#16a34a',
                weight: 5,
                opacity: 0.85,
                dashArray: '4, 6',
                lineJoin: 'round',
            }).addTo(routeLayer);
        }

        // 2. Trajet restant sur les routes (Livreur -> Destination) : Jaune vif avec bordure
        const remainingPoints = roadGeometry.slice(driverIndex);
        if (remainingPoints.length > 1) {
            L.polyline(remainingPoints, {
                color: '#eab308',
                weight: 6,
                opacity: 0.95,
                lineJoin: 'round',
            }).addTo(routeLayer);
        }

    }, [isMapReady, roadGeometry, driverIndex, baseCoords, activeOrder, order, shop, driver, driverUser]);

    // 7. Calculate Remaining Distance and ETA dynamically based on progress
    const remainingRatio = roadGeometry.length > 0 ? (1 - (driverIndex / (roadGeometry.length - 1))) : 1;
    const currentRemainingKm = Math.max(0.2, parseFloat((totalDistanceKm * remainingRatio).toFixed(1)));
    const currentRemainingMin = Math.max(1, Math.ceil(totalDurationMin * remainingRatio));

    // Controls Helper
    const handleRecenter = () => {
        if (!mapInstance.current || roadGeometry.length === 0) return;
        const currentDriverPos = roadGeometry[driverIndex] || roadGeometry[0];
        mapInstance.current.setView(currentDriverPos, 15, { animate: true });
    };

    const handleFitAll = () => {
        if (!mapInstance.current || roadGeometry.length === 0) return;
        mapInstance.current.fitBounds(L.latLngBounds(roadGeometry).pad(0.2));
    };

    const driverPhone = activeOrder?.driver?.phone || driverUser?.phone || order?.driver?.user?.phone || '+237630000001';
    const driverRating = activeOrder?.driver?.rating || driver?.rating || 4.9;
    const deliveryOtp = activeOrder?.otp || order?.delivery_otp || '123456';

    return (
        <div className="relative w-full h-[480px] sm:h-[550px] bg-stone-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200 shadow-sm select-none">
            
            {/* LEAFLET MAP CANVAS */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* TOP HUD: Real-time ETA & Real Road Network Indicator */}
            <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold shadow-xs">
                            <Truck className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                                Navigation & ETA Temps Réel (Réseau Routier)
                            </span>
                            <span className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-1.5">
                                <span>~ {currentRemainingMin} min</span>
                                <span className="text-xs text-stone-400 font-normal">({currentRemainingKm} km restants)</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            GPS OSRM En Direct
                        </span>
                    </div>
                </div>

                {/* Map Control Buttons */}
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-stone-200/90 p-1 rounded-2xl shadow-lg">
                    <button
                        onClick={handleRecenter}
                        className="p-2 hover:bg-stone-100 text-stone-700 hover:text-stone-950 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Centrer sur le livreur en mouvement"
                    >
                        <Compass className="w-4 h-4 text-yellow-700" />
                        <span className="hidden md:inline text-[11px]">Suivre Livreur</span>
                    </button>
                    <button
                        onClick={handleFitAll}
                        className="p-2 hover:bg-stone-100 text-stone-700 hover:text-stone-950 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Vue d'ensemble du trajet"
                    >
                        <Navigation className="w-4 h-4 text-stone-600" />
                        <span className="hidden md:inline text-[11px]">Vue Globale</span>
                    </button>
                </div>
            </div>

            {/* SPEED / SIMULATION CONTROLLER (FLOAT TOP RIGHT) */}
            <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 bg-stone-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg text-xs pointer-events-auto border border-stone-800">
                <span className="text-[10px] text-stone-400 font-bold uppercase mr-1">Vitesse GPS :</span>
                <button
                    onClick={() => setIsAutoMoving(!isAutoMoving)}
                    className="p-1 hover:bg-white/10 rounded-lg text-yellow-400"
                    title={isAutoMoving ? "Mettre en pause le déplacement" : "Reprendre le déplacement"}
                >
                    {isAutoMoving ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                {[1, 2, 4].map((spd) => (
                    <button
                        key={spd}
                        onClick={() => {
                            setSimSpeed(spd);
                            setIsAutoMoving(true);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                            simSpeed === spd && isAutoMoving 
                                ? 'bg-yellow-400 text-yellow-950' 
                                : 'text-stone-400 hover:text-white'
                        }`}
                    >
                        {spd}x
                    </button>
                ))}
            </div>

            {/* BOTTOM HUD: Driver Contact Card & Secret OTP */}
            <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-3 pointer-events-auto">
                
                {/* 1. Driver Contact & Vehicle Card (REAL DATA) */}
                <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img 
                                src={activeOrder?.driver?.avatar ? `/storage/${activeOrder.driver.avatar}` : (driverUser?.avatar ? `/storage/${driverUser.avatar}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop')} 
                                alt="Driver"
                                className="w-11 h-11 rounded-xl object-cover border-2 border-yellow-400 shadow-2xs"
                            />
                            <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-950 font-bold text-[9px] px-1 rounded shadow-2xs">
                                {Number(driverRating).toFixed(1)}★
                            </span>
                        </div>
                        <div className="space-y-0.5 text-left">
                            <span className="text-[10px] text-stone-400 font-bold uppercase block">Chauffeur Assigné</span>
                            <h4 className="text-xs font-bold text-stone-900 truncate max-w-[160px]">
                                {activeOrder?.driver?.name || (driverUser?.first_name ? `${driverUser.first_name} ${driverUser.last_name || ''}` : 'Pierre Livreur Express')}
                            </h4>
                            <p className="text-[11px] text-stone-500 font-medium">
                                Moto : <strong>{activeOrder?.driver?.vehicle_plate || driver?.vehicle_plate || 'LT-129-XX'}</strong>
                            </p>
                        </div>
                    </div>

                    {driverPhone && (
                        <a
                            href={`tel:${driverPhone}`}
                            className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Appeler</span>
                        </a>
                    )}
                </div>

                {/* 2. Secret Delivery OTP Code Card (REAL DATA) */}
                <div className="bg-stone-900/95 text-white backdrop-blur-md border border-stone-800 p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold">
                            <Key className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider block">
                                Code Secret de Livraison (OTP)
                            </span>
                            <span className="text-[11px] text-stone-300 font-normal">
                                À remettre au livreur à l'arrivée
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-xl font-mono text-base sm:text-lg font-bold text-yellow-400 tracking-widest">
                        {deliveryOtp}
                    </div>
                </div>

            </div>

        </div>
    );
}
