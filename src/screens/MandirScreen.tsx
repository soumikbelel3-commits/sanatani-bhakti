import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';

export function MandirScreen() {
  const { mandirFlowers, mandirDiyas, offerFlower, lightDiya, addPunya } = useApp();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛕 {t('tabMandir')}</Text>
      <Text style={styles.subtitle}>Connect with the divine from anywhere</Text>

      <View style={styles.mandir}>
        <View style={styles.templeTop}>
          <Text style={styles.shikhara}>🔱</Text>
        </View>
        <View style={styles.garbha}>
          <Text style={styles.deity}>🕉️</Text>
          <Text style={styles.deityLabel}>Shiv Ling</Text>
          {mandirDiyas > 0 && (
            <View style={styles.diyaRow}>
              {Array.from({ length: Math.min(mandirDiyas, 5) }).map((_, i) => (
                <Text key={i} style={styles.diya}>🪔</Text>
              ))}
            </View>
          )}
          {mandirFlowers > 0 && (
            <View style={styles.flowerRow}>
              {Array.from({ length: Math.min(mandirFlowers, 8) }).map((_, i) => (
                <Text key={i} style={styles.flower}>🌺</Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.steps} />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={lightDiya}>
          <Text style={styles.actionEmoji}>🪔</Text>
          <Text style={styles.actionLabel}>{t('lightDiya')}</Text>
          <Text style={styles.actionSub}>+10 Punya</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={offerFlower}>
          <Text style={styles.actionEmoji}>🌺</Text>
          <Text style={styles.actionLabel}>{t('offerFlower')}</Text>
          <Text style={styles.actionSub}>+5 Punya</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => addPunya(15)}>
          <Text style={styles.actionEmoji}>🔔</Text>
          <Text style={styles.actionLabel}>{t('ringBell')}</Text>
          <Text style={styles.actionSub}>+15 Punya</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <Text style={styles.stat}>Diyas lit today: {mandirDiyas}</Text>
        <Text style={styles.stat}>Flowers offered: {mandirFlowers}</Text>
      </View>

      <Text style={styles.verse}>
        करचरण कृतं वाक् कायजं कर्मजं वा।{'\n'}
        श्रवणनयनजं वा मानसं वापराधम्।{'\n'}
        विहितं विहितं वा सर्वं श्रीमन नारायण।।
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A00', padding: Spacing.lg, alignItems: 'center' },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.mandirGlow },
  subtitle: { fontSize: FontSize.sm, color: 'rgba(255,183,77,0.8)', marginBottom: Spacing.lg },
  mandir: { alignItems: 'center', marginBottom: Spacing.xl },
  templeTop: { backgroundColor: '#FF6B00', paddingHorizontal: 40, paddingVertical: 12, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  shikhara: { fontSize: 32 },
  garbha: {
    backgroundColor: '#3E2723',
    width: 260,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.mandirGlow,
    minHeight: 200,
  },
  deity: { fontSize: 48 },
  deityLabel: { color: Colors.mandirGlow, fontSize: FontSize.sm, marginTop: Spacing.xs },
  diyaRow: { flexDirection: 'row', marginTop: Spacing.md, gap: 4 },
  diya: { fontSize: 24 },
  flowerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: Spacing.sm, gap: 2 },
  flower: { fontSize: 18 },
  steps: { width: 280, height: 20, backgroundColor: '#5D4037', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  actions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  actionBtn: {
    backgroundColor: 'rgba(255,107,0,0.2)',
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.mandirGlow,
    minWidth: 100,
  },
  actionEmoji: { fontSize: 28 },
  actionLabel: { color: Colors.mandirGlow, fontWeight: '700', fontSize: FontSize.sm, marginTop: 4 },
  actionSub: { color: 'rgba(255,183,77,0.7)', fontSize: FontSize.xs },
  stats: { marginBottom: Spacing.lg },
  stat: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm, textAlign: 'center' },
  verse: { color: 'rgba(255,183,77,0.6)', fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
});
