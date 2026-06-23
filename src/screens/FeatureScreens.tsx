import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { getTodayStatus } from '../data/daily';
import { RASHIS, getRashifalForDay } from '../data/rashifal';
import { SCRIPTURES, getScriptureById } from '../data/scriptures';
import { WALLPAPERS } from '../data/wallpapers';
import { KNOWLEDGE_CARDS } from '../data/daily';
import { MANTRAS } from '../data/mantras';

export function RashifalScreen() {
  const { selectedRashi, setSelectedRashi } = useApp();
  const { t } = useTranslation();
  const rashifal = getRashifalForDay(selectedRashi);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rashiRow}>
        {RASHIS.map((r, i) => (
          <Pressable key={r.rashi} style={[styles.rashiChip, selectedRashi === i && styles.rashiActive]} onPress={() => setSelectedRashi(i)}>
            <Text style={styles.rashiSymbol}>{r.symbol}</Text>
            <Text style={styles.rashiName}>{r.rashiHindi}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Card style={styles.predictionCard}>
        <Text style={styles.rashiTitle}>{rashifal.symbol} {rashifal.rashiHindi} ({rashifal.rashi})</Text>
        <Text style={styles.predHindi}>{rashifal.predictionHindi}</Text>
        <Text style={styles.predEn}>{rashifal.prediction}</Text>
        <View style={styles.luckyRow}>
          <Text style={styles.lucky}>{t('luckyColor')}: {rashifal.luckyColor}</Text>
          <Text style={styles.lucky}>{t('luckyNumber')}: {rashifal.luckyNumber}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

export function DailyStatusScreen() {
  const { addPunya } = useApp();
  const { t } = useTranslation();
  const status = getTodayStatus();
  const deity = DEITIES.find((d) => d.id === status.deity);

  const share = () => {
    addPunya(5);
    // expo-sharing can be wired when package is installed
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusCard, { backgroundColor: Colors.primary }]}>
        <Text style={styles.statusDeity}>{deity?.emoji}</Text>
        <Text style={styles.statusQuote}>{status.quoteHindi}</Text>
        <Text style={styles.statusEn}>{status.quote}</Text>
        {status.author && <Text style={styles.author}>— {status.author}</Text>}
      </View>
      <Pressable style={styles.shareBtn} onPress={share}>
        <Text style={styles.shareText}>📤 {t('shareWhatsApp')}</Text>
      </Pressable>
      <Text style={styles.shareHint}>{t('shareHint')}</Text>
    </ScrollView>
  );
}

export function WallpapersScreen() {
  const { isPremium } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.wallGrid}>
        {WALLPAPERS.map((wp) => {
          const locked = wp.isPremium && !isPremium;
          return (
            <View key={wp.id} style={[styles.wallItem, { backgroundColor: wp.gradient[0] }]}>
              <View style={[styles.wallGradient, { backgroundColor: wp.gradient[1], opacity: 0.7 }]} />
              <Text style={styles.wallTitle}>{wp.title}</Text>
              {locked && <Text style={styles.wallLock}>🔒 VIP</Text>}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export function ScriptureListScreen() {
  const { navigate } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {SCRIPTURES.map((s) => (
        <Card key={s.id} onPress={() => navigate('scripture-detail', { id: s.id })}>
          <Text style={styles.scriptureTitle}>{s.title}</Text>
          <Text style={styles.scriptureCat}>{s.category.toUpperCase()}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function ScriptureDetailScreen() {
  const { nav, isPremium, navigate } = useApp();
  const scripture = nav.params?.id ? getScriptureById(nav.params.id) : undefined;
  if (!scripture) return <Text>Not found</Text>;
  if (scripture.isPremium && !isPremium) {
    return (
      <View style={styles.locked}>
        <Text>🔒 VIP Scripture</Text>
        <Pressable style={styles.upgrade} onPress={() => navigate('premium')}><Text style={styles.upgradeText}>Upgrade</Text></Pressable>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{scripture.title}</Text>
      <Text style={styles.excerpt}>{scripture.excerpt}</Text>
    </ScrollView>
  );
}

export function KnowledgeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {KNOWLEDGE_CARDS.map((k) => (
        <Card key={k.id}>
          <Text style={styles.knowledgeTitle}>💡 {k.title}</Text>
          <Text style={styles.knowledgeBody}>{k.content}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function FavoritesScreen() {
  const { favorites, navigate } = useApp();
  const items = favorites.map((id) => MANTRAS.find((m) => m.id === id)).filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {items.length === 0 ? (
        <Text style={styles.empty}>No favorites yet. Save mantras from the detail screen.</Text>
      ) : (
        items.map((m) => m && (
          <Card key={m.id} onPress={() => navigate('mantra-detail', { id: m.id })}>
            <Text style={styles.scriptureTitle}>{m.titleHindi}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

export function PremiumScreen() {
  const { setPremium, isPremium } = useApp();

  if (isPremium) {
    return (
      <View style={styles.premiumWrap}>
        <Text style={styles.premiumHero}>✓ You are a VIP Member</Text>
        <Text style={styles.premiumSub}>Thank you for supporting Sanatani Bhakti</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.premiumHero}>⭐ VIP Membership</Text>
      <Text style={styles.premiumSub}>Honest pricing — no hidden auto-pay tricks</Text>
      <Card><Text style={styles.benefit}>✓ Ad-free prayer mode</Text></Card>
      <Card><Text style={styles.benefit}>✓ All mantras, chalisa, scriptures</Text></Card>
      <Card><Text style={styles.benefit}>✓ Premium wallpapers</Text></Card>
      <Card><Text style={styles.benefit}>✓ Bhagwa verified tick</Text></Card>
      <Card><Text style={styles.benefit}>✓ All puja vidhi guides</Text></Card>
      <Pressable style={styles.planBtn} onPress={() => setPremium(true)}>
        <Text style={styles.planTitle}>Monthly — ₹99/mo</Text>
        <Text style={styles.planSub}>7-day free trial · Cancel anytime</Text>
      </Pressable>
      <Pressable style={[styles.planBtn, styles.planBest]} onPress={() => setPremium(true)}>
        <Text style={styles.planTitle}>Yearly — ₹699/yr</Text>
        <Text style={styles.planSub}>Save 41% · Best value</Text>
      </Pressable>
      <Text style={styles.note}>Play Store billing will be integrated before launch.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  rashiRow: { marginBottom: Spacing.md },
  rashiChip: { alignItems: 'center', padding: Spacing.sm, marginRight: Spacing.sm, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, minWidth: 64 },
  rashiActive: { borderColor: Colors.primary, backgroundColor: Colors.surfaceAlt },
  rashiSymbol: { fontSize: 20 },
  rashiName: { fontSize: FontSize.xs, color: Colors.text, marginTop: 2 },
  predictionCard: { backgroundColor: Colors.surfaceAlt },
  rashiTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.md },
  predHindi: { fontSize: FontSize.md, color: Colors.text, lineHeight: 24 },
  predEn: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm, fontStyle: 'italic' },
  luckyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  lucky: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  statusCard: { borderRadius: 20, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.lg },
  statusDeity: { fontSize: 48, marginBottom: Spacing.md },
  statusQuote: { fontSize: FontSize.xl, color: Colors.textLight, fontWeight: '700', textAlign: 'center', lineHeight: 32 },
  statusEn: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: Spacing.md, fontStyle: 'italic' },
  author: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.md },
  shareBtn: { backgroundColor: '#25D366', padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  shareText: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.md },
  shareHint: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: Spacing.sm },
  wallGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  wallItem: { width: '47%', aspectRatio: 0.6, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', padding: Spacing.sm },
  wallGradient: { ...StyleSheet.absoluteFill, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  wallTitle: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.sm, zIndex: 1 },
  wallLock: { color: Colors.accent, fontSize: FontSize.xs, zIndex: 1 },
  scriptureTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  scriptureCat: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 4, fontWeight: '600' },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.lg },
  excerpt: { fontSize: FontSize.md, color: Colors.text, lineHeight: 26 },
  knowledgeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  knowledgeBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.xl },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  upgrade: { marginTop: Spacing.lg, backgroundColor: Colors.premium, padding: Spacing.md, borderRadius: 10 },
  upgradeText: { color: Colors.textLight, fontWeight: '700' },
  premiumWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background, padding: Spacing.lg },
  premiumHero: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.premium, textAlign: 'center' },
  premiumSub: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
  benefit: { fontSize: FontSize.md, color: Colors.text },
  planBtn: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.sm },
  planBest: { borderColor: Colors.premium, backgroundColor: '#F3E5F5' },
  planTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  planSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  note: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.md },
});
