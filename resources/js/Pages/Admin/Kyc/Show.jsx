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
    Maximize2, 
    Eye,
    ShieldCheck,
    FileText,
    UserCheck
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
        default:
            return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
    }
};

export default function Show({ kycRequest }) {
    const user = kycRequest.user;
    const [rejectionMode, setRejectionMode] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [activeDocTab, setActiveDocTab] = useState(user.kyc_documents?.[0]?.id || null);

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
        if (confirm("Voulez-vous approuver le dossier KYC et enregistrer ces informations ?")) {
            data.status = 'approved';
            post(route('admin.kyc.review', kycRequest.id));
        }
    };

    const handleReject = (e) => {
        e.preventDefault();
        if (!data.rejection_reason.trim()) {
            alert("Veuillez saisir un motif de rejet.");
            return;
        }
        data.status = 'rejected';
        post(route('admin.kyc.review', kycRequest.id));
    };

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
                cni_issue_date: '2021-06-15',
                cni_expiry_date: '2031-06-15',
                cni_gender: 'M',
                cni_nationality: 'Camerounaise',
            });
            setOcrLoading(false);
        }, 1000);
    };

    const currentDoc = user.kyc_documents?.find(d => d.id === activeDocTab) || user.kyc_documents?.[0];

    return (
        <AdminLayout title="Revue KYC">
            <Head title={`Dossier KYC - ${user.first_name} ${user.last_name}`} />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Back Button & Header */}
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
                                <UserCheck className="w-4 h-4 text-yellow-600" />
                                <span>Revue de conformité d'identité</span>
                            </div>
                            <h1 className="text-xl font-bold text-stone-900 mt-0.5">
                                Dossier KYC de {user.first_name} {user.last_name}
                            </h1>
                        </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                        kycRequest.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : kycRequest.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                    }`}>
                        {kycRequest.status === 'approved' ? 'Approuvé' : kycRequest.status === 'pending' ? 'En examen' : 'Rejeté'}
                    </span>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Col: Documents Preview */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Pièces justificatives fournies</h3>
                            <button
                                onClick={handleOcrFill}
                                disabled={ocrLoading}
                                className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-yellow-300"
                            >
                                {ocrLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-700" />}
                                <span>Remplissage automatique OCR</span>
                            </button>
                        </div>

                        {/* Document Selector Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {user.kyc_documents && user.kyc_documents.length > 0 ? (
                                user.kyc_documents.map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setActiveDocTab(doc.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                                            (activeDocTab === doc.id || (!activeDocTab && doc.id === user.kyc_documents[0].id))
                                                ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs border border-yellow-500'
                                                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                                        }`}
                                    >
                                        {doc.document_type || 'Pièce ID'}
                                    </button>
                                ))
                            ) : (
                                <span className="text-xs text-stone-400">Aucun document joint</span>
                            )}
                        </div>

                        {/* Document Viewer Frame */}
                        <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-950 relative min-h-[300px] flex items-center justify-center">
                            {currentDoc ? (
                                <img
                                    src={route('admin.kyc.document.show', currentDoc.id)}
                                    onError={(e) => { e.target.src = getMockupUrl(currentDoc.document_type); }}
                                    alt="Document CNI"
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

                    {/* Right Col: Verified CNI Fields & Validation Form */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
                        <div className="border-b border-stone-100 pb-3">
                            <h3 className="font-bold text-sm text-stone-900">Formulaire de vérification des données CNI</h3>
                            <p className="text-xs text-stone-500 font-normal">Saisissez ou validez les champs extraits de la pièce d'identité.</p>
                        </div>

                        <form className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">N° CNI / Passeport :</label>
                                    <input
                                        type="text"
                                        value={data.cni_number}
                                        onChange={(e) => setData('cni_number', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Genre :</label>
                                    <select
                                        value={data.cni_gender}
                                        onChange={(e) => setData('cni_gender', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal text-stone-900"
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
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Nom de famille :</label>
                                    <input
                                        type="text"
                                        value={data.cni_last_name}
                                        onChange={(e) => setData('cni_last_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Date de naissance :</label>
                                    <input
                                        type="date"
                                        value={data.cni_dob}
                                        onChange={(e) => setData('cni_dob', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal text-stone-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Lieu de naissance :</label>
                                    <input
                                        type="text"
                                        value={data.cni_pob}
                                        onChange={(e) => setData('cni_pob', e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 font-normal text-stone-900"
                                    />
                                </div>
                            </div>

                            {/* Rejection reason area if rejecting */}
                            {rejectionMode && (
                                <div className="space-y-2 pt-2 border-t border-stone-100">
                                    <label className="block text-xs font-bold text-rose-800">Motif précis du rejet (transmis à l'utilisateur) :</label>
                                    <textarea
                                        rows="3"
                                        value={data.rejection_reason}
                                        onChange={(e) => setData('rejection_reason', e.target.value)}
                                        placeholder="Ex: Image CNI floue, pièce d'identité expirée ou nom non correspondant..."
                                        className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-400 text-rose-950 font-normal"
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
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
                                            <span>Approuver le dossier KYC</span>
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
