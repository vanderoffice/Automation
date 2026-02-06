import { useState } from 'react'
import { SectionHeader } from '../ui/SectionHeader'
import { Card } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { accessGroups } from '../../data/accessGroups'

const standardGroups = accessGroups.filter((g) => g.category === 'standard')
const elevatedGroups = accessGroups.filter((g) => g.category === 'elevated')

function AccessGroupSection({ selectedGroups, onChange, track }) {
  const [showModify, setShowModify] = useState(false)

  const hasElevatedSelected = elevatedGroups.some((g) =>
    selectedGroups.includes(g.id)
  )

  if (track === 'annual_renewal') {
    return (
      <div>
        <SectionHeader title="ECOS Access Groups" />
        <Card>
          <p className="text-sm text-neutral-400 mb-4">
            Your current access groups will be renewed
          </p>
          <div className="space-y-2 mb-4">
            {accessGroups
              .filter((g) => selectedGroups.includes(g.id))
              .map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-2 text-sm text-neutral-300"
                >
                  <span className="text-green-500">&#10003;</span>
                  <span>{group.name}</span>
                </div>
              ))}
          </div>

          {!showModify && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModify(true)}
            >
              Modify access groups
            </Button>
          )}

          {showModify && (
            <div className="border-t border-neutral-800 pt-4 mt-4 space-y-6">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-3">
                  Standard Access
                </p>
                <div className="space-y-3">
                  {standardGroups.map((group) => (
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
              </div>

              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-3">
                  Elevated Access
                </p>
                <div className="space-y-3">
                  {elevatedGroups.map((group) => (
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
              </div>

              {hasElevatedSelected && (
                <Alert variant="warning">
                  Elevated access groups require additional administrator review
                </Alert>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModify(false)}
              >
                Collapse
              </Button>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // new_updated track — full checkbox list
  return (
    <div>
      <SectionHeader title="ECOS Access Groups" />
      <div className="space-y-4">
        <Card>
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-4">
            Standard Access
          </p>
          <div className="space-y-3">
            {standardGroups.map((group) => (
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

        <Card className="border-l-2 border-orange-500/60">
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-4">
            Elevated Access
          </p>
          <div className="space-y-3">
            {elevatedGroups.map((group) => (
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

          {hasElevatedSelected && (
            <Alert variant="warning" className="mt-4">
              Elevated access groups require additional administrator review
            </Alert>
          )}
        </Card>
      </div>
    </div>
  )
}

export { AccessGroupSection }
