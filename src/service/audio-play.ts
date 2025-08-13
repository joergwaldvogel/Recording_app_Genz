// src/service/audio-play.ts
import { NativeAudio } from '@capacitor-community/native-audio';

const loaded = new Set<string>();
let listenerRegistered = false;

// Merkt sich den Zustand pro Asset
type PlayerState = 'idle' | 'playing' | 'paused';
const states = new Map<string, PlayerState>();

/** Datei laden (falls nicht geladen) */
async function ensureLoaded(assetId: string, nativeUri: string) {
  if (!loaded.has(assetId)) {
    await NativeAudio.preload({
      assetId,
      assetPath: nativeUri,
      isUrl: true,
    });
    loaded.add(assetId);
    states.set(assetId, 'idle');
  }
}

/** Play oder Resume */
export async function playRecording(nativeUri: string, assetId: string = nativeUri) {
  try {
    await ensureLoaded(assetId, nativeUri);
    await NativeAudio.play({ assetId });
    states.set(assetId, 'playing');

    // Listener nur einmal global registrieren
    if (!listenerRegistered) {
      NativeAudio.addListener('complete', async ({ assetId: finished }) => {
        await NativeAudio.unload({ assetId: finished }).catch(() => void 0);
        loaded.delete(finished);
        states.set(finished, 'idle');
      });
      listenerRegistered = true;
    }
  } catch (err) {
    console.error('[audio-play] playRecording', err);
  }
}

/** Pause */
export async function pauseRecording(assetId: string) {
  try {
    await NativeAudio.pause({ assetId });
    states.set(assetId, 'paused');
  } catch (err) {
    console.error('[audio-play] pauseRecording', err);
  }
}

/** Resume (nach Pause) */
export async function resumeRecording(assetId: string) {
  try {
    await NativeAudio.resume({ assetId });
    states.set(assetId, 'playing');
  } catch (err) {
    console.error('[audio-play] resumeRecording', err);
  }
}

/** Stop (zurück an den Anfang) */
export async function stopRecording(assetId: string) {
  try {
    await NativeAudio.stop({ assetId });
    states.set(assetId, 'idle');
  } catch (err) {
    console.error('[audio-play] stopRecording', err);
  }
}

/** Aktuellen Zustand abfragen */
export function getState(assetId: string): PlayerState {
  return states.get(assetId) ?? 'idle';
}