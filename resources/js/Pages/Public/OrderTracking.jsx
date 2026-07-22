import React from 'react';
import { Head } from '@inertiajs/react';
import { 
    PackageCheck, 
    Truck, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    Phone, 
    User, 
    ShieldCheck, 
    Store, 
    ArrowLeft,
    Copy,
    Share2,
    MessageCircle
} from 'lucide-react';

export default function OrderTracking({ found = true, trackingCode, smartLink, shop, seller, deliveryInfo }) {
    if (!found || !smartLink) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <Head title="Suivi de Colis - Inconnu" />
                <div className="bg-white border border-stone-200/80 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Truck className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900">Numéro de Suivi Invalide</h1>
                    <p className="text-xs text-stone-500">
                        Aucun colis ne correspond au code de suivi <span className="font-mono font-bold text-stone-800">{trackingCode}</span>.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-2.5 bg-amber-500 text-amber-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition-colors"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );
    }

    const customerName = deliveryInfo?.customer_name || 'Client Sellify';
    const phoneNumber = deliveryInfo?.phone_number || '';
    const deliveryAddress = deliveryInfo?.delivery_address || '';
    const city = deliveryInfo?.city_neighborhood || '';
    const shopName = shop?.name || seller?.shops[0]?.name || 'Boutique Partenaire';

    const items = smartLink.items || (smartLink.product ? [{
        name: smartLink.product.name,
        quantity: 1,
        unit_price: smartLink.price_at_time,
        total_price: smartLink.price_at_time
    }] : []);

    const steps = [
        { id: 1, title: 'Paiement Validé', desc: 'Paiement Escrow sécurisé', completed: true },
        { id: 2, title: 'En Préparation', desc: 'Le vendeur prépare votre colis', completed: true },
        { id: 3, title: 'Remis au Livreur', desc: 'En cours d\'acheminement', completed: false },
        { id: 4, title: 'Livré & Confirmé', desc: 'Fonds débloqués au vendeur', completed: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-500/10 via-stone-50 to-stone-100 font-sans text-stone-900 pb-16">
            <Head title={`Suivi Colis ${trackingCode} - Sellify`} />

            {/* Header */}
            <header className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-amber-950 text-xl shadow-sm">
                            S
                        </div>
                        <div>
                            <span className="font-extrabold text-stone-900 text-sm tracking-tight block">Sellify Logistics</span>
                            <span className="text-[11px] text-stone-500 font-medium font-mono">Code: {trackingCode}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Fonds sous Escrow</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 pt-8 space-y-6">

                {/* Banner Status Card */}
                <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold uppercase tracking-wider">
                            Suivi en Temps Réel
                        </span>
                        <span className="text-xs text-stone-400 font-medium">Mis à jour à l'instant</span>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-stone-900">
                            Colis en préparation chez {shopName}
                        </h1>
                        <p className="text-xs text-stone-500">
                            Votre commande a été enregistrée et votre vendeur prépare l'expédition.
                        </p>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="pt-4 border-t border-stone-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {steps.map((step) => (
                                <div key={step.id} className="space-y-2">
                                    <div className={`h-2 rounded-full transition-all ${
                                        step.completed ? 'bg-amber-500' : 'bg-stone-200'
                                    }`} />
                                    <div>
                                        <p className={`text-xs font-bold ${step.completed ? 'text-amber-950' : 'text-stone-400'}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-[10px] text-stone-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Delivery Information Recap */}
                <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                        <Truck className="w-5 h-5 text-amber-600" />
                        <h2 className="font-extrabold text-stone-900 text-base">Informations de Livraison</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-stone-50 rounded-2xl space-y-2 border border-stone-100">
                            <div className="flex items-center gap-2 text-stone-700 font-bold">
                                <User className="w-4 h-4 text-amber-600" />
                                <span>Destinataire : {customerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600 font-medium">
                                <Phone className="w-4 h-4 text-amber-600" />
                                <span>Téléphone : {phoneNumber}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-stone-50 rounded-2xl space-y-2 border border-stone-100">
                            <div className="flex items-center gap-2 text-stone-700 font-bold">
                                <MapPin className="w-4 h-4 text-amber-600" />
                                <span>Lieu : {city}</span>
                            </div>
                            <p className="text-stone-600 font-medium pl-6">
                                {deliveryAddress}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items Breakdown */}
                <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-amber-600" />
                            <h2 className="font-extrabold text-stone-900 text-base">Articles Commandés</h2>
                        </div>
                        <span className="text-xs font-bold text-amber-950 bg-amber-100 px-3 py-1 rounded-full">
                            Total : {Number(smartLink.total_price || smartLink.price_at_time).toLocaleString()} FCFA
                        </span>
                    </div>

                    <div className="divide-y divide-stone-100">
                        {items.map((it, idx) => (
                            <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-900 font-bold flex items-center justify-center">
                                        {it.quantity}x
                                    </div>
                                    <span className="text-stone-900 font-bold">{it.name}</span>
                                </div>
                                <span className="text-stone-900 font-extrabold">
                                    {Number(it.unit_price * it.quantity).toLocaleString()} FCFA
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Shop / Support Button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                        href={`https://wa.me/?text=Bonjour%20!%20Je%20souhaite%20des%20informations%20sur%20mon%20colis%20${trackingCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Contacter la Boutique sur WhatsApp</span>
                    </a>

                    <a
                        href="/"
                        className="w-full sm:w-auto py-3.5 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl transition-colors text-center"
                    >
                        Accueil Sellify
                    </a>
                </div>

            </main>
        </div>
    );
}
