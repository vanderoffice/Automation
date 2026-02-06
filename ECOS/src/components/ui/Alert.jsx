const variants = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  success: 'bg-green-500/10 border-green-500/20 text-green-300',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
  error: 'bg-red-500/10 border-red-500/20 text-red-300',
}

function Alert({
  children,
  variant = 'info',
  title,
  dismissible,
  onDismiss,
}) {
  const base = 'rounded-lg border p-4 relative'

  return (
    <div
      className={base + ' ' + (variants[variant] || variants.info)}
    >
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      {title && <p className="font-medium mb-1">{title}</p>}
      <div>{children}</div>
    </div>
  )
}

export { Alert }
