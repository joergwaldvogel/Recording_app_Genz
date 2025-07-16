import { AudioRecorder } from '@capawesome-team/capacitor-audio-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share }     from '@capacitor/share';
import { v4 as uuid } from 'uuid';
import type { Recording } from '../service/types';

export class RecordingService {
  private static readonly dir = 'recordings';
  private static currentId: string | null = null;

  /* ── Aufnahme starten ──────────────────────────────── */
  static async start() {
    await AudioRecorder.requestPermissions();
    await AudioRecorder.startRecording({});      // default: AAC → *.aac  (Android)
    this.currentId = uuid();
  }

  /* ── Pause / Resume ─────────────────────────────────── */
  static pause  = () => AudioRecorder.pauseRecording();
  static resume = () => AudioRecorder.resumeRecording();

  /* ── Stop + Datei sichern ───────────────────────────── */
  static async stop(): Promise<Recording> {
    const { uri } = await AudioRecorder.stopRecording();
    if (!uri) throw new Error('Recorder lieferte keine URI');

    /* Ordner anlegen, falls noch nicht vorhanden */
    try {
      await Filesystem.stat({ path: this.dir, directory: Directory.Data });
    } catch {
      await Filesystem.mkdir({
        path: this.dir,
        directory: Directory.Data,
        recursive: true,
      });
    }

    /* Ziel-Dateiname → wir wandeln gleich auf m4a um       *
     * (iOS = *.m4a, Android = *.aac – läuft aber in m4a) */
    const fileName = `voice_${Date.now()}.m4a`;
    const filePath = `${this.dir}/${fileName}`;

    /* Datei kopieren (read + write), weil URI im Cache liegt */
    const { data } = await Filesystem.readFile({ path: uri });
    await Filesystem.writeFile({
      path: filePath,
      data,
      directory: Directory.Data,
    });

    return {
      id: this.currentId ?? uuid(),
      fileName,
      filePath,
      created: Date.now(),
    };
  }

  /* ── Liste aller Aufnahmen ──────────────────────────── */
  static async list(): Promise<Recording[]> {
    try {
      const { files } = await Filesystem.readdir({
        path: this.dir,
        directory: Directory.Data,
      });
      return files.map(f => ({
        id:       f.uri,
        fileName: f.name,
        filePath: `${this.dir}/${f.name}`,
        created:  0,               // hier könntest du per stat() das Datum holen
      }));
    } catch {
      return [];
    }
  }

  /* ── Datei löschen ──────────────────────────────────── */
  static delete(rec: Recording) {
    return Filesystem.deleteFile({
      path: rec.filePath,
      directory: Directory.Data,
    });
  }

  /* ── Aufnahme teilen (neu) ──────────────────────────── */
  static async share(rec: Recording) {
    /* absoluter file://-URI besorgen */
    const { uri } = await Filesystem.getUri({
      path: rec.filePath,
      directory: Directory.Data,
    });

    await Share.share({
      title: rec.fileName,
      url:   uri,            // jetzt gültiger, plattform­weiter Pfad
    });
  }
}
