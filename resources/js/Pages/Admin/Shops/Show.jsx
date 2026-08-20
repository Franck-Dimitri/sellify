import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    Store, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    CheckCircle2, 
    XCircle, 
    ShoppingBag, 
    Package, 
    Sun,
    Calendar,
    Eye
} from 'lucide-react';

export default function Show({ shop, orders = { data: [] } }) {
    const { post, processing } = useForm();

    const handleActivate = () => {
        if (confirm(`Voulez-vous réactiver la boutique "${shop.name}" ?`)) {
            post(route('admin.shops.activate', shop.id));
        }
    };

    const handleSuspend = () => {
        if (confirm(`Voulez-vous suspendre la boutique "${shop.name}" ?`)) {
            post(route('admin.shops.suspend', shop.id));
        }
    };

    return (
        <AdminLayout title={`Boutique - ${shop.name}`}>
            <Head title={`Boutique ${shop.name} - Sellify Admin`} />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.shops.index')}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                                <Store className="w-4 h-4 text-yellow-600" />
                                <span>Fiche complète de boutique partenaire</span>
                            </div>
                            <h1 className="text-xl font-bold text-stone-900 mt-0.5">
                                {shop.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {shop.is_active ? (
                            <button
                                onClick={handleSuspend}
                                disabled={processing}
                                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                            >
                                Suspendre la boutique
                            </button>
                        ) : (
                            <button
                                onClick={handleActivate}
                                disabled={processing}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                            >
                                Réactiver la boutique
                            </button>
                        )}
                    </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Statut d'activité</span>
                        <span className={`text-lg font-bold block ${shop.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {shop.is_active ? 'Active & ouverte' : 'Suspendue'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">État d'exploitation</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Catalogue de produits</span>
                        <span className="text-2xl font-bold text-stone-900 block">
                            {shop.products ? shop.products.length : 0}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Articles enregistrés</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Historique commandes</span>
                        <span className="text-2xl font-bold text-purple-700 block">
                            {orders.total || 0}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Commandes enregistrées</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Date de création</span>
                        <span className="text-lg font-bold text-stone-900 block">
                            {new Date(shop.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Inscrite depuis {new Date(shop.created_at).getFullYear()}</span>
                    </div>
                </div>

                {/* Main 2-Column Grid: Shop Details & Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Col: Shop Identity & Seller Owner */}
                    <div className="space-y-6">
                        
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-400 text-yellow-950 font-bold text-base flex items-center justify-center border border-yellow-500 shadow-2xs shrink-0">
                                    {shop.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-900 text-sm">{shop.name}</h3>
                                    <p className="text-xs text-stone-500">{shop.company_name || 'Raison sociale non renseignée'}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs text-stone-700 font-normal">
                                <p><strong>Vendeur propriétaire :</strong> {shop.seller?.user ? `${shop.seller.user.first_name} ${shop.seller.user.last_name}` : 'Propriétaire'}</p>
                                <p><strong>Email vendeur :</strong> {shop.seller?.user?.email || 'N/A'}</p>
                                <p><strong>Téléphone contact :</strong> {shop.phone_contact || shop.seller?.user?.phone || 'N/A'}</p>
                                <p><strong>Adresse commerciale :</strong> {shop.address || 'Douala, Cameroun'}</p>
                                <p className="pt-2 border-t border-stone-100 text-stone-600">
                                    <strong>Description :</strong> {shop.description || 'Aucune description fournie.'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Right Col: Products & Orders History */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Recent Orders Stream */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-yellow-600" />
                                <span>Historique des commandes de la boutique</span>
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase text-[11px]">
                                            <th className="py-2">N° Commande</th>
                                            <th className="py-2">Client</th>
                                            <th className="py-2">Montant</th>
                                            <th className="py-2">Date</th>
                                            <th className="py-2 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {orders.data && orders.data.length > 0 ? (
                                            orders.data.map((o) => (
                                                <tr key={o.id}>
                                                    <td className="py-3 font-mono font-bold text-stone-900">#{o.order_number}</td>
                                                    <td className="py-3 text-stone-700">{o.user ? `${o.user.first_name} ${o.user.last_name}` : 'Client'}</td>
                                                    <td className="py-3 font-bold text-stone-900">{Number(o.total_amount).toLocaleString('fr-FR')} FCFA</td>
                                                    <td className="py-3 text-stone-500">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                                                    <td className="py-3 text-right">
                                                        <Link
                                                            href={route('admin.orders.show', o.order_number)}
                                                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors"
                                                        >
                                                            Inspecter
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-6 text-center text-stone-400">
                                                    Aucune commande passée dans cette boutique.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
