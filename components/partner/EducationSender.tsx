import React, { useState } from 'react';
import {
    BookOpen,
    Send,
    CheckCircle2,
    PlayCircle,
    FileText,
    Brain
} from 'lucide-react';

const RESOURCES = [
    {
        id: 'hbot-intro',
        title: 'HBOT: What to Expect',
        type: 'video',
        duration: '2 min',
        description: 'A comforting walkthrough of the chamber experience to reduce anxiety.'
    },
    {
        id: 'recovery-science',
        title: 'The Science of Recovery',
        type: 'guide',
        pages: '4 pages',
        description: 'Deep dive into how oxygen and light therapy accelerate cellular repair.'
    },
    {
        id: 'sleep-protocol',
        title: 'Sleep Optimization',
        type: 'protocol',
        description: 'Pre and post-session habits to maximize deep sleep.'
    }
];

export const EducationSender: React.FC = () => {
    const [sent, setSent] = useState(false);
    const [contact, setContact] = useState('');
    const [selectedResource, setSelectedResource] = useState<string>(RESOURCES[0]?.id ?? '');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setContact('');
        }, 3000);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Client Education Hub</h3>
                    <p className="text-xs text-slate-500">Send knowledge resources to improve retention</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Resource Selection */}
                <div className="space-y-2">
                    {RESOURCES.map((resource) => (
                        <div
                            key={resource.id}
                            onClick={() => setSelectedResource(resource.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${selectedResource === resource.id
                                    ? 'bg-rose-50 border-rose-200'
                                    : 'bg-white border-slate-100 hover:border-slate-300'
                                }`}
                        >
                            <div className={`mt-0.5 ${selectedResource === resource.id ? 'text-rose-500' : 'text-slate-400'}`}>
                                {resource.type === 'video' && <PlayCircle className="w-5 h-5" />}
                                {resource.type === 'guide' && <FileText className="w-5 h-5" />}
                                {resource.type === 'protocol' && <Brain className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${selectedResource === resource.id ? 'text-rose-900' : 'text-slate-700'}`}>
                                    {resource.title}
                                </h4>
                                <p className="text-xs text-slate-500 leading-tight mt-1">{resource.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sender Form */}
                <form onSubmit={handleSend} className="pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Send to Client (Mobile or Email)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="(555) 123-4567"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            disabled={sent}
                            className={`px-4 py-2 rounded-lg font-bold text-white flex items-center gap-2 transition-all ${sent
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-900 hover:bg-slate-800'
                                }`}
                        >
                            {sent ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Sent
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Send
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
