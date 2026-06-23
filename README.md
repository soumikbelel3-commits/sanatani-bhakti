# Sanatani Bhakti — Hindu Devotional App

All-in-one Sanatan Dharma app inspired by [Sanatan App analysis](../playstore%20app/02-sanatan-app-inspiration-analysis.md).

## Run the app

### Option 1 — Browser (recommended on Windows)

No Android SDK or phone needed:

```bash
cd sanatani_app
npm install
npm run dev
```

Then open **http://localhost:8082** in your browser.

### Option 2 — Static preview (if dev server has issues)

```bash
npm run build:web
npm run preview
```

Open **http://localhost:3000**

### Option 3 — Phone via Expo Go

```bash
npm start
```

Scan the QR code with **Expo Go** (same Wi‑Fi as your PC).  
Do **not** press `a` (Android) unless Android Studio is installed.

### Why Android emulator failed

Your PC does not have Android SDK installed (`ANDROID_HOME` missing). Use **browser** or **Expo Go on phone** instead.

## Features

| Module | Status |
|--------|--------|
| **Multi-language** | 11 Indian languages — picker on first open (Hindi, English, Tamil, Telugu, Marathi, Gujarati, Bengali, Kannada, Malayalam, Punjabi, Odia) |
| **Home** | Daily panchang, status, mantra of the day, festivals, quick access |
| **Mantras** | 12 mantras with Sanskrit, meaning, benefits |
| **Aarti** | 10 aartis with full lyrics |
| **Chalisa** | Hanuman + more (VIP for some) |
| **Bhajans** | 8 bhajans |
| **Stotrams** | Shiv Tandav, Mahishasura Mardini, Vishnu Sahasranama + more |
| **Jaap Counter** | 108 / 1008 with haptic feedback |
| **Virtual Mandir** | Light diya, offer flowers, ring bell |
| **Puja Vidhi** | 5 step-by-step guides with samagri checklist |
| **Rashifal** | All 12 rashis |
| **Muhurat** | Brahma, Abhijit, Godhuli, Rahu Kaal timings |
| **Daily Status** | Shareable devotional quotes |
| **Wallpapers** | 20 deity gradient wallpapers |
| **Ringtones** | 8 spiritual ringtones (Om, temple bell, Gayatri, etc.) |
| **Famous Temples** | 10 pilgrimage sites with timings & significance |
| **Festival Hub** | Upcoming festivals with puja links |
| **Scriptures** | Gita, Sunderkand, stotras |
| **Knowledge** | Divine facts cards |
| **Punya Points** | Gamification + streaks |
| **VIP / Premium** | Honest freemium (Play Billing ready) |

## Project structure

```
sanatani_app/
├── App.tsx
├── src/
│   ├── constants/theme.ts
│   ├── i18n/              # 11 Indian languages
│   ├── data/
│   ├── context/
│   ├── components/
│   ├── screens/
│   └── navigation/
└── assets/
```

## Next steps for Play Store

1. **Audio** — Add MP3 files to `assets/audio/` and wire `expo-av`
2. **Images** — Replace gradient wallpapers with HD deity images
3. **Billing** — Integrate Google Play Billing
4. **Persistence** — Language & settings saved via localStorage (web) / AsyncStorage (mobile)
5. **APK build** — `npx eas build --platform android`

---

*Jai Shree Ram 🙏*
