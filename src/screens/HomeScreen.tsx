import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, PunyaBadge, SectionTitle } from '../components/Card';
import { DeityScroller, QuickActionGrid } from '../components/QuickActions';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { getTodayStatus, getTodayTithi, getUpcomingFestivals } from '../data/daily';
import { MANTRAS } from '../data/mantras';

export function HomeScreen() {
  const { navigate, addPunya } = useApp();
  const { t } = useTranslation();
  const status = getTodayStatus();
  const tithi = getTodayTithi();
  const festivals = getUpcomingFestivals().slice(0, 2);
  const deity = DEITIES.find((d) => d.id === status.deity);
  const featuredMantra = MANTRAS[0]!;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroOm}>🕉️</Text>
        <Text style={styles.heroTitle}>{t('appName')}</Text>
        <Text style={styles.heroSub}>{t('appTagline')}</Text>
        <PunyaBadge />
      </View>

      <Card style={styles.tithiCard}>
        <Text style={styles.tithiLabel}>{t('todayPanchang')}</Text>
        <Text style={styles.tithiValue}>{tithi.tithi} · {tithi.paksha}</Text>
        <Text style={styles.tithiMonth}>{tithi.month}</Text>
      </Card>

      <SectionTitle title={t('dailyStatus')} action={t('share')} onAction={() => navigate('daily-status')} />
      <Card onPress={() => navigate('daily-status')}>
        <Text style={styles.statusDeity}>{deity?.emoji} {deity?.name}</Text>
        <Text style={styles.statusHindi}>{status.quoteHindi}</Text>
        <Text style={styles.statusEn}>{status.quote}</Text>
      </Card>

      <SectionTitle title={t('mantraOfDay')} action={t('allMantras')} onAction={() => navigate('explore')} />
      <Card onPress={() => navigate('mantra-detail', { id: featuredMantra.id })}>
        <Text style={styles.mantraTitle}>{featuredMantra.titleHindi}</Text>
        <Text style={styles.mantraSanskrit}>{featuredMantra.sanskrit}</Text>
        <Pressable style={styles.chantBtn} onPress={() => { addPunya(5); navigate('jaap'); }}>
          <Text style={styles.chantBtnText}>{t('startJaap')} →</Text>
        </Pressable>
      </Card>

      {festivals.length > 0 && (
        <>
          <SectionTitle title={t('upcomingFestivals')} action={t('festivalHub')} onAction={() => navigate('festival-hub')} />
          {festivals.map((f) => (
            <Card key={f.id} onPress={() => navigate('festival-hub')}>
              <Text style={styles.festivalName}>🎉 {f.name}</Text>
              <Text style={styles.festivalDate}>{f.date} · {f.description}</Text>
            </Card>
          ))}
        </>
      )}

      <SectionTitle title={t('quickAccess')} />
      <QuickActionGrid onNavigate={(screen) => navigate(screen)} />

      <SectionTitle title={t('deities')} />
      <DeityScroller onSelect={() => navigate('explore')} />
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  heroOm: { fontSize: 40 },
  heroTitle: { color: Colors.textLight, fontSize: FontSize.xxl, fontWeight: '800', marginTop: Spacing.xs },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: FontSize.sm, marginBottom: Spacing.md },
  tithiCard: { backgroundColor: Colors.surfaceAlt, alignItems: 'center' },
  tithiLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tithiValue: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.secondary, marginTop: 4 },
  tithiMonth: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  statusDeity: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600', marginBottom: Spacing.xs },
  statusHindi: { fontSize: FontSize.lg, color: Colors.text, fontWeight: '600', lineHeight: 28 },
  statusEn: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm, fontStyle: 'italic' },
  mantraTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.secondary },
  mantraSanskrit: { fontSize: FontSize.md, color: Colors.text, marginTop: Spacing.sm, lineHeight: 24 },
  chantBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  chantBtnText: { color: Colors.textLight, fontWeight: '700' },
  festivalName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  festivalDate: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
});
