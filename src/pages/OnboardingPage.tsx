import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { APP_NAME } from '../config/appConfig';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState<string>('sales');

  const handleComplete = () => {
    // TODO: Save onboarding completion to settings
    navigate('/live');
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-8">
      <Card className="w-full max-w-2xl" padding="lg">
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-600">Step {step} of 3</div>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-12 rounded-full ${
                    s <= step ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          {step === 1 && (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-neutral-900">
                Welcome to {APP_NAME}
              </h1>
              <p className="text-neutral-600">
                Your invisible AI meeting assistant. Capture, coach, and recall every conversation.
              </p>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>✓ Live transcription with offline support</li>
                <li>✓ AI-powered insights and suggestions</li>
                <li>✓ Stealth overlay for in-meeting help</li>
                <li>✓ Works with free and paid AI providers</li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900">Choose Your Use Case</h2>
              <p className="text-neutral-600">
                This helps us tailor AI prompts for your needs.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sales', label: 'Sales & Demos', emoji: '💼' },
                  { id: 'internal', label: 'Team Meetings', emoji: '👥' },
                  { id: 'standup', label: 'Standups', emoji: '🚀' },
                  { id: 'support', label: 'Customer Support', emoji: '🎧' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setUseCase(option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      useCase === option.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="font-medium text-neutral-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900">All Set!</h2>
              <p className="text-neutral-600">
                You're ready to start using {APP_NAME}. You can configure AI providers in Settings.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="font-medium text-blue-900">Quick Tip</div>
                <div className="text-sm text-blue-700">
                  Press <kbd className="px-2 py-1 bg-white rounded border">Ctrl+Alt+H</kbd> to toggle the invisible overlay during any meeting.
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <div className="ml-auto">
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button onClick={handleComplete}>Start Using {APP_NAME}</Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
