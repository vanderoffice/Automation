import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const RoleContext = createContext(null)

const STORAGE_KEY = 'ecos_selected_employee_id'

export function RoleProvider({ children }) {
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all employees on mount
  useEffect(() => {
    async function loadEmployees() {
      const { data, error } = await supabase
        .from('employees')
        .select('*, departments(*)')
        .order('last_name')

      if (error) {
        console.error('RoleContext: failed to load employees', error)
        setLoading(false)
        return
      }

      setEmployees(data || [])

      // Restore previously selected employee from localStorage, or pick first
      const savedId = localStorage.getItem(STORAGE_KEY)
      const savedEmployee = savedId && data?.find((e) => e.id === savedId)

      if (savedEmployee) {
        setCurrentEmployee(savedEmployee)
      } else if (data?.length > 0) {
        setCurrentEmployee(data[0])
        localStorage.setItem(STORAGE_KEY, data[0].id)
      }

      setLoading(false)
    }

    loadEmployees()
  }, [])

  const switchRole = useCallback(
    async (employeeId) => {
      // Try local list first for instant switch
      const local = employees.find((e) => e.id === employeeId)
      if (local) {
        setCurrentEmployee(local)
        localStorage.setItem(STORAGE_KEY, employeeId)
        return
      }

      // Fallback: fetch from Supabase
      const { data, error } = await supabase
        .from('employees')
        .select('*, departments(*)')
        .eq('id', employeeId)
        .single()

      if (error) {
        console.error('RoleContext: switchRole error', error)
        return
      }

      setCurrentEmployee(data)
      localStorage.setItem(STORAGE_KEY, employeeId)
    },
    [employees]
  )

  const value = {
    currentEmployee,
    role: currentEmployee?.role ?? null,
    departmentId: currentEmployee?.department_id ?? null,
    employees,
    switchRole,
    loading,
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return ctx
}
