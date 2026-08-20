import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ShieldCheck, 
    Ban, 
    ArrowLeft, 
    Truck, 
    Store, 
    UserCheck, 
    ShieldAlert,
    ShoppingBag,
    DollarSign,
    Box,
    Star,
    Award,
    Calendar,
    Users,
    Check,
    X,
    FileText,
    Mail,
    Phone,
    MapPin,
    Lock,
    Activity,
    CreditCard,
    Gift
} from 'lucide-react';

export default function Show({ targetUser }) {
    const { post, processing } = useForm();
    const [actionReason, setActionReason] = useState('');
    const [showActionModal, setShowActionModal] = useState(false);

    const handleAction = (actionType) => {
        const confirmMsg = actionType === 'suspend' 
            ? "Voulez-vous suspendre ce compte ?" 
            : actionType === 'activate' 
            ? "Voulez-vous réactiver ce compte ?" 
            : "Voulez-vous bannir ce compte définitivement ?";

        if (confirm(confirmMsg)) {
            const routeName = actionType === 'suspend' 
                ? 'admin.users.suspend' 
                : actionType === 'activate' 
                ? 'admin.users.activate' 
                : 'admin.users.ban';

            post(route(routeName, targetUser.id));
        }
    };

    const approvedKyc = targetUser.kyc_requests?.find(r => r.status === 'approved');
    const isKycApproved = !!approvedKyc;

    const roleLabel = {
        admin: 'Super administrateur',
        seller: 'Vendeur / Boutique',
        driver: 'Chauffeur livreur',
        customer: 'Acheteur client',
    }[targetUser.role] || targetUser.role;

    return (
        <AdminLayout title={`Fiche utilisateur - ${targetUser.first_name} ${targetUser.last_name}`}>
            <Head title={`Fiche ${targetUser.first_name} ${targetUser.last_name} - Sellify Admin`} />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Back Button & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.users.all')}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                                <UserCheck className="w-4 h-4 text-yellow-600" />
                                <span>Fiche détaillée d'utilisateur</span>
                            </div>
                            <h1 className="text-xl font-bold text-stone-900 mt-0.5">
                                {targetUser.first_name} {targetUser.last_name}
                            </h1>
                        </div>
                    </div>

                    {/* Single Clean Account Action Toggle */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        {targetUser.status === 'active' ? (
                            <button
                                onClick={() => handleAction('suspend')}
                                disabled={processing}
                                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-colors"
                            >
                                Suspendre le compte
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAction('activate')}
                                disabled={processing}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                            >
                                Réactiver le compte
                            </button>
                        )}
                        <button
                            onClick={() => handleAction('ban')}
                            disabled={processing}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                        >
                            Bannir...
                        </button>
                    </div>
                </div>

                {/* 4 Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Rôle sur la plateforme</span>
                        <span className="text-lg font-bold text-stone-900 block">{roleLabel}</span>
                        <span className="text-[11px] text-stone-400 font-normal">Identifiant #{targetUser.id}</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Statut du compte</span>
                        <span className={`text-lg font-bold block ${targetUser.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {targetUser.status === 'active' ? 'Actif & autorisé' : 'Suspendu / Bloqué'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Accès aux fonctionnalités</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Vérification KYC</span>
                        <span className={`text-lg font-bold block ${isKycApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isKycApproved ? 'Identité certifiée' : 'Non vérifié'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Pièces justificatives CNI</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Ancienneté</span>
                        <span className="text-lg font-bold text-purple-600 block">
                            {new Date(targetUser.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Inscrit depuis {new Date(targetUser.created_at).getFullYear()}</span>
                    </div>
                </div>

                {/* Main 2-Column Detailed View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Col: Identity Card */}
                    <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-yellow-950 font-bold text-base flex items-center justify-center border border-yellow-500 shadow-2xs">
                                {targetUser.first_name[0]}{targetUser.last_name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-900 text-sm">{targetUser.first_name} {targetUser.last_name}</h3>
                                <p className="text-xs text-stone-500">{targetUser.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-stone-700 font-normal">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                                <span>Email : <strong>{targetUser.email}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                                <span>Téléphone : <strong>{targetUser.phone || 'Non renseigné'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                                <span>Adresse : <strong>{targetUser.default_delivery_address || 'Non spécifiée'} ({targetUser.default_city || 'Douala'})</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Gift className="w-4 h-4 text-stone-400 shrink-0" />
                                <span>Points de fidélité : <strong>{targetUser.loyalty_points || 0} pts</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Role Specific Metrics & Activity */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-xl p-6 shadow-xs space-y-5">
                        <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">Détails d'activité & dossiers associés</h3>

                        {/* Seller Details if applicable */}
                        {targetUser.seller && (
                            <div className="p-4 bg-yellow-50/60 border border-yellow-200/80 rounded-xl space-y-2 text-xs">
                                <h4 className="font-bold text-yellow-950 flex items-center gap-1.5">
                                    <Store className="w-4 h-4 text-yellow-700" />
                                    <span>Profil Vendeur & Boutiques</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-stone-800">
                                    <p>Statut vendeur : <strong>{targetUser.seller.status}</strong></p>
                                    <p>Identifiant vendeur : <strong>#{targetUser.seller.id}</strong></p>
                                </div>
                            </div>
                        )}

                        {/* Driver Details if applicable */}
                        {targetUser.driver && (
                            <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-xl space-y-2 text-xs">
                                <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
                                    <Truck className="w-4 h-4 text-purple-700" />
                                    <span>Profil Chauffeur Livreur</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-stone-800">
                                    <p>Statut homologation : <strong>{targetUser.driver.status}</strong></p>
                                    <p>Véhicule : <strong>{targetUser.driver.vehicle_type || 'Moto'}</strong></p>
                                </div>
                            </div>
                        )}

                        {/* Activity logs stream */}
                        <div className="space-y-2">
                            <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-stone-500" />
                                <span>Historique d'activité de l'utilisateur</span>
                            </h4>
                            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-xs text-stone-600 space-y-1">
                                <p>Compte utilisateur actif et sous surveillance administrative.</p>
                                <span className="text-[10px] text-stone-400 block">Dernière connexion enregistrée</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
