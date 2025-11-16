/**
 * System tray icon and menu
 */

import { Tray, Menu, app, nativeImage } from 'electron';
import path from 'path';
import { createMainWindow, toggleOverlayWindow, getMainWindow } from '../windows/windowManager';
import { logger } from '../utils/logger';
import { APP_NAME } from '../../src/config/appConfig';

let tray: Tray | null = null;

export function createTray(): Tray {
  if (tray) return tray;

  // Create a simple colored square as tray icon (in production, use actual icon file)
  const icon = nativeImage.createEmpty();

  // For now, we'll use a placeholder. In production, load from assets.
  // const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  // tray = new Tray(iconPath);

  // Create a simple 16x16 image programmatically
  const canvas = {
    width: 16,
    height: 16,
  };

  try {
    tray = new Tray(icon.resize(canvas));
  } catch (e) {
    // Fallback: create without icon
    tray = new Tray(nativeImage.createEmpty());
  }

  tray.setToolTip(APP_NAME);

  updateTrayMenu();

  tray.on('click', () => {
    const mainWin = getMainWindow();
    if (mainWin) {
      if (mainWin.isVisible()) {
        mainWin.hide();
      } else {
        mainWin.show();
        mainWin.focus();
      }
    } else {
      createMainWindow();
    }
  });

  logger.info('Tray icon created');
  return tray;
}

export function updateTrayMenu(): void {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Open ${APP_NAME}`,
      click: () => {
        const mainWin = getMainWindow();
        if (mainWin) {
          mainWin.show();
          mainWin.focus();
        } else {
          createMainWindow();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Start new meeting note',
      click: () => {
        const mainWin = getMainWindow();
        if (mainWin) {
          mainWin.show();
          mainWin.focus();
          mainWin.webContents.send('start-new-meeting');
        } else {
          createMainWindow();
        }
      },
    },
    {
      label: 'Toggle Halo overlay',
      click: () => {
        toggleOverlayWindow();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
