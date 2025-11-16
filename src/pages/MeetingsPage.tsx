import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function MeetingsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Load meetings from database via IPC
  const meetings = [];

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-neutral-900">Meetings</h1>
          <Button onClick={() => navigate('/live')}>New Meeting</Button>
        </div>

        <Input
          placeholder="Search meetings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </div>

      {/* Meetings list */}
      <div className="flex-1 overflow-y-auto p-6">
        {meetings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-lg text-neutral-900 mb-2">No meetings yet</div>
            <div className="text-sm text-neutral-600 mb-6">
              Start your first meeting to see it here
            </div>
            <Button onClick={() => navigate('/live')}>Start First Meeting</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((meeting: any) => (
              <Card
                key={meeting.id}
                hover
                className="cursor-pointer"
                onClick={() => navigate(`/meetings/${meeting.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">{meeting.title}</h3>
                    <div className="text-sm text-neutral-600 mb-2">
                      {new Date(meeting.startTime).toLocaleDateString()} •{' '}
                      {Math.floor(meeting.durationSeconds / 60)} min
                    </div>
                    {meeting.summaryShort && (
                      <p className="text-sm text-neutral-700 line-clamp-2">
                        {meeting.summaryShort}
                      </p>
                    )}
                  </div>
                  <Badge variant={meeting.status === 'completed' ? 'success' : 'warning'}>
                    {meeting.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
