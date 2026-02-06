import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useRole } from '../context/RoleContext'
import { Card, Badge, SectionHeader } from '../components/ui'

/**
 * Temporary data verification view.
 * Proves full stack: React -> Supabase -> PostgreSQL (ecos schema + RLS) -> data displayed.
 * Phase 3 will replace this with the actual security agreement form.
 */
export default function AgreementPage() {
  const { currentEmployee, role, loading: roleLoading } = useRole()
  const [counts, setCounts] = useState(null)
  const [connected, setConnected] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [deptRes, empRes, agrRes] = await Promise.all([
          supabase.from('departments').select('id', { count: 'exact', head: true }),
          supabase.from('employees').select('id', { count: 'exact', head: true }),
          supabase.from('agreements').select('id', { count: 'exact', head: true }),
        ])

        const hasError = deptRes.error || empRes.error || agrRes.error
        if (hasError) {
          console.error('AgreementPage fetch errors:', { deptRes, empRes, agrRes })
          setError('Failed to fetch data from Supabase')
          setConnected(false)
          return
        }

        setCounts({
          departments: deptRes.count,
          employees: empRes.count,
          agreements: agrRes.count,
        })
        setConnected(true)
      } catch (err) {
        console.error('AgreementPage error:', err)
        setError(err.message)
        setConnected(false)
      }
    }

    fetchCounts()
  }, [])

  if (roleLoading) {
    return (
      <div className="animate-in max-w-4xl">
        <p className="text-neutral-400">Loading role context...</p>
      </div>
    )
  }

  return (
    <div className="animate-in space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Security Agreement
        </h1>
        <p className="text-neutral-400 mb-2">
          Data verification view — confirming full stack connectivity.
        </p>
        <p className="text-neutral-500 text-sm">
          This is a temporary view. Phase 3 replaces it with the actual form.
        </p>
      </div>

      {/* Connection status */}
      <SectionHeader
        title="Database Connection"
        description="Supabase via PostgREST to ecos schema"
      />
      <Card>
        <div className="flex items-center gap-3">
          {connected === null && (
            <span className="text-neutral-400">Checking connection...</span>
          )}
          {connected === true && (
            <>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-400 font-medium">
                Connected to database
              </span>
            </>
          )}
          {connected === false && (
            <>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
              <span className="text-red-400 font-medium">
                Connection failed
              </span>
              {error && (
                <span className="text-red-500 text-sm ml-2">{error}</span>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Current identity */}
      <SectionHeader
        title="Current Demo Identity"
        description="Active role for this session"
      />
      <Card>
        {currentEmployee ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium text-lg">
                {currentEmployee.first_name} {currentEmployee.last_name}
              </span>
              <Badge
                variant={
                  role === 'admin'
                    ? 'accent'
                    : role === 'manager'
                      ? 'warning'
                      : 'neutral'
                }
              >
                {role}
              </Badge>
            </div>
            <div className="text-sm text-neutral-400 space-y-1">
              <p>
                <span className="text-neutral-500">Title:</span>{' '}
                {currentEmployee.title}
              </p>
              <p>
                <span className="text-neutral-500">Department:</span>{' '}
                {currentEmployee.departments?.name ?? 'N/A'}
              </p>
              <p>
                <span className="text-neutral-500">Employee #:</span>{' '}
                {currentEmployee.employee_number}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-neutral-500">No employee selected</p>
        )}
      </Card>

      {/* Data counts */}
      <SectionHeader
        title="Seed Data Counts"
        description="Records loaded from ecos schema"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {counts?.departments ?? '--'}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Departments</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {counts?.employees ?? '--'}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Employees</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {counts?.agreements ?? '--'}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Agreements</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
