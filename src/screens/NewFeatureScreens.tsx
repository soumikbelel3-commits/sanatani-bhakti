import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { STOTRAMS, getStotramById } from '../data/stotrams';
import { RINGTONES, getRingtoneById } from '../data/ringtones';
import { TEMPLES, getTempleById } from '../data/temples';
import { getTodayMuhurats } from '../data/muhurat';
import { getUpcomingFestivals } from '../data/daily';

export function StotramListScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>📜 {t('stotrams')}</Text>
      {STOTRAMS.map((s) => (
        <Card key={s.id} onPress={() => navigate('stotram-detail', { id: s.id })}>
          <View style={styles.row}>
            <Text style={styles.title}>{s.titleHindi}</Text>
            {s.isPremium && <Text style={styles.premium}>VIP</Text>}
          </View>
          <Text style={styles.sub}>{s.title}</Text>
          <Text style={styles.deity}>{DEITIES.find((d) => d.id === s.deity)?.emoji}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function StotramDetailScreen() {
  const { nav, isPremium, navigate } = useApp();
  const stotram = nav.params?.id ? getStotramById(nav.params.id) : undefined;

  if (!stotram) return <Text style={styles.notFound}>Not found</Text>;
  if (stotram.isPremium && !isPremium) {
    return (
      <View style={styles.locked}>
        <Text style={styles.lockedText}>🔒 VIP Stotram</Text>
        <Pressable style={styles.upgrade} onPress={() => navigate('premium')}>
          <Text style={styles.upgradeText}>Upgrade</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{stotram.titleHindi}</Text>
      <Text style={styles.subHeader}>{stotram.title}</Text>
      {stotram.verses.map((v, i) => (
        <Text key={i} style={styles.verse}>{v}</Text>
      ))}
      <Card style={styles.meaningCard}>
        <Text style={styles.meaningLabel}>Meaning</Text>
        <Text style={styles.meaning}>{stotram.meaning}</Text>
      </Card>
    </ScrollView>
  );
}

export function RingtoneListScreen() {
  const { navigate, addPunya } = useApp();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>🔔 {t('spiritualRingtones')}</Text>
      {RINGTONES.map((r) => (
        <Card key={r.id} onPress={() => navigate('ringtone-detail', { id: r.id })}>
          <View style={styles.row}>
            <Text style={styles.title}>{r.titleHindi}</Text>
            <Text style={styles.duration}>{r.duration}</Text>
          </View>
          <Text style={styles.sub}>{r.title}</Text>
          <Pressable
            style={styles.playBtn}
            onPress={() => addPunya(2)}
          >
            <Text style={styles.playText}>▶ {t('listen')}</Text>
          </Pressable>
        </Card>
      ))}
      <Text style={styles.note}>{t('comingSoon')}: MP3 playback via expo-av</Text>
    </ScrollView>
  );
}

export function RingtoneDetailScreen() {
  const { nav, isPremium, navigate, addPunya } = useApp();
  const { t } = useTranslation();
  const ringtone = nav.params?.id ? getRingtoneById(nav.params.id) : undefined;

  if (!ringtone) return <Text style={styles.notFound}>Not found</Text>;
  if (ringtone.isPremium && !isPremium) {
    return (
      <View style={styles.locked}>
        <Text style={styles.lockedText}>🔒 VIP Ringtone</Text>
        <Pressable style={styles.upgrade} onPress={() => navigate('premium')}>
          <Text style={styles.upgradeText}>Upgrade</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.ringHero}>
        <Text style={styles.ringEmoji}>{DEITIES.find((d) => d.id === ringtone.deity)?.emoji}</Text>
        <Text style={styles.header}>{ringtone.titleHindi}</Text>
        <Text style={styles.subHeader}>{ringtone.title} · {ringtone.duration}</Text>
      </View>
      <Text style={styles.desc}>{ringtone.description}</Text>
      <Pressable style={styles.playBtnLarge} onPress={() => addPunya(3)}>
        <Text style={styles.playTextLarge}>▶ {t('listen')}</Text>
      </Pressable>
      <Pressable style={styles.setBtn} onPress={() => addPunya(5)}>
        <Text style={styles.setText}>📱 {t('setRingtone')}</Text>
      </Pressable>
    </ScrollView>
  );
}

export function TempleListScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>🛕 {t('famousTemples')}</Text>
      {TEMPLES.map((tm) => (
        <Card key={tm.id} onPress={() => navigate('temple-detail', { id: tm.id })}>
          <View style={styles.row}>
            <Text style={styles.templeEmoji}>{tm.emoji}</Text>
            <View style={styles.templeInfo}>
              <Text style={styles.title}>{tm.nameHindi}</Text>
              <Text style={styles.sub}>{tm.city}, {tm.state}</Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

export function TempleDetailScreen() {
  const { nav } = useApp();
  const temple = nav.params?.id ? getTempleById(nav.params.id) : undefined;

  if (!temple) return <Text style={styles.notFound}>Not found</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.templeHero}>{temple.emoji}</Text>
      <Text style={styles.header}>{temple.nameHindi}</Text>
      <Text style={styles.subHeader}>{temple.name}</Text>
      <Card>
        <Text style={styles.label}>📍 {temple.city}, {temple.state}</Text>
        <Text style={styles.label}>🕐 {temple.timings}</Text>
        <Text style={styles.significance}>{temple.significance}</Text>
      </Card>
    </ScrollView>
  );
}

export function MuhuratScreen() {
  const { t, language } = useTranslation();
  const muhurats = getTodayMuhurats();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>⏰ {t('auspiciousTime')}</Text>
      {muhurats.map((m) => (
        <Card key={m.id} style={m.avoid ? styles.avoidCard : styles.goodCard}>
          <Text style={[styles.muhuratName, m.avoid && styles.avoidText]}>
            {language === 'hi' ? m.nameHindi : m.name}
          </Text>
          <Text style={styles.muhuratTime}>{m.time}</Text>
          <Text style={styles.muhuratGood}>
            {m.avoid ? t('avoid') : t('goodFor')}: {language === 'hi' ? m.goodForHindi : m.goodFor}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function FestivalHubScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();
  const festivals = getUpcomingFestivals();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>🎉 {t('festivalHub')}</Text>
      {festivals.map((f) => {
        const deity = DEITIES.find((d) => d.id === f.deity);
        return (
          <Card key={f.id}>
            <Text style={styles.festivalEmoji}>{deity?.emoji}</Text>
            <Text style={styles.title}>{f.name}</Text>
            <Text style={styles.sub}>{f.date}</Text>
            <Text style={styles.desc}>{f.description}</Text>
            <Pressable style={styles.pujaBtn} onPress={() => navigate('puja-list')}>
              <Text style={styles.pujaBtnText}>🙏 {t('viewPuja')}</Text>
            </Pressable>
          </Card>
        );
      })}
      <Text style={styles.note}>Festival packs: wallpapers, aartis, special mantras — updated seasonally</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  pageHint: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  deity: { fontSize: 20, marginTop: Spacing.xs },
  premium: { fontSize: FontSize.xs, color: Colors.premium, fontWeight: '800' },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.xs },
  subHeader: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg },
  verse: { fontSize: FontSize.md, color: Colors.text, lineHeight: 28, marginBottom: Spacing.sm, textAlign: 'center' },
  meaningCard: { backgroundColor: Colors.surfaceAlt, marginTop: Spacing.md },
  meaningLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.xs },
  meaning: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 22 },
  duration: { fontSize: FontSize.sm, color: Colors.textSecondary },
  playBtn: { marginTop: Spacing.sm, backgroundColor: Colors.primary, paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: 8, alignSelf: 'flex-start' },
  playText: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.sm },
  playBtnLarge: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, alignItems: 'center', marginTop: Spacing.lg },
  playTextLarge: { color: Colors.textLight, fontWeight: '800', fontSize: FontSize.lg },
  setBtn: { marginTop: Spacing.sm, padding: Spacing.md, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: Colors.primary },
  setText: { color: Colors.primary, fontWeight: '700' },
  ringHero: { alignItems: 'center', marginBottom: Spacing.lg },
  ringEmoji: { fontSize: 56 },
  desc: { fontSize: FontSize.md, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  templeEmoji: { fontSize: 32, marginRight: Spacing.md },
  templeInfo: { flex: 1 },
  templeHero: { fontSize: 64, textAlign: 'center', marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.text, marginBottom: Spacing.xs },
  significance: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22, marginTop: Spacing.sm },
  muhuratName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.success },
  muhuratTime: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginVertical: Spacing.xs },
  muhuratGood: { fontSize: FontSize.sm, color: Colors.textSecondary },
  goodCard: { borderLeftWidth: 4, borderLeftColor: Colors.success },
  avoidCard: { borderLeftWidth: 4, borderLeftColor: '#C62828', backgroundColor: '#FFEBEE' },
  avoidText: { color: '#C62828' },
  festivalEmoji: { fontSize: 32, marginBottom: Spacing.xs },
  pujaBtn: { marginTop: Spacing.md, backgroundColor: Colors.primary, padding: Spacing.sm, borderRadius: 10, alignItems: 'center' },
  pujaBtnText: { color: Colors.textLight, fontWeight: '700' },
  note: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
  notFound: { padding: Spacing.lg, textAlign: 'center' },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  lockedText: { fontSize: FontSize.lg },
  upgrade: { marginTop: Spacing.lg, backgroundColor: Colors.premium, padding: Spacing.md, borderRadius: 10 },
  upgradeText: { color: Colors.textLight, fontWeight: '700' },
});
