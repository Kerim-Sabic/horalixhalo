/**
 * ASR (Automatic Speech Recognition) types
 */

export interface ASRConfig {
  provider: 'dummy' | 'deepgram' | 'openaiWhisper' | 'localWhisper';
  apiKey?: string;
  localUrl?: string;
}

export interface ASRResult {
  text: string;
  isFinal: boolean;
  confidence?: number;
  speaker?: string;
}

export interface ASRProvider {
  id: string;
  displayName: string;
  isOnlineService: boolean;

  start: (
    config: ASRConfig,
    callbacks: {
      onPartial: (result: ASRResult) => void;
      onFinal: (result: ASRResult) => void;
      onError: (error: Error) => void;
    }
  ) => Promise<void>;

  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;

  // Send audio chunk to provider (for streaming providers)
  sendAudio?: (audioChunk: Buffer) => void;
}
