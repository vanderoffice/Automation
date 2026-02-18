import { Badge } from '../ui/Badge'

const STATUS_LABELS = {
  draft: 'Draft',
  pending_employee: 'Pending Employee',
  pending_manager: 'Pending Manager',
  pending_admin: 'Pending Admin',
  completed: 'Completed',
  expired: 'Expired',
}

const STATUS_VARIANTS = {
  draft: 'neutral',
  pending_employee: 'warning',
  pending_manager: 'warning',
  pending_admin: 'warning',
  completed: 'success',
  expired: 'error',
}

function StatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'neutral'}>
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}

export { StatusBadge, STATUS_LABELS, STATUS_VARIANTS }
