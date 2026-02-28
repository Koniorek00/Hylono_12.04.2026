/**
 * Multitool Store — Persistent state for the floating multitool widget
 * 
 * Manages:
 * - Open/minimized state
 * - Active tool selection
 * - Reading preferences (text size, line height, contrast, font)
 * - Position (for draggable feature)
 * - Focus mode state
 */
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type ToolId = 'navigator' | 'reading' | 'support' | 'focus';

export type TextSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

export type LineHeight = 'compact' | 'default' | 'relaxed' | 'loose';

export type ReadingFont = 'default' | 'dyslexic' | 'mono';

export interface MultitoolPosition {
  x: number;
  y: number;
}

export interface DropdownPosition {
  top: number;
  right: number;
}

interface MultitoolState {
  // Core state
  isOpen: boolean;
  activeTool: ToolId | null;
  dropdownPosition: DropdownPosition;
  
  // Reading preferences
  textSize: TextSize;
  lineHeight: LineHeight;
  readingFont: ReadingFont;
  highContrast: boolean;
  
  // Focus mode
  focusMode: boolean;
  focusModeSectionId: string | null;
  
  // Position (for drag functionality)
  position: MultitoolPosition;
  
  // Actions
  toggle: () => void;
  open: () => void;
  openAtPosition: (position: DropdownPosition) => void;
  close: () => void;
  setActiveTool: (tool: ToolId | null) => void;
  setTextSize: (size: TextSize) => void;
  cycleTextSize: () => void;
  setLineHeight: (height: LineHeight) => void;
  cycleLineHeight: () => void;
  setReadingFont: (font: ReadingFont) => void;
  toggleHighContrast: () => void;
  toggleFocusMode: () => void;
  setFocusSection: (sectionId: string | null) => void;
  setPosition: (position: MultitoolPosition) => void;
  reset: () => void;
}

// Text size values (relative to base)
const TEXT_SIZE_VALUES: Record<TextSize, string> = {
  xs: '90%',
  sm: '100%',
  default: '120%',
  lg: '140%',
  xl: '160%',
};

const TEXT_SIZE_ORDER: TextSize[] = ['xs', 'sm', 'default', 'lg', 'xl'];

// Line height values
const LINE_HEIGHT_VALUES: Record<LineHeight, string> = {
  compact: '1.4',
  default: '1.6',
  relaxed: '1.8',
  loose: '2.0',
};

const LINE_HEIGHT_ORDER: LineHeight[] = ['compact', 'default', 'relaxed', 'loose'];

