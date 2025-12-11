// components/store/ProductCard.tsx
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Product } from '../../lib/types';
import PriceDisplay from './PriceDisplay'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="card overflow-hidden group">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]?.url || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mt-4">
            <PriceDisplay
              price={product.price}
              discount={product.discount}
              size="lg"
            />
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.rating || 4.5}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard