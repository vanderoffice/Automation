function Card({ children, title, className = '', padding = true }) {
  const base = 'bg-[#0b0b0b] border border-neutral-800 rounded-lg glow-box'

  return (
    <div className={base + (className ? ' ' + className : '')}>
      {title && (
        <div className="px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className={padding ? 'px-6 py-6' : 'p-0'}>{children}</div>
    </div>
  )
}

export { Card }
