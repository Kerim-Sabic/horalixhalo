/**
 * Transcript segment domain model
 */

export type Speaker = 'you' | 'other' | string;

export interface TranscriptSegment {
  id: string;
  meetingId: string;
  createdAt: string;
  startTimeOffsetSec: number;
  endTimeOffsetSec: number;
  speaker: Speaker;
  text: string;
  isFinal: boolean;
  confidence: number | null;
}

export interface CreateTranscriptSegmentInput {
  meetingId: string;
  startTimeOffsetSec: number;
  endTimeOffsetSec: number;
  speaker: Speaker;
  text: string;
  isFinal: boolean;
  confidence?: number | null;
}

export interface UpdateTranscriptSegmentInput {
  text?: string;
  endTimeOffsetSec?: number;
  isFinal?: boolean;
  confidence?: number | null;
}

/**
 * Helper to format transcript for display
 */
export function formatTranscriptSegments(segments: TranscriptSegment[]): string {
  return segments
    .map((seg) => {
      const time = formatTimeOffset(seg.startTimeOffsetSec);
      const speaker = seg.speaker === 'you' ? 'You' : seg.speaker;
      return `[${time}] ${speaker}: ${seg.text}`;
    })
    .join('\n');
}

/**
 * Format time offset in seconds to MM:SS
 */
export function formatTimeOffset(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
