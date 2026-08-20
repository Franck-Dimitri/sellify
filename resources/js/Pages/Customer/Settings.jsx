import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
    Check,
    Sliders
} from 'lucide-react';

export default function CustomerSettings({ user, settings = {} }) {
    const [prefs, setPrefs] = useState({
        email_notifications: settings.email_notifications ?? true,
        sms_otp_alerts: settings.sms_otp_alerts ?? true,
        promo_newsletter: settings.promo_newsletter ?? false,
        language: settings.language || 'fr',
        currency: settings.currency || 'XAF',
    });

    const { post, processing, recentlySuccessful } = useForm();

    const handleSave = (e) => {
        e.preventDefault();
        post(route('customer.settings.update'));
    };

    return (
        <CustomerLayout title="Paramètres du compte">
            <Head title="Paramètres du compte - Sellify" />

            <div className="w-full space-y-6 text-stone-800 font-sans pb-16 antialiased">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Settings className="w-4 h-4 text-yellow-600" />
                            <span>Préférences & sécurité</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Paramètres du compte acheteur
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez vos alertes de sécurité, vos canaux de notification et vos préférences régionales.
                        </p>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Vos préférences ont été enregistrées avec succès.</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    
                    {/* Notifications Channels Box */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-yellow-600" />
                            <span>Canaux de notification & alertes</span>
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                                <div className="space-y-0.5">
                                    <span className="font-semibold text-stone-900 block flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-stone-500" />
                                        <span>Alertes SMS pour le code OTP de livraison</span>
                                    </span>
                                    <span className="text-[11px] text-stone-500 font-normal">Recevez un SMS contenant votre code OTP 6 chiffres dès l'arrivée du livreur.</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.sms_otp_alerts}
                                    onChange={(e) => setPrefs({ ...prefs, sms_otp_alerts: e.target.checked })}
                                    className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                                <div className="space-y-0.5">
                                    <span className="font-semibold text-stone-900 block flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-stone-500" />
                                        <span>Confirmations de commande & reçus de séquestre par email</span>
                                    </span>
                                    <span className="text-[11px] text-stone-500 font-normal">Recevez automatiquement la facture PDF et le reçu de consignation des fonds par email.</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.email_notifications}
                                    onChange={(e) => setPrefs({ ...prefs, email_notifications: e.target.checked })}
                                    className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                                <div className="space-y-0.5">
                                    <span className="font-semibold text-stone-900 block">Nouveautés & codes promo vendeurs</span>
                                    <span className="text-[11px] text-stone-500 font-normal">Soyez informé des ventes flash et des baisses de prix sur vos boutiques favorites.</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.promo_newsletter}
                                    onChange={(e) => setPrefs({ ...prefs, promo_newsletter: e.target.checked })}
                                    className="w-4 h-4 text-yellow-500 rounded border-stone-300 focus:ring-yellow-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Regional & Currency Settings */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-yellow-600" />
                            <span>Langue & devise d'affichage</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Langue de l'interface :</label>
                                <select
                                    value={prefs.language}
                                    onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal"
                                >
                                    <option value="fr">Français (Cameroun / Afrique)</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Devise d'affichage :</label>
                                <select
                                    value={prefs.currency}
                                    onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal"
                                >
                                    <option value="XAF">Franc CFA CEMAC (FCFA / XAF)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Security & Account Activity */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                        <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-yellow-600" />
                            <span>Sécurité du compte & sessions</span>
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                                <div>
                                    <span className="font-semibold text-stone-900 block">Double authentification (2FA OTP)</span>
                                    <span className="text-[11px] text-stone-500">Chaque connexion nécessite un code OTP envoyé sur votre téléphone.</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full text-[11px]">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs transition-colors border border-yellow-500"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer mes préférences'}
                        </button>
                    </div>

                </form>

            </div>
        </CustomerLayout>
    );
}
