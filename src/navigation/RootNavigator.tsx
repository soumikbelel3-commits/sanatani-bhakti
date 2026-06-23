import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../components/Header';
import { TabBar } from '../components/TabBar';
import { Colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import type { ScreenName, TabId } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { JaapScreen } from '../screens/JaapScreen';
import { MandirScreen } from '../screens/MandirScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MantraDetailScreen } from '../screens/MantraDetailScreen';
import { AartiListScreen, AartiDetailScreen } from '../screens/AartiScreens';
import { ChalisaListScreen, ChalisaDetailScreen, BhajanListScreen, BhajanDetailScreen } from '../screens/ChalisaBhajanScreens';
import { PujaListScreen, PujaDetailScreen } from '../screens/PujaScreens';
import {
  RashifalScreen,
  DailyStatusScreen,
  WallpapersScreen,
  ScriptureListScreen,
  ScriptureDetailScreen,
  KnowledgeScreen,
  FavoritesScreen,
  PremiumScreen,
} from '../screens/FeatureScreens';
import {
  StotramListScreen,
  StotramDetailScreen,
  RingtoneListScreen,
  RingtoneDetailScreen,
  TempleListScreen,
  TempleDetailScreen,
  MuhuratScreen,
  FestivalHubScreen,
} from '../screens/NewFeatureScreens';
import { LanguageOnboardingScreen, LanguageSettingsScreen } from '../screens/LanguageScreen';

const TAB_SCREENS: TabId[] = ['home', 'explore', 'jaap', 'mandir', 'profile'];

function renderScreen(screen: ScreenName) {
  switch (screen) {
    case 'home': return <HomeScreen />;
    case 'explore': return <ExploreScreen />;
    case 'jaap': return <JaapScreen />;
    case 'mandir': return <MandirScreen />;
    case 'profile': return <ProfileScreen />;
    case 'mantra-detail': return <MantraDetailScreen />;
    case 'aarti-list': return <AartiListScreen />;
    case 'aarti-detail': return <AartiDetailScreen />;
    case 'chalisa-list': return <ChalisaListScreen />;
    case 'chalisa-detail': return <ChalisaDetailScreen />;
    case 'bhajan-list': return <BhajanListScreen />;
    case 'bhajan-detail': return <BhajanDetailScreen />;
    case 'puja-list': return <PujaListScreen />;
    case 'puja-detail': return <PujaDetailScreen />;
    case 'rashifal': return <RashifalScreen />;
    case 'daily-status': return <DailyStatusScreen />;
    case 'wallpapers': return <WallpapersScreen />;
    case 'scripture-list': return <ScriptureListScreen />;
    case 'scripture-detail': return <ScriptureDetailScreen />;
    case 'knowledge': return <KnowledgeScreen />;
    case 'favorites': return <FavoritesScreen />;
    case 'premium': return <PremiumScreen />;
    case 'stotram-list': return <StotramListScreen />;
    case 'stotram-detail': return <StotramDetailScreen />;
    case 'ringtone-list': return <RingtoneListScreen />;
    case 'ringtone-detail': return <RingtoneDetailScreen />;
    case 'temple-list': return <TempleListScreen />;
    case 'temple-detail': return <TempleDetailScreen />;
    case 'muhurat': return <MuhuratScreen />;
    case 'festival-hub': return <FestivalHubScreen />;
    case 'language-settings': return <LanguageSettingsWrapper />;
    default: return <HomeScreen />;
  }
}

function LanguageSettingsWrapper() {
  const { language, setLanguage } = useApp();
  return <LanguageSettingsScreen selected={language} onSelect={setLanguage} />;
}

export function RootNavigator() {
  const { nav, navigate, language, setLanguage, onboardingDone, completeOnboarding, isReady } = useApp();
  const { t } = useTranslation();
  const [pendingLang, setPendingLang] = useState(language);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!onboardingDone) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <LanguageOnboardingScreen
          selected={pendingLang}
          onSelect={(code) => {
            setPendingLang(code);
            setLanguage(code);
          }}
          onContinue={completeOnboarding}
        />
      </SafeAreaView>
    );
  }

  const isTab = TAB_SCREENS.includes(nav.screen as TabId);
  const showBack = !isTab;

  const SCREEN_TITLES: Partial<Record<ScreenName, string>> = {
    home: t('appName'),
    explore: t('tabExplore'),
    jaap: t('jaapCounter'),
    mandir: t('tabMandir'),
    profile: t('tabProfile'),
    'mantra-detail': t('mantras'),
    'aarti-list': t('aarti'),
    'aarti-detail': t('aarti'),
    'chalisa-list': t('chalisa'),
    'chalisa-detail': t('chalisa'),
    'bhajan-list': t('bhajan'),
    'bhajan-detail': t('bhajan'),
    'puja-list': t('pujaVidhi'),
    'puja-detail': t('pujaVidhi'),
    'scripture-list': t('scriptures'),
    'scripture-detail': t('scriptures'),
    wallpapers: t('wallpapers'),
    'daily-status': t('dailyStatus'),
    rashifal: t('rashifal'),
    knowledge: t('knowledge'),
    premium: 'VIP',
    favorites: t('myFavorites'),
    'stotram-list': t('stotrams'),
    'stotram-detail': t('stotrams'),
    'ringtone-list': t('ringtones'),
    'ringtone-detail': t('ringtones'),
    'temple-list': t('temples'),
    'temple-detail': t('temples'),
    muhurat: t('muhurat'),
    'festival-hub': t('festivalHub'),
    'language-settings': t('changeLanguage'),
  };

  const title = SCREEN_TITLES[nav.screen] ?? t('appName');
  const activeTab: TabId = isTab ? (nav.screen as TabId) : 'home';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      {nav.screen !== 'mandir' && (
        <Header title={title} showBack={showBack} />
      )}
      <View style={styles.body}>
        {renderScreen(nav.screen)}
      </View>
      {isTab && <TabBar active={activeTab} onTab={(tab) => navigate(tab)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  body: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
});
