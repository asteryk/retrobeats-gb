export interface Song {
  id: string;
  name: string;
  url: string;
  file?: File;
}

export enum ScreenMode {
  INFO = 'INFO',
  TAPE = 'TAPE',
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  currentSongIndex: number;
}