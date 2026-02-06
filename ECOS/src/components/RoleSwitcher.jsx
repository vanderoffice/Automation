import { useState, useRef, useEffect } from 'react'
import { useRole } from '../context/RoleContext'

const ROLE_COLORS = {
  employee: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
  manager: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
  admin: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
}

const ROLE_LABELS = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Admin',
}

const ROLE_ORDER = ['employee', 'manager', 'admin']

function RoleBadge({ role }) {
  const colors = ROLE_COLORS[role] || ROLE_COLORS.employee
  return (
    <span className={'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ' + colors.bg + ' ' + colors.text + ' ' + colors.border + ' border'}>
      {ROLE_LABELS[role] || role}
    </span>
  )
}

export default function RoleSwitcher() {
  const { employees, currentEmployee, switchRole } = useRole()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  if (!currentEmployee) return null

  // Group employees by role
  const grouped = {}
  for (const role of ROLE_ORDER) {
    grouped[role] = []
  }
  for (const emp of employees) {
    if (grouped[emp.role]) {
      grouped[emp.role].push(emp)
    }
  }

  const dept = currentEmployee.departments

  function handleSelect(employeeId) {
    switchRole(employeeId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Current identity — clickable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-800/60 transition-colors duration-150 text-left"
      >
        {/* Avatar circle */}
        <div className={'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ' + (ROLE_COLORS[currentEmployee.role]?.bg || 'bg-neutral-700') + ' ' + (ROLE_COLORS[currentEmployee.role]?.text || 'text-neutral-300')}>
          {currentEmployee.first_name[0]}{currentEmployee.last_name[0]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">
              {currentEmployee.first_name} {currentEmployee.last_name}
            </span>
            <RoleBadge role={currentEmployee.role} />
          </div>
          <p className="text-xs text-neutral-400 truncate">
            {dept?.name || 'No department'}
          </p>
        </div>

        {/* Chevron */}
        <svg
          className={'w-4 h-4 text-neutral-500 transition-transform duration-150 flex-shrink-0 ' + (isOpen ? 'rotate-180' : '')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl max-h-72 overflow-y-auto z-50">
          {ROLE_ORDER.map((role) => {
            const group = grouped[role]
            if (!group || group.length === 0) return null

            return (
              <div key={role}>
                {/* Group header */}
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-900 sticky top-0">
                  {ROLE_LABELS[role]}s
                </div>

                {group.map((emp) => {
                  const isActive = emp.id === currentEmployee.id
                  const empDept = emp.departments

                  return (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => handleSelect(emp.id)}
                      className={'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-100 ' + (isActive ? 'bg-neutral-800' : 'hover:bg-neutral-800/60')}
                    >
                      <div className={'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ' + (ROLE_COLORS[emp.role]?.bg || 'bg-neutral-700') + ' ' + (ROLE_COLORS[emp.role]?.text || 'text-neutral-300')}>
                        {emp.first_name[0]}{emp.last_name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={'text-sm truncate ' + (isActive ? 'text-white font-medium' : 'text-neutral-300')}>
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {emp.title || empDept?.name || 'No department'}
                        </p>
                      </div>
                      {isActive && (
                        <svg className="w-4 h-4 text-orange-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
