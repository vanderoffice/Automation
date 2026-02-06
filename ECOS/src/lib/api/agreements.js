import { supabase } from '../supabase.js'

/**
 * Get agreements with optional filters.
 * @param {Object} [filters] - Optional filters: { status, departmentId, employeeId }
 */
export async function getAgreements(filters = {}) {
  let query = supabase
    .from('agreements')
    .select('*, employees(*, departments(*))')
    .order('updated_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.employeeId) {
    query = query.eq('employee_id', filters.employeeId)
  }
  if (filters.departmentId) {
    query = query.eq('employees.department_id', filters.departmentId)
  }

  const { data, error } = await query

  if (error) console.error('getAgreements error:', error)
  return { data, error }
}

/**
 * Get a single agreement by ID with full related data.
 */
export async function getAgreement(id) {
  const { data, error } = await supabase
    .from('agreements')
    .select('*, employees(*, departments(*)), agreement_access_groups(*), signatures(*, employees(*))')
    .eq('id', id)
    .single()

  if (error) console.error('getAgreement error:', error)
  return { data, error }
}

/**
 * Create a new agreement.
 */
export async function createAgreement(data) {
  const { data: created, error } = await supabase
    .from('agreements')
    .insert(data)
    .select()
    .single()

  if (error) console.error('createAgreement error:', error)
  return { data: created, error }
}

/**
 * Update an existing agreement.
 */
export async function updateAgreement(id, data) {
  const { data: updated, error } = await supabase
    .from('agreements')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) console.error('updateAgreement error:', error)
  return { data: updated, error }
}

/**
 * Get agreements filtered by workflow status.
 */
export async function getAgreementsByStatus(status) {
  const { data, error } = await supabase
    .from('agreements')
    .select('*, employees(*, departments(*))')
    .eq('status', status)
    .order('updated_at', { ascending: false })

  if (error) console.error('getAgreementsByStatus error:', error)
  return { data, error }
}

/**
 * Get all agreements for a specific employee.
 */
export async function getAgreementsByEmployee(employeeId) {
  const { data, error } = await supabase
    .from('agreements')
    .select('*, employees(*, departments(*))')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })

  if (error) console.error('getAgreementsByEmployee error:', error)
  return { data, error }
}

/**
 * Get agreements expiring within N days from now.
 */
export async function getExpiringAgreements(daysUntilExpiry = 30) {
  const now = new Date()
  const cutoff = new Date(now.getTime() + daysUntilExpiry * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('agreements')
    .select('*, employees(*, departments(*))')
    .gte('expires_at', now.toISOString())
    .lte('expires_at', cutoff.toISOString())
    .order('expires_at')

  if (error) console.error('getExpiringAgreements error:', error)
  return { data, error }
}
