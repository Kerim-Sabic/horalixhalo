/**
 * Meeting domain model
 */

export type MeetingStatus = 'ongoing' | 'completed' | 'aborted';
export type MeetingSource = 'manual' | 'google_calendar' | 'outlook' | 'other' | null;

export interface Meeting {
  id: string;
  title: string;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number;
  source: MeetingSource;
  calendarEventId: string | null;
  participants: string[];
  tags: string[];
  status: MeetingStatus;
  summaryShort: string | null;
  summaryDetailed: string | null;
  decisions: string[] | null;
  risks: string[] | null;
  followUpQuestions: string[] | null;
  useCaseProfile: string | null;
  isInPerson: boolean;
}

export interface CreateMeetingInput {
  title: string;
  source?: MeetingSource;
  calendarEventId?: string | null;
  participants?: string[];
  tags?: string[];
  useCaseProfile?: string | null;
  isInPerson?: boolean;
}

export interface UpdateMeetingInput {
  title?: string;
  endTime?: string;
  durationSeconds?: number;
  participants?: string[];
  tags?: string[];
  status?: MeetingStatus;
  summaryShort?: string;
  summaryDetailed?: string;
  decisions?: string[];
  risks?: string[];
  followUpQuestions?: string[];
  isInPerson?: boolean;
}
