import { useState } from 'react'
import { TrackSelector } from './TrackSelector'
import { EmployeeInfoSection } from './EmployeeInfoSection'
import { DepartmentInfoSection } from './DepartmentInfoSection'
import { SecurityContentSection } from './SecurityContentSection'
import { AcknowledgmentSection } from './AcknowledgmentSection'
import { securityRequirements, adminResponsibilities } from '../../data/securityRequirements'

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

function AgreementForm({ currentEmployee }) {
  const [formState, setFormState] = useState({
    track: null,
    supervisorName: '',
    workPhone: '',
    workLocation: '',
    fiscalYear: getFiscalYear(),
    acknowledgments: {},
  })

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const setTrack = (track) => {
    setFormState((prev) => ({ ...prev, track }))
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

      <EmployeeInfoSection currentEmployee={currentEmployee} track={formState.track} />
      <DepartmentInfoSection formState={formState} onChange={handleChange} fiscalYear={formState.fiscalYear} />
      <SecurityContentSection
        sections={securityRequirements}
        adminSection={adminResponsibilities}
        showAdminSection={false}
      />
      <AcknowledgmentSection
        sections={securityRequirements}
        adminSection={adminResponsibilities}
        showAdminSection={false}
        acknowledgments={formState.acknowledgments}
        onChange={handleAcknowledgment}
      />
    </div>
  )
}

export { AgreementForm }
