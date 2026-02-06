import { useState, useCallback } from 'react'
import { SectionHeader } from '../ui/SectionHeader'
import { CollapsibleSection } from './CollapsibleSection'

function BulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
          <span className="text-neutral-500 mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SecurityContentSection({ sections }) {
  const [openedSections, setOpenedSections] = useState(
    // First section defaults open — counts as reviewed
    new Set(sections.length > 0 ? [sections[0].id] : [])
  )

  const totalCount = sections.length
  const openedCount = sections.filter((s) => openedSections.has(s.id)).length

  const handleOpen = useCallback((sectionId) => {
    setOpenedSections((prev) => {
      const next = new Set(prev)
      next.add(sectionId)
      return next
    })
  }, [])

  return (
    <div>
      <SectionHeader
        title="Security Requirements"
        description="By completing this agreement, you acknowledge that you have read, understand, and agree to comply with the following security requirements for ECOS system access."
      />

      <div className="space-y-2">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={section.id}
            id={section.id}
            title={section.title}
            defaultOpen={index === 0}
            onOpen={handleOpen}
          >
            <BulletList items={section.content} />
          </CollapsibleSection>
        ))}
      </div>

      <p className="text-xs text-neutral-500 mt-3">
        {openedCount} of {totalCount} sections reviewed
      </p>
    </div>
  )
}

export { SecurityContentSection }
