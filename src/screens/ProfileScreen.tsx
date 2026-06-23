import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionTitle } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation, getLanguage } from '../i18n';

export function ProfileScreen() {
  const {
    userName, punyaPoints, streak, jaapTotal, isPremium,
    favorites, navigate, setPremium, language,
  } = useApp();
  const { t } = useTranslation();
  const langInfo = getLanguage(language);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🙏</Text>
          {isPremium && <Text style={styles.badge}>✓ Bhagwa</Text>}
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

      {!isPremium && (
        <Pressable style={styles.premiumCard} onPress={() => navigate('premium')}>
          <Text style={styles.premiumTitle}>⭐ {t('upgradeVip')}</Text>
          <Text style={styles.premiumSub}>{t('adFree')} · {t('fullLibrary')} · {t('bhagwaTick')}</Text>
          <Text style={styles.premiumPrice}>₹99/month · ₹699/year</Text>
        </Pressable>
      )}

      {isPremium && (
        <Card style={styles.vipCard}>
          <Text style={styles.vipText}>✓ {t('vipMember')} — Thank you for your support!</Text>
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
        <Text style={styles.menuItem}>⭐ VIP Membership</Text>
      </Card>

      <SectionTitle title={t('vipBenefits')} />
      <Card><Text style={styles.benefit}>🪷 {t('adFree')}</Text></Card>
      <Card><Text style={styles.benefit}>📿 {t('fullLibrary')}</Text></Card>
      <Card><Text style={styles.benefit}>✓ {t('bhagwaTick')}</Text></Card>
      <Card><Text style={styles.benefit}>🛍️ {t('storeDiscount')}</Text></Card>

      {__DEV__ && (
        <Pressable style={styles.devBtn} onPress={() => setPremium(!isPremium)}>
          <Text style={styles.devText}>Toggle Premium (Dev)</Text>
        </Pressable>
      )}

      <Text style={styles.version}>Sanatani Bhakti v1.1.0</Text>
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
  badge: { position: 'absolute', bottom: -4, backgroundColor: Colors.accent, fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, color: Colors.secondary, overflow: 'hidden' },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  tagline: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  langBadge: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, backgroundColor: Colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statBox: { flex: 1, minWidth: '45%', backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statNum: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  premiumCard: { backgroundColor: Colors.premium, borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.lg },
  premiumTitle: { color: Colors.textLight, fontSize: FontSize.lg, fontWeight: '800' },
  premiumSub: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, marginTop: 4 },
  premiumPrice: { color: Colors.accent, fontSize: FontSize.md, fontWeight: '700', marginTop: Spacing.sm },
  vipCard: { backgroundColor: '#E8F5E9', marginBottom: Spacing.lg },
  vipText: { color: Colors.success, fontWeight: '700' },
  menuItem: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  benefit: { fontSize: FontSize.sm, color: Colors.text },
  devBtn: { marginTop: Spacing.lg, padding: Spacing.sm, alignItems: 'center' },
  devText: { color: Colors.textSecondary, fontSize: FontSize.xs },
  version: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: Spacing.lg },
});
