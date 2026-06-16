/** Canonical production URL — used when env is missing or still points at localhost. */
export const PRODUCTION_APP_URL = "http://213.254.179.94";

const LOCAL_DEV_URL = "http://localhost:3000";

export function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Public app URL for server-side redirects, referral links, and email auth.
 * In production, never falls back to localhost.
 */
export function getAppUrl(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (env && !isLocalhostUrl(env)) {
    return normalizeUrl(env);
  }
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_APP_URL;
  }
  return env ? normalizeUrl(env) : LOCAL_DEV_URL;
}

/** Full URL for the OAuth / email confirmation callback. */
export function getAuthCallbackUrl(next?: string): string {
  const base = `${getAppUrl()}/auth/callback`;
  if (!next) return base;
  return `${base}?next=${encodeURIComponent(next)}`;
}

/**
 * Client-side OAuth redirect base.
 * Prefers a non-localhost env URL; otherwise uses the current browser origin.
 */
export function getClientAppUrl(): string {
  if (typeof window === "undefined") {
    return getAppUrl();
  }
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (env && !isLocalhostUrl(env)) {
    return normalizeUrl(env);
  }
  return window.location.origin;
}
