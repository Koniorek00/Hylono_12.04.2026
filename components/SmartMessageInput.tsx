/**
 * SmartMessageInput
 * Enhanced message input with step-based flow:
 * Step 1: Add Product(s)
 * Step 2: Choose Inquiry Type
 * 
 * Features smooth animations and undo capability
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  MessageSquare, Package, BookOpen, Target, X, Plus,
  ChevronLeft, Send, Check, ArrowLeft
} from 'lucide-react';
import { ProductProtocolBrowser, SelectedItem } from './ProductProtocolBrowser';
import { QUICK_TAGS, TAG_COLOR_CLASSES, MESSAGE_TEMPLATES } from '../utils/messageSuggestions';

interface SmartMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSend?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

// Smooth spring animation variants
const slideVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    scale: 0.95,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }
  }
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};

type Step = 'products' | 'inquiry';

export const SmartMessageInput: React.FC<SmartMessageInputProps> = ({
  value,
  onChange,
  placeholder = "Type your message...",
  onSend,
  isSubmitting = false,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('products');
  const [showBrowser, setShowBrowser] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [messageHistory, setMessageHistory] = useState<string[]>([]); // For undo
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Save current message to history before changing
  const saveToHistory = () => {
    setMessageHistory(prev => [...prev, value]);
  };

  // Undo last message change
  const handleUndo = () => {
    if (messageHistory.length > 0) {
      const previousMessage = messageHistory[messageHistory.length - 1];
      setMessageHistory(prev => prev.slice(0, -1));
      onChange(previousMessage);
    }
  };

  // Handle product/protocol selection
  const handleItemSelect = (item: SelectedItem) => {
    setSelectedItems(prev => {
      const exists = prev.some(i => i.id === item.id && i.type === item.type);
      if (exists) {
        return prev.filter(i => !(i.id === item.id && i.type === item.type));
      }
      return [...prev, item];
    });
  };

  // Remove selected item
  const handleRemoveItem = (item: SelectedItem) => {
    setSelectedItems(prev => prev.filter(i => !(i.id === item.id && i.type === item.type)));
  };

  // Go to inquiry step
  const goToInquiry = () => {
    setCurrentStep('inquiry');
    setShowBrowser(false);
  };

  // Go back to products step
  const goToProducts = () => {
    setCurrentStep('products');
  };

  // Handle inquiry type selection
  const handleInquirySelect = (templateId: string) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    saveToHistory(); // Save for undo

    const productNames = selectedItems
      .filter(item => item.type === 'products')
      .map(item => item.title)
      .join(' and ');
    
    let message = template.template;
    if (productNames) {
      message = message.replace(/\[PRODUCT[ A-Z]*\]/gi, productNames);
    }
    
    const newMessage = value.trim() 
      ? `${value}\n\n${message}` 
      : message;
    
    onChange(newMessage);
    textareaRef.current?.focus();
  };

  // Handle quick tag selection
  const handleTagClick = (tagId: string) => {
    const tag = QUICK_TAGS.find(t => t.id === tagId);
    if (!tag) return;

    saveToHistory(); // Save for undo

    const productNames = selectedItems
      .filter(item => item.type === 'products')
      .map(item => item.title)
      .join(', ');
    
    let message = tag.defaultMessage;
    if (productNames) {
      message += productNames;
    }
    
    const newMessage = value.trim() 
      ? `${value}\n\n${message}` 
      : message;
    
    onChange(newMessage);
    textareaRef.current?.focus();
  };

  // Insert product reference at cursor
  const insertProductAtCursor = (item: SelectedItem) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    saveToHistory();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBefore = value.substring(0, start);
    const textAfter = value.substring(end);
    
    const insertion = `[${item.title}] `;
    const newValue = textBefore + insertion + textAfter;
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
      textarea.focus();
    }, 0);
  };

  // Get icon for item type
  const getItemIcon = (type: SelectedItem['type']) => {
    switch (type) {
      case 'products': return Package;
      case 'protocols': return BookOpen;
      case 'goals': return Target;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            currentStep === 'products' 
              ? 'bg-cyan-500 text-white' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            {currentStep === 'inquiry' ? <Check size={14} /> : '1'}
          </div>
          <span className={`text-xs font-semibold transition-colors ${
            currentStep === 'products' ? 'text-cyan-700' : 'text-slate-400'
          }`}>
            Add Product
          </span>
        </div>
        
        <div className="flex-1 h-px bg-slate-200" />
        
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            currentStep === 'inquiry' 
              ? 'bg-cyan-500 text-white' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            2
          </div>
          <span className={`text-xs font-semibold transition-colors ${
            currentStep === 'inquiry' ? 'text-cyan-700' : 'text-slate-400'
          }`}>
            Inquiry
          </span>
        </div>
      </div>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <motion.div 
          layout
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 w-full mb-1">
            Selected items (click to insert into message):
          </span>
          {selectedItems.map((item) => {
            const Icon = getItemIcon(item.type);
            const colorClasses = {
              products: 'bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200',
              protocols: 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200',
              goals: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
            };
            
            return (
              <motion.button
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={() => insertProductAtCursor(item)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${colorClasses[item.type]}`}
                title="Click to insert into message"
              >
                <Icon size={12} />
                {item.title}
                <span 
                  className="ml-1 p-0.5 rounded hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item);
                  }}
                >
                  <X size={10} />
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'products' && (
          <motion.div
            key="products-step"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Add Product Button */}
            <button
              type="button"
              onClick={() => setShowBrowser(!showBrowser)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 border-dashed transition-all mb-3 ${
                showBrowser || selectedItems.length > 0
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                  : 'bg-slate-50 text-slate-500 border-slate-300 hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50'
              }`}
            >
              <Plus size={18} />
              {selectedItems.length > 0 ? 'Add More Products' : 'Add Product(s)'}
            </button>

            {/* Product Browser */}
            <AnimatePresence>
              {showBrowser && (
                <motion.div
                  key="browser"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mb-3"
                >
                  <ProductProtocolBrowser
                    isOpen={showBrowser}
                    onClose={() => setShowBrowser(false)}
                    onSelect={handleItemSelect}
                    selectedItems={selectedItems}
                    multiSelect={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue to Inquiry Button */}
            {selectedItems.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={goToInquiry}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                Continue to Inquiry
                <Check size={16} />
              </motion.button>
            )}
          </motion.div>
        )}

        {currentStep === 'inquiry' && (
          <motion.div
            key="inquiry-step"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Back Button */}
            <button
              type="button"
              onClick={goToProducts}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-3 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to products
            </button>

            {/* Inquiry Type Selection */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">What would you like to know?</p>
              <div className="grid grid-cols-2 gap-2">
                {MESSAGE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleInquirySelect(template.id)}
                    className="text-left p-3 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all group"
                  >
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-cyan-700">{template.label}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{template.template}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tags */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">Or use a quick tag:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.slice(0, 5).map((tag) => {
                  const colors = TAG_COLOR_CLASSES[tag.color] || TAG_COLOR_CLASSES.slate;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagClick(tag.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${colors.bg} ${colors.text} ${colors.border} ${colors.hover}`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input Area */}
      <div className="relative mt-4">
        <div className="flex items-start gap-2 p-3 bg-white rounded-xl border border-slate-200 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="flex-1 resize-none outline-none text-sm placeholder-slate-400 min-h-[100px]"
            disabled={isSubmitting}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 self-end">
            {/* Undo Button - Only show if there's history */}
            {messageHistory.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                title="Undo last action"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            
            {/* Send Button */}
            {onSend && (
              <button
                type="button"
                onClick={onSend}
                disabled={isSubmitting || !value.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <Send size={16} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
        <MessageSquare size={10} />
        {currentStep === 'products' 
          ? 'Add products first, then choose your inquiry type.'
          : 'Click a template or type your own message. Use ← to undo.'}
      </p>
    </div>
  );
};

export default SmartMessageInput;