import arcjet, { detectBot, shield, type ArcjetBotCategory } from '@arcjet/next';
import * as nosecone from '@nosecone/next';
import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from './lib/blog';
import { conditionGoalBySlug } from './content/conditions';
import { protocolBySlug } from './content/protocols';
import {
    getTechRouteSlug,
    getTechTypeFromRouteSlug,
    LEGACY_PRODUCT_ROUTE_REDIRECTS,
} from './lib/product-routes';
import { readRuntimeEnv } from './lib/env';

const AUTH_PROTECTED_PREFIXES = ['/dashboard', '/account', '/partner', '/nexus'] as const;
const BOT_ALLOW_LIST: ArcjetBotCategory[] = ['CATEGORY:SEARCH_ENGINE'];
const CSP_CONNECT_SOURCES = [
    'https://eu.i.posthog.com',
    'https://o4509062593708032.ingest.de.sentry.io',
] as const;
const NEXT_INLINE_BOOTSTRAP_SCRIPT_HASH =
    "'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='";
const NEXT_RENDER_TIMING_SCRIPT_HASH =
    "'sha256-B4nomcLy87+8Sl1HZWbqw3Y85Yd1EEHdZsYWYiDmlhM='";
const NEXT_STREAMING_INLINE_SCRIPT_HASH =
    "'sha256-gyoCZzNah8wEykphZNKy7mjyLzh/qR5B7AfXhI6AouY='";
const NEXT_STREAMING_INLINE_MAP_SCRIPT_HASH =
    "'sha256-rimaae54utIpqXy4SfzTCYOBzW44nNmADdqfIGg1pkE='";

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

const isProtectedPath = (pathname: string): boolean =>
    AUTH_PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

type SeoRouteResolution =
    | { kind: 'ok' }
    | { kind: 'redirect'; location: URL }
    | { kind: 'not-found'; location: URL };

const createSeoRouteResolver = (request: NextRequest): SeoRouteResolution => {
    const { pathname, search } = request.nextUrl;
    const withSameOriginPath = (targetPath: string): URL => new URL(`${targetPath}${search}`, request.url);
    const notFoundLocation = (): URL => new URL('/_not-found', request.url);
    const getSingleSegment = (prefix: string): string | null => {
        if (!pathname.startsWith(`${prefix}/`)) return null;

        const segment = pathname.slice(prefix.length + 1);
        if (!segment || segment.includes('/')) return null;

        return decodeURIComponent(segment);
    };

    const productSlug = getSingleSegment('/product');
    if (productSlug) {
        const normalizedProductSlug = productSlug.toLowerCase();
        const legacyRedirect =
            LEGACY_PRODUCT_ROUTE_REDIRECTS[
                normalizedProductSlug as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
            ];

        if (legacyRedirect) {
            return {
                kind: 'redirect',
                location: withSameOriginPath(`/product/${legacyRedirect}`),
            };
        }

        const techType = getTechTypeFromRouteSlug(normalizedProductSlug);
        if (!techType) {
            return { kind: 'not-found', location: notFoundLocation() };
        }

        const canonicalSlug = getTechRouteSlug(techType);
        if (productSlug !== canonicalSlug) {
            return {
                kind: 'redirect',
                location: withSameOriginPath(`/product/${canonicalSlug}`),
            };
        }
    }

    const conditionSlug = getSingleSegment('/conditions');
    if (conditionSlug) {
        const canonicalConditionSlug = conditionSlug.toLowerCase();
        if (!conditionGoalBySlug[canonicalConditionSlug]) {
            return { kind: 'not-found', location: notFoundLocation() };
        }

        if (conditionSlug !== canonicalConditionSlug) {
            return {
                kind: 'redirect',
                location: withSameOriginPath(`/conditions/${canonicalConditionSlug}`),
            };
        }
    }

    const protocolSlug = getSingleSegment('/protocols');
    if (protocolSlug) {
        const canonicalProtocolSlug = protocolSlug.toLowerCase();
        if (!protocolBySlug[canonicalProtocolSlug]) {
            return { kind: 'not-found', location: notFoundLocation() };
        }

        if (protocolSlug !== canonicalProtocolSlug) {
            return {
                kind: 'redirect',
                location: withSameOriginPath(`/protocols/${canonicalProtocolSlug}`),
            };
        }
    }

    const blogSlug = getSingleSegment('/blog');
    if (blogSlug) {
        const canonicalBlogSlug = blogSlug.toLowerCase();
        if (!getBlogPostBySlug(canonicalBlogSlug)) {
            return { kind: 'not-found', location: notFoundLocation() };
        }

        if (blogSlug !== canonicalBlogSlug) {
            return {
                kind: 'redirect',
                location: withSameOriginPath(`/blog/${canonicalBlogSlug}`),
            };
        }
    }

    return { kind: 'ok' };
};

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

const applyNonceToCsp = (
    cspHeader: string,
    nonce: string,
    options: { allowUnsafeInline?: boolean } = {}
): string => {
    if (options.allowUnsafeInline) {
        return cspHeader.replace(/script-src([^;]*);/i, (fullMatch, directiveValue) => {
            const cleanedDirectiveValue = directiveValue
                .replace(/'nonce-[^']+'/g, '')
                .replace(/'sha256-[^']+'/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            const unsafeInlineDirective = cleanedDirectiveValue.includes("'unsafe-inline'")
                ? cleanedDirectiveValue
                : `${cleanedDirectiveValue} 'unsafe-inline'`.trim();

            return `script-src ${unsafeInlineDirective};`;
        });
    }

    const nonceAdjusted = cspHeader.replace(/'nonce-[^']+'/g, `'nonce-${nonce}'`);

    return nonceAdjusted.replace(/script-src([^;]*);/i, (fullMatch, directiveValue) => {
        const requiredHashes = [
            NEXT_INLINE_BOOTSTRAP_SCRIPT_HASH,
            NEXT_RENDER_TIMING_SCRIPT_HASH,
            NEXT_STREAMING_INLINE_SCRIPT_HASH,
            NEXT_STREAMING_INLINE_MAP_SCRIPT_HASH,
        ].filter((hash) => !directiveValue.includes(hash));

        if (requiredHashes.length === 0) {
            return fullMatch;
        }

        return `script-src${directiveValue} ${requiredHashes.join(' ')};`;
    });
};

type SecurityHeaders = {
    responseHeaders: Array<[string, string]>;
    contentSecurityPolicy: string | null;
    contentSecurityPolicyReportOnly: string | null;
};

const isLocalHostname = (hostname: string): boolean => {
    const normalized = hostname.toLowerCase();
    return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1';
};

const resolveSecurityHeaders = async (
    nonce: string,
    options: { allowUnsafeInline?: boolean } = {}
): Promise<SecurityHeaders> => {
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
            const nonceAdjustedValue = applyNonceToCsp(value, nonce, options);

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

const shouldBypassProtectedRouteAuth = (request: NextRequest): boolean =>
    isLocalHostname(request.nextUrl.hostname) && process.env.VERCEL !== '1';

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
    const nonce = createNonce();
    const securityHeaders = await resolveSecurityHeaders(nonce, {
        allowUnsafeInline: isLocalHostname(request.nextUrl.hostname),
    });

    // 1) Arcjet protection on all routes (except local dev when key is missing)
    if (arcjetClient) {
        const decision = await arcjetClient.protect(request);
        if (decision.isDenied()) {
            return withNoseconeHeaders(new NextResponse('Forbidden', { status: 403 }), securityHeaders, nonce);
        }
    }

    const seoRouteResolution = createSeoRouteResolver(request);
    if (seoRouteResolution.kind === 'redirect') {
        return withNoseconeHeaders(
            NextResponse.redirect(seoRouteResolution.location, { status: 308 }),
            securityHeaders,
            nonce
        );
    }

    if (seoRouteResolution.kind === 'not-found') {
        return withNoseconeHeaders(
            NextResponse.rewrite(seoRouteResolution.location, { status: 404 }),
            securityHeaders,
            nonce
        );
    }

    // 2) Auth route protection (cookie-based proxy check)
    if (
        isProtectedPath(pathname) &&
        !shouldBypassProtectedRouteAuth(request) &&
        !hasSessionCookie(request)
    ) {
        const loginUrl = new URL('/login', request.url);
        const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        loginUrl.searchParams.set('auth', 'required');
        loginUrl.searchParams.set('next', nextPath);
        return withNoseconeHeaders(NextResponse.redirect(loginUrl), securityHeaders, nonce);
    }

    // 3) GDPR tracking gate cookies (default denied unless explicit cookie consent indicates granted)
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
