import React from 'react';
import { useForm } from '@inertiajs/react';
import Button from '../../../Components/ui/Button';
import Input from '../../../Components/ui/Input';
import { Card } from '../../../Components/ui/Card';

export default function CustomerForm() {
    const { data, setData, post, processing, errors } = useForm({
        role: 'customer',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <Card className="bg-white p-8 border border-surface-200 rounded-3xl shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Prénom"
                        name="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        error={errors.first_name}
                        placeholder="Ex: John"
                        required
                    />
                    <Input
                        label="Nom"
                        name="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        error={errors.last_name}
                        placeholder="Ex: Doe"
                        required
                    />
                </div>

                <Input
                    label="Adresse Email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="john.doe@exemple.com"
                    required
                />

                <Input
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="Ex: +237699999999"
                    required
                />

                <Input
                    label="Mot de passe"
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

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full shadow-md"
                        disabled={processing}
                    >
                        Créer mon compte Client
                    </Button>
                </div>
            </form>
        </Card>
    );
}
