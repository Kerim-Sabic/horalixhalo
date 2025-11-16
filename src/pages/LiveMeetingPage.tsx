import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useMeetingStore } from '../store/meetingStore';
import { formatTimeOffset } from '../models/Transcript';

export default function LiveMeetingPage() {
  const {
    currentMeeting,
    liveTranscript,
    livePartialText,
    isRecording,
    elapsedSeconds,
    setRecording,
    setElapsedSeconds,
  } = useMeetingStore();

  const [meetingTitle, setMeetingTitle] = useState('New Meeting');
  const [meetingGoal, setMeetingGoal] = useState('');
  const [notes, setNotes] = useState('');

  // Timer effect
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setElapsedSeconds(elapsedSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, elapsedSeconds, setElapsedSeconds]);

  const handleStartMeeting = async () => {
    // TODO: Call IPC to create meeting and start ASR
    setRecording(true);
  };

  const handleStopMeeting = async () => {
    // TODO: Call IPC to stop ASR and finalize meeting
    setRecording(false);
  };

  return (
    <div className="h-full flex">
      {/* Left column - Transcript */}
      <div className="flex-1 flex flex-col border-r border-neutral-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <Input
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="text-xl font-semibold border-none focus:ring-0 p-0"
              placeholder="Meeting Title"
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isRecording ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-neutral-900">Recording</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-neutral-300 rounded-full" />
                  <span className="text-sm text-neutral-600">Not recording</span>
                </>
              )}
            </div>

            <div className="text-sm text-neutral-600">
              {formatTimeOffset(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Transcript area */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 space-y-4">
          {liveTranscript.length === 0 && !livePartialText && (
            <div className="text-center text-neutral-500 py-12">
              <div className="text-6xl mb-4">🎙️</div>
              <div className="text-lg">No transcript yet</div>
              <div className="text-sm">Start recording to see live transcription</div>
            </div>
          )}

          {liveTranscript.map((segment) => (
            <div key={segment.id} className="flex gap-3">
              <div className="text-xs text-neutral-500 w-12 flex-shrink-0">
                {formatTimeOffset(segment.startTimeOffsetSec)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-neutral-900">
                    {segment.speaker === 'you' ? 'You' : segment.speaker}
                  </span>
                  <Badge variant="default" size="sm">
                    {segment.isFinal ? 'final' : 'partial'}
                  </Badge>
                </div>
                <div className="text-sm text-neutral-700">{segment.text}</div>
              </div>
            </div>
          ))}

          {livePartialText && (
            <div className="flex gap-3 opacity-70">
              <div className="text-xs text-neutral-500 w-12 flex-shrink-0">
                {formatTimeOffset(elapsedSeconds)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-neutral-700 italic">{livePartialText}...</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-neutral-200 bg-white flex items-center gap-3">
          {!isRecording ? (
            <Button onClick={handleStartMeeting} size="lg" fullWidth>
              Start Meeting
            </Button>
          ) : (
            <>
              <Button onClick={handleStopMeeting} variant="danger" size="lg" fullWidth>
                Stop Meeting
              </Button>
              <Button variant="ghost" size="lg">
                Pause
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Right column - Context & AI */}
      <div className="w-96 bg-white overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Context */}
          <Card>
            <h3 className="font-semibold text-neutral-900 mb-3">Context</h3>
            <div className="space-y-3">
              <Input
                label="Meeting Goal"
                placeholder="What's the purpose of this meeting?"
                value={meetingGoal}
                onChange={(e) => setMeetingGoal(e.target.value)}
                fullWidth
              />
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 block">
                  Notes
                </label>
                <textarea
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Add your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* AI Outputs */}
          <Card>
            <h3 className="font-semibold text-neutral-900 mb-3">AI Outputs</h3>
            <div className="space-y-3">
              <div className="text-sm text-neutral-600">
                AI summaries and insights will appear here during the meeting.
              </div>
              {/* Placeholder for AI outputs */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
