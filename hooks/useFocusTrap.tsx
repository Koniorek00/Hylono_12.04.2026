import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { createFocusTrap, FocusTrap as FocusTrapInstance, Options } from 'focus-trap';

interface UseFocusTrapOptions {
    /** Whether the focus trap is active */
    active?: boolean;
    /** Element to focus when trap activates */
    initialFocus?: string | HTMLElement | false;
    /** Element to return focus to when trap deactivates */
    fallbackFocus?: string | HTMLElement;
    /** Callback when trap activates */
    onActivate?: () => void;
    /** Callback when trap deactivates */
    onDeactivate?: () => void;
    /** Whether to allow clicking outside to deactivate */
    clickOutsideDeactivates?: boolean;
    /** Whether to allow Escape key to deactivate */
    escapeDeactivates?: boolean;
    /** Whether to prevent scrolling on outside elements */
    preventScroll?: boolean;
}

/**
 * Custom hook for managing focus traps in modals, menus, and overlays.
 * Implements proper keyboard navigation and focus management for accessibility.
 * 
 * @example
 * ```tsx
 * const Modal = ({ isOpen, onClose }) => {
 *   const trapRef = useFocusTrap({ active: isOpen, onDeactivate: onClose });
 *   
 *   return isOpen ? (
 *     <div ref={trapRef} role="dialog" aria-modal="true">
 *       <button>First focusable</button>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   ) : null;
 * };
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
    options: UseFocusTrapOptions = {}
) {
    const {
        active = true,
        initialFocus,
        fallbackFocus,
        onActivate,
        onDeactivate,
        clickOutsideDeactivates = false,
        escapeDeactivates = true,
        preventScroll = true,
    } = options;

    const containerRef = useRef<T>(null);
    const trapRef = useRef<FocusTrapInstance | null>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Store the element that was focused before the trap activated
    const storePreviousFocus = useCallback(() => {
        previousActiveElement.current = document.activeElement as HTMLElement;
    }, []);

    // Restore focus to the previously focused element
    const restoreFocus = useCallback(() => {
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
            previousActiveElement.current.focus();
        }
    }, []);

    // Create and manage the focus trap
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !active) {
            // If trap exists and we're deactivating, deactivate it
            if (trapRef.current) {
                trapRef.current.deactivate();
                trapRef.current = null;
                restoreFocus();
            }
            return;
        }

        // Store the currently focused element before activating trap
        storePreviousFocus();

        // Create focus trap options
        const trapOptions: Options = {
            document: container.ownerDocument,
            fallbackFocus: fallbackFocus || container,
            escapeDeactivates,
            clickOutsideDeactivates,
            preventScroll,
            onActivate: () => {
                onActivate?.();
            },
            onDeactivate: () => {
                onDeactivate?.();
                restoreFocus();
            },
        };

        // Set initial focus if specified
        if (initialFocus !== undefined && initialFocus !== false) {
            trapOptions.initialFocus = initialFocus;
        }

        // Create and activate the trap
        trapRef.current = createFocusTrap(container, trapOptions);
        trapRef.current.activate();

        // Cleanup function
        return () => {
            if (trapRef.current) {
                trapRef.current.deactivate();
                trapRef.current = null;
            }
        };
    }, [
        active,
        initialFocus,
        fallbackFocus,
        clickOutsideDeactivates,
        escapeDeactivates,
        preventScroll,
        onActivate,
        onDeactivate,
        storePreviousFocus,
        restoreFocus,
    ]);

    return containerRef;
}

/**
 * Focus trap component wrapper for easier JSX usage
 */
export interface FocusTrapProps {
    children: ReactNode;
    active?: boolean;
    initialFocus?: string | HTMLElement | false;
    onActivate?: () => void;
    onDeactivate?: () => void;
    clickOutsideDeactivates?: boolean;
    escapeDeactivates?: boolean;
    className?: string;
    role?: string;
    ariaModal?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
    children,
    active = true,
    initialFocus,
    onActivate,
    onDeactivate,
    clickOutsideDeactivates = false,
    escapeDeactivates = true,
    className,
    role,
    ariaModal,
    ariaLabel,
    ariaLabelledBy,
}) => {
    const trapRef = useFocusTrap<HTMLDivElement>({
        active,
        initialFocus,
        onActivate,
        onDeactivate,
        clickOutsideDeactivates,
        escapeDeactivates,
    });

    return (
        <div
            ref={trapRef}
            className={className}
            role={role}
            aria-modal={ariaModal}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
        >
            {children}
        </div>
    );
};

export default useFocusTrap;
