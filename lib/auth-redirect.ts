export const DEFAULT_AUTH_SUCCESS_PATH = '/account';
export const LOGIN_PATH = '/login';

interface SafeAuthRedirectPathOptions {
  baseUrl?: string;
  fallbackPath?: string;
}

const CONTROL_CHARACTERS_REGEX = /[\u0000-\u001F\u007F]/;

const getFirstParamValue = (
  value?: string | string[] | null
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
};

const hasControlCharacters = (value: string): boolean =>
  CONTROL_CHARACTERS_REGEX.test(value);

const shouldBlockAuthRedirectPath = (pathname: string): boolean =>
  pathname === LOGIN_PATH || pathname.startsWith('/api/auth');

const toSafeRelativePath = (
  value: string,
  fallbackPath: string
): string => {
  const trimmedValue = value.trim();

  if (
    !trimmedValue ||
    hasControlCharacters(trimmedValue) ||
    trimmedValue.startsWith('//') ||
    !trimmedValue.startsWith('/')
  ) {
    return fallbackPath;
  }

  const resolvedUrl = new URL(trimmedValue, 'https://hylono.invalid');

  if (shouldBlockAuthRedirectPath(resolvedUrl.pathname)) {
    return fallbackPath;
  }

  return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
};

export const getSafeAuthRedirectPath = (
  value: string | null | undefined,
  options: SafeAuthRedirectPathOptions = {}
): string => {
  const fallbackPath = options.fallbackPath ?? DEFAULT_AUTH_SUCCESS_PATH;

  if (!value) {
    return fallbackPath;
  }

  if (value.startsWith('/')) {
    return toSafeRelativePath(value, fallbackPath);
  }

  if (!options.baseUrl) {
    return fallbackPath;
  }

  try {
    const baseUrl = new URL(options.baseUrl);
    const targetUrl = new URL(value);

    if (targetUrl.origin !== baseUrl.origin) {
      return fallbackPath;
    }

    return toSafeRelativePath(
      `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
      fallbackPath
    );
  } catch {
    return fallbackPath;
  }
};

export const getSafeAuthRedirectUrl = (
  value: string | null | undefined,
  baseUrl: string,
  fallbackPath = DEFAULT_AUTH_SUCCESS_PATH
): string =>
  new URL(
    getSafeAuthRedirectPath(value, { baseUrl, fallbackPath }),
    baseUrl
  ).toString();

export const resolveLoginRedirectPath = (
  input: {
    next?: string | string[] | null;
    callbackUrl?: string | string[] | null;
  },
  options: SafeAuthRedirectPathOptions = {}
): string =>
  getSafeAuthRedirectPath(
    getFirstParamValue(input.next) ?? getFirstParamValue(input.callbackUrl),
    options
  );

const normalizeRequestedPath = (pathname: string): string => {
  if (!pathname.startsWith('/')) {
    return `/${pathname}`;
  }

  return pathname;
};

export const buildLoginRedirectPath = (pathname: string): string => {
  const loginParams = new URLSearchParams({ auth: 'required' });
  const normalizedPath = normalizeRequestedPath(pathname);
  const resolvedUrl = new URL(normalizedPath, 'https://hylono.invalid');

  if (resolvedUrl.pathname !== LOGIN_PATH) {
    loginParams.set(
      'next',
      `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`
    );
  }

  return `${LOGIN_PATH}?${loginParams.toString()}`;
};
