import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

interface AuthSession {
  sessionId: string;
  expiresAt: string;
}

interface AuthError {
  message: string;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: AuthUser | null;
    session: AuthSession | null;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: { email: string; password: string; name?: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = localStorage.getItem('hylono_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession) as AuthSession;
        // Check if session is still valid
        if (new Date(parsed.expiresAt) > new Date()) {
          setSession(parsed);
          // Verify session with backend
          fetchSession(parsed.sessionId);
        } else {
          localStorage.removeItem('hylono_session');
        }
      } catch {
        localStorage.removeItem('hylono_session');
      }
    }
    setLoading(false);
  }, []);

  const fetchSession = async (sessionId: string) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/session'), {
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      });
      const data: AuthResponse = await response.json();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      } else {
        localStorage.removeItem('hylono_session');
        setSession(null);
      }
    } catch {
      localStorage.removeItem('hylono_session');
      setSession(null);
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse = await response.json();
      
      if (data.success && data.data?.session && data.data?.user) {
        setSession(data.data.session);
        setUser(data.data.user);
        localStorage.setItem('hylono_session', JSON.stringify(data.data.session));
        return { error: null };
      }
      
      return { error: { message: data.error?.message || 'Login failed' } };
    } catch (err) {
      return { error: { message: 'Network error' } };
    }
  };

  const signUp = async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data: AuthResponse = await response.json();
      
      if (data.success && data.data?.session && data.data?.user) {
        setSession(data.data.session);
        setUser(data.data.user);
        localStorage.setItem('hylono_session', JSON.stringify(data.data.session));
        return { error: null };
      }
      
      return { error: { message: data.error?.message || 'Registration failed' } };
    } catch (err) {
      return { error: { message: 'Network error' } };
    }
  };

  const signOut = async () => {
    try {
      const sessionId = session?.sessionId;
      if (sessionId) {
        await fetch(buildApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${sessionId}` },
        });
      }
    } catch {
      // Ignore errors
    }
    setSession(null);
    setUser(null);
    localStorage.removeItem('hylono_session');
  };

  const resetPassword = async (email: string) => {
    // Password reset not implemented yet
    return { error: { message: 'Password reset not available' } };
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
