import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import MarkdownText from '@/Components/MarkdownText';

export default function AIAssistantWidget() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: `Bonjour ${auth?.user?.first_name || ''} ! Je suis Sellify AI, votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Désolé, une erreur est survenue lors de la communication avec le moteur IA." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold px-4 py-3 rounded-full shadow-xl transition-all transform hover:scale-105 border border-yellow-500"
                >
                    <Sparkles className="w-5 h-5 text-yellow-950" />
                    <span>Sellify AI</span>
                </button>
            ) : (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col h-[520px] overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-yellow-400 text-yellow-950 px-4 py-3 flex items-center justify-between border-b border-yellow-500">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-yellow-500 text-yellow-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xs sm:text-sm text-stone-900">Sellify AI</h3>
                                <p className="text-[10px] text-yellow-900 font-medium">Assistant intelligent en direct</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-yellow-950 hover:bg-yellow-500 rounded-lg w-7 h-7 flex items-center justify-center transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50 text-xs">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className="w-6 h-6 rounded bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 mt-0.5 border border-yellow-500">
                                        <Bot className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                                        msg.sender === 'user'
                                            ? 'bg-yellow-400 text-yellow-950 font-semibold rounded-tr-none shadow-2xs border border-yellow-500'
                                            : 'bg-white text-stone-800 border border-stone-200/80 shadow-2xs rounded-tl-none'
                                    }`}
                                >
                                    {msg.sender === 'ai' ? (
                                        <MarkdownText content={msg.text} />
                                    ) : (
                                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                                    )}
                                </div>
                                {msg.sender === 'user' && (
                                    <div className="w-6 h-6 rounded bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start items-center gap-2">
                                <div className="w-6 h-6 rounded bg-yellow-400 text-yellow-950 flex items-center justify-center shrink-0 border border-yellow-500">
                                    <Bot className="w-3.5 h-3.5" />
                                </div>
                                <div className="bg-white border border-stone-200/80 shadow-2xs rounded-2xl px-3 py-2 text-stone-500 text-xs flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                                    <span>Sellify AI réfléchit...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Footer */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Posez votre question à Sellify AI..."
                            className="flex-1 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-stone-900 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs px-3.5 py-2 rounded-xl transition border border-yellow-500 disabled:opacity-50 flex items-center gap-1 shrink-0"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
