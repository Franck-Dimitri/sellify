import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    Gift, 
    Copy, 
    Check, 
    Share2, 
    Users, 
    Sparkles, 
    ArrowRight,
    MessageCircle,
    ShieldCheck
} from 'lucide-react';

export default function Referral({ 
    referralCode = 'SLF-REF-X892', 
    referralLink = 'https://sellify.me/register?ref=SLF-REF-X892',
    stats = { total_referrals: 3, earned_points: 1500, reward_per_ref: 500 },
    recentReferrals = []
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(`Rejoins Sellify.me avec mon code de parrainage ${referralCode} et gagne des bons d'achat sur tes commandes gros sous séquestre Escrow ! Lien : ${referralLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <CustomerLayout title="Programme de parrainage">
            <Head title="Programme de parrainage - Sellify" />

            <div className="w-full space-y-6 text-stone-800 font-sans pb-16 antialiased">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-stone-900 via-yellow-950 to-stone-900 text-white border border-stone-800 p-6 rounded-2xl shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-400">
                                <Gift className="w-4 h-4" />
                                <span>Programme de parrainage & récompenses</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Invitez des amis & gagnez des crédits Escrow !
                            </h1>
                            <p className="text-xs text-stone-300 font-normal max-w-2xl leading-relaxed">
                                Pour chaque ami qui s'inscrit avec votre code et valide sa première commande, vous recevez **+500 points de fidélité (500 FCFA)** cumulables sur tout le catalogue.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center shrink-0">
                            <span className="text-[10px] text-stone-300 font-medium block uppercase tracking-wider">Solde de parrainage</span>
                            <span className="text-2xl font-bold text-yellow-400">{stats.earned_points.toLocaleString()} FCFA</span>
                            <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">3 filleuls validés</span>
                        </div>
                    </div>
                </div>

                {/* Referral Code & Share Link Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-4">
                        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-yellow-600" />
                            <span>Votre lien unique de parrainage</span>
                        </h3>

                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between font-mono text-xs text-stone-800 truncate">
                                    <span className="truncate">{referralLink}</span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Lien copié !' : 'Copier le lien'}</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    onClick={handleWhatsAppShare}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-2xs"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Partager sur WhatsApp</span>
                                </button>

                                <span className="text-xs text-stone-400 font-normal">Code : <strong className="text-stone-800 font-mono">{referralCode}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* How it works box */}
                    <div className="bg-yellow-50/70 border border-yellow-200 p-5 rounded-2xl space-y-3 text-xs text-stone-800">
                        <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                            <span>Comment ça marche ?</span>
                        </h3>
                        <ol className="space-y-2 text-stone-600 font-normal list-decimal list-inside text-[11px] leading-relaxed">
                            <li>Partagez votre lien ou votre code avec votre réseau.</li>
                            <li>Votre filleul crée son compte sur Sellify.me.</li>
                            <li>Dès sa 1ère commande validée, vous recevez **+500 FCFA**.</li>
                        </ol>
                    </div>
                </div>

                {/* Referrals List Table */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-stone-500" />
                        <span>Historique de vos filleuls parrainés</span>
                    </h3>

                    {recentReferrals && recentReferrals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-stone-100 text-[11px] text-stone-400 font-semibold uppercase">
                                        <th className="py-2.5 px-3">Nom du filleul</th>
                                        <th className="py-2.5 px-3">Date d'inscription</th>
                                        <th className="py-2.5 px-3">Statut</th>
                                        <th className="py-2.5 px-3 text-right">Récompense</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {recentReferrals.map((r, idx) => (
                                        <tr key={idx} className="hover:bg-stone-50 transition-colors">
                                            <td className="py-3 px-3 font-semibold text-stone-900">{r.name}</td>
                                            <td className="py-3 px-3 text-stone-500">{r.date}</td>
                                            <td className="py-3 px-3">
                                                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right font-bold text-yellow-700">{r.bonus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-stone-400 text-center py-6">Aucun filleul parrainé pour le moment. Partagez votre lien !</p>
                    )}
                </div>

            </div>
        </CustomerLayout>
    );
}
