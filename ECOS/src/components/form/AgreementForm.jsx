import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrackSelector } from './TrackSelector'
import { EmployeeInfoSection } from './EmployeeInfoSection'
import { DepartmentInfoSection } from './DepartmentInfoSection'
import { SecurityContentSection } from './SecurityContentSection'
import { AcknowledgmentSection } from './AcknowledgmentSection'
import { FormStepper, StepNavigation } from './FormStepper'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { securityRequirements, adminResponsibilities } from '../../data/securityRequirements'
import { SignatureBlock } from './SignatureBlock'
import { createAgreement } from '../../lib/api/agreements'
import { submitForSignature, advanceWorkflow } from '../../lib/api/workflow'
import { createSignature } from '../../lib/api/signatures'
import { logAction } from '../../lib/api/audit'

const TOTAL_STEPS = 4
const AUTOSAVE_INTERVAL = 30000 // 30 seconds
const DRAFT_KEY_PREFIX = 'ecos_draft_'

function getFiscalYear() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
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
    acknowledged: false,
  }
}

function getDraftKey(employeeId) {
  return DRAFT_KEY_PREFIX + employeeId
}

function AgreementForm({ currentEmployee }) {
  const navigate = useNavigate()
  const [formState, setFormState] = useState(getInitialState())
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(null)
  const [signatureComplete, setSignatureComplete] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [draftRecovery, setDraftRecovery] = useState(null)
  const [autoSaveNotice, setAutoSaveNotice] = useState(false)
  const autoSaveTimer = useRef(null)

  // Check for saved draft on mount
  useEffect(() => {
    if (!currentEmployee?.id) return
    try {
      const saved = localStorage.getItem(getDraftKey(currentEmployee.id))
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.track) {
          setDraftRecovery(parsed)
        }
      }
    } catch {
      // Ignore corrupt drafts
    }
  }, [currentEmployee?.id])

  // Auto-save every 30s when form has a track selected
  useEffect(() => {
    if (!currentEmployee?.id || !formState.track || submitSuccess) return

    autoSaveTimer.current = setInterval(() => {
      try {
        const payload = { ...formState, savedAt: Date.now(), step: currentStep }
        localStorage.setItem(getDraftKey(currentEmployee.id), JSON.stringify(payload))
        setAutoSaveNotice(true)
        setTimeout(() => setAutoSaveNotice(false), 2000)
      } catch {
        // Silently fail — localStorage might be full
      }
    }, AUTOSAVE_INTERVAL)

    return () => clearInterval(autoSaveTimer.current)
  }, [currentEmployee?.id, formState, currentStep, submitSuccess])

  const resumeDraft = useCallback(() => {
    if (!draftRecovery) return
    setFormState({
      track: draftRecovery.track,
      supervisorName: draftRecovery.supervisorName || '',
      workPhone: draftRecovery.workPhone || '',
      workLocation: draftRecovery.workLocation || '',
      fiscalYear: draftRecovery.fiscalYear || getFiscalYear(),
      acknowledged: draftRecovery.acknowledged || false,
    })
    if (draftRecovery.step) {
      setCurrentStep(draftRecovery.step)
    }
    setDraftRecovery(null)
  }, [draftRecovery])

  const discardDraft = useCallback(() => {
    if (currentEmployee?.id) {
      localStorage.removeItem(getDraftKey(currentEmployee.id))
    }
    setDraftRecovery(null)
  }, [currentEmployee?.id])

  const clearDraft = useCallback(() => {
    if (currentEmployee?.id) {
      localStorage.removeItem(getDraftKey(currentEmployee.id))
    }
  }, [currentEmployee?.id])

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const setTrack = (track) => {
    setFormState((prev) => ({ ...prev, track }))
  }

  const clearTrack = () => {
    setFormState((prev) => ({ ...prev, track: null }))
    setCurrentStep(1)
  }

  const handleAcknowledgmentToggle = () => {
    setFormState((prev) => ({ ...prev, acknowledged: !prev.acknowledged }))
  }

  const allSections = [...securityRequirements, adminResponsibilities]

  function validateStep(step) {
    const validationErrors = {}

    if (step >= 1) {
      if (!formState.supervisorName.trim()) {
        validationErrors.supervisorName = 'Supervisor name is required'
      }
      if (!formState.workPhone.trim()) {
        validationErrors.workPhone = 'Work phone is required'
      }
      if (!formState.workLocation.trim()) {
        validationErrors.workLocation = 'Work location is required'
      }
    }

    if (step >= 3) {
      if (!formState.acknowledged) {
        validationErrors.acknowledged = 'You must acknowledge the security requirements'
      }
    }

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    }
  }

  function handleNext() {
    if (currentStep === 1) {
      const validation = validateStep(1)
      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }
      setErrors({})
    }
    if (currentStep === 3) {
      const validation = validateStep(3)
      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }
      setErrors({})
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  function handleStepClick(stepId) {
    if (stepId < currentStep) {
      setCurrentStep(stepId)
    }
  }

  async function handleSubmit() {
    const validation = validateStep(3)
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

    const { error: workflowError } = await submitForSignature(agreement.id)

    if (workflowError) {
      setSubmitError('Agreement created but failed to submit for signature: ' + workflowError.message)
      setIsSubmitting(false)
      return
    }

    clearDraft()
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

    clearDraft()
    setIsSubmitting(false)
    setSubmitSuccess(null)
    navigate('/workflow')
  }

  const handleCreateAnother = () => {
    setFormState(getInitialState())
    setCurrentStep(1)
    setErrors({})
    setSubmitSuccess(null)
    setSignatureComplete(false)
    setSubmitError(null)
  }

  // Draft recovery banner
  if (draftRecovery && !formState.track) {
    const trackLabel = draftRecovery.track === 'new_updated' ? 'New / Updated User' : 'Annual Renewal'
    const savedTime = draftRecovery.savedAt
      ? new Date(draftRecovery.savedAt).toLocaleTimeString()
      : 'unknown time'

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
        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm font-medium text-white">Unsaved draft found</span>
            </div>
            <p className="text-sm text-neutral-400">
              {trackLabel} agreement &middot; Step {draftRecovery.step || 1} of {TOTAL_STEPS} &middot; Last saved at {savedTime}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={resumeDraft}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 transition-all"
              >
                Resume Draft
              </button>
              <button
                onClick={discardDraft}
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </Card>
        <TrackSelector value={formState.track} onChange={setTrack} />
      </div>
    )
  }

  // Step 0: Track selection
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

  // Success state — employee signing flow
  if (submitSuccess) {
    const trackLabel =
      submitSuccess.track === 'new_updated' ? 'New / Updated User' : 'Annual Renewal'
    const employeeName = currentEmployee?.first_name + ' ' + currentEmployee?.last_name

    async function handleEmployeeSign(signatureData) {
      try {
        const { error: sigError } = await createSignature({
          agreement_id: submitSuccess.id,
          signer_id: currentEmployee.id,
          signer_role: 'employee',
          ...signatureData,
        })

        if (sigError) {
          setSubmitError('Failed to record signature: ' + sigError.message)
          return
        }

        const { error: advanceError } = await advanceWorkflow(submitSuccess.id, {
          signer_role: 'employee',
        })

        if (advanceError) {
          setSubmitError('Signature recorded but failed to advance workflow: ' + advanceError.message)
          return
        }

        await logAction(submitSuccess.id, currentEmployee.id, 'signed', {
          role: 'employee',
          typed_name: signatureData.typed_name,
        })

        setSignatureComplete(true)
      } catch (err) {
        setSubmitError('An unexpected error occurred during signing: ' + err.message)
      }
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {submitError && (
          <Alert variant="error" dismissible onDismiss={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {signatureComplete ? (
          <>
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
                  Agreement Submitted
                </h2>
                <div className="text-sm text-neutral-400 space-y-1">
                  <p>{trackLabel} &middot; FY {submitSuccess.fiscal_year}</p>
                  <p>Signed by {employeeName}</p>
                </div>
                <p className="text-sm text-green-400 font-medium">
                  Awaiting manager approval.
                </p>
              </div>
            </Card>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={handleCreateAnother}>
                Create Another
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/workflow')}
              >
                View Workflow
              </Button>
            </div>
          </>
        ) : (
          <>
            <Card>
              <div className="flex items-center gap-4 p-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-500/15 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Sign Your Agreement
                  </h2>
                  <p className="text-sm text-neutral-400">
                    {trackLabel} &middot; FY {submitSuccess.fiscal_year} &middot; {employeeName}
                  </p>
                </div>
              </div>
            </Card>
            <SignatureBlock
              signerRole="employee"
              signerName={employeeName}
              onSign={handleEmployeeSign}
            />
          </>
        )}
      </div>
    )
  }

  // Main form with stepper
  const trackLabel =
    formState.track === 'new_updated' ? 'New / Updated User' : 'Annual Renewal'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button
          type="button"
          onClick={clearTrack}
          className="text-sm text-orange-400 hover:text-orange-300 transition-colors mb-3 inline-flex items-center gap-1"
        >
          <span>←</span> Change agreement type
        </button>
        <h1 className="text-2xl font-bold text-white mb-1">
          ECOS Security Agreement — {trackLabel}
        </h1>
        {autoSaveNotice && (
          <p className="text-xs text-neutral-500 mt-1">Draft auto-saved</p>
        )}
      </div>

      <FormStepper currentStep={currentStep} onStepClick={handleStepClick} />

      {submitError && (
        <Alert variant="error" dismissible onDismiss={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {/* Step 1: Employee & Department Info */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <EmployeeInfoSection currentEmployee={currentEmployee} track={formState.track} />
          <DepartmentInfoSection
            formState={formState}
            onChange={handleChange}
            fiscalYear={formState.fiscalYear}
            errors={errors}
          />
        </div>
      )}

      {/* Step 2: Security Requirements */}
      {currentStep === 2 && (
        <SecurityContentSection sections={allSections} />
      )}

      {/* Step 3: Acknowledgment & Review */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <AcknowledgmentSection
            sections={allSections}
            acknowledged={formState.acknowledged}
            onToggle={handleAcknowledgmentToggle}
          />
          {errors.acknowledged && (
            <p className="text-sm text-red-400">{errors.acknowledged}</p>
          )}
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">Review Your Agreement</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Employee</span>
                <span className="text-white">{currentEmployee?.first_name} {currentEmployee?.last_name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Department</span>
                <span className="text-white">{currentEmployee?.departments?.name || '—'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Track</span>
                <Badge variant="accent">{trackLabel}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Fiscal Year</span>
                <span className="text-white">{formState.fiscalYear}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Supervisor</span>
                <span className="text-white">{formState.supervisorName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Work Phone</span>
                <span className="text-white">{formState.workPhone}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Work Location</span>
                <span className="text-white">{formState.workLocation}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-400">Acknowledged</span>
                <Badge variant={formState.acknowledged ? 'success' : 'error'}>
                  {formState.acknowledged ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Agreement'}
            </Button>
          </div>
        </div>
      )}

      {/* Step navigation (not shown on final step — has its own buttons) */}
      {currentStep < TOTAL_STEPS && (
        <StepNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={currentStep === 3 ? 'Review' : undefined}
          nextDisabled={false}
        />
      )}
    </div>
  )
}

export { AgreementForm }
