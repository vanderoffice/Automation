import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Checkbox } from '../components/ui/Checkbox'
import { SignatureBlock } from '../components/form/SignatureBlock'
import { accessGroups } from '../data/accessGroups'
import { saveAccessGroups } from '../lib/api/accessGroups'
import {
  getAgreements,
  getPendingForRole,
  getSignatures,
  createSignature,
  advanceWorkflow,
  logAction,
} from '../lib/api/index.js'

const STATUS_LABELS = {
  draft: 'Draft',
  pending_employee: 'Pending Employee',
  pending_manager: 'Pending Manager',
  pending_admin: 'Pending Admin',
  completed: 'Completed',
}

const STATUS_VARIANTS = {
  draft: 'neutral',
  pending_employee: 'warning',
  pending_manager: 'warning',
  pending_admin: 'warning',
  completed: 'success',
}

const TRACK_LABELS = {
  new_updated: 'New / Updated',
  annual_renewal: 'Annual Renewal',
}

const SIGNING_ROLES_BY_STATUS = {
  pending_employee: 'employee',
  pending_manager: 'manager',
  pending_admin: 'admin',
}

const TIMELINE_STEPS = [
  { role: 'employee', label: 'Employee' },
  { role: 'manager', label: 'Manager' },
  { role: 'admin', label: 'Admin' },
]

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return diffMin + 'm ago'
  if (diffHr < 24) return diffHr + 'h ago'
  if (diffDay < 7) return diffDay + 'd ago'
  return date.toLocaleDateString()
}

