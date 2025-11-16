/**
 * Type declarations for Electron IPC API
 */

export interface ElectronAPI {
  // Settings
  getSettings: () => Promise<any>;
  updateSettings: (settings: any) => Promise<any>;

  // Meetings
  createMeeting: (input: any) => Promise<any>;
  getMeeting: (id: string) => Promise<any>;
  getAllMeetings: (limit?: number, offset?: number) => Promise<any[]>;
  updateMeeting: (id: string, input: any) => Promise<any>;
  deleteMeeting: (id: string) => Promise<boolean>;

  // Transcripts
  getTranscriptByMeeting: (meetingId: string) => Promise<any[]>;

  // Action Items
  createActionItem: (input: any) => Promise<any>;
  getActionItemsByMeeting: (meetingId: string) => Promise<any[]>;
  updateActionItem: (id: string, input: any) => Promise<any>;
  deleteActionItem: (id: string) => Promise<boolean>;

  // Plan
  getCurrentPlan: () => Promise<any>;
  updatePlan: (input: any) => Promise<any>;

  // AI Usage
  getCurrentUsage: () => Promise<any>;

  // ASR
  startASR: (meetingId: string) => Promise<void>;
  stopASR: () => Promise<void>;
  pauseASR: () => Promise<void>;
  resumeASR: () => Promise<void>;

  // LLM Actions
  generateSummary: (input: any) => Promise<any>;
  suggestReply: (input: any) => Promise<any>;
  generateFollowup: (input: any) => Promise<any>;
  extractActionItems: (input: any) => Promise<any>;
  analyzeRisks: (input: any) => Promise<any>;
  transformTone: (input: any) => Promise<any>;

  // Overlay control
  showOverlay: () => Promise<void>;
  hideOverlay: () => Promise<void>;
  toggleOverlay: () => Promise<void>;

  // Event listeners
  onTranscriptPartial: (callback: (event: any, data: any) => void) => void;
  onTranscriptFinal: (callback: (event: any, data: any) => void) => void;
  onMeetingStatusChange: (callback: (event: any, data: any) => void) => void;
  onStartNewMeeting: (callback: (event: any) => void) => void;
  removeListener: (channel: string, callback: any) => void;

  // Environment
  getAppVersion: () => Promise<string>;
  getPlatform: () => string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
