import { useState, useEffect, useCallback } from 'react'
import { useRole } from '../context/RoleContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { SignatureBlock } from '../components/form/SignatureBlock'
import {
  getAgreements,
  getExpiringAgreements,
  getPendingForRole,
  createSignature,
  advanceWorkflow,
  logAction,
} from '../lib/api/index.js'

function computeStats(agreements) {
  const nonDraft = agreements.filter((a) => a.status !== 'draft')
  const completed = nonDraft.filter((a) => a.status === 'completed')
  const pending = nonDraft.filter(
    (a) => a.status === 'pending_manager' || a.status === 'pending_admin'
  )
  const total = nonDraft.length
  const rate = total > 0 ? Math.round((completed.length / total) * 100) : 0

  return {
    total,
    completed: completed.length,
    pending: pending.length,
    rate,
  }
}

function computeDepartments(agreements) {
  const nonDraft = agreements.filter((a) => a.status !== 'draft')
  const deptMap = {}

  for (const a of nonDraft) {
    const deptName = a.employees?.departments?.name || 'Unassigned'
    if (!deptMap[deptName]) {
      deptMap[deptName] = { name: deptName, total: 0, completed: 0 }
    }
    deptMap[deptName].total++
    if (a.status === 'completed') {
      deptMap[deptName].completed++
    }
  }

  const depts = Object.values(deptMap).map((d) => ({
    ...d,
    rate: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
  }))

  // Sort by compliance rate ascending (worst first)
  depts.sort((a, b) => a.rate - b.rate)
  return depts
}

function rateVariant(rate) {
  if (rate >= 80) return 'success'
  if (rate >= 60) return 'warning'
  return 'error'
}

function rateColor(rate) {
  if (rate >= 80) return 'text-green-400'
  if (rate >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

function barColor(rate) {
  if (rate >= 80) return 'bg-green-500'
  if (rate >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

function formatExpiryLabel(expiresAt) {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Expired ' + Math.abs(diffDays) + ' days ago'
  if (diffDays === 0) return 'Expires today'
  return 'Expires in ' + diffDays + ' days'
}

function expiryVariant(expiresAt) {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 30) return 'warning'
  if (diffDays <= 60) return 'accent'
  return 'neutral'
}

const TRACK_LABELS = {
  new_updated: 'New / Updated',
  annual_renewal: 'Annual Renewal',
}

function formatWaitDays(updatedAt) {
  const now = new Date()
  const updated = new Date(updatedAt)
  const diffMs = now.getTime() - updated.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return days + ' days'
}

function urgencyBorder(updatedAt) {
  const now = new Date()
  const updated = new Date(updatedAt)
  const diffMs = now.getTime() - updated.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days > 7) return 'border-l-4 border-l-red-500'
  if (days >= 3) return 'border-l-4 border-l-orange-500'
  return 'border-l-4 border-l-neutral-700'
}

export default function DashboardPage() {
  const { currentEmployee } = useRole()
  const [agreements, setAgreements] = useState([])
  const [expiring, setExpiring] = useState([])
  const [pendingAdmin, setPendingAdmin] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [allResult, expiringResult, pendingResult] = await Promise.all([
        getAgreements(),
        getExpiringAgreements(90),
        getPendingForRole('admin'),
      ])
      if (allResult.error) throw allResult.error
      if (expiringResult.error) throw expiringResult.error
      if (pendingResult.error) throw pendingResult.error
      setAgreements(allResult.data || [])
      setExpiring(expiringResult.data || [])
      // Sort by wait time (longest waiting first)
      const pending = (pendingResult.data || []).sort(
        (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
      )
      setPendingAdmin(pending)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('DashboardPage: load error', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400 mb-8">Compliance and audit dashboard</p>
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
        <p className="text-neutral-400 mb-8">Compliance and audit dashboard</p>
        <Card>
          <p className="text-red-400">{error}</p>
        </Card>
      </div>
    )
  }

  const stats = computeStats(agreements)
  const departments = computeDepartments(agreements)

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
    loadData()
  }

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p className="text-neutral-400 mb-8">Compliance and audit dashboard</p>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Pending Approvals queue */}
      <div className="mb-8">
        <Card title={'Pending Approvals (' + pendingAdmin.length + ')'}>
          {pendingAdmin.length === 0 ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-green-400 text-sm">All approvals current — no pending items</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAdmin.map((a) => {
                const emp = a.employees
                const dept = emp?.departments
                const waitLabel = formatWaitDays(a.updated_at)
                return (
                  <div key={a.id} className={'rounded-lg bg-neutral-900/50 p-4 ' + urgencyBorder(a.updated_at)}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {emp ? emp.first_name + ' ' + emp.last_name : 'Unknown'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {dept?.name || 'No department'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="accent">
                          {TRACK_LABELS[a.track] || a.track}
                        </Badge>
                        <span className="text-xs text-neutral-500">
                          Waiting {waitLabel}
                        </span>
                      </div>
                    </div>
                    <SignatureBlock
                      signerRole="admin"
                      signerName={signerName}
                      onSign={(sigData) => handleAdminSign(a, sigData)}
                      disabled={false}
                      existingSignature={null}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Department compliance table */}
      <Card title="Department Compliance">
        {departments.length === 0 ? (
          <p className="text-neutral-500">No department data available.</p>
        ) : (
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.name} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <p className="text-sm text-white font-medium truncate">{dept.name}</p>
                  <p className="text-xs text-neutral-500">
                    {dept.completed}/{dept.total} completed
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={'h-full rounded-full transition-all ' + barColor(dept.rate)}
                      style={{ width: dept.rate + '%' }}
                    />
                  </div>
                </div>
                <div className="w-14 text-right flex-shrink-0">
                  <span className={'text-sm font-semibold ' + rateColor(dept.rate)}>
                    {dept.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Expiring Soon */}
      <div className="mt-8">
        <Card title="Expiring Soon">
          {expiring.length === 0 ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <p className="text-green-400 text-sm">All agreements current</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiring.map((a) => {
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
            </div>
          )}
        </Card>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-xs text-neutral-600 mt-6 text-right">
          Last updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
