/**
 * Preload script - exposes safe IPC APIs to renderer
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Expose protected methods that allow the renderer process to use ipcRenderer
// without exposing the entire ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: any) => ipcRenderer.invoke('settings:update', settings),

  // Meetings
  createMeeting: (input: any) => ipcRenderer.invoke('meeting:create', input),
  getMeeting: (id: string) => ipcRenderer.invoke('meeting:get', id),
  getAllMeetings: (limit?: number, offset?: number) =>
    ipcRenderer.invoke('meeting:getAll', limit, offset),
  updateMeeting: (id: string, input: any) => ipcRenderer.invoke('meeting:update', id, input),
  deleteMeeting: (id: string) => ipcRenderer.invoke('meeting:delete', id),

  // Transcripts
  getTranscriptByMeeting: (meetingId: string) =>
    ipcRenderer.invoke('transcript:getByMeeting', meetingId),

  // Action Items
  createActionItem: (input: any) => ipcRenderer.invoke('actionItem:create', input),
  getActionItemsByMeeting: (meetingId: string) =>
    ipcRenderer.invoke('actionItem:getByMeeting', meetingId),
  updateActionItem: (id: string, input: any) =>
    ipcRenderer.invoke('actionItem:update', id, input),
  deleteActionItem: (id: string) => ipcRenderer.invoke('actionItem:delete', id),

  // Plan
  getCurrentPlan: () => ipcRenderer.invoke('plan:getCurrent'),
  updatePlan: (input: any) => ipcRenderer.invoke('plan:update', input),

  // AI Usage
  getCurrentUsage: () => ipcRenderer.invoke('usage:getCurrent'),

  // ASR
  startASR: (meetingId: string) => ipcRenderer.invoke('asr:start', meetingId),
  stopASR: () => ipcRenderer.invoke('asr:stop'),
  pauseASR: () => ipcRenderer.invoke('asr:pause'),
  resumeASR: () => ipcRenderer.invoke('asr:resume'),

  // LLM Actions
  generateSummary: (input: any) => ipcRenderer.invoke('llm:generateSummary', input),
  suggestReply: (input: any) => ipcRenderer.invoke('llm:suggestReply', input),
  generateFollowup: (input: any) => ipcRenderer.invoke('llm:generateFollowup', input),
  extractActionItems: (input: any) => ipcRenderer.invoke('llm:extractActionItems', input),
  analyzeRisks: (input: any) => ipcRenderer.invoke('llm:analyzeRisks', input),
  transformTone: (input: any) => ipcRenderer.invoke('llm:transformTone', input),

  // Overlay control
  showOverlay: () => ipcRenderer.invoke('overlay:show'),
  hideOverlay: () => ipcRenderer.invoke('overlay:hide'),
  toggleOverlay: () => ipcRenderer.invoke('overlay:toggle'),

  // Event listeners
  onTranscriptPartial: (callback: (event: IpcRendererEvent, data: any) => void) => {
    ipcRenderer.on('transcript:partial', callback);
  },
  onTranscriptFinal: (callback: (event: IpcRendererEvent, data: any) => void) => {
    ipcRenderer.on('transcript:final', callback);
  },
  onMeetingStatusChange: (callback: (event: IpcRendererEvent, data: any) => void) => {
    ipcRenderer.on('meeting:statusChange', callback);
  },
  onStartNewMeeting: (callback: (event: IpcRendererEvent) => void) => {
    ipcRenderer.on('start-new-meeting', callback);
  },

  // Remove listeners
  removeListener: (channel: string, callback: any) => {
    ipcRenderer.removeListener(channel, callback);
  },

  // Environment
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => process.platform,
});

// Declare the type for TypeScript (this would normally go in a .d.ts file)
export interface ElectronAPI {
  getSettings: () => Promise<any>;
  updateSettings: (settings: any) => Promise<any>;
  createMeeting: (input: any) => Promise<any>;
  getMeeting: (id: string) => Promise<any>;
  getAllMeetings: (limit?: number, offset?: number) => Promise<any[]>;
  updateMeeting: (id: string, input: any) => Promise<any>;
  deleteMeeting: (id: string) => Promise<boolean>;
  getTranscriptByMeeting: (meetingId: string) => Promise<any[]>;
  createActionItem: (input: any) => Promise<any>;
  getActionItemsByMeeting: (meetingId: string) => Promise<any[]>;
  updateActionItem: (id: string, input: any) => Promise<any>;
  deleteActionItem: (id: string) => Promise<boolean>;
  getCurrentPlan: () => Promise<any>;
  updatePlan: (input: any) => Promise<any>;
  getCurrentUsage: () => Promise<any>;
  startASR: (meetingId: string) => Promise<void>;
  stopASR: () => Promise<void>;
  pauseASR: () => Promise<void>;
  resumeASR: () => Promise<void>;
  generateSummary: (input: any) => Promise<any>;
  suggestReply: (input: any) => Promise<any>;
  generateFollowup: (input: any) => Promise<any>;
  extractActionItems: (input: any) => Promise<any>;
  analyzeRisks: (input: any) => Promise<any>;
  transformTone: (input: any) => Promise<any>;
  showOverlay: () => Promise<void>;
  hideOverlay: () => Promise<void>;
  toggleOverlay: () => Promise<void>;
  onTranscriptPartial: (callback: (event: any, data: any) => void) => void;
  onTranscriptFinal: (callback: (event: any, data: any) => void) => void;
  onMeetingStatusChange: (callback: (event: any, data: any) => void) => void;
  onStartNewMeeting: (callback: (event: any) => void) => void;
  removeListener: (channel: string, callback: any) => void;
  getAppVersion: () => Promise<string>;
  getPlatform: () => string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
