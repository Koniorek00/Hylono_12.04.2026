/**
 * Input Validation Utilities
 * Provides server-side validation for form inputs
 */

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex (international format)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// XSS prevention - detect potential script injection
const XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:/gi,
    /vbscript:/gi,
];

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
    /('|"|;|--|\/\*|\*\/|xp_|sp_)/gi,
    /(union|select|insert|delete|update|drop|create|alter|exec)\s/gi,
];

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedValue?: string;
}

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export const sanitizeString = (input: string): string => {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
        return { isValid: false, errors };
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.length === 0) {
        errors.push('Email is required');
    } else if (trimmedEmail.length > 254) {
        errors.push('Email must be less than 254 characters');
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.push('Please enter a valid email address');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: trimmedEmail
    };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!phone) {
        return { isValid: true, errors, sanitizedValue: '' }; // Phone is optional
    }
    
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!PHONE_REGEX.test(cleanedPhone)) {
        errors.push('Please enter a valid phone number');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: cleanedPhone
    };
};

/**
 * Validate name field
 */
export const validateName = (name: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!name || typeof name !== 'string') {
        errors.push('Name is required');
        return { isValid: false, errors };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
        errors.push('Name is required');
    } else if (trimmedName.length < 2) {
        errors.push('Name must be at least 2 characters');
    } else if (trimmedName.length > 100) {
        errors.push('Name must be less than 100 characters');
    } else if (/[0-9<>]/.test(trimmedName)) {
        errors.push('Name cannot contain numbers or special characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: sanitizeString(trimmedName)
    };
};

/**
 * Validate message/text field
 */
export const validateMessage = (message: string, maxLength: number = 5000): ValidationResult => {
    const errors: string[] = [];
    
    if (!message || typeof message !== 'string') {
        errors.push('Message is required');
        return { isValid: false, errors };
    }
    
    const trimmedMessage = message.trim();
    
    if (trimmedMessage.length === 0) {
        errors.push('Message is required');
    } else if (trimmedMessage.length > maxLength) {
        errors.push(`Message must be less than ${maxLength} characters`);
    }
    
    // Check for XSS patterns
    for (const pattern of XSS_PATTERNS) {
        if (pattern.test(trimmedMessage)) {
            errors.push('Message contains invalid content');
            break;
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: sanitizeString(trimmedMessage)
    };
};

/**
 * Validate subject field
 */
export const validateSubject = (subject: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!subject || typeof subject !== 'string') {
        errors.push('Subject is required');
        return { isValid: false, errors };
    }
    
    const trimmedSubject = subject.trim();
    
    if (trimmedSubject.length === 0) {
        errors.push('Subject is required');
    } else if (trimmedSubject.length < 3) {
        errors.push('Subject must be at least 3 characters');
    } else if (trimmedSubject.length > 200) {
        errors.push('Subject must be less than 200 characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: sanitizeString(trimmedSubject)
    };
};

/**
 * Validate serial number (for device registration)
 */
export const validateSerialNumber = (serial: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!serial) {
        return { isValid: true, errors, sanitizedValue: '' }; // Optional field
    }
    
    const trimmedSerial = serial.trim().toUpperCase();
    
    // Hylono serial format: HYL-XXXX-XXXX-XXXX
    const serialPattern = /^HYL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    
    if (!serialPattern.test(trimmedSerial)) {
        errors.push('Invalid serial number format. Expected: HYL-XXXX-XXXX-XXXX');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: trimmedSerial
    };
};

/**
 * Validate clinic name
 */
export const validateClinicName = (name: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!name) {
        return { isValid: true, errors, sanitizedValue: '' }; // Optional field
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length > 200) {
        errors.push('Clinic name must be less than 200 characters');
    }
    
    // Check for XSS patterns
    for (const pattern of XSS_PATTERNS) {
        if (pattern.test(trimmedName)) {
            errors.push('Clinic name contains invalid content');
            break;
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: sanitizeString(trimmedName)
    };
};

/**
 * Validate patient count
 */
export const validatePatientCount = (count: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!count) {
        return { isValid: true, errors, sanitizedValue: '' }; // Optional field
    }
    
    const num = parseInt(count, 10);
    
    if (isNaN(num) || num < 0 || num > 1000000) {
        errors.push('Please enter a valid patient count (0-1,000,000)');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: num.toString()
    };
};

/**
 * Validate contact form data
 */
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    serialNumber?: string;
    clinicName?: string;
    patientCount?: string;
    interest?: string;
}

export interface ContactFormValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: ContactFormData;
}

export const validateContactForm = (data: ContactFormData): ContactFormValidationResult => {
    const errors: Record<string, string[]> = {};
    const sanitizedData: ContactFormData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };
    
    // Validate required fields
    const nameResult = validateName(data.name);
    if (!nameResult.isValid) errors.name = nameResult.errors;
    sanitizedData.name = nameResult.sanitizedValue || '';
    
    const emailResult = validateEmail(data.email);
    if (!emailResult.isValid) errors.email = emailResult.errors;
    sanitizedData.email = emailResult.sanitizedValue || '';
    
    const subjectResult = validateSubject(data.subject);
    if (!subjectResult.isValid) errors.subject = subjectResult.errors;
    sanitizedData.subject = subjectResult.sanitizedValue || '';
    
    const messageResult = validateMessage(data.message);
    if (!messageResult.isValid) errors.message = messageResult.errors;
    sanitizedData.message = messageResult.sanitizedValue || '';
    
    // Validate optional fields
    if (data.phone) {
        const phoneResult = validatePhone(data.phone);
        if (!phoneResult.isValid) errors.phone = phoneResult.errors;
        sanitizedData.phone = phoneResult.sanitizedValue;
    }
    
    if (data.serialNumber) {
        const serialResult = validateSerialNumber(data.serialNumber);
        if (!serialResult.isValid) errors.serialNumber = serialResult.errors;
        sanitizedData.serialNumber = serialResult.sanitizedValue;
    }
    
    if (data.clinicName) {
        const clinicResult = validateClinicName(data.clinicName);
        if (!clinicResult.isValid) errors.clinicName = clinicResult.errors;
        sanitizedData.clinicName = clinicResult.sanitizedValue;
    }
    
    if (data.patientCount) {
        const countResult = validatePatientCount(data.patientCount);
        if (!countResult.isValid) errors.patientCount = countResult.errors;
        sanitizedData.patientCount = countResult.sanitizedValue;
    }
    
    if (data.interest) {
        sanitizedData.interest = sanitizeString(data.interest);
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData
    };
};

/**
 * Rate limiting helper
 */
export const checkRateLimit = (
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 60000
): { allowed: boolean; remainingAttempts: number; resetTime: number } => {
    const storageKey = `hylono_rate_limit_${identifier}`;
    const now = Date.now();
    
    let attempts: number[] = [];
    const stored = sessionStorage.getItem(storageKey);
    
    if (stored) {
        try {
            attempts = JSON.parse(stored);
        } catch {
            attempts = [];
        }
    }
    
    // Filter out expired attempts
    attempts = attempts.filter(time => now - time < windowMs);
    
    if (attempts.length >= maxAttempts) {
        const oldestAttempt = Math.min(...attempts);
        const resetTime = oldestAttempt + windowMs;
        return {
            allowed: false,
            remainingAttempts: 0,
            resetTime
        };
    }
    
    // Record this attempt
    attempts.push(now);
    sessionStorage.setItem(storageKey, JSON.stringify(attempts));
    
    return {
        allowed: true,
        remainingAttempts: maxAttempts - attempts.length,
        resetTime: now + windowMs
    };
};
