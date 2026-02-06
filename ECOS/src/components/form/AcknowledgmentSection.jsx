import { SectionHeader } from '../ui/SectionHeader'
import { Card } from '../ui/Card'

function AcknowledgmentSection({ sections, acknowledged, onToggle }) {
  const sectionTitles = sections.map((s) => s.title)

  return (
    <div>
      <SectionHeader title="Acknowledgment" />

      <Card>
        <button
          type="button"
          onClick={onToggle}
          className={
            'w-full flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all duration-200 ' +
            (acknowledged
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-neutral-700 bg-neutral-900/30 hover:border-orange-500/40')
          }
        >
          {/* Custom checkbox */}
          <div
            className={
              'flex-shrink-0 mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ' +
              (acknowledged
                ? 'bg-green-500 border-green-500'
                : 'border-neutral-500 bg-transparent')
            }
          >
            {acknowledged && (
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>

          <div className="min-w-0">
            <p className={'font-medium ' + (acknowledged ? 'text-green-400' : 'text-white')}>
              I have read and understand all security requirements
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Covering: {sectionTitles.join(', ')}
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Required before submission. You will sign electronically after submitting.
            </p>
          </div>
        </button>
      </Card>
    </div>
  )
}

export { AcknowledgmentSection }
