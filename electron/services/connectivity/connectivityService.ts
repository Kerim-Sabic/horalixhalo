/**
 * Connectivity service - monitors online/offline status
 */

import { BrowserWindow } from 'electron';
import { logger } from '../../utils/logger';
import { CONNECTIVITY_CHECK_INTERVAL_MS, CONNECTIVITY_PING_URL } from '../../../src/config/appConfig';
import fetch from 'node-fetch';

type ConnectivityStatus = 'online' | 'offline' | 'degraded';

let checkInterval: NodeJS.Timeout | null = null;
let currentStatus: ConnectivityStatus = 'online';
let mainWindow: BrowserWindow | null = null;

export function startConnectivityMonitoring(window: BrowserWindow): void {
  mainWindow = window;

  // Initial check
  checkConnectivity();

  // Periodic checks
  checkInterval = setInterval(() => {
    checkConnectivity();
  }, CONNECTIVITY_CHECK_INTERVAL_MS);

  logger.info('Connectivity monitoring started');
}

export function stopConnectivityMonitoring(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }

  logger.info('Connectivity monitoring stopped');
}

async function checkConnectivity(): Promise<void> {
  try {
    // Try multiple checks in parallel for faster results
    const checks = await Promise.allSettled([
      checkHTTPConnectivity(),
      checkDNSResolution(),
    ]);

    const httpCheck = checks[0].status === 'fulfilled' && checks[0].value;
    const dnsCheck = checks[1].status === 'fulfilled' && checks[1].value;

    let newStatus: ConnectivityStatus;

    if (httpCheck && dnsCheck) {
      newStatus = 'online';
    } else if (httpCheck || dnsCheck) {
      newStatus = 'degraded';
    } else {
      newStatus = 'offline';
    }

    if (newStatus !== currentStatus) {
      logger.info(`Connectivity status changed: ${currentStatus} -> ${newStatus}`);
      currentStatus = newStatus;

      // Notify renderer process
      if (mainWindow) {
        mainWindow.webContents.send('connectivity:statusChange', {
          status: newStatus,
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    logger.error('Error checking connectivity:', error);
  }
}

async function checkHTTPConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(CONNECTIVITY_PING_URL, {
      method: 'HEAD',
      signal: controller.signal as any,
    });

    clearTimeout(timeout);

    return response.ok || response.status === 204;
  } catch (error) {
    return false;
  }
}

async function checkDNSResolution(): Promise<boolean> {
  try {
    const dns = require('dns').promises;
    await dns.resolve('www.google.com');
    return true;
  } catch (error) {
    return false;
  }
}

export function getCurrentStatus(): ConnectivityStatus {
  return currentStatus;
}
