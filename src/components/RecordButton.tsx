import { useState } from "react";
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { mic, pause, square } from "ionicons/icons";
import { RecordingService } from "../service/recording.service";

export default function RecordButton({ onFinished }: { onFinished: () => void }) {
  const [status, setStatus] = useState<"idle" | "rec" | "pause">("idle");

  const toggle = async () => {
    if (status === "idle") {            // Aufnahme starten
      await RecordingService.start();
      setStatus("rec");
    } else if (status === "rec") {      // Pause
      await RecordingService.pause();
      setStatus("pause");
    } else {                            // Fortsetzen
      await RecordingService.resume();
      setStatus("rec");
    }
  };

  const stop = async () => {
    await RecordingService.stop();
    onFinished();                       // Liste neu laden
    setStatus("idle");
  };

  return (
    <IonFab vertical="bottom" horizontal="end">
      <IonFabButton color="danger" onClick={toggle}>
        <IonIcon icon={status === "rec" ? pause : mic} />
      </IonFabButton>

      {status !== "idle" && (
        <IonFabButton color="medium" onClick={stop}>
          <IonIcon icon={square} />
        </IonFabButton>
      )}
    </IonFab>
  );
}