import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import Button from '../Components/ui/Button';
import { Card } from '../Components/ui/Card';
    
import {
    ShieldCheck,
    Zap,
    Store,
    TrendingUp,
    Navigation,
    Cpu,
    ArrowRight,
    ShoppingBag,
    Users,
    Truck,
    LineChart,
    Layers,
    DollarSign,
    Lock
} from 'lucide-react';

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="La Plateforme E-commerce de Confiance" />

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-white pt-16 pb-20 md:pt-24 md:pb-28">
                {/* Background glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-200 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold text-primary-900">
                        <Cpu className="w-4 h-4 text-primary-600" />
                        <span>Propulsé par le Moteur IA de Sellify</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-surface-900 max-w-4xl mx-auto leading-tight md:leading-none">
                        Vendez en toute sécurité. <br className="hidden md:inline" />
                        Achetez en confiance. <br className="hidden md:inline" />
                        Livrez avec précision.
                    </h1>

                    <p className="text-base md:text-lg text-surface-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        La solution e-commerce tout-en-un pour l'Afrique. Connectant vendeurs ambitieux, clients exigeants et livreurs agiles à travers des paiements Escrow garantis.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href={route('register')}>
                            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md hover:-translate-y-0.5">
                                Commencer l'aventure
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <a href="#piliers">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-surface-50">
                                Découvrir nos technologies
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. DASHBOARD MOCKUP SCREENSHOT (FLOATING EFFECT TO BOTTOM) */}
            <section className="relative bg-surface-50 -mt-10 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl border border-surface-200 bg-white/50 backdrop-blur-sm p-4 shadow-xl animate-float">
                        <div className="bg-surface-100 rounded-2xl overflow-hidden border border-surface-200 shadow-2xl">
                            {/* Window Header */}
                            <div className="bg-surface-200 px-6 py-4 flex items-center justify-between border-b border-surface-300">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-secondary-500"></div>
                                </div>
                                <div className="text-xs text-surface-600 font-mono">sellify-intelligence-dashboard.json</div>
                                <div className="w-16"></div>
                            </div>

                            {/* Bento style UI Layout inside Mockup */}
                            <div className="p-6 bg-white text-surface-900 grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-left">
                                {/* Large Card */}
                                <div className="md:col-span-2 bg-surface-50 border border-surface-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs text-primary-600 font-bold uppercase tracking-wider">Statistiques de ventes</span>
                                            <h4 className="text-2xl font-black mt-1">1 249 500 FCFA</h4>
                                        </div>
                                        <span className="bg-secondary-500/20 text-secondary-600 text-xs px-2.5 py-1 rounded-full font-bold">+28.4% ce mois</span>
                                    </div>
                                    <div className="h-28 flex items-end justify-between space-x-2 pt-4">
                                        <div className="w-full bg-surface-200 rounded-t h-1/3"></div>
                                        <div className="w-full bg-surface-200 rounded-t h-2/3"></div>
                                        <div className="w-full bg-primary-500 rounded-t h-1/2"></div>
                                        <div className="w-full bg-surface-200 rounded-t h-3/4"></div>
                                        <div className="w-full bg-secondary-500 rounded-t h-full"></div>
                                    </div>
                                </div>

                                {/* Escrow Card */}
                                <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Lock className="w-8 h-8 text-secondary-500" />
                                        <span className="text-xs font-bold bg-secondary-500/20 text-secondary-600 px-2 py-0.5 rounded-full">Actif</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-surface-600">Escrow Mobile Money</h5>
                                        <p className="text-2xl font-black mt-1">450 000 FCFA</p>
                                    </div>
                                    <span className="text-xs text-surface-500 leading-snug">Fonds sécurisés en attente de livraison client.</span>
                                </div>

                                {/* Logistics AI Mini Bento */}
                                <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 space-y-3">
                                    <div className="flex items-center space-x-2 text-primary-600">
                                        <Cpu className="w-5 h-5 animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Logistique IA</span>
                                    </div>
                                    <h5 className="text-sm font-bold">Optimisation des tournées</h5>
                                    <div className="space-y-2 text-xs text-surface-600 font-mono">
                                        <div className="flex justify-between border-b border-surface-200 pb-1">
                                            <span>Douala Akwa</span>
                                            <span className="text-secondary-600 font-bold">12 min restants</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Livreur ID #882</span>
                                            <span className="text-primary-600 font-bold">Moto (En transit)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Fast orders widget */}
                                <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 md:col-span-2 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-surface-600 font-bold uppercase tracking-wider">Commandes rapides</span>
                                        <span className="text-xs font-mono text-primary-600">Smart-Link actif</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                                        <div className="bg-white p-2.5 rounded-lg border border-surface-200">
                                            <p className="text-surface-500 font-bold">Produit</p>
                                            <p className="font-semibold truncate">Chaussures Sport</p>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-lg border border-surface-200">
                                            <p className="text-surface-500 font-bold">Prix</p>
                                            <p className="font-semibold">25 000 FCFA</p>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-lg border border-surface-200">
                                            <p className="text-surface-500 font-bold">Paiement</p>
                                            <p className="font-semibold text-secondary-600">OM/Momo</p>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-lg border border-surface-200">
                                            <p className="text-surface-500 font-bold">Statut</p>
                                            <p className="font-semibold text-primary-600">Payé (Escrow)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PILIERS DE LA PLATEFORME (BENTO GRID STYLE) */}
            <section id="piliers" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">Technologie & Confiance</h2>
                        <h3 className="text-3xl font-extrabold text-surface-900 md:text-4xl">Nos Piliers Fondamentaux</h3>
                        <p className="text-surface-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                            Nous combinons les meilleurs outils de paiement, de commande et d'intelligence artificielle logistique pour offrir une expérience sans friction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pilier 1 */}
                        <Card className="bento-card flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="p-3 bg-primary-100 text-primary-800 rounded-2xl w-fit">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-surface-900">Escrow Paiement</h4>
                                <p className="text-sm text-surface-500 leading-relaxed">
                                    Sécurisez vos transactions. L'argent de l'acheteur est bloqué de manière sécurisée (Mobile Money Orange/MTN) et n'est libéré au vendeur qu'une fois le colis inspecté et accepté par le client.
                                </p>
                            </div>
                        </Card>

                        {/* Pilier 2 */}
                        <Card className="bento-card flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="p-3 bg-secondary-100 text-secondary-800 rounded-2xl w-fit">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-surface-900">Commandes rapides & Liens de paiement</h4>
                                <p className="text-sm text-surface-500 leading-relaxed">
                                    Générez un Smart-Link en un clic. Partagez-le sur WhatsApp, Instagram ou Facebook. Vos clients cliquent, payent et programment leur livraison en 30 secondes chrono.
                                </p>
                            </div>
                        </Card>

                        {/* Pilier 3 */}
                        <Card className="bento-card flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl w-fit">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-surface-900">Analyse de ventes & Logistique AI</h4>
                                <p className="text-sm text-surface-500 leading-relaxed">
                                    Optimisez vos trajets et prévoyez vos stocks. Notre intelligence artificielle distribue automatiquement les colis aux livreurs les plus proches et fournit des tableaux prédictifs de ventes.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 4. POUR LES VENDEURS */}
            <section id="vendeurs" className="py-20 bg-surface-50 border-t border-b border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="inline-flex items-center space-x-2 bg-primary-100 text-primary-900 px-3.5 py-1 rounded-full text-xs font-bold">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Vendeurs</span>
                        </span>
                        <h3 className="text-3xl font-extrabold text-surface-900 md:text-4xl">
                            Créez votre boutique et boostez vos ventes
                        </h3>
                        <p className="text-sm md:text-base text-surface-500 leading-relaxed">
                            Que vous vendiez sur les réseaux sociaux ou possédiez un commerce physique, Sellify.me vous fournit une boutique professionnelle sans connaissances techniques. Configurez votre catalogue de produits, gérez vos stocks, et recevez vos gains par Mobile Money ou virement bancaire.
                        </p>
                        <div className="space-y-3 font-semibold text-sm text-surface-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center">✓</div>
                                <span>Multi-boutiques (Jusqu'à 3) sur un seul compte</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center">✓</div>
                                <span>Générateur de Smart-Links de paiement WhatsApp</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center">✓</div>
                                <span>Tableau de bord de ventes et de prévisions IA</span>
                            </div>
                        </div>
                        <Link href={route('register')}>
                            <Button variant="primary" size="lg" className="space-x-2">
                                <span>Rejoindre en tant que vendeur</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                    {/* Visual Illustration instead of photos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-3xl border border-surface-200 p-6 flex flex-col justify-between h-48 shadow-sm">
                            <Store className="w-8 h-8 text-primary-500" />
                            <div>
                                <h4 className="font-bold text-surface-900">Boutique SaaS</h4>
                                <p className="text-xs text-surface-400 mt-1">Configurez et lancez en quelques secondes.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl border border-surface-200 p-6 flex flex-col justify-between h-48 shadow-sm mt-8">
                            <LineChart className="w-8 h-8 text-secondary-500" />
                            <div>
                                <h4 className="font-bold text-surface-900">Prédictions IA</h4>
                                <p className="text-xs text-surface-400 mt-1">Visualisez les tendances de vos ventes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. POUR LES LIVREURS */}
            <section id="livreurs" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Visual Illustration instead of photos */}
                    <div className="grid grid-cols-2 gap-4 order-last lg:order-first">
                        <div className="bg-surface-50 rounded-3xl border border-surface-200 p-6 flex flex-col justify-between h-48 shadow-sm mt-8">
                            <Navigation className="w-8 h-8 text-primary-500 animate-bounce" />
                            <div>
                                <h4 className="font-bold text-surface-900">Logistique Intelligente</h4>
                                <p className="text-xs text-surface-400 mt-1">L'IA vous indique les itinéraires optimisés.</p>
                            </div>
                        </div>
                        <div className="bg-surface-50 rounded-3xl border border-surface-200 p-6 flex flex-col justify-between h-48 shadow-sm">
                            <DollarSign className="w-8 h-8 text-secondary-500" />
                            <div>
                                <h4 className="font-bold text-surface-900">Revenus Garantis</h4>
                                <p className="text-xs text-surface-400 mt-1">Recevez vos gains instantanément par Momo.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <span className="inline-flex items-center space-x-2 bg-primary-100 text-primary-900 px-3.5 py-1 rounded-full text-xs font-bold">
                            <Truck className="w-4 h-4" />
                            <span>Livreurs</span>
                        </span>
                        <h3 className="text-3xl font-extrabold text-surface-900 md:text-4xl">
                            Augmentez vos livraisons avec l'IA logistique
                        </h3>
                        <p className="text-sm md:text-base text-surface-500 leading-relaxed">
                            Devenez livreur partenaire Sellify.me et accédez à une file d'attente intelligente de courses. Notre système affecte automatiquement les colis aux livreurs les plus proches pour réduire les temps de trajet et maximiser vos gains par jour.
                        </p>
                        <div className="space-y-3 font-semibold text-sm text-surface-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center">✓</div>
                                <span>Itinéraires optimisés par notre moteur de cartographie</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center">✓</div>
                                <span>Notifications de courses en temps réel</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center">✓</div>
                                <span>Paiement sécurisé et instantané après validation client</span>
                            </div>
                        </div>
                        <Link href={route('register')}>
                            <Button variant="primary" size="lg" className="space-x-2">
                                <span>Rejoindre en tant que livreur</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. STATISTIQUES */}
            <section className="py-16 bg-surface-100 text-surface-900 border-t border-b border-surface-200 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
                    <h3 className="text-2xl md:text-3xl font-bold">Sellify.me en Chiffres</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <p className="text-3xl md:text-5xl font-black text-primary-600">10K+</p>
                            <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-surface-600">Transactions sécurisées</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl md:text-5xl font-black text-primary-600">2K+</p>
                            <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-surface-600">Vendeurs vérifiés</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl md:text-5xl font-black text-primary-600">500+</p>
                            <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-surface-600">Livreurs actifs</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl md:text-5xl font-black text-primary-600">99.8%</p>
                            <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-surface-600">Taux de réussite logistique</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. ILLUSTRATIONS AND DYNAMIC COMPONENT SECTION */}
            <section className="py-20 bg-surface-50 border-b border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
                    <div className="space-y-3">
                        <h3 className="text-2xl md:text-4xl font-extrabold text-surface-900">Comment le flux Escrow fonctionne</h3>
                        <p className="text-surface-500 text-sm md:text-base max-w-xl mx-auto">
                            De la commande à la livraison, nous veillons à la sécurité de l'argent et du produit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm text-left space-y-4">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold">1</span>
                            <h4 className="font-bold text-surface-900">Achat & Commande</h4>
                            <p className="text-xs text-surface-500">Le client sélectionne le produit et commande par Smart-Link.</p>
                        </div>
                        <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm text-left space-y-4">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold">2</span>
                            <h4 className="font-bold text-surface-900">Fonds Bloqués (Escrow)</h4>
                            <p className="text-xs text-surface-500">L'argent est sécurisé sur le compte Escrow Mobile Money de Sellify.</p>
                        </div>
                        <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm text-left space-y-4">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold">3</span>
                            <h4 className="font-bold text-surface-900">Livraison AI</h4>
                            <p className="text-xs text-surface-500">Un livreur partenaire validé achemine le colis par trajet optimisé.</p>
                        </div>
                        <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm text-left space-y-4">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold">4</span>
                            <h4 className="font-bold text-surface-900">Validation & Paiement</h4>
                            <p className="text-xs text-surface-500">Le client accepte le colis et les fonds sont débloqués pour le vendeur.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. FINAL CALL TO ACTION (CTA) */}
            <section className="py-20 bg-white text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-30 z-0"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
                    <h3 className="text-3xl md:text-5xl font-black text-surface-900">Prêt à transformer votre commerce ?</h3>
                    <p className="text-base md:text-lg text-surface-500 max-w-2xl mx-auto">
                        Inscrivez-vous dès aujourd'hui sur Sellify.me et accédez à l'écosystème de commerce le plus sécurisé et innovant d'Afrique.
                    </p>
                    <div>
                        <Link href={route('login')}>
                            <Button variant="primary" size="lg" className="shadow-lg hover:-translate-y-0.5">
                                Se connecter et démarrer
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
