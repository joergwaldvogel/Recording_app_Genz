import { NativeAudio } from '@capacitor-community/native-audio';

const loaded = new Set<string>();
let listenerRegistered = false;

/** Spielt eine lokale Datei ab und entlädt sie nach „complete“. */
export async function playRecording(nativeUri: string, assetId: string = nativeUri) {
  try {
    if (!loaded.has(assetId)) {
      await NativeAudio.preload({ assetId, assetPath: nativeUri, isUrl: true });
      loaded.add(assetId);
    }
    await NativeAudio.play({ assetId });

    // Listener nur einmal global registrieren
    if (!listenerRegistered) {
      NativeAudio.addListener('complete', async ({ assetId: finished }) => {
        await NativeAudio.unload({ assetId: finished }).catch(() => void 0);
        loaded.delete(finished);
      });
      listenerRegistered = true;
    }
  } catch (err) {
    console.error('[audio-play]', err);
  }
}