import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Button from '../../Components/ui/Button';
import Input from '../../Components/ui/Input';
import { Card } from '../../Components/ui/Card';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <PublicLayout>
            <Head title="Réinitialiser le mot de passe" />

            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-50">
                <Card className="max-w-md w-full space-y-8 bg-white border border-surface-200 rounded-3xl p-8 shadow-sm">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-extrabold text-surface-900 tracking-tight">Réinitialisation</h2>
                        <p className="text-sm text-surface-500 font-medium">
                            Définissez votre nouveau mot de passe sécurisé.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="token" value={data.token} />

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

                        <Input
                            label="Nouveau mot de passe"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            placeholder="••••••••"
                            required
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            placeholder="••••••••"
                            required
                        />

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full shadow-md"
                                disabled={processing}
                            >
                                Enregistrer le mot de passe
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </PublicLayout>
    );
}
