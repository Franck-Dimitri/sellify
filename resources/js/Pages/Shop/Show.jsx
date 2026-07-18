import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Store, ShieldCheck, MapPin, Phone, Mail, Clock, MessageCircle, Share2, Award, Calendar, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import Button from '../../Components/ui/Button';
import Badge from '../../Components/ui/Badge';

export default function Show({ shop, products = [] }) {
    const [openStatus, setOpenStatus] = useState({ isOpen: false, text: 'Vérification...' });
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'about', 'contact'

    useEffect(() => {
        const checkIsOpen = () => {
            if (!shop.opening_hours) {
                setOpenStatus({ isOpen: false, text: 'Horaires non définis' });
                return;
            }

            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const now = new Date();
            const dayName = days[now.getDay()];
            const todayHours = shop.opening_hours[dayName];

            if (!todayHours || !todayHours.active) {
                setOpenStatus({ isOpen: false, text: 'Fermé aujourd\'hui' });
                return;
            }

            const timeToMinutes = (t) => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };

            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const openMinutes = timeToMinutes(todayHours.open);
            const closeMinutes = timeToMinutes(todayHours.close);

            if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
                setOpenStatus({ isOpen: true, text: `Ouvert • Ferme à ${todayHours.close}` });
            } else {
                setOpenStatus({ isOpen: false, text: `Fermé • Ouvre à ${todayHours.open}` });
            }
        };

        checkIsOpen();
        const interval = setInterval(checkIsOpen, 60000);
        return () => clearInterval(interval);
    }, [shop.opening_hours]);

    const daysTranslation = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: shop.name,
                text: shop.slogan,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Lien de la boutique copié dans le presse-papiers !");
        }
    };

    return (
        <>
            <Head title={`${shop.name} - Boutique Professionnelle`} />
            <div className="min-h-screen bg-surface-50 font-sans flex flex-col pb-16">
                
                {/* Cover Banner */}
                <div className="h-48 md:h-64 w-full relative bg-surface-900 overflow-hidden">
                    {shop.banner_path ? (
                        <img 
                            src={`/storage/${shop.banner_path}`} 
                            alt={shop.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r opacity-30" style={{ backgroundImage: `linear-gradient(135deg, ${shop.theme_color} 0%, #171717 100%)` }} />
                    )}
                    <div className="absolute inset-0 bg-black/45" />
                    
                    {/* Share button */}
                    <button 
                        onClick={handleShare}
                        className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20 transition-all z-10"
                        title="Partager la boutique"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Shop profile header wrapper */}
                <div className="max-w-6xl w-full mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-10 flex-1">
                    <div className="bg-white border border-surface-200 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        {/* Logo and store text */}
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left w-full md:w-auto">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl p-1.5 shadow-lg border border-surface-200 flex items-center justify-center shrink-0">
                                {shop.logo_path ? (
                                    <img 
                                        src={`/storage/${shop.logo_path}`} 
                                        alt={shop.name} 
                                        className="w-full h-full object-cover rounded-2xl" 
                                    />
                                ) : (
                                    <Store className="w-12 h-12 text-surface-300" />
                                )}
                            </div>
                            
                            <div className="space-y-1.5">
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-surface-900 tracking-tight">{shop.name}</h1>
                                    <div className="flex items-center space-x-1.5 bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                        <Award className="w-3.5 h-3.5 text-yellow-600" />
                                        <span>Verified Gold Supplier</span>
                                    </div>
                                </div>
                                <p className="text-sm md:text-base text-surface-500 italic font-medium">
                                    "{shop.slogan || 'Pas de slogan configuré'}"
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-2 text-xs font-semibold">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-colors
                                        ${openStatus.isOpen 
                                            ? 'bg-secondary-50 text-secondary-700 border-secondary-200' 
                                            : 'bg-accent-50 text-accent-700 border-accent-200'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-1.5 ${openStatus.isOpen ? 'bg-secondary-500' : 'bg-accent-500'}`} />
                                        {openStatus.text}
                                    </span>
                                    <span className="text-surface-400 font-bold">•</span>
                                    <span className="text-surface-600 flex items-center space-x-1">
                                        <MapPin className="w-3.5 h-3.5 text-surface-400" />
                                        <span>{shop.address}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Button */}
                        <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
                            {shop.social_links?.whatsapp && (
                                <a 
                                    href={`https://wa.me/${shop.social_links.whatsapp}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <button 
                                        className="w-full px-5 py-3 rounded-2xl text-white font-bold flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-[1.02]"
                                        style={{ backgroundColor: shop.theme_color }}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>Contacter sur WhatsApp</span>
                                    </button>
                                </a>
                            )}
                            <a href={`tel:${shop.phone_contact}`} className="w-full">
                                <Button variant="outline" className="w-full space-x-2 rounded-2xl border-surface-200">
                                    <Phone className="w-4 h-4 text-surface-500" />
                                    <span>Appeler la boutique</span>
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-surface-200 mb-6 font-semibold text-sm">
                        <button 
                            onClick={() => setActiveTab('home')}
                            className={`pb-3 px-4 transition-colors relative focus:outline-none ${activeTab === 'home' ? 'text-surface-900 font-bold' : 'text-surface-400'}`}
                        >
                            <span>Catalogue</span>
                            {activeTab === 'home' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: shop.theme_color }} />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('about')}
                            className={`pb-3 px-4 transition-colors relative focus:outline-none ${activeTab === 'about' ? 'text-surface-900 font-bold' : 'text-surface-400'}`}
                        >
                            <span>Profil Entreprise</span>
                            {activeTab === 'about' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: shop.theme_color }} />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('contact')}
                            className={`pb-3 px-4 transition-colors relative focus:outline-none ${activeTab === 'contact' ? 'text-surface-900 font-bold' : 'text-surface-400'}`}
                        >
                            <span>Horaires & Contacts</span>
                            {activeTab === 'contact' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: shop.theme_color }} />
                            )}
                        </button>
                    </div>

                    {/* Tab contents */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Main Tab Content Column (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">
                            {activeTab === 'home' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-surface-900">Nos Articles</h3>
                                        <span className="text-xs text-surface-400 font-semibold">{products.length} articles disponibles</span>
                                    </div>

                                    {products.length === 0 ? (
                                        <div className="bg-white border border-surface-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[320px]">
                                            <div className="p-4 bg-surface-50 text-surface-400 rounded-full border border-surface-100">
                                                <ShoppingBag className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-bold text-surface-800">Catalogue en cours d'alimentation</h4>
                                                <p className="text-sm text-surface-500 max-w-sm mx-auto">
                                                    Cette boutique vient d'être configurée. Les articles du vendeur seront mis en ligne très prochainement.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Products mapping in the future */}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="bg-white border border-surface-200 rounded-3xl p-6 space-y-6 animate-fade-in">
                                    <div>
                                        <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-3 mb-4">
                                            Présentation de la boutique
                                        </h3>
                                        <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">
                                            {shop.description || 'Aucune description disponible pour le moment.'}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-3 mb-4 flex items-center space-x-2">
                                            <ShieldCheck className="w-5 h-5 text-secondary-500" />
                                            <span>Informations Légales Certifiées</span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                                                <span className="text-xs text-surface-400 font-bold uppercase block mb-1">Raison Sociale</span>
                                                <span className="font-bold text-surface-800">{shop.company_name}</span>
                                            </div>
                                            <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                                                <span className="text-xs text-surface-400 font-bold uppercase block mb-1">RCCM / Enregistrement</span>
                                                <span className="font-bold text-surface-800">{shop.registration_number || 'Non spécifié'}</span>
                                            </div>
                                            <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200 md:col-span-2">
                                                <span className="text-xs text-surface-400 font-bold uppercase block mb-1">Adresse de l'entrepôt</span>
                                                <span className="font-semibold text-surface-800">{shop.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="bg-white border border-surface-200 rounded-3xl p-6 space-y-6 animate-fade-in">
                                    <div>
                                        <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-3 mb-4">
                                            Horaires d'Ouverture
                                        </h3>
                                        <div className="border border-surface-200 rounded-2xl divide-y divide-surface-100 overflow-hidden text-sm">
                                            {shop.opening_hours && Object.keys(shop.opening_hours).map((day) => (
                                                <div key={day} className="flex justify-between items-center p-3 hover:bg-surface-50/50">
                                                    <span className="font-bold text-surface-700">{daysTranslation[day]}</span>
                                                    {shop.opening_hours[day].active ? (
                                                        <span className="font-semibold text-surface-800">
                                                            {shop.opening_hours[day].open} - {shop.opening_hours[day].close}
                                                        </span>
                                                    ) : (
                                                        <span className="font-bold text-accent-500 uppercase">Fermé</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar details column (1/3 width) */}
                        <div className="space-y-6">
                            {/* Contact Box */}
                            <div className="bg-white border border-surface-200 rounded-3xl p-6 space-y-4">
                                <h4 className="text-sm font-extrabold text-surface-900 uppercase tracking-wider pb-2 border-b border-surface-100">
                                    Coordonnées Directes
                                </h4>
                                <div className="space-y-3.5 text-sm">
                                    <div className="flex items-start space-x-3">
                                        <Phone className="w-5 h-5 text-surface-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] text-surface-400 font-bold block uppercase">Téléphone</span>
                                            <a href={`tel:${shop.phone_contact}`} className="font-semibold text-surface-800 hover:underline">{shop.phone_contact}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-5 h-5 text-surface-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] text-surface-400 font-bold block uppercase">E-mail Support</span>
                                            <a href={`mailto:${shop.email_contact}`} className="font-semibold text-surface-800 hover:underline">{shop.email_contact}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-surface-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] text-surface-400 font-bold block uppercase">Boutique Physique</span>
                                            <span className="font-medium text-surface-700">{shop.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="bg-gradient-to-br from-surface-900 to-surface-950 text-white rounded-3xl p-6 space-y-4 border border-surface-800 shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-extrabold text-base tracking-tight text-white">Garantie Sellify Verified</h4>
                                    <p className="text-xs text-surface-300 leading-relaxed">
                                        Ce vendeur a passé avec succès les vérifications de KYC, de conformité commerciale et d'identité physique requises par Sellify.me.
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-surface-800 flex items-center space-x-2 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                    <ShieldCheck className="w-4.5 h-4.5 text-secondary-500" />
                                    <span>Verified Profile Gold</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}
