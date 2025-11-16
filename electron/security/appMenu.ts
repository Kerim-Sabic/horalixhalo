/**
 * App menu configuration
 * Removes default menu in production for security
 */

import { Menu, app } from 'electron';
import { isProd, isDev } from '../utils/env';

export function setupAppMenu(): void {
  if (isProd) {
    // Remove all menus in production
    Menu.setApplicationMenu(null);
  } else {
    // In development, keep default menu with devtools access
    const template: any = [
      {
        label: 'File',
        submenu: [
          { role: 'quit' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
