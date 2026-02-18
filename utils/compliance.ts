export interface ComplianceResult {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
}

const FORBIDDEN_TERMS = [
    { term: 'cure', improvement: 'optimize' },
    { term: 'heal', improvement: 'support recovery' },
    { term: 'treat', improvement: 'enhance' },
    { term: 'medical', improvement: 'wellness' },
    { term: 'doctor', improvement: 'specialist' },
    { term: 'prescription', improvement: 'protocol' },
    { term: 'guarantee', improvement: 'commitment' },
    { term: 'proven', improvement: 'verified' },
];

export const validateCompliance = (text: string): ComplianceResult => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const lowerText = text.toLowerCase();

    FORBIDDEN_TERMS.forEach(({ term, improvement }) => {
        if (lowerText.includes(term)) {
            issues.push(`The term "${term}" is restricted.`);
            suggestions.push(`Try using "${improvement}" instead.`);
        }
    });

    return {
        isValid: issues.length === 0,
        issues,
        suggestions
    };
};
