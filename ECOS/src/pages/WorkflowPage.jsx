import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TabBar } from '../components/ui/TabBar'
import { TextInput } from '../components/ui/TextInput'
import { Select } from '../components/ui/Select'
import { Checkbox } from '../components/ui/Checkbox'
import { SignatureBlock } from '../components/form/SignatureBlock'
import { MiniProgressDots } from '../components/workflow/MiniProgressDots'
import { StatusBadge } from '../components/workflow/StatusBadge'
import { WorkflowTimeline, formatRelativeTime } from '../components/workflow/WorkflowTimeline'
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

const SORT_OPTIONS = [
  { value: 'wait', label: 'Wait time' },
  { value: 'recent', label: 'Most recent' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'department', label: 'Department' },
]

// formatRelativeTime imported from WorkflowTimeline

// SignatureTimeline replaced by WorkflowTimeline — see adapter below

function buildTimelineData(signatures, status) {
  const sigByRole = {}
  for (const sig of signatures) {
    sigByRole[sig.signer_role] = sig
  }
  const currentPendingRole = SIGNING_ROLES_BY_STATUS[status] || null
  const data = {}
  for (const step of TIMELINE_STEPS) {
    const sig = sigByRole[step.role]
    data[step.role] = sig
      ? { completed: true, name: sig.typed_name, timestamp: sig.signed_at }
      : { completed: false }
  }
  return { data, currentId: currentPendingRole }
}

// --- Compact agreement card (collapsed/expanded) ---

