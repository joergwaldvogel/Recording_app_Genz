// src/pages/Home.tsx
import { useCallback, useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonButton, IonButtons, IonIcon, IonAlert,
} from '@ionic/react';

import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingService } from '../service/recording.service';
import RecordButton from '../components/RecordButton';
import type { Recording } from '../service/types';

// NativeAudio-Controls
import {
  playRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
  getState,
} from '../service/audio-play';

// Ionicons (Outline = schlichter Look)
import {
  playOutline,
  pauseOutline,
  stopOutline,
  shareOutline,
  trashOutline,
} from 'ionicons/icons';

import logo from '/assets/icon/logo.png'; // Bild aus public/

export default function Home() {
  const [recs, setRecs] = useState<Recording[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  // kleiner Re-Render-Trigger, wenn der NativeAudio-State wechselt
  const [, setBump] = useState(0);

  // Alert-State für Bestätigung
  const [confirm, setConfirm] = useState<{ open: boolean; rec: Recording | null }>({
    open: false,
    rec: null,
  });

  /** Liste neu laden */
  const refresh = useCallback(async () => {
    setRecs(await RecordingService.list());
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  /** URI einer Aufnahme ermitteln */
  const getUri = useCallback(async (rec: Recording) => {
    const { uri } = await Filesystem.getUri({
      path: rec.filePath,
      directory: Directory.Data,
    });
    return uri;
  }, []);

  /** Play/Pause umschalten */
  const togglePlayPause = useCallback(async (rec: Recording) => {
    const state = getState(rec.id);

    // Wenn eine andere Aufnahme spielt: erst stoppen
    if (activeId && activeId !== rec.id) {
      stopRecording(activeId);
    }

    if (state === 'playing') {
      await pauseRecording(rec.id);
    } else if (state === 'paused') {
      await resumeRecording(rec.id);
      setActiveId(rec.id);
    } else {
      // idle -> neu starten (braucht URI)
      const uri = await getUri(rec);
      await playRecording(uri, rec.id);
      setActiveId(rec.id);
    }
    setBump((n) => n + 1);
  }, [activeId, getUri]);

  /** Stop für einen Eintrag */
  const stop = useCallback((rec: Recording) => {
    stopRecording(rec.id);
    if (activeId === rec.id) setActiveId(null);
    setBump((n) => n + 1);
  }, [activeId]);

  /** Teilen */
  const share = (rec: Recording) => RecordingService.share(rec);

  /** Tatsächliches Löschen nach Bestätigung */
  const doDelete = async () => {
    if (!confirm.rec) return;
    // Sicherheitshalber stoppen, falls sie gerade läuft
    stopRecording(confirm.rec.id);
    await RecordingService.delete(confirm.rec);
    await refresh();
    setConfirm({ open: false, rec: null });
  };

  /* ── UI ─────────────────────────────────────────── */
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': 'var(--ion-color-danger)', '--color': 'white' }}>
          <IonTitle>Aufnahmen</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" aria-label="App-Logo">
              <img src={logo} alt="Logo" style={{ width: 36, height: 36 }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList inset>
          {recs.map((rec) => {
            const state = getState(rec.id);
            const isActive = state !== 'idle';
            const isPlaying = state === 'playing';

            return (
              <IonItem key={rec.id} lines="inset">
                <IonLabel className="rec-title">{rec.fileName}</IonLabel>

                {/* Schlichte Icons */}
                <IonButtons slot="end">
                  {/* Play/Pause Toggle */}
                  <IonButton
                    mode="ios"
                    fill="clear"
                    onClick={() => togglePlayPause(rec)}
                    aria-label={isPlaying ? 'Pause' : 'Abspielen'}
                    className="icon-btn"
                  >
                    <IonIcon icon={isPlaying ? pauseOutline : playOutline} />
                  </IonButton>

                  {/* Stop */}
                  <IonButton
                    mode="ios"
                    fill="clear"
                    onClick={() => stop(rec)}
                    aria-label="Stopp"
                    disabled={!isActive}
                    className="icon-btn"
                  >
                    <IonIcon icon={stopOutline} />
                  </IonButton>

                  {/* Teilen */}
                  <IonButton
                    mode="ios"
                    fill="clear"
                    onClick={() => share(rec)}
                    aria-label="Teilen"
                    className="icon-btn"
                  >
                    <IonIcon icon={shareOutline} />
                  </IonButton>

                  {/* Löschen (mit Bestätigung) */}
                  <IonButton
                    mode="ios"
                    fill="clear"
                    color="danger"
                    onClick={() => setConfirm({ open: true, rec })}
                    aria-label="Löschen"
                    className="icon-btn"
                  >
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </IonButtons>
              </IonItem>
            );
          })}
        </IonList>

        <RecordButton onFinished={refresh} />
      </IonContent>

      {/* Bestätigungs-Popup */}
      <IonAlert
        isOpen={confirm.open}
        header="Aufnahme löschen?"
        message={`„${confirm.rec?.fileName ?? ''}“ wirklich löschen?`}
        onDidDismiss={() => setConfirm({ open: false, rec: null })}
        buttons={[
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Löschen', role: 'destructive', handler: () => { void doDelete(); } },
        ]}
      />

      {/* CSS entweder hier oder auslagern */}
      <style>{`
        .rec-title {
          font-weight: 500;
        }
        .icon-btn {
          --padding-start: 6px;
          --padding-end: 6px;
          --border-radius: 12px;
          --background: transparent;
          --box-shadow: none;
          --ripple-color: transparent;
          min-width: 36px;          /* angenehme Touch-Zone */
          min-height: 36px;
        }
        .icon-btn ion-icon {
          font-size: 22px;          /* iOS-ähnliche Icon-Größe */
        }
      `}</style>
    </IonPage>
  );
}