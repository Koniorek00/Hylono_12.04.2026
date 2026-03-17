'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, X } from 'lucide-react';

interface HomeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookDemo: () => void;
}

export const HomeDemoModal: React.FC<HomeDemoModalProps> = ({
  isOpen,
  onClose,
  onBookDemo,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        className="relative w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-10 text-center"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Close demo modal"
        >
          <X size={20} />
        </button>
        <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play className="text-cyan-400" size={28} />
        </div>
        <h3 id="demo-modal-title" className="text-xl font-bold text-white mb-3 futuristic-font">Product Demo</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Our full product video is coming soon. In the meantime, book a free live consultation
          and we&apos;ll walk you through the complete Hylono ecosystem personally.
        </p>
        <button
          onClick={onBookDemo}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
        >
          Book a Free Live Demo
        </button>
        <button
          onClick={onClose}
          className="mt-3 w-full py-3 text-slate-500 text-xs hover:text-slate-300 transition-colors"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  );
};
