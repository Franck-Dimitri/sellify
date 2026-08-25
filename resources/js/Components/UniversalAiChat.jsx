import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Sparkles, 
    Send, 
    Bot, 
    User as UserIcon, 
    Plus, 
    MessageSquare, 
    Trash2, 
    PanelLeftClose, 
    PanelLeftOpen, 
    ArrowUp, 
    TrendingUp, 
    Fuel, 
    ShieldCheck, 
    Award,
    ArrowRight,
    X,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Package,
    ShoppingBag,
    Store,
    BarChart3,
    HelpCircle,
    Maximize2,
    Minimize2
} from 'lucide-react';
import MarkdownText from '@/Components/MarkdownText';

// Typewriter Text Component for Sellify AI Streaming Effect
function TypewriterMessage({ text, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        setDisplayedText('');
        indexRef.current = 0;

        if (!text) return;

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                const nextChunk = text.slice(0, indexRef.current + 5);
                setDisplayedText(nextChunk);
                indexRef.current += 5;
            } else {
                setDisplayedText(text);
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 15);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <MarkdownText 
            content={displayedText} 
            isStreaming={displayedText.length < text.length} 
        />
    );
}

/**
 * Universal Sellify AI 1.2 Flash Component
 * Usable across Customer, Driver, Seller, Admin dashboards, fullpage or modal.
 */
