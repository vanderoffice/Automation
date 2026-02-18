const SIGNING_ORDER = ['employee', 'manager', 'admin']

function MiniProgressDots({ signatures, status }) {
  const sigByRole = {}
  for (const sig of signatures) {
    sigByRole[sig.signer_role] = sig
  }

  const pendingRoleMap = {
    pending_employee: 'employee',
    pending_manager: 'manager',
    pending_admin: 'admin',
  }
  const currentPendingRole = pendingRoleMap[status] || null

  return (
    <div className="flex items-center gap-1" title={getTooltip(sigByRole, currentPendingRole)}>
      {SIGNING_ORDER.map((role, i) => {
        const isSigned = !!sigByRole[role]
        const isCurrent = role === currentPendingRole

        return (
          <div key={role} className="flex items-center">
            {i > 0 && (
              <div
                className={
                  'w-2 h-0.5 ' +
                  (sigByRole[SIGNING_ORDER[i - 1]] ? 'bg-green-500/40' : 'bg-neutral-700')
                }
              />
            )}
            <div
              className={
                'w-3 h-3 rounded-full flex items-center justify-center ' +
                (isSigned
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : isCurrent
                    ? 'bg-orange-500/20 border-2 border-orange-500'
                    : 'bg-neutral-800 border-2 border-neutral-600')
              }
            >
              {isSigned && (
                <svg className="w-1.5 h-1.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getTooltip(sigByRole, currentPendingRole) {
  const parts = SIGNING_ORDER.map((role) => {
    if (sigByRole[role]) return role.charAt(0).toUpperCase() + role.slice(1) + ': Signed'
    if (role === currentPendingRole) return role.charAt(0).toUpperCase() + role.slice(1) + ': Awaiting'
    return role.charAt(0).toUpperCase() + role.slice(1) + ': Pending'
  })
  return parts.join(' | ')
}

export { MiniProgressDots }
