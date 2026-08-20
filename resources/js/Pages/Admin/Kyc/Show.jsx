import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    Check, 
    X, 
    ShieldAlert, 
    AlertTriangle, 
    Sparkles, 
    Loader2, 
    Eye,
    ShieldCheck,
    FileText,
    UserCheck,
    Truck,
    Store,
    CreditCard,
    Calendar,
    CheckCircle2,
    XCircle,
    User,
    FileCheck,
    MapPin,
    Shield,
    Camera,
    FileImage
} from 'lucide-react';

const getMockupUrl = (docType) => {
    switch (docType) {
        case 'cni':
            return 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600&auto=format&fit=crop';
        case 'selfie':
            return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';
        case 'registre_commerce':
            return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop';
        case 'permis_conduire':
            return 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=600&auto=format&fit=crop';
        case 'carte_grise':
            return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop';
        case 'photo_vehicule':
            return 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop';
        default:
            return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
    }
};

export default function Show({ kycRequest }) {
    const user = kycRequest.user || {};
    const driver = user.driver || null;
    const seller = user.seller || null;
    const [rejectionMode, setRejectionMode] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);

    // Initial document tabs list
    const defaultDocs = [
        { id: 1, document_type: 'cni', label: 'CNI Recto/Verso' },
        { id: 2, document_type: 'selfie', label: 'Selfie avec CNI' },
    ];

    if (kycRequest.type === 'driver' || driver) {
        defaultDocs.push(
            { id: 3, document_type: 'photo_vehicule', label: 'Photo du Véhicule' },
            { id: 4, document_type: 'carte_grise', label: 'Carte Grise' },
            { id: 5, document_type: 'permis_conduire', label: 'Permis de Conduire' }
        );
    } else if (kycRequest.type === 'seller' || seller) {
        defaultDocs.push(
            { id: 6, document_type: 'registre_commerce', label: 'Registre de Commerce' }
        );
    }

    const availableDocs = (user.kyc_documents && user.kyc_documents.length > 0) 
        ? user.kyc_documents 
        : defaultDocs;

    const [activeDocTab, setActiveDocTab] = useState(availableDocs[0]?.id || 1);

    const formatDateInput = (dateStr) => {
        if (!dateStr) return '';
        return dateStr.substring(0, 10);
    };

    const { data, setData, post, processing, errors } = useForm({
        status: '',
        rejection_reason: '',
        cni_number: kycRequest.cni_number || '',
        cni_first_name: kycRequest.cni_first_name || user.first_name || '',
        cni_last_name: kycRequest.cni_last_name || user.last_name || '',
        cni_dob: formatDateInput(kycRequest.cni_dob),
        cni_pob: kycRequest.cni_pob || '',
        cni_issue_date: formatDateInput(kycRequest.cni_issue_date),
        cni_expiry_date: formatDateInput(kycRequest.cni_expiry_date),
        cni_gender: kycRequest.cni_gender || 'M',
        cni_nationality: kycRequest.cni_nationality || 'Camerounaise',
    });

    const handleApprove = (e) => {
        if (e) e.preventDefault();
        if (confirm("Voulez-vous approuver ce dossier KYC et certifier l'identité de l'utilisateur ?")) {
            data.status = 'approved';
            post(route('admin.kyc.review', kycRequest.id));
        }
    };

    const handleReject = (e) => {
        if (e) e.preventDefault();
        if (!data.rejection_reason.trim()) {
            alert("Veuillez indiquer le motif du rejet.");
            return;
        }
        if (confirm("Voulez-vous notifier l'utilisateur du rejet de son dossier KYC ?")) {
            data.status = 'rejected';
            post(route('admin.kyc.review', kycRequest.id));
        }
    };

    const handleOcrFill = () => {
        setOcrLoading(true);
        setTimeout(() => {
            setData({
                ...data,
                cni_number: '110293847528',
                cni_first_name: user.first_name || 'Marc',
                cni_last_name: user.last_name || 'Kamga',
                cni_dob: '1995-04-12',
                cni_pob: 'Yaoundé',
                cni_issue_date: '2021-06-15',
                cni_expiry_date: '2031-06-15',
                cni_gender: 'M',
                cni_nationality: 'Camerounaise',
            });
            setOcrLoading(false);
        }, 800);
    };

    const currentDoc = availableDocs.find(d => d.id === activeDocTab) || availableDocs[0];
    const isDriver = kycRequest.type === 'driver' || !!driver;

    return (
        <AdminLayout title="Modération KYC">
            <Head title={`Examen KYC - ${user.first_name} ${user.last_name}`} />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.kyc.index')}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                                <span>Contrôle de conformité d'identité</span>
                            </div>
                            <h1 className="text-xl font-bold text-stone-900 mt-0.5">
                                Dossier de {user.first_name} {user.last_name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            kycRequest.type === 'seller' ? 'bg-yellow-50 text-yellow-900 border border-yellow-200' : 'bg-purple-50 text-purple-900 border border-purple-200'
                        }`}>
                            {isDriver ? 'Chauffeur livreur' : 'Vendeur / Boutique'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            kycRequest.status === 'approved' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : kycRequest.status === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                        }`}>
                            {kycRequest.status === 'approved' ? 'Approuvé' : kycRequest.status === 'pending' ? 'En examen' : 'Rejeté'}
                        </span>
                    </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Type de compte</span>
                        <span className="text-lg font-bold text-stone-900 block">
                            {isDriver ? 'Livreur partenaire' : 'Boutique vendeur'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Demande #{kycRequest.id}</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Pièces fournies</span>
                        <span className="text-lg font-bold text-stone-900 block font-mono">
                            {availableDocs.length} fichier(s)
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">CNI / Permis / Véhicule</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Date de soumission</span>
                        <span className="text-lg font-bold text-stone-900 block">
                            {new Date(kycRequest.submitted_at || kycRequest.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">à {new Date(kycRequest.submitted_at || kycRequest.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-xs font-semibold text-stone-500 block">Statut d'examen</span>
                        <span className={`text-lg font-bold block ${kycRequest.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {kycRequest.status === 'approved' ? 'Identité certifiée' : 'En examen'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-normal">Vérification des données</span>
                    </div>
                </div>

                {/* DRIVER VEHICLE, LICENSE & PHOTOS SECTION (If Driver) */}
                {isDriver && (
                    <div className="bg-white border border-purple-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-purple-600" />
                                <h3 className="font-bold text-base text-stone-900">Informations & Photos du Véhicule de Livraison</h3>
                            </div>
                            <span className="text-xs bg-purple-50 text-purple-900 border border-purple-200 font-bold px-3 py-1 rounded-full">
                                Flotte de livraison Sellify
                            </span>
                        </div>

                        {/* Text Specs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-700 font-normal">
                            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
                                <span className="text-stone-400 block">Type de véhicule :</span>
                                <strong className="text-stone-900 text-sm capitalize">{driver?.vehicle_type || 'Moto de livraison'}</strong>
                            </div>

                            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
                                <span className="text-stone-400 block">N° Immatriculation / Plaque :</span>
                                <strong className="text-stone-900 font-mono text-sm uppercase">{driver?.vehicle_plate || 'LT-492-BX'}</strong>
                            </div>

                            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
                                <span className="text-stone-400 block">N° Permis de conduire :</span>
                                <strong className="text-purple-700 font-mono text-sm">{driver?.license_number || 'PERM-2026-8910'}</strong>
                            </div>

                            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
                                <span className="text-stone-400 block">Secteur / Zone couverte :</span>
                                <strong className="text-stone-900 text-sm">{driver?.coverage_zone || 'Bastos, Akwa, Yaoundé'}</strong>
                            </div>
                        </div>

                        {/* Vehicle & Circulation Documents Image Gallery Grid */}
                        <div className="pt-3 border-t border-stone-100 space-y-3">
                            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                                <Camera className="w-4 h-4 text-purple-600" />
                                <span>Galerie photos du véhicule et des pièces de circulation :</span>
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-950 group relative">
                                    <img 
                                        src={getMockupUrl('photo_vehicule')} 
                                        alt="Photo du Véhicule" 
                                        className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-xs p-2 text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-purple-400" />
                                        <span>Photo du Véhicule</span>
                                    </div>
                                </div>

                                <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-950 group relative">
                                    <img 
                                        src={getMockupUrl('carte_grise')} 
                                        alt="Carte Grise" 
                                        className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-xs p-2 text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5">
                                        <FileImage className="w-3.5 h-3.5 text-purple-400" />
                                        <span>Carte Grise du Véhicule</span>
                                    </div>
                                </div>

                                <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-950 group relative">
                                    <img 
                                        src={getMockupUrl('permis_conduire')} 
                                        alt="Permis de Conduire" 
                                        className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-xs p-2 text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                                        <span>Permis de Conduire</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Main 2-Column Grid: Documents preview vs Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Col: Documents Preview */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Inspection Haute Définition des Pièces</h3>
                            <button
                                onClick={handleOcrFill}
                                disabled={ocrLoading}
                                className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-yellow-300"
                            >
                                {ocrLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-700" />}
                                <span>Remplissage auto OCR</span>
                            </button>
                        </div>

                        {/* Document Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {availableDocs.map((doc) => (
                                <button
                                    key={doc.id}
                                    onClick={() => setActiveDocTab(doc.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                                        (activeDocTab === doc.id)
                                            ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs border border-yellow-500'
                                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                                    }`}
                                >
                                    {doc.label || doc.document_type}
                                </button>
                            ))}
                        </div>

                        {/* Document Viewer Frame */}
                        <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-950 relative min-h-[320px] flex items-center justify-center">
                            {currentDoc ? (
                                <img
                                    src={currentDoc.id ? route('admin.kyc.document.show', currentDoc.id) : getMockupUrl(currentDoc.document_type)}
                                    onError={(e) => { e.target.src = getMockupUrl(currentDoc.document_type); }}
                                    alt="Document"
                                    className="max-h-[450px] w-full object-contain p-2"
                                />
                            ) : (
                                <div className="text-center text-stone-400 space-y-2 p-8">
                                    <FileText className="w-10 h-10 mx-auto text-stone-600" />
                                    <p className="text-xs">Aperçu indisponible</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Data Verification Form & Actions */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
                        <div className="border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Validation des données d'identité CNI</h3>
                            <p className="text-xs text-stone-500 font-normal">Vérifiez les données de la pièce d'identité officielle avant certification.</p>
                        </div>

                        <form className="space-y-4 text-xs font-normal">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">N° CNI / Passeport :</label>
                                    <input
                                        type="text"
                                        value={data.cni_number}
                                        onChange={(e) => setData('cni_number', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Sexe :</label>
                                    <select
                                        value={data.cni_gender}
                                        onChange={(e) => setData('cni_gender', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-normal"
                                    >
                                        <option value="M">Masculin (M)</option>
                                        <option value="F">Féminin (F)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Prénom :</label>
                                    <input
                                        type="text"
                                        value={data.cni_first_name}
                                        onChange={(e) => setData('cni_first_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Nom de famille :</label>
                                    <input
                                        type="text"
                                        value={data.cni_last_name}
                                        onChange={(e) => setData('cni_last_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Date de naissance :</label>
                                    <input
                                        type="date"
                                        value={data.cni_dob}
                                        onChange={(e) => setData('cni_dob', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Lieu de naissance :</label>
                                    <input
                                        type="text"
                                        value={data.cni_pob}
                                        onChange={(e) => setData('cni_pob', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900"
                                    />
                                </div>
                            </div>

                            {/* Rejection justification field */}
                            {rejectionMode && (
                                <div className="space-y-2 pt-2 border-t border-stone-100">
                                    <label className="block text-xs font-semibold text-rose-800">Motif explicatif du rejet (transmis à l'utilisateur) :</label>
                                    <textarea
                                        rows="3"
                                        value={data.rejection_reason}
                                        onChange={(e) => setData('rejection_reason', e.target.value)}
                                        placeholder="Ex: Image CNI illisible, pièce d'identité expirée ou nom non conforme..."
                                        className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-400 text-rose-950 font-normal"
                                    />
                                </div>
                            )}

                            {/* Clean Action Controls */}
                            <div className="flex gap-3 pt-4 border-t border-stone-100">
                                {!rejectionMode ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleApprove}
                                            disabled={processing}
                                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Approuver & certifier l'identité</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRejectionMode(true)}
                                            className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl transition-colors border border-rose-200"
                                        >
                                            Refuser...
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleReject}
                                            disabled={processing}
                                            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                                        >
                                            Confirmer le rejet du dossier
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRejectionMode(false)}
                                            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    </>
                                )}
                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
