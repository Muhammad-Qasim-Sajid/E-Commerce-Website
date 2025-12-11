// app/(store)/order-success/page.tsx
import { CheckCircle, Package, Clock, Mail } from 'lucide-react'
import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order #CP2024-7890 has been received and is being processed.
        </p>
        
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Order Confirmation
              </h3>
              <p className="text-sm text-gray-500">
                Sent to your email
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Estimated Delivery
              </h3>
              <p className="text-sm text-gray-500">
                3-5 business days
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Order Status
              </h3>
              <p className="text-sm text-gray-500">
                Processing
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="btn-primary inline-block w-full md:w-auto"
          >
            Continue Shopping
          </Link>
          
          <p className="text-sm text-gray-500">
            Questions about your order?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}