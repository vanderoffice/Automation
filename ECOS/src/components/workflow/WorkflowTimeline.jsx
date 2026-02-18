/**
 * Generic N-step workflow timeline.
 * Shows a vertical list of steps with dot/checkmark indicators and connecting lines.
 *
 * Props:
 *   steps    - Array of { id, label } defining the workflow order
 *   data     - Object keyed by step.id, each value has at least { completed: bool }
 *              and optionally { name, timestamp } for signed-step details
 *   currentId - The step.id that is currently active (pulsing dot)
 */

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return diffMin + 'm ago'
  if (diffHr < 24) return diffHr + 'h ago'
  if (diffDay < 7) return diffDay + 'd ago'
  return date.toLocaleDateString()
}

function WorkflowTimeline({ steps, data, currentId }) {
  return (
    <div className="relative ml-1">
      {steps.map((step, i) => {
        const info = data[step.id] || {}
        const isDone = !!info.completed
        const isCurrent = step.id === currentId
        const isLast = i === steps.length - 1

        return (
          <div key={step.id} className="relative flex items-start gap-3 pb-6 last:pb-0">
            {!isLast && (
              <div
                className={
                  'absolute left-[7px] top-[18px] w-0.5 h-[calc(100%-10px)] ' +
                  (isDone ? 'bg-green-500/40' : 'bg-neutral-700')
                }
              />
            )}
            <div className="relative flex-shrink-0 mt-0.5">
              {isDone ? (
                <div className="w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full bg-orange-500/20 border-2 border-orange-500 animate-pulse" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-neutral-800 border-2 border-neutral-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className={'text-sm font-medium ' + (isDone ? 'text-green-400' : isCurrent ? 'text-orange-400' : 'text-neutral-500')}>
                {step.label}
              </p>
              {isDone && info.name ? (
                <div className="mt-0.5">
                  <p className="text-xs text-neutral-400">{info.name}</p>
                  {info.timestamp && (
                    <p className="text-xs text-neutral-500 font-mono">{formatRelativeTime(info.timestamp)}</p>
                  )}
                </div>
              ) : isCurrent ? (
                <p className="text-xs text-orange-400/70 mt-0.5">Awaiting</p>
              ) : (
                <p className="text-xs text-neutral-600 mt-0.5">Pending</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { WorkflowTimeline, formatRelativeTime }
