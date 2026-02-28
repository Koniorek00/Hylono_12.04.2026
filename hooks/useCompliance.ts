/**
 * React hook for content compliance validation
 * 
 * Provides real-time compliance checking for user-generated content,
 * form inputs, and dynamic content rendering.
 * 
 * @module hooks/useCompliance
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  validateCompliance, 
  autoFixCompliance, 
  isCompliant, 
  getSuggestion,
  type ComplianceResult,
  type ComplianceIssue 
} from '../utils/compliance';

interface UseComplianceOptions {
  /** Enable real-time validation as user types */
  realTime?: boolean;
  /** Debounce delay in ms for real-time validation */
  debounceMs?: number;
  /** Content type for disclaimer requirements */
  contentType?: 'product' | 'research' | 'protocol' | 'testimonial' | 'general';
  /** Strict mode - flag issues in quotes and disclaimers */
  strict?: boolean;
}

interface UseComplianceReturn {
  /** Current validation result */
  result: ComplianceResult | null;
  /** Whether content is compliant */
  isValid: boolean;
  /** Issues found in content */
  issues: ComplianceIssue[];
  /** Suggestions for fixing issues */
  suggestions: string[];
  /** Highest severity of issues found */
  severity: ComplianceResult['severity'] | null;
  /** Validate text content */
  validate: (text: string) => ComplianceResult;
  /** Quick compliance check */
  check: (text: string) => boolean;
  /** Auto-fix text by replacing forbidden terms */
  fix: (text: string) => { fixed: string; changes: string[] };
  /** Get suggestion for a specific term */
  getSuggestedTerm: (term: string) => string | null;
  /** Clear current validation state */
  clear: () => void;
}

/**
 * Hook for validating content compliance with medical advertising regulations
 * 
 * @example
 * const { validate, isValid, issues, fix } = useCompliance({ contentType: 'product' });
 * 
 * const result = validate(productDescription);
 * if (!isValid) {
 *   const { fixed, changes } = fix(productDescription);
 *   console.log('Auto-fixed:', changes);
 * }
 */
export const useCompliance = (options: UseComplianceOptions = {}): UseComplianceReturn => {
  const {
    realTime = false,
    contentType = 'general',
    strict = false,
  } = options;

  const [result, setResult] = useState<ComplianceResult | null>(null);

  const validate = useCallback((text: string): ComplianceResult => {
    const validationResult = validateCompliance(text, {
      contentType,
      strict,
    });
    setResult(validationResult);
    return validationResult;
  }, [contentType, strict]);

  const check = useCallback((text: string): boolean => {
    return isCompliant(text);
  }, []);

  const fix = useCallback((text: string): { fixed: string; changes: string[] } => {
    return autoFixCompliance(text);
  }, []);

  const getSuggestedTerm = useCallback((term: string): string | null => {
    return getSuggestion(term);
  }, []);

  const clear = useCallback(() => {
    setResult(null);
  }, []);

  const isValid = useMemo(() => result?.isValid ?? true, [result]);
  const issues = useMemo(() => result?.issues ?? [], [result]);
  const suggestions = useMemo(() => result?.suggestions ?? [], [result]);
  const severity = useMemo(() => result?.severity ?? null, [result]);

  return {
    result,
    isValid,
    issues,
    suggestions,
    severity,
    validate,
    check,
    fix,
    getSuggestedTerm,
    clear,
  };
};

/**
 * Hook for validating form input with compliance
 * 
 * @example
 * const { value, onChange, issues, isValid } = useCompliantInput('');
 * 
 * <textarea
 *   value={value}
 *   onChange={onChange}
 *   className={!isValid ? 'border-red-500' : ''}
 * />
 */
export const useCompliantInput = (
  initialValue: string = '',
  options: UseComplianceOptions = {}
): {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  setValue: (value: string) => void;
  issues: ComplianceIssue[];
  isValid: boolean;
  severity: ComplianceResult['severity'] | null;
  fix: () => void;
} => {
  const [value, setInternalValue] = useState(initialValue);
  const { validate, fix, result, isValid, issues, severity } = useCompliance(options);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      if (options.realTime) {
        validate(newValue);
      }
    },
    [options.realTime, validate]
  );

  const setValue = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);
      if (options.realTime) {
        validate(newValue);
      }
    },
    [options.realTime, validate]
  );

  const applyFix = useCallback(() => {
    const { fixed } = fix(value);
    setInternalValue(fixed);
    validate(fixed);
  }, [value, fix, validate]);

  return {
    value,
    onChange,
    setValue,
    issues,
    isValid,
    severity,
    fix: applyFix,
  };
};

export type { UseComplianceOptions, UseComplianceReturn, ComplianceIssue };