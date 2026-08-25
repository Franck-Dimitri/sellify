import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function AiAssistant({ user }) {
    return (
        <SellerLayout title="Sellify AI 1.2 Flash">
            <Head title="Sellify AI 1.2 Flash - Copilote Vendeur" />

            <div className="w-full h-[calc(100vh-130px)] min-h-[580px] pb-4">
                <UniversalAiChat 
                    role="seller" 
                    user={user} 
                />
            </div>
        </SellerLayout>
    );
}
