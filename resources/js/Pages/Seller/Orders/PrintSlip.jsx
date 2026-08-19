import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Printer, Store, Package, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function PrintSlip({ order }) {
    useEffect(() => {
        // Auto print prompt
        window.print();
    }, []);

    return (
        <div className="bg-white min-h-screen p-8 text-stone-900 font-sans text-xs">
            <Head title={`Bordereau-${order.order_number}`} />

            {/* Print Header Controls (Hidden during print) */}
            <div className="print:hidden mb-6 flex justify-between items-center bg-stone-100 p-4 rounded-lg border border-stone-200">
                <div>
                    <p className="font-semibold text-sm">Bordereau d'Expédition & Enlèvement</p>
                    <p className="text-stone-500">Prêt pour impression ou remise au livreur certifié.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium rounded-lg flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer le document</span>
                </button>
            </div>

            {/* Printable Document Box */}
            <div className="max-w-3xl mx-auto border border-stone-300 p-8 rounded-lg space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-stone-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-md bg-yellow-500 text-stone-950 font-bold flex items-center justify-center text-sm">S</span>
                            <span className="text-lg font-bold tracking-tight">Sellify<span className="text-yellow-600">.me</span></span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">Plateforme de Confiance pour le Commerce Africain</p>
                    </div>

                    <div className="text-right">
                        <p className="font-mono text-sm font-bold text-stone-900">{order.order_number}</p>
                        <p className="text-stone-500 mt-0.5">Date : {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-stone-100 border border-stone-300 rounded font-medium text-[10px]">
                            PAIEMENT ESCROW SÉCURISÉ
                        </span>
                    </div>
                </div>

                {/* Seller & Customer Blocks */}
                <div className="grid grid-cols-2 gap-6 border-b border-stone-200 pb-6">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-stone-400">Expéditeur (Boutique)</p>
                        <p className="font-semibold text-stone-900">{order.shop?.name}</p>
                        <p className="text-stone-600">{order.shop?.address || 'Douala, Cameroun'}</p>
                        <p className="text-stone-600">Tél : {order.shop?.phone_contact || '-'}</p>
                        <p className="text-stone-600">RCCM : {order.shop?.registration_number || 'Non renseigné'}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-stone-400">Destinataire (Client)</p>
                        <p className="font-semibold text-stone-900">{order.customer_name}</p>
                        <p className="text-stone-600">{order.delivery_address}</p>
                        <p className="text-stone-600">Ville : {order.city}</p>
                        <p className="text-stone-600">Tél : {order.customer_phone}</p>
                    </div>
                </div>

                {/* Items List */}
                <div>
                    <p className="text-[11px] uppercase font-bold text-stone-400 mb-2">Contenu du Colis</p>
                    <table className="w-full text-left border-collapse border border-stone-200">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-stone-600">
                                <th className="p-2 border-r border-stone-200">Désignation</th>
                                <th className="p-2 border-r border-stone-200 text-center w-16">Qté</th>
                                <th className="p-2 border-r border-stone-200 text-right w-28">Prix Unit.</th>
                                <th className="p-2 text-right w-28">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {order.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 border-r border-stone-200 font-medium">{item.product_name}</td>
                                    <td className="p-2 border-r border-stone-200 text-center">{item.quantity}</td>
                                    <td className="p-2 border-r border-stone-200 text-right">{Number(item.unit_price).toLocaleString('fr-FR')} FCFA</td>
                                    <td className="p-2 text-right font-medium">{Number(item.subtotal).toLocaleString('fr-FR')} FCFA</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-stone-200">
                                <td colSpan="3" className="p-2 text-right text-stone-500 font-medium">Sous-total :</td>
                                <td className="p-2 text-right">{Number(order.subtotal).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="p-2 text-right text-stone-500 font-medium">Frais de livraison :</td>
                                <td className="p-2 text-right">{Number(order.shipping_fee || 0).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                            <tr className="border-t border-stone-300 font-bold text-sm bg-stone-50">
                                <td colSpan="3" className="p-2 text-right">Total Commande :</td>
                                <td className="p-2 text-right">{Number(order.total_amount).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Signatures & Instructions */}
                <div className="grid grid-cols-2 gap-8 border-t border-stone-200 pt-6">
                    <div className="border border-stone-200 p-3 rounded h-24 flex flex-col justify-between">
                        <p className="text-[10px] text-stone-400 font-medium">Signature / Tampon Vendeur (Enlèvement) :</p>
                        <p className="text-[9px] text-stone-400">Date : ____/____/2026</p>
                    </div>

                    <div className="border border-stone-200 p-3 rounded h-24 flex flex-col justify-between">
                        <p className="text-[10px] text-stone-400 font-medium">Signature Livreur / Décharge :</p>
                        <p className="text-[9px] text-stone-400">Nom Livreur : ____________________</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center text-[10px] text-stone-400 pt-4 border-t border-stone-100">
                    Bordereau officiel généré par Sellify.me • La vérification du code OTP à la livraison valide le déblocage des fonds Escrow.
                </div>

            </div>
        </div>
    );
}