export default function UniversalAiChat({ 
    role = 'customer', 
    user: propUser = null, 
    initialPrompt = null, 
    compact = false,
    onClose = null,
    className = ''
}) {
    const { auth } = usePage().props || {};
    const user = propUser || auth?.user || {};
    const userRole = role || user.role || 'customer';

    const storageKey = `sellify_ai_threads_${userRole}_${user.id || 'guest'}`;

    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // Multi-Thread state in localStorage
    const [threads, setThreads] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Could not read threads from localStorage:', e);
        }
        return [
            {
                id: 'thread-default',
                title: 'Nouvelle discussion',
                createdAt: new Date().toISOString(),
                messages: []
            }
        ];
    });

    const [activeThreadId, setActiveThreadId] = useState(() => {
        return threads[0]?.id || 'thread-default';
    });

    const [sidebarOpen, setSidebarOpen] = useState(!compact);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Voice recognition (Speech-to-Text) state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Voice synthesis (Text-to-Speech) state
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Save threads to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(threads));
        } catch (e) {
            console.warn('Could not save threads to localStorage:', e);
        }
    }, [threads, storageKey]);

    // Active thread object
    const currentThread = threads.find(t => t.id === activeThreadId) || threads[0];
    const messages = currentThread ? currentThread.messages : [];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, loading]);

    // Initial prompt trigger if provided
    useEffect(() => {
        if (initialPrompt && messages.length === 0) {
            handleSendMessage(initialPrompt);
        }
    }, [initialPrompt]);

    // Setup Web Speech API if supported
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'fr-FR';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
                }
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert("La reconnaissance vocale n'est pas supportée par votre navigateur actuel.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.warn('Recognition start error:', err);
                setIsListening(false);
            }
        }
    };

    const speakText = (text) => {
        if (!('speechSynthesis' in window)) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const cleanText = text.replace(/[*#_`\[\]]/g, '').slice(0, 300);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.05;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    // Create New Discussion
    const handleNewChat = () => {
        const newThread = {
            id: `thread-${Date.now()}`,
            title: 'Nouvelle discussion',
            createdAt: new Date().toISOString(),
            messages: []
        };
        setThreads(prev => [newThread, ...prev]);
        setActiveThreadId(newThread.id);
        setInput('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Delete Thread
    const handleDeleteThread = (e, threadId) => {
        e.stopPropagation();
        const filtered = threads.filter(t => t.id !== threadId);
        if (filtered.length === 0) {
            const fresh = {
                id: `thread-${Date.now()}`,
                title: 'Nouvelle discussion',
                createdAt: new Date().toISOString(),
                messages: []
            };
            setThreads([fresh]);
            setActiveThreadId(fresh.id);
        } else {
            setThreads(filtered);
            if (activeThreadId === threadId) {
                setActiveThreadId(filtered[0].id);
            }
        }
    };

    // Send Message
    const handleSendMessage = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query || loading) return;

        setInput('');
        const userMsg = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNew: false,
        };

        // Update current thread with user message & title if first message
        setThreads(prev => prev.map(t => {
            if (t.id === activeThreadId) {
                const isFirst = t.messages.length === 0;
                const newTitle = isFirst ? (query.slice(0, 30) + (query.length > 30 ? '...' : '')) : t.title;
                return {
                    ...t,
                    title: newTitle,
                    messages: [...t.messages, userMsg]
                };
            }
            return t;
        }));

        setLoading(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            // Universal AI API Endpoint
            const res = await fetch(route('ai.chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({ message: query }),
            });

            const data = await res.json();
            const aiMsg = {
                id: `ai-${Date.now()}`,
                sender: 'ai',
                text: data.reply || "Désolé, je n'ai pas pu traiter votre demande pour le moment.",
                action: data.action || null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isNew: true,
            };

            setThreads(prev => prev.map(t => {
                if (t.id === activeThreadId) {
                    return {
                        ...t,
                        messages: [...t.messages, aiMsg]
                    };
                }
                return t;
            }));
        } catch (err) {
            setThreads(prev => prev.map(t => {
                if (t.id === activeThreadId) {
                    return {
                        ...t,
                        messages: [
                            ...t.messages,
                            {
                                id: `err-${Date.now()}`,
                                sender: 'ai',
                                text: "Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet ou réessayer.",
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                isNew: false,
                            }
                        ]
                    };
                }
                return t;
            }));
        } finally {
            setLoading(false);
        }
    };

    // Role-specific Suggestions
    const suggestionsByRole = {
        driver: [
            {
                title: "Économie de carburant",
                desc: "Conseils pour réduire ma consommation d'essence en moto lors des tournées",
                icon: Fuel,
                query: "Donne-moi des conseils pratiques et efficaces pour réduire ma consommation de carburant en moto lors de mes tournées à Douala et Yaoundé."
            },
            {
                title: "Zones à forte demande",
                desc: "Quels sont les quartiers avec le plus de commandes et de bonus en ce moment ?",
                icon: TrendingUp,
                query: "Quelles sont les zones et quartiers avec le plus de commandes et de bonus de surge pricing en ce moment ?"
            },
            {
                title: "Chauffeur Expert",
                desc: "Critères et livraisons restantes pour atteindre le rang Expert",
                icon: Award,
                query: "Combien de livraisons et quelle note me faut-il pour atteindre le statut Chauffeur Expert et quels sont les avantages ?"
            },
            {
                title: "Paiements & Retraits",
                desc: "Délais et modalités de transfert vers MTN MoMo et Orange Money",
                icon: ShieldCheck,
                query: "Comment fonctionnent les retraits de mes gains de livraison vers mon compte MTN Mobile Money ou Orange Money ?"
            }
        ],
        customer: [
            {
                title: "Suivi en direct",
                desc: "Où se trouve ma dernière commande et quel est mon code secret OTP ?",
                icon: Package,
                query: "Où est ma commande la plus récente et comment se déroule la validation avec le code OTP ?"
            },
            {
                title: "Protection Escrow",
                desc: "Comment sont protégés mes fonds jusqu'à la réception physique ?",
                icon: ShieldCheck,
                query: "Comment fonctionne la garantie de séquestre Escrow et comment suis-je protégé en cas de non-conformité ?"
            },
            {
                title: "Points & Réductions",
                desc: "Mon solde de points de fidélité et mes bons de réduction disponibles",
                icon: Sparkles,
                query: "Quel est mon solde de points de confiance, mon palier de fidélité et mes avantages actifs ?"
            },
            {
                title: "Vendeurs Pro Vérifiés",
                desc: "Comment repérer les meilleures boutiques certifiées du catalogue ?",
                icon: Store,
                query: "Comment reconnaître un vendeur vérifié avec RCCM et quelles sont les garanties sur les produits vendus ?"
            }
        ],
        seller: [
            {
                title: "Booster mes ventes",
                desc: "Stratégies d'offres dégressives et promotions pour doubler mon chiffre",
                icon: TrendingUp,
                query: "Quelles sont les meilleures stratégies de remises de gros et promotions pour augmenter mes ventes sur Sellify ?"
            },
            {
                title: "SmartLinks Éclair",
                desc: "Comment générer un lien de paiement direct WhatsApp avec séquestre ?",
                icon: Sparkles,
                query: "Explique-moi comment générer un SmartLink rapide et sécurisé à envoyer à mes clients WhatsApp et TikTok."
            },
            {
                title: "Micro-crédit Seller",
                desc: "Conditions d'éligibilité et calcul du score de crédit IA",
                icon: Award,
                query: "Comment fonctionne le micro-financement des stocks pour les vendeurs certifiés sur Sellify ?"
            },
            {
                title: "Déblocage Escrow",
                desc: "Délai de versement des fonds dès la confirmation de livraison",
                icon: ShieldCheck,
                query: "Quand et comment mon solde en attente est-il transféré vers mon solde disponible après la livraison ?"
            }
        ],
        admin: [
            {
                title: "Audit de la plateforme",
                desc: "Volume d'Escrow sous séquestre, commandes actives et taux de litiges",
                icon: BarChart3,
                query: "Fais-moi un résumé synthétique des métriques clés de la plateforme Sellify Express aujourd'hui."
            },
            {
                title: "Médiation des litiges",
                desc: "Règles d'arbitrage en cas de contestation entre client et vendeur",
                icon: ShieldCheck,
                query: "Quelles sont les directives officielles pour trancher un litige de livraison non conforme ?"
            },
            {
                title: "Validation KYC",
                desc: "Critères de vérification d'identité des vendeurs et chauffeurs",
                icon: UserIcon,
                query: "Quels sont les points de contrôle obligatoires pour valider un dossier KYC vendeur ou livreur ?"
            },
            {
                title: "Performance logistique",
                desc: "Analyse des délais moyens de livraison et zones d'optimisation VRP",
                icon: Package,
                query: "Comment optimiser la couverture logistique et la répartition des chauffeurs aux heures de pointe ?"
            }
        ]
    };

    const suggestions = suggestionsByRole[userRole] || suggestionsByRole.customer;

    return (
        <div className={`w-full h-full min-h-[540px] flex bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs overflow-hidden text-stone-800 font-sans relative ${className}`}>
            
            {/* 1. LEFT SIDEBAR (DISCUSSIONS HISTORY) */}
            <aside 
                className={`
                    ${sidebarOpen ? 'w-64 sm:w-72 translate-x-0' : 'w-0 -translate-x-full border-none opacity-0 pointer-events-none'}
                    transition-all duration-300 ease-in-out bg-stone-50 border-r border-stone-200 flex flex-col shrink-0 overflow-hidden z-20 select-none
                `}
            >
                {/* Top Action Bar */}
                <div className="p-3.5 space-y-2.5 border-b border-stone-200/80">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs border border-yellow-500 shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-xs text-stone-900 tracking-tight">Sellify AI</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 rounded-lg transition-colors"
                            title="Masquer l'historique"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-yellow-50 text-stone-800 hover:text-yellow-950 font-semibold text-xs rounded-xl border border-stone-200 hover:border-yellow-400 shadow-2xs transition-all"
                    >
                        <Plus className="w-4 h-4 text-yellow-700" />
                        <span>Nouvelle discussion</span>
                    </button>
                </div>

                {/* Discussions List */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
                    <div className="px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Récents
                    </div>

                    {threads.map((th) => {
                        const isActive = th.id === activeThreadId;
                        return (
                            <div
                                key={th.id}
                                onClick={() => setActiveThreadId(th.id)}
                                className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                                    isActive 
                                        ? 'bg-yellow-100/80 text-stone-900 font-semibold border border-yellow-300/80 shadow-2xs' 
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                            >
                                <div className="flex items-center gap-2 truncate flex-1">
                                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-yellow-800' : 'text-stone-400'}`} />
                                    <span className="truncate">{th.title}</span>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteThread(e, th.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-200 text-stone-400 hover:text-stone-700 rounded-lg transition-opacity"
                                    title="Supprimer la discussion"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* User Footer */}
                <div className="p-3 border-t border-stone-200/80 bg-stone-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs border border-yellow-500">
                            {user.first_name ? user.first_name.charAt(0) : 'S'}
                        </div>
                        <div className="text-left leading-tight">
                            <p className="text-xs font-bold text-stone-800 truncate max-w-[130px]">
                                {user.first_name || 'Utilisateur'} {user.last_name || ''}
                            </p>
                            <span className="text-[10px] text-stone-400 capitalize font-normal">
                                Espace {userRole === 'driver' ? 'Livreur' : (userRole === 'seller' ? 'Vendeur' : (userRole === 'admin' ? 'Administrateur' : 'Acheteur'))}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONVERSATION CANVAS */}
            <main className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
                
                {/* Top Canvas Header with Sidebar Toggle & Model Badge */}
                <header className="h-13 px-4 sm:px-6 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white z-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                                sidebarOpen 
                                    ? 'hover:bg-stone-100 text-stone-600 hover:text-stone-900' 
                                    : 'bg-yellow-50 hover:bg-yellow-100 text-stone-800 hover:text-yellow-950 border border-yellow-200'
                            }`}
                            title={sidebarOpen ? "Masquer l'historique des discussions" : "Afficher l'historique des discussions"}
                        >
                            {sidebarOpen ? (
                                <PanelLeftClose className="w-4 h-4 text-stone-600" />
                            ) : (
                                <>
                                    <PanelLeftOpen className="w-4 h-4 text-yellow-800" />
                                    <span className="hidden sm:inline text-[11px] font-bold text-stone-800">Historique</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-yellow-600" />
                                <span>Sellify AI</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-950 text-[10px] font-bold border border-yellow-300 shadow-2xs">
                                Sellify AI 1.2 Flash
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleNewChat}
                            className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 hover:bg-yellow-50 border border-stone-200 hover:border-yellow-400 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                            <Plus className="w-3.5 h-3.5 text-yellow-700" />
                            <span className="hidden sm:inline">Nouveau chat</span>
                        </button>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                                title="Fermer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </header>

                {/* Chat Content Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
                    
                    {/* CASE A: EMPTY STATE (LIKE GEMINI HOMEPAGE) */}
                    {messages.length === 0 ? (
                        <div className="max-w-2xl mx-auto min-h-full flex flex-col justify-center items-center text-center space-y-6 py-6 animate-in fade-in">
                            
                            <div className="space-y-2.5">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center mx-auto shadow-2xs border border-yellow-500">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                                    Sur quoi devrions-nous nous concentrer ?
                                </h1>
                                <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-md mx-auto leading-relaxed">
                                    Bonjour {user.first_name || 'cher utilisateur'}. Je suis Sellify AI, votre copilote officiel prêt à vous guider et répondre à toutes vos questions.
                                </p>
                            </div>

                            {/* 4 Gemini-style Suggestion Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
                                {suggestions.map((s, idx) => {
                                    const IconComponent = s.icon;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSendMessage(s.query)}
                                            className="p-3.5 bg-stone-50/80 hover:bg-yellow-50/70 border border-stone-200/80 hover:border-yellow-300 rounded-2xl transition-all text-left space-y-1 shadow-2xs group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs group-hover:text-yellow-950">
                                                <IconComponent className="w-4 h-4 text-stone-500 group-hover:text-yellow-700 shrink-0" />
                                                <span>{s.title}</span>
                                            </div>
                                            <p className="text-[11px] text-stone-500 group-hover:text-stone-700 line-clamp-2 leading-relaxed font-normal">
                                                {s.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    ) : (
                        /* CASE B: ACTIVE CONVERSATION THREAD */
                        <div className="max-w-3xl mx-auto space-y-5 pb-6">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'ai' && (
                                        <div className="w-7 h-7 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 border border-yellow-500 shadow-2xs mt-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 space-y-2.5 leading-relaxed ${
                                            msg.sender === 'user'
                                                ? 'bg-stone-100 text-stone-900 font-medium rounded-tr-none border border-stone-200/80'
                                                : 'bg-stone-50/60 text-stone-800 border border-stone-200/60 rounded-tl-none'
                                        }`}
                                    >
                                        {msg.sender === 'ai' && msg.isNew ? (
                                            <TypewriterMessage
                                                text={msg.text}
                                                onComplete={() => {
                                                    msg.isNew = false;
                                                }}
                                            />
                                        ) : (
                                            <MarkdownText content={msg.text} />
                                        )}

                                        {/* Action Button inside AI Message */}
                                        {msg.action && (
                                            <div className="pt-2 border-t border-stone-100">
                                                <Link
                                                    href={msg.action.url}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] rounded-xl transition-colors shadow-2xs"
                                                >
                                                    <span>{msg.action.label}</span>
                                                    <ArrowRight className="w-3 h-3 text-yellow-400" />
                                                </Link>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-1 border-t border-stone-200/30 text-[9px] text-stone-400">
                                            {msg.sender === 'ai' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => speakText(msg.text)}
                                                    className="flex items-center gap-1 hover:text-stone-700 transition-colors cursor-pointer"
                                                    title="Écouter la réponse vocale"
                                                >
                                                    {isSpeaking ? <VolumeX className="w-3 h-3 text-yellow-600" /> : <Volume2 className="w-3 h-3 text-stone-400" />}
                                                    <span>Écouter</span>
                                                </button>
                                            ) : (
                                                <span></span>
                                            )}
                                            <span>{msg.timestamp}</span>
                                        </div>
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-1">
                                            {user.first_name ? user.first_name.charAt(0) : 'U'}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex items-start gap-3 justify-start">
                                    <div className="w-7 h-7 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 border border-yellow-500 shadow-2xs mt-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="text-xs text-stone-500 flex items-center gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                                        <span>Sellify AI rédige sa réponse...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>
                    )}

                </div>

                {/* Bottom Sticky Gemini Prompt Bar with Voice Speech Support */}
                <div className="p-3 sm:p-4 bg-white border-t border-stone-100 shrink-0">
                    <div className="max-w-3xl mx-auto">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-3xl p-2 sm:p-2.5 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-yellow-400 focus-within:bg-white flex items-center gap-2 sm:gap-2.5"
                        >
                            {/* Voice Microphone Input Button */}
                            <button
                                type="button"
                                onClick={toggleVoiceInput}
                                className={`p-2 rounded-full transition-all shrink-0 ${
                                    isListening 
                                        ? 'bg-rose-500 text-white animate-pulse' 
                                        : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200/60'
                                }`}
                                title={isListening ? 'Arrêter la dictée vocale' : 'Parler à Sellify AI (Dictée vocale)'}
                            >
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>

                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isListening ? "Écoute en cours... Parlez maintenant." : "Poser une question à Sellify AI..."}
                                className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 outline-none placeholder-stone-400 px-2 font-normal"
                                disabled={loading}
                            />

                            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-950 font-bold text-[10px] border border-yellow-300 shrink-0">
                                Sellify AI 1.2 Flash
                            </span>

                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white flex items-center justify-center transition-all shadow-2xs shrink-0"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-[10px] text-stone-400 text-center mt-1.5">
                            Sellify AI 1.2 Flash peut faire des erreurs. Vérifiez les informations financières et réglementaires.
                        </p>
                    </div>
                </div>

            </main>

        </div>
    );
}
