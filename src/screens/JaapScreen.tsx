import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { vibrate } from '../utils/vibrate';

const TARGETS = [108, 1008];

export function JaapScreen() {
  const { addJaap, jaapTotal } = useApp();
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [completed, setCompleted] = useState(false);

  const increment = () => {
    if (completed) return;
    vibrate(30);
    const next = count + 1;
    setCount(next);
    if (next >= target) {
      setCompleted(true);
      addJaap(target);
      vibrate([0, 100, 50, 100]);
    }
  };

  const reset = () => {
    setCount(0);
    setCompleted(false);
  };

  const progress = Math.min(count / target, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📿 {t('jaapCounter')}</Text>
      <Text style={styles.subtitle}>{t('totalJaaps')}: {jaapTotal.toLocaleString()}</Text>

      <View style={styles.targetRow}>
        {TARGETS.map((t) => (
          <Pressable
            key={t}
            style={[styles.targetBtn, target === t && styles.targetActive]}
            onPress={() => { setTarget(t); reset(); }}
          >
            <Text style={[styles.targetText, target === t && styles.targetTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.circle} onPress={increment}>
        <View style={[styles.progressRing, { borderColor: completed ? Colors.success : Colors.primary, opacity: 0.3 + progress * 0.7 }]} />
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.targetLabel}>/ {target}</Text>
        {completed && <Text style={styles.done}>🙏 {t('complete')}</Text>}
      </Pressable>

      <Text style={styles.hint}>Tap the circle for each jaap</Text>

      <View style={styles.actions}>
        <Pressable style={styles.secondaryBtn} onPress={reset}>
          <Text style={styles.secondaryText}>{t('reset')}</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={() => { addJaap(count); reset(); }}>
          <Text style={styles.primaryText}>Save & Earn Punya</Text>
        </Pressable>
      </View>

      <View style={styles.mantraBox}>
        <Text style={styles.mantraLabel}>Suggested Mantra</Text>
        <Text style={styles.mantra}>ॐ नमः शिवाय</Text>
        <Text style={styles.mantraTrans}>Om Namah Shivaya</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg, alignItems: 'center' },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.lg },
  targetRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  targetBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: 20, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.surface },
  targetActive: { borderColor: Colors.primary, backgroundColor: Colors.surfaceAlt },
  targetText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textSecondary },
  targetTextActive: { color: Colors.primary },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  progressRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 6 },
  count: { fontSize: 56, fontWeight: '800', color: Colors.primary },
  targetLabel: { fontSize: FontSize.lg, color: Colors.textSecondary },
  done: { fontSize: FontSize.md, color: Colors.success, fontWeight: '700', marginTop: 4 },
  hint: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  actions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  secondaryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
  secondaryText: { color: Colors.textSecondary, fontWeight: '600' },
  primaryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: 10, backgroundColor: Colors.primary },
  primaryText: { color: Colors.textLight, fontWeight: '700' },
  mantraBox: { backgroundColor: Colors.surfaceAlt, padding: Spacing.lg, borderRadius: 16, alignItems: 'center', width: '100%' },
  mantraLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  mantra: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.secondary, marginTop: Spacing.xs },
  mantraTrans: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
});
