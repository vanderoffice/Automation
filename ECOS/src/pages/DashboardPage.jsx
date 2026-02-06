import { useState, useEffect, useCallback } from 'react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { getAgreements } from '../lib/api/index.js'

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

export default function DashboardPage() {
  const [agreements, setAgreements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await getAgreements()
      if (err) throw err
      setAgreements(data || [])
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
    </div>
  )
}
