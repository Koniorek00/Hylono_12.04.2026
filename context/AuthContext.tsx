
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MockAuthService, AuthUser, AuthSession } from '../lib/mockAuth';

interface AuthContextType {
    user: AuthUser | null;
    session: AuthSession | null;
    loading: boolean;
    signIn: (credentials: { email: string; password: string }) => Promise<{ error: any }>;
    signUp: (credentials: { email: string; password: string; name?: string }) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<AuthSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for active session on mount
        const storedSession = MockAuthService.getSession();
        if (storedSession) {
            setSession(storedSession);
            setUser(storedSession.user);
        }
        setLoading(false);
    }, []);

    const signIn = async ({ email, password }: { email: string; password: string }) => {
        const { data, error } = await MockAuthService.signIn({ email, password });
        if (data.session) {
            setSession(data.session);
            setUser(data.user);
        }
        return { error };
    };

    const signUp = async ({ email, password, name }: { email: string; password: string; name?: string }) => {
        const { data, error } = await MockAuthService.signUp({ email, password, name });
        if (data.session) {
            setSession(data.session);
            setUser(data.user);
        }
        return { error };
    };

    const signOut = async () => {
        await MockAuthService.signOut();
        setSession(null);
        setUser(null);
    };

    const resetPassword = async (email: string) => {
        const { error } = await MockAuthService.resetPassword(email);
        return { error };
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
