export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp?: string;
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
};

const STORAGE_KEY = "konsalta_cookie_preferences";
const COOKIE_NAME = "konsalta_consent";

export function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch {}
  return null;
}

export function savePreferences(prefs: CookiePreferences): void {
  if (typeof window === "undefined") return;
  const payload = {
    ...prefs,
    essential: true,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}

  try {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify(payload)
    )}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}

  window.dispatchEvent(
    new CustomEvent("konsalta_cookie_consent_updated", {
      detail: payload,
    })
  );
}

export function hasUserConsented(): boolean {
  if (typeof window === "undefined") return true;
  return getStoredPreferences() !== null;
}
