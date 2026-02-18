
import React, { Component, ReactNode } from 'react';
import { AppProviders } from './components/AppProviders';
import { AppRouter } from './components/AppRouter';
import { LiveChat } from './components/LiveChat';
import { CookieConsent } from './components/CookieConsent';
import { ExitIntent } from './components/ExitIntent';

// Error Boundary for the entire App
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    public state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        const { hasError, error } = this.state;
        if (hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                    <div className="text-red-500 mb-4 text-xl">⚠️ Something went wrong in Hylono OS</div>
                    <p className="text-slate-600 mb-4 font-mono text-xs">{error?.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg uppercase tracking-widest text-[10px] font-bold"
                    >
                        Re-Initialize System
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const App: React.FC = () => (
    <ErrorBoundary>
        <AppProviders>
            <AppRouter />
            {/* Global UI overlays — mounted at root so they persist across route changes */}
            <LiveChat />
            <CookieConsent />
            <ExitIntent />
        </AppProviders>
    </ErrorBoundary>
);

export default App;
