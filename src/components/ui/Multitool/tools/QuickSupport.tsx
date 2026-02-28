"use client";

/**
 * QuickSupport — Quick access to help and support
 * 
 * Features:
 * - Help center link
 * - Contact support action
 * - Demo booking trigger
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle, MessageCircle, Calendar, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { QuickSupportProps } from '../types';

interface SupportAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export const QuickSupport: React.FC<QuickSupportProps> = ({ 
  className = '',
  onSupport,
}) => {
  const router = useRouter();
  const reduced = useReducedMotion();

  const handleHelpCenter = () => {
    // Navigate to help center
    router.push('/help');
    window.scrollTo(0, 0);
  };

  const handleContact = () => {
    // Navigate to contact page
    router.push('/contact');
    window.scrollTo(0, 0);
  };

  const handleBookDemo = () => {
    // Trigger demo modal or navigation
    if (onSupport) {
      onSupport();
    } else {
      router.push('/demo');
      window.scrollTo(0, 0);
    }
  };

  const handleCall = () => {
    // Open phone dialer (would use actual phone number)
    window.location.assign('tel:+491234567890');
  };

  const actions: SupportAction[] = [
    {
      id: 'help',
      label: 'Help Center',
      description: 'FAQs & guides',
      icon: <HelpCircle size={16} />,
      action: handleHelpCenter,
    },
    {
      id: 'contact',
      label: 'Contact Us',
      description: 'Send a message',
      icon: <MessageCircle size={16} />,
      action: handleContact,
    },
    {
      id: 'demo',
      label: 'Book Demo',
      description: 'Schedule a call',
      icon: <Calendar size={16} />,
      action: handleBookDemo,
    },
  ];

  return (
    <div className={`${className}`} role="group" aria-label="Quick support">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
        <HelpCircle size={14} className="text-slate-400" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Quick Support
        </span>
      </div>

      {/* Actions */}
      <div className="py-2 px-2 space-y-1">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={action.action}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className={`
              w-full min-h-[44px] rounded-lg px-3
              flex items-center gap-3
              text-sm transition-all duration-200
              bg-slate-50 text-slate-600
              hover:bg-slate-100 hover:text-slate-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
            `}
          >
            <span className="text-cyan-500" aria-hidden="true">
              {action.icon}
            </span>
            <div className="flex-1 text-left">
              <div className="font-medium">{action.label}</div>
              <div className="text-[10px] text-slate-400">{action.description}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Emergency contact */}
      <div className="px-3 py-2 border-t border-slate-100 mt-2">
        <p className="text-[10px] text-slate-400 text-center">
          Need immediate help?{' '}
          <button
            onClick={handleCall}
            className="text-cyan-500 hover:text-cyan-600 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
          >
            Call us
          </button>
        </p>
      </div>
    </div>
  );
};

export default QuickSupport;