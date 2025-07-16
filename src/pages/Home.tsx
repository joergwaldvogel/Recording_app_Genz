import { useCallback, useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton,
} from '@ionic/react';

import { RecordingService } from '../service/recording.service';
import RecordButton from '../components/RecordButton';
import { Directory, Filesystem } from '@capacitor/filesystem';

import type { Recording } from '../service/types';
import { playRecording } from '../service/audio-play';

export default function Home() {
  const [recs, setRecs] = useState<Recording[]>([]);

  /** Liste neu laden */
  const refresh = useCallback(async () => {
    setRecs(await RecordingService.list());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /* ── Aktionen pro Eintrag ───────────────────────── */
  const play  = useCallback(async (rec: Recording) => {
    const { uri } = await Filesystem.getUri({ path: rec.filePath, directory: Directory.Data });
    await playRecording(uri, rec.id);
  }, []);

  const share = (rec: Recording) => RecordingService.share(rec);
  const remove = async (rec: Recording) => { await RecordingService.delete(rec); refresh(); };

  /* ── UI ─────────────────────────────────────────── */
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Aufnahmen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList inset>
          {recs.map(rec => (
            <IonItem key={rec.id}>
              <IonLabel>{rec.fileName}</IonLabel>

              <IonButton slot="end" onClick={() => play(rec)}>▶️</IonButton>
              <IonButton slot="end" onClick={() => share(rec)}>📤</IonButton>
              <IonButton slot="end" color="danger" onClick={() => remove(rec)}>🗑️</IonButton>
            </IonItem>
          ))}
        </IonList>

        <RecordButton onFinished={refresh} />
      </IonContent>
    </IonPage>
  );
}