import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import { Card } from '../components/Card';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { useRemoveAds } from '../hooks/useRemoveAds';
import { saveImageToGallery, setAsWallpaper } from '../services/media';
import { getTodayStatus } from '../data/daily';
import { RASHIS, getRashifalForDay } from '../data/rashifal';
import { SCRIPTURES, getScriptureById } from '../data/scriptures';
import { WALLPAPERS } from '../data/wallpapers';
import { KNOWLEDGE_CARDS } from '../data/daily';
import { MANTRAS } from '../data/mantras';
import type { Wallpaper } from '../types';

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

  const share = async () => {
    try {
      const result = await Share.share({
        message: `${status.quoteHindi}\n\n${status.quote}${status.author ? `\n— ${status.author}` : ''}\n\n🕉️ ${t('appName')}`,
      });
      // Only reward an actual share — dismissing the sheet should not earn punya.
      if (result.action === Share.sharedAction) addPunya(5);
    } catch {
      // User backed out of the share sheet; nothing to report.
    }
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
        <Text style={styles.shareText}>📤 {t('shareStatus')}</Text>
      </Pressable>
      <Text style={styles.shareHint}>{t('shareHint')}</Text>
    </ScrollView>
  );
}

export function WallpapersScreen() {
  const { addPunya } = useApp();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [staged, setStaged] = useState<Wallpaper | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<View>(null);

  // Capturing the on-screen thumbnail would produce a ~160px image, useless as
  // a wallpaper. Instead a full-screen copy is rendered off-screen and captured
  // at native resolution.
  useEffect(() => {
    if (!staged) return;
    let cancelled = false;

    (async () => {
      setBusy(true);
      // Give the off-screen canvas a frame to lay out before capturing it.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      try {
        const fileUri = await captureRef(canvasRef, {
          format: 'jpg',
          quality: 0.95,
          result: 'tmpfile',
          fileName: staged.id,
        });
        const saved = await saveImageToGallery(fileUri);
        if (cancelled) return;

        if (!saved.ok) {
          Alert.alert(
            t('saveFailed'),
            saved.reason === 'permission'
              ? 'Gallery permission is needed to save wallpapers.'
              : 'Please try again.',
          );
          return;
        }

        addPunya(5);
        Alert.alert(t('savedToGallery'), undefined, [
          { text: 'OK', style: 'cancel' },
          { text: t('setAsWallpaper'), onPress: () => void setAsWallpaper(saved.contentUri) },
        ]);
      } catch {
        if (!cancelled) Alert.alert(t('saveFailed'));
      } finally {
        if (!cancelled) {
          setBusy(false);
          setStaged(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [staged, addPunya, t]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.wallHint}>{t('saveToGallery')}</Text>
        <View style={styles.wallGrid}>
          {WALLPAPERS.map((wp) => (
            <Pressable
              key={wp.id}
              style={styles.wallItem}
              onPress={() => !busy && setStaged(wp)}
            >
              <LinearGradient
                colors={wp.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.wallTitle}>{wp.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {busy && (
        <View style={styles.busyOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {/* Off-screen full-resolution canvas. `collapsable={false}` is required or
          Android optimises the view away and the capture comes back blank. */}
      {staged && (
        <View
          ref={canvasRef}
          collapsable={false}
          style={[styles.captureCanvas, { width, height }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={staged.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.captureDeity}>
            {DEITIES.find((d) => d.id === staged.deity)?.emoji}
          </Text>
          <Text style={styles.captureTitle}>{staged.title}</Text>
        </View>
      )}
    </View>
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
  const { nav } = useApp();
  const scripture = nav.params?.id ? getScriptureById(nav.params.id) : undefined;
  if (!scripture) return <Text>Not found</Text>;
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

/**
 * The app's only purchase screen.
 *
 * Every price shown here comes from Google Play via `useRemoveAds()`. Nothing
 * is hardcoded: displaying a price the store did not give us, or granting the
 * entitlement without a real transaction, is what Play's Payments policy
 * prohibits.
 */
export function PremiumScreen() {
  const { adsRemoved } = useApp();
  const { t } = useTranslation();
  const { price, availability, busy, error, buy, restore } = useRemoveAds();

  if (adsRemoved) {
    return (
      <View style={styles.premiumWrap}>
        <Text style={styles.premiumHero}>✓ {t('alreadyAdFree')}</Text>
        <Text style={styles.premiumSub}>{t('purchaseThanks')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.premiumHero}>🪷 {t('removeAds')}</Text>
      <Text style={styles.premiumSub}>{t('removeAdsSub')}</Text>

      <Card style={styles.freeNote}>
        <Text style={styles.freeNoteText}>{t('allContentFree')}</Text>
      </Card>

      <Card><Text style={styles.benefit}>✓ {t('adFree')}</Text></Card>
      <Card><Text style={styles.benefit}>✓ {t('supportApp')}</Text></Card>

      {availability === 'checking' && (
        <ActivityIndicator style={styles.spacer} color={Colors.primary} />
      )}

      {availability === 'unavailable' && (
        <Text style={styles.note}>{t('unavailable')}</Text>
      )}

      {availability === 'available' && (
        <Pressable style={styles.buyBtn} onPress={buy} disabled={busy}>
          {busy
            ? <ActivityIndicator color={Colors.textLight} />
            : <Text style={styles.buyText}>{t('removeAdsCta')}{price ? ` — ${price}` : ''}</Text>}
        </Pressable>
      )}

      <Pressable style={styles.restoreBtn} onPress={restore} disabled={busy}>
        <Text style={styles.restoreText}>{t('restorePurchase')}</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}
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
  shareBtn: { backgroundColor: Colors.success, padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  shareText: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.md },
  shareHint: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: Spacing.sm },
  wallHint: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, textAlign: 'center' },
  wallGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'space-between' },
  wallItem: { width: '47%', aspectRatio: 0.6, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', padding: Spacing.sm },
  wallTitle: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.sm },
  busyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  // Positioned far off-screen so it is laid out and rendered, but never visible.
  captureCanvas: { position: 'absolute', left: -10000, top: 0, alignItems: 'center', justifyContent: 'center' },
  captureDeity: { fontSize: 120 },
  captureTitle: { color: Colors.textLight, fontSize: 36, fontWeight: '800', marginTop: Spacing.lg, textAlign: 'center' },
  scriptureTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  scriptureCat: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 4, fontWeight: '600' },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.lg },
  excerpt: { fontSize: FontSize.md, color: Colors.text, lineHeight: 26 },
  knowledgeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  knowledgeBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.xl },
  premiumWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background, padding: Spacing.lg },
  premiumHero: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.premium, textAlign: 'center' },
  premiumSub: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
  freeNote: { backgroundColor: '#E8F5E9', borderColor: Colors.success },
  freeNoteText: { color: Colors.success, fontWeight: '700', fontSize: FontSize.sm },
  benefit: { fontSize: FontSize.md, color: Colors.text },
  spacer: { marginTop: Spacing.lg },
  buyBtn: { marginTop: Spacing.lg, backgroundColor: Colors.premium, padding: Spacing.md, borderRadius: 14, alignItems: 'center' },
  buyText: { color: Colors.textLight, fontWeight: '800', fontSize: FontSize.lg },
  restoreBtn: { marginTop: Spacing.md, padding: Spacing.sm, alignItems: 'center' },
  restoreText: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.sm },
  error: { color: '#C62828', fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.sm },
  note: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
});
