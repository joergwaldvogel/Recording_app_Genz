# Recording App GENZ

A simple Ionic/Capacitor app for recording, listing, and playing back audio on Android.

---

## 1) Prerequisites

| Tool | Version (min) | Notes |
|------|---------------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | — | `git --version` |
| Android Studio | 2023+ | Includes Android SDK + Platform Tools (ADB) |
| Java JDK | 17 | Installed via Android Studio is fine |
| Ionic CLI (optional) | latest | `npm i -g @ionic/cli` |

> **Tip:** If you’ve never built Android before on this PC, open **Android Studio** once, install *Android SDK Platform* and *Android SDK Build-Tools*, and let Android Studio set the **ANDROID_HOME** environment variable automatically.

---

## 2) Clone & Install

```bash
git clone https://github.com/joergwaldvogel/Recording_app_Genz.git
cd Recording_app_Genz
npm install
optional (wenn Plugin nicht erkannt)
npm install @capawesome-team/capacitor-audio-recorder

```bash
Lizenzschlüssel einrichten für Audio-Recorder Plugin:
npm config set @capawesome-team:registry https://npm.registry.capawesome.io/
npm config set //npm.registry.capawesome.io/:_authToken <DEIN_LIZENZSCHLÜSSEL>
```

---

## 3) Run in the Browser (Dev Only)

```bash
npm run dev
```

Or, if the Ionic CLI is installed:

```bash
ionic serve
```

> This is just for UI development; microphone plugins won’t work in a plain browser.

---

## 4) Android: First-Time Setup

Add the Android platform and sync:

```bash
npm run build
npx cap add android   # only once
npx cap sync android
```

Open in Android Studio:

```bash
npx cap open android
```

In Android Studio:
- Select an **emulator** or **physical device** (please use Google Pixel 7)
- Click **Run ▶️**

---

## 5) Android: Daily Workflow

```bash
npm run build
npx cap sync android
npx cap open android
```

You can also run directly from the CLI:

```bash
npx cap run android
```

---

## 6) Permissions (Microphone & Notifications)

- **RECORD_AUDIO** is requested before recording.
- On Android 14+, if you use a foreground service for recording, also declare `FOREGROUND_SERVICE_MICROPHONE` in the manifest.
- Tap **Allow** when the app requests microphone access.

---

## 7) Where Recordings Are Stored

Default location (private app storage):

```
/data/user/0/<applicationId>/files/recordings/
```

List or pull files via `adb`:

```bash
adb devices
adb shell run-as <applicationId> ls files/recordings
adb shell run-as <applicationId> ls -l files/recordings

# Pull to PC:
adb shell run-as <applicationId> cat files/recordings/<filename> > /sdcard/Download/<filename>
adb pull /sdcard/Download/<filename> .
```

> Private storage isn’t visible in normal file explorers; `run-as` works in debug builds.

---