// Font families
const FONT_FAMILIES: Record<ReadingFont, string> = {
  default: "'Outfit', sans-serif",
  dyslexic: "'OpenDyslexic', 'OpenDyslexicAlta', 'Lexie Readable', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const DEFAULT_POSITION: MultitoolPosition = { x: 0, y: 0 };

const DEFAULT_DROPDOWN_POSITION: DropdownPosition = { top: 72, right: 16 };

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const initialState = {
  isOpen: false,
  activeTool: null as ToolId | null,
  dropdownPosition: DEFAULT_DROPDOWN_POSITION,
  textSize: 'sm' as TextSize, // 100% - normal default
  lineHeight: 'default' as LineHeight,
  readingFont: 'default' as ReadingFont,
  highContrast: false,
  focusMode: false,
  focusModeSectionId: null as string | null,
  position: DEFAULT_POSITION,
};

// Apply reading preferences to DOM
const applyReadingPreferences = (textSize: TextSize, lineHeight: LineHeight, font: ReadingFont) => {
  const root = document.documentElement;
  root.style.fontSize = TEXT_SIZE_VALUES[textSize];
  root.style.setProperty('--reading-line-height', LINE_HEIGHT_VALUES[lineHeight]);
  root.style.setProperty('--reading-font', FONT_FAMILIES[font]);
  
  // Apply font class to body
  document.body.classList.remove('font-dyslexic', 'font-mono');
  if (font === 'dyslexic') {
    document.body.classList.add('font-dyslexic');
  } else if (font === 'mono') {
    document.body.classList.add('font-mono');
  }
};

// Apply focus mode to DOM
const applyFocusMode = (enabled: boolean, sectionId: string | null) => {
  if (enabled) {
    document.body.classList.add('focus-mode-active');
    // Dim all sections except the focused one
    document.querySelectorAll('[data-focus-section]').forEach((el) => {
      el.classList.remove('focus-section-active');
      el.classList.add('focus-section-dimmed');
    });
    if (sectionId) {
      const activeSection = document.getElementById(sectionId);
      if (activeSection) {
        activeSection.classList.remove('focus-section-dimmed');
        activeSection.classList.add('focus-section-active');
      }
    }
  } else {
    document.body.classList.remove('focus-mode-active');
    document.querySelectorAll('[data-focus-section]').forEach((el) => {
      el.classList.remove('focus-section-active', 'focus-section-dimmed');
    });
  }
};

export const useMultitoolStore = create<MultitoolState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      
      open: () => set({ isOpen: true }),
      
      openAtPosition: (position: DropdownPosition) => set({ isOpen: true, dropdownPosition: position }),
      
      close: () => set({ isOpen: false, activeTool: null }),
      
      setActiveTool: (tool) => set({ activeTool: tool }),
      
      setTextSize: (size) => {
        const { lineHeight, readingFont } = get();
        applyReadingPreferences(size, lineHeight, readingFont);
        set({ textSize: size });
      },
      
      cycleTextSize: () => {
        const { textSize, lineHeight, readingFont } = get();
        const currentIndex = TEXT_SIZE_ORDER.indexOf(textSize);
        const nextIndex = (currentIndex + 1) % TEXT_SIZE_ORDER.length;
        const newSize = TEXT_SIZE_ORDER[nextIndex];
        applyReadingPreferences(newSize, lineHeight, readingFont);
        set({ textSize: newSize });
      },
      
      setLineHeight: (height) => {
        const { textSize, readingFont } = get();
        applyReadingPreferences(textSize, height, readingFont);
        set({ lineHeight: height });
      },
      
      cycleLineHeight: () => {
        const { textSize, lineHeight, readingFont } = get();
        const currentIndex = LINE_HEIGHT_ORDER.indexOf(lineHeight);
        const nextIndex = (currentIndex + 1) % LINE_HEIGHT_ORDER.length;
        const newHeight = LINE_HEIGHT_ORDER[nextIndex];
        applyReadingPreferences(textSize, newHeight, readingFont);
        set({ lineHeight: newHeight });
      },
      
      setReadingFont: (font) => {
        const { textSize, lineHeight } = get();
        applyReadingPreferences(textSize, lineHeight, font);
        set({ readingFont: font });
      },
      
      toggleHighContrast: () => {
        const newValue = !get().highContrast;
        if (newValue) {
          document.body.classList.add('high-contrast-mode');
        } else {
          document.body.classList.remove('high-contrast-mode');
        }
        set({ highContrast: newValue });
      },
      
      toggleFocusMode: () => {
        const newValue = !get().focusMode;
        applyFocusMode(newValue, get().focusModeSectionId);
        set({ focusMode: newValue });
      },
      
      setFocusSection: (sectionId) => {
        const { focusMode } = get();
        if (focusMode) {
          applyFocusMode(true, sectionId);
        }
        set({ focusModeSectionId: sectionId });
      },
      
      setPosition: (position) => set({ position }),
      
      reset: () => {
        applyReadingPreferences('sm', 'default', 'default');
        document.body.classList.remove('high-contrast-mode', 'focus-mode-active', 'font-dyslexic', 'font-mono');
        applyFocusMode(false, null);
        set(initialState);
      },
    }),
    {
      name: 'hylono-multitool',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
      partialize: (state) => ({
        isOpen: state.isOpen,
        textSize: state.textSize,
        lineHeight: state.lineHeight,
        readingFont: state.readingFont,
        highContrast: state.highContrast,
      }),
      // Rehydrate on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyReadingPreferences(state.textSize, state.lineHeight, state.readingFont);
          if (state.highContrast) {
            document.body.classList.add('high-contrast-mode');
          }
        }
      },
    }
  )
);

// Export utilities for external use
export { TEXT_SIZE_VALUES, LINE_HEIGHT_VALUES, FONT_FAMILIES };