import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Button from '../../Components/ui/Button';
import Input from '../../Components/ui/Input';
import { Card } from '../../Components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <PublicLayout>
            <Head title="Mot de passe oublié" />

            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-50">
                <Card className="max-w-md w-full space-y-8 bg-white border border-surface-200 rounded-3xl p-8 shadow-sm">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link href="/login" className="inline-flex items-center text-xs font-bold text-surface-400 hover:text-surface-600 mb-2">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                            Retour à la connexion
                        </Link>
                        <h2 className="text-2xl font-extrabold text-surface-900 tracking-tight">Mot de passe oublié</h2>
                        <p className="text-sm text-surface-500 font-medium leading-relaxed">
                            Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe (simulé par OTP/Email dans les logs).
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full shadow-md"
                                disabled={processing}
                            >
                                Envoyer le lien
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </PublicLayout>
    );
}
