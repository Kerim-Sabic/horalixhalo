/**
 * Electron main process entry point
 */

import { app, globalShortcut } from 'electron';
import { getDatabase, closeDatabase } from './db/connection';
import {
  createMainWindow,
  createOverlayWindow,
  toggleOverlayWindow,
  closeAllWindows,
  getMainWindow,
} from './windows/windowManager';
import { createTray, destroyTray } from './tray/trayIcon';
import { logger, LogLevel } from './utils/logger';
import { isDev } from './utils/env';
import { GLOBAL_HOTKEYS } from '../src/config/appConfig';

// Import IPC handlers
import { registerSettingsHandlers } from './ipc/settingsHandlers';
import { registerMeetingHandlers } from './ipc/meetingHandlers';
import { registerTranscriptHandlers } from './ipc/transcriptHandlers';
import { registerActionItemHandlers } from './ipc/actionItemHandlers';
import { registerPlanHandlers } from './ipc/planHandlers';
import { registerAIUsageHandlers } from './ipc/aiUsageHandlers';
import { registerASRHandlers } from './ipc/asrHandlers';
import { registerLLMHandlers } from './ipc/llmHandlers';
import { setupAppMenu } from './security/appMenu';
import { startConnectivityMonitoring, stopConnectivityMonitoring } from './services/connectivity/connectivityService';

// Set log level
if (isDev) {
  logger.setLevel(LogLevel.DEBUG);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window
    const mainWin = getMainWindow();
    if (mainWin) {
      if (mainWin.isMinimized()) mainWin.restore();
      mainWin.focus();
    }
  });

  // This method will be called when Electron has finished initialization
  app.whenReady().then(() => {
    logger.info('App is ready, initializing...');

    // Setup security
    setupAppMenu();

    // Initialize database
    try {
      getDatabase();
      logger.info('Database initialized');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
    }

    // Register all IPC handlers
    registerSettingsHandlers();
    registerMeetingHandlers();
    registerTranscriptHandlers();
    registerActionItemHandlers();
    registerPlanHandlers();
    registerAIUsageHandlers();
    registerASRHandlers();
    registerLLMHandlers();

    logger.info('IPC handlers registered');

    // Register global hotkeys
    registerGlobalHotkeys();

    // Create tray icon
    createTray();

    // Create main window
    const mainWin = createMainWindow();

    // Start connectivity monitoring
    startConnectivityMonitoring(mainWin);

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
      if (!getMainWindow()) {
        createMainWindow();
      }
    });
  });

  // Quit when all windows are closed, except on macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Before quit, cleanup
  app.on('before-quit', () => {
    logger.info('App is quitting, cleaning up...');

    // Unregister global shortcuts
    globalShortcut.unregisterAll();

    // Stop connectivity monitoring
    stopConnectivityMonitoring();

    // Close database
    closeDatabase();

    // Destroy tray
    destroyTray();
  });
}

function registerGlobalHotkeys(): void {
  try {
    // Toggle overlay
    globalShortcut.register(GLOBAL_HOTKEYS.TOGGLE_OVERLAY, () => {
      logger.debug('Global hotkey: Toggle overlay');
      toggleOverlayWindow();
    });

    // Trigger "Say" action
    globalShortcut.register(GLOBAL_HOTKEYS.TRIGGER_SAY, () => {
      logger.debug('Global hotkey: Trigger Say');
      // TODO: Emit event to overlay window
    });

    // Trigger "Follow-up" action
    globalShortcut.register(GLOBAL_HOTKEYS.TRIGGER_FOLLOWUP, () => {
      logger.debug('Global hotkey: Trigger Follow-up');
      // TODO: Emit event to overlay window
    });

    // Trigger "Recap" action
    globalShortcut.register(GLOBAL_HOTKEYS.TRIGGER_RECAP, () => {
      logger.debug('Global hotkey: Trigger Recap');
      // TODO: Emit event to overlay window
    });

    // Trigger "Actions" action
    globalShortcut.register(GLOBAL_HOTKEYS.TRIGGER_ACTIONS, () => {
      logger.debug('Global hotkey: Trigger Actions');
      // TODO: Emit event to overlay window
    });

    logger.info('Global hotkeys registered');
  } catch (error) {
    logger.error('Failed to register global hotkeys:', error);
  }
}

// Handle overlay control IPC
import { ipcMain } from 'electron';

ipcMain.handle('overlay:show', async () => {
  const overlay = createOverlayWindow();
  overlay.show();
});

ipcMain.handle('overlay:hide', async () => {
  const overlay = createOverlayWindow();
  overlay.hide();
});

ipcMain.handle('overlay:toggle', async () => {
  toggleOverlayWindow();
});

ipcMain.handle('app:getVersion', async () => {
  return app.getVersion();
});
