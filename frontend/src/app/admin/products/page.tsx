// app/admin/products/page.tsx
import ProductTable from '@/components/admin/ProductTable'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/create"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>
      
      <div className="card">
        <ProductTable />
      </div>
    </div>
  )
}