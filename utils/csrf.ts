/**
 * CSRF Protection Utility
 * Provides CSRF token generation and validation for form submissions
 */

// Generate a random CSRF token
export const generateCSRFToken = (): string => {
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        // Fallback for environments without crypto.getRandomValues
        for (let i = 0; i < 32; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSRF token
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
    if (!token || !storedToken) {
        return false;
    }
    // Constant-time comparison to prevent timing attacks
    if (token.length !== storedToken.length) {
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < token.length; i++) {
        result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
    }
    return result === 0;
};

// Get or create CSRF token from session storage
export const getCSRFToken = (): string => {
    if (typeof window === 'undefined') {
        return '';
    }
    const storageKey = 'hylono_csrf_token';
    let token = sessionStorage.getItem(storageKey);

    if (!token) {
        token = generateCSRFToken();
        sessionStorage.setItem(storageKey, token);
    }

    return token;
};

// Clear CSRF token (for logout)
export const clearCSRFToken = (): void => {
    if (typeof window === 'undefined') {
        return;
    }
    sessionStorage.removeItem('hylono_csrf_token');
};
