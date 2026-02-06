import { SectionHeader } from '../ui/SectionHeader'
import { Card } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { accessGroups } from '../../data/accessGroups'

function AccessGroupSection({ selectedGroups, onChange, track }) {
  if (track === 'annual_renewal') {
    return (
      <div>
        <SectionHeader
          title="ECOS Access Groups"
          description="Your current access groups will be renewed with this agreement."
        />
        <Card>
          <div className="space-y-3">
            {accessGroups.map((group) => (
              <Checkbox
                key={group.id}
                name={'group-' + group.id}
                label={group.name}
                description={group.description}
                checked={selectedGroups.includes(group.id)}
                onChange={() => onChange(group.id)}
              />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader
        title="ECOS Access Groups"
        description="Select the system access levels required for this employee's role."
      />
      <Card>
        <div className="space-y-3">
          {accessGroups.map((group) => (
            <Checkbox
              key={group.id}
              name={'group-' + group.id}
              label={group.name}
              description={group.description}
              checked={selectedGroups.includes(group.id)}
              onChange={() => onChange(group.id)}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}

export { AccessGroupSection }
