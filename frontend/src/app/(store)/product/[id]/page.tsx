// app/(store)/product/[id]/page.tsx
import ProductGallery from '@/components/store/ProductGallery'
import AddToCart from '@/components/store/AddToCart'
import PriceDisplay from '@/components/store/PriceDisplay'
import { products } from '@/data/products'
import { notFound } from 'next/navigation'
import { Check, Shield, Truck } from 'lucide-react'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === parseInt(params.id))
  
  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <ProductGallery images={product.images} />
        </div>
        
        <div>
          <div className="mb-4">
            <span className="text-sm font-medium text-primary-600">
              {product.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <PriceDisplay price={product.price} discount={product.discount} size="lg" />
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-600" />
              <span>In stock - Ready to ship</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-primary-600" />
              <span>2-year manufacturer warranty</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="w-5 h-5 text-primary-600" />
              <span>Free express shipping</span>
            </div>
          </div>
          
          <AddToCart product={product} />
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500">Movement</h4>
                <p className="font-medium">{product.specifications?.movement || 'Automatic'}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Case Material</h4>
                <p className="font-medium">{product.specifications?.caseMaterial || 'Stainless Steel'}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Water Resistance</h4>
                <p className="font-medium">{product.specifications?.waterResistance || '50m'}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Diameter</h4>
                <p className="font-medium">{product.specifications?.diameter || '42mm'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}