import React from 'react';
import { Head } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function Assistant({ driver = {} }) {
    const user = driver.user || {};

    return (
        <DriverLayout title="Sellify AI">
            <Head title="Sellify AI - Assistant Chauffeur" />

            <div className="w-full h-[calc(100vh-130px)] min-h-[580px] pb-4">
                <UniversalAiChat 
                    role="driver" 
                    user={user} 
                />
            </div>
        </DriverLayout>
    );
}
