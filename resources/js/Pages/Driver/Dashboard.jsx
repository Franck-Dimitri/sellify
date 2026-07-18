import React from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import { ShieldAlert, LogOut, Truck, LayoutDashboard, Settings } from 'lucide-react';
import Button from '../../Components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const driver = user.driver;

    return (
        <>
            <Head title="Tableau de bord Livreur" />
            <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
                {/* Navbar Livreur */}
                <header className="bg-white border-b border-surface-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center space-x-4">
                        <span className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-extrabold text-surface-950">S</span>
                        <span className="font-extrabold text-lg tracking-tight text-surface-900">Sellify Espace Livreur</span>
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
                    {/* Sidebar navigation autorisée */}
                    <aside className="w-64 bg-white border border-surface-200 rounded-2xl p-4 hidden md:block h-fit space-y-2">
                        <div className="flex items-center space-x-3 px-3 py-2 text-surface-900 font-bold border-b border-surface-100 mb-4">
                            <LayoutDashboard className="w-5 h-5 text-primary-500" />
                            <span>Menu Livreur</span>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-900">
                                <LayoutDashboard className="w-4.5 h-4.5" />
                                <span>Vue d'ensemble</span>
                            </a>
                            <a href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-400 cursor-not-allowed opacity-60" title="Vérification KYC requise">
                                <Truck className="w-4.5 h-4.5" />
                                <span>Mes Livraisons (Bloqué)</span>
                            </a>
                            <a href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-500 hover:bg-surface-50">
                                <Settings className="w-4.5 h-4.5" />
                                <span>Paramètres</span>
                            </a>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        {/* KYC Pending Alert Banner */}
                        {user.kyc_status !== 'verified' && (
                            <Card className="border-yellow-200 bg-yellow-50/50">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-yellow-100 text-yellow-800 rounded-xl">
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-yellow-900">Vérification de votre compte en cours</h3>
                                        <p className="text-sm text-yellow-800 leading-relaxed">
                                            Votre dossier KYC (documents d'identité, permis et véhicule) a été soumis et est actuellement en cours de revue par nos administrateurs.
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
                                    <CardTitle>Profil Livreur</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Nom Complet</span>
                                            <span className="font-semibold text-surface-800">{user.first_name} {user.last_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Véhicule</span>
                                            <span className="font-semibold text-surface-800 capitalize">{driver?.vehicle_type}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Numéro de permis</span>
                                            <span className="font-semibold text-surface-800">{driver?.license_number}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Plaque d'immatriculation</span>
                                            <span className="font-semibold text-surface-800">{driver?.vehicle_plate}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-xs text-surface-400 font-bold uppercase block">Zone de couverture</span>
                                            <span className="font-semibold text-surface-800">{driver?.coverage_zone}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="flex flex-col justify-between">
                                <div>
                                    <CardHeader>
                                        <CardTitle>Accepter des courses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-surface-500 mb-4 leading-relaxed">
                                            Dès que votre dossier sera validé par l'équipe Sellify, vous pourrez recevoir des propositions de livraison dans vos zones de couverture via notre IA logistique.
                                        </p>
                                    </CardContent>
                                </div>
                                <div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        alert("Cette action nécessite la validation de votre KYC.");
                                    }}>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="w-full"
                                            disabled={user.kyc_status !== 'verified'}
                                        >
                                            Passer disponible (Bloqué)
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
