import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import Input from '../../../Components/ui/Input';
import { 
    ArrowLeft, 
    Check, 
    X, 
    ShieldAlert, 
    AlertTriangle, 
    Sparkles, 
    Loader2, 
    Maximize2, 
    Eye 
} from 'lucide-react';

// Document mockup assets for clean dev previews
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
            return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop';
        default:
            return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
    }
};

export default function Show({ kycRequest }) {
    const user = kycRequest.user;
    const [rejectionMode, setRejectionMode] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [activeDocTab, setActiveDocTab] = useState(user.kyc_documents?.[0]?.id || null);

    // Format date helper
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
        e.preventDefault();
        if (confirm("Voulez-vous approuver le dossier KYC et enregistrer ces informations CNI ?")) {
            post(route('admin.kyc.review', kycRequest.id), {
                onBefore: () => {
                    data.status = 'approved';
                }
            });
        }
    };

    const handleReject = (e) => {
        e.preventDefault();
        if (!data.rejection_reason.trim()) {
            alert("Veuillez saisir un motif de rejet.");
            return;
        }
        post(route('admin.kyc.review', kycRequest.id), {
            onBefore: () => {
                data.status = 'rejected';
            }
        });
    };

    // Simulate OCR fill-in
    const handleOcrFill = () => {
        setOcrLoading(true);
        setTimeout(() => {
            setData({
                ...data,
                cni_number: '110293847528',
                cni_first_name: user.first_name,
                cni_last_name: user.last_name,
                cni_dob: '1995-04-12',
                cni_pob: 'Yaoundé',
                cni_issue_date: '2023-05-18',
                cni_expiry_date: '2033-05-18',
                cni_gender: 'M',
                cni_nationality: 'Camerounaise',
            });
            setOcrLoading(false);
        }, 900);
    };

    // Helper to get image source
    const getDocSrc = (doc) => {
        const isDummy = doc.original_name?.includes('dummy') || doc.file_size === 12345;
        return isDummy ? getMockupUrl(doc.type) : route('admin.kyc.document.show', doc.id);
    };

    const selectedDoc = user.kyc_documents?.find(d => d.id === activeDocTab) || user.kyc_documents?.[0];

    return (
        <AdminLayout title={`Revue KYC de ${user.first_name} ${user.last_name}`}>
            <Head title={`Revue KYC - ${user.first_name} ${user.last_name}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Back button */}
                <div>
                    <Link href={route('admin.users.all')} className="inline-flex items-center text-xs font-semibold text-surface-450 hover:text-surface-800 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                        Retour à la liste des utilisateurs
                    </Link>
                </div>

                {/* Side-by-Side Review Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN (col-span 7): Document Viewers */}
                    <div className="lg:col-span-7 space-y-6 sticky top-2">
                        <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="border-b border-surface-100 pb-3 mb-4 flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-surface-900">Pièces justificatives soumises</h4>
                                    <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Cliquez sur les onglets pour basculer de document</p>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-surface-50 text-surface-500 px-2 py-0.5 border border-surface-200 rounded-md">
                                    {user.kyc_documents?.length || 0} Documents
                                </span>
                            </div>

                            {/* Document Tabs */}
                            {user.kyc_documents && user.kyc_documents.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {user.kyc_documents.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => setActiveDocTab(doc.id)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150
                                                    ${selectedDoc?.id === doc.id
                                                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/10'
                                                        : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'}`}
                                            >
                                                {doc.type.replace('_', ' ').toUpperCase()}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Active Document Viewer */}
                                    {selectedDoc && (
                                        <div className="border border-surface-200 rounded-2xl overflow-hidden bg-surface-50 relative group">
                                            <div className="w-full min-h-[380px] max-h-[500px] flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={getDocSrc(selectedDoc)}
                                                    alt={selectedDoc.type}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="absolute top-3 right-3 flex space-x-2">
                                                <a 
                                                    href={getDocSrc(selectedDoc)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="bg-black/60 text-white p-2 rounded-xl backdrop-blur-xs hover:bg-black/80 transition-colors flex items-center space-x-1 text-[10px] font-semibold"
                                                >
                                                    <Maximize2 className="w-3.5 h-3.5" />
                                                    <span>Plein écran</span>
                                                </a>
                                            </div>
                                            <div className="bg-white border-t border-surface-150 p-3.5 flex justify-between items-center text-xs">
                                                <div>
                                                    <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Fichier original</span>
                                                    <span className="font-semibold text-surface-800">{selectedDoc.original_name || 'document.png'}</span>
                                                </div>
                                                <Badge variant={selectedDoc.status === 'approved' ? 'success' : selectedDoc.status === 'rejected' ? 'danger' : 'warning'}>
                                                    {selectedDoc.status === 'approved' ? 'Validé' : selectedDoc.status === 'rejected' ? 'Rejeté' : 'En attente'}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-surface-400 text-xs font-semibold">
                                    Aucun document n'a été fourni pour ce dossier.
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (col-span 5): Form & Metadata Entry */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* 1. Claimant Profile details */}
                        <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-900">Profil du Demandeur</h4>
                            </div>
                            <div className="flex items-center space-x-3 pb-3 border-b border-surface-100">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-surface-100 to-surface-50 flex items-center justify-center font-bold text-base text-surface-700 border border-surface-200">
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-surface-900 leading-none">{user.first_name} {user.last_name}</h4>
                                    <span className="text-xs text-surface-400 font-mono mt-1 block">{user.email}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-3.5 text-xs font-semibold text-surface-600">
                                <div>
                                    <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Rôle</span>
                                    <span className="capitalize text-surface-800 font-bold block mt-0.5">
                                        {kycRequest.type === 'seller' ? 'Vendeur' : 'Livreur'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Téléphone</span>
                                    <span className="text-surface-800 font-mono block mt-0.5">{user.phone || 'Non renseigné'}</span>
                                </div>
                            </div>
                        </Card>

                        {/* 2. CNI Metadata Form (Manual & Simulated OCR) */}
                        {kycRequest.status === 'pending' && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-4 mb-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-surface-900">Saisie des informations CNI</h4>
                                        <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Renseignez les données en lisant la pièce à gauche</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleOcrFill}
                                        disabled={ocrLoading}
                                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-sm transition-all duration-150"
                                    >
                                        {ocrLoading ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Scan OCR...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span>Remplir via OCR</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <form onSubmit={handleApprove} className="space-y-4">
                                    <Input
                                        label="Numéro de CNI"
                                        value={data.cni_number}
                                        onChange={(e) => setData('cni_number', e.target.value)}
                                        error={errors.cni_number}
                                        placeholder="Ex: 1102938475"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Nom (sur la CNI)"
                                            value={data.cni_last_name}
                                            onChange={(e) => setData('cni_last_name', e.target.value)}
                                            error={errors.cni_last_name}
                                            placeholder="Nom de famille"
                                            required
                                        />
                                        <Input
                                            label="Prénoms (sur la CNI)"
                                            value={data.cni_first_name}
                                            onChange={(e) => setData('cni_first_name', e.target.value)}
                                            error={errors.cni_first_name}
                                            placeholder="Prénoms"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider block mb-1.5">Genre / Sexe</label>
                                            <select
                                                value={data.cni_gender}
                                                onChange={(e) => setData('cni_gender', e.target.value)}
                                                className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 focus:border-amber-400 rounded-xl outline-none font-semibold text-surface-700 transition-colors"
                                            >
                                                <option value="M">Masculin (M)</option>
                                                <option value="F">Féminin (F)</option>
                                            </select>
                                        </div>
                                        <Input
                                            label="Nationalité"
                                            value={data.cni_nationality}
                                            onChange={(e) => setData('cni_nationality', e.target.value)}
                                            error={errors.cni_nationality}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="date"
                                            label="Date de naissance"
                                            value={data.cni_dob}
                                            onChange={(e) => setData('cni_dob', e.target.value)}
                                            error={errors.cni_dob}
                                            required
                                        />
                                        <Input
                                            label="Lieu de naissance"
                                            value={data.cni_pob}
                                            onChange={(e) => setData('cni_pob', e.target.value)}
                                            error={errors.cni_pob}
                                            placeholder="Ex: Yaoundé"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="date"
                                            label="Date d'émission"
                                            value={data.cni_issue_date}
                                            onChange={(e) => setData('cni_issue_date', e.target.value)}
                                            error={errors.cni_issue_date}
                                            required
                                        />
                                        <Input
                                            type="date"
                                            label="Date d'expiration"
                                            value={data.cni_expiry_date}
                                            onChange={(e) => setData('cni_expiry_date', e.target.value)}
                                            error={errors.cni_expiry_date}
                                            required
                                        />
                                    </div>

                                    {/* Decision Actions inside form */}
                                    <div className="pt-4 border-t border-surface-100 space-y-3">
                                        {!rejectionMode ? (
                                            <div className="flex flex-col space-y-2">
                                                <Button 
                                                    type="submit"
                                                    variant="success" 
                                                    className="w-full space-x-1.5 py-2.5 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs" 
                                                    disabled={processing}
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Enregistrer & Approuver le KYC</span>
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="danger" 
                                                    className="w-full space-x-1.5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold text-xs" 
                                                    onClick={() => {
                                                        setRejectionMode(true);
                                                        setData('status', 'rejected');
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Rejeter le dossier</span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-800 font-semibold">
                                                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
                                                    <span>Précisez le motif précis du rejet de ce dossier KYC à l'utilisateur.</span>
                                                </div>
                                                <Input
                                                    label="Motif du rejet"
                                                    name="rejection_reason"
                                                    value={data.rejection_reason}
                                                    onChange={(e) => setData('rejection_reason', e.target.value)}
                                                    error={errors.rejection_reason}
                                                    placeholder="CNI floue, documents incompatibles, etc."
                                                    required
                                                />
                                                <div className="flex space-x-2">
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        className="w-1/3 py-2 text-xs rounded-xl font-semibold text-surface-600 hover:bg-surface-50 border border-surface-250" 
                                                        onClick={() => setRejectionMode(false)}
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button 
                                                        type="button"
                                                        onClick={handleReject}
                                                        variant="danger" 
                                                        className="flex-1 text-white bg-red-600 hover:bg-red-700 py-2 text-xs rounded-xl font-semibold" 
                                                        disabled={processing}
                                                    >
                                                        Confirmer le rejet
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </Card>
                        )}

                        {/* 3. Review completed display */}
                        {kycRequest.status !== 'pending' && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-3 mb-3">
                                    <h4 className="text-sm font-bold text-surface-900">Dossier KYC Révisé</h4>
                                </div>
                                <div className="space-y-4 text-xs font-semibold">
                                    <div>
                                        <span className="text-[10px] text-surface-400 font-bold uppercase block mb-1">Statut final</span>
                                        <Badge variant={kycRequest.status === 'approved' ? 'success' : 'danger'}>
                                            {kycRequest.status === 'approved' ? 'Validé' : 'Rejeté'}
                                        </Badge>
                                    </div>
                                    {kycRequest.rejection_reason && (
                                        <div>
                                            <span className="text-[10px] text-surface-400 font-bold uppercase block text-red-500">Motif du rejet</span>
                                            <p className="text-surface-700 leading-relaxed font-bold mt-1 text-xs bg-red-50/50 border border-red-100 p-3 rounded-xl">
                                                {kycRequest.rejection_reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
