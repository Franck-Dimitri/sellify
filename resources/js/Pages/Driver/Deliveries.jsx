import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import DeliveryOtpVerificationModal from '@/Components/DeliveryOtpVerificationModal';
import ReportIncidentModal from '@/Components/ReportIncidentModal';
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
    UserCheck,
    Wallet,
    Star,
    PhoneCall,
    Check,
    Archive,
    PenTool,
    AlertTriangle,
    RotateCcw
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute } from '@/Services/RoutingService';

export default function Deliveries({ driver = {}, deliveries = { data: [] }, filters = {} }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayerRef = useRef(null);
    const routeLayerRef = useRef(null);

    const [tab, setTab] = useState(filters.tab || 'all');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState(null);
    const [reportIncidentOrder, setReportIncidentOrder] = useState(null);
    const [previewDelivery, setPreviewDelivery] = useState(deliveries.data?.[0] || null);
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

    // Initialize Map ONCE on mount
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            center: [3.8650, 11.5150],
            zoom: 13,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

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

    // Update Preview Map Markers & Route without destroying the map
    useEffect(() => {
        const map = mapInstance.current;
        const markersLayer = markersLayerRef.current;
        const routeLayer = routeLayerRef.current;

        if (!map || !markersLayer || !routeLayer || !previewDelivery) return;

        markersLayer.clearLayers();
        routeLayer.clearLayers();

        const pShop = [previewDelivery.shop?.lat || 3.8780, previewDelivery.shop?.lng || 11.5121];
        const pCustomer = [previewDelivery.lat || 3.8650, previewDelivery.lng || 11.5250];

        const isFinished = previewDelivery.delivery_status === 'delivered';
        const isReturned = previewDelivery.delivery_status === 'returned_to_shop';
        const polylineColor = isReturned ? '#e11d48' : isFinished ? '#57534e' : '#eab308';

        // Shop Marker
        const shopHtml = `
            <div style="background: #ffffff; color: #1c1917; padding: 6px 12px; border-radius: 14px; border: 2px solid #eab308; box-shadow: 0 4px 14px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
                <span>${previewDelivery.shop?.name || 'Boutique'}</span>
            </div>
        `;
        L.marker(pShop, { icon: L.divIcon({ className: 'p-shop', html: shopHtml, iconSize: [150, 32], iconAnchor: [75, 16] }) }).addTo(markersLayer);

        // Customer Marker
        const custColor = isFinished ? '#57534e' : isReturned ? '#e11d48' : '#10b981';
        const customerHtml = `
            <div style="background: ${custColor}; color: #ffffff; padding: 6px 12px; border-radius: 14px; border: 2px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${previewDelivery.user?.first_name || 'Client'}</span>
            </div>
        `;
        L.marker(pCustomer, { icon: L.divIcon({ className: 'p-cust', html: customerHtml, iconSize: [150, 32], iconAnchor: [75, 16] }) }).addTo(markersLayer);

        fetchOSRMRoute(pShop[0], pShop[1], pCustomer[0], pCustomer[1]).then((res) => {
            if (res.coordinates && routeLayerRef.current) {
                routeLayerRef.current.clearLayers();
                L.polyline(res.coordinates, {
                    color: polylineColor,
                    weight: isFinished ? 5 : 6,
                    opacity: isFinished ? 0.75 : 0.95,
                    dashArray: (isFinished || isReturned) ? '4, 6' : undefined
                }).addTo(routeLayerRef.current);

                setRouteStats({
                    distance: `${res.distanceKm} km`,
                    duration: `${res.durationMin} min`
                });
            }
        });
    }, [previewDelivery?.id, previewDelivery?.order_number, previewDelivery?.delivery_status]);

    return (
        <DriverLayout title="Gestion des courses & livraisons">
            <Head title="Livraisons & Courses - Sellify Express" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Truck className="w-4 h-4 text-yellow-600" />
                            <span>Statistiques & détails des courses de livraison</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Livraisons & suivi d'activités
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Consultez l'historique complet de vos courses, filtrez par statut et clôturez avec code OTP & signature client.
                        </p>
                    </div>
                </div>

                {/* 4 STAT KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Total missions</span>
                        <p className="text-2xl font-bold text-stone-900">{deliveries.total || deliveries.data?.length || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Toutes les courses</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Courses en cours</span>
                        <p className="text-2xl font-bold text-yellow-700">
                            {deliveries.data?.filter(d => d.delivery_status === 'in_transit').length || 0}
                        </p>
                        <span className="text-[11px] text-stone-400 font-normal">Acheminement actif</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Livrées avec OTP</span>
                        <p className="text-2xl font-bold text-emerald-600">{driver.total_deliveries || 0}</p>
                        <span className="text-[11px] text-stone-400 font-normal">Clôturées avec succès</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                        <span className="text-xs font-semibold text-stone-500">Taux de ponctualité</span>
                        <p className="text-2xl font-bold text-amber-600">99.2%</p>
                        <span className="text-[11px] text-stone-400 font-normal">Livraisons à l'heure</span>
                    </div>
                </div>

                {/* TRIP PREVIEW MAP & DETAILS PANEL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Leaflet Map Preview (2 cols) */}
                    <div className="lg:col-span-2 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs relative min-h-[360px] flex flex-col justify-between">
                        <div ref={mapRef} className="absolute inset-0 z-0" />

                        {/* Top Distance / ETA Floating Badge */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-stone-200 px-5 py-2 rounded-full shadow-md flex items-center gap-3 text-xs font-bold text-stone-900">
                            <span className="text-yellow-600 font-extrabold">{routeStats.distance}</span>
                            <span className="text-stone-400">·</span>
                            <span>{routeStats.duration} de trajet estimé</span>
                            {previewDelivery?.delivery_status === 'delivered' && (
                                <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    Itinéraire Archivé (Gris foncé)
                                </span>
                            )}
                            {previewDelivery?.delivery_status === 'returned_to_shop' && (
                                <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    Retour Boutique (Rouge)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* DISPATCH SHEET CARD */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                <h3 className="font-bold text-sm text-stone-900">Fiche de la course sélectionnée</h3>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                    previewDelivery?.delivery_status === 'delivered' 
                                        ? 'bg-stone-200 text-stone-800' 
                                        : previewDelivery?.delivery_status === 'returned_to_shop'
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-yellow-100 text-yellow-950'
                                }`}>
                                    +{Number(previewDelivery?.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                                </span>
                            </div>

                            {previewDelivery ? (
                                <div className="space-y-3 text-xs text-stone-700 font-normal">
                                    <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                                        <span className="text-stone-400 block font-normal">Numéro de commande :</span>
                                        <strong className="text-stone-900 font-mono text-sm">#{previewDelivery.order_number}</strong>
                                    </div>

                                    {/* Timeline Address */}
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

                                    {previewDelivery.delivery_status === 'delivered' ? (
                                        <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl space-y-1">
                                            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Livrée & Clôturée avec OTP + Signature</span>
                                            </div>
                                            <span className="text-[11px] text-stone-500 block">Frais encaissés et Escrow débloqué.</span>
                                        </div>
                                    ) : previewDelivery.delivery_status === 'returned_to_shop' ? (
                                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
                                            <div className="flex items-center gap-1.5 font-bold">
                                                <RotateCcw className="w-4 h-4 text-rose-600" />
                                                <span>Retour boutique en cours (Refus client)</span>
                                            </div>
                                            <span className="text-[11px] text-rose-800 block">Vos frais de livraison vous sont crédités. Restituez le colis au vendeur.</span>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
                                            <span className="font-semibold text-yellow-950">Statut :</span>
                                            <span className="font-bold text-yellow-800 uppercase text-[11px]">{previewDelivery.delivery_status}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400">Sélectionnez une livraison dans la liste ci-dessous.</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {previewDelivery && (
                            <div className="pt-3 border-t border-stone-100 space-y-2">
                                {previewDelivery.delivery_status === 'in_transit' && (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('driver.map', { order: previewDelivery.order_number })}
                                                className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1 border border-yellow-500"
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                <span>Suivre sur la Map</span>
                                            </Link>
                                            <button
                                                onClick={() => setSelectedDeliveryForOtp(previewDelivery)}
                                                className="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1"
                                            >
                                                <Key className="w-3.5 h-3.5" />
                                                <span>Clôturer OTP</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setReportIncidentOrder(previewDelivery)}
                                            className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                            <span>Signaler un litige / Refus</span>
                                        </button>
                                    </div>
                                )}

                                {previewDelivery.delivery_status === 'delivered' && (
                                    <Link
                                        href={route('driver.map', { order: previewDelivery.order_number })}
                                        className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-stone-200"
                                    >
                                        <Archive className="w-3.5 h-3.5 text-stone-500" />
                                        <span>Revoir l'itinéraire sur la map (Archive)</span>
                                    </Link>
                                )}

                                {previewDelivery.delivery_status !== 'in_transit' && previewDelivery.delivery_status !== 'delivered' && (
                                    <button
                                        onClick={() => handleAccept(previewDelivery.order_number)}
                                        disabled={processing}
                                        className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1 border border-yellow-500"
                                    >
                                        <span>Accepter la course</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* FILTER TABS & SEARCH ROW */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto bg-stone-100 p-1 rounded-xl">
                            <button
                                onClick={() => handleTabChange('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                                    tab === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Toutes les courses
                            </button>
                            <button
                                onClick={() => handleTabChange('active')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                                    tab === 'active' ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs border border-yellow-500' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                En cours (Actives)
                            </button>
                            <button
                                onClick={() => handleTabChange('available')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                                    tab === 'available' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Disponibles (Prêtes)
                            </button>
                            <button
                                onClick={() => handleTabChange('completed')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                                    tab === 'completed' ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                Livrées (Terminées)
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher #numéro, client..."
                                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </form>
                    </div>

                    {/* Deliveries Table */}
                    <div className="overflow-x-auto rounded-xl border border-stone-200/80">
                        <table className="w-full text-left text-xs text-stone-600 min-w-[650px]">
                            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200/80">
                                <tr>
                                    <th className="py-3 px-4">Commande</th>
                                    <th className="py-3 px-4">Boutique</th>
                                    <th className="py-3 px-4">Client & Destination</th>
                                    <th className="py-3 px-4">Frais Livreur</th>
                                    <th className="py-3 px-4">Statut & Clôture</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {deliveries.data && deliveries.data.length > 0 ? (
                                    deliveries.data.map((del) => (
                                        <tr 
                                            key={del.id}
                                            onClick={() => setPreviewDelivery(del)}
                                            className={`hover:bg-yellow-50/40 cursor-pointer transition-colors ${
                                                previewDelivery?.id === del.id ? 'bg-yellow-50/60 font-semibold' : ''
                                            }`}
                                        >
                                            <td className="py-3 px-4 font-mono font-bold text-stone-900">#{del.order_number}</td>
                                            <td className="py-3 px-4 font-medium text-stone-800">{del.shop?.name || 'Boutique'}</td>
                                            <td className="py-3 px-4">
                                                <span className="font-bold text-stone-900 block">{del.user?.first_name} {del.user?.last_name}</span>
                                                <span className="text-[11px] text-stone-400 block truncate max-w-xs">{del.shipping_address}</span>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-emerald-600">
                                                +{Number(del.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA
                                            </td>
                                            <td className="py-3 px-4">
                                                {del.delivery_status === 'delivered' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                        <span>Livrée (OTP + Sign)</span>
                                                    </span>
                                                ) : del.delivery_status === 'returned_to_shop' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                                        <RotateCcw className="w-3 h-3" />
                                                        <span>Retour Boutique</span>
                                                    </span>
                                                ) : del.delivery_status === 'in_transit' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-950 border border-yellow-300">
                                                        <Truck className="w-3 h-3 text-yellow-700" />
                                                        <span>En cours</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                                        <span>Disponible</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {del.delivery_status === 'in_transit' ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDeliveryForOtp(del);
                                                            }}
                                                            className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-lg text-xs border border-yellow-500 shadow-2xs"
                                                        >
                                                            OTP
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setReportIncidentOrder(del);
                                                            }}
                                                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs border border-rose-200"
                                                        >
                                                            Litige
                                                        </button>
                                                    </div>
                                                ) : del.delivery_status === 'delivered' ? (
                                                    <Link
                                                        href={route('driver.map', { order: del.order_number })}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs inline-flex items-center gap-1 border border-stone-200"
                                                    >
                                                        <span>Map (Archive)</span>
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAccept(del.order_number);
                                                        }}
                                                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-lg text-xs border border-yellow-500 shadow-2xs"
                                                    >
                                                        Accepter
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-stone-400 text-xs">
                                            Aucune course trouvée pour ce filtre.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* DOUBLE SECURITY OTP & DIGITAL SIGNATURE VERIFICATION MODAL */}
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
