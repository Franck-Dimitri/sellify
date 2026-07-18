import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Button from '../../Components/ui/Button';
import Input from '../../Components/ui/Input';
import { Card } from '../../Components/ui/Card';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <PublicLayout>
            <Head title="Connexion" />
            
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-50">
                <Card className="max-w-md w-full space-y-8 bg-white border border-surface-200 rounded-3xl p-8 shadow-sm">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link href="/" className="inline-block">
                            <span className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center font-extrabold text-surface-950 shadow-sm mx-auto">S</span>
                        </Link>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-surface-900 tracking-tight">Ravi de vous revoir</h2>
                        <p className="text-sm text-surface-500 font-medium">
                            Connectez-vous pour accéder à votre espace sécurisé.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Adresse Email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                placeholder="votre.email@exemple.com"
                                required
                            />

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-surface-700">Mot de passe</label>
                                    <Link href={route('password.request')} className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <Input
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm font-semibold text-surface-600 cursor-pointer">
                                    Se souvenir de moi
                                </label>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full shadow-md hover:-translate-y-0.5 space-x-2"
                                disabled={processing}
                            >
                                <span>Se connecter</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>

                    <div className="text-center text-sm font-semibold text-surface-500 pt-4 border-t border-surface-100">
                        Nouveau sur Sellify ?{' '}
                        <Link href={route('register')} className="text-primary-600 hover:text-primary-700 hover:underline">
                            Créer un compte
                        </Link>
                    </div>
                </Card>
            </div>
        </PublicLayout>
    );
}
