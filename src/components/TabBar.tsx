import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../i18n';
import { Colors, FontSize, Spacing } from '../constants/theme';
import type { TabId } from '../types';

const TABS: { id: TabId; labelKey: 'tabHome' | 'tabExplore' | 'tabJaap' | 'tabMandir' | 'tabProfile'; emoji: string }[] = [
  { id: 'home', labelKey: 'tabHome', emoji: '🏠' },
  { id: 'explore', labelKey: 'tabExplore', emoji: '📿' },
  { id: 'jaap', labelKey: 'tabJaap', emoji: '🔢' },
  { id: 'mandir', labelKey: 'tabMandir', emoji: '🛕' },
  { id: 'profile', labelKey: 'tabProfile', emoji: '👤' },
];

interface TabBarProps {
  active: TabId;
  onTab: (tab: TabId) => void;
}

export function TabBar({ active, onTab }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable key={tab.id} style={styles.tab} onPress={() => onTab(tab.id)}>
            <Text style={[styles.emoji, isActive && styles.activeEmoji]}>{tab.emoji}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{t(tab.labelKey)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  emoji: { fontSize: 22, opacity: 0.6 },
  activeEmoji: { opacity: 1 },
  label: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  activeLabel: { color: Colors.primary, fontWeight: '700' },
});
