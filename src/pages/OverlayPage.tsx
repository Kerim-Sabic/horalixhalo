import { useState } from 'react';
import { useOverlayStore } from '../store/overlayStore';
import clsx from 'clsx';

export default function OverlayPage() {
  const { isExpanded, currentResult, expand, collapse, toggle, setResult } = useOverlayStore();

  const actions = [
    { id: 'say', label: 'Say', emoji: '💬', shortcut: 'Ctrl+Alt+S' },
    { id: 'followup', label: 'Follow-up', emoji: '❓', shortcut: 'Ctrl+Alt+F' },
    { id: 'recap', label: 'Recap', emoji: '📝', shortcut: 'Ctrl+Alt+R' },
    { id: 'actions', label: 'Actions', emoji: '✅', shortcut: 'Ctrl+Alt+A' },
  ];

  const handleAction = (actionId: string) => {
    // TODO: Trigger IPC call for AI action
    setResult({
      title: `${actionId} result`,
      body: 'AI response will appear here',
    });
  };

  return (
    <div className="relative">
      {!isExpanded ? (
        /* Halo Dot - Collapsed State */
        <div
          className="group cursor-pointer"
          onMouseEnter={expand}
          onClick={expand}
        >
          <div className="w-12 h-12 rounded-full bg-primary-600 shadow-halo flex items-center justify-center animate-pulse-subtle">
            <span className="text-white text-xl">✨</span>
          </div>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ctrl+Alt+H for commands
          </div>
        </div>
      ) : (
        /* Expanded Toolbar */
        <div
          className="bg-white rounded-lg shadow-xl border border-neutral-200 p-4 min-w-[320px] animate-slide-in"
          onMouseLeave={() => {
            // Auto-collapse after delay if no result
            if (!currentResult) {
              setTimeout(collapse, 3000);
            }
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-semibold text-neutral-900 text-sm">Horalix Halo</span>
            </div>
            <button
              onClick={collapse}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-2 mb-4">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-neutral-100 transition-colors"
              >
                <span className="text-lg">{action.emoji}</span>
                <span className="flex-1 font-medium text-neutral-900">{action.label}</span>
                <span className="text-xs text-neutral-500">{action.shortcut}</span>
              </button>
            ))}
          </div>

          {/* Result */}
          {currentResult && (
            <div className="border-t pt-4 mt-4">
              <div className="bg-primary-50 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm text-primary-900">{currentResult.title}</div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-primary-800">{currentResult.body}</div>
                <div className="text-xs text-primary-600">
                  {new Date(currentResult.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
