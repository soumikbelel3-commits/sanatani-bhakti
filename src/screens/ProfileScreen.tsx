import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionTitle } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation, getLanguage } from '../i18n';
import { showPrivacyOptions } from '../ads/init';

export function ProfileScreen() {
  const {
    userName, punyaPoints, streak, jaapTotal, adsRemoved,
    favorites, navigate, setAdsRemoved, language,
  } = useApp();
  const { t } = useTranslation();
  const langInfo = getLanguage(language);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🙏</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.tagline}>{t('proudSanatani')}</Text>
        <Text style={styles.langBadge}>{langInfo.nativeName}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{punyaPoints}</Text>
          <Text style={styles.statLabel}>{t('punyaPoints')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>{t('dayStreak')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{jaapTotal}</Text>
          <Text style={styles.statLabel}>{t('totalJaaps')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{favorites.length}</Text>
          <Text style={styles.statLabel}>{t('favorites')}</Text>
        </View>
      </View>

      {!adsRemoved && (
        <Pressable style={styles.removeAdsCard} onPress={() => navigate('premium')}>
          <Text style={styles.removeAdsTitle}>🪷 {t('removeAds')}</Text>
          <Text style={styles.removeAdsSub}>{t('removeAdsSub')}</Text>
        </Pressable>
      )}

      {adsRemoved && (
        <Card style={styles.adFreeCard}>
          <Text style={styles.adFreeText}>✓ {t('alreadyAdFree')}</Text>
        </Card>
      )}

      <SectionTitle title={t('account')} />
      <Card onPress={() => navigate('language-settings')}>
        <Text style={styles.menuItem}>🌐 {t('changeLanguage')} — {langInfo.nativeName}</Text>
      </Card>
      <Card onPress={() => navigate('favorites')}>
        <Text style={styles.menuItem}>❤️ {t('myFavorites')} ({favorites.length})</Text>
      </Card>
      <Card onPress={() => navigate('premium')}>
        <Text style={styles.menuItem}>🪷 {t('removeAds')}</Text>
      </Card>

      {/* EEA/UK users must be able to change their ad-consent choice at any
          time, so this stays visible even after ads are removed. */}
      {!adsRemoved && (
        <Card onPress={() => void showPrivacyOptions()}>
          <Text style={styles.menuItem}>🔒 {t('privacyOptions')}</Text>
        </Card>
      )}

      <Text style={styles.freeNote}>{t('allContentFree')}</Text>

      {__DEV__ && (
        <Pressable style={styles.devBtn} onPress={() => setAdsRemoved(!adsRemoved)}>
          <Text style={styles.devText}>Toggle ad-free (Dev)</Text>
        </Pressable>
      )}

      <Text style={styles.version}>Sanatani Bhakti v1.0.0</Text>
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  profileHeader: { alignItems: 'center', marginBottom: Spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  avatarText: { fontSize: 36 },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  tagline: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  langBadge: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, backgroundColor: Colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statBox: { flex: 1, minWidth: '45%', backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statNum: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  removeAdsCard: { backgroundColor: Colors.premium, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg },
  removeAdsTitle: { color: Colors.textLight, fontSize: FontSize.lg, fontWeight: '800' },
  removeAdsSub: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, marginTop: 4 },
  adFreeCard: { backgroundColor: '#E8F5E9', marginBottom: Spacing.lg },
  adFreeText: { color: Colors.success, fontWeight: '700' },
  menuItem: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  freeNote: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
  devBtn: { marginTop: Spacing.lg, padding: Spacing.sm, alignItems: 'center' },
  devText: { color: Colors.textSecondary, fontSize: FontSize.xs },
  version: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: Spacing.lg },
});
