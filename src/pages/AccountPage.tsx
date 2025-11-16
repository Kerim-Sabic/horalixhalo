import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { usePlanStore } from '../store/planStore';

export default function AccountPage() {
  const plan = usePlanStore((state) => state.plan);
  const usage = usePlanStore((state) => state.usage);

  return (
    <div className="h-full overflow-y-auto bg-neutral-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Account</h1>

        {/* Current Plan */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Current Plan</h2>
              <Badge variant={plan?.tier === 'pro' ? 'success' : 'default'} size="md">
                {plan?.tier === 'pro' ? 'Pro' : 'Free'}
              </Badge>
            </div>
            {plan?.tier === 'free' && (
              <Button>Upgrade to Pro</Button>
            )}
          </div>

          <div className="space-y-3 text-sm">
            {plan?.tier === 'free' ? (
              <>
                <div>✓ 50 meetings per month</div>
                <div>✓ 300 minutes of transcription per month</div>
                <div>✓ 100 AI requests per day</div>
                <div>✓ Local AI support (unlimited)</div>
              </>
            ) : (
              <>
                <div>✓ Unlimited meetings</div>
                <div>✓ Unlimited transcription</div>
                <div>✓ Unlimited AI requests</div>
                <div>✓ Calendar integration</div>
                <div>✓ Advanced features</div>
              </>
            )}
          </div>
        </Card>

        {/* Usage */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Usage This Month</h2>
          <div className="space-y-4">
            {/* Meetings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">Meetings</span>
                <span className="text-sm text-neutral-600">
                  {usage?.meetingsCreated || 0} / {plan?.tier === 'free' ? 50 : '∞'}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${plan?.tier === 'free' ? ((usage?.meetingsCreated || 0) / 50) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* ASR Minutes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">Transcription Minutes</span>
                <span className="text-sm text-neutral-600">
                  {Math.floor(usage?.asrMinutesUsed || 0)} / {plan?.tier === 'free' ? 300 : '∞'}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${plan?.tier === 'free' ? ((usage?.asrMinutesUsed || 0) / 300) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* AI Requests Today */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">AI Requests Today</span>
                <span className="text-sm text-neutral-600">
                  {usage?.aiRequestsToday || 0} / {plan?.tier === 'free' ? 100 : '∞'}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${plan?.tier === 'free' ? ((usage?.aiRequestsToday || 0) / 100) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Activation */}
        {plan?.tier === 'free' && (
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Activate Pro
            </h2>
            <div className="space-y-3">
              <Input
                label="Activation Code"
                placeholder="Enter your activation code"
                fullWidth
              />
              <Button>Activate</Button>
            </div>
            <div className="mt-4 text-sm text-neutral-600">
              Don't have a code?{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Learn about Pro
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
