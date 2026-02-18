import { useState, useEffect, useCallback } from 'react'
import {
  getAgreements,
  getExpiringAgreements,
  getPendingForRole,
  getRecentActivity,
} from './api/index.js'

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

  depts.sort((a, b) => a.rate - b.rate)
  return depts
}

export function useDashboardData() {
  const [agreements, setAgreements] = useState([])
  const [expiring, setExpiring] = useState([])
  const [pendingAdmin, setPendingAdmin] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [allResult, expiringResult, pendingResult, auditResult] = await Promise.all([
        getAgreements(),
        getExpiringAgreements(90),
        getPendingForRole('admin'),
        getRecentActivity(200),
      ])
      if (allResult.error) throw allResult.error
      if (expiringResult.error) throw expiringResult.error
      if (pendingResult.error) throw pendingResult.error
      if (auditResult.error) throw auditResult.error
      setAgreements(allResult.data || [])
      setExpiring(expiringResult.data || [])
      setAuditLog(auditResult.data || [])
      const pending = (pendingResult.data || []).sort(
        (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
      )
      setPendingAdmin(pending)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('useDashboardData: load error', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const stats = computeStats(agreements)
  const departments = computeDepartments(agreements)

  return {
    agreements,
    expiring,
    pendingAdmin,
    auditLog,
    stats,
    departments,
    lastUpdated,
    loading,
    error,
    reload: loadData,
  }
}

// Shared utility functions
export function rateColor(rate) {
  if (rate >= 80) return 'text-green-400'
  if (rate >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export function barColor(rate) {
  if (rate >= 80) return 'bg-green-500'
  if (rate >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function formatExpiryLabel(expiresAt) {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Expired ' + Math.abs(diffDays) + ' days ago'
  if (diffDays === 0) return 'Expires today'
  return 'Expires in ' + diffDays + ' days'
}

export function expiryVariant(expiresAt) {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 30) return 'warning'
  if (diffDays <= 60) return 'accent'
  return 'neutral'
}

export function formatWaitDays(updatedAt) {
  const now = new Date()
  const updated = new Date(updatedAt)
  const diffMs = now.getTime() - updated.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return days + ' days'
}

export function urgencyBorder(updatedAt) {
  const now = new Date()
  const updated = new Date(updatedAt)
  const diffMs = now.getTime() - updated.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days > 7) return 'border-l-4 border-l-red-500'
  if (days >= 3) return 'border-l-4 border-l-orange-500'
  return 'border-l-4 border-l-neutral-700'
}

export const TRACK_LABELS = {
  new_updated: 'New / Updated',
  annual_renewal: 'Annual Renewal',
}

export const ACTION_LABELS = {
  agreement_submitted: 'Submitted',
  signature_recorded: 'Signed',
  agreement_completed: 'Completed',
}

export const ACTION_VARIANTS = {
  agreement_submitted: 'accent',
  signature_recorded: 'success',
  agreement_completed: 'success',
}

export const ACTION_FILTER_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'agreement_submitted', label: 'Submitted' },
  { value: 'signature_recorded', label: 'Signed' },
  { value: 'agreement_completed', label: 'Completed' },
]
