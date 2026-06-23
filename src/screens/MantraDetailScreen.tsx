import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getMantraById } from '../data/mantras';

export function MantraDetailScreen() {
  const { nav, favorites, toggleFavorite, addPunya, isPremium, navigate } = useApp();
  const id = nav.params?.id;
  const mantra = id ? getMantraById(id) : undefined;
  const [playing, setPlaying] = useState(false);

  if (!mantra) {
    return <View style={styles.center}><Text>Mantra not found</Text></View>;
  }

  if (mantra.isPremium && !isPremium) {
    return (
      <View style={styles.center}>
        <Text style={styles.lock}>🔒 Premium Content</Text>
        <Text style={styles.lockSub}>{mantra.title} is available for VIP members</Text>
        <Pressable style={styles.upgradeBtn} onPress={() => navigate('premium')}>
          <Text style={styles.upgradeText}>Upgrade to VIP</Text>
        </Pressable>
      </View>
    );
  }

  const isFav = favorites.includes(mantra.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{mantra.titleHindi}</Text>
      <Text style={styles.subtitle}>{mantra.title}</Text>

      <Card style={styles.sanskritCard}>
        <Text style={styles.sanskrit}>{mantra.sanskrit}</Text>
        <Text style={styles.translit}>{mantra.transliteration}</Text>
      </Card>

      <Text style={styles.section}>Meaning (Hindi)</Text>
      <Text style={styles.body}>{mantra.meaningHindi}</Text>
      <Text style={styles.section}>Meaning (English)</Text>
      <Text style={styles.body}>{mantra.meaning}</Text>
      <Text style={styles.section}>Benefits</Text>
      <Text style={styles.body}>{mantra.benefits}</Text>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, playing && styles.btnActive]}
          onPress={() => { setPlaying(!playing); addPunya(2); }}
        >
          <Text style={styles.btnText}>{playing ? '⏸ Pause' : '▶ Play Audio'}</Text>
        </Pressable>
        <Pressable style={styles.btnOutline} onPress={() => navigate('jaap')}>
          <Text style={styles.btnOutlineText}>📿 108 Jaap</Text>
        </Pressable>
        <Pressable style={styles.btnOutline} onPress={() => { toggleFavorite(mantra.id); addPunya(1); }}>
          <Text style={styles.btnOutlineText}>{isFav ? '❤️ Saved' : '🤍 Save'}</Text>
        </Pressable>
      </View>

      {playing && (
        <Text style={styles.audioNote}>Audio playback ready — add MP3 to assets/audio/{mantra.id}.mp3</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.secondary, textAlign: 'center' },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg },
  sanskritCard: { backgroundColor: Colors.surfaceAlt },
  sanskrit: { fontSize: FontSize.lg, color: Colors.text, lineHeight: 30, textAlign: 'center' },
  translit: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.md, textAlign: 'center', fontStyle: 'italic' },
  section: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary, marginTop: Spacing.lg, marginBottom: Spacing.xs },
  body: { fontSize: FontSize.md, color: Colors.text, lineHeight: 24 },
  actions: { marginTop: Spacing.xl, gap: Spacing.sm },
  btn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  btnActive: { backgroundColor: Colors.primaryDark },
  btnText: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.md },
  btnOutline: { borderWidth: 2, borderColor: Colors.primary, padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  btnOutlineText: { color: Colors.primary, fontWeight: '700' },
  audioNote: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.md },
  lock: { fontSize: FontSize.xl, fontWeight: '800' },
  lockSub: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.sm, textAlign: 'center' },
  upgradeBtn: { marginTop: Spacing.lg, backgroundColor: Colors.premium, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: 12 },
  upgradeText: { color: Colors.textLight, fontWeight: '700' },
});
