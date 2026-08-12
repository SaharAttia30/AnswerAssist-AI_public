export enum ConnectionState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
}

export interface TranscriptEntry {
  id: string;
  sender: 'user' | 'model';
  text: string;
  isFinal: boolean;
}
