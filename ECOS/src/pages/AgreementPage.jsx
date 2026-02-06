import { useRole } from '../context/RoleContext'
import { Alert } from '../components/ui'
import { AgreementForm } from '../components/form/AgreementForm'

export default function AgreementPage() {
  const { currentEmployee, loading } = useRole()

  if (loading) {
    return (
      <div className="animate-in max-w-3xl mx-auto">
        <p className="text-neutral-400">Loading...</p>
      </div>
    )
  }

  if (!currentEmployee) {
    return (
      <div className="animate-in max-w-3xl mx-auto">
        <Alert variant="warning" title="No Role Selected">
          Select a demo role from the navigation to continue.
        </Alert>
      </div>
    )
  }

  return (
    <div className="animate-in">
      <AgreementForm key={currentEmployee.id} currentEmployee={currentEmployee} />
    </div>
  )
}
