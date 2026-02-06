const variants = {
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  neutral: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  accent: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

function Badge({ children, variant = 'neutral', size = 'md' }) {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium'

  return (
    <span
      className={base + ' ' + (variants[variant] || variants.neutral)}
    >
      {children}
    </span>
  )
}

export { Badge }
