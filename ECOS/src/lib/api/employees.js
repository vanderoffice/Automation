import { supabase } from '../supabase.js'

/**
 * Get all employees with department info.
 */
export async function getEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .order('last_name')

  if (error) console.error('getEmployees error:', error)
  return { data, error }
}

/**
 * Get employees filtered by department.
 */
export async function getEmployeesByDepartment(departmentId) {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .eq('department_id', departmentId)
    .order('last_name')

  if (error) console.error('getEmployeesByDepartment error:', error)
  return { data, error }
}

/**
 * Get employees filtered by role (employee, manager, admin).
 */
export async function getEmployeesByRole(role) {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .eq('role', role)
    .order('last_name')

  if (error) console.error('getEmployeesByRole error:', error)
  return { data, error }
}

/**
 * Get a single employee by ID with department info.
 */
export async function getEmployee(id) {
  const { data, error } = await supabase
    .from('employees')
    .select('*, departments(*)')
    .eq('id', id)
    .single()

  if (error) console.error('getEmployee error:', error)
  return { data, error }
}
