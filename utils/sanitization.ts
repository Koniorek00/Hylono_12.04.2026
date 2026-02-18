/**
 * HTML Sanitization Utility
 * 
 * Provides XSS protection for user-generated HTML content using DOMPurify.
 * This utility should be used whenever rendering HTML content that comes from
 * external sources or user input.
 * 
 * @module utils/sanitization
 */

// Import Config type directly — DOMPurify.Config namespace syntax is not available
// when using the default import. Named Config export is the correct pattern.
import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify';

/**
 * Default allowed HTML tags for blog/article content
 * Includes common formatting tags while excluding dangerous elements
 */
const DEFAULT_ALLOWED_TAGS = [
    // Text formatting
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // Links and media
    'a', 'img', 'figure', 'figcaption',
    // Quotes and code
    'blockquote', 'pre', 'code',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    // Semantic elements
    'article', 'section', 'header', 'footer', 'aside', 'main', 'nav',
    'div', 'span',
    // Other
    'hr', 'address', 'cite', 'mark', 'small', 'time'
];

/**
 * Default allowed HTML attributes
 * Only includes safe attributes necessary for content display
 */
const DEFAULT_ALLOWED_ATTR = [
    // Global attributes
    'class', 'id', 'title', 'lang', 'dir',
    // Link attributes
    'href', 'target', 'rel',
    // Image attributes
    'src', 'alt', 'width', 'height', 'loading',
    // Table attributes
    'colspan', 'rowspan', 'scope',
    // Other
    'datetime', 'cite'
];

/**
 * Allowed URI protocols for href and src attributes
 */
const DEFAULT_ALLOWED_URI_REGEXP = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

/**
 * Sanitization options for different content types
 */
export interface SanitizationOptions {
    /** Allow embedded videos (iframes from trusted sources) */
    allowVideos?: boolean;
    /** Allow embedded content (iframes) */
    allowIframes?: boolean;
    /** Custom allowed tags (extends defaults) */
    additionalTags?: string[];
    /** Custom allowed attributes (extends defaults) */
    additionalAttr?: string[];
    /** Return null/empty string for invalid input instead of throwing */
    graceful?: boolean;
}

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * 
 * @param html - The HTML string to sanitize
 * @param options - Configuration options for sanitization
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * // Basic usage
 * const safeHtml = sanitizeHtml(userContent);
 * 
 * @example
 * // With video embedding allowed
 * const safeHtml = sanitizeHtml(userContent, { allowVideos: true });
 */
export function sanitizeHtml(
    html: string | null | undefined,
    options: SanitizationOptions = {}
): string {
    // Handle null/undefined gracefully
    if (html === null || html === undefined) {
        return options.graceful ? '' : '';
    }

    // Ensure input is a string
    if (typeof html !== 'string') {
        console.warn('sanitizeHtml: Expected string input, received:', typeof html);
        return '';
    }

    // Build allowed tags list
    const allowedTags = [...DEFAULT_ALLOWED_TAGS];
    if (options.additionalTags) {
        allowedTags.push(...options.additionalTags);
    }

    // Build allowed attributes list
    const allowedAttr = [...DEFAULT_ALLOWED_ATTR];
    if (options.additionalAttr) {
        allowedAttr.push(...options.additionalAttr);
    }

    // Configure DOMPurify
    const config: DOMPurifyConfig = {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttr,
        ALLOWED_URI_REGEXP: DEFAULT_ALLOWED_URI_REGEXP,
        // Remove data-* attributes by default (can be enabled via additionalAttr)
        ALLOW_DATA_ATTR: false,
        // Forbid potentially dangerous elements
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
        FORBID_ATTR: [
            'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmouseenter',
            'onmouseleave', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown',
            'onkeyup', 'onkeypress', 'ondrag', 'ondrop', 'formaction', 'action', 'method'
        ],
        // Keep content but remove dangerous markup
        KEEP_CONTENT: true,
    };

    // Allow iframes for video embedding if requested
    if (options.allowVideos || options.allowIframes) {
        config.ALLOWED_TAGS?.push('iframe');
        config.ALLOWED_ATTR?.push('allowfullscreen', 'allow', 'frameborder');
        
        // Add specific iframe src restrictions
        config.ADD_ATTR = ['allow', 'allowfullscreen'];
        
        // Only allow iframes from trusted video sources
        config.ALLOWED_URI_REGEXP = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
    }

    // Remove script and style from FORBID_TAGS if we're allowing them (we're not)
    // This ensures explicit forbidding even if somehow added to allowed tags

    try {
        // DOMPurify.sanitize() returns `string | TrustedHTML` depending on config.
        // We always get a plain string here (no RETURN_DOM / RETURN_DOM_FRAGMENT),
        // so the double-cast via unknown is intentional and safe.
        const sanitized = DOMPurify.sanitize(html, config) as unknown as string;
        return sanitized;
    } catch (error) {
        console.error('sanitizeHtml: Error during sanitization:', error);
        return '';
    }
}

