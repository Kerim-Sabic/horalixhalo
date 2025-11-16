/**
 * IPC handlers for LLM operations
 */

import { ipcMain } from 'electron';
import { logger } from '../utils/logger';
import { llmRouter } from '../services/llm/llmRouter';

export function registerLLMHandlers(): void {
  ipcMain.handle('llm:generateSummary', async (_event, input) => {
    try {
      logger.info('Summary generation requested');
      return await llmRouter.generateSummary(input);
    } catch (error) {
      logger.error('Error generating summary:', error);
      throw error;
    }
  });

  ipcMain.handle('llm:suggestReply', async (_event, input) => {
    try {
      logger.info('Reply suggestion requested');
      return await llmRouter.suggestReply(input);
    } catch (error) {
      logger.error('Error suggesting reply:', error);
      throw error;
    }
  });

  ipcMain.handle('llm:generateFollowup', async (_event, input) => {
    try {
      logger.info('Follow-up questions requested');
      return await llmRouter.generateFollowup(input);
    } catch (error) {
      logger.error('Error generating follow-up:', error);
      throw error;
    }
  });

  ipcMain.handle('llm:extractActionItems', async (_event, input) => {
    try {
      logger.info('Action item extraction requested');
      return await llmRouter.extractActionItems(input);
    } catch (error) {
      logger.error('Error extracting action items:', error);
      throw error;
    }
  });

  ipcMain.handle('llm:analyzeRisks', async (_event, input) => {
    try {
      logger.info('Risk analysis requested');
      return await llmRouter.analyzeRisks(input);
    } catch (error) {
      logger.error('Error analyzing risks:', error);
      throw error;
    }
  });

  ipcMain.handle('llm:transformTone', async (_event, input) => {
    try {
      logger.info('Tone transformation requested');
      return await llmRouter.transformTone(input);
    } catch (error) {
      logger.error('Error transforming tone:', error);
      throw error;
    }
  });
}
