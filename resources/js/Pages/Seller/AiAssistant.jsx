import React from 'react';
import { Head } from '@inertiajs/react';
import SellerCentralLayout from '@/Layouts/SellerCentralLayout';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function AiAssistant({ user }) {
    return (
        <SellerCentralLayout title="Sellify AI 1.2 Flash">
            <Head title="Sellify AI 1.2 Flash - Copilote Vendeur" />

            <div className="w-full h-[calc(100vh-130px)] min-h-[580px] pb-4">
                <UniversalAiChat 
                    role="seller" 
                    user={user} 
                />
            </div>
        </SellerCentralLayout>
    );
}
