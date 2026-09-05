import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function AiAssistant({ user, recentOrders = [], loyaltyPoints = 0 }) {
    return (
        <CustomerLayout title="Sellify AI 1.2 Flash">
            <Head title="Sellify AI 1.2 Flash - Copilote Acheteur" />

            <div className="w-full h-[calc(100vh-130px)] min-h-[580px] pb-4">
                <UniversalAiChat 
                    role="customer" 
                    user={user} 
                />
            </div>
        </CustomerLayout>
    );
}
