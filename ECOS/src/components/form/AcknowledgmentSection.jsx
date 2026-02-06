import { SectionHeader } from '../ui/SectionHeader'
import { Card } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'

function AcknowledgmentSection({ sections, acknowledgments, onChange, showAdminSection = false, adminSection }) {
  const allSections = showAdminSection && adminSection
    ? [...sections, adminSection]
    : sections

  const totalCount = allSections.length
  const acknowledgedCount = allSections.filter((s) => acknowledgments[s.id]).length

  const handleSelectAll = () => {
    allSections.forEach((s) => {
      if (!acknowledgments[s.id]) {
        onChange(s.id)
      }
    })
  }

  const progressColor =
    acknowledgedCount === totalCount
      ? 'text-green-500'
      : acknowledgedCount > 0
        ? 'text-yellow-500'
        : 'text-neutral-500'

  return (
    <div>
      <SectionHeader
        title="Acknowledgments"
        action={
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Select All
          </button>
        }
      />

      <Card>
        <div className="space-y-4">
          {sections.map((section) => (
            <Checkbox
              key={section.id}
              name={'ack-' + section.id}
              label={'I have read and understand: ' + section.title}
              checked={!!acknowledgments[section.id]}
              onChange={() => onChange(section.id)}
            />
          ))}

          {showAdminSection && adminSection && (
            <div className="border-t border-neutral-800 pt-4 mt-4">
              <Checkbox
                name={'ack-' + adminSection.id}
                label={'I have read and understand: ' + adminSection.title}
                checked={!!acknowledgments[adminSection.id]}
                onChange={() => onChange(adminSection.id)}
                description="Required for users with administrative access"
              />
            </div>
          )}
        </div>

        <p className={'text-xs mt-4 ' + progressColor}>
          {acknowledgedCount} of {totalCount} acknowledged
        </p>
      </Card>
    </div>
  )
}

export { AcknowledgmentSection }
