import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, showBack, right }: HeaderProps) {
  const { goBack } = useApp();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ?? <View style={styles.backPlaceholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.primary,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: { width: 40 },
  backText: { color: Colors.textLight, fontSize: FontSize.xl },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { color: Colors.textLight, fontSize: FontSize.lg, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, marginTop: 2 },
});
