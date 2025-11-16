/**
 * OpenAI Whisper ASR provider
 * Chunked audio transcription using OpenAI API
 */

import { ASRProvider, ASRConfig, ASRResult } from '../types';
import { logger } from '../../../utils/logger';
import fetch from 'node-fetch';
import FormData from 'form-data';

let chunkInterval: NodeJS.Timeout | null = null;
let audioBuffer: Buffer[] = [];

export const openaiWhisperProvider: ASRProvider = {
  id: 'openaiWhisper',
  displayName: 'OpenAI Whisper',
  isOnlineService: true,

  async start(config, callbacks) {
    if (!config.apiKey) {
      callbacks.onError(new Error('OpenAI API key is required'));
      return;
    }

    try {
      logger.info('OpenAI Whisper started - using chunked audio');

      // Since Whisper doesn't support streaming, we'll process audio in chunks
      // Every 5 seconds, we'll send accumulated audio to Whisper API
      chunkInterval = setInterval(async () => {
        if (audioBuffer.length === 0) return;

        try {
          // Combine audio chunks into single buffer
          const audioData = Buffer.concat(audioBuffer);
          audioBuffer = [];

          // Create FormData for multipart upload
          const formData = new FormData();
          formData.append('file', audioData, {
            filename: 'audio.wav',
            contentType: 'audio/wav',
          });
          formData.append('model', 'whisper-1');
          formData.append('response_format', 'json');

          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.apiKey}`,
            },
            body: formData as any,
          });

          if (!response.ok) {
            const error = await response.text();
            logger.error('OpenAI Whisper API error:', error);
            return;
          }

          const result: any = await response.json();
          const transcript = result.text || '';

          if (transcript.trim()) {
            const asrResult: ASRResult = {
              text: transcript,
              isFinal: true,
              confidence: 0.9, // Whisper doesn't provide confidence scores
              speaker: 'you',
            };

            callbacks.onFinal(asrResult);
          }
        } catch (error) {
          logger.error('Error processing Whisper chunk:', error);
        }
      }, 5000); // Process every 5 seconds
    } catch (error) {
      logger.error('Failed to start OpenAI Whisper:', error);
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
    // Restart chunk interval
    // Would need to call start() again with config
  },
};

// Method to add audio chunks (would be called from microphone capture)
export function addAudioChunk(chunk: Buffer): void {
  audioBuffer.push(chunk);
}
