// components/admin/StatusBadge.tsx
import { OrderStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: OrderStatus
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
    shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  }

  const config = statusConfig[status]

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge