import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    Upload, 
    Store, 
    ShieldCheck, 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Globe, 
    HelpCircle, 
    ExternalLink,
    Palette,
    FileText,
    CheckCircle2,
    Eye
} from 'lucide-react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';

export default function Edit({ shop }) {
    const [step, setStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState(shop.logo_path ? `/storage/${shop.logo_path}` : null);
    const [bannerPreview, setBannerPreview] = useState(shop.banner_path ? `/storage/${shop.banner_path}` : null);

    const primaryColor = shop.theme_color || '#F59E0B';

    const { data, setData, post, processing, errors } = useForm({
        name: shop.name || '',
        slogan: shop.slogan || '',
        description: shop.description || '',
        logo: null,
        banner: null,
        company_name: shop.company_name || '',
        registration_number: shop.registration_number || '',
        address: shop.address || '',
        phone_contact: shop.phone_contact || '',
        email_contact: shop.email_contact || '',
        theme_color: shop.theme_color || '#F59E0B',
        opening_hours: shop.opening_hours || {
            monday: { active: true, open: '08:00', close: '18:00' },
            tuesday: { active: true, open: '08:00', close: '18:00' },
            wednesday: { active: true, open: '08:00', close: '18:00' },
            thursday: { active: true, open: '08:00', close: '18:00' },
            friday: { active: true, open: '08:00', close: '18:00' },
            saturday: { active: false, open: '09:00', close: '17:00' },
            sunday: { active: false, open: '09:00', close: '13:00' },
        },
        social_links: shop.social_links || {
            whatsapp: '',
            facebook: '',
            instagram: '',
        }
    });

    const stepsList = [
        { id: 1, name: 'Identité Visuelle & Thème' },
        { id: 2, name: 'Informations Légales' },
        { id: 3, name: 'Horaires & Contacts' }
    ];

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setData(field, file);

        const reader = new FileReader();
        reader.onloadend = () => {
            if (field === 'logo') setLogoPreview(reader.result);
            if (field === 'banner') setBannerPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleOpeningHoursChange = (day, key, value) => {
        setData('opening_hours', {
            ...data.opening_hours,
            [day]: {
                ...data.opening_hours[day],
                [key]: value
            }
        });
    };

    const handleSocialLinksChange = (platform, value) => {
        setData('social_links', {
            ...data.social_links,
            [platform]: value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('seller.shop.update', shop.slug));
    };

    const themePresets = [
        { name: 'Ambre Gold', value: '#F59E0B' },
        { name: 'Émeraude Pro', value: '#10B981' },
        { name: 'Bleu Royal', value: '#3B82F6' },
        { name: 'Coral Chic', value: '#F43F5E' },
        { name: 'Indigo Modern', value: '#6366F1' },
        { name: 'Ardoise Pro', value: '#475569' }
    ];

    const daysTranslation = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
    };

    return (
        <ShopConsoleLayout shop={shop} title={`Configuration - ${shop.name}`}>
            <Head title={`Configuration - ${shop.name}`} />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* COMPACT & ELEGANT TOP BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/70 p-5 rounded-xl shadow-xs">
                    <div>
                        <h1 className="text-base font-semibold text-stone-900">Configuration de la Boutique</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Personnalisez les détails visuels, les infos légales et la présence en ligne de <span className="font-semibold text-stone-900">{shop.name}</span>
                        </p>
                    </div>

                    <a 
                        href={route('shop.public', shop.slug)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 flex items-center gap-1.5 transition-colors shrink-0"
                    >
                        <Eye className="w-3.5 h-3.5 text-stone-500" />
                        <span>Aperçu Vitrine Publique</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* FORM PANEL (7 COLUMNS) */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* STEP NAVIGATION HEADER */}
                        <div className="bg-white border border-stone-200/70 rounded-xl p-3 shadow-xs">
                            <div className="flex items-center justify-between">
                                {stepsList.map((s, index) => (
                                    <React.Fragment key={s.id}>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(s.id)}
                                            className="flex items-center gap-2 focus:outline-none"
                                        >
                                            <span className={`w-6 h-6 rounded-md flex items-center justify-center font-medium text-xs transition-all ${
                                                step === s.id 
                                                    ? 'bg-amber-500 text-amber-950 shadow-xs font-semibold' 
                                                    : step > s.id 
                                                        ? 'bg-emerald-500 text-white font-semibold' 
                                                        : 'bg-stone-100 text-stone-500'
                                            }`}>
                                                {s.id}
                                            </span>
                                            <span className={`text-xs hidden sm:inline ${step === s.id ? 'font-semibold text-stone-900' : 'font-normal text-stone-500'}`}>
                                                {s.name}
                                            </span>
                                        </button>
                                        {index < stepsList.length - 1 && (
                                            <div className="flex-1 h-px mx-2 bg-stone-200" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* FORM CARD */}
                        <div className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-xs">
                            <form onSubmit={submit} className="space-y-5">
                                
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div className="border-b border-stone-100 pb-3">
                                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                                <Store className="w-4 h-4 text-amber-600" />
                                                <span>Identité Visuelle & Thème de Marque</span>
                                            </h2>
                                            <p className="text-xs text-stone-400 font-normal">Définissez le nom public, le slogan et les couleurs de votre vitrine.</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-stone-700 mb-1">Nom Public de la Boutique *</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="ex: Electro World"
                                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                                required
                                            />
                                            {errors.name && <p className="text-[11px] text-red-600 mt-1 font-normal">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-stone-700 mb-1">Slogan Commercial</label>
                                            <input
                                                type="text"
                                                value={data.slogan}
                                                onChange={e => setData('slogan', e.target.value)}
                                                placeholder="ex: Le meilleur de la technologie certifiée"
                                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            />
                                            {errors.slogan && <p className="text-[11px] text-red-600 mt-1 font-normal">{errors.slogan}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-stone-700 mb-1">Description de l'Entreprise</label>
                                            <textarea
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                placeholder="Présentez votre entreprise, vos garanties et la gamme de vos produits..."
                                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none min-h-[90px] font-normal"
                                            />
                                        </div>

                                        {/* Logo & Banner Dropzones */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            <div>
                                                <label className="block text-xs font-medium text-stone-700 mb-1">Logo de Marque (Carré 1:1)</label>
                                                <div className="border border-dashed border-stone-300 rounded-xl p-3.5 text-center bg-stone-50 hover:bg-stone-100 transition-colors relative cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleFileChange(e, 'logo')}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1 group-hover:text-amber-600 transition-colors" />
                                                    <span className="text-xs font-medium text-stone-700 block">Téléverser Logo</span>
                                                    <span className="text-[10px] text-stone-400 block font-normal">PNG, JPG (Max 2 Mo)</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-stone-700 mb-1">Bannière de Couverture (16:9)</label>
                                                <div className="border border-dashed border-stone-300 rounded-xl p-3.5 text-center bg-stone-50 hover:bg-stone-100 transition-colors relative cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleFileChange(e, 'banner')}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1 group-hover:text-amber-600 transition-colors" />
                                                    <span className="text-xs font-medium text-stone-700 block">Téléverser Bannière</span>
                                                    <span className="text-[10px] text-stone-400 block font-normal">Format paysage (Max 5 Mo)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Theme color presets */}
                                        <div className="pt-2">
                                            <label className="block text-xs font-medium text-stone-700 mb-1.5">Couleur d'Accentuation du Thème</label>
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                                {themePresets.map((preset) => (
                                                    <button
                                                        key={preset.value}
                                                        type="button"
                                                        onClick={() => setData('theme_color', preset.value)}
                                                        className={`p-2 rounded-xl border text-[11px] font-medium flex flex-col items-center gap-1 transition-all ${
                                                            data.theme_color === preset.value 
                                                                ? 'border-amber-500 bg-amber-50/50 text-amber-950 shadow-xs' 
                                                                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.value }} />
                                                        <span>{preset.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="border-b border-stone-100 pb-3">
                                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                <span>Informations Légales & Certification Vendeur</span>
                                            </h2>
                                            <p className="text-xs text-stone-400 font-normal">Détails affichés sur votre profil certifié Alibaba Verified Supplier.</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-stone-700 mb-1">Raison Sociale de l'Entreprise *</label>
                                            <input
                                                type="text"
                                                value={data.company_name}
                                                onChange={e => setData('company_name', e.target.value)}
                                                placeholder="ex: Electro World S.A.R.L"
                                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-stone-700 mb-1">Numéro RCCM / Patente Commerciale</label>
                                            <input
                                                type="text"
                                                value={data.registration_number}
                                                onChange={e => setData('registration_number', e.target.value)}
                                                placeholder="ex: RC/DLA/2026/B/1024"
                                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-stone-700 mb-1">Adresse Officielle du Siège / Entrepôt *</label>
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                placeholder="ex: Akwa, Rue Deido, Douala, Cameroun"
                                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div className="border-b border-stone-100 pb-3">
                                            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-600" />
                                                <span>Horaires d'Ouverture & Coordonnées Support</span>
                                            </h2>
                                            <p className="text-xs text-stone-400 font-normal">Informations d'assistance clientèle pour vos acheteurs.</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-stone-700 mb-1">Téléphone de Contact Client *</label>
                                                <input
                                                    type="tel"
                                                    value={data.phone_contact}
                                                    onChange={e => setData('phone_contact', e.target.value)}
                                                    placeholder="ex: +237 690 12 34 56"
                                                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-stone-700 mb-1">E-mail Support Client *</label>
                                                <input
                                                    type="email"
                                                    value={data.email_contact}
                                                    onChange={e => setData('email_contact', e.target.value)}
                                                    placeholder="ex: support@electroworld.com"
                                                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Opening Hours Schedule */}
                                        <div className="pt-2 space-y-2">
                                            <label className="block text-xs font-medium text-stone-700">Grille des Horaires d'Ouverture</label>
                                            <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden text-xs">
                                                {Object.keys(data.opening_hours).map((day) => (
                                                    <div key={day} className="flex items-center justify-between p-2.5 bg-white hover:bg-stone-50/50 transition-colors">
                                                        <div className="flex items-center gap-2.5">
                                                            <input
                                                                type="checkbox"
                                                                id={`check-${day}`}
                                                                checked={data.opening_hours[day].active}
                                                                onChange={e => handleOpeningHoursChange(day, 'active', e.target.checked)}
                                                                className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                                            />
                                                            <label htmlFor={`check-${day}`} className="font-medium text-stone-700 min-w-[70px]">
                                                                {daysTranslation[day]}
                                                            </label>
                                                        </div>

                                                        {data.opening_hours[day].active ? (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="time"
                                                                    value={data.opening_hours[day].open}
                                                                    onChange={e => handleOpeningHoursChange(day, 'open', e.target.value)}
                                                                    className="px-2 py-1 border border-stone-200 rounded-md text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                                                />
                                                                <span className="text-stone-400 font-normal">à</span>
                                                                <input
                                                                    type="time"
                                                                    value={data.opening_hours[day].close}
                                                                    onChange={e => handleOpeningHoursChange(day, 'close', e.target.value)}
                                                                    className="px-2 py-1 border border-stone-200 rounded-md text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="text-[11px] font-medium text-red-600 uppercase pr-2">Fermé</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation buttons */}
                                <div className="border-t border-stone-100 pt-4 flex justify-between">
                                    {step > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
                                        >
                                            Précédent
                                        </button>
                                    ) : <div />}

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step + 1)}
                                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-lg text-xs font-semibold shadow-xs"
                                        >
                                            Suivant
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 rounded-lg text-xs font-semibold shadow-xs"
                                        >
                                            {processing ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                                        </button>
                                    )}
                                </div>

                            </form>
                        </div>
                    </div>

                    {/* MOCK STORE FRONT PREVIEW (5 COLUMNS) */}
                    <div className="lg:col-span-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider">Aperçu Vitrine en Temps Réel</h3>
                            <span className="text-[10px] text-amber-800 font-medium">Style Alibaba Certifié</span>
                        </div>

                        <div className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden shadow-xs flex flex-col text-stone-800">
                            {/* Banner area */}
                            <div className="h-28 w-full relative bg-stone-900 overflow-hidden flex items-center justify-center">
                                {bannerPreview ? (
                                    <img src={bannerPreview} alt="Bannière" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${data.theme_color} 0%, #171717 100%)` }} />
                                )}
                                <div className="absolute inset-0 bg-black/30" />
                            </div>

                            {/* Store Header bar */}
                            <div className="p-5 relative flex-1 flex flex-col justify-between space-y-4">
                                <div className="flex justify-between items-end -mt-10 z-10">
                                    <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-md border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Store className="w-8 h-8 text-stone-400" />
                                        )}
                                    </div>
                                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                                        <span>Verified Gold Supplier</span>
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-base font-semibold text-stone-900">
                                        {data.name || 'Nom de ma boutique'}
                                    </h4>
                                    <p className="text-xs text-stone-500 italic font-normal">
                                        "{data.slogan || 'Slogan commercial de la boutique'}"
                                    </p>
                                    <p className="text-xs text-stone-600 font-normal line-clamp-2 leading-relaxed pt-1">
                                        {data.description || 'Description courte du catalogue et de l\'entreprise.'}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs font-normal text-stone-600">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span className="font-semibold text-stone-900">{data.company_name || 'Raison Sociale'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                                        <span>{data.address || 'Adresse physique de l\'entrepôt'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </ShopConsoleLayout>
    );
}
