import { Card } from '../ui'

const tracks = [
  {
    id: 'new_updated',
    icon: '🆕',
    title: 'New / Updated User',
    description: 'Complete security agreement with full access group selection',
  },
  {
    id: 'annual_renewal',
    icon: '🔄',
    title: 'Annual Renewal',
    description: 'Confirm existing access and renew for the current fiscal year',
  },
]

function TrackSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tracks.map((track) => {
        const selected = value === track.id
        const borderClass = selected
          ? 'border-orange-500 glow-box'
          : 'border-neutral-800 hover:border-neutral-600'

        return (
          <button
            key={track.id}
            type="button"
            onClick={() => onChange(track.id)}
            className={
              'bg-[#0b0b0b] border rounded-lg px-6 py-6 text-left transition-all duration-200 cursor-pointer ' +
              borderClass
            }
          >
            <div className="text-3xl mb-3">{track.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {track.title}
            </h3>
            <p className="text-sm text-neutral-400">{track.description}</p>
          </button>
        )
      })}
    </div>
  )
}

export { TrackSelector }
