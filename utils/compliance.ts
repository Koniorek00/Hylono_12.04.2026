/**
 * Medical Compliance Validation System
 * 
 * Validates content against EU Medical Device Regulation (MDR) 2017/745
 * and advertising standards for wellness devices.
 * 
 * @module utils/compliance
 */

export interface ComplianceResult {
    isValid: boolean;
    issues: ComplianceIssue[];
    suggestions: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceIssue {
    term: string;
    context: string;
    suggestion: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'medical_claim' | 'guarantee' | 'unverified' | 'regulatory';
}

interface ForbiddenTerm {
    term: string;
    improvement: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: ComplianceIssue['category'];
    contextPattern?: RegExp;
    allowInContext?: RegExp;
}

const SEVERITY_RANK: Record<ComplianceResult['severity'], number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
};

const maxSeverity = (
    current: ComplianceResult['severity'],
    incoming: ComplianceResult['severity']
): ComplianceResult['severity'] => {
    return SEVERITY_RANK[incoming] > SEVERITY_RANK[current] ? incoming : current;
};

const FORBIDDEN_TERMS: ForbiddenTerm[] = [
    // Critical - Medical claims (MDR Article 7)
    { term: 'cure', improvement: 'support', severity: 'critical', category: 'medical_claim' },
    { term: 'cures', improvement: 'supports', severity: 'critical', category: 'medical_claim' },
    { term: 'healing', improvement: 'recovery support', severity: 'critical', category: 'medical_claim' },
    { term: 'heals', improvement: 'supports recovery', severity: 'critical', category: 'medical_claim' },
    { term: 'treats', improvement: 'addresses', severity: 'critical', category: 'medical_claim' },
    {
        term: 'treatment',
        improvement: 'therapy session',
        severity: 'high',
        category: 'medical_claim',
        allowInContext: /treatment group|cancer treatment|post-treatment|acute and chronic fatigue|standard treatment/i,
    },
    { term: 'therapeutic', improvement: 'wellness', severity: 'medium', category: 'medical_claim' },
    {
        term: 'medicine',
        improvement: 'wellness modality',
        severity: 'high',
        category: 'medical_claim',
        allowInContext: /sports medicine|frontiers in medicine|undersea & hyperbaric medicine/i,
    },
    { term: 'medicinal', improvement: 'wellness', severity: 'high', category: 'medical_claim' },
    {
        term: 'clinical',
        improvement: 'structured',
        severity: 'medium',
        category: 'medical_claim',
        allowInContext:
            /clinical.*(study|research|evidence|trial|workflow|guidance|staff|environments?|experience|significance|clearance|populations?|equipment)|integrative medicine|sports medicine/i,
    },
    { term: 'prescription', improvement: 'protocol', severity: 'high', category: 'medical_claim' },
    { term: 'diagnose', improvement: 'assess', severity: 'critical', category: 'medical_claim' },
    { term: 'diagnosis', improvement: 'assessment', severity: 'critical', category: 'medical_claim' },
    {
        term: 'prevent',
        improvement: 'support against',
        severity: 'high',
        category: 'medical_claim',
        allowInContext:
            /fraud prevention|timing attacks|xss attacks|overselling|recreation|scrolling|accessing content|safe participation|parent clicks/i,
    },
    {
        term: 'prevents',
        improvement: 'may help reduce risk of',
        severity: 'high',
        category: 'medical_claim',
        allowInContext: /timing attacks|xss attacks/i,
    },
    { term: 'disease', improvement: 'condition', severity: 'medium', category: 'medical_claim', allowInContext: /heart disease|alzheimer's disease|parkinson's disease/i },
    
    // High - Guarantees and absolutes
    { term: 'guarantee', improvement: 'commitment', severity: 'high', category: 'guarantee' },
    { term: 'guaranteed', improvement: 'expected', severity: 'high', category: 'guarantee' },
    { term: 'guarantees', improvement: 'commits to', severity: 'high', category: 'guarantee' },
    { term: '100%', improvement: 'significantly', severity: 'high', category: 'guarantee', allowInContext: /100%.*pure|100%.*natural|100%.*hydrogen/i },
    {
        term: 'always',
        improvement: 'typically',
        severity: 'medium',
        category: 'guarantee',
        allowInContext:
            /not always|always be available|always protected|always apply|always consult|always seek|always have a legal basis|always enabled/i,
    },
    { term: 'never', improvement: 'rarely', severity: 'medium', category: 'guarantee' },
    { term: 'everyone', improvement: 'many people', severity: 'medium', category: 'guarantee' },
    { term: 'all users', improvement: 'most users', severity: 'medium', category: 'guarantee' },
    
    // High - Unverified claims
    { term: 'proven', improvement: 'verified', severity: 'high', category: 'unverified' },
    { term: 'proves', improvement: 'demonstrates', severity: 'high', category: 'unverified' },
    { term: 'proven to', improvement: 'research suggests it may', severity: 'high', category: 'unverified' },
    { term: 'science shows', improvement: 'research indicates', severity: 'medium', category: 'unverified' },
    { term: 'studies show', improvement: 'some studies suggest', severity: 'medium', category: 'unverified' },
    { term: 'research proves', improvement: 'research supports', severity: 'high', category: 'unverified' },
    { term: 'breakthrough', improvement: 'advancement', severity: 'medium', category: 'unverified' },
    { term: 'miracle', improvement: 'exceptional', severity: 'high', category: 'unverified' },
    
    // Medium - Regulatory terms
    { term: 'fda approved', improvement: 'compliant with EU regulations', severity: 'high', category: 'regulatory' },
    { term: 'fda cleared', improvement: 'CE marked', severity: 'high', category: 'regulatory' },
    { term: 'doctor recommended', improvement: 'used by wellness professionals', severity: 'medium', category: 'medical_claim' },
    { term: 'doctor endorsed', improvement: 'endorsed by wellness professionals', severity: 'medium', category: 'medical_claim' },
    { term: 'medical device', improvement: 'wellness device', severity: 'high', category: 'regulatory' },
    { term: 'medical grade', improvement: 'professional grade', severity: 'medium', category: 'regulatory' },
    
    // Low - Professional terminology
    { term: 'doctor', improvement: 'specialist', severity: 'low', category: 'medical_claim', allowInContext: /consult.*doctor|your doctor|healthcare provider/i },
    { term: 'physician', improvement: 'healthcare provider', severity: 'low', category: 'medical_claim' },
    { term: 'patient', improvement: 'user', severity: 'low', category: 'medical_claim' },
];

