import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { 
    User, 
    Phone, 
    Mail, 
    Lock, 
    CheckCircle2, 
    MapPin, 
    Plus, 
    Trash2, 
    Edit3, 
    Star, 
    Camera, 
    CreditCard, 
    Smartphone, 
    Eye, 
    X,
    Upload,
    Navigation
} from 'lucide-react';

export default function Profile({ user, addresses = [] }) {
    // 1. Profile Info & Payment Form
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        momo_number: user.momo_number || user.phone || '',
        om_number: user.om_number || '',
        preferred_payment_method: user.preferred_payment_method || 'momo',
        default_delivery_address: user.default_delivery_address || '',
        default_city: user.default_city || 'Douala',
        avatar: null,
        password: '',
        password_confirmation: '',
    });

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    // 2. Address Modal State (Add / Edit)
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [zoomPhotoUrl, setZoomPhotoUrl] = useState(null);

    const addressForm = useForm({
        label: 'Domicile',
        recipient_name: user.first_name ? `${user.first_name} ${user.last_name}` : '',
        recipient_phone: user.phone || '',
        city: 'Douala',
        quarter: '',
        address: '',
        landmark_description: '',
        landmark_photo: null,
        latitude: '',
        longitude: '',
        is_default: false,
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        post(route('customer.profile.update'), {
            forceFormData: true,
        });
    };

    const openCreateAddressModal = () => {
        setEditingAddress(null);
        addressForm.reset();
        addressForm.setData({
            label: 'Domicile',
            recipient_name: `${user.first_name} ${user.last_name}`,
            recipient_phone: user.phone || '',
            city: user.default_city || 'Douala',
            quarter: '',
            address: '',
            landmark_description: '',
            landmark_photo: null,
            latitude: '',
            longitude: '',
            is_default: addresses.length === 0,
        });
        setAddressModalOpen(true);
    };

    const openEditAddressModal = (addr) => {
        setEditingAddress(addr);
        addressForm.setData({
            label: addr.label || 'Domicile',
            recipient_name: addr.recipient_name || '',
            recipient_phone: addr.recipient_phone || '',
            city: addr.city || 'Douala',
            quarter: addr.quarter || '',
            address: addr.address || '',
            landmark_description: addr.landmark_description || '',
            landmark_photo: null,
            latitude: addr.latitude || '',
            longitude: addr.longitude || '',
            is_default: addr.is_default || false,
        });
        setAddressModalOpen(true);
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            addressForm.post(route('customer.addresses.update', editingAddress.id), {
                forceFormData: true,
                onSuccess: () => setAddressModalOpen(false),
            });
        } else {
            addressForm.post(route('customer.addresses.store'), {
                forceFormData: true,
                onSuccess: () => setAddressModalOpen(false),
            });
        }
    };

    const handleDeleteAddress = (id) => {
        if (confirm('Voulez-vous vraiment supprimer cette adresse de livraison ?')) {
            router.delete(route('customer.addresses.destroy', id));
        }
    };

    const handleSetDefaultAddress = (id) => {
        router.post(route('customer.addresses.default', id));
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    addressForm.setData((prev) => ({
                        ...prev,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    }));
                },
                (err) => alert('Impossible de récupérer la position GPS : ' + err.message)
            );
        }
    };

    return (
        <CustomerLayout title="Mon Profil & Adresses de Livraison">
            <Head title="Profil & Adresses - Espace Client" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16 max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-2xl shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-yellow-700 uppercase tracking-wide">
                            <User className="w-4 h-4 text-yellow-600" />
                            <span>Paramètres du Compte Acheteur</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1">
                            Profil & Adresses Imprécises
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Gérez vos informations personnelles, vos repères visuels de livraison et vos numéros Mobile Money.
                        </p>
                    </div>
                </div>

                {/* Main Profile & Payment Settings Form */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                            <User className="w-4 h-4 text-yellow-600" />
                            <span>1. Informations Personnelles & Photo</span>
                        </div>
                    </div>

                    {recentlySuccessful && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Vos informations ont été enregistrées avec succès.</span>
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs">
                        
                        {/* Avatar Picker */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 bg-stone-100 shrink-0 shadow-sm">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-yellow-700 bg-yellow-100">
                                        {user.first_name?.charAt(0) || 'C'}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="cursor-pointer px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors">
                                    <Camera className="w-3.5 h-3.5 text-stone-600" />
                                    <span>Changer la photo de profil</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setData('avatar', file);
                                                setAvatarPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>
                                <p className="text-[10px] text-stone-400">Format JPG, PNG max 3 Mo.</p>
                            </div>
                        </div>

                        {/* Name Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-stone-700 block mb-1">Prénom</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.first_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="font-semibold text-stone-700 block mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.last_name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.last_name}</p>}
                            </div>
                        </div>

                        {/* Contacts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-stone-700 block mb-1">Adresse Email (Compte Escrow)</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-stone-400 mt-0.5">Identifiant certifié pour les séquestres et factures.</p>
                            </div>

                            <div>
                                <label className="font-semibold text-stone-700 block mb-1">Téléphone Principal</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    required
                                />
                                {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Mobile Money Accounts (Sub-Module 2.1.2) */}
                        <div className="pt-3 border-t border-stone-100 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                                <Smartphone className="w-4 h-4 text-yellow-600" />
                                <span>Moyens de Paiement Enregistrés (Mobile Money)</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 bg-yellow-50/50 border border-yellow-200 rounded-xl space-y-1.5">
                                    <label className="font-bold text-stone-800 flex items-center justify-between">
                                        <span>MTN Mobile Money (MoMo)</span>
                                        <input
                                            type="radio"
                                            name="preferred_payment"
                                            checked={data.preferred_payment_method === 'momo'}
                                            onChange={() => setData('preferred_payment_method', 'momo')}
                                        />
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Ex: 670 00 00 00"
                                        value={data.momo_number}
                                        onChange={(e) => setData('momo_number', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                                    />
                                </div>

                                <div className="p-3 bg-orange-50/50 border border-orange-200 rounded-xl space-y-1.5">
                                    <label className="font-bold text-stone-800 flex items-center justify-between">
                                        <span>Orange Money (OM)</span>
                                        <input
                                            type="radio"
                                            name="preferred_payment"
                                            checked={data.preferred_payment_method === 'orange_money'}
                                            onChange={() => setData('preferred_payment_method', 'orange_money')}
                                        />
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Ex: 690 00 00 00"
                                        value={data.om_number}
                                        onChange={(e) => setData('om_number', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Optional Change */}
                        <div className="pt-3 border-t border-stone-100 space-y-3">
                            <label className="font-bold text-stone-900 block">Modifier le mot de passe (Optionnel)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Nouveau mot de passe"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Confirmer le nouveau mot de passe"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-yellow-500 focus:bg-white text-stone-800"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                            >
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. MULTI-ADDRESSES MANAGEMENT WITH VISUAL LANDMARKS (Sub-Module 2.1.2) */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div>
                            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-yellow-600" />
                                <span>2. Mes Adresses de Livraison & Repères Visuels</span>
                            </h3>
                            <p className="text-stone-500 text-[11px] mt-0.5">
                                Enregistrez plusieurs lieux de livraison (Domicile, Bureau) avec photo du point de repère pour orienter le livreur.
                            </p>
                        </div>

                        <button
                            onClick={openCreateAddressModal}
                            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter une adresse</span>
                        </button>
                    </div>

                    {/* Addresses List */}
                    {addresses.length === 0 ? (
                        <div className="text-center py-8 bg-stone-50 border border-dashed border-stone-200 rounded-2xl space-y-2">
                            <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
                            <p className="text-xs font-semibold text-stone-700">Aucune adresse de livraison enregistrée</p>
                            <p className="text-[11px] text-stone-400">Ajoutez votre adresse principale avec repère visuel pour faciliter la réception de vos commandes.</p>
                            <button
                                onClick={openCreateAddressModal}
                                className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-xs"
                            >
                                Créer mon adresse
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <div 
                                    key={addr.id}
                                    className={`p-4 rounded-2xl border text-xs relative space-y-3 transition-all ${
                                        addr.is_default 
                                            ? 'bg-yellow-50/40 border-yellow-400 ring-2 ring-yellow-200' 
                                            : 'bg-white border-stone-200 hover:border-stone-300'
                                    }`}
                                >
                                    {/* Header & Badges */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                                            <span>{addr.label}</span>
                                            {addr.is_default && (
                                                <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-950 text-[10px] font-bold">
                                                    Par défaut
                                                </span>
                                            )}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => openEditAddressModal(addr)}
                                                className="p-1 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-lg"
                                                title="Modifier"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Address text */}
                                    <div className="space-y-0.5 text-stone-600">
                                        <p className="font-semibold text-stone-900">{addr.recipient_name} ({addr.recipient_phone})</p>
                                        <p>{addr.address}, {addr.quarter ? `${addr.quarter}, ` : ''}{addr.city}</p>
                                    </div>

                                    {/* Visual Landmark Box */}
                                    {addr.landmark_description && (
                                        <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1.5">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                                                📍 Point de repère terrain :
                                            </span>
                                            <p className="text-[11px] text-stone-700 font-medium leading-relaxed">
                                                {addr.landmark_description}
                                            </p>
                                            
                                            {/* Landmark Photo with Zoom */}
                                            {addr.landmark_photo_path && (
                                                <div 
                                                    onClick={() => setZoomPhotoUrl(`/storage/${addr.landmark_photo_path}`)}
                                                    className="relative w-full h-24 rounded-lg overflow-hidden border border-stone-200 cursor-pointer group bg-stone-900"
                                                >
                                                    <img 
                                                        src={`/storage/${addr.landmark_photo_path}`} 
                                                        alt="Point de repère" 
                                                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white text-[11px] font-bold gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Agrandir le repère</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Set Default Button */}
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => handleSetDefaultAddress(addr.id)}
                                            className="w-full py-1.5 text-center text-[11px] font-bold text-yellow-800 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200"
                                        >
                                            Définir comme adresse principale
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* ADDRESS MODAL (ADD / EDIT) */}
            {addressModalOpen && (
                <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-yellow-600" />
                                <span>{editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse de livraison'}</span>
                            </h3>
                            <button onClick={() => setAddressModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-stone-700 block mb-1">Libellé (ex: Domicile, Bureau)</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.label}
                                        onChange={(e) => addressForm.setData('label', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-stone-700 block mb-1">Ville</label>
                                    <select
                                        value={addressForm.data.city}
                                        onChange={(e) => addressForm.setData('city', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                                    >
                                        <option value="Douala">Douala</option>
                                        <option value="Yaoundé">Yaoundé</option>
                                        <option value="Bafoussam">Bafoussam</option>
                                        <option value="Garoua">Garoua</option>
                                        <option value="Kribi">Kribi</option>
                                        <option value="Autre">Autre Ville</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-stone-700 block mb-1">Nom du Destinataire</label>
                                    <input
                                        type="text"
                                        value={addressForm.data.recipient_name}
                                        onChange={(e) => addressForm.setData('recipient_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-stone-700 block mb-1">Téléphone de Contact</label>
                                    <input
                                        type="tel"
                                        value={addressForm.data.recipient_phone}
                                        onChange={(e) => addressForm.setData('recipient_phone', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-stone-700 block mb-1">Adresse / Ruelle & Quartier</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Rue Toyota, Bonapriso"
                                    value={addressForm.data.address}
                                    onChange={(e) => addressForm.setData('address', e.target.value)}
                                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                                    required
                                />
                            </div>

                            {/* Precise Visual Landmark Description */}
                            <div className="p-3 bg-yellow-50/50 border border-yellow-200 rounded-xl space-y-2">
                                <label className="font-bold text-stone-900 block flex items-center justify-between">
                                    <span>Description du Point de Repère (Indispensable en Afrique)</span>
                                    <span className="text-[10px] text-yellow-800 font-normal">Orientation livreur</span>
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Ex: Portail bleu métallique, face pharmacie du Soleil, 2e ruelle à droite..."
                                    value={addressForm.data.landmark_description}
                                    onChange={(e) => addressForm.setData('landmark_description', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                                />

                                {/* Landmark Photo File Upload */}
                                <div>
                                    <label className="font-bold text-stone-700 block mb-1">Photo du Repère Visuel (Façade / Carrefour)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => addressForm.setData('landmark_photo', e.target.files[0])}
                                        className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800"
                                    />
                                </div>
                            </div>

                            {/* GPS Coordinates & Position auto-detect */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold flex items-center gap-1.5"
                                >
                                    <Navigation className="w-3.5 h-3.5 text-yellow-600" />
                                    <span>Prendre ma position GPS actuelle</span>
                                </button>

                                {addressForm.data.latitude && (
                                    <span className="font-mono text-[10px] text-stone-500">
                                        {Number(addressForm.data.latitude).toFixed(4)}, {Number(addressForm.data.longitude).toFixed(4)}
                                    </span>
                                )}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={addressForm.data.is_default}
                                    onChange={(e) => addressForm.setData('is_default', e.target.checked)}
                                />
                                <span className="text-xs font-semibold text-stone-800">Définir comme adresse de livraison principale</span>
                            </label>

                            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => setAddressModalOpen(false)}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressForm.processing}
                                    className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl shadow-xs"
                                >
                                    Enregistrer l'adresse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FULLSCREEN LANDMARK PHOTO ZOOM */}
            {zoomPhotoUrl && (
                <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-4 max-w-xl w-full space-y-3 relative shadow-2xl">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                                <Camera className="w-4 h-4 text-yellow-600" />
                                <span>Point de Repère Visuel Client</span>
                            </span>
                            <button onClick={() => setZoomPhotoUrl(null)} className="p-1 text-stone-400 hover:text-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-full max-h-[75vh] rounded-xl overflow-hidden bg-stone-900">
                            <img src={zoomPhotoUrl} alt="Repère Agrandie" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            )}

        </CustomerLayout>
    );
}
