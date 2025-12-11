// components/store/AddToCart.tsx
'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Product, Variant } from '@/lib/types'

interface AddToCartProps {
  product: Product
}

const AddToCart = ({ product }: AddToCartProps) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    alert(`Added ${quantity} × ${product.name} to cart`)
  }

  return (
    <div className="space-y-6">
      {product.variants.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Select Variant</h4>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 border rounded-lg ${
                  selectedVariant?.id === variant.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-2 w-16 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>

      <div className="space-y-2">
        <button className="w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-50">
          Add to Wishlist
        </button>
        <p className="text-sm text-gray-500">
          Free shipping on orders over $500. 30-day return policy.
        </p>
      </div>
    </div>
  )
}

export default AddToCart