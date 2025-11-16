/**
 * Window manager for main and overlay windows
 */

import { BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from '../utils/env';
import { logger } from '../utils/logger';
import { setupContextMenuGuard } from '../security/contextMenuGuard';
import { setupDevToolsGuard } from '../security/devtoolsGuard';

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function getOverlayWindow(): BrowserWindow | null {
  return overlayWindow;
}

export function createMainWindow(): BrowserWindow {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus();
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: isDev,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Apply security guards
  setupContextMenuGuard(mainWindow);
  setupDevToolsGuard(mainWindow);

  logger.info('Main window created');
  return mainWindow;
}

export function createOverlayWindow(): BrowserWindow {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.focus();
    return overlayWindow;
  }

  overlayWindow = new BrowserWindow({
    width: 300,
    height: 60,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: isDev,
    },
    show: false,
  });

  // Position at top-right corner of primary display
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  overlayWindow.setPosition(width - 350, 20);

  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setAlwaysOnTop(true, 'floating');

  if (isDev) {
    overlayWindow.loadURL(`${VITE_DEV_SERVER_URL}#/overlay`);
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/overlay',
    });
  }

  overlayWindow.once('ready-to-show', () => {
    overlayWindow?.show();
  });

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });

  // Apply security guards
  setupContextMenuGuard(overlayWindow);
  setupDevToolsGuard(overlayWindow);

  logger.info('Overlay window created');
  return overlayWindow;
}

export function toggleOverlayWindow(): void {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    createOverlayWindow();
  } else {
    if (overlayWindow.isVisible()) {
      overlayWindow.hide();
    } else {
      overlayWindow.show();
      overlayWindow.focus();
    }
  }
}

export function closeAllWindows(): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.close();
  }
}
