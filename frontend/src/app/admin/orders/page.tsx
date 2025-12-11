// app/admin/orders/page.tsx
import OrderTable from '@/components/admin/OrderTable'
import { Download } from 'lucide-react'

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>
      
      <div className="card">
        <OrderTable />
      </div>
    </div>
  )
}