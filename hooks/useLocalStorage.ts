import { useState, useEffect, useCallback } from 'react';

/**
 * Data classification levels for storage decisions
 */
export type DataClassification = 'public' | 'internal' | 'sensitive' | 'restricted';

/**
 * Storage options for local storage items
 */
interface StorageOptions<T> {
    /** Default value if key doesn't exist */
    defaultValue: T;
    /** Data classification level for security decisions */
    classification?: DataClassification;
    /** Whether to encrypt the data (for sensitive/restricted data) */
    encrypt?: boolean;
    /** Time-to-live in milliseconds (optional) */
    ttl?: number;
    /** Whether to sync across tabs */
    syncAcrossTabs?: boolean;
}

/**
 * Return type for useLocalStorage hook
 */
interface UseLocalStorageReturn<T> {
    /** Current stored value */
    value: T;
    /** Set new value in storage */
    setValue: (value: T | ((prev: T) => T)) => void;
    /** Remove value from storage */
    removeValue: () => void;
    /** Check if value exists in storage */
    exists: boolean;
    /** Clear all storage (use with caution) */
    clearAll: () => void;
}

/**
 * Simple encryption/decryption for sensitive data
 * Note: For production, use a proper encryption library like crypto-js
 */
const encryptValue = (value: string): string => {
    // Simple base64 encoding for demo purposes
    // In production, use proper encryption with a secure key
    try {
        return btoa(encodeURIComponent(value));
    } catch {
        return value;
    }
};

const decryptValue = (value: string): string => {
    try {
        return decodeURIComponent(atob(value));
    } catch {
        return value;
    }
};

/**
 * Check if a stored item has expired based on TTL
 */
const isExpired = (timestamp: number, ttl: number): boolean => {
    return Date.now() - timestamp > ttl;
};

/**
 * Custom hook for managing localStorage with encryption, TTL, and type safety.
 * 
 * Data Classification Guidelines:
 * - public: Non-sensitive preferences (theme, language)
 * - internal: User preferences, non-PII settings
 * - sensitive: User data that should be encrypted (email, name)
 * - restricted: Should NOT be stored in localStorage (tokens, passwords)
 * 
 * @example
 * ```tsx
 * // Store theme preference (public, no encryption needed)
 * const [theme, setTheme] = useLocalStorage({
 *   key: 'theme',
 *   defaultValue: 'light',
 *   classification: 'public'
 * });
 * 
 * // Store user preferences (internal)
 * const [preferences, setPreferences] = useLocalStorage({
 *   key: 'user-preferences',
 *   defaultValue: { notifications: true },
 *   classification: 'internal'
 * });
 * 
 * // Store sensitive data with encryption
 * const [userEmail, setUserEmail] = useLocalStorage({
 *   key: 'user-email',
 *   defaultValue: '',
 *   classification: 'sensitive',
 *   encrypt: true
 * });
 * ```
 */
export function useLocalStorage<T>(
    key: string,
    options: StorageOptions<T>
): UseLocalStorageReturn<T> {
    const {
        defaultValue,
        classification = 'public',
        encrypt = false,
        ttl,
        syncAcrossTabs = false,
    } = options;

    // Warn if trying to store restricted data
    useEffect(() => {
        if (classification === 'restricted') {
            console.warn(
                `[useLocalStorage] Warning: Key "${key}" is classified as 'restricted'. ` +
                'Restricted data should NOT be stored in localStorage. ' +
                'Consider using HTTP-only cookies or server-side sessions instead.'
            );
        }
    }, [key, classification]);

    // Get initial value from localStorage
    const getStoredValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            
            if (item === null) {
                return defaultValue;
            }

            // Decrypt if needed
            const storedValue = encrypt ? decryptValue(item) : item;
            const parsed = JSON.parse(storedValue);

            // Check TTL expiration
            if (ttl && parsed._timestamp && isExpired(parsed._timestamp, ttl)) {
                window.localStorage.removeItem(key);
                return defaultValue;
            }

            // Return value (strip metadata if present)
            return parsed._value !== undefined ? parsed._value : parsed;
        } catch (error) {
            console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
            return defaultValue;
        }
    }, [key, defaultValue, encrypt, ttl]);

    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    // Set value in localStorage
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                
                // Prepare data with metadata
                const dataToStore = ttl
                    ? { _value: valueToStore, _timestamp: Date.now() }
                    : valueToStore;

                const serialized = JSON.stringify(dataToStore);
                const finalValue = encrypt ? encryptValue(serialized) : serialized;

                window.localStorage.setItem(key, finalValue);
                setStoredValue(valueToStore);

                // Dispatch storage event for cross-tab sync
                if (syncAcrossTabs) {
                    window.dispatchEvent(
                        new StorageEvent('storage', {
                            key,
                            newValue: finalValue,
                        })
                    );
                }
            } catch (error) {
                console.error(`[useLocalStorage] Error setting key "${key}":`, error);
            }
        },
        [key, storedValue, encrypt, ttl, syncAcrossTabs]
    );

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(defaultValue);
        } catch (error) {
            console.error(`[useLocalStorage] Error removing key "${key}":`, error);
        }
    }, [key, defaultValue]);

    // Check if value exists
    const exists = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;
        try {
            return window.localStorage.getItem(key) !== null;
        } catch {
            return false;
        }
    }, [key]);

    // Clear all localStorage
    const clearAll = useCallback(() => {
        try {
            window.localStorage.clear();
            setStoredValue(defaultValue);
        } catch (error) {
            console.error('[useLocalStorage] Error clearing storage:', error);
        }
    }, [defaultValue]);

    // Sync across tabs
    useEffect(() => {
        if (!syncAcrossTabs) return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    const storedValue = encrypt ? decryptValue(e.newValue) : e.newValue;
                    const parsed = JSON.parse(storedValue);
                    setStoredValue(parsed._value !== undefined ? parsed._value : parsed);
                } catch {
                    // Ignore parse errors
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, encrypt, syncAcrossTabs]);

    return {
        value: storedValue,
        setValue,
        removeValue,
        exists: exists(),
        clearAll,
    };
}

/**
 * Hook for managing session storage (cleared on tab close)
 */
export function useSessionStorage<T>(
    key: string,
    options: Omit<StorageOptions<T>, 'ttl' | 'syncAcrossTabs'>
): Omit<UseLocalStorageReturn<T>, 'clearAll'> {
    const { defaultValue, classification = 'public', encrypt = false } = options;

    const getStoredValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }

        try {
            const item = window.sessionStorage.getItem(key);
            
            if (item === null) {
                return defaultValue;
            }

            const storedValue = encrypt ? decryptValue(item) : item;
            return JSON.parse(storedValue);
        } catch {
            return defaultValue;
        }
    }, [key, defaultValue, encrypt]);

    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                const serialized = JSON.stringify(valueToStore);
                const finalValue = encrypt ? encryptValue(serialized) : serialized;

                window.sessionStorage.setItem(key, finalValue);
                setStoredValue(valueToStore);
            } catch (error) {
                console.error(`[useSessionStorage] Error setting key "${key}":`, error);
            }
        },
        [key, storedValue, encrypt]
    );

    const removeValue = useCallback(() => {
        try {
            window.sessionStorage.removeItem(key);
            setStoredValue(defaultValue);
        } catch (error) {
            console.error(`[useSessionStorage] Error removing key "${key}":`, error);
        }
    }, [key, defaultValue]);

    const exists = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;
        return window.sessionStorage.getItem(key) !== null;
    }, [key]);

    return {
        value: storedValue,
        setValue,
        removeValue,
        exists: exists(),
    };
}

export default useLocalStorage;
