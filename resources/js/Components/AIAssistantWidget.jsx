import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function AIAssistantWidget() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: `Bonjour ${auth?.user?.first_name || ''} ! Je suis votre Copilote IA Sellify. Comment puis-je vous aider aujourd'hui ?`
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
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-full shadow-xl transition-all transform hover:scale-105"
                >
                    <span className="text-xl">✨</span>
                    <span>Copilote IA</span>
                </button>
            ) : (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col h-[500px] overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <div>
                                <h3 className="font-semibold text-sm">Copilote IA Sellify</h3>
                                <p className="text-xs text-indigo-200">En ligne • Assistant personnel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                        msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                    }`}
                                >
                                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-2 text-gray-500 text-xs flex items-center gap-2">
                                    <span className="animate-spin">⏳</span> Réflexion en cours...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Footer */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Posez une question à l'IA..."
                            className="flex-1 text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition disabled:opacity-50"
                        >
                            Envoyer
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
