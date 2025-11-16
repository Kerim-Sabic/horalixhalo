/**
 * Microphone audio capture service
 * Captures audio from system microphone and provides audio chunks
 */

import { desktopCapturer } from 'electron';
import { logger } from '../../utils/logger';

export class MicrophoneCapture {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private isCapturing = false;
  private audioChunks: Blob[] = [];

  async start(
    onAudioChunk: (chunk: Blob) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Get audio input device
      // Note: In Electron, we use getUserMedia for microphone access
      // This requires proper permissions in the renderer or via desktopCapturer

      // For now, we'll use a simple approach that works in Electron
      // In production, you'd want to use proper audio capture libraries

      this.isCapturing = true;
      logger.info('Microphone capture started');

      // TODO: Implement actual microphone capture using node-audio-capture
      // or similar library. For now, this is a stub that would need:
      // 1. npm install @recordrtc or similar audio capture library
      // 2. Proper audio stream handling
      // 3. Audio format conversion (to WAV or compatible format)

    } catch (error) {
      logger.error('Failed to start microphone capture:', error);
      onError(error as Error);
    }
  }

  async stop(): Promise<Blob | null> {
    if (!this.isCapturing) return null;

    this.isCapturing = false;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
    }

    const audioBlob = this.audioChunks.length > 0
      ? new Blob(this.audioChunks, { type: 'audio/wav' })
      : null;

    this.audioChunks = [];
    logger.info('Microphone capture stopped');

    return audioBlob;
  }

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isCapturing = false;
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isCapturing = true;
    }
  }

  getIsCapturing(): boolean {
    return this.isCapturing;
  }
}
