/**
 * DevTools guard - prevents opening DevTools in production
 */

import { BrowserWindow } from 'electron';
import { isProd } from '../utils/env';

export function setupDevToolsGuard(window: BrowserWindow): void {
  if (!isProd) return; // Allow in development

  // Prevent opening devtools
  window.webContents.on('devtools-opened', () => {
    window.webContents.closeDevTools();
  });

  // Block common devtools shortcuts
  window.webContents.on('before-input-event', (event, input) => {
    if (isProd) {
      // F12
      if (input.key === 'F12') {
        event.preventDefault();
      }

      // Ctrl+Shift+I or Cmd+Option+I
      if (
        input.key === 'I' &&
        (input.control || input.meta) &&
        input.shift
      ) {
        event.preventDefault();
      }

      // Ctrl+Shift+J or Cmd+Option+J
      if (
        input.key === 'J' &&
        (input.control || input.meta) &&
        input.shift
      ) {
        event.preventDefault();
      }

      // Ctrl+Shift+C or Cmd+Option+C
      if (
        input.key === 'C' &&
        (input.control || input.meta) &&
        input.shift
      ) {
        event.preventDefault();
      }
    }
  });
}
