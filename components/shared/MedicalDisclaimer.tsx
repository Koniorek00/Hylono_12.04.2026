import React from 'react';
import { AlertCircle, Shield, Info, FileCheck } from 'lucide-react';
import { 
  disclaimers, 
  DisclaimerType, 
  MDR_COMPLIANCE_STATEMENT, 
  CITATION_DISCLAIMER,
  DISCLAIMER_CONTEXTS 
} from '../../content/disclaimers';

interface MedicalDisclaimerProps {
  /** Type of disclaimer from content/disclaimers.ts */
  type?: DisclaimerType;
  /** Override text for custom disclaimers */
  customText?: string;
  /** Compact inline version for tight spaces */
  compact?: boolean;
  /** Variant style */
  variant?: 'default' | 'warning' | 'info' | 'compliance';
  /** Show MDR compliance statement */
  showMdrStatement?: boolean;
  /** Show citation disclaimer */
  showCitationDisclaimer?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Centralized medical disclaimer component for consistent compliance across the app.
 * Uses disclaimers from content/disclaimers.ts as the single source of truth.
 * 
 * @example
 * // Default general disclaimer
 * <MedicalDisclaimer />
 * 
 * @example
 * // Product page disclaimer
 * <MedicalDisclaimer type="pdp" />
 * 
 * @example
 * // Compact inline version
 * <MedicalDisclaimer compact />
 * 
 * @example
 * // Compliance variant with MDR statement
 * <MedicalDisclaimer type="ceMark" variant="compliance" showMdrStatement />
 * 
 * @example
 * // Research context with citation disclaimer
 * <MedicalDisclaimer type="research" showCitationDisclaimer />
 */
export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  type = 'general',
  customText,
  compact = false,
  variant = 'default',
  showMdrStatement = false,
  showCitationDisclaimer = false,
  className = '',
}) => {
  const text = customText || disclaimers[type];

  // Style variants
  const variantStyles = {
    default: 'border-amber-200 bg-amber-50',
    warning: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
    compliance: 'border-emerald-200 bg-emerald-50',
  };

  const iconStyles = {
    default: 'text-amber-500',
    warning: 'text-red-500',
    info: 'text-blue-500',
    compliance: 'text-emerald-500',
  };

  const textStyles = {
    default: 'text-amber-800',
    warning: 'text-red-800',
    info: 'text-blue-800',
    compliance: 'text-emerald-800',
  };

  const Icon = variant === 'compliance' ? Shield : variant === 'info' ? Info : AlertCircle;

  if (compact) {
    return (
      <p className={`text-[10px] text-slate-400 italic leading-relaxed ${className}`}>
        {text}
      </p>
    );
  }

  return (
    <div 
      className={`rounded-xl border ${variantStyles[variant]} p-4 ${className}`}
      role="note"
      aria-label="Medical disclaimer"
    >
      <div className="flex items-start gap-3">
        <Icon 
          size={16} 
          className={`${iconStyles[variant]} shrink-0 mt-0.5`} 
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className={`text-xs ${textStyles[variant]} leading-relaxed`}>
            {text}
          </p>
          
          {/* MDR Compliance Statement */}
          {showMdrStatement && (
            <div className="mt-3 pt-3 border-t border-current/10">
              <p className="text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                <FileCheck size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                {MDR_COMPLIANCE_STATEMENT}
              </p>
            </div>
          )}
          
          {/* Citation Disclaimer */}
          {showCitationDisclaimer && (
            <div className="mt-3 pt-3 border-t border-current/10">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {CITATION_DISCLAIMER}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Short inline disclaimer for cards and mobile views
 */
export const ShortDisclaimer: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`text-[9px] text-slate-400 italic ${className}`}>
    {disclaimers.short}
  </span>
);

/**
 * MDR Compliance Badge for product pages
 */
export const MdrComplianceBadge: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full ${className}`}
    role="status"
  >
    <Shield size={12} className="text-emerald-600" />
    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
      EU MDR Compliant
    </span>
  </div>
);

// Export disclaimer types and constants for external use
export type { DisclaimerType };
export { disclaimers, DISCLAIMER_CONTEXTS, MDR_COMPLIANCE_STATEMENT, CITATION_DISCLAIMER };