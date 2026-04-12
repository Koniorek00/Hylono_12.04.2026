export const COOKIE_CONSENT_KEY = 'cookieConsent';
export const COOKIE_CONSENT_EVENT = 'hylono:open-cookie-settings';

export const openCookieSettings = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
};
