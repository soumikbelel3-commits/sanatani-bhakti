import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../i18n';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { HAS_RINGTONES } from '../data/ringtones';
import type { ScreenName } from '../types';

const QUICK_ACTIONS: { id: ScreenName; labelKey: 'mantras' | 'aarti' | 'chalisa' | 'bhajan' | 'pujaVidhi' | 'rashifal' | 'dailyStatus' | 'wallpapers' | 'scriptures' | 'knowledge' | 'stotrams' | 'ringtones' | 'temples' | 'festivalHub' | 'muhurat'; emoji: string; color: string }[] = [
  { id: 'explore', labelKey: 'mantras', emoji: '📿', color: '#FF6B00' },
  { id: 'aarti-list', labelKey: 'aarti', emoji: '🪔', color: '#E65100' },
  { id: 'chalisa-list', labelKey: 'chalisa', emoji: '📜', color: '#BF360C' },
  { id: 'bhajan-list', labelKey: 'bhajan', emoji: '🎵', color: '#F57C00' },
  { id: 'stotram-list', labelKey: 'stotrams', emoji: '📖', color: '#AD1457' },
  { id: 'puja-list', labelKey: 'pujaVidhi', emoji: '🙏', color: '#6A1B9A' },
  { id: 'rashifal', labelKey: 'rashifal', emoji: '✨', color: '#1565C0' },
  { id: 'muhurat', labelKey: 'muhurat', emoji: '⏰', color: '#00695C' },
  { id: 'daily-status', labelKey: 'dailyStatus', emoji: '💬', color: '#2E7D32' },
  { id: 'wallpapers', labelKey: 'wallpapers', emoji: '🖼️', color: '#00838F' },
  { id: 'ringtone-list', labelKey: 'ringtones', emoji: '🔔', color: '#4527A0' },
  { id: 'temple-list', labelKey: 'temples', emoji: '🛕', color: '#BF360C' },
  { id: 'festival-hub', labelKey: 'festivalHub', emoji: '🎉', color: '#E65100' },
  { id: 'scripture-list', labelKey: 'scriptures', emoji: '📚', color: '#4A148C' },
  { id: 'knowledge', labelKey: 'knowledge', emoji: '💡', color: '#F9A825' },
];

interface QuickActionGridProps {
  onNavigate: (screen: ScreenName) => void;
}

export function QuickActionGrid({ onNavigate }: QuickActionGridProps) {
  const { t } = useTranslation();

  // Ringtones only appear once at least one MP3 actually ships — see
  // assets/audio/README.md.
  const actions = QUICK_ACTIONS.filter(
    (item) => item.id !== 'ringtone-list' || HAS_RINGTONES,
  );

  return (
    <View style={styles.grid}>
      {actions.map((item) => (
        <Pressable
          key={item.id}
          style={[styles.item, { borderColor: item.color + '40' }]}
          onPress={() => onNavigate(item.id)}
        >
          <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <Text style={styles.label}>{t(item.labelKey)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

interface DeityScrollerProps {
  onSelect: (deityId: string) => void;
}

export function DeityScroller({ onSelect }: DeityScrollerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
      {DEITIES.map((d) => (
        <Pressable key={d.id} style={styles.deityItem} onPress={() => onSelect(d.id)}>
          <View style={[styles.deityCircle, { backgroundColor: d.color + '30', borderColor: d.color }]}>
            <Text style={styles.deityEmoji}>{d.emoji}</Text>
          </View>
          <Text style={styles.deityName}>{d.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  item: {
    width: '18%',
    minWidth: 62,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  scroller: { marginHorizontal: -Spacing.md },
  deityItem: { alignItems: 'center', marginRight: Spacing.md, marginLeft: Spacing.xs },
  deityCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 4,
  },
  deityEmoji: { fontSize: 24 },
  deityName: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
});
