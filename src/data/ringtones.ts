import type { DeityId } from '../constants/theme';

export interface Ringtone {
  id: string;
  title: string;
  titleHindi: string;
  deity: DeityId;
  duration: string;
  description: string;
  isPremium?: boolean;
}

export const RINGTONES: Ringtone[] = [
  {
    id: 'om-chant',
    title: 'Om Chanting',
    titleHindi: 'ॐ जाप',
    deity: 'vishnu',
    duration: '0:30',
    description: 'Sacred Om vibration for morning alarm',
  },
  {
    id: 'temple-bell',
    title: 'Temple Bell',
    titleHindi: 'मंदिर की घंटी',
    deity: 'shiv',
    duration: '0:15',
    description: 'Traditional mandir ghanti sound',
  },
  {
    id: 'hanuman-chalisa-hook',
    title: 'Hanuman Chalisa',
    titleHindi: 'हनुमान चालीसा',
    deity: 'hanuman',
    duration: '0:45',
    description: 'Opening doha of Hanuman Chalisa',
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    titleHindi: 'गायत्री मंत्र',
    deity: 'vishnu',
    duration: '0:40',
    description: 'Morning Gayatri for spiritual start',
  },
  {
    id: 'shiv-tandav',
    title: 'Shiv Tandav',
    titleHindi: 'शिव तांडव',
    deity: 'shiv',
    duration: '1:00',
    description: 'Powerful Shiv Tandav opening',
    isPremium: true,
  },
  {
    id: 'krishna-flute',
    title: 'Krishna Flute',
    titleHindi: 'कृष्ण की बांसुरी',
    deity: 'krishna',
    duration: '0:50',
    description: 'Melodious bansuri of Lord Krishna',
  },
  {
    id: 'aarti-bell',
    title: 'Aarti Bell',
    titleHindi: 'आरती की घंटी',
    deity: 'ganesh',
    duration: '0:20',
    description: 'Evening aarti bell melody',
  },
  {
    id: 'ram-dhun',
    title: 'Ram Dhun',
    titleHindi: 'राम धुन',
    deity: 'ram',
    duration: '0:35',
    description: 'Jai Shree Ram devotional tune',
  },
];

export function getRingtoneById(id: string): Ringtone | undefined {
  return RINGTONES.find((r) => r.id === id);
}
