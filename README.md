Recording App GENZ

A simple Ionic/Capacitor app for recording, listing, and playing back audio on Android.

1) Prerequisites
Tool	Version (min)	Notes
Node.js	18+	node -v
npm	9+	npm -v
Git	—	git --version
Android Studio	2023+	Includes Android SDK + Platform Tools (ADB)
Java JDK	17	Installed via Android Studio is fine
Ionic CLI (optional)	latest	npm i -g @ionic/cli

If you’ve never built Android before on this PC, open Android Studio once, install Android SDK Platform, Android SDK Build-Tools, and let Android Studio set ANDROID_HOME automatically.

2) Clone & install
git clone https://github.com/joergwaldvogel/Recording_app_Genz.git
cd Recording_app_Genz
npm install

3) Run in the browser (dev only)
npm run dev
# or (if Ionic CLI is installed)
ionic serve


This is just for UI development; microphone plugins don’t work in a plain browser.

4) Android: first-time setup

Add Android platform and sync:

npx cap add android      # only once
npx cap sync android


Open in Android Studio:
npx cap open android


5) Android: daily workflow
npm run build
npx cap sync android
npx cap open android
npx cap run android

Select an emulator or a physical device.

Click Run ▶️.

6) Permissions (Microphone & Notifications)

RECORD_AUDIO is requested before recording.

On Android 14+, if you use a foreground service for recording, also declare FOREGROUND_SERVICE_MICROPHONE in the manifest.

Tap Allow when the app requests microphone access.

7) Where recordings are stored

Default location (private app storage):

/data/user/0/<applicationId>/files/recordings/


List or pull files via adb:

adb devices
adb shell run-as <applicationId> ls files/recordings
adb shell run-as <applicationId> ls -l files/recordings

# Pull to PC:
adb shell run-as <applicationId> cat files/recordings/<filename> > /sdcard/Download/<filename>
adb pull /sdcard/Download/<filename> .


Private storage isn’t visible in normal file explorers; run-as works in debug builds.