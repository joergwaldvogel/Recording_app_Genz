export interface Recording {
  id: string;
  fileName: string;
  filePath: string;
  created: number;
}
export interface RecordingList {
  recordings: Recording[];
  total: number;
}