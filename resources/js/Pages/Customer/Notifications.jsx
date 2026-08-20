import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    Bell, 
    CheckCircle2, 
    ShoppingBag, 
    Truck, 
    Tag, 
    ExternalLink, 
    CheckCheck,
    Clock
} from 'lucide-react';

export default function Notifications({ notifications = [] }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const { post, processing } = useForm();

    const handleMarkAllRead = () => {
        post(route('customer.notifications.read'));
    };

    const filteredNotifs = notifications.filter(n => {
        if (activeFilter === 'unread') return !n.is_read;
        if (activeFilter === 'orders') return n.type === 'order' || n.type === 'delivery';
        if (activeFilter === 'promos') return n.type === 'promo';
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'delivery':
                return <Truck className="w-4 h-4 text-blue-600" />;
            case 'promo':
                return <Tag className="w-4 h-4 text-yellow-600" />;
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            default:
                return <ShoppingBag className="w-4 h-4 text-yellow-600" />;
        }
    };

    return (
        <CustomerLayout title="Mes notifications">
            <Head title="Mes notifications - Sellify" />

            <div className="w-full space-y-6 text-stone-800 font-sans pb-16 antialiased">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Bell className="w-4 h-4 text-yellow-600" />
                            <span>Centre de notifications</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Mes notifications & alertes
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Suivez l'avancement de vos commandes sous séquestre Escrow et les offres promotionnelles en temps réel.
                        </p>
                    </div>

                    <button
                        onClick={handleMarkAllRead}
                        disabled={processing}
                        className="px-4 py-2.5 bg-stone-100 hover:bg-yellow-400 hover:text-stone-950 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                    >
                        <CheckCheck className="w-4 h-4" />
                        <span>Tout marquer comme lu</span>
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                        { id: 'all', label: 'Toutes les notifications' },
                        { id: 'unread', label: 'Non lues' },
                        { id: 'orders', label: 'Commandes & livraisons' },
                        { id: 'promos', label: 'Offres & réductions' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                                activeFilter === tab.id
                                    ? 'bg-yellow-400 text-yellow-950 shadow-2xs border border-yellow-500'
                                    : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/80'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {filteredNotifs.length > 0 ? (
                    <div className="space-y-3">
                        {filteredNotifs.map((item) => (
                            <div 
                                key={item.id}
                                className={`bg-white border rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                                    !item.is_read ? 'border-yellow-300 bg-yellow-50/20' : 'border-stone-200/80'
                                }`}
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-sm text-stone-900">{item.title}</h3>
                                            {!item.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"></span>
                                            )}
                                        </div>
                                        <p className="text-xs text-stone-600 leading-relaxed font-normal">{item.message}</p>
                                        <span className="text-[11px] text-stone-400 font-normal flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{item.date}</span>
                                        </span>
                                    </div>
                                </div>

                                {item.link && (
                                    <Link
                                        href={item.link}
                                        className="px-3.5 py-2 bg-stone-100 hover:bg-yellow-400 hover:text-stone-950 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
                                    >
                                        <span>Consulter</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400 space-y-3 shadow-2xs">
                        <Bell className="w-10 h-10 text-stone-300 mx-auto" />
                        <p className="text-sm font-semibold text-stone-700">Aucune notification trouvée</p>
                        <p className="text-xs text-stone-400">Vous serez averti ici dès qu'une activité aura lieu sur vos commandes.</p>
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
}
