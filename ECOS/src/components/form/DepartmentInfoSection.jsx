import { Card, SectionHeader, Badge, TextInput } from '../ui'

function DepartmentInfoSection({ formState, onChange, fiscalYear, errors = {} }) {
  return (
    <div>
      <SectionHeader
        title="Department & Supervisor"
        action={
          <Badge variant="accent">FY {fiscalYear}</Badge>
        }
      />
      <Card>
        <div className="space-y-4">
          <TextInput
            label="Supervisor Name"
            name="supervisorName"
            placeholder="Enter supervisor's full name"
            value={formState.supervisorName}
            onChange={onChange('supervisorName')}
            error={errors.supervisorName}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Work Phone"
              name="workPhone"
              type="tel"
              placeholder="(916) 555-0000"
              value={formState.workPhone}
              onChange={onChange('workPhone')}
              error={errors.workPhone}
            />
            <TextInput
              label="Work Location"
              name="workLocation"
              placeholder="Sacramento HQ"
              value={formState.workLocation}
              onChange={onChange('workLocation')}
              error={errors.workLocation}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export { DepartmentInfoSection }
