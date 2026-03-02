import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Sparkles, Activity, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceAnalysis {
    type: 'condition' | 'biometric' | 'protocol';
    value: string;
    zone?: string;
}

interface VoiceCommandProps {
    onCommand: (text: string, analysis: VoiceAnalysis) => void;
}

export const VoiceCommand: React.FC<VoiceCommandProps> = ({ onCommand }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    
    // Store timeout IDs for cleanup
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

    // Cleanup all timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(id => clearTimeout(id));
            timeoutRefs.current = [];
        };
    }, []);

    // Helper to track timeouts
    const setTimeoutTracked = useCallback((callback: () => void, delay: number) => {
        const id = setTimeout(callback, delay);
        timeoutRefs.current.push(id);
        return id;
    }, []);

    // Clear feedback after delay with tracked timeout
    const clearFeedbackAfterDelay = useCallback(() => {
        setTimeoutTracked(() => setFeedback(null), 3000);
    }, [setTimeoutTracked]);

    // Simulation of Voice AI (since Web Speech API requires HTTPS or localhost exact and can be flaky in some headless envs)
    // In a real app, this would use `window.SpeechRecognition`
    const toggleListening = useCallback(() => {
        if (isListening) {
            // Cancel all pending timeouts
            timeoutRefs.current.forEach(id => clearTimeout(id));
            timeoutRefs.current = [];
            setIsListening(false);
            setTranscript('');
            return;
        }

        setIsListening(true);
        setFeedback("Listening for clinical observations...");

        // MOCK SPEECH RECOGNITION SEQUENCE
        // This simulates the user speaking and the system parsing it
        setTimeoutTracked(() => setTranscript("Patient reporting..."), 1000);
        setTimeoutTracked(() => setTranscript("Patient reporting severe Migraine..."), 2000);
        setTimeoutTracked(() => setTranscript("Patient reporting severe Migraine and elevated stress levels."), 3500);

        // Finalize
        setTimeoutTracked(() => {
            handleFinalProcessing("Patient reporting severe Migraine and elevated stress levels.");
        }, 4500);
    }, [isListening, setTimeoutTracked]);

    const handleFinalProcessing = useCallback((text: string) => {
        setIsListening(false);
        setTranscript(''); // Clear visual transcript

        // Mock NLP Extraction logic
        if (text.toLowerCase().includes('migraine')) {
            onCommand(text, { type: 'condition', value: 'Migraine', zone: 'head' });
            setFeedback("Detected: Migraine (Neuro)");
        }
        if (text.toLowerCase().includes('stress')) {
            onCommand(text, { type: 'condition', value: 'Anxiety', zone: 'neuro' }); // Map stress to Anxiety/Neuro
            setFeedback("Detected: Stress/Anxiety");
        }

        // Clear feedback after a delay
        clearFeedbackAfterDelay();
    }, [onCommand, clearFeedbackAfterDelay]);

    return (
        <div className="relative z-50">
            {/* Feedback Toast */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-16 right-0 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl flex items-center gap-3"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <div>
                            <span className="font-bold text-cyan-400">Hylono Voice:</span> {feedback}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mic Trigger */}
            <button
                onClick={toggleListening}
                className={`relative group flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all transform hover:scale-105 ${isListening ? 'bg-rose-500 scale-110 shadow-rose-500/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    }`}
            >
                {isListening ? (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full border border-white/50"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        <MicOff className="w-5 h-5 text-white relative z-10" />
                    </>
                ) : (
                    <Mic className="w-5 h-5 text-white" />
                )}

                {/* Visualizer when listening */}
                {isListening && (
                    <div className="absolute -left-32 bottom-2 w-28 h-8 flex items-end justify-end gap-0.5 opacity-80 pointer-events-none">
                        {[1, 2, 3, 4, 5].map(i => (
                            <motion.div
                                key={i}
                                className="w-1 bg-rose-400 rounded-full"
                                animate={{ height: [4, 16, 8, 24, 4] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                )}
            </button>

            {/* Transcript Overlay */}
            <AnimatePresence>
                {isListening && transcript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-16 right-0 min-w-[200px] mb-12 mr-2"
                    >
                        <div className="bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-sm text-sm font-medium text-slate-700">
                            "{transcript}"
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

