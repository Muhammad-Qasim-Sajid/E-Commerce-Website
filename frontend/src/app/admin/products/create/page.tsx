// app/admin/products/create/page.tsx
import ProductForm from '@/components/admin/ProductForm'

export default function CreateProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h1>
      <ProductForm />
    </div>
  )
}