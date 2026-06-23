const memoryStore: Record<string, string> = {};

function hasLocalStorage(): boolean {
  try {
    return typeof globalThis !== 'undefined' && 'localStorage' in globalThis;
  } catch {
    return false;
  }
}

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (hasLocalStorage()) {
      return globalThis.localStorage.getItem(key);
    }
    return memoryStore[key] ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (hasLocalStorage()) {
      globalThis.localStorage.setItem(key, value);
    }
    memoryStore[key] = value;
  },
  async removeItem(key: string): Promise<void> {
    if (hasLocalStorage()) {
      globalThis.localStorage.removeItem(key);
    }
    delete memoryStore[key];
  },
};

export const STORAGE_KEYS = {
  PUNYA_POINTS: '@sanatani/punya',
  STREAK: '@sanatani/streak',
  LAST_ACTIVE: '@sanatani/lastActive',
  FAVORITES: '@sanatani/favorites',
  IS_PREMIUM: '@sanatani/premium',
  SELECTED_RASHI: '@sanatani/rashi',
  JAAP_TOTAL: '@sanatani/jaapTotal',
  USER_NAME: '@sanatani/userName',
  LANGUAGE: '@sanatani/language',
  ONBOARDING_DONE: '@sanatani/onboardingDone',
} as const;
