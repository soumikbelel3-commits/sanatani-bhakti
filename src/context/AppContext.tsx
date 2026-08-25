import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LanguageCode } from '../i18n/languages';
import { DEFAULT_LANGUAGE } from '../i18n/languages';
import type { NavigationState, ScreenName, TabId } from '../types';
import { Storage, STORAGE_KEYS } from '../services/storage';

const TAB_SCREENS: TabId[] = ['home', 'explore', 'jaap', 'mandir', 'profile'];

interface AppContextValue {
  nav: NavigationState;
  navigate: (screen: ScreenName, params?: Record<string, string>) => void;
  goBack: () => void;
  /** True when the nav stack has somewhere to return to. Drives the Android back button. */
  canGoBack: boolean;
  punyaPoints: number;
  addPunya: (points: number, reason?: string) => void;
  streak: number;
  /**
   * Whether the user has bought the one-time "Remove Ads" product.
   * This controls ads ONLY — every piece of devotional content is free.
   */
  adsRemoved: boolean;
  setAdsRemoved: (v: boolean) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  selectedRashi: number;
  setSelectedRashi: (i: number) => void;
  jaapTotal: number;
  addJaap: (count: number) => void;
  userName: string;
  setUserName: (name: string) => void;
  mandirFlowers: number;
  mandirDiyas: number;
  offerFlower: () => void;
  lightDiya: () => void;
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  onboardingDone: boolean;
  completeOnboarding: () => void;
  isReady: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Computes the streak for today from the last-active date, without touching state. */
function nextStreak(lastActive: string | null, storedStreak: number): number | null {
  const today = new Date().toDateString();
  if (lastActive === today) return null; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return lastActive === yesterday.toDateString() ? storedStreak + 1 : 1;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [navStack, setNavStack] = useState<NavigationState[]>([{ screen: 'home' }]);
  const [punyaPoints, setPunyaPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [adsRemoved, setAdsRemovedState] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedRashi, setSelectedRashiState] = useState(0);
  const [jaapTotal, setJaapTotal] = useState(0);
  const [userName, setUserNameState] = useState('Bhakt');
  const [mandirFlowers, setMandirFlowers] = useState(0);
  const [mandirDiyas, setMandirDiyas] = useState(0);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const nav = navStack[navStack.length - 1]!;

  useEffect(() => {
    (async () => {
      const v = await Storage.multiGet(Object.values(STORAGE_KEYS));

      const storedStreak = parseInt(v[STORAGE_KEYS.STREAK] || '0', 10);
      if (v[STORAGE_KEYS.PUNYA_POINTS]) setPunyaPoints(parseInt(v[STORAGE_KEYS.PUNYA_POINTS]!, 10));
      if (v[STORAGE_KEYS.FAVORITES]) {
        try {
          setFavorites(JSON.parse(v[STORAGE_KEYS.FAVORITES]!));
        } catch {
          setFavorites([]);
        }
      }
      if (v[STORAGE_KEYS.ADS_REMOVED] === 'true') setAdsRemovedState(true);
      if (v[STORAGE_KEYS.SELECTED_RASHI]) setSelectedRashiState(parseInt(v[STORAGE_KEYS.SELECTED_RASHI]!, 10));
      if (v[STORAGE_KEYS.JAAP_TOTAL]) setJaapTotal(parseInt(v[STORAGE_KEYS.JAAP_TOTAL]!, 10));
      if (v[STORAGE_KEYS.USER_NAME]) setUserNameState(v[STORAGE_KEYS.USER_NAME]!);
      if (v[STORAGE_KEYS.LANGUAGE]) setLanguageState(v[STORAGE_KEYS.LANGUAGE] as LanguageCode);
      if (v[STORAGE_KEYS.ONBOARDING_DONE] === 'true') setOnboardingDone(true);

      const updated = nextStreak(v[STORAGE_KEYS.LAST_ACTIVE], storedStreak);
      if (updated === null) {
        setStreak(storedStreak);
      } else {
        setStreak(updated);
        await Storage.setItem(STORAGE_KEYS.STREAK, String(updated));
        await Storage.setItem(STORAGE_KEYS.LAST_ACTIVE, new Date().toDateString());
      }

      setIsReady(true);
    })();
  }, []);

  const navigate = useCallback((screen: ScreenName, params?: Record<string, string>) => {
    if (TAB_SCREENS.includes(screen as TabId)) {
      setNavStack([{ screen, params }]);
    } else {
      setNavStack((prev) => [...prev, { screen, params }]);
    }
  }, []);

  const goBack = useCallback(() => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const addPunya = useCallback((points: number) => {
    setPunyaPoints((prev) => {
      const next = prev + points;
      Storage.setItem(STORAGE_KEYS.PUNYA_POINTS, String(next));
      return next;
    });
  }, []);

  const setAdsRemoved = useCallback(async (v: boolean) => {
    setAdsRemovedState(v);
    await Storage.setItem(STORAGE_KEYS.ADS_REMOVED, String(v));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      Storage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
      return next;
    });
  }, []);

  const setSelectedRashi = useCallback(async (i: number) => {
    setSelectedRashiState(i);
    await Storage.setItem(STORAGE_KEYS.SELECTED_RASHI, String(i));
  }, []);

  const addJaap = useCallback((count: number) => {
    setJaapTotal((prev) => {
      const next = prev + count;
      Storage.setItem(STORAGE_KEYS.JAAP_TOTAL, String(next));
      return next;
    });
    addPunya(Math.floor(count / 10) + 1);
  }, [addPunya]);

  const setUserName = useCallback(async (name: string) => {
    setUserNameState(name);
    await Storage.setItem(STORAGE_KEYS.USER_NAME, name);
  }, []);

  const setLanguage = useCallback(async (code: LanguageCode) => {
    setLanguageState(code);
    await Storage.setItem(STORAGE_KEYS.LANGUAGE, code);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setOnboardingDone(true);
    await Storage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
  }, []);

  const offerFlower = useCallback(() => {
    setMandirFlowers((n) => n + 1);
    addPunya(5);
  }, [addPunya]);

  const lightDiya = useCallback(() => {
    setMandirDiyas((n) => n + 1);
    addPunya(10);
  }, [addPunya]);

  const value = useMemo(
    () => ({
      nav,
      navigate,
      goBack,
      canGoBack: navStack.length > 1,
      punyaPoints,
      addPunya,
      streak,
      adsRemoved,
      setAdsRemoved,
      favorites,
      toggleFavorite,
      selectedRashi,
      setSelectedRashi,
      jaapTotal,
      addJaap,
      userName,
      setUserName,
      mandirFlowers,
      mandirDiyas,
      offerFlower,
      lightDiya,
      language,
      setLanguage,
      onboardingDone,
      completeOnboarding,
      isReady,
    }),
    [
      nav, navStack.length, navigate, goBack, punyaPoints, addPunya, streak,
      adsRemoved, setAdsRemoved, favorites, toggleFavorite, selectedRashi,
      setSelectedRashi, jaapTotal, addJaap, userName, setUserName, mandirFlowers,
      mandirDiyas, offerFlower, lightDiya, language, setLanguage, onboardingDone,
      completeOnboarding, isReady,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
