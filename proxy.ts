import arcjet, { detectBot, shield, type ArcjetBotCategory } from '@arcjet/next';
import * as nosecone from '@nosecone/next';
import { NextRequest, NextResponse } from 'next/server';
import { readRuntimeEnv } from './lib/env';

const EU_LOCALES = ['en', 'de', 'pl', 'nl'] as const;
const AUTH_PROTECTED_PREFIXES = ['/dashboard', '/account', '/partner'] as const;
const BOT_UA_PATTERN = /(googlebot|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|twitterbot|linkedinbot|applebot)/i;
const BOT_ALLOW_LIST: ArcjetBotCategory[] = ['CATEGORY:SEARCH_ENGINE'];
const CSP_CONNECT_SOURCES = [
    'https://eu.i.posthog.com',
    'https://o4509062593708032.ingest.de.sentry.io',
] as const;
const NEXT_INLINE_BOOTSTRAP_SCRIPT_HASH =
    "'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='";

const ARCJET_KEY = readRuntimeEnv('ARCJET_KEY');
const ARCJET_MODE = ARCJET_KEY ? 'LIVE' : 'DRY_RUN';

const arcjetClient = ARCJET_KEY
    ? arcjet({
          key: ARCJET_KEY,
          characteristics: ['ip.src'],
          rules: [
              shield({ mode: ARCJET_MODE }),
              detectBot({ mode: ARCJET_MODE, allow: BOT_ALLOW_LIST }),
          ],
      })
    : null;

const noseconeOptions: nosecone.NoseconeOptions = {
    ...nosecone.defaults,
    contentSecurityPolicy: {
        ...nosecone.defaults.contentSecurityPolicy,
        directives: {
            ...nosecone.defaults.contentSecurityPolicy.directives,
            connectSrc: [
                ...nosecone.defaults.contentSecurityPolicy.directives.connectSrc,
                ...CSP_CONNECT_SOURCES,
            ],
        },
    },
};

const noseconeMiddleware = nosecone.createMiddleware(noseconeOptions);

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

const createNonce = (): string => btoa(crypto.randomUUID());

const applyNonceToCsp = (cspHeader: string, nonce: string): string => {
    const nonceAdjusted = cspHeader.replace(/'nonce-[^']+'/g, `'nonce-${nonce}'`);

    return nonceAdjusted.replace(/script-src([^;]*);/i, (fullMatch, directiveValue) =>
        directiveValue.includes(NEXT_INLINE_BOOTSTRAP_SCRIPT_HASH)
            ? fullMatch
            : `script-src${directiveValue} ${NEXT_INLINE_BOOTSTRAP_SCRIPT_HASH};`
    );
};

type SecurityHeaders = {
    responseHeaders: Array<[string, string]>;
    contentSecurityPolicy: string | null;
    contentSecurityPolicyReportOnly: string | null;
};

const resolveSecurityHeaders = async (nonce: string): Promise<SecurityHeaders> => {
    const noseconeResponse = await noseconeMiddleware();
    const responseHeaders: Array<[string, string]> = [];
    let contentSecurityPolicy: string | null = null;
    let contentSecurityPolicyReportOnly: string | null = null;

    for (const [header, value] of noseconeResponse.headers.entries()) {
        if (header === 'x-middleware-next') continue;

        if (
            header === 'content-security-policy' ||
            header === 'content-security-policy-report-only'
        ) {
            const nonceAdjustedValue = applyNonceToCsp(value, nonce);

            if (header === 'content-security-policy') {
                contentSecurityPolicy = nonceAdjustedValue;
            } else {
                contentSecurityPolicyReportOnly = nonceAdjustedValue;
            }

            responseHeaders.push([header, nonceAdjustedValue]);
            continue;
        }

        responseHeaders.push([header, value]);
    }

    return {
        responseHeaders,
        contentSecurityPolicy,
        contentSecurityPolicyReportOnly,
    };
};

const hasSessionCookie = (request: NextRequest): boolean =>
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token') ||
    Boolean(request.cookies.get('hylono_session')?.value) ||
    Boolean(request.cookies.get('session')?.value);

const withNoseconeHeaders = (
    response: NextResponse,
    securityHeaders: SecurityHeaders,
    nonce: string
): NextResponse => {
    for (const [header, value] of securityHeaders.responseHeaders) {
        response.headers.set(header, value);
    }

    response.headers.set('x-nonce', nonce);

    return response;
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const { pathname, searchParams } = request.nextUrl;
    const userAgent = request.headers.get('user-agent') ?? '';
    const isBotTraffic = BOT_UA_PATTERN.test(userAgent);
    const nonce = createNonce();
    const securityHeaders = await resolveSecurityHeaders(nonce);

    // 1) Arcjet protection on all routes (except local dev when key is missing)
    if (arcjetClient) {
        const decision = await arcjetClient.protect(request);
        if (decision.isDenied()) {
            return withNoseconeHeaders(new NextResponse('Forbidden', { status: 403 }), securityHeaders, nonce);
        }
    }

    // 2) Auth route protection (cookie-based proxy check)
    if (isProtectedPath(pathname) && !hasSessionCookie(request)) {
        const loginUrl = new URL('/login', request.url);
        const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        loginUrl.searchParams.set('auth', 'required');
        loginUrl.searchParams.set('next', nextPath);
        return withNoseconeHeaders(NextResponse.redirect(loginUrl), securityHeaders, nonce);
    }

    // 3) Geo-locale detection (bot-safe): redirect root visitors to locale hint URL
    if (!isBotTraffic && pathname === '/' && !searchParams.has('hl')) {
        const preferredLocale = getPreferredLocale(request.headers.get('accept-language'));
        if (preferredLocale !== 'en') {
            const localizedUrl = new URL(request.url);
            localizedUrl.searchParams.set('hl', preferredLocale);
            return withNoseconeHeaders(NextResponse.redirect(localizedUrl), securityHeaders, nonce);
        }
    }

    // 4) GDPR tracking gate cookies (default denied unless explicit cookie consent indicates granted)
    const consent = parseConsentCookie(request.cookies.get('cookieConsent')?.value);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);

    if (securityHeaders.contentSecurityPolicy) {
        requestHeaders.set('content-security-policy', securityHeaders.contentSecurityPolicy);
    }

    if (securityHeaders.contentSecurityPolicyReportOnly) {
        requestHeaders.set(
            'content-security-policy-report-only',
            securityHeaders.contentSecurityPolicyReportOnly
        );
    }

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
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

    return withNoseconeHeaders(response, securityHeaders, nonce);
}
