import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    Settings, 
    Bell, 
    ShieldCheck, 
    Lock, 
    Globe, 
    CheckCircle2, 
    Smartphone, 
    Mail, 
    MessageSquare,
    Radio,
    Laptop,
    LogOut,
    AlertTriangle,
    Shield,
    Check
} from 'lucide-react';

export default function CustomerSettings({ user, preferences = {}, activeSessions = [] }) {
    const [prefs, setPrefs] = useState({
        whatsapp: preferences.whatsapp ?? true,
        sms: preferences.sms ?? true,
        email: preferences.email ?? true,
        push: preferences.push ?? true,
        promotions: preferences.promotions ?? false,
        escrow_alerts: preferences.escrow_alerts ?? true,
    });

    const { post, processing, recentlySuccessful } = useForm();

    const handleSavePreferences = (e) => {
        e.preventDefault();
        router.post(route('customer.settings.update'), {
            preferences: prefs,
        });
    };

    const handleTerminateOtherSessions = () => {
        if (confirm('Voulez-vous vraiment déconnecter votre compte de tous vos autres téléphones et ordinateurs ?')) {
            router.post(route('customer.settings.sessions.terminate'));
        }
    };

    return (
        <CustomerLayout title="Paramètres & Sécurité du Compte">
            <Head title="Paramètres & Sécurité - Sellify" />

            <div className="w-full space-y-6 text-stone-800 font-sans pb-16 antialiased max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-2xl shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-yellow-700 uppercase tracking-wide">
                            <Settings className="w-4 h-4 text-yellow-600" />
                            <span>Préférences & Sécurité</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Paramètres du Compte Acheteur
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez vos canaux de notification (WhatsApp, SMS, Email, Push) et sécurisez vos sessions multi-appareils.
                        </p>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Vos préférences ont été enregistrées avec succès.</span>
                    </div>
                )}

                {/* 1. NOTIFICATION PREFERENCES (WhatsApp, SMS, Email, Push) */}
                <form onSubmit={handleSavePreferences} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                            <Bell className="w-4 h-4 text-yellow-600" />
                            <span>1. Canaux de Notification & Alertes Commandes</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium">Temps réel</span>
                    </div>

                    <div className="space-y-3 text-xs">
                        {/* WhatsApp */}
                        <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 hover:bg-yellow-50/20 transition-colors">
                            <div className="space-y-0.5 pr-3">
                                <span className="font-bold text-stone-900 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                                    <span>Alertes Instantanées WhatsApp</span>
                                </span>
                                <p className="text-[11px] text-stone-500 font-normal">
                                    Recevez le statut du livreur, les notifications d'arrivée et les confirmations de commande directement sur votre numéro WhatsApp.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.whatsapp}
                                onChange={(e) => setPrefs({ ...prefs, whatsapp: e.target.checked })}
                                className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400 shrink-0"
                            />
                        </div>

                        {/* SMS */}
                        <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 hover:bg-yellow-50/20 transition-colors">
                            <div className="space-y-0.5 pr-3">
                                <span className="font-bold text-stone-900 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-stone-700" />
                                    <span>Code OTP de Livraison par SMS</span>
                                </span>
                                <p className="text-[11px] text-stone-500 font-normal">
                                    Recevez par SMS sécurisé votre code secret OTP à 6 chiffres indispensable pour autoriser la remise du colis par le livreur.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.sms}
                                onChange={(e) => setPrefs({ ...prefs, sms: e.target.checked })}
                                className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400 shrink-0"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 hover:bg-yellow-50/20 transition-colors">
                            <div className="space-y-0.5 pr-3">
                                <span className="font-bold text-stone-900 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-stone-700" />
                                    <span>Factures PDF & Reçus de Séquestre Escrow par Email</span>
                                </span>
                                <p className="text-[11px] text-stone-500 font-normal">
                                    Recevez automatiquement le reçu certifié de consignation des fonds et la facture d'achat officielle au format PDF.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.email}
                                onChange={(e) => setPrefs({ ...prefs, email: e.target.checked })}
                                className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400 shrink-0"
                            />
                        </div>

                        {/* Push Browser */}
                        <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 hover:bg-yellow-50/20 transition-colors">
                            <div className="space-y-0.5 pr-3">
                                <span className="font-bold text-stone-900 flex items-center gap-2">
                                    <Radio className="w-4 h-4 text-yellow-600" />
                                    <span>Notifications Push Navigateur & Mobile</span>
                                </span>
                                <p className="text-[11px] text-stone-500 font-normal">
                                    Mise à jour en direct lors des étapes clés de votre commande (En préparation, Colis ramassé, Livreur à proximité).
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.push}
                                onChange={(e) => setPrefs({ ...prefs, push: e.target.checked })}
                                className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400 shrink-0"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl shadow-xs transition-colors"
                        >
                            Enregistrer les préférences
                        </button>
                    </div>
                </form>

                {/* 2. SECURITY & ACTIVE SESSIONS DASHBOARD (Sub-Module 2.1.1) */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                        <div>
                            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-yellow-600" />
                                <span>2. Tableau de Bord de Sécurité & Sessions Actives</span>
                            </h3>
                            <p className="text-stone-500 text-[11px] mt-0.5">
                                Consultez la liste des appareils actuellement connectés à votre compte et révoquez les accès suspects.
                            </p>
                        </div>

                        <button
                            onClick={handleTerminateOtherSessions}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 shrink-0"
                        >
                            <LogOut className="w-3.5 h-3.5 text-rose-600" />
                            <span>Déconnecter les autres appareils</span>
                        </button>
                    </div>

                    {/* Active Sessions List */}
                    <div className="space-y-3">
                        {activeSessions.map((session) => (
                            <div 
                                key={session.id}
                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                    session.is_current 
                                        ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200' 
                                        : 'bg-stone-50 border-stone-200'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        session.is_current ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                                    }`}>
                                        {session.device_type.includes('iPhone') || session.device_type.includes('Samsung') ? (
                                            <Smartphone className="w-5 h-5" />
                                        ) : (
                                            <Laptop className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-stone-900">{session.device_type}</span>
                                            {session.is_current && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                                    Session Actuelle
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-stone-500 text-[11px]">
                                            Adresse IP : <span className="font-mono text-stone-700">{session.ip_address}</span> · {session.user_agent}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-[11px] text-stone-400 block">Dernière activité :</span>
                                    <strong className="text-stone-800 text-xs">{session.last_active}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </CustomerLayout>
    );
}
