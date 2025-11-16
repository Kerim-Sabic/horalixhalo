import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Load meeting details from database
  const meeting = null;

  if (!meeting) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-lg text-neutral-900 mb-2">Meeting not found</div>
          <Button onClick={() => navigate('/meetings')}>Back to Meetings</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-neutral-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/meetings')}>
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-neutral-900 mt-2">Meeting Title</h1>
            <div className="text-sm text-neutral-600 mt-1">
              Date • Duration
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">Copy Summary</Button>
            <Button variant="ghost">Export</Button>
          </div>
        </div>

        {/* Summary */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Summary</h2>
          <p className="text-neutral-700">
            Meeting summary will appear here.
          </p>
        </Card>

        {/* Transcript */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Transcript</h2>
          <div className="text-neutral-700">
            Transcript segments will appear here.
          </div>
        </Card>

        {/* Action Items */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Action Items</h2>
          <div className="text-neutral-600 text-sm">
            No action items yet.
          </div>
        </Card>
      </div>
    </div>
  );
}
