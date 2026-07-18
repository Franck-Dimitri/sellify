import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Components/ui/Card';
import Badge from '../../../Components/ui/Badge';
import Button from '../../../Components/ui/Button';
import { 
    ShieldCheck, 
    Ban, 
    RefreshCw, 
    ArrowLeft, 
    Truck, 
    Store, 
    UserCheck, 
    ShieldAlert,
    ShoppingBag,
    DollarSign,
    Box,
    Star,
    Award,
    Calendar,
    Users
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

export default function Show({ targetUser }) {
    const suspendForm = useForm({});
    const activateForm = useForm({});
    const banForm = useForm({});

    const handleSuspend = (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous suspendre ce compte ?")) {
            suspendForm.post(route('admin.users.suspend', targetUser.id));
        }
    };

    const handleActivate = (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous activer/débloquer ce compte ?")) {
            activateForm.post(route('admin.users.activate', targetUser.id));
        }
    };

    const handleBan = (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous bannir ce compte définitivement ?")) {
            banForm.post(route('admin.users.ban', targetUser.id));
        }
    };

    // Helper to check if a KYC document is a dummy seeder file
    const getDocSrc = (doc) => {
        const isDummy = doc.original_name?.includes('dummy') || doc.file_size === 12345;
        return isDummy ? getMockupUrl(doc.type) : route('admin.kyc.document.show', doc.id);
    };

    const approvedKyc = targetUser.kyc_requests?.find(r => r.status === 'approved');
    const isKycApproved = !!approvedKyc;

    // Mock Sales History for Seller
    const mockSales = [
        { id: '#TXN-9023', date: '18 Juil 2026, 12:45', product: 'Smartphone Galaxy S23', amount: '480 000 CFA', commission: '48 000 CFA', status: 'completed' },
        { id: '#TXN-9018', date: '17 Juil 2026, 15:30', product: 'Écouteurs Sans Fil Pro', amount: '45 000 CFA', commission: '4 500 CFA', status: 'completed' },
        { id: '#TXN-9004', date: '15 Juil 2026, 09:12', product: 'Chargeur Rapide 65W', amount: '18 000 CFA', commission: '1 800 CFA', status: 'completed' },
        { id: '#TXN-8987', date: '12 Juil 2026, 17:00', product: 'Coque de Protection', amount: '7 500 CFA', commission: '750 CFA', status: 'refunded' }
    ];

    // Mock Deliveries History for Driver
    const mockDeliveries = [
        { id: '#DEL-5429', date: '18 Juil 2026, 14:10', client: 'Marc Kamga', zone: 'Bastos, Yaoundé', fee: '2 500 CFA', status: 'delivered' },
        { id: '#DEL-5418', date: '18 Juil 2026, 10:30', client: 'Sandrine Nzié', zone: 'Omnisports, Yaoundé', fee: '1 800 CFA', status: 'delivered' },
        { id: '#DEL-5399', date: '17 Juil 2026, 16:45', client: 'Joel Tagne', zone: 'Bonapriso, Douala', fee: '3 500 CFA', status: 'delivered' },
        { id: '#DEL-5374', date: '16 Juil 2026, 11:20', client: 'Aline Zogo', zone: 'Akwa, Douala', fee: '2 000 CFA', status: 'cancelled' }
    ];

    // Mock Orders History for Customer
    const mockOrders = [
        { id: '#ORD-1249', date: '18 Juil 2026, 13:12', shop: 'Électronique Douala', amount: '18 500 CFA', status: 'delivered' },
        { id: '#ORD-1248', date: '18 Juil 2026, 11:45', shop: 'Boutique Yaoundé', amount: '35 000 CFA', status: 'pending' },
        { id: '#ORD-1241', date: '15 Juil 2026, 14:22', shop: 'Mode Glamour', amount: '12 000 CFA', status: 'delivered' }
    ];

    return (
        <AdminLayout title={`Détails Utilisateur : ${targetUser.first_name} ${targetUser.last_name}`}>
            <Head title={`${targetUser.first_name} ${targetUser.last_name}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Back Link */}
                <div>
                    <Link href={route('admin.users.all')} className="inline-flex items-center text-xs font-semibold text-surface-450 hover:text-surface-800 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                        Retour à la liste des utilisateurs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: General user info */}
                    <div className="space-y-6">
                        <Card className="bg-white border border-surface-200 rounded-3xl p-6 shadow-xs text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-surface-100 to-surface-50 flex items-center justify-center font-bold text-2xl text-surface-700 border border-surface-200 mx-auto shadow-xs">
                                {targetUser.first_name[0]}{targetUser.last_name[0]}
                            </div>
                            <div className="mt-4 space-y-1">
                                <h3 className="text-lg font-bold text-surface-900 leading-tight">{targetUser.first_name} {targetUser.last_name}</h3>
                                <p className="text-xs text-surface-400 font-mono font-medium">{targetUser.email}</p>
                                <p className="text-xs text-surface-500 font-semibold">{targetUser.phone || 'Aucun téléphone'}</p>
                            </div>
                            <div className="flex justify-center space-x-2 pt-2">
                                <Badge variant={
                                    targetUser.role === 'admin' || targetUser.role === 'superadmin' ? 'primary' :
                                    targetUser.role === 'seller' ? 'success' :
                                    targetUser.role === 'driver' ? 'info' : 'neutral'
                                }>
                                    {targetUser.role === 'seller' ? 'Vendeur' : targetUser.role === 'driver' ? 'Livreur' : targetUser.role === 'customer' ? 'Client' : targetUser.role}
                                </Badge>
                                <Badge variant={
                                    targetUser.status === 'active' ? 'success' :
                                    targetUser.status === 'suspended' ? 'warning' : 'danger'
                                }>
                                    {targetUser.status === 'active' ? 'Actif' : targetUser.status === 'suspended' ? 'Suspendu' : 'Banni'}
                                </Badge>
                            </div>
                        </Card>

                        {/* Account compliance panel */}
                        <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold flex items-center space-x-2 text-surface-900">
                                    <ShieldCheck className="w-4.5 h-4.5 text-amber-500" />
                                    <span>Actions de Conformité</span>
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {targetUser.status !== 'active' && (
                                    <form onSubmit={handleActivate}>
                                        <Button type="submit" variant="success" className="w-full space-x-2 rounded-xl text-xs py-2.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700" disabled={activateForm.processing}>
                                            <UserCheck className="w-4 h-4" />
                                            <span>Activer le compte</span>
                                        </Button>
                                    </form>
                                )}
                                {targetUser.status === 'active' && (
                                    <form onSubmit={handleSuspend}>
                                        <Button type="submit" variant="outline" className="w-full space-x-2 rounded-xl text-xs py-2.5 font-semibold border-amber-300 text-amber-700 hover:bg-amber-50" disabled={suspendForm.processing}>
                                            <Ban className="w-4 h-4" />
                                            <span>Suspendre le compte</span>
                                        </Button>
                                    </form>
                                )}
                                {targetUser.status !== 'banned' && (
                                    <form onSubmit={handleBan}>
                                        <Button type="submit" variant="danger" className="w-full space-x-2 rounded-xl text-xs py-2.5 font-semibold bg-rose-600 text-white hover:bg-rose-700" disabled={banForm.processing}>
                                            <ShieldAlert className="w-4 h-4" />
                                            <span>Bannir définitivement</span>
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right: Specific profiles and KYC documents */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* A. Seller Details (Vendeur) */}
                        {targetUser.role === 'seller' && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-3 mb-4">
                                    <h4 className="text-sm font-bold flex items-center space-x-2 text-surface-900">
                                        <Store className="w-4.5 h-4.5 text-amber-500" />
                                        <span>Détails de l'Activité Vendeur</span>
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Abonnement</span>
                                        <span className="text-sm font-extrabold text-surface-800 uppercase mt-0.5 block">{targetUser.seller?.pack || 'STARTER'}</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Produits Actifs</span>
                                        <span className="text-sm font-bold text-surface-900 mt-0.5 block font-mono">48 produits</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Total Ventes</span>
                                        <span className="text-sm font-bold text-surface-900 mt-0.5 block font-mono">1 240 000 CFA</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Note Boutique</span>
                                        <span className="text-sm font-bold text-amber-600 mt-0.5 flex items-center">
                                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                                            <span>4.8 / 5</span>
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* B. Driver Details (Livreur) */}
                        {targetUser.role === 'driver' && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-3 mb-4">
                                    <h4 className="text-sm font-bold flex items-center space-x-2 text-surface-900">
                                        <Truck className="w-4.5 h-4.5 text-blue-500" />
                                        <span>Détails de l'Activité Livreur</span>
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Véhicule</span>
                                        <span className="text-sm font-bold text-surface-800 capitalize mt-0.5 block">{targetUser.driver?.vehicle_type || 'Moto'}</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Plaque</span>
                                        <span className="text-sm font-bold text-surface-900 mt-0.5 block font-mono">{targetUser.driver?.vehicle_plate || 'LT-982-BB'}</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Livraisons</span>
                                        <span className="text-sm font-bold text-surface-900 mt-0.5 block font-mono">89 terminées</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Note Livreur</span>
                                        <span className="text-sm font-bold text-blue-600 mt-0.5 flex items-center">
                                            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500 mr-1" />
                                            <span>4.9 / 5</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 bg-surface-50 p-3.5 rounded-2xl border border-surface-100">
                                    <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Zone de couverture</span>
                                    <span className="text-xs font-semibold text-surface-700 block mt-1">{targetUser.driver?.coverage_zone || 'Bastos, Omnisports, Yaoundé'}</span>
                                </div>
                            </Card>
                        )}

                        {/* C. Customer Details (Client) */}
                        {targetUser.role === 'customer' && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-3 mb-4">
                                    <h4 className="text-sm font-bold flex items-center space-x-2 text-surface-900">
                                        <ShoppingBag className="w-4.5 h-4.5 text-emerald-500" />
                                        <span>Détails de l'Activité Client</span>
                                    </h4>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Commandes</span>
                                        <span className="text-sm font-bold text-surface-800 mt-0.5 block font-mono">12 commandes</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Total Dépensé</span>
                                        <span className="text-sm font-bold text-surface-900 mt-0.5 block font-mono">185 000 CFA</span>
                                    </div>
                                    <div className="bg-surface-50 p-3 rounded-2xl border border-surface-100">
                                        <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider block">Fidélité</span>
                                        <span className="text-sm font-bold text-emerald-600 mt-0.5 block font-mono">340 points</span>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* D. Virtual CNI Card if approved */}
                        {(() => {
                            if (!isKycApproved || !approvedKyc.cni_number) return null;

                            const selfieDoc = targetUser.kyc_documents?.find(d => d.type === 'selfie');

                            return (
                                <Card className="bg-gradient-to-tr from-surface-900 to-surface-950 text-white relative overflow-hidden border-none shadow-md rounded-3xl min-h-[220px]">
                                    <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
                                    <div className="absolute right-12 top-6 w-16 h-16 rounded-full bg-amber-500/10 pointer-events-none"></div>

                                    <CardHeader className="border-b border-white/10 pb-4 mb-4 relative z-10">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-md">ID</span>
                                                <div>
                                                    <CardTitle className="text-xs font-bold text-white font-sans">Carte Nationale d'Identité</CardTitle>
                                                    <span className="block text-[8px] text-white/50 uppercase tracking-widest leading-none mt-0.5">Dossier Validé</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 rounded-md border border-white/10 self-start sm:self-auto">
                                                RÉPUBLIQUE DU CAMEROUN
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-xs">
                                        <div className="flex flex-col items-center justify-center space-y-2 border-r border-white/10 pr-6">
                                            <div className="w-24 h-28 bg-white/10 border border-white/20 rounded-xl overflow-hidden flex items-center justify-center">
                                                {selfieDoc ? (
                                                    <img
                                                        src={getDocSrc(selfieDoc)}
                                                        alt="Selfie"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[32px] font-black text-white/30">
                                                        {targetUser.first_name[0]}{targetUser.last_name[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-white/55 font-semibold uppercase tracking-wider">Photo d'Identité</span>
                                        </div>

                                        <div className="md:col-span-2 grid grid-cols-2 gap-x-4 gap-y-3 font-semibold text-white/80">
                                            <div className="col-span-2">
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Numéro Identifiant (CNI)</span>
                                                <span className="text-sm font-mono font-bold text-amber-400">{approvedKyc.cni_number}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Nom</span>
                                                <span className="text-xs uppercase text-white font-bold">{approvedKyc.cni_last_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Prénom</span>
                                                <span className="text-xs text-white font-bold">{approvedKyc.cni_first_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Date & Lieu de Naissance</span>
                                                <span className="text-xs text-white">
                                                    {approvedKyc.cni_dob ? new Date(approvedKyc.cni_dob).toLocaleDateString('fr-FR') : ''} à <span className="uppercase">{approvedKyc.cni_pob}</span>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Nationalité & Sexe</span>
                                                <span className="text-xs text-white">{approvedKyc.cni_nationality} / {approvedKyc.cni_gender === 'M' ? 'M' : 'F'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Date d'Émission</span>
                                                <span className="text-xs text-white">{approvedKyc.cni_issue_date ? new Date(approvedKyc.cni_issue_date).toLocaleDateString('fr-FR') : ''}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/45 font-semibold uppercase tracking-wider block">Date d'Expiration</span>
                                                <span className="text-xs text-rose-300">{approvedKyc.cni_expiry_date ? new Date(approvedKyc.cni_expiry_date).toLocaleDateString('fr-FR') : ''}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })()}

                        {/* E. KYC Documents with beautiful fallbacks */}
                        {targetUser.kyc_documents && targetUser.kyc_documents.length > 0 && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-3 mb-4">
                                    <h4 className="text-sm font-bold text-surface-900">Documents KYC Téléchargés</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {targetUser.kyc_documents.map((doc) => (
                                        <div key={doc.id} className="border border-surface-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-surface-50">
                                            <div>
                                                <span className="text-[10px] font-bold text-surface-400 uppercase block">Type de Document</span>
                                                <span className="font-semibold text-xs text-surface-800">{doc.type.replace('_', ' ').toUpperCase()}</span>
                                            </div>
                                            {/* Preview secure link with high-fidelity dev mockup */}
                                            <div className="w-full h-36 bg-surface-200 rounded-xl overflow-hidden relative group border border-surface-150 shadow-inner">
                                                <img
                                                    src={getDocSrc(doc)}
                                                    alt={doc.type}
                                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center pt-1.5">
                                                <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}>
                                                    {doc.status === 'approved' ? 'Validé' : doc.status === 'rejected' ? 'Rejeté' : 'En attente'}
                                                </Badge>
                                                <a href={getDocSrc(doc)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-amber-600 hover:underline">
                                                    Agrandir &rarr;
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* F. Role-Based Activity logs / Transaction History when KYC approved */}
                        {isKycApproved && (
                            <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                                <div className="border-b border-surface-100 pb-3 mb-4 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-surface-900">
                                        {targetUser.role === 'seller' ? 'Historique des Ventes / Transactions' :
                                         targetUser.role === 'driver' ? 'Historique des Livraisons Récentes' :
                                         'Historique des Achats / Commandes'}
                                    </h4>
                                    <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider font-mono">Données simulées</span>
                                </div>
                                <div className="overflow-x-auto">
                                    {targetUser.role === 'seller' && (
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="text-surface-400 font-bold uppercase border-b border-surface-100 pb-2">
                                                    <th className="pb-2 font-semibold">ID Trans.</th>
                                                    <th className="pb-2 font-semibold">Date</th>
                                                    <th className="pb-2 font-semibold">Produit</th>
                                                    <th className="pb-2 font-semibold text-right">Montant</th>
                                                    <th className="pb-2 font-semibold text-right">Com.</th>
                                                    <th className="pb-2 font-semibold text-center">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-50 text-surface-700 font-semibold">
                                                {mockSales.map((sale) => (
                                                    <tr key={sale.id} className="hover:bg-surface-50/50">
                                                        <td className="py-2.5 font-mono text-surface-900">{sale.id}</td>
                                                        <td className="py-2.5 text-surface-400">{sale.date}</td>
                                                        <td className="py-2.5 truncate max-w-[120px]">{sale.product}</td>
                                                        <td className="py-2.5 text-right font-mono text-surface-900">{sale.amount}</td>
                                                        <td className="py-2.5 text-right font-mono text-surface-500">{sale.commission}</td>
                                                        <td className="py-2.5 text-center">
                                                            <Badge variant={sale.status === 'completed' ? 'success' : 'danger'}>
                                                                {sale.status === 'completed' ? 'Complété' : 'Remboursé'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {targetUser.role === 'driver' && (
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="text-surface-400 font-bold uppercase border-b border-surface-100 pb-2">
                                                    <th className="pb-2 font-semibold">ID Livr.</th>
                                                    <th className="pb-2 font-semibold">Date</th>
                                                    <th className="pb-2 font-semibold">Client</th>
                                                    <th className="pb-2 font-semibold">Zone</th>
                                                    <th className="pb-2 font-semibold text-right">Frais</th>
                                                    <th className="pb-2 font-semibold text-center">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-50 text-surface-700 font-semibold">
                                                {mockDeliveries.map((del) => (
                                                    <tr key={del.id} className="hover:bg-surface-50/50">
                                                        <td className="py-2.5 font-mono text-surface-900">{del.id}</td>
                                                        <td className="py-2.5 text-surface-400">{del.date}</td>
                                                        <td className="py-2.5">{del.client}</td>
                                                        <td className="py-2.5 text-surface-500 truncate max-w-[120px]">{del.zone}</td>
                                                        <td className="py-2.5 text-right font-mono text-surface-900">{del.fee}</td>
                                                        <td className="py-2.5 text-center">
                                                            <Badge variant={del.status === 'delivered' ? 'success' : 'danger'}>
                                                                {del.status === 'delivered' ? 'Livré' : 'Annulé'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {targetUser.role === 'customer' && (
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="text-surface-400 font-bold uppercase border-b border-surface-100 pb-2">
                                                    <th className="pb-2 font-semibold">ID Comm.</th>
                                                    <th className="pb-2 font-semibold">Date</th>
                                                    <th className="pb-2 font-semibold">Boutique</th>
                                                    <th className="pb-2 font-semibold text-right">Montant</th>
                                                    <th className="pb-2 font-semibold text-center">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-50 text-surface-700 font-semibold">
                                                {mockOrders.map((ord) => (
                                                    <tr key={ord.id} className="hover:bg-surface-50/50">
                                                        <td className="py-2.5 font-mono text-surface-900">{ord.id}</td>
                                                        <td className="py-2.5 text-surface-400">{ord.date}</td>
                                                        <td className="py-2.5 truncate max-w-[120px]">{ord.shop}</td>
                                                        <td className="py-2.5 text-right font-mono text-surface-900">{ord.amount}</td>
                                                        <td className="py-2.5 text-center">
                                                            <Badge variant={ord.status === 'delivered' ? 'success' : 'warning'}>
                                                                {ord.status === 'delivered' ? 'Livrée' : 'En cours'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* G. Activity Logs */}
                        <Card className="bg-white border border-surface-200 rounded-3xl p-5 shadow-xs">
                            <div className="border-b border-surface-100 pb-3 mb-4">
                                <h4 className="text-sm font-bold text-surface-900">Historique d'activité général</h4>
                            </div>
                            <CardContent className="p-0">
                                {targetUser.activities && targetUser.activities.length === 0 ? (
                                    <div className="py-6 text-center text-surface-400 text-xs font-semibold">
                                        Aucun log d'activité pour cet utilisateur.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="bg-surface-50 text-surface-400 font-bold uppercase tracking-wider border-b border-surface-200">
                                                    <th className="py-3 px-4 font-semibold">Action</th>
                                                    <th className="py-3 px-4 font-semibold">Description</th>
                                                    <th className="py-3 px-4 font-semibold">Date</th>
                                                    <th className="py-3 px-4 font-semibold">IP</th>
                                                </tr>
                                            </thead>
                                            <tbody className="font-semibold text-surface-700 divide-y divide-surface-100">
                                                {targetUser.activities.map((act) => (
                                                    <tr key={act.id} className="hover:bg-surface-50/50">
                                                        <td className="py-3 px-4 text-surface-900 font-bold">{act.action}</td>
                                                        <td className="py-3 px-4 text-surface-500 leading-relaxed max-w-xs truncate">{act.description}</td>
                                                        <td className="py-3 px-4 text-surface-400">{new Date(act.created_at).toLocaleString('fr-FR')}</td>
                                                        <td className="py-3 px-4 text-surface-400 font-mono">{act.ip_address}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
