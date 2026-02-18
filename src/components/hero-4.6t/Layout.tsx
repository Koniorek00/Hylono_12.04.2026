import React from 'react';


interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="bg-[#FAFAF7] text-[#1A1A1A] font-sans min-h-screen selection:bg-[#0A6E6E] selection:text-white overflow-x-hidden">
            {/* 
                Verify: Do we have react-helmet installed? package.json says no. 
                Alternative: standard Next.js Head or just a style tag since this is a SPA/Vite app. 
                Using a style tag for fonts for now as per "single file" instruction spirit, 
                but practically implemented in valid React.
            */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

                :root {
                    --font-headline: 'Outfit', 'Plus Jakarta Sans', sans-serif;
                    --font-body: 'Inter', 'DM Sans', sans-serif;
                    --font-accent: 'Instrument Serif', 'Playfair Display', serif;
                    
                    --color-bg-primary: #FAFAF7;
                    --color-bg-secondary: #F0F0EB;
                    --color-teal-dark: #0A6E6E;
                    --color-teal-light: #3EDFD7;
                    --color-gold: #C9A84C;
                    --color-text-primary: #1A1A1A;
                    --color-text-secondary: #6B6B60;
                    --color-border: #E0DED6;
                }

                body {
                    font-family: var(--font-body);
                    background-color: var(--color-bg-primary);
                    color: var(--color-text-primary);
                }

                h1, h2, h3, h4, h5, h6 {
                    font-family: var(--font-headline);
                }

                .font-accent {
                    font-family: var(--font-accent);
                }
            `}</style>
            {children}
        </div>
    );
};
