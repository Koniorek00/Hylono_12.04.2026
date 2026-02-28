/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Outfit', 'system-ui', 'sans-serif'],
                'heading': ['Syncopate', 'sans-serif'],
                'syncopate': ['Syncopate', 'sans-serif'],
                'outfit': ['Outfit', 'sans-serif'],
                'body': ['Outfit', 'sans-serif'],
                'description': ['Outfit', 'sans-serif'],
            },
            fontSize: {
                'description': ['1.0625rem', { lineHeight: '1.7' }],
                'description-lg': ['1.125rem', { lineHeight: '1.7' }],
            },
            colors: {
                'text-primary': {
                    DEFAULT: '#1e293b',
                    light: '#334155',
                    dark: '#0f172a',
                },
                'text-secondary': {
                    DEFAULT: '#475569',
                    light: '#64748b',
                },
                'text-muted': {
                    DEFAULT: '#64748b',
                },
                'accent': {
                    cyan: {
                        DEFAULT: '#0891b2',
                        dark: '#0e7490',
                        light: '#06b6d4',
                    },
                    teal: {
                        DEFAULT: '#0d9488',
                        dark: '#115e59',
                    },
                },
                'focus': {
                    ring: '#0891b2',
                    ringOffset: '#ffffff',
                },
                'semantic': {
                    error: '#dc2626',
                    success: '#16a34a',
                    warning: '#ca8a04',
                    info: '#2563eb',
                },
            },
            ringWidth: {
                'focus': '2px',
                'focus-visible': '2px',
            },
            ringOffsetWidth: {
                'focus': '2px',
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: '#334155',
                        'h1, h2, h3, h4, h5, h6': {
                            color: '#0f172a',
                        },
                        'a':{
                            color: '#0891b2',
                            '&:hover':{
                                color: '#0e7490',
                            },
                        },
                        'code':{
                            color: '#be185d',
                        },
                        'blockquote':{
                            color: '#475569',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        function({ addUtilities, addComponents, theme }) {
            addUtilities({
                '.focus-visible-ring': {
                    'outline': 'none',
                    'ring': '2px solid ' + theme('colors.focus.ring'),
                    'ring-offset': '2px solid ' + theme('colors.focus.ringOffset'),
                },
                '.focus-visible-outline': {
                    'outline': '2px solid ' + theme('colors.focus.ring'),
                    'outline-offset': '2px',
                },
            });
            addComponents({
                '.btn-accessible': {
                    'min-height': '44px',
                    'min-width': '44px',
                    'padding': '0.75rem 1.5rem',
                    'font-weight': '500',
                    'transition': 'all 0.15s ease-in-out',
                    '&:focus-visible': {
                        'outline': '2px solid ' + theme('colors.focus.ring'),
                        'outline-offset': '2px',
                    },
                },
            });
            addUtilities({
                '.skip-link': {
                    'position': 'absolute',
                    'top': '-100%',
                    'left': '0',
                    'z-index': '9999',
                    'padding': '1rem',
                    'background': theme('colors.slate.900'),
                    'color': theme('colors.white'),
                    'text-decoration': 'none',
                    'transition': 'top 0.2s ease-in-out',
                    '&:focus': {
                        'top': '0',
                    },
                },
            });
        },
    ],
}
