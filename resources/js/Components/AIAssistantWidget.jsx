import React, { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Sparkles, X, Maximize2, Minimize2, Move, MessageSquare } from 'lucide-react';
import UniversalAiChat from '@/Components/UniversalAiChat';

export default function AIAssistantWidget() {
    const { auth } = usePage().props || {};
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Position state: null initially so it uses default CSS positioning (bottom-6 right-6)
    // When dragged, { x, y } represents absolute pixel coords from top-left of screen
    const [position, setPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const dragRef = useRef(null);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const elementStartPos = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    const user = auth?.user || {};
    const role = user.role || 'customer';

    // Handle mouse / touch drag start
    const handleDragStart = (e) => {
        if (isOpen) return; // Don't drag when modal is open

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = dragRef.current ? dragRef.current.getBoundingClientRect() : { left: window.innerWidth - 180, top: window.innerHeight - 80 };

        dragStartPos.current = { x: clientX, y: clientY };
        elementStartPos.current = { x: rect.left, y: rect.top };
        hasMoved.current = false;
        setIsDragging(true);
    };

    // Global drag move & end listeners
    useEffect(() => {
        const handleDragMove = (e) => {
            if (!isDragging) return;

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - dragStartPos.current.x;
            const deltaY = clientY - dragStartPos.current.y;

            if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
                hasMoved.current = true;
            }

            // Calculate new position bounded to screen edges
            const bubbleWidth = 140;
            const bubbleHeight = 56;
            const maxX = window.innerWidth - bubbleWidth - 10;
            const maxY = window.innerHeight - bubbleHeight - 10;

            const newX = Math.max(10, Math.min(elementStartPos.current.x + deltaX, maxX));
            const newY = Math.max(10, Math.min(elementStartPos.current.y + deltaY, maxY));

            setPosition({ x: newX, y: newY });
        };

        const handleDragEnd = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove, { passive: false });
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging]);

    const handleClick = (e) => {
        // Only open if it wasn't an active drag gesture
        if (!hasMoved.current) {
            setIsOpen(true);
        }
    };

    const floatingStyle = position 
        ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
        : {};

    return (
        <div 
            ref={dragRef}
            style={floatingStyle}
            className={`fixed ${!position ? 'bottom-6 right-6' : ''} z-50 select-none`}
        >
            {!isOpen ? (
                <div 
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onClick={handleClick}
                    className={`flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-semibold px-4 py-3 rounded-full shadow-2xl transition-transform border border-yellow-500 cursor-grab active:cursor-grabbing group ${
                        isDragging ? 'scale-105 opacity-90 shadow-2xl ring-4 ring-yellow-400/30' : 'hover:scale-105'
                    }`}
                    title="Glissez-déposez pour déplacer la bulle Sellify AI"
                >
                    <div className="relative">
                        <Sparkles className="w-5 h-5 text-stone-950 group-hover:rotate-12 transition-transform" />
                        <span className="flex h-2 w-2 absolute -top-0.5 -right-0.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </div>

                    <span className="text-xs sm:text-sm font-semibold tracking-tight">Sellify AI</span>

                    <Move className="w-3.5 h-3.5 text-stone-700 opacity-40 group-hover:opacity-100 transition-opacity ml-0.5" />
                </div>
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
                    <div className="h-11 px-4 bg-stone-900 text-white flex items-center justify-between text-xs font-semibold select-none">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-yellow-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                                AI
                            </div>
                            <span className="font-semibold text-stone-100">Sellify AI 1.2 Flash · Assistant Flottant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
                                title={isExpanded ? "Réduire" : "Plein écran"}
                            >
                                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsExpanded(false);
                                }}
                                className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
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
