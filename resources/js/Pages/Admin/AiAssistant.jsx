import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function AiAssistant({ user }) {
    return (
        <AdminLayout title="Sellify AI 1.2 Flash">
            <Head title="Sellify AI 1.2 Flash - Copilote SuperAdmin & Arbitrage" />

            <div className="w-full h-[calc(100vh-130px)] min-h-[580px] pb-4">
                <UniversalAiChat 
                    role="admin" 
                    user={user} 
                />
            </div>
        </AdminLayout>
    );
}
