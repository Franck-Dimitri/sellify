import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, Store, ShieldCheck, MapPin, Phone, Mail, Clock, Globe, HelpCircle, Badge } from 'lucide-react';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import { Card, CardContent } from '../../../Components/ui/Card';

export default function Create() {
    const [step, setStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slogan: '',
        description: '',
        logo: null,
        banner: null,
        company_name: '',
        registration_number: '',
        address: '',
        phone_contact: '',
        email_contact: '',
        theme_color: '#EAB308',
        opening_hours: {
            monday: { active: true, open: '08:00', close: '18:00' },
            tuesday: { active: true, open: '08:00', close: '18:00' },
            wednesday: { active: true, open: '08:00', close: '18:00' },
            thursday: { active: true, open: '08:00', close: '18:00' },
            friday: { active: true, open: '08:00', close: '18:00' },
            saturday: { active: false, open: '09:00', close: '17:00' },
            sunday: { active: false, open: '09:00', close: '13:00' },
        },
        social_links: {
            whatsapp: '',
            facebook: '',
            instagram: '',
        }
    });

    const stepsList = [
        { id: 1, name: 'Identité Visuelle' },
        { id: 2, name: 'Informations Légales' },
        { id: 3, name: 'Horaires & Contact' }
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
        post(route('seller.shop.store'));
    };

    // Preset theme colors (premium palette)
    const themePresets = [
        { name: 'Jaune Or', value: '#EAB308' },
        { name: 'Émeraude', value: '#10B981' },
        { name: 'Bleu Royal', value: '#3B82F6' },
        { name: 'Rouge Corail', value: '#F43F5E' },
        { name: 'Indigo Premium', value: '#6366F1' },
        { name: 'Slate Chic', value: '#475569' }
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
        <>
            <Head title="Créer ma boutique professionnelle" />
            <div className="min-h-screen bg-surface-50 font-sans flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-surface-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center space-x-4">
                        <Link href={route('seller.dashboard')} className="p-2 text-surface-500 hover:text-surface-800 hover:bg-surface-100 rounded-xl transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="font-extrabold text-lg tracking-tight text-surface-900">Configuration de la Boutique</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-surface-400 bg-surface-100 px-3 py-1.5 rounded-full border border-surface-200">
                        <ShieldCheck className="w-4 h-4 text-secondary-500" />
                        <span>Profil Vendeur Vérifié</span>
                    </div>
                </header>

                <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Form Panel (8 columns) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Step Navigation Card */}
                        <div className="bg-white border border-surface-200 rounded-2xl p-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                {stepsList.map((s, index) => (
                                    <React.Fragment key={s.id}>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(s.id)}
                                            className="flex items-center space-x-2 focus:outline-none"
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 
                                                ${step === s.id 
                                                    ? 'bg-primary-500 text-surface-950 shadow-md ring-2 ring-primary-200' 
                                                    : step > s.id 
                                                        ? 'bg-secondary-500 text-white' 
                                                        : 'bg-surface-100 text-surface-500'
                                                }`}
                                            >
                                                {s.id}
                                            </span>
                                            <span className={`text-xs font-bold hidden sm:inline ${step === s.id ? 'text-surface-900' : 'text-surface-400'}`}>
                                                {s.name}
                                            </span>
                                        </button>
                                        {index < stepsList.length - 1 && (
                                            <div className="flex-1 h-0.5 mx-2 bg-surface-100 rounded" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Form Card */}
                        <Card className="border-surface-200">
                            <form onSubmit={submit} className="space-y-6">
                                {step === 1 && (
                                    <div className="space-y-5 animate-scale-in">
                                        <div className="border-b border-surface-100 pb-3">
                                            <h2 className="text-base font-bold text-surface-900 flex items-center space-x-2">
                                                <Store className="w-5 h-5 text-primary-500" />
                                                <span>Identité Visuelle & Thème</span>
                                            </h2>
                                            <p className="text-xs text-surface-400">Configurez le nom public et le style graphique de votre boutique.</p>
                                        </div>

                                        <Input
                                            label="Nom de la boutique"
                                            name="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Ex: Electro World"
                                            required
                                            error={errors.name}
                                        />

                                        <Input
                                            label="Slogan Commercial"
                                            name="slogan"
                                            value={data.slogan}
                                            onChange={e => setData('slogan', e.target.value)}
                                            placeholder="Ex: Le meilleur de la technologie aux meilleurs prix"
                                            error={errors.slogan}
                                        />

                                        <div className="flex flex-col space-y-1.5">
                                            <label className="text-sm font-semibold text-surface-700">Description</label>
                                            <textarea
                                                className="w-full px-3.5 py-2 text-surface-900 bg-white border border-surface-200 rounded-lg outline-none text-sm min-h-[100px] focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
                                                placeholder="Présentez votre entreprise, vos valeurs, vos gammes de produits..."
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            />
                                            {errors.description && <p className="text-xs text-accent-500 font-medium">{errors.description}</p>}
                                        </div>

                                        {/* File upload slots */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-surface-700">Logo de la boutique (1:1)</label>
                                                <div className="border-2 border-dashed border-surface-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary-400 transition-all bg-surface-50 cursor-pointer relative overflow-hidden group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleFileChange(e, 'logo')}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Upload className="w-6 h-6 text-surface-400 mb-2 group-hover:text-primary-500 transition-colors" />
                                                    <span className="text-xs font-semibold text-surface-600">Choisir un logo</span>
                                                    <span className="text-[10px] text-surface-400 mt-1">PNG, JPG (Max 2 Mo)</span>
                                                </div>
                                                {errors.logo && <p className="text-xs text-accent-500 font-medium">{errors.logo}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-surface-700">Bannière (16:9)</label>
                                                <div className="border-2 border-dashed border-surface-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary-400 transition-all bg-surface-50 cursor-pointer relative overflow-hidden group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleFileChange(e, 'banner')}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Upload className="w-6 h-6 text-surface-400 mb-2 group-hover:text-primary-500 transition-colors" />
                                                    <span className="text-xs font-semibold text-surface-600">Choisir une bannière</span>
                                                    <span className="text-[10px] text-surface-400 mt-1">Format paysage (Max 5 Mo)</span>
                                                </div>
                                                {errors.banner && <p className="text-xs text-accent-500 font-medium">{errors.banner}</p>}
                                            </div>
                                        </div>

                                        {/* Theme color presets picker */}
                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-surface-700">Couleur d'accentuation (Style de la page)</label>
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                                {themePresets.map((preset) => (
                                                    <button
                                                        key={preset.value}
                                                        type="button"
                                                        onClick={() => setData('theme_color', preset.value)}
                                                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all duration-200
                                                            ${data.theme_color === preset.value 
                                                                ? 'border-surface-900 bg-surface-50 shadow-sm ring-1 ring-surface-900' 
                                                                : 'border-surface-200 bg-white hover:bg-surface-50'
                                                            }`}
                                                    >
                                                        <span className="w-5 h-5 rounded-md mb-1 shadow-inner border border-black/10" style={{ backgroundColor: preset.value }} />
                                                        <span className="text-[10px] tracking-tight">{preset.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-5 animate-scale-in">
                                        <div className="border-b border-surface-100 pb-3">
                                            <h2 className="text-base font-bold text-surface-900 flex items-center space-x-2">
                                                <ShieldCheck className="w-5 h-5 text-secondary-500" />
                                                <span>Informations Légales & Certification</span>
                                            </h2>
                                            <p className="text-xs text-surface-400">Ces détails augmentent la confiance des acheteurs (style Alibaba Verified Profile).</p>
                                        </div>

                                        <Input
                                            label="Nom légal de l'entreprise / Raison sociale"
                                            name="company_name"
                                            value={data.company_name}
                                            onChange={e => setData('company_name', e.target.value)}
                                            placeholder="Ex: Electro World S.A.R.L"
                                            required
                                            error={errors.company_name}
                                        />

                                        <Input
                                            label="Numéro RCCM / Patente / ID Unique"
                                            name="registration_number"
                                            value={data.registration_number}
                                            onChange={e => setData('registration_number', e.target.value)}
                                            placeholder="Ex: RC/DLA/2026/B/1024 (Optionnel)"
                                            error={errors.registration_number}
                                        />

                                        <Input
                                            label="Adresse physique de l'entrepôt ou du magasin"
                                            name="address"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="Ex: Akwa, Rue Pavée, Douala, Cameroun"
                                            required
                                            error={errors.address}
                                        />
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-5 animate-scale-in">
                                        <div className="border-b border-surface-100 pb-3">
                                            <h2 className="text-base font-bold text-surface-900 flex items-center space-x-2">
                                                <Clock className="w-5 h-5 text-primary-500" />
                                                <span>Horaires d'Ouverture & Contacts Directs</span>
                                            </h2>
                                            <p className="text-xs text-surface-400">Permettez aux clients de vous contacter directement via WhatsApp ou e-mail.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Téléphone / WhatsApp de contact"
                                                name="phone_contact"
                                                value={data.phone_contact}
                                                onChange={e => setData('phone_contact', e.target.value)}
                                                placeholder="Ex: +237 677 888 999"
                                                required
                                                error={errors.phone_contact}
                                            />
                                            <Input
                                                label="E-mail de support client"
                                                name="email_contact"
                                                type="email"
                                                value={data.email_contact}
                                                onChange={e => setData('email_contact', e.target.value)}
                                                placeholder="Ex: contact@electroworld.com"
                                                required
                                                error={errors.email_contact}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Lien WhatsApp direct (Numéro au format international)"
                                                name="whatsapp"
                                                value={data.social_links.whatsapp}
                                                onChange={e => handleSocialLinksChange('whatsapp', e.target.value)}
                                                placeholder="Ex: 237677888999"
                                            />
                                            <Input
                                                label="Lien de page Facebook"
                                                name="facebook"
                                                value={data.social_links.facebook}
                                                onChange={e => handleSocialLinksChange('facebook', e.target.value)}
                                                placeholder="Ex: facebook.com/electroworld"
                                            />
                                        </div>

                                        {/* Opening Hours Grid */}
                                        <div className="space-y-2.5">
                                            <label className="text-sm font-semibold text-surface-700 flex items-center space-x-1.5">
                                                <span>Grille Horaires d'Ouverture</span>
                                            </label>
                                            <div className="border border-surface-200 rounded-xl divide-y divide-surface-100 overflow-hidden">
                                                {Object.keys(data.opening_hours).map((day) => (
                                                    <div key={day} className="flex items-center justify-between p-3 bg-white text-sm hover:bg-surface-50 transition-colors">
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="checkbox"
                                                                id={`check-${day}`}
                                                                checked={data.opening_hours[day].active}
                                                                onChange={e => handleOpeningHoursChange(day, 'active', e.target.checked)}
                                                                className="w-4.5 h-4.5 text-primary-500 rounded border-surface-300 focus:ring-primary-400"
                                                            />
                                                            <label htmlFor={`check-${day}`} className="font-bold text-surface-700 select-none min-w-[70px]">
                                                                {daysTranslation[day]}
                                                            </label>
                                                        </div>

                                                        {data.opening_hours[day].active ? (
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="time"
                                                                    value={data.opening_hours[day].open}
                                                                    onChange={e => handleOpeningHoursChange(day, 'open', e.target.value)}
                                                                    className="px-2 py-1 border border-surface-200 rounded-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                                />
                                                                <span className="text-surface-400">à</span>
                                                                <input
                                                                    type="time"
                                                                    value={data.opening_hours[day].close}
                                                                    onChange={e => handleOpeningHoursChange(day, 'close', e.target.value)}
                                                                    className="px-2 py-1 border border-surface-200 rounded-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs font-bold text-accent-500 uppercase pr-4">Fermé</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step navigation actions */}
                                <div className="border-t border-surface-100 pt-4 flex justify-between">
                                    {step > 1 ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(step - 1)}
                                        >
                                            Précédent
                                        </Button>
                                    ) : (
                                        <div />
                                    )}

                                    {step < 3 ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => setStep(step + 1)}
                                        >
                                            Suivant
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="success"
                                            disabled={processing}
                                        >
                                            {processing ? 'Création en cours...' : 'Finaliser la Boutique'}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Preview Panel (5 columns) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-surface-400 uppercase tracking-wider">Aperçu en temps réel</h3>
                            <span className="text-[10px] text-surface-400 font-semibold flex items-center space-x-1">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Alibaba-Style Storefront</span>
                            </span>
                        </div>

                        {/* The Mock Store Card */}
                        <div className="bg-white border border-surface-200 rounded-3xl overflow-hidden shadow-md flex flex-col min-h-[480px]">
                            {/* Banner area */}
                            <div className="h-32 w-full relative bg-surface-800 overflow-hidden flex items-center justify-center">
                                {bannerPreview ? (
                                    <img src={bannerPreview} alt="Aperçu Bannière" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-20" style={{ backgroundImage: `linear-gradient(135deg, ${data.theme_color} 0%, #111827 100%)` }} />
                                )}
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="absolute bottom-3 left-4 text-white z-10 flex items-center space-x-2">
                                    <span className="text-xs font-bold px-2 py-0.5 bg-black/40 rounded-full border border-white/20">
                                        Starter Plan
                                    </span>
                                </div>
                            </div>

                            {/* Store Header bar */}
                            <div className="px-6 pb-6 relative flex-1 flex flex-col justify-between">
                                {/* Logo container (shifted up) */}
                                <div className="flex justify-between items-end -mt-10 mb-4 z-10">
                                    <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-md border border-surface-100 overflow-hidden flex items-center justify-center">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Aperçu Logo" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <Store className="w-10 h-10 text-surface-300" />
                                        )}
                                    </div>
                                    <Badge variant="success" className="h-6 flex items-center space-x-1 bg-yellow-50 text-yellow-800 border-yellow-300">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                        <span>Verified Supplier</span>
                                    </Badge>
                                </div>

                                {/* Store Identity Info */}
                                <div className="space-y-1.5 flex-1">
                                    <h4 className="text-xl font-extrabold text-surface-900 tracking-tight">
                                        {data.name || 'Nom de ma boutique'}
                                    </h4>
                                    <p className="text-sm text-surface-500 italic font-medium">
                                        "{data.slogan || 'Votre slogan commercial ici...'}"
                                    </p>
                                    <p className="text-xs text-surface-400 line-clamp-3 leading-relaxed mt-2 pt-2 border-t border-surface-100">
                                        {data.description || 'Description courte du catalogue et des services offerts par votre entreprise...'}
                                    </p>
                                </div>

                                {/* Certification details (Alibaba style) */}
                                <div className="mt-4 pt-3 border-t border-surface-100 space-y-2 text-xs">
                                    <div className="flex items-center space-x-2 text-surface-600">
                                        <ShieldCheck className="w-4.5 h-4.5 text-secondary-500 shrink-0" />
                                        <span className="font-semibold">{data.company_name || 'Raison Sociale de l\'entreprise'}</span>
                                    </div>
                                    {data.registration_number && (
                                        <div className="text-[10px] text-surface-400 pl-6">
                                            RCCM: <span className="font-bold">{data.registration_number}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 text-surface-600">
                                        <MapPin className="w-4.5 h-4.5 text-surface-400 shrink-0" />
                                        <span>{data.address || 'Adresse de l\'entrepôt'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-surface-600">
                                        <Phone className="w-4.5 h-4.5 text-surface-400 shrink-0" />
                                        <span>{data.phone_contact || 'Téléphone contact'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-surface-600">
                                        <Mail className="w-4.5 h-4.5 text-surface-400 shrink-0" />
                                        <span>{data.email_contact || 'E-mail support'}</span>
                                    </div>
                                </div>

                                {/* Call to action preview */}
                                <div className="mt-6 flex space-x-2">
                                    <button 
                                        type="button" 
                                        disabled 
                                        className="flex-1 py-2 text-xs font-bold rounded-xl border border-surface-200 bg-white text-surface-700 flex items-center justify-center space-x-1 cursor-default"
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Horaires</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        disabled 
                                        className="flex-1 py-2 text-xs font-bold rounded-xl text-white flex items-center justify-center space-x-1.5 shadow-sm opacity-90 cursor-default"
                                        style={{ backgroundColor: data.theme_color }}
                                    >
                                        <Globe className="w-3.5 h-3.5" />
                                        <span>Contacter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
