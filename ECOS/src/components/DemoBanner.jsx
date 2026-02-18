import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

const DISMISS_KEY = 'ecos_demo_banner_dismissed'

function getHint(role, pathname) {
  if (pathname.startsWith('/agreement')) {
    if (role === 'employee') return 'You\u2019re viewing as an employee. Fill out and submit a new ECOS security agreement.'
    if (role === 'manager') return 'As a manager, you can also submit your own agreement.'
    if (role === 'admin') return 'Admins can submit agreements too \u2014 the same form works for all roles.'
  }
  if (pathname.startsWith('/workflow')) {
    if (role === 'employee') return 'Your submitted agreements appear here. Once submitted, your manager reviews next.'
    if (role === 'manager') return 'Agreements from your team are waiting for your signature. Review and sign below.'
    if (role === 'admin') return 'After manager approval, agreements come to you for final sign-off.'
  }
  if (pathname.startsWith('/dashboard')) {
    if (role === 'admin') return 'This dashboard shows organization-wide compliance. Try signing a pending approval, then check the audit trail.'
    if (role === 'manager') return 'The admin dashboard shows full compliance data. Switch to an admin role to see approval actions.'
    return 'The admin dashboard is an admin-only view. Switch to an admin role to explore.'
  }
  return null
}

export default function DemoBanner() {
  const { role } = useRole()
  const { pathname } = useLocation()
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === 'true')
  const prevRoleRef = useRef(role)

  // Re-show banner when role changes
  useEffect(() => {
    if (prevRoleRef.current !== role) {
      setDismissed(false)
      sessionStorage.removeItem(DISMISS_KEY)
      prevRoleRef.current = role
    }
  }, [role])

  if (dismissed || !role) return null

  const hint = getHint(role, pathname)
  if (!hint) return null

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem(DISMISS_KEY, 'true')
  }

  return (
    <div data-demo-banner className="mb-4 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm text-orange-300/90">
      <span className="flex-shrink-0 text-orange-500">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>
      <span className="flex-1">{hint}</span>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-0.5 rounded hover:bg-orange-500/20 text-orange-500/60 hover:text-orange-400 transition-colors"
        aria-label="Dismiss hint"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
