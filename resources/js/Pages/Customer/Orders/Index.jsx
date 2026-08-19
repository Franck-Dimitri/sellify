import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    Package, 
    ShieldCheck, 
    Truck, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Eye, 
    Store, 
    Key, 
    AlertTriangle,
    Search,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

export default function Index({ orders = { data: [] } }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const statusBadge = (status) => {
        const map = {
            pending: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
            preparing: { label: 'En préparation', bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            ready_for_pickup: { label: 'Prêt pour livraison', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            in_transit: { label: 'En cours de livraison', bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            delivered: { label: 'Livré & Validé', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            cancelled: { label: 'Annulé', bg: 'bg-rose-50 text-rose-900 border-rose-200' },
        };
        const conf = map[status] || { label: status, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.bg}`}>
                {conf.label}
            </span>
        );
    };

    const filteredOrders = orders.data.filter((order) => {
        const matchSearch = searchTerm === '' || 
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = selectedStatus === 'all' || order.delivery_status === selectedStatus;
        return matchSearch && matchStatus;
    });

    return (
        <CustomerLayout title="Mes Commandes">
            <Head title="Mes Commandes - Sellify" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-yellow-700 uppercase tracking-wide">
                            <Package className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Achats & Suivi de Livraison</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900 mt-1">
                            Mes Commandes en Ligne
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Retrouvez vos achats, obtenez votre code OTP de livraison et gérez la libération des fonds Escrow.
                        </p>
                    </div>

                    <Link
                        href={route('public.products.index')}
                        className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                        <span>Continuer mes achats</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white border border-stone-200 p-3.5 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div className="relative sm:col-span-2">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par N° de commande ou boutique..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-800 transition-colors"
                            />
                        </div>

                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="preparing">En préparation</option>
                                <option value="ready_for_pickup">Prêt pour livraison</option>
                                <option value="in_transit">En cours de livraison</option>
                                <option value="delivered">Livrées & Validées</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-yellow-400 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 text-xs">
                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href={route('customer.orders.show', order.order_number)}
                                            className="font-mono font-semibold text-stone-900 hover:text-yellow-700 hover:underline text-sm"
                                        >
                                            {order.order_number}
                                        </Link>
                                        <span className="text-stone-300">•</span>
                                        <span className="text-stone-600 font-medium flex items-center gap-1">
                                            <Store className="w-3.5 h-3.5 text-stone-400" />
                                            <span>{order.shop?.name}</span>
                                        </span>
                                        <span className="text-stone-300">•</span>
                                        <span className="text-stone-400">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {statusBadge(order.delivery_status)}
                                    </div>
                                </div>

                                {/* Items & Pricing */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    <div className="md:col-span-6 space-y-1 text-xs">
                                        {order.items?.map((item) => (
                                            <p key={item.id} className="text-stone-700">
                                                <span className="font-medium text-stone-900">{item.quantity}x</span> {item.product_name}
                                                <span className="text-stone-400 text-[11px] ml-1">({Number(item.unit_price).toLocaleString('fr-FR')} FCFA)</span>
                                            </p>
                                        ))}
                                    </div>

                                    {/* OTP Banner */}
                                    <div className="md:col-span-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 text-center">
                                        <span className="text-[10px] text-yellow-900 uppercase font-semibold block">Code Secret OTP :</span>
                                        <span className="font-mono text-base font-bold text-stone-950 tracking-wider">
                                            {order.delivery_otp || '------'}
                                        </span>
                                    </div>

                                    {/* Total & Action */}
                                    <div className="md:col-span-3 flex flex-col sm:items-end justify-center space-y-1.5">
                                        <p className="text-sm font-semibold text-stone-900">
                                            {Number(order.total_amount).toLocaleString('fr-FR')} FCFA
                                        </p>
                                        <Link
                                            href={route('customer.orders.show', order.order_number)}
                                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            <span>Détails & Suivi</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-400 space-y-3">
                            <Package className="w-10 h-10 text-stone-300 mx-auto" />
                            <p className="text-xs font-medium text-stone-700">Aucune commande trouvée</p>
                            <p className="text-[11px] text-stone-400">Vos commandes apparaîtront ici dès que vous validerez un panier ou un Smart-Link.</p>
                        </div>
                    )}
                </div>

            </div>
        </CustomerLayout>
    );
}
