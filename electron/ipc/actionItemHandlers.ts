/**
 * IPC handlers for action items
 */

import { ipcMain } from 'electron';
import {
  createActionItem,
  getActionItemsByMeeting,
  updateActionItem,
  deleteActionItem,
} from '../services/storage/actionItemRepository';
import { logger } from '../utils/logger';

export function registerActionItemHandlers(): void {
  ipcMain.handle('actionItem:create', async (_event, input) => {
    try {
      return createActionItem(input);
    } catch (error) {
      logger.error('Error creating action item:', error);
      throw error;
    }
  });

  ipcMain.handle('actionItem:getByMeeting', async (_event, meetingId) => {
    try {
      return getActionItemsByMeeting(meetingId);
    } catch (error) {
      logger.error('Error getting action items:', error);
      throw error;
    }
  });

  ipcMain.handle('actionItem:update', async (_event, id, input) => {
    try {
      return updateActionItem(id, input);
    } catch (error) {
      logger.error('Error updating action item:', error);
      throw error;
    }
  });

  ipcMain.handle('actionItem:delete', async (_event, id) => {
    try {
      return deleteActionItem(id);
    } catch (error) {
      logger.error('Error deleting action item:', error);
      throw error;
    }
  });
}
