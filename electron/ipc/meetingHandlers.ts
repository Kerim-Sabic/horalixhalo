/**
 * IPC handlers for meetings
 */

import { ipcMain } from 'electron';
import {
  createMeeting,
  getMeetingById,
  getAllMeetings,
  updateMeeting,
  deleteMeeting,
} from '../services/storage/meetingRepository';
import { logger } from '../utils/logger';

export function registerMeetingHandlers(): void {
  ipcMain.handle('meeting:create', async (_event, input) => {
    try {
      return createMeeting(input);
    } catch (error) {
      logger.error('Error creating meeting:', error);
      throw error;
    }
  });

  ipcMain.handle('meeting:get', async (_event, id) => {
    try {
      return getMeetingById(id);
    } catch (error) {
      logger.error('Error getting meeting:', error);
      throw error;
    }
  });

  ipcMain.handle('meeting:getAll', async (_event, limit = 100, offset = 0) => {
    try {
      return getAllMeetings(limit, offset);
    } catch (error) {
      logger.error('Error getting all meetings:', error);
      throw error;
    }
  });

  ipcMain.handle('meeting:update', async (_event, id, input) => {
    try {
      return updateMeeting(id, input);
    } catch (error) {
      logger.error('Error updating meeting:', error);
      throw error;
    }
  });

  ipcMain.handle('meeting:delete', async (_event, id) => {
    try {
      return deleteMeeting(id);
    } catch (error) {
      logger.error('Error deleting meeting:', error);
      throw error;
    }
  });
}