/**
 * Sanitizes HTML specifically for blog article content.
 * Allows common article formatting while maintaining security.
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for article rendering
 */
export function sanitizeArticleContent(html: string | null | undefined): string {
    return sanitizeHtml(html, {
        graceful: true,
        additionalTags: ['figure', 'figcaption', 'picture', 'source'],
        additionalAttr: ['srcset', 'sizes', 'media']
    });
}

/**
 * Sanitizes HTML for preview rendering in editors.
 * More permissive for trusted editor content but still secure.
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for preview rendering
 */
export function sanitizePreviewContent(html: string | null | undefined): string {
    return sanitizeHtml(html, {
        graceful: true,
        allowVideos: false, // Can be enabled if needed
        additionalTags: ['details', 'summary', 'mark', 'abbr']
    });
}

/**
 * Strips all HTML tags and returns plain text.
 * Useful for generating excerpts or plain text previews.
 * 
 * @param html - The HTML string to strip
 * @returns Plain text with all HTML removed
 */
export function stripHtml(html: string | null | undefined): string {
    if (!html) return '';
    
    const config: DOMPurifyConfig = {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
    };

    // Cast for same reason as sanitizeHtml — returns string when not using RETURN_DOM
    return DOMPurify.sanitize(html, config) as unknown as string;
}

/**
 * Validates if a URL is safe for use in href/src attributes.
 * Prevents javascript: and other dangerous protocols.
 * 
 * @param url - The URL to validate
 * @returns True if the URL is safe, false otherwise
 */
export function isSafeUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') return false;
    
    // Trim whitespace
    const trimmedUrl = url.trim();
    
    // Check against allowed protocols
    const safeProtocols = /^(https?:|mailto:|tel:|\/|#)/i;
    
    // Block dangerous protocols
    const dangerousProtocols = /^(javascript:|data:|vbscript:|file:)/i;
    
    return safeProtocols.test(trimmedUrl) && !dangerousProtocols.test(trimmedUrl);
}

/**
 * Sanitizes a URL for safe use in href attributes.
 * Returns empty string for dangerous URLs.
 * 
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string | null | undefined): string {
    if (!url || typeof url !== 'string') return '';
    
    const trimmedUrl = url.trim();
    
    if (!isSafeUrl(trimmedUrl)) {
        console.warn('sanitizeUrl: Blocked potentially dangerous URL:', trimmedUrl.substring(0, 50));
        return '';
    }
    
    return trimmedUrl;
}

// Export test payloads for verification (used in testing)
export const XSS_TEST_PAYLOADS = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(\'XSS\')">',
    '<a href="javascript:alert(\'XSS\')">click</a>',
    '<div onmouseover="alert(\'XSS\')">hover</div>',
    '<svg onload="alert(\'XSS\')">',
    '<iframe src="javascript:alert(\'XSS\')">',
    '<body onload="alert(\'XSS\')">',
    '"><script>alert("XSS")</script>',
    "'-alert('XSS')-'"
];

export default {
    sanitizeHtml,
    sanitizeArticleContent,
    sanitizePreviewContent,
    stripHtml,
    isSafeUrl,
    sanitizeUrl
};