import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'

function FormActions({ onSubmit, onSaveDraft, isSubmitting, isValid, errors }) {
  const errorKeys = errors ? Object.keys(errors) : []

  return (
    <Card>
      {errorKeys.length > 0 && (
        <Alert variant="error" title="Please fix the following errors" className="mb-4">
          <ul className="list-disc list-inside text-sm space-y-1 mt-1">
            {errorKeys.map((key) => (
              <li key={key}>{errors[key]}</li>
            ))}
          </ul>
        </Alert>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={onSaveDraft}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Agreement'}
        </Button>
      </div>
    </Card>
  )
}

export { FormActions }