// Required disclaimer phrases for different content types
export const REQUIRED_DISCLAIMER_PATTERNS = {
    product: /not intended to diagnose.*treat.*cure.*prevent/i,
    research: /for educational purposes|not a substitute for medical advice/i,
    protocol: /wellness.*schedule|consult your healthcare provider/i,
    testimonial: /individual results may vary/i,
} as const;

// Context patterns where compliance checking should be more lenient
const QUOTE_CONTEXT = /["«»''].+["«»'']/s;
const DISCLAIMER_CONTEXT = /disclaimer|important notice|medical disclaimer/i;
const CITATION_CONTEXT = /doi:|pubmed|study|research|clinical trial/i;

/**
 * Validates text content for medical compliance
 * 
 * @param text - The text to validate
 * @param options - Validation options
 * @returns Compliance result with issues and suggestions
 */
export const validateCompliance = (
    text: string,
    options: {
        strict?: boolean;
        contentType?: 'product' | 'research' | 'protocol' | 'testimonial' | 'general';
        skipDisclaimerCheck?: boolean;
    } = {}
): ComplianceResult => {
    const { strict = false, contentType = 'general', skipDisclaimerCheck = false } = options;
    const issues: ComplianceIssue[] = [];
    const suggestions: string[] = [];
    let highestSeverity: ComplianceResult['severity'] = 'low';

    const lowerText = text.toLowerCase();

    // Check for forbidden terms
    FORBIDDEN_TERMS.forEach((rule) => {
        const regex = new RegExp(`\\b${rule.term}\\b`, 'gi');
        const matches = text.match(regex);

        if (!matches) return;

        // Check if term is in an allowed context
        if (rule.allowInContext) {
            const allowedMatches = text.match(rule.allowInContext);
            if (allowedMatches && allowedMatches.length >= matches.length) {
                return; // All instances are in allowed context
            }
        }

        // Check if term is within a quote or disclaimer
        const contextBefore = text.substring(Math.max(0, text.toLowerCase().indexOf(rule.term) - 50), 
                                            text.toLowerCase().indexOf(rule.term) + rule.term.length + 50);
        
        if (QUOTE_CONTEXT.test(contextBefore) || DISCLAIMER_CONTEXT.test(contextBefore)) {
            if (!strict) return; // Skip if in quote/disclaimer and not strict mode
        }

        // Create issue
        const issue: ComplianceIssue = {
            term: rule.term,
            context: contextBefore.trim(),
            suggestion: `Try using "${rule.improvement}" instead of "${rule.term}"`,
            severity: rule.severity,
            category: rule.category,
        };

        issues.push(issue);
        suggestions.push(issue.suggestion);

        // Track highest severity
        highestSeverity = maxSeverity(highestSeverity, rule.severity);
    });

    // Check for required disclaimer
    if (!skipDisclaimerCheck && contentType !== 'general') {
        const requiredPattern = REQUIRED_DISCLAIMER_PATTERNS[contentType];
        if (requiredPattern && !requiredPattern.test(text)) {
            issues.push({
                term: 'missing disclaimer',
                context: contentType,
                suggestion: `Add appropriate ${contentType} disclaimer. Example: "Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider."`,
                severity: 'high',
                category: 'regulatory',
            });
            suggestions.push('Add required medical disclaimer for this content type.');
            highestSeverity = maxSeverity(highestSeverity, 'high');
        }
    }

    // Deduplicate suggestions
    const uniqueSuggestions = [...new Set(suggestions)];

    return {
        isValid: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0,
        issues,
        suggestions: uniqueSuggestions,
        severity: highestSeverity,
    };
};

/**
 * Quick check if text passes compliance (no critical/high issues)
 */
export const isCompliant = (text: string): boolean => {
    return validateCompliance(text).isValid;
};

/**
 * Get suggested replacement for a term
 */
export const getSuggestion = (term: string): string | null => {
    const rule = FORBIDDEN_TERMS.find(r => r.term.toLowerCase() === term.toLowerCase());
    return rule?.improvement ?? null;
};

/**
 * Auto-fix text by replacing forbidden terms
 */
export const autoFixCompliance = (text: string): { fixed: string; changes: string[] } => {
    const changes: string[] = [];
    let fixed = text;

    FORBIDDEN_TERMS.forEach((rule) => {
        const regex = new RegExp(`\\b${rule.term}\\b`, 'gi');
        if (regex.test(fixed)) {
            // Check if in allowed context
            if (rule.allowInContext && rule.allowInContext.test(fixed)) {
                return;
            }
            fixed = fixed.replace(regex, rule.improvement);
            changes.push(`"${rule.term}" → "${rule.improvement}"`);
        }
    });

    return { fixed, changes };
};

// Export types and constants
export type { ComplianceIssue as ComplianceIssueType };
export type { ForbiddenTerm as ForbiddenTermType };