function SignatureTimeline({ signatures, status }) {
  const sigByRole = {}
  for (const sig of signatures) {
    sigByRole[sig.signer_role] = sig
  }

  const currentPendingRole = SIGNING_ROLES_BY_STATUS[status] || null

  return (
    <div className="relative ml-1">
      {TIMELINE_STEPS.map((step, i) => {
        const sig = sigByRole[step.role]
        const isSigned = !!sig
        const isCurrent = step.role === currentPendingRole
        const isFuture = !isSigned && !isCurrent
        const isLast = i === TIMELINE_STEPS.length - 1

        return (
          <div key={step.role} className="relative flex items-start gap-3 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={
                  'absolute left-[7px] top-[18px] w-0.5 h-[calc(100%-10px)] ' +
                  (isSigned ? 'bg-green-500/40' : 'bg-neutral-700')
                }
              />
            )}

            {/* Dot */}
            <div className="relative flex-shrink-0 mt-0.5">
              {isSigned ? (
                <div className="w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full bg-orange-500/20 border-2 border-orange-500 animate-pulse" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-neutral-800 border-2 border-neutral-600" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <p className={'text-sm font-medium ' + (isSigned ? 'text-green-400' : isCurrent ? 'text-orange-400' : 'text-neutral-500')}>
                {step.label}
              </p>
              {isSigned ? (
                <div className="mt-0.5">
                  <p className="text-xs text-neutral-400">{sig.typed_name}</p>
                  <p className="text-xs text-neutral-500 font-mono">{formatRelativeTime(sig.signed_at)}</p>
                </div>
              ) : isCurrent ? (
                <p className="text-xs text-orange-400/70 mt-0.5">Awaiting signature</p>
              ) : (
                <p className="text-xs text-neutral-600 mt-0.5">Pending</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AgreementCard({ agreement, signatures, role, currentEmployee, onSignComplete }) {
  const emp = agreement.employees
  const dept = emp?.departments
  const pendingRole = SIGNING_ROLES_BY_STATUS[agreement.status]
  const canSign = pendingRole === role

  // Manager assigns access groups during approval
  const [selectedGroups, setSelectedGroups] = useState([])

  const handleGroupToggle = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  async function handleSign(signatureData) {
    // Manager saves access groups before signing
    if (role === 'manager') {
      const { error: groupsError } = await saveAccessGroups(agreement.id, selectedGroups)
      if (groupsError) {
        console.error('Failed to save access groups:', groupsError)
        return
      }
      await logAction(agreement.id, currentEmployee.id, 'access_groups_assigned', {
        groups: selectedGroups,
      })
    }

    const { error: sigError } = await createSignature({
      agreement_id: agreement.id,
      signer_id: currentEmployee.id,
      signer_role: role,
      typed_name: signatureData.typed_name,
      certified: signatureData.certified,
      ip_address: signatureData.ip_address,
      user_agent: signatureData.user_agent,
      session_hash: signatureData.session_hash,
      form_version_hash: signatureData.form_version_hash,
    })
    if (sigError) return

    await advanceWorkflow(agreement.id, { signer_role: role })
    await logAction(agreement.id, currentEmployee.id, 'signed', {
      role,
      typed_name: signatureData.typed_name,
    })
    onSignComplete()
  }

  const signerFullName = currentEmployee
    ? currentEmployee.first_name + ' ' + currentEmployee.last_name
    : ''

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h3 className="text-white font-semibold truncate">
              {emp ? emp.first_name + ' ' + emp.last_name : 'Unknown'}
            </h3>
            <p className="text-sm text-neutral-400">
              {dept?.name || 'No department'} &middot; FY {agreement.fiscal_year || 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="accent">
              {TRACK_LABELS[agreement.track] || agreement.track}
            </Badge>
            <Badge variant={STATUS_VARIANTS[agreement.status] || 'neutral'}>
              {STATUS_LABELS[agreement.status] || agreement.status}
            </Badge>
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-neutral-800 pt-4">
          <SignatureTimeline signatures={signatures} status={agreement.status} />
        </div>

        {/* Manager: assign access groups before signing */}
        {canSign && role === 'manager' && (
          <div className="border-t border-neutral-800 pt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Assign ECOS Access Groups</h4>
              <p className="text-xs text-neutral-500">
                Select the access levels for this employee. These determine their ECOS system permissions.
              </p>
            </div>
            <div className="space-y-3">
              {accessGroups.map((group) => (
                <Checkbox
                  key={group.id}
                  name={'mgr-group-' + group.id}
                  label={group.name}
                  description={group.description}
                  checked={selectedGroups.includes(group.id)}
                  onChange={() => handleGroupToggle(group.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action area */}
        {canSign && (
          <div className="border-t border-neutral-800 pt-4">
            <SignatureBlock
              signerRole={role}
              signerName={signerFullName}
              onSign={handleSign}
              disabled={false}
              existingSignature={null}
            />
          </div>
        )}

        {!canSign && pendingRole && agreement.status !== 'completed' && (
          <div className="border-t border-neutral-800 pt-4">
            <p className="text-sm text-neutral-500 italic">
              Waiting for {pendingRole} signature
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default function WorkflowPage() {
  const { currentEmployee, role, loading: roleLoading } = useRole()
  const [agreements, setAgreements] = useState([])
  const [signaturesMap, setSignaturesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    if (!currentEmployee) return
    setLoading(true)
    setError(null)

    try {
      // Fetch agreements relevant to current role
      let allAgreements = []

      if (role === 'employee') {
        const { data, error: err } = await getAgreements({ employeeId: currentEmployee.id })
        if (err) throw err
        allAgreements = data || []
      } else {
        // Manager/admin: get pending for their role + their own agreements
        const [pendingResult, ownResult] = await Promise.all([
          getPendingForRole(role),
          getAgreements({ employeeId: currentEmployee.id }),
        ])

        if (pendingResult.error) throw pendingResult.error
        if (ownResult.error) throw ownResult.error

        const pending = pendingResult.data || []
        const own = ownResult.data || []

        // Merge and deduplicate by ID
        const seen = new Set()
        for (const a of [...pending, ...own]) {
          if (!seen.has(a.id)) {
            seen.add(a.id)
            allAgreements.push(a)
          }
        }
      }

      // Exclude drafts from workflow view
      allAgreements = allAgreements.filter((a) => a.status !== 'draft')

      // Fetch signatures for each agreement
      const sigMap = {}
      await Promise.all(
        allAgreements.map(async (a) => {
          const { data } = await getSignatures(a.id)
          sigMap[a.id] = data || []
        })
      )

      setAgreements(allAgreements)
      setSignaturesMap(sigMap)
    } catch (err) {
      console.error('WorkflowPage: load error', err)
      setError(err.message || 'Failed to load workflow data')
    } finally {
      setLoading(false)
    }
  }, [currentEmployee, role])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (roleLoading) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-white mb-2">Workflow Status</h1>
        <p className="text-neutral-400 mb-8">Loading...</p>
      </div>
    )
  }

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown'

  // Count statuses for header badges
  const pendingCount = agreements.filter((a) => a.status !== 'completed').length
  const completedCount = agreements.filter((a) => a.status === 'completed').length

  return (
    <div className="animate-in">
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <h1 className="text-2xl font-bold text-white">Workflow Status</h1>
        {!loading && agreements.length > 0 && (
          <div className="flex gap-2">
            {pendingCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400">
                {pendingCount} pending
              </span>
            )}
            {completedCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
                {completedCount} completed
              </span>
            )}
          </div>
        )}
      </div>
      <p className="text-neutral-400 mb-8">
        Viewing as <span className="text-white font-medium">{roleLabel}</span>
        {currentEmployee && (
          <span> &mdash; {currentEmployee.first_name} {currentEmployee.last_name}</span>
        )}
      </p>

      {loading ? (
        <Card>
          <p className="text-neutral-500">Loading agreements...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-red-400">{error}</p>
        </Card>
      ) : agreements.length === 0 ? (
        <Card>
          <div className="text-center py-6">
            <p className="text-neutral-400 text-lg mb-2">No agreements in workflow</p>
            {role === 'employee' ? (
              <p className="text-neutral-500 text-sm">
                Submit a new agreement to see it appear here.{' '}
                <Link to="/agreement" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                  Start a new agreement
                </Link>
              </p>
            ) : role === 'manager' ? (
              <p className="text-neutral-500 text-sm">
                No agreements are pending your review. When employees submit agreements, they&rsquo;ll appear here for your signature.
              </p>
            ) : (
              <p className="text-neutral-500 text-sm">
                No agreements are pending your review. After manager approval, agreements come here for final admin sign-off.
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {agreements.map((a) => (
            <AgreementCard
              key={a.id}
              agreement={a}
              signatures={signaturesMap[a.id] || []}
              role={role}
              currentEmployee={currentEmployee}
              onSignComplete={loadData}
            />
          ))}
        </div>
      )}
    </div>
  )
}
