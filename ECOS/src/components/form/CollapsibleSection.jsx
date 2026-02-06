import { useState } from 'react'

function CollapsibleSection({ title, children, defaultOpen = false, id, onOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (next && onOpen) onOpen(id)
      return next
    })
  }

  return (
    <div
      id={id}
      className="border border-neutral-800 rounded-lg overflow-hidden"
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center gap-2 px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-left"
      >
        <span className="text-neutral-400 text-sm flex-shrink-0">
          {isOpen ? '▾' : '▸'}
        </span>
        <span className="text-white font-medium text-sm">{title}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-neutral-800">
          {children}
        </div>
      )}
    </div>
  )
}

export { CollapsibleSection }
