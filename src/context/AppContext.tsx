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
  punyaPoints: number;
  addPunya: (points: number, reason?: string) => void;
  streak: number;
  isPremium: boolean;
  setPremium: (v: boolean) => void;
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [navStack, setNavStack] = useState<NavigationState[]>([{ screen: 'home' }]);
  const [punyaPoints, setPunyaPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
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
      const [p, s, f, prem, rashi, jaap, name, lang, onboard] = await Promise.all([
        Storage.getItem(STORAGE_KEYS.PUNYA_POINTS),
        Storage.getItem(STORAGE_KEYS.STREAK),
        Storage.getItem(STORAGE_KEYS.FAVORITES),
        Storage.getItem(STORAGE_KEYS.IS_PREMIUM),
        Storage.getItem(STORAGE_KEYS.SELECTED_RASHI),
        Storage.getItem(STORAGE_KEYS.JAAP_TOTAL),
        Storage.getItem(STORAGE_KEYS.USER_NAME),
        Storage.getItem(STORAGE_KEYS.LANGUAGE),
        Storage.getItem(STORAGE_KEYS.ONBOARDING_DONE),
      ]);
      if (p) setPunyaPoints(parseInt(p, 10));
      if (s) setStreak(parseInt(s, 10));
      if (f) setFavorites(JSON.parse(f));
      if (prem === 'true') setIsPremium(true);
      if (rashi) setSelectedRashiState(parseInt(rashi, 10));
      if (jaap) setJaapTotal(parseInt(jaap, 10));
      if (name) setUserNameState(name);
      if (lang) setLanguageState(lang as LanguageCode);
      if (onboard === 'true') setOnboardingDone(true);
      await updateStreak();
      setIsReady(true);
    })();
  }, []);

  const updateStreak = async () => {
    const last = await Storage.getItem(STORAGE_KEYS.LAST_ACTIVE);
    const today = new Date().toDateString();
    if (last === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const currentStreak = parseInt((await Storage.getItem(STORAGE_KEYS.STREAK)) || '0', 10);
    const newStreak = last === yesterday.toDateString() ? currentStreak + 1 : 1;
    setStreak(newStreak);
    await Storage.setItem(STORAGE_KEYS.STREAK, String(newStreak));
    await Storage.setItem(STORAGE_KEYS.LAST_ACTIVE, today);
  };

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

  const addPunya = useCallback(async (points: number) => {
    setPunyaPoints((prev) => {
      const next = prev + points;
      Storage.setItem(STORAGE_KEYS.PUNYA_POINTS, String(next));
      return next;
    });
  }, []);

  const setPremium = useCallback(async (v: boolean) => {
    setIsPremium(v);
    await Storage.setItem(STORAGE_KEYS.IS_PREMIUM, String(v));
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

  const addJaap = useCallback(async (count: number) => {
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
      punyaPoints,
      addPunya,
      streak,
      isPremium,
      setPremium,
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
      nav, navigate, goBack, punyaPoints, addPunya, streak, isPremium, setPremium,
      favorites, toggleFavorite, selectedRashi, setSelectedRashi, jaapTotal, addJaap,
      userName, setUserName, mandirFlowers, mandirDiyas, offerFlower, lightDiya,
      language, setLanguage, onboardingDone, completeOnboarding, isReady,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
