/**
 * Context menu guard - disables right-click context menu in production
 */

import { BrowserWindow } from 'electron';
import { isProd } from '../utils/env';

export function setupContextMenuGuard(window: BrowserWindow): void {
  if (!isProd) return; // Allow in development

  window.webContents.on('context-menu', (event) => {
    event.preventDefault();
  });
}