function CompactAgreementCard({ agreement, signatures, role, currentEmployee, onSignComplete, isExpanded, onToggle }) {
  const emp = agreement.employees
  const dept = emp?.departments
  const pendingRole = SIGNING_ROLES_BY_STATUS[agreement.status]
  const canSign = pendingRole === role

  const [selectedGroups, setSelectedGroups] = useState([])

  const handleGroupToggle = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  async function handleSign(signatureData) {
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
    <div className="rounded-lg bg-[#0b0b0b] border border-neutral-800 glow-box transition-all">
      {/* Collapsed header — always visible */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={onToggle}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm text-white font-medium truncate">
              {emp ? emp.first_name + ' ' + emp.last_name : 'Unknown'}
            </p>
            <MiniProgressDots signatures={signatures} status={agreement.status} />
          </div>
          <p className="text-xs text-neutral-500">{dept?.name || 'No department'}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="accent">{TRACK_LABELS[agreement.track] || agreement.track}</Badge>
          <StatusBadge status={agreement.status} />
          <span className="text-xs text-neutral-500">{formatRelativeTime(agreement.updated_at)}</span>
          {canSign && (
            <button
              className={
                'text-xs px-2.5 py-1 rounded font-medium transition-all ' +
                (isExpanded
                  ? 'bg-neutral-800 text-neutral-400'
                  : 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25')
              }
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
            >
              {isExpanded ? 'Close' : 'Sign'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t border-neutral-800 p-4 space-y-4">
          {/* Full timeline */}
          {(() => {
            const { data, currentId } = buildTimelineData(signatures, agreement.status)
            return <WorkflowTimeline steps={TIMELINE_STEPS} data={data} currentId={currentId} />
          })()}

          {/* Manager: access groups */}
          {canSign && role === 'manager' && (
            <div className="border-t border-neutral-800 pt-4 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Assign ECOS Access Groups</h4>
                <p className="text-xs text-neutral-500">
                  Select the access levels for this employee.
                </p>
              </div>
              <div className="space-y-3">
                {accessGroups.map((group) => (
                  <Checkbox
                    key={group.id}
                    name={'mgr-group-' + agreement.id + '-' + group.id}
                    label={group.name}
                    description={group.description}
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Signature action */}
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

          {agreement.status === 'completed' && (
            <div className="border-t border-neutral-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-sm text-green-400">Agreement fully executed</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors no-print"
                >
                  Print / Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- Main page ---

export default function WorkflowPage() {
  const { currentEmployee, role, loading: roleLoading } = useRole()
  const [agreements, setAgreements] = useState([])
  const [signaturesMap, setSignaturesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI state
  const [activeTab, setActiveTab] = useState('action')
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('wait')

  const loadData = useCallback(async () => {
    if (!currentEmployee) return
    setLoading(true)
    setError(null)

    try {
      let allAgreements = []

      if (role === 'employee') {
        const { data, error: err } = await getAgreements({ employeeId: currentEmployee.id })
        if (err) throw err
        allAgreements = data || []
      } else {
        const [pendingResult, ownResult] = await Promise.all([
          getPendingForRole(role),
          getAgreements({ employeeId: currentEmployee.id }),
        ])

        if (pendingResult.error) throw pendingResult.error
        if (ownResult.error) throw ownResult.error

        const pending = pendingResult.data || []
        const own = ownResult.data || []

        const seen = new Set()
        for (const a of [...pending, ...own]) {
          if (!seen.has(a.id)) {
            seen.add(a.id)
            allAgreements.push(a)
          }
        }
      }

      allAgreements = allAgreements.filter((a) => a.status !== 'draft')

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

  // Categorize agreements
  const categorized = useMemo(() => {
    const action = []
    const inProgress = []
    const completed = []

    for (const a of agreements) {
      const pendingRole = SIGNING_ROLES_BY_STATUS[a.status]
      if (a.status === 'completed') {
        completed.push(a)
      } else if (pendingRole === role) {
        action.push(a)
      } else {
        inProgress.push(a)
      }
    }

    return { action, inProgress, completed }
  }, [agreements, role])

  // Get items for active tab
  const tabItems = useMemo(() => {
    let items
    switch (activeTab) {
      case 'action': items = categorized.action; break
      case 'progress': items = categorized.inProgress; break
      case 'completed': items = categorized.completed; break
      default: items = agreements
    }

    // Search filter
    const term = search.toLowerCase()
    if (term) {
      items = items.filter((a) => {
        const emp = a.employees
        const name = emp ? (emp.first_name + ' ' + emp.last_name).toLowerCase() : ''
        const dept = (emp?.departments?.name || '').toLowerCase()
        return name.includes(term) || dept.includes(term)
      })
    }

    // Sort
    const sorted = [...items]
    switch (sortBy) {
      case 'wait':
        sorted.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
        break
      case 'recent':
        sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        break
      case 'name':
        sorted.sort((a, b) => {
          const nameA = a.employees ? a.employees.last_name : ''
          const nameB = b.employees ? b.employees.last_name : ''
          return nameA.localeCompare(nameB)
        })
        break
      case 'department':
        sorted.sort((a, b) => {
          const deptA = a.employees?.departments?.name || ''
          const deptB = b.employees?.departments?.name || ''
          return deptA.localeCompare(deptB)
        })
        break
    }

    return sorted
  }, [activeTab, categorized, agreements, search, sortBy])

  if (roleLoading) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-white mb-2">Workflow Status</h1>
        <p className="text-neutral-400 mb-8">Loading...</p>
      </div>
    )
  }

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown'

  const tabs = [
    { id: 'action', label: 'Needs Action', count: categorized.action.length },
    { id: 'progress', label: 'In Progress', count: categorized.inProgress.length },
    { id: 'completed', label: 'Completed', count: categorized.completed.length },
    { id: 'all', label: 'All' },
  ]

  function emptyState() {
    if (activeTab === 'action') {
      return (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-green-400 text-sm">All caught up — nothing needs your signature</p>
        </div>
      )
    }
    if (activeTab === 'completed') {
      return <p className="text-neutral-500 text-sm">No completed agreements yet.</p>
    }
    if (activeTab === 'progress') {
      return <p className="text-neutral-500 text-sm">No agreements in progress.</p>
    }
    return null
  }

  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Workflow Status</h1>
        <p className="text-neutral-400">
          Viewing as <span className="text-white font-medium">{roleLabel}</span>
          {currentEmployee && (
            <span> — {currentEmployee.first_name} {currentEmployee.last_name}</span>
          )}
        </p>
      </div>

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
                No agreements are pending your review. When employees submit agreements, they'll appear here for your signature.
              </p>
            ) : (
              <p className="text-neutral-500 text-sm">
                No agreements are pending your review. After manager approval, agreements come here for final admin sign-off.
              </p>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* Tabs */}
          <TabBar tabs={tabs} active={activeTab} onChange={(id) => { setActiveTab(id); setExpandedId(null) }} />

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <TextInput
              name="workflow-search"
              placeholder="Search by name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Select
              name="workflow-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={SORT_OPTIONS}
              className="sm:w-40"
            />
          </div>

          {/* Cards grid */}
          {tabItems.length === 0 ? (
            <Card>{search ? <p className="text-neutral-500 text-sm">No agreements match "{search}"</p> : emptyState()}</Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              {tabItems.map((a) => (
                <CompactAgreementCard
                  key={a.id}
                  agreement={a}
                  signatures={signaturesMap[a.id] || []}
                  role={role}
                  currentEmployee={currentEmployee}
                  onSignComplete={() => { setExpandedId(null); loadData() }}
                  isExpanded={expandedId === a.id}
                  onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
