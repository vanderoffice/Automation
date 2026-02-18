function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ' +
              (isActive
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent')
            }
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={
                  'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ' +
                  (isActive
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-neutral-800 text-neutral-500')
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { TabBar }
