import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Printer, Store, ShieldCheck, CheckCircle2, MapPin, Phone, ArrowLeft } from 'lucide-react';

export default function Invoice({ order }) {
    return (
        <div className="bg-white min-h-screen p-6 sm:p-10 font-sans text-stone-900 text-xs">
            <Head title={`Facture-${order.order_number}`} />

            {/* Print Controls (Hidden when printing) */}
            <div className="print:hidden max-w-3xl mx-auto mb-6 flex items-center justify-between bg-stone-50 border border-stone-200 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Retour</span>
                    </button>
                    <div>
                        <p className="font-semibold text-xs text-stone-900">Facture Officielle Client</p>
                        <p className="text-[11px] text-stone-500">Document certifié de votre transaction Escrow Sellify.me</p>
                    </div>
                </div>

                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer / Télécharger PDF</span>
                </button>
            </div>

            {/* Printable Invoice Container */}
            <div className="max-w-3xl mx-auto border border-stone-200 p-8 sm:p-12 rounded-xl space-y-8 bg-white shadow-xs print:border-0 print:shadow-none print:p-0">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-stone-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-yellow-500 text-stone-950 font-bold flex items-center justify-center text-sm">S</span>
                            <span className="text-xl font-bold tracking-tight">Sellify<span className="text-yellow-600">.me</span></span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">Plateforme de Commerce & Paiements Sécurisés</p>
                        <p className="text-[11px] text-stone-400">Douala • Yaoundé • Cameroun</p>
                    </div>

                    <div className="text-right space-y-1">
                        <span className="inline-block px-2.5 py-1 bg-yellow-50 text-yellow-950 border border-yellow-200 rounded-md font-mono text-xs font-semibold">
                            FACTURE #{order.order_number}
                        </span>
                        <p className="text-[11px] text-stone-500">
                            Date d'émission : {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: '2-digit', month: 'long', year: 'numeric'
                            })}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paiement Escrow Validé</span>
                        </div>
                    </div>
                </div>

                {/* Seller & Customer Blocks */}
                <div className="grid grid-cols-2 gap-8 border-b border-stone-200 pb-6 text-xs">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-stone-400">Vendeur / Boutique</p>
                        <p className="font-semibold text-stone-900 text-sm">{order.shop?.name}</p>
                        <p className="text-stone-600">{order.shop?.company_name || 'Commerce Partenaire Sellify'}</p>
                        <p className="text-stone-600">{order.shop?.address || 'Douala, Cameroun'}</p>
                        <p className="text-stone-600">Tél : {order.shop?.phone_contact || '-'}</p>
                        {order.shop?.registration_number && (
                            <p className="text-[11px] text-stone-500 font-mono">RCCM : {order.shop?.registration_number}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-stone-400">Client / Facturé à</p>
                        <p className="font-semibold text-stone-900 text-sm">{order.customer_name}</p>
                        <p className="text-stone-600">{order.delivery_address}</p>
                        <p className="text-stone-600">{order.city}, Cameroun</p>
                        <p className="text-stone-600">Tél : {order.customer_phone}</p>
                        <p className="text-[11px] text-stone-500">Paiement : {order.payment_method === 'orange_money' ? 'Orange Money' : order.payment_method === 'mtn_momo' ? 'MTN MoMo' : order.payment_method}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <table className="w-full text-left border-collapse border border-stone-200 text-xs">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-medium">
                                <th className="p-3 border-r border-stone-200">Désignation de l'Article</th>
                                <th className="p-3 border-r border-stone-200 text-center w-20">Quantité</th>
                                <th className="p-3 border-r border-stone-200 text-right w-32">Prix Unitaire</th>
                                <th className="p-3 text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {order.items?.map((item, idx) => (
                                <tr key={idx} className="hover:bg-stone-50/50">
                                    <td className="p-3 border-r border-stone-200 font-medium text-stone-900">{item.product_name}</td>
                                    <td className="p-3 border-r border-stone-200 text-center">{item.quantity}</td>
                                    <td className="p-3 border-r border-stone-200 text-right">{Number(item.unit_price).toLocaleString('fr-FR')} FCFA</td>
                                    <td className="p-3 text-right font-semibold text-stone-900">{Number(item.subtotal).toLocaleString('fr-FR')} FCFA</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-stone-200">
                                <td colSpan="3" className="p-2.5 text-right text-stone-500 font-medium">Sous-total articles :</td>
                                <td className="p-2.5 text-right font-medium">{Number(order.subtotal).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="p-2.5 text-right text-stone-500 font-medium">Frais de livraison assurée :</td>
                                <td className="p-2.5 text-right font-medium">{Number(order.shipping_fee || 0).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                            <tr className="border-t-2 border-stone-300 bg-yellow-50/60 font-bold text-sm text-stone-950">
                                <td colSpan="3" className="p-3 text-right">Montant Total Réglé :</td>
                                <td className="p-3 text-right">{Number(order.total_amount).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Escrow Guarantee Statement */}
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-start gap-3 text-[11px] text-stone-600">
                    <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-stone-800">Garantie & Authenticité Sellify Escrow</p>
                        <p className="mt-0.5 leading-relaxed">
                            Cette facture atteste que le règlement a transité par le protocole séquestre certifié de Sellify.me. Les fonds sont garantis jusqu'à la remise et vérification du colis par le client.
                        </p>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-stone-100 pt-6 text-center text-[10px] text-stone-400 space-y-1">
                    <p>Sellify.me - SAS Panafricaine de Commerce Numérique et Paiements Sécurisés</p>
                    <p>Pour toute question relative à cette facture, contactez le support à support@sellify.me</p>
                </div>

            </div>
        </div>
    );
}
