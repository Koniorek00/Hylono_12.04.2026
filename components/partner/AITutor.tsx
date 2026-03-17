import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Sparkles, X, Bot } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

interface AITutorProps {
    videoTitle?: string;
    onClose?: () => void;
}

const MOCK_RESPONSES: Record<string, string> = {
    'pressure': 'The recommended pressure for standard HBOT sessions is between 1.5-2.0 ATA. Start low and gradually increase based on client comfort and the session protocol.',
    'ear': 'If a client experiences ear discomfort: 1) Pause pressurization immediately, 2) Encourage swallowing or jaw movement, 3) If pain persists, slowly depressurize. Do not continue if pain is severe.',
    'emergency': 'In an emergency: 1) Stay calm, 2) Initiate controlled depressurization, 3) Open communication with the client, 4) Follow your clinic\'s emergency protocol, 5) Document the incident.',
    'default': 'I\'m your AI learning assistant! I can help explain concepts from your training. Try asking about pressure settings, client comfort, or emergency procedures.'
};

export const AITutor: React.FC<AITutorProps> = ({ videoTitle, onClose }) => {
    const [messageCounter, setMessageCounter] = useState(2);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: videoTitle
                ? `I'm here to help you understand "${videoTitle}". What would you like to know?`
                : 'Hi! I\'m your AI tutor. Ask me anything about your training content!'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessageId = `msg-${messageCounter}`;
        const aiMessageId = `msg-${messageCounter + 1}`;
        setMessageCounter((prev) => prev + 2);

        const userMessage: Message = {
            id: userMessageId,
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = MOCK_RESPONSES.default ?? 'Thanks for your question. I can help with pressure, ear comfort, and emergency procedures.';

            if (lowerInput.includes('pressure')) response = MOCK_RESPONSES.pressure ?? response;
            else if (lowerInput.includes('ear')) response = MOCK_RESPONSES.ear ?? response;
            else if (lowerInput.includes('emergency')) response = MOCK_RESPONSES.emergency ?? response;

            const aiMessage: Message = {
                id: aiMessageId,
                role: 'ai',
                content: response
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="AI Tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
        >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <Bot className="w-5 h-5" aria-hidden="true" />
                    <span className="font-bold">AI Tutor</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
                </div>
                {onClose && (
                    <button onClick={onClose} aria-label="Close AI Tutor" className="text-white/80 hover:text-white">
                        <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm
                                ${msg.role === 'user'
                                    ? 'bg-cyan-500 text-white rounded-br-md'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 px-3 py-2 text-sm bg-slate-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    AI responses are for educational purposes only
                </p>
            </div>
        </motion.div>
    );
};
