import { useState } from 'react'
import { useRole } from '../context/RoleContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TabBar } from '../components/ui/TabBar'
import { TextInput } from '../components/ui/TextInput'
import { Select } from '../components/ui/Select'
import { SignatureBlock } from '../components/form/SignatureBlock'
import { createSignature, advanceWorkflow, logAction } from '../lib/api/index.js'
import {
  useDashboardData,
  rateColor,
  barColor,
  formatExpiryLabel,
  expiryVariant,
  formatWaitDays,
  urgencyBorder,
  TRACK_LABELS,
  ACTION_LABELS,
  ACTION_VARIANTS,
  ACTION_FILTER_OPTIONS,
} from '../lib/useDashboardData'

const MAX_EXPIRING_OVERVIEW = 5

export default function DashboardPage() {
  const { currentEmployee } = useRole()
  const {
    stats,
    departments,
    expiring,
    pendingAdmin,
    auditLog,
    lastUpdated,
    loading,
    error,
    reload,
  } = useDashboardData()

  const [activeTab, setActiveTab] = useState('overview')

  // Audit trail local state
  const [auditSearch, setAuditSearch] = useState('')
  const [auditFilter, setAuditFilter] = useState('')
  const [expandedAudit, setExpandedAudit] = useState(new Set())
  const [auditPage, setAuditPage] = useState(0)

  // Approvals local state
  const [expandedApproval, setExpandedApproval] = useState(null)

  // Expiring section
  const [showAllExpiring, setShowAllExpiring] = useState(false)

  if (loading) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400">Compliance and audit dashboard</p>
        <Card>
          <p className="text-neutral-500">Loading...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400">Compliance and audit dashboard</p>
        <Card>
          <p className="text-red-400">{error}</p>
        </Card>
      </div>
    )
  }

  const signerName = currentEmployee
    ? currentEmployee.first_name + ' ' + currentEmployee.last_name
    : 'Admin'

  async function handleAdminSign(agreement, signatureData) {
    const { error: sigError } = await createSignature({
      agreement_id: agreement.id,
      signer_id: currentEmployee.id,
      signer_role: 'admin',
      typed_name: signatureData.typed_name,
      certified: signatureData.certified,
      ip_address: signatureData.ip_address,
      user_agent: signatureData.user_agent,
      session_hash: signatureData.session_hash,
      form_version_hash: signatureData.form_version_hash,
    })
    if (sigError) return

    await advanceWorkflow(agreement.id, { signer_role: 'admin' })
    await logAction(agreement.id, currentEmployee.id, 'signed', {
      role: 'admin',
      typed_name: signatureData.typed_name,
    })
    setExpandedApproval(null)
    reload()
  }

  const fyStart = new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1
  const fyLabel = 'FY ' + fyStart + '-' + (fyStart + 1)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'approvals', label: 'Approvals', count: pendingAdmin.length },
    { id: 'audit', label: 'Audit Trail', count: auditLog.length },
  ]

  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400">{fyLabel} · {stats.total} agreements tracked</p>
      </div>

      {/* Stat cards — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-neutral-400 mt-1">Total Agreements</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-sm text-neutral-400 mt-1">Completed</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-3xl font-bold text-orange-400">{stats.pending}</p>
            <p className="text-sm text-neutral-400 mt-1">Pending Review</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className={'text-3xl font-bold ' + rateColor(stats.rate)}>
              {stats.rate}%
            </p>
            <p className="text-sm text-neutral-400 mt-1">Compliance Rate</p>
          </div>
        </Card>
      </div>

      {/* Tab bar */}
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'overview' && (
        <OverviewTab
          departments={departments}
          expiring={expiring}
          showAllExpiring={showAllExpiring}
          onToggleExpiring={() => setShowAllExpiring(!showAllExpiring)}
        />
      )}

      {activeTab === 'approvals' && (
        <ApprovalsTab
          pendingAdmin={pendingAdmin}
          signerName={signerName}
          expandedApproval={expandedApproval}
          onExpandApproval={setExpandedApproval}
          onSign={handleAdminSign}
        />
      )}

      {activeTab === 'audit' && (
        <AuditTab
          auditLog={auditLog}
          auditSearch={auditSearch}
          onSearchChange={setAuditSearch}
          auditFilter={auditFilter}
          onFilterChange={setAuditFilter}
          expandedAudit={expandedAudit}
          onToggleExpand={(id) => {
            setExpandedAudit((prev) => {
              const next = new Set(prev)
              if (next.has(id)) next.delete(id)
              else next.add(id)
              return next
            })
          }}
          page={auditPage}
          onPageChange={setAuditPage}
        />
      )}

      {lastUpdated && (
        <p className="text-xs text-neutral-600 text-right">
          Last updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}

// --- Overview Tab ---

function OverviewTab({ departments, expiring, showAllExpiring, onToggleExpiring }) {
  // Department summary
  const deptsAbove80 = departments.filter((d) => d.rate >= 80).length
  const avgRate = departments.length > 0
    ? Math.round(departments.reduce((s, d) => s + d.rate, 0) / departments.length)
    : 0

  // Group expiring by urgency
  const now = new Date()
  const groups = { expired: [], thisWeek: [], thisMonth: [], thisQuarter: [] }
  for (const a of expiring) {
    const diff = Math.round((new Date(a.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) groups.expired.push(a)
    else if (diff <= 7) groups.thisWeek.push(a)
    else if (diff <= 30) groups.thisMonth.push(a)
    else groups.thisQuarter.push(a)
  }

  const urgencyGroups = [
    { key: 'expired', label: 'Expired', items: groups.expired, variant: 'error' },
    { key: 'thisWeek', label: 'This Week', items: groups.thisWeek, variant: 'warning' },
    { key: 'thisMonth', label: 'This Month', items: groups.thisMonth, variant: 'accent' },
    { key: 'thisQuarter', label: 'This Quarter', items: groups.thisQuarter, variant: 'neutral' },
  ].filter((g) => g.items.length > 0)

  return (
    <div className="space-y-6">
      <Card title="Department Compliance">
        {departments.length === 0 ? (
          <p className="text-neutral-500">No department data available.</p>
        ) : (
          <div className="space-y-4">
            {/* Summary line */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm text-neutral-400">
                <span className={'font-semibold ' + rateColor(avgRate)}>{deptsAbove80}</span>
                {' of ' + departments.length + ' depts above 80%'}
              </span>
              <span className={'text-sm font-semibold ' + rateColor(avgRate)}>
                Avg {avgRate}%
              </span>
            </div>

            {departments.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm text-white font-medium truncate min-w-0">{dept.name}</p>
                  <div className="flex items-baseline gap-2 flex-shrink-0">
                    <span className="text-xs text-neutral-500">
                      {dept.completed}/{dept.total}
                    </span>
                    <span className={'text-sm font-semibold ' + rateColor(dept.rate)}>
                      {dept.rate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={'h-full rounded-full transition-all ' + barColor(dept.rate)}
                    style={{ width: dept.rate + '%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title={'Expiring Soon' + (expiring.length > 0 ? ' (' + expiring.length + ')' : '')}>
        {expiring.length === 0 ? (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <p className="text-green-400 text-sm">All agreements current</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Urgency group badges */}
            <div className="flex flex-wrap gap-2">
              {urgencyGroups.map((g) => (
                <Badge key={g.key} variant={g.variant}>
                  {g.label}: {g.items.length}
                </Badge>
              ))}
            </div>

            {/* Grouped items */}
            {urgencyGroups.map((g) => {
              const items = showAllExpiring ? g.items : g.items.slice(0, 3)
              return (
                <div key={g.key}>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    {g.label}
                  </p>
                  <div className="space-y-2">
                    {items.map((a) => {
                      const emp = a.employees
                      const dept = emp?.departments
                      return (
                        <div key={a.id} className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                              {emp ? emp.first_name + ' ' + emp.last_name : 'Unknown'}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {dept?.name || 'No department'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Badge variant={expiryVariant(a.expires_at)}>
                              {formatExpiryLabel(a.expires_at)}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                    {!showAllExpiring && g.items.length > 3 && (
                      <p className="text-xs text-neutral-500">+{g.items.length - 3} more</p>
                    )}
                  </div>
                </div>
              )
            })}

            {expiring.length > MAX_EXPIRING_OVERVIEW && (
              <button
                onClick={onToggleExpiring}
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                {showAllExpiring ? 'Show less' : 'View all ' + expiring.length + ' expiring'}
              </button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

// --- Approvals Tab ---

function ApprovalsTab({ pendingAdmin, signerName, expandedApproval, onExpandApproval, onSign }) {
  if (pendingAdmin.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-green-400 text-sm">All approvals current — no pending items</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {pendingAdmin.map((a) => {
        const emp = a.employees
        const dept = emp?.departments
        const waitLabel = formatWaitDays(a.updated_at)
        const isExpanded = expandedApproval === a.id

        return (
          <div
            key={a.id}
            className={'rounded-lg bg-neutral-900/50 ' + urgencyBorder(a.updated_at) + ' transition-all'}
          >
            <div
              className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => onExpandApproval(isExpanded ? null : a.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">
                  {emp ? emp.first_name + ' ' + emp.last_name : 'Unknown'}
                </p>
                <p className="text-xs text-neutral-500">{dept?.name || 'No department'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="accent">{TRACK_LABELS[a.track] || a.track}</Badge>
                <span className="text-xs text-neutral-500">{waitLabel}</span>
                <button
                  className={
                    'text-xs px-2.5 py-1 rounded font-medium transition-all ' +
                    (isExpanded
                      ? 'bg-neutral-800 text-neutral-400'
                      : 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25')
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    onExpandApproval(isExpanded ? null : a.id)
                  }}
                >
                  {isExpanded ? 'Close' : 'Sign'}
                </button>
              </div>
            </div>
            {isExpanded && (
              <div className="px-3 pb-3 border-t border-neutral-800/50 pt-3">
                <SignatureBlock
                  signerRole="admin"
                  signerName={signerName}
                  onSign={(sigData) => onSign(a, sigData)}
                  disabled={false}
                  existingSignature={null}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Audit Tab ---

const AUDIT_PAGE_SIZE = 25

function AuditTab({
  auditLog,
  auditSearch,
  onSearchChange,
  auditFilter,
  onFilterChange,
  expandedAudit,
  onToggleExpand,
  page,
  onPageChange,
}) {
  const [dateRange, setDateRange] = useState('all')

  const term = auditSearch.toLowerCase()
  const now = new Date()

  const filtered = auditLog.filter((entry) => {
    if (auditFilter && entry.action !== auditFilter) return false
    if (term) {
      const actorName = entry.employees
        ? (entry.employees.first_name + ' ' + entry.employees.last_name).toLowerCase()
        : ''
      const actionLabel = (ACTION_LABELS[entry.action] || entry.action).toLowerCase()
      if (!actorName.includes(term) && !actionLabel.includes(term)) return false
    }
    if (dateRange !== 'all') {
      const entryDate = new Date(entry.created_at)
      const diffMs = now.getTime() - entryDate.getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      if (dateRange === 'today' && diffDays > 1) return false
      if (dateRange === 'week' && diffDays > 7) return false
      if (dateRange === 'month' && diffDays > 30) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / AUDIT_PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageStart = safePage * AUDIT_PAGE_SIZE
  const pageItems = filtered.slice(pageStart, pageStart + AUDIT_PAGE_SIZE)

  return (
    <Card>
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <TextInput
          name="audit-search"
          placeholder="Search by name or action..."
          value={auditSearch}
          onChange={(e) => {
            onSearchChange(e.target.value)
            onPageChange(0)
          }}
          className="flex-1"
        />
        <Select
          name="audit-filter"
          value={auditFilter}
          onChange={(e) => {
            onFilterChange(e.target.value)
            onPageChange(0)
          }}
          options={ACTION_FILTER_OPTIONS}
          className="sm:w-48"
        />
      </div>

      {/* Date range pills */}
      <div className="flex gap-1 mb-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => {
              setDateRange(r.id)
              onPageChange(0)
            }}
            className={
              'px-3 py-1 rounded-full text-xs font-medium transition-colors ' +
              (dateRange === r.id
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5')
            }
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-sm">No audit entries match your filters.</p>
      ) : (
        <>
          <div className="divide-y divide-neutral-800">
            {pageItems.map((entry) => {
              const actor = entry.employees
                ? entry.employees.first_name + ' ' + entry.employees.last_name
                : 'System'
              const label = ACTION_LABELS[entry.action] || entry.action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              const variant = ACTION_VARIANTS[entry.action] || 'neutral'
              const ts = new Date(entry.created_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true,
              })
              const details = entry.details || {}
              const detailSnippet = details.signer_role
                ? 'Role: ' + details.signer_role
                : details.from_status && details.to_status
                  ? details.from_status + ' → ' + details.to_status
                  : null
              const isExpanded = expandedAudit.has(entry.id)
              const detailEntries = Object.entries(details)
              return (
                <div key={entry.id}>
                  <div
                    className="py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm cursor-pointer hover:bg-neutral-900/30 -mx-1 px-1 rounded transition-colors"
                    onClick={() => onToggleExpand(entry.id)}
                  >
                    <span className={'text-neutral-600 text-xs flex-shrink-0 transition-transform ' + (isExpanded ? 'rotate-90' : '')}>&#9654;</span>
                    <span className="text-xs text-neutral-500 w-36 flex-shrink-0 hidden sm:inline">{ts}</span>
                    <span className="text-xs text-neutral-500 sm:hidden flex-shrink-0">{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <Badge variant={variant}>{label}</Badge>
                    <span className="text-neutral-300 truncate flex-1 min-w-0">{actor}</span>
                    {detailSnippet && (
                      <span className="text-xs text-neutral-500 flex-shrink-0 hidden md:inline">{detailSnippet}</span>
                    )}
                  </div>
                  {isExpanded && detailEntries.length > 0 && (
                    <div className="ml-2 sm:ml-6 mb-2 rounded bg-neutral-900/50 px-3 sm:px-4 py-3 font-mono text-xs text-neutral-400 space-y-1 overflow-x-auto">
                      {detailEntries.map(([k, v]) => (
                        <div key={k}>
                          <span className="text-neutral-500">{k}:</span>{' '}
                          <span className="text-neutral-300">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
              <button
                onClick={() => onPageChange(Math.max(0, safePage - 1))}
                disabled={safePage === 0}
                className="text-sm text-neutral-400 hover:text-white disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-neutral-500">
                Page {safePage + 1} of {totalPages} · {filtered.length} entries
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages - 1, safePage + 1))}
                disabled={safePage >= totalPages - 1}
                className="text-sm text-neutral-400 hover:text-white disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
