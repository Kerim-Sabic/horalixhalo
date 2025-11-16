/**
 * Local Whisper HTTP provider
 * For users running their own Whisper server (e.g., whisper.cpp HTTP server)
 */

import { ASRProvider, ASRConfig, ASRResult } from '../types';
import { logger } from '../../../utils/logger';
import fetch from 'node-fetch';
import FormData from 'form-data';

let chunkInterval: NodeJS.Timeout | null = null;
let audioBuffer: Buffer[] = [];

export const localWhisperProvider: ASRProvider = {
  id: 'localWhisper',
  displayName: 'Local Whisper Server',
  isOnlineService: false,

  async start(config, callbacks) {
    if (!config.localUrl) {
      callbacks.onError(new Error('Local Whisper server URL is required'));
      return;
    }

    try {
      logger.info(`Local Whisper started - connecting to ${config.localUrl}`);

      // Process audio chunks periodically
      chunkInterval = setInterval(async () => {
        if (audioBuffer.length === 0) return;

        try {
          // Combine audio chunks
          const audioData = Buffer.concat(audioBuffer);
          audioBuffer = [];

          // Assuming local Whisper server has /transcribe endpoint
          // Format may vary based on implementation (whisper.cpp, faster-whisper, etc.)
          const formData = new FormData();
          formData.append('audio', audioData, {
            filename: 'audio.wav',
            contentType: 'audio/wav',
          });
          formData.append('task', 'transcribe');
          formData.append('language', 'en');

          const response = await fetch(`${config.localUrl}/transcribe`, {
            method: 'POST',
            body: formData as any,
          });

          if (!response.ok) {
            const error = await response.text();
            logger.error('Local Whisper error:', error);
            return;
          }

          const result: any = await response.json();

          // Handle different possible response formats
          const transcript = result.text || result.transcription || result.transcript || '';

          if (transcript.trim()) {
            const asrResult: ASRResult = {
              text: transcript,
              isFinal: true,
              confidence: result.confidence || 0.9,
              speaker: 'you',
            };

            callbacks.onFinal(asrResult);
          }
        } catch (error) {
          logger.error('Error processing local Whisper chunk:', error);
          // Don't call callbacks.onError for every chunk failure
          // Only log and continue
        }
      }, 5000); // Process every 5 seconds
    } catch (error) {
      logger.error('Failed to start local Whisper:', error);
      callbacks.onError(error as Error);
    }
  },

  async stop() {
    if (chunkInterval) {
      clearInterval(chunkInterval);
      chunkInterval = null;
    }
    audioBuffer = [];
  },

  async pause() {
    if (chunkInterval) {
      clearInterval(chunkInterval);
      chunkInterval = null;
    }
  },

  async resume() {
    // Would restart chunk interval
  },

  sendAudio(audioChunk: Buffer) {
    // Buffer audio chunks for periodic processing
    audioBuffer.push(audioChunk);
  },
};
