'use client';

import Link from 'next/link'
import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { products } from '../../data/products';

const ProductTable = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id.toString()))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleDelete = () => {
    if (selectedProducts.length > 0) {
      if (confirm(`Delete ${selectedProducts.length} product(s)?`)) {
        alert('Products deleted (demo)')
        setSelectedProducts([])
      }
    }
  }

  return (
    <div>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectedProducts.length === products.length}
            onChange={handleSelectAll}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-500">
            {selectedProducts.length} selected
          </span>
          {selectedProducts.length > 0 && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {products.length} products total
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id.toString())}
                    onChange={() => handleSelectProduct(product.id.toString())}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={product.images[0]?.url || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">
                    ${product.price.toFixed(2)}
                    {product.discount && (
                      <span className="text-sm text-red-600 ml-2">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      target="_blank"
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => alert('Delete product')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;