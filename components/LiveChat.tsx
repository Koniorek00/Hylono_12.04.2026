import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Headphones, Bot, Phone } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'agent';
    time: string;
}

export const LiveChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'select' | 'chat'>('select');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Hello! How can I help you today?', sender: 'agent', time: 'Now' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            time: 'Now'
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate agent response
        setTimeout(() => {
            const responses = [
                'Let me look into that for you.',
                'Great question! Our team will get back to you shortly.',
                'I understand. Would you like me to connect you with a specialist?',
                'Thank you for your interest in our products!'
            ];
            const agentMsg: Message = {
                id: Date.now() + 1,
                text: responses[Math.floor(Math.random() * responses.length)],
                sender: 'agent',
                time: 'Now'
            };
            setMessages(prev => [...prev, agentMsg]);
        }, 1000);
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
            >
                <MessageCircle className="text-white" size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Headphones size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Hylono Support</p>
                                        <p className="text-xs text-white/70 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Online
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsOpen(false); setMode('select'); }} className="text-white/70 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {mode === 'select' ? (
                            <div className="p-4 space-y-3">
                                <p className="text-sm text-slate-600 mb-4">How would you like to connect?</p>

                                <button
                                    onClick={() => setMode('chat')}
                                    className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
                                >
                                    <MessageCircle className="text-cyan-500" size={24} />
                                    <div>
                                        <p className="font-medium text-slate-900">Live Chat</p>
                                        <p className="text-xs text-slate-500">Chat with our team</p>
                                    </div>
                                </button>

                                <a
                                    href="https://wa.me/48123456789"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                >
                                    <Phone className="text-emerald-500" size={24} />
                                    <div>
                                        <p className="font-medium text-slate-900">WhatsApp</p>
                                        <p className="text-xs text-slate-500">Message us directly</p>
                                    </div>
                                </a>

                                <button
                                    onClick={() => setMode('chat')}
                                    className="w-full flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left"
                                >
                                    <Bot className="text-purple-500" size={24} />
                                    <div>
                                        <p className="font-medium text-slate-900">AI Assistant</p>
                                        <p className="text-xs text-slate-500">Instant answers 24/7</p>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="h-64 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                    ? 'bg-cyan-500 text-white rounded-br-md'
                                                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
