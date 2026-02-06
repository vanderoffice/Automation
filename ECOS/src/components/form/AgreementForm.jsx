import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrackSelector } from './TrackSelector'
import { EmployeeInfoSection } from './EmployeeInfoSection'
import { DepartmentInfoSection } from './DepartmentInfoSection'
import { SecurityContentSection } from './SecurityContentSection'
import { AcknowledgmentSection } from './AcknowledgmentSection'
import { AccessGroupSection } from './AccessGroupSection'
import { FormActions } from './FormActions'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { securityRequirements, adminResponsibilities } from '../../data/securityRequirements'
import { createAgreement } from '../../lib/api/agreements'
import { saveAccessGroups } from '../../lib/api/accessGroups'

function getFiscalYear() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed: 0=Jan, 6=Jul
  // California fiscal year: July-June
  if (month >= 6) {
    return year + '-' + (year + 1)
  }
  return (year - 1) + '-' + year
}

function getInitialState() {
  return {
    track: null,
    supervisorName: '',
    workPhone: '',
    workLocation: '',
    fiscalYear: getFiscalYear(),
    acknowledgments: {},
    selectedGroups: [],
  }
}

function AgreementForm({ currentEmployee }) {
  const navigate = useNavigate()
  const [formState, setFormState] = useState(getInitialState())
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [draftSaved, setDraftSaved] = useState(false)

  // Auto-dismiss draft saved alert
  useEffect(() => {
    if (!draftSaved) return
    const timer = setTimeout(() => setDraftSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [draftSaved])

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const setTrack = (track) => {
    const selectedGroups = track === 'annual_renewal'
      ? ['ecos_user', 'personnel_transactions']
      : []
    setFormState((prev) => ({ ...prev, track, selectedGroups }))
  }

  const clearTrack = () => {
    setFormState((prev) => ({ ...prev, track: null }))
  }

  const handleAcknowledgment = (sectionId) => {
    setFormState((prev) => ({
      ...prev,
      acknowledgments: {
        ...prev.acknowledgments,
        [sectionId]: !prev.acknowledgments[sectionId],
      },
    }))
  }

  const handleGroupToggle = (groupId) => {
    setFormState((prev) => {
      const groups = prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter((id) => id !== groupId)
        : [...prev.selectedGroups, groupId]
      return { ...prev, selectedGroups: groups }
    })
  }

  // Show admin responsibilities when System Administration access is selected
  const showAdminSection = formState.selectedGroups.includes('system_admin')

  const allSections = showAdminSection
    ? [...securityRequirements, adminResponsibilities]
    : securityRequirements

  function validateForm() {
    const validationErrors = {}

    if (!formState.supervisorName.trim()) {
      validationErrors.supervisorName = 'Supervisor name is required'
    }
    if (!formState.workPhone.trim()) {
      validationErrors.workPhone = 'Work phone is required'
    }
    if (!formState.workLocation.trim()) {
      validationErrors.workLocation = 'Work location is required'
    }
    if (formState.track === 'new_updated' && formState.selectedGroups.length === 0) {
      validationErrors.selectedGroups = 'At least one access group must be selected'
    }

    const unacknowledged = allSections.filter((s) => !formState.acknowledgments[s.id])
    if (unacknowledged.length > 0) {
      validationErrors.acknowledgments = 'All security sections must be acknowledged (' + unacknowledged.length + ' remaining)'
    }

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    }
  }

  async function handleSubmit() {
    const validation = validateForm()
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setSubmitError(null)

    const { data: agreement, error: agreementError } = await createAgreement({
      employee_id: currentEmployee.id,
      track: formState.track,
      fiscal_year: formState.fiscalYear,
      supervisor_name: formState.supervisorName,
      work_phone: formState.workPhone,
      work_location: formState.workLocation,
      form_version_hash: 'sha256_v1_demo_abc123',
      status: 'draft',
    })

    if (agreementError) {
      setSubmitError('Failed to create agreement: ' + agreementError.message)
      setIsSubmitting(false)
      return
    }

    const { error: groupsError } = await saveAccessGroups(
      agreement.id,
      formState.selectedGroups
    )

    if (groupsError) {
      setSubmitError('Agreement created but failed to save access groups: ' + groupsError.message)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setSubmitSuccess(agreement)
  }

  async function handleSaveDraft() {
    setIsSubmitting(true)
    setSubmitError(null)

    const { data: agreement, error: agreementError } = await createAgreement({
      employee_id: currentEmployee.id,
      track: formState.track,
      fiscal_year: formState.fiscalYear,
      supervisor_name: formState.supervisorName,
      work_phone: formState.workPhone,
      work_location: formState.workLocation,
      form_version_hash: 'sha256_v1_demo_abc123',
      status: 'draft',
    })

    if (agreementError) {
      setSubmitError('Failed to save draft: ' + agreementError.message)
      setIsSubmitting(false)
      return
    }

    if (formState.selectedGroups.length > 0) {
      const { error: groupsError } = await saveAccessGroups(
        agreement.id,
        formState.selectedGroups
      )

      if (groupsError) {
        setSubmitError('Draft saved but failed to save access groups: ' + groupsError.message)
        setIsSubmitting(false)
        return
      }
    }

    setIsSubmitting(false)
    setDraftSaved(true)
  }

  const handleCreateAnother = () => {
    setFormState(getInitialState())
    setErrors({})
    setSubmitSuccess(null)
    setSubmitError(null)
  }

  // Step 1: Track selection
  if (!formState.track) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            ECOS Security Agreement
          </h1>
          <p className="text-neutral-400">
            Select the type of agreement to continue.
          </p>
        </div>
        <TrackSelector value={formState.track} onChange={setTrack} />
      </div>
    )
  }

  // Success state
  if (submitSuccess) {
    const trackLabel =
      submitSuccess.track === 'new_updated' ? 'New / Updated User' : 'Annual Renewal'

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11.5 14.5 16 9" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              Agreement Created Successfully
            </h2>
            <div className="text-sm text-neutral-400 space-y-1">
              <p>Track: {trackLabel}</p>
              <p>Employee: {currentEmployee?.first_name + ' ' + currentEmployee?.last_name}</p>
              <p>Fiscal Year: {submitSuccess.fiscal_year}</p>
              <p>Access Groups: {formState.selectedGroups.length}</p>
            </div>
            <p className="text-sm text-neutral-500">
              Your agreement has been saved as a draft.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="secondary" onClick={handleCreateAnother}>
                Create Another
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/ecosform/workflow')}
              >
                View Workflow
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Step 2: Form with sections
  const trackLabel =
    formState.track === 'new_updated' ? 'New / Updated User' : 'Annual Renewal'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <button
          type="button"
          onClick={clearTrack}
          className="text-sm text-orange-400 hover:text-orange-300 transition-colors mb-3 inline-flex items-center gap-1"
        >
          <span>←</span> Change agreement type
        </button>
        <h1 className="text-2xl font-bold text-white">
          ECOS Security Agreement — {trackLabel}
        </h1>
      </div>

      {submitError && (
        <Alert variant="error" dismissible onDismiss={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {draftSaved && (
        <Alert variant="success" dismissible onDismiss={() => setDraftSaved(false)}>
          Draft saved successfully.
        </Alert>
      )}

      <EmployeeInfoSection currentEmployee={currentEmployee} track={formState.track} />
      <DepartmentInfoSection
        formState={formState}
        onChange={handleChange}
        fiscalYear={formState.fiscalYear}
        errors={errors}
      />
      <SecurityContentSection
        sections={securityRequirements}
        adminSection={adminResponsibilities}
        showAdminSection={showAdminSection}
      />
      <AcknowledgmentSection
        sections={securityRequirements}
        adminSection={adminResponsibilities}
        showAdminSection={showAdminSection}
        acknowledgments={formState.acknowledgments}
        onChange={handleAcknowledgment}
      />
      <AccessGroupSection
        selectedGroups={formState.selectedGroups}
        onChange={handleGroupToggle}
        track={formState.track}
      />
      <FormActions
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
        isValid={validateForm().isValid}
        errors={errors}
      />
    </div>
  )
}

export { AgreementForm }
