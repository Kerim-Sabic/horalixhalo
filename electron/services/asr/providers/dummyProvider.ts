/**
 * Dummy ASR provider for testing
 * Emits fake transcript segments
 */

import { ASRProvider, ASRConfig, ASRResult } from '../types';

let intervalId: NodeJS.Timeout | null = null;
let counter = 0;

export const dummyProvider: ASRProvider = {
  id: 'dummy',
  displayName: 'Dummy (Testing)',
  isOnlineService: false,

  async start(config, callbacks) {
    counter = 0;

    const sampleTexts = [
      'Hello, how are you doing today?',
      'I think we should focus on the key metrics for this quarter.',
      'That sounds like a great idea. Let me write that down.',
      'What are the next steps we need to take?',
      'I agree with that approach. When can we start?',
    ];

    intervalId = setInterval(() => {
      const text = sampleTexts[counter % sampleTexts.length];
      const speaker = counter % 2 === 0 ? 'you' : 'other';

      // Emit partial first
      callbacks.onPartial({
        text: text.substring(0, text.length / 2),
        isFinal: false,
        confidence: 0.8,
        speaker,
      });

      // Then emit final after 1 second
      setTimeout(() => {
        callbacks.onFinal({
          text,
          isFinal: true,
          confidence: 0.95,
          speaker,
        });
      }, 1000);

      counter++;
    }, 5000); // Every 5 seconds
  },

  async stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },

  async pause() {
    await this.stop();
  },

  async resume() {
    // Would need to store config to resume
  },
};
