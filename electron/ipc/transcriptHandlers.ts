/**
 * IPC handlers for transcripts
 */

import { ipcMain } from 'electron';
import { getTranscriptSegmentsByMeeting } from '../services/storage/transcriptRepository';
import { logger } from '../utils/logger';

export function registerTranscriptHandlers(): void {
  ipcMain.handle('transcript:getByMeeting', async (_event, meetingId) => {
    try {
      return getTranscriptSegmentsByMeeting(meetingId);
    } catch (error) {
      logger.error('Error getting transcripts:', error);
      throw error;
    }
  });
}
