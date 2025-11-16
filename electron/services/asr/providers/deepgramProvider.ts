/**
 * Deepgram ASR provider
 * Real-time WebSocket streaming transcription
 */

import { ASRProvider, ASRConfig, ASRResult } from '../types';
import { logger } from '../../../utils/logger';
import WebSocket from 'ws';

export const deepgramProvider: ASRProvider = {
  id: 'deepgram',
  displayName: 'Deepgram',
  isOnlineService: true,

  async start(config, callbacks) {
    if (!config.apiKey) {
      callbacks.onError(new Error('Deepgram API key is required'));
      return;
    }

    try {
      // Deepgram WebSocket endpoint
      const url = `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&interim_results=true`;

      const ws = new WebSocket(url, {
        headers: {
          Authorization: `Token ${config.apiKey}`,
        },
      });

      ws.on('open', () => {
        logger.info('Deepgram WebSocket connected');
        // Audio chunks will be sent via sendAudio() method
      });

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const response = JSON.parse(data.toString());

          if (response.channel && response.channel.alternatives) {
            const alternative = response.channel.alternatives[0];
            const transcript = alternative.transcript;

            if (!transcript) return;

            const isFinal = response.is_final || false;
            const confidence = alternative.confidence || 0;

            const result: ASRResult = {
              text: transcript,
              isFinal,
              confidence,
              speaker: 'you', // Deepgram can do speaker diarization with proper config
            };

            if (isFinal) {
              callbacks.onFinal(result);
            } else {
              callbacks.onPartial(result);
            }
          }
        } catch (error) {
          logger.error('Error parsing Deepgram response:', error);
        }
      });

      ws.on('error', (error) => {
        logger.error('Deepgram WebSocket error:', error);
        callbacks.onError(error);
      });

      ws.on('close', () => {
        logger.info('Deepgram WebSocket closed');
      });

      // Store WebSocket for later use
      (deepgramProvider as any)._ws = ws;
    } catch (error) {
      logger.error('Failed to start Deepgram:', error);
      callbacks.onError(error as Error);
    }
  },

  async stop() {
    const ws = (deepgramProvider as any)._ws as WebSocket | undefined;
    if (ws) {
      ws.close();
      delete (deepgramProvider as any)._ws;
    }
  },

  async pause() {
    // Deepgram doesn't have explicit pause, we just stop sending audio
  },

  async resume() {
    // Resume sending audio chunks
  },

  sendAudio(audioChunk: Buffer) {
    const ws = (deepgramProvider as any)._ws as WebSocket | undefined;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(audioChunk);
    }
  },
};
