import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}

export function Card({ children, onPress, style }: CardProps) {
  const content = (
    <View style={[styles.card, style]}>{children}</View>
  );
  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function PunyaBadge() {
  const { punyaPoints, streak } = useApp();
  return (
    <View style={styles.punyaRow}>
      <View style={styles.punyaChip}>
        <Text style={styles.punyaEmoji}>🪷</Text>
        <Text style={styles.punyaText}>{punyaPoints} Punya</Text>
      </View>
      <View style={styles.punyaChip}>
        <Text style={styles.punyaEmoji}>🔥</Text>
        <Text style={styles.punyaText}>{streak} day streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionAction: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  punyaRow: { flexDirection: 'row', gap: Spacing.sm },
  punyaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  punyaEmoji: { fontSize: 14 },
  punyaText: { color: Colors.textLight, fontSize: FontSize.xs, fontWeight: '600' },
});
