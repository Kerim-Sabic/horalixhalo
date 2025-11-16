import { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'ai', label: 'AI Providers' },
    { id: 'privacy', label: 'Data & Privacy' },
    { id: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="h-full flex bg-neutral-50">
      {/* Tabs sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 p-4">
        <h1 className="text-xl font-bold text-neutral-900 mb-4 px-2">Settings</h1>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {activeTab === 'general' && (
            <>
              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Theme
                    </label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                      <option>System</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Behavior</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-neutral-700">Start on system boot</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-neutral-700">Auto-detect meetings</span>
                  </label>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'ai' && (
            <>
              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Transcription (ASR)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Provider
                    </label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                      <option>Dummy (Testing)</option>
                      <option>Local Whisper</option>
                      <option>Deepgram</option>
                      <option>OpenAI Whisper</option>
                    </select>
                  </div>
                  <Input label="API Key" type="password" fullWidth />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  AI Brain (LLM)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Primary Provider
                    </label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                      <option>Local HTTP Server</option>
                      <option>DeepSeek</option>
                      <option>OpenAI</option>
                      <option>Anthropic (Claude)</option>
                    </select>
                  </div>
                  <Input label="API Key" type="password" fullWidth />
                </div>
              </Card>
            </>
          )}

          {activeTab === 'privacy' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Data & Privacy
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Data Retention
                  </label>
                  <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                    <option>Forever</option>
                    <option>30 days</option>
                    <option>90 days</option>
                    <option>1 year</option>
                  </select>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="danger">Clear All Data</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'advanced' && (
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Advanced Settings
              </h2>
              <div className="space-y-4">
                <Input label="LLM Temperature" type="number" step="0.1" defaultValue="0.7" fullWidth />
                <Input label="Max Tokens" type="number" defaultValue="2048" fullWidth />
                <Input label="ASR Debounce (ms)" type="number" defaultValue="500" fullWidth />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
