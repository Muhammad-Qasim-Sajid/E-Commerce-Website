// app/(store)/checkout/page.tsx
import CheckoutForm from '@/components/store/CheckoutForm'
import PriceDisplay from '@/components/store/PriceDisplay'
import { products } from '@/data/products'
import { Trash2 } from 'lucide-react'

export default function CheckoutPage() {
  const cartItems = [
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 },
  ]

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal > 500 ? 0 : 25
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <PriceDisplay
                      price={item.product.price * item.quantity}
                      discount={item.product.discount}
                    />
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" id="gift" className="rounded" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" id="terms" className="rounded" required />
                <label htmlFor="terms">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}