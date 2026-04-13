import { createHmac, timingSafeEqual } from 'node:crypto';
import { resolveAuthSecret } from '@/lib/auth-secret';

const MOBILE_AUTH_ISSUER = 'hylono-mobile-auth';
const MOBILE_AUTH_AUDIENCE = 'hylono-native-android';
const MOBILE_ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const MOBILE_REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

export const MOBILE_AUTH_SCOPE_RENTALS_READ = 'rentals:read';

type MobileTokenType = 'access' | 'refresh';

interface MobileTokenClaims {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  name: string;
  scope: string[];
  type: MobileTokenType;
  iat: number;
  exp: number;
}

export interface MobileAuthSessionResponse {
  tokenType: 'Bearer';
  accessToken: string;
  accessTokenExpiresAtEpochSeconds: number;
  refreshToken: string;
  refreshTokenExpiresAtEpochSeconds: number;
  scopes: string[];
  user: {
    email: string;
    name: string;
  };
}

interface IssueMobileSessionOptions {
  email: string;
  name?: string;
  scopes?: string[];
  now?: Date;
}

const base64UrlEncode = (value: string): string =>
  Buffer.from(value, 'utf8').toString('base64url');

const base64UrlDecode = (value: string): string =>
  Buffer.from(value, 'base64url').toString('utf8');

const safeNodeEnv = (): 'development' | 'test' | 'production' => {
  const nodeEnv = process.env.NODE_ENV;

  if (
    nodeEnv === 'development' ||
    nodeEnv === 'test' ||
    nodeEnv === 'production'
  ) {
    return nodeEnv;
  }

  return 'development';
};

const resolveMobileAuthSecret = (): string | undefined =>
  resolveAuthSecret({
    explicitSecret:
      process.env.MOBILE_AUTH_TOKEN_SECRET ??
      process.env.AUTH_SECRET ??
      process.env.NEXTAUTH_SECRET,
    nodeEnv: safeNodeEnv(),
    seed: `${process.cwd()}:mobile-auth`,
    allowProductionFallback: process.env.VERCEL !== '1',
  });

const signToken = (unsignedToken: string, secret: string): string =>
  createHmac('sha256', secret).update(unsignedToken).digest('base64url');

const buildUnsignedToken = (claims: MobileTokenClaims): string => {
  const headerSegment = base64UrlEncode(
    JSON.stringify({
      alg: 'HS256',
      typ: 'JWT',
    })
  );
  const payloadSegment = base64UrlEncode(JSON.stringify(claims));

  return `${headerSegment}.${payloadSegment}`;
};

const createSignedToken = (
  claims: MobileTokenClaims,
  secret: string
): string => {
  const unsignedToken = buildUnsignedToken(claims);
  const signature = signToken(unsignedToken, secret);

  return `${unsignedToken}.${signature}`;
};

const createTokenClaims = ({
  email,
  name,
  scopes,
  now,
  ttlSeconds,
  type,
}: {
  email: string;
  name: string;
  scopes: string[];
  now: Date;
  ttlSeconds: number;
  type: MobileTokenType;
}): MobileTokenClaims => {
  const issuedAtSeconds = Math.floor(now.getTime() / 1000);

  return {
    iss: MOBILE_AUTH_ISSUER,
    aud: MOBILE_AUTH_AUDIENCE,
    sub: email,
    email,
    name,
    scope: scopes,
    type,
    iat: issuedAtSeconds,
    exp: issuedAtSeconds + ttlSeconds,
  };
};

const parseTokenClaims = (token: string): MobileTokenClaims | null => {
  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    return null;
  }

  const encodedHeader = tokenParts[0];
  const encodedPayload = tokenParts[1];
  const encodedSignature = tokenParts[2];
  const secret = resolveMobileAuthSecret();

  if (!secret || !encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = signToken(unsignedToken, secret);
  const providedSignature = encodedSignature.trim();

  if (!providedSignature) {
    return null;
  }

  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return null;
  }

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader)) as {
      alg?: string;
      typ?: string;
    };
    const claims = JSON.parse(base64UrlDecode(encodedPayload)) as
      | MobileTokenClaims
      | undefined;

    if (
      header?.alg !== 'HS256' ||
      header?.typ !== 'JWT' ||
      !claims ||
      claims.iss !== MOBILE_AUTH_ISSUER ||
      claims.aud !== MOBILE_AUTH_AUDIENCE ||
      claims.sub !== claims.email ||
      !Array.isArray(claims.scope) ||
      typeof claims.exp !== 'number' ||
      typeof claims.iat !== 'number' ||
      typeof claims.email !== 'string' ||
      typeof claims.name !== 'string' ||
      (claims.type !== 'access' && claims.type !== 'refresh')
    ) {
      return null;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (claims.exp <= nowSeconds) {
      return null;
    }

    return claims;
  } catch {
    return null;
  }
};

export const isMobileAuthConfigured = (): boolean =>
  Boolean(resolveMobileAuthSecret());

export const issueMobileAuthSession = ({
  email,
  name = 'Hylono User',
  scopes = [MOBILE_AUTH_SCOPE_RENTALS_READ],
  now = new Date(),
}: IssueMobileSessionOptions): MobileAuthSessionResponse | null => {
  const secret = resolveMobileAuthSecret();

  if (!secret) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim() || 'Hylono User';
  const normalizedScopes = scopes
    .map((scope) => scope.trim())
    .filter(Boolean);

  const accessClaims = createTokenClaims({
    email: normalizedEmail,
    name: normalizedName,
    scopes: normalizedScopes,
    now,
    ttlSeconds: MOBILE_ACCESS_TOKEN_TTL_SECONDS,
    type: 'access',
  });
  const refreshClaims = createTokenClaims({
    email: normalizedEmail,
    name: normalizedName,
    scopes: normalizedScopes,
    now,
    ttlSeconds: MOBILE_REFRESH_TOKEN_TTL_SECONDS,
    type: 'refresh',
  });

  return {
    tokenType: 'Bearer',
    accessToken: createSignedToken(accessClaims, secret),
    accessTokenExpiresAtEpochSeconds: accessClaims.exp,
    refreshToken: createSignedToken(refreshClaims, secret),
    refreshTokenExpiresAtEpochSeconds: refreshClaims.exp,
    scopes: normalizedScopes,
    user: {
      email: normalizedEmail,
      name: normalizedName,
    },
  };
};

export const verifyMobileAuthToken = (
  token: string,
  expectedType?: MobileTokenType
): MobileTokenClaims | null => {
  const claims = parseTokenClaims(token);

  if (!claims) {
    return null;
  }

  if (expectedType && claims.type !== expectedType) {
    return null;
  }

  return claims;
};

export const readBearerToken = (request: Request): string | null => {
  const authorization = request.headers.get('authorization')?.trim();

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(/\s+/, 2);

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token.trim() || null;
};
