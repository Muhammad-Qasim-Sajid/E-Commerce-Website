// app/admin/products/[id]/edit/page.tsx
import ProductForm from '@/components/admin/ProductForm'

export default function EditProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm isEdit />
    </div>
  )
}