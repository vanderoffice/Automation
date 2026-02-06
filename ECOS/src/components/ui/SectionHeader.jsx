function SectionHeader({ title, description, action }) {
  return (
    <div className="border-b border-neutral-800 pb-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="text-sm text-neutral-400 mt-1">{description}</p>
      )}
    </div>
  )
}

export { SectionHeader }
