// components/store/PriceDisplay.tsx
interface PriceDisplayProps {
  price: number
  discount?: number
  size?: 'sm' | 'md' | 'lg'
}

const PriceDisplay = ({ price, discount, size = 'md' }: PriceDisplayProps) => {
  const finalPrice = discount ? price * (1 - discount / 100) : price
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  return (
    <div className="flex items-center gap-2">
      {discount ? (
        <>
          <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
            ${finalPrice.toFixed(2)}
          </span>
          <span className={`text-gray-500 line-through ${sizeClasses[size]}`}>
            ${price.toFixed(2)}
          </span>
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </span>
        </>
      ) : (
        <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
          ${price.toFixed(2)}
        </span>
      )}
    </div>
  )
}

export default PriceDisplay