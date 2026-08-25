import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Sparkles, X, Maximize2, Minimize2 } from 'lucide-react';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function AIAssistantWidget() {
    const { auth } = usePage().props || {};
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const user = auth?.user || {};
    const role = user.role || 'customer';

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold px-4 py-3 rounded-full shadow-xl transition-all transform hover:scale-105 border border-yellow-500 cursor-pointer group"
                >
                    <Sparkles className="w-5 h-5 text-yellow-950 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs sm:text-sm">Sellify AI</span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </button>
            ) : (
                <div 
                    className={`
                        ${isExpanded 
                            ? 'fixed inset-4 sm:inset-10 z-50' 
                            : 'w-[92vw] sm:w-[500px] h-[620px] max-h-[85vh]'
                        } 
                        bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 transition-all duration-200
                    `}
                >
                    {/* Top control bar for modal */}
                    <div className="h-10 px-4 bg-stone-900 text-white flex items-center justify-between text-xs font-semibold select-none">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            <span>Sellify AI 1.2 Flash · Widget Flottant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
                                title={isExpanded ? "Réduire" : "Plein écran"}
                            >
                                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsExpanded(false);
                                }}
                                className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
                                title="Fermer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Universal AI Chat Body */}
                    <div className="flex-1 overflow-hidden">
                        <UniversalAiChat 
                            role={role} 
                            user={user}
                            compact={!isExpanded}
                            onClose={() => setIsOpen(false)}
                            className="rounded-none border-none shadow-none min-h-0"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
