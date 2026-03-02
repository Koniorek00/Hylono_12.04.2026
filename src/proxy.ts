import { NextRequest, NextResponse } from 'next/server';

const EU_LOCALES = ['en', 'de', 'pl', 'nl'] as const;
const AUTH_PROTECTED_PREFIXES = ['/dashboard', '/account', '/partner'] as const;
const BOT_UA_PATTERN = /(googlebot|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|twitterbot|linkedinbot|applebot)/i;

type ConsentRecord = {
    analytics?: boolean;
    marketing?: boolean;
};

const getPreferredLocale = (acceptLanguage: string | null): (typeof EU_LOCALES)[number] => {
    if (!acceptLanguage) return 'en';

    const normalized = acceptLanguage
        .split(',')
        .map((part) => part.trim().split(';')[0]?.toLowerCase())
        .filter((part): part is string => Boolean(part));

    for (const lang of normalized) {
        const base = lang.split('-')[0];
        if (base && EU_LOCALES.includes(base as (typeof EU_LOCALES)[number])) {
            return base as (typeof EU_LOCALES)[number];
        }
    }

    return 'en';
};

const isProtectedPath = (pathname: string): boolean =>
    AUTH_PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

const parseConsentCookie = (rawValue: string | undefined): ConsentRecord => {
    if (!rawValue) return {};

    try {
        const parsed = JSON.parse(decodeURIComponent(rawValue)) as ConsentRecord;
        return {
            analytics: parsed.analytics === true,
            marketing: parsed.marketing === true,
        };
    } catch {
        return {};
    }
};

export function proxy(request: NextRequest): NextResponse {
    const { pathname, searchParams } = request.nextUrl;
    const userAgent = request.headers.get('user-agent') ?? '';
    const isBotTraffic = BOT_UA_PATTERN.test(userAgent);

    // 1) Auth route protection (cookie-based edge check)
    if (isProtectedPath(pathname)) {
        const hasSession =
            Boolean(request.cookies.get('hylono_session')?.value) ||
            Boolean(request.cookies.get('session')?.value);

        if (!hasSession) {
            const loginUrl = new URL('/', request.url);
            loginUrl.searchParams.set('auth', 'required');
            loginUrl.searchParams.set('next', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 2) Geo-locale detection (bot-safe): redirect root visitors to locale hint URL
    if (!isBotTraffic && pathname === '/' && !searchParams.has('hl')) {
        const preferredLocale = getPreferredLocale(request.headers.get('accept-language'));
        if (preferredLocale !== 'en') {
            const localizedUrl = new URL(request.url);
            localizedUrl.searchParams.set('hl', preferredLocale);
            return NextResponse.redirect(localizedUrl);
        }
    }

    // 3) GDPR tracking gate cookies (default denied unless explicit cookie consent indicates granted)
    const consent = parseConsentCookie(request.cookies.get('cookieConsent')?.value);
    const response = NextResponse.next();
    const secureCookie = request.nextUrl.protocol === 'https:';

    response.cookies.set('hylono_analytics', consent.analytics ? 'granted' : 'denied', {
        httpOnly: false,
        secure: secureCookie,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
    });

    response.cookies.set('hylono_marketing', consent.marketing ? 'granted' : 'denied', {
        httpOnly: false,
        secure: secureCookie,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
    });

    return response;
}

export const config = {
    matcher: [
        {
            source:
                '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf)$).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
