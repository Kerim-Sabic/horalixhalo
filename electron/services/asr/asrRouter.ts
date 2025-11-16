/**
 * ASR Router - manages ASR provider selection and audio flow
 */

import { ASRProvider, ASRConfig, ASRResult } from './types';
import { dummyProvider } from './providers/dummyProvider';
import { deepgramProvider } from './providers/deepgramProvider';
import { openaiWhisperProvider } from './providers/openaiWhisperProvider';
import { localWhisperProvider } from './providers/localWhisperProvider';
import { MicrophoneCapture } from './microphoneCapture';
import { logger } from '../../utils/logger';
import { getSettings } from '../storage/settingsRepository';
import { BrowserWindow } from 'electron';

const providers: Record<string, ASRProvider> = {
  dummy: dummyProvider,
  deepgram: deepgramProvider,
  openaiWhisper: openaiWhisperProvider,
  localWhisper: localWhisperProvider,
};

let currentProvider: ASRProvider | null = null;
let microphone: MicrophoneCapture | null = null;

export async function startASR(
  meetingId: string,
  mainWindow: BrowserWindow
): Promise<void> {
  try {
    const settings = getSettings();

    const config: ASRConfig = {
      provider: settings.asrProvider,
      apiKey: getApiKeyForProvider(settings.asrProvider, settings),
      localUrl: settings.localWhisperUrl || undefined,
    };

    const provider = providers[config.provider];
    if (!provider) {
      throw new Error(`Unknown ASR provider: ${config.provider}`);
    }

    logger.info(`Starting ASR with provider: ${config.provider}`);

    currentProvider = provider;

    // Setup callbacks
    const callbacks = {
      onPartial: (result: ASRResult) => {
        logger.debug('ASR partial:', result.text);
        mainWindow.webContents.send('transcript:partial', {
          meetingId,
          result,
        });
      },

      onFinal: (result: ASRResult) => {
        logger.debug('ASR final:', result.text);
        mainWindow.webContents.send('transcript:final', {
          meetingId,
          result,
        });
      },

      onError: (error: Error) => {
        logger.error('ASR error:', error);
        mainWindow.webContents.send('asr:error', {
          meetingId,
          error: error.message,
        });
      },
    };

    // Start ASR provider
    await provider.start(config, callbacks);

    // Start microphone capture (if not dummy provider)
    if (config.provider !== 'dummy') {
      microphone = new MicrophoneCapture();
      await microphone.start(
        (audioChunk) => {
          // TODO: Send audio chunk to ASR provider
          // This would pipe audio to WebSocket or buffer for Whisper
        },
        (error) => {
          logger.error('Microphone error:', error);
          callbacks.onError(error);
        }
      );
    }

    logger.info('ASR started successfully');
  } catch (error) {
    logger.error('Failed to start ASR:', error);
    throw error;
  }
}

export async function stopASR(): Promise<void> {
  if (currentProvider) {
    await currentProvider.stop();
    currentProvider = null;
  }

  if (microphone) {
    await microphone.stop();
    microphone = null;
  }

  logger.info('ASR stopped');
}

export async function pauseASR(): Promise<void> {
  if (currentProvider) {
    await currentProvider.pause();
  }

  if (microphone) {
    microphone.pause();
  }

  logger.info('ASR paused');
}

export async function resumeASR(): Promise<void> {
  if (currentProvider) {
    await currentProvider.resume();
  }

  if (microphone) {
    microphone.resume();
  }

  logger.info('ASR resumed');
}

function getApiKeyForProvider(provider: string, settings: any): string | undefined {
  switch (provider) {
    case 'deepgram':
      return settings.deepgramApiKey || undefined;
    case 'openaiWhisper':
      return settings.openaiWhisperApiKey || undefined;
    default:
      return undefined;
  }
}
