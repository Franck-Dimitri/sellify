import React from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import { ShieldAlert, LogOut, Store, LayoutDashboard, Settings, ExternalLink, Edit, CheckCircle } from 'lucide-react';
import Button from '../../Components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';
import Badge from '../../Components/ui/Badge';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const seller = user.seller;
    const shop = seller?.shop;

    return (
        <>
            <Head title="Tableau de bord Vendeur" />
            <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
                {/* Navbar Vendeur */}
                <header className="bg-white border-b border-surface-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center space-x-4">
                        <span className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-extrabold text-surface-950">S</span>
                        <span className="font-extrabold text-lg tracking-tight text-surface-900">Sellify Espace Vendeur</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold text-surface-700">
                            {user.first_name} {user.last_name}
                        </span>
                        <Link href={route('logout')} method="post" as="button">
                            <Button variant="danger" size="sm" className="space-x-1">
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 space-x-6">
                    {/* Sidebar navigation */}
                    <aside className="w-64 bg-white border border-surface-200 rounded-2xl p-4 hidden md:block h-fit space-y-2">
                        <div className="flex items-center space-x-3 px-3 py-2 text-surface-900 font-bold border-b border-surface-100 mb-4">
                            <LayoutDashboard className="w-5 h-5 text-primary-500" />
                            <span>Menu Vendeur</span>
                        </div>
                        <div className="space-y-1">
                            <Link href={route('seller.dashboard')} className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-900">
                                <LayoutDashboard className="w-4.5 h-4.5" />
                                <span>Vue d'ensemble</span>
                            </Link>
                            
                            {user.kyc_status === 'verified' ? (
                                shop ? (
                                    <Link href={route('seller.shop.edit')} className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-600 hover:bg-surface-50">
                                        <Store className="w-4.5 h-4.5 text-primary-500" />
                                        <span>Gérer ma Boutique</span>
                                    </Link>
                                ) : (
                                    <Link href={route('seller.shop.create')} className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-600 hover:bg-surface-50">
                                        <Store className="w-4.5 h-4.5 text-primary-500" />
                                        <span>Créer ma Boutique</span>
                                    </Link>
                                )
                            ) : (
                                <span className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-400 cursor-not-allowed opacity-60" title="Vérification KYC requise">
                                    <Store className="w-4.5 h-4.5" />
                                    <span>Ma Boutique (Bloqué)</span>
                                </span>
                            )}
                            
                            <a href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-500 hover:bg-surface-50">
                                <Settings className="w-4.5 h-4.5" />
                                <span>Paramètres</span>
                            </a>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        {/* Status Messages */}
                        {usePage().props.flash?.success && (
                            <div className="bg-secondary-50 border border-secondary-200 text-secondary-800 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm font-semibold">
                                <CheckCircle className="w-5 h-5 text-secondary-500" />
                                <span>{usePage().props.flash.success}</span>
                            </div>
                        )}
                        {usePage().props.flash?.error && (
                            <div className="bg-accent-50 border border-accent-200 text-accent-800 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm font-semibold">
                                <ShieldAlert className="w-5 h-5 text-accent-500" />
                                <span>{usePage().props.flash.error}</span>
                            </div>
                        )}

                        {/* KYC Pending Alert Banner */}
                        {user.kyc_status !== 'verified' && (
                            <Card className="border-yellow-200 bg-yellow-50/50">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-yellow-100 text-yellow-800 rounded-xl animate-pulse">
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-yellow-900">Vérification de votre compte en cours</h3>
                                        <p className="text-sm text-yellow-800 leading-relaxed">
                                            Votre dossier KYC a été soumis et est actuellement en cours de revue par nos administrateurs. 
                                            Cette étape prend généralement moins de 48 heures.
                                        </p>
                                        <p className="text-xs text-yellow-600 font-medium pt-2">
                                            Status actuel : <span className="uppercase font-bold">{user.kyc_status}</span>
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Bento style widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profil Vendeur</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Nom Complet</span>
                                            <span className="font-semibold text-surface-800">{user.first_name} {user.last_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Email</span>
                                            <span className="font-semibold text-surface-800">{user.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Téléphone</span>
                                            <span className="font-semibold text-surface-800">{user.phone}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Formule active</span>
                                            <span className="font-semibold text-surface-800 uppercase flex items-center space-x-1.5 pt-0.5">
                                                <Badge variant="primary">{seller?.pack || 'Starter'}</Badge>
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {user.kyc_status !== 'verified' ? (
                                <Card className="flex flex-col justify-between border-dashed border-surface-300 bg-surface-50/50">
                                    <div>
                                        <CardHeader>
                                            <CardTitle className="text-surface-400">Créer ma boutique</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-surface-500 mb-4 leading-relaxed">
                                                Dès que vos documents KYC auront été approuvés par l'équipe Sellify, vous pourrez créer votre espace de vente professionnel et commencer à proposer vos produits.
                                            </p>
                                        </CardContent>
                                    </div>
                                    <div>
                                        <Button
                                            variant="primary"
                                            className="w-full cursor-not-allowed opacity-60"
                                            disabled={true}
                                        >
                                            Création bloquée (KYC requis)
                                        </Button>
                                    </div>
                                </Card>
                            ) : shop ? (
                                <Card className="flex flex-col justify-between border-primary-200 bg-gradient-to-br from-white to-primary-50/10">
                                    <div>
                                        <CardHeader className="border-b-0 pb-1">
                                            <div className="flex justify-between items-start w-full">
                                                <div>
                                                    <Badge variant="success" className="mb-2">Boutique Active</Badge>
                                                    <CardTitle className="text-xl">{shop.name}</CardTitle>
                                                </div>
                                                {shop.logo_path && (
                                                    <img 
                                                        src={`/storage/${shop.logo_path}`} 
                                                        alt="Logo boutique" 
                                                        className="w-12 h-12 rounded-xl object-cover border border-surface-200" 
                                                    />
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <p className="text-sm text-surface-500 italic mb-3">
                                                "{shop.slogan || 'Pas de slogan configuré'}"
                                            </p>
                                            <div className="text-xs space-y-1.5 text-surface-600">
                                                <p><strong>Raison Sociale :</strong> {shop.company_name}</p>
                                                <p><strong>Adresse :</strong> {shop.address}</p>
                                                <p><strong>Limite de catalogue :</strong> 0 / 30 produits créés</p>
                                            </div>
                                        </CardContent>
                                    </div>
                                    <div className="flex space-x-3 mt-4">
                                        <Link href={route('seller.shop.edit')} className="flex-1">
                                            <Button variant="secondary" className="w-full space-x-2">
                                                <Edit className="w-4 h-4" />
                                                <span>Gérer</span>
                                            </Button>
                                        </Link>
                                        <a href={route('shop.public', shop.slug)} target="_blank" rel="noopener noreferrer" className="flex-1">
                                            <Button variant="primary" className="w-full space-x-2">
                                                <ExternalLink className="w-4 h-4" />
                                                <span>Visiter</span>
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="flex flex-col justify-between border-primary-300 bg-gradient-to-br from-white to-primary-50/20 shadow-md">
                                    <div>
                                        <CardHeader>
                                            <CardTitle className="text-primary-900">Configurer ma boutique</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-surface-600 mb-4 leading-relaxed">
                                                Félicitations ! Votre KYC est validé. Vous pouvez maintenant configurer votre boutique professionnelle moderne avec logos, bannières, horaires et réseaux sociaux (style Alibaba).
                                            </p>
                                        </CardContent>
                                    </div>
                                    <div>
                                        <Link href={route('seller.shop.create')} className="w-full">
                                            <Button
                                                variant="primary"
                                                className="w-full space-x-2 shadow-md hover:scale-[1.01] transition-all"
                                            >
                                                <Store className="w-5 h-5" />
                                                <span>Créer ma boutique professionnelle</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
