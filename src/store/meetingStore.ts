/**
 * Meeting store using Zustand
 */

import { create } from 'zustand';
import type { Meeting } from '../models/Meeting';
import type { TranscriptSegment } from '../models/Transcript';

interface MeetingState {
  currentMeetingId: string | null;
  currentMeeting: Meeting | null;
  liveTranscript: TranscriptSegment[];
  livePartialText: string;
  isRecording: boolean;
  elapsedSeconds: number;
  setCurrentMeeting: (meeting: Meeting | null) => void;
  setLiveTranscript: (segments: TranscriptSegment[]) => void;
  addTranscriptSegment: (segment: TranscriptSegment) => void;
  setLivePartialText: (text: string) => void;
  setRecording: (recording: boolean) => void;
  setElapsedSeconds: (seconds: number) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  currentMeetingId: null,
  currentMeeting: null,
  liveTranscript: [],
  livePartialText: '',
  isRecording: false,
  elapsedSeconds: 0,
  setCurrentMeeting: (meeting) =>
    set({
      currentMeeting: meeting,
      currentMeetingId: meeting?.id || null,
    }),
  setLiveTranscript: (segments) => set({ liveTranscript: segments }),
  addTranscriptSegment: (segment) =>
    set((state) => ({
      liveTranscript: [...state.liveTranscript, segment],
    })),
  setLivePartialText: (text) => set({ livePartialText: text }),
  setRecording: (isRecording) => set({ isRecording }),
  setElapsedSeconds: (elapsedSeconds) => set({ elapsedSeconds }),
  reset: () =>
    set({
      currentMeetingId: null,
      currentMeeting: null,
      liveTranscript: [],
      livePartialText: '',
      isRecording: false,
      elapsedSeconds: 0,
    }),
}));
