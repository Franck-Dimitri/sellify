import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Sparkles, 
    Send, 
    Bot, 
    User, 
    Plus, 
    MessageSquare, 
    Trash2, 
    PanelLeftClose, 
    PanelLeftOpen, 
    ArrowUp, 
    Compass, 
    TrendingUp, 
    Fuel, 
    ShieldCheck, 
    Award,
    ChevronDown,
    ArrowRight
} from 'lucide-react';
import MarkdownText from '@/Components/MarkdownText';

const THREADS_STORAGE_KEY = 'sellify_ai_gemini_threads_v1';

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

export default function Assistant({ driver = {} }) {
    const user = driver.user || {};
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // Multi-Thread state in localStorage
    const [threads, setThreads] = useState(() => {
        try {
            const saved = localStorage.getItem(THREADS_STORAGE_KEY);
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

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Save threads to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
        } catch (e) {
            console.warn('Could not save threads to localStorage:', e);
        }
    }, [threads]);

    // Active thread object
    const currentThread = threads.find(t => t.id === activeThreadId) || threads[0];
    const messages = currentThread ? currentThread.messages : [];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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
                const newTitle = isFirst ? (query.slice(0, 32) + (query.length > 32 ? '...' : '')) : t.title;
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
            const res = await fetch(route('driver.assistant.chat'), {
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

    const suggestions = [
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
    ];

    return (
        <DriverLayout title="Sellify AI">
            <Head title="Sellify AI - Assistant Intelligent" />

            {/* FULL-CANVAS GEMINI LIGHT THEME WRAPPER */}
            <div className="w-full h-[calc(100vh-140px)] min-h-[600px] flex bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden text-stone-800 font-sans antialiased">
                
                {/* 1. LEFT SIDEBAR (DISCUSSIONS HISTORY) */}
                <aside 
                    className={`${
                        sidebarOpen ? 'w-64 sm:w-72' : 'w-0 -ml-72'
                    } transition-all duration-300 ease-in-out bg-stone-50/70 border-r border-stone-200/80 flex flex-col shrink-0 overflow-hidden select-none`}
                >
                    {/* Top Action Bar */}
                    <div className="p-4 flex items-center justify-between border-b border-stone-200/60">
                        <button
                            onClick={handleNewChat}
                            className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-white hover:bg-stone-100/80 text-stone-800 font-medium text-xs rounded-2xl border border-stone-200 shadow-2xs transition-all"
                        >
                            <Plus className="w-4 h-4 text-stone-600" />
                            <span>Nouvelle discussion</span>
                        </button>
                    </div>

                    {/* Discussions List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        <div className="px-2 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
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
                                            ? 'bg-yellow-100/70 text-stone-900 font-semibold border border-yellow-300/60' 
                                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 truncate flex-1">
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
                    <div className="p-3.5 border-t border-stone-200/60 bg-stone-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs border border-yellow-500">
                                {user.first_name ? user.first_name.charAt(0) : 'S'}
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-xs font-bold text-stone-800 truncate max-w-[130px]">
                                    {user.first_name || 'Utilisateur'} {user.last_name || ''}
                                </p>
                                <span className="text-[10px] text-stone-400 font-normal">Chauffeur Sellify</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 2. MAIN CONVERSATION CANVAS */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    
                    {/* Top Canvas Header with Sidebar Toggle & Model Badge */}
                    <header className="h-14 px-5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-stone-100 text-stone-600 hover:text-stone-900 rounded-xl transition-colors"
                                title={sidebarOpen ? "Masquer la barre latérale" : "Afficher la barre latérale"}
                            >
                                {sidebarOpen ? (
                                    <PanelLeftClose className="w-4 h-4" />
                                ) : (
                                    <PanelLeftOpen className="w-4 h-4" />
                                )}
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-yellow-600" />
                                    <span>Sellify AI</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold border border-stone-200">
                                    Gemini 3.5 Flash
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleNewChat}
                            className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 hover:bg-stone-100 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5 text-stone-500" />
                            <span className="hidden sm:inline">Nouveau chat</span>
                        </button>
                    </header>

                    {/* Chat Content Body */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
                        
                        {/* CASE A: EMPTY STATE (LIKE GEMINI HOMEPAGE) */}
                        {messages.length === 0 ? (
                            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center space-y-8 py-8 animate-in fade-in">
                                
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center mx-auto shadow-2xs border border-yellow-500">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                                        Sur quoi devrions-nous nous concentrer ?
                                    </h1>
                                    <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-md mx-auto">
                                        Bonjour {user.first_name || 'Chauffeur'}. Je suis Sellify AI, prêt à répondre à toutes vos questions logistiques, gains et tournées.
                                    </p>
                                </div>

                                {/* Central Big Gemini Search Bar */}
                                <div className="w-full">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }}
                                        className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200/90 rounded-3xl p-2.5 sm:p-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-yellow-400 focus-within:bg-white flex items-center gap-3"
                                    >
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Demander à Sellify AI..."
                                            className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 outline-none placeholder-stone-400 px-3 font-normal"
                                            disabled={loading}
                                            autoFocus
                                        />

                                        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white text-stone-500 font-semibold text-[10px] border border-stone-200">
                                            Flash 3.5
                                        </span>

                                        <button
                                            type="submit"
                                            disabled={loading || !input.trim()}
                                            className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white flex items-center justify-center transition-all shadow-2xs shrink-0"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>

                                {/* 4 Gemini-style Suggestion Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                                    {suggestions.map((s, idx) => {
                                        const IconComponent = s.icon;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSendMessage(s.query)}
                                                className="p-4 bg-stone-50/80 hover:bg-yellow-50/70 border border-stone-200/80 hover:border-yellow-300 rounded-2xl transition-all text-left space-y-1.5 shadow-2xs group"
                                            >
                                                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs group-hover:text-yellow-950">
                                                    <IconComponent className="w-4 h-4 text-stone-500 group-hover:text-yellow-700" />
                                                    <span>{s.title}</span>
                                                </div>
                                                <p className="text-[11px] text-stone-500 group-hover:text-stone-700 line-clamp-2 leading-relaxed">
                                                    {s.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>
                        ) : (
                            /* CASE B: ACTIVE CONVERSATION THREAD */
                            <div className="max-w-3xl mx-auto space-y-6 pb-24">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.sender === 'ai' && (
                                            <div className="w-7 h-7 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 border border-yellow-500 shadow-2xs mt-1">
                                                <Sparkles className="w-3.5 h-3.5" />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-3 leading-relaxed ${
                                                msg.sender === 'user'
                                                    ? 'bg-stone-100 text-stone-900 font-medium rounded-tr-none border border-stone-200/70'
                                                    : 'bg-transparent text-stone-800'
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

                                            <span className="block text-[9px] text-stone-400 text-right pt-0.5">
                                                {msg.timestamp}
                                            </span>
                                        </div>

                                        {msg.sender === 'user' && (
                                            <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-1">
                                                {user.first_name ? user.first_name.charAt(0) : 'U'}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex items-start gap-3.5 justify-start">
                                        <div className="w-7 h-7 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 border border-yellow-500 shadow-2xs mt-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="text-xs text-stone-500 flex items-center gap-2 p-3">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                                            <span>Sellify AI rédige sa réponse...</span>
                                        </div>
                                    </div>
                                )}

                                <div ref={chatEndRef} />
                            </div>
                        )}

                    </div>

                    {/* Bottom Pinned Gemini Prompt Bar when in active conversation */}
                    {messages.length > 0 && (
                        <div className="p-4 bg-gradient-to-t from-white via-white to-transparent shrink-0">
                            <div className="max-w-3xl mx-auto">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="w-full bg-stone-50 border border-stone-200/90 rounded-3xl p-2 sm:p-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-yellow-400 focus-within:bg-white flex items-center gap-2.5"
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Poser une question à Sellify AI..."
                                        className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 outline-none placeholder-stone-400 px-3 font-normal"
                                        disabled={loading}
                                    />

                                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white text-stone-500 font-semibold text-[10px] border border-stone-200">
                                        Flash 3.5
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim()}
                                        className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white flex items-center justify-center transition-all shadow-2xs shrink-0"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                </form>
                                <p className="text-[10px] text-stone-400 text-center mt-2">
                                    Sellify AI peut faire des erreurs. Vérifiez les informations financières et réglementaires.
                                </p>
                            </div>
                        </div>
                    )}

                </main>

            </div>

        </DriverLayout>
    );
}
