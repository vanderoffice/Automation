import { Card, SectionHeader } from '../ui'

function EmployeeInfoSection({ currentEmployee, track }) {
  return (
    <div>
      <SectionHeader
        title="Employee Information"
        description="Auto-filled from your employee record"
      />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-400">Name</p>
            <p className="text-white font-medium">
              {currentEmployee.first_name} {currentEmployee.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Employee Number</p>
            <p className="text-white font-medium">
              {currentEmployee.employee_number}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Email</p>
            <p className="text-white font-medium">{currentEmployee.email}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Title</p>
            <p className="text-white font-medium">{currentEmployee.title}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Department</p>
            <p className="text-white font-medium">
              {currentEmployee.departments?.name ?? 'N/A'}
            </p>
          </div>
        </div>
        {track === 'annual_renewal' && (
          <p className="text-sm text-orange-400 mt-4">
            Renewing agreement from previous fiscal year
          </p>
        )}
      </Card>
    </div>
  )
}

export { EmployeeInfoSection }
