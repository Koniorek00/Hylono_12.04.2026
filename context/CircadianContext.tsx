
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CircadianMode = 'DAY' | 'NIGHT';

interface CircadianContextType {
    mode: CircadianMode;
    toggleMode: () => void;
}

const CircadianContext = createContext<CircadianContextType | undefined>(undefined);

export const CircadianProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<CircadianMode>('DAY');

    useEffect(() => {
        // Simple time-based default
        const hour = new Date().getHours();
        setMode(hour >= 6 && hour < 18 ? 'DAY' : 'NIGHT');
    }, []);

    const toggleMode = () => {
        setMode(prev => prev === 'DAY' ? 'NIGHT' : 'DAY');
    };

    return (
        <CircadianContext.Provider value={{ mode, toggleMode }}>
            {children}
        </CircadianContext.Provider>
    );
};

export const useCircadian = (): CircadianContextType => {
    const context = useContext(CircadianContext);
    if (!context) {
        throw new Error('useCircadian must be used within a CircadianProvider');
    }
    return context;
};
