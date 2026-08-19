import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';
import { 
    Tag, 
    Plus, 
    Trash2, 
    Percent, 
    Calendar, 
    Store, 
    CheckCircle2, 
    Clock, 
    X,
    Sparkles
} from 'lucide-react';

export default function PromoCodes({ promoCodes = [], shops = [] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        shop_id: shops[0]?.id || '',
        code: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        usage_limit: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.promocodes.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            }
        });
    };

    const handleDelete = (id, code) => {
        if (confirm(`Confirmez-vous la suppression du code promo "${code}" ?`)) {
            post(route('seller.promocodes.destroy', id), {
                _method: 'DELETE',
            });
        }
    };

    return (
        <SellerCentralLayout title="Codes Promo & Coupons">
            <Head title="Codes Promo - Espace Vendeur" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-yellow-700 uppercase tracking-wide">
                            <Tag className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Marketing & Fidélisation</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900 mt-1">
                            Codes Promo & Bons de Réduction
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Créez des codes promotionnels personnalisés (ex: SOLDES2026) à partager sur vos réseaux sociaux.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('seller.promotions.global')}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
                        >
                            Promotions Produits
                        </Link>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nouveau Code Promo</span>
                        </button>
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Code Promo</th>
                                    <th className="py-3 px-4">Boutique</th>
                                    <th className="py-3 px-4">Réduction</th>
                                    <th className="py-3 px-4">Min. Commande</th>
                                    <th className="py-3 px-4">Utilisations</th>
                                    <th className="py-3 px-4">Période de Validité</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-xs">
                                {promoCodes.length > 0 ? (
                                    promoCodes.map((promo) => (
                                        <tr key={promo.id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className="font-mono font-semibold px-2.5 py-1 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-md text-xs tracking-wider">
                                                    {promo.code}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-stone-700">
                                                {promo.shop?.name || 'Boutique'}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-stone-900">
                                                {promo.type === 'percentage' ? `-${promo.value}%` : `-${Number(promo.value).toLocaleString('fr-FR')} FCFA`}
                                            </td>
                                            <td className="py-3 px-4 text-stone-600">
                                                {promo.min_order_amount > 0 ? `${Number(promo.min_order_amount).toLocaleString('fr-FR')} FCFA` : 'Sans minimum'}
                                            </td>
                                            <td className="py-3 px-4 text-stone-600">
                                                {promo.used_count || 0} / {promo.usage_limit ? promo.usage_limit : '∞'}
                                            </td>
                                            <td className="py-3 px-4 text-stone-500 text-[11px]">
                                                {new Date(promo.start_date).toLocaleDateString('fr-FR')} → {new Date(promo.end_date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(promo.id, promo.code)}
                                                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-stone-500">
                                            <Tag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-stone-700">Aucun code promo créé</p>
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                Offrez des remises personnalisées pour stimuler vos ventes sur WhatsApp et Instagram.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                        <div className="bg-white border border-stone-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-yellow-600" />
                                    <span>Nouveau Code Promo</span>
                                </h3>
                                <button onClick={() => setIsCreateOpen(false)} className="text-stone-400 hover:text-stone-700">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Boutique associée</label>
                                    <select
                                        value={data.shop_id}
                                        onChange={(e) => setData('shop_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                        required
                                    >
                                        {shops.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="font-medium text-stone-700 block mb-1">Code promotionnel</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="Ex: SOLDES20, PROMOVIP"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800 font-mono"
                                        required
                                    />
                                    {errors.code && <p className="text-rose-600 text-[11px] mt-0.5">{errors.code}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-medium text-stone-700 block mb-1">Type de remise</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                        >
                                            <option value="percentage">Pourcentage (%)</option>
                                            <option value="fixed">Montant fixe (FCFA)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-medium text-stone-700 block mb-1">Valeur de la remise</label>
                                        <input
                                            type="number"
                                            value={data.value}
                                            onChange={(e) => setData('value', e.target.value)}
                                            placeholder={data.type === 'percentage' ? 'Ex: 15' : 'Ex: 2500'}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-medium text-stone-700 block mb-1">Min. d'achat (FCFA)</label>
                                        <input
                                            type="number"
                                            value={data.min_order_amount}
                                            onChange={(e) => setData('min_order_amount', e.target.value)}
                                            placeholder="Ex: 10000"
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-medium text-stone-700 block mb-1">Limite d'utilisations</label>
                                        <input
                                            type="number"
                                            value={data.usage_limit}
                                            onChange={(e) => setData('usage_limit', e.target.value)}
                                            placeholder="Illimité si vide"
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-medium text-stone-700 block mb-1">Date de début</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-medium text-stone-700 block mb-1">Date d'expiration</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 text-stone-800"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex gap-2 justify-end border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg"
                                    >
                                        Créer le code
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </SellerCentralLayout>
    );
}
