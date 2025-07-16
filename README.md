# Recording App Gen Z

A minimal Ionic + Capacitor demo that lets you **record voice clips**, store them locally and play/share/delete them – perfect as a starting point for your own Gen‑Z audio projects.

---

## 1. Features

* Start / pause / resume / stop audio recording  
* Saves each recording as `.m4a` under `recordings/` (Capacitor `Directory.Data`)  
* Playback with `@capacitor‑community/native‑audio`  
* Share and delete files  
* Fully typed service layer (see `recording.service.ts`, `audio‑play.ts`, `types.ts`)  

---

## 2. Prerequisites

| Tool | Version (tested) | Install |
|------|------------------|---------|
| **Node.js** | ≥ 18.x LTS | <https://nodejs.org> |
| **npm** | ≥ 9.x | comes with Node |
| **Ionic CLI** | ≥ 7.x | `npm i -g @ionic/cli` |
| **Capacitor CLI** | ≥ 6.x | `npm i -g @capacitor/cli` |
| **Android Studio** | Hedgehog 🐞 | <https://developer.android.com/studio> |

> 💡 On Windows make sure **USB debugging** is enabled or use the built‑in emulator (don’t forget to enable the **microphone** in the emulator’s settings).

---

## 3. Local Setup

```bash
# 1. Clone
git clone https://github.com/joergwaldvogel/Recording_app_Genz.git
cd Recording_app_Genz

# 2. Install JS deps
npm ci          # or: npm install

# 3. Copy example envs (optional)
cp .env.example .env   # edit as needed
```

---

## 4. Run & Develop

### Web (hot‑reload)

```bash
ionic serve
```

### Android

```bash
# build web assets
ionic build

# sync capacitor + open Android Studio
npx cap sync android
npx cap open android      # or: npx cap run android -l --external
```

*Inside Android Studio* hit **▶ Run**.  
For hot‑reload use *Live Reload*:

```bash
ionic cap run android -l --external
```

---

## 5. Release builds

```bash
ionic build
npx cap sync android
cd android
./gradlew assembleRelease   # generates app-release.apk
```

Sign & upload the APK/AAB via the Play Console as usual.

---

## 6. Git workflow

```bash
# add new files (e.g. README)
git add README.md

# commit changes
git commit -m "docs: add readme"

# pull remote changes in case someone else pushed
git pull --rebase origin main

# push to GitHub
git push origin main
```

---

## 7. Troubleshooting

| Issue | Fix |
|-------|-----|
| `error: failed to push some refs` | `git pull --rebase origin main` before pushing |
| No audio in emulator | Emulator > *Settings → Microphone* → enable |
| `MediaRecorder went away with unhandled events` | Make sure you call `stopRecording()` and release resources |
| `Audio Asset already exists` | Call `NativeAudio.unload()` after playback (already implemented) |

---

### License

MIT © 2025 Joerg Waldvogel
