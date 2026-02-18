
import React, { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from './Cart';
import { WishlistProvider } from './Wishlist';
import { initPostHog } from '../src/lib/analytics';

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    useEffect(() => {
        initPostHog();
    }, []);

    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
};
