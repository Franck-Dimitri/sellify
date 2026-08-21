import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import { 
    Sparkles, 
    Send, 
    Bot, 
    User, 
    Flame, 
    Wallet, 
    Award, 
    TrendingUp, 
    ArrowRight, 
    Coins, 
    ShieldCheck, 
    Trash2,
    RefreshCw,
    Compass,
    HelpCircle,
    Zap,
    MapPin
} from 'lucide-react';

const STORAGE_KEY = 'sellify_ai_driver_chat_history_v1';

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
                // Advance by chunks of 3-5 chars for smooth, natural reading speed
                const nextChunk = text.slice(0, indexRef.current + 4);
                setDisplayedText(nextChunk);
                indexRef.current += 4;
            } else {
                setDisplayedText(text);
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 18);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className="whitespace-pre-line text-xs leading-relaxed">
            {displayedText.split('\n').map((line, idx) => (
                <p key={idx} className={line.startsWith('- ') ? 'pl-2 my-0.5' : 'my-0.5'}>
                    {line}
                </p>
            ))}
            {displayedText.length < text.length && (
                <span className="inline-block w-1.5 h-3 bg-yellow-500 ml-1 animate-pulse" />
            )}
        </div>
    );
}

export default function Assistant({ 
    driver = {}, 
    kpis = {}, 
    hotspots = [] 
}) {
    const user = driver.user || {};
    const chatEndRef = useRef(null);

    const initialWelcomeMessage = {
        id: 'init-welcome',
        sender: 'ai',
        text: `Bonjour ${user.first_name || 'Chauffeur'} ! Je suis Sellify AI, votre assistant intelligent propulsé par Google Gemini.\n\nJe peux analyser vos performances de livraison, vous conseiller les meilleurs créneaux horaires, localiser les zones à forte demande ou simuler vos retraits de gains.\n\nPosez-moi votre question en toute liberté ci-dessous.`,
        timestamp: 'À l\'instant',
        isNew: false,
    };

    // Load persisted chat history from localStorage
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((m) => ({ ...m, isNew: false }));
                }
            }
        } catch (e) {
            console.warn('Could not read chat history from localStorage:', e);
        }
        return [initialWelcomeMessage];
    });

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Save chat history to localStorage whenever messages change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {
            console.warn('Could not save chat history to localStorage:', e);
        }
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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

        setMessages((prev) => [...prev, userMsg]);
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
                isNew: true, // triggers typewriter animation
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'ai',
                    text: "Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet ou réessayer dans un instant.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isNew: false,
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (confirm("Voulez-vous réinitialiser l'historique de votre conversation avec Sellify AI ?")) {
            localStorage.removeItem(STORAGE_KEY);
            setMessages([initialWelcomeMessage]);
        }
    };

    const quickSuggestions = [
        { label: "Maximiser mes gains aujourd'hui", query: "Comment puis-je maximiser mes revenus de livraison aujourd'hui ?" },
        { label: "Où sont les zones à forte demande ?", query: "Quelles sont les zones et quartiers avec le plus de commandes en ce moment ?" },
        { label: "Objectif Chauffeur Expert", query: "Combien de livraisons et quelle note me faut-il pour atteindre le statut Chauffeur Expert ?" },
        { label: "Comment retirer mon solde ?", query: "Quelles sont les modalités et délais pour retirer mon argent vers MTN MoMo ou Orange Money ?" },
        { label: "Astuces gestion carburant", query: "Donne-moi des conseils pratiques pour réduire ma consommation de carburant en moto lors de mes tournées." },
    ];

    return (
        <DriverLayout title="Sellify AI - Assistant Chauffeur">
            <Head title="Sellify AI - Assistant Logistique Intelligent" />

            <div className="w-full space-y-6 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/80 p-5 rounded-2xl shadow-2xs">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                            <span>Intelligence Artificielle Google Gemini 1.5</span>
                        </div>
                        <h1 className="text-xl font-bold text-stone-900 mt-1 flex items-center gap-2">
                            <span>Sellify AI</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-950 font-semibold border border-yellow-300">
                                Copilote Chauffeur
                            </span>
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Discutez librement en langage naturel avec Sellify AI pour optimiser vos gains, vos itinéraires et vos performances terrain.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={handleClearHistory}
                            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-stone-200"
                            title="Effacer l'historique de discussion"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-stone-500" />
                            <span>Effacer l'historique</span>
                        </button>
                    </div>
                </div>

                {/* 4 TOP BUSINESS STAT KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Solde disponible</span>
                            <Wallet className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-xl font-bold text-emerald-600">
                            {Number(kpis.available_balance || 0).toLocaleString('fr-FR')} <span className="text-xs text-stone-500 font-normal">FCFA</span>
                        </p>
                        <span className="text-[10px] text-stone-400">Transfert immédiat sans frais</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Échelon & Réputation</span>
                            <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <p className="text-xl font-bold text-stone-900">
                            Chauffeur {kpis.current_tier || 'Pro'}
                        </p>
                        <span className="text-[10px] text-stone-400">Note certifiée : <strong>{kpis.rating || 4.90} / 5</strong></span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Points fidélité</span>
                            <Coins className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-xl font-bold text-amber-600">
                            {Number(kpis.reward_points || 0).toLocaleString('fr-FR')} <span className="text-xs text-stone-500 font-normal">pts</span>
                        </p>
                        <span className="text-[10px] text-stone-400">Valeur : {Number(kpis.reward_points || 0).toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500">Affluence en direct</span>
                            <Flame className="w-4 h-4 text-rose-600" />
                        </div>
                        <p className="text-xl font-bold text-rose-600">+30% Bonus</p>
                        <span className="text-[10px] text-stone-400">Secteur Bastos & Akwa</span>
                    </div>
                </div>

                {/* MAIN CONVERSATION INTERFACE & SIDEBAR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* CHAT CONTAINER (2 COLS) */}
                    <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl shadow-2xs flex flex-col h-[620px] overflow-hidden">
                        
                        {/* Chat Header */}
                        <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs border border-yellow-500 shadow-2xs">
                                    <Sparkles className="w-4 h-4 text-yellow-950" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs sm:text-sm text-stone-900">Discussion avec Sellify AI</h3>
                                    <span className="text-[10px] text-stone-400 font-normal">Modèle connecté en temps réel avec votre profil</span>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span>Actif</span>
                            </span>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-50/30 text-xs">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'ai' && (
                                        <div className="w-7 h-7 rounded-lg bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-[11px] shrink-0 border border-yellow-500 shadow-2xs mt-0.5">
                                            <Bot className="w-3.5 h-3.5" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 space-y-2.5 leading-relaxed ${
                                            msg.sender === 'user'
                                                ? 'bg-yellow-400 text-yellow-950 font-semibold rounded-tr-none shadow-2xs border border-yellow-500'
                                                : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none shadow-2xs'
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
                                            <div className="whitespace-pre-line text-xs">
                                                {msg.text.split('\n').map((line, idx) => (
                                                    <p key={idx} className={line.startsWith('- ') ? 'pl-2 my-0.5' : 'my-0.5'}>
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Button inside AI Message if present */}
                                        {msg.action && (
                                            <div className="pt-2 border-t border-stone-100">
                                                <Link
                                                    href={msg.action.url}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] rounded-lg transition-colors shadow-2xs"
                                                >
                                                    <span>{msg.action.label}</span>
                                                    <ArrowRight className="w-3 h-3 text-yellow-400" />
                                                </Link>
                                            </div>
                                        )}

                                        <span className={`block text-[9px] ${msg.sender === 'user' ? 'text-yellow-900' : 'text-stone-400'} text-right`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="w-7 h-7 rounded-lg bg-stone-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs mt-0.5">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex items-start gap-2.5 justify-start">
                                    <div className="w-7 h-7 rounded-lg bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-[11px] shrink-0 border border-yellow-500 shadow-2xs mt-0.5">
                                        <Bot className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-none p-3.5 shadow-2xs text-xs text-stone-500 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                                        <span>Sellify AI rédige sa réponse...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        {/* Suggestion Chips */}
                        <div className="px-4 py-2 bg-stone-100/60 border-t border-stone-200/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                            <span className="font-bold text-stone-400 shrink-0 text-[10px] uppercase">Suggestions :</span>
                            {quickSuggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSendMessage(s.query)}
                                    className="px-2.5 py-1 bg-white hover:bg-yellow-50 border border-stone-200 hover:border-yellow-400 text-stone-700 hover:text-stone-950 rounded-lg shrink-0 font-medium transition-colors shadow-2xs"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="p-3 border-t border-stone-100 bg-white flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez une question en langage naturel à Sellify AI..."
                                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
                                disabled={loading}
                            />

                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Envoyer</span>
                            </button>
                        </form>

                    </div>

                    {/* RIGHT SIDEBAR WIDGETS (1 COL) */}
                    <div className="space-y-4">
                        
                        {/* WIDGET 1 : OBJECTIF CHAUFFEUR EXPERT */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                                    <Award className="w-4 h-4 text-purple-600" />
                                    <span>Objectif Chauffeur Expert</span>
                                </div>
                                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                    Rang Élite
                                </span>
                            </div>

                            <p className="text-xs text-stone-600 leading-snug">
                                Accédez aux livraisons B2B prioritaires à haute valeur ajoutée et aux micro-crédits d'équipement en atteignant <strong>500 livraisons</strong> et une note ≥ <strong>4.8 / 5</strong>.
                            </p>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-stone-500">Progression</span>
                                    <strong className="text-stone-900">{kpis.total_deliveries || 215} / 500 courses</strong>
                                </div>
                                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                    <div 
                                        className="h-full bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, Math.round(((kpis.total_deliveries || 215) / 500) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* WIDGET 2 : SURGE PRICING ZONES CHAUDES */}
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                                    <Flame className="w-4 h-4 text-rose-600" />
                                    <span>Zones à Forte Demande</span>
                                </div>
                                <Link
                                    href={route('driver.map')}
                                    className="text-[11px] text-yellow-700 hover:underline font-bold flex items-center gap-1"
                                >
                                    <span>Carte</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="space-y-2 text-xs">
                                {hotspots.map((h, idx) => (
                                    <div key={idx} className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between">
                                        <div>
                                            <strong className="text-stone-900 block">{h.name}</strong>
                                            <span className="text-[10px] text-stone-400">{h.city} · {h.status}</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-900 font-bold text-[10px] rounded">
                                            {h.surge}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WIDGET 3 : SÉCURITÉ ET CONFORMITÉ */}
                        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-2 text-xs text-stone-700">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Protection & Confidentialité</span>
                            </div>
                            <p className="text-[11px] text-stone-500 leading-snug">
                                Vos données de livraison et vos historiques de gains sont traités de manière sécurisée sous chiffrement pour vous fournir des conseils personnalisés.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </DriverLayout>
    );
}
