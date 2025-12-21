'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Check, Share2 } from 'lucide-react';

// Mock data based on your schema
const productData = {
  id: 1,
  name: 'Chronograph Pro',
  smallDescription: 'A premium chronograph watch with automatic movement.',
  longDescription: 'A premium chronograph watch with automatic movement, featuring a stainless steel case and sapphire crystal. Perfect for both casual and formal occasions. This exquisite timepiece combines traditional craftsmanship with modern technology, offering precision timekeeping with elegant aesthetics. The watch features a scratch-resistant sapphire crystal, luminous hands, and a date window at 3 o\'clock position.',
  featuredProduct: true,
  variants: [
    {
      id: '1',
      variantName: 'Silver / Black',
      variantImage: 'https://via.placeholder.com/1200x1200/eeeceb/666666?text=Silver+Black',
      variantPrice: 1299.99,
      variantPreviousPrice: 1499.99,
      variantOrder: 1,
      variantStock: 25,
    },
    {
      id: '2',
      variantName: 'Rose Gold / Brown',
      variantImage: 'https://via.placeholder.com/1200x1200/eeeceb/666666?text=Rose+Gold+Brown',
      variantPrice: 1399.99,
      variantPreviousPrice: null,
      variantOrder: 2,
      variantStock: 12,
    },
    {
      id: '3',
      variantName: 'Black / Steel',
      variantImage: 'https://via.placeholder.com/1200x1200/eeeceb/666666?text=Black+Steel',
      variantPrice: 1249.99,
      variantPreviousPrice: 1399.99,
      variantOrder: 3,
      variantStock: 8,
    },
  ],
};

export default function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState(productData.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const productImages = [
    selectedVariant.variantImage,
    'https://via.placeholder.com/1200x1200/eeeceb/666666?text=Side+View',
    'https://via.placeholder.com/1200x1200/eeeceb/666666?text=Wrist+View',
    'https://via.placeholder.com/1200x1200/eeeceb/666666?text=Close+Up',
  ];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${selectedVariant.variantName} variant to cart`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${quantity} ${selectedVariant.variantName} variant`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productData.name,
        text: productData.smallDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const discountPercentage = selectedVariant.variantPreviousPrice
    ? Math.round(((selectedVariant.variantPreviousPrice - selectedVariant.variantPrice) / selectedVariant.variantPreviousPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Product Header */}
        <div className="mb-6">
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#1a1a1a] tracking-tight mb-2">
            {productData.name}
          </h1>
          <p className="text-sm text-[#666666] tracking-tight">
            {productData.smallDescription}
          </p>
        </div>

        {/* Main Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white border border-[#eae2d6] mb-4">
              <div className="aspect-square overflow-hidden">
                <img
                  src={productImages[currentImageIndex]}
                  alt={`${productData.name} - View ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 border border-[#eae2d6] flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#1a1a1a]" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 border border-[#eae2d6] flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#1a1a1a]" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-[#1a1a1a]' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square border ${
                    index === currentImageIndex ? 'border-[#d4af37]' : 'border-[#eae2d6]'
                  } bg-white overflow-hidden`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <div className="bg-white border border-[#eae2d6] p-6">
              {/* Price Section */}
              <div className="mb-6 pb-6 border-b border-[#eae2d6]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-['Playfair_Display'] text-3xl text-[#1a1a1a]">
                    PKR {selectedVariant.variantPrice.toLocaleString()}
                  </span>
                  {selectedVariant.variantPreviousPrice && (
                    <>
                      <span className="text-lg text-[#666666] line-through">
                        PKR {selectedVariant.variantPreviousPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 font-medium">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedVariant.variantStock > 10 ? 'bg-green-500' : 
                    selectedVariant.variantStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-[#666666]">
                    {selectedVariant.variantStock > 10 
                      ? 'In Stock' 
                      : selectedVariant.variantStock > 0 
                        ? `Only ${selectedVariant.variantStock} left` 
                        : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Variants Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1a1a1a] mb-3">Select Variant</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productData.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border text-left transition-all duration-200 ${
                        selectedVariant.id === variant.id
                          ? 'border-[#d4af37] bg-[#f9f7f3]'
                          : 'border-[#eae2d6] hover:border-[#1a1a1a]'
                      }`}
                    >
                      <div className="aspect-square bg-[#eeeceb] mb-2 overflow-hidden">
                        <img
                          src={variant.variantImage}
                          alt={variant.variantName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#1a1a1a] truncate">{variant.variantName}</span>
                        {selectedVariant.id === variant.id && (
                          <Check className="w-3 h-3 text-[#d4af37]" />
                        )}
                      </div>
                      <div className="text-xs text-[#666666] mt-1">
                        PKR {variant.variantPrice.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1a1a1a] mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#eae2d6]">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-[#f9f7f3] transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(selectedVariant.variantStock, q + 1))}
                      className="px-3 py-2 hover:bg-[#f9f7f3] transition-colors"
                      disabled={quantity >= selectedVariant.variantStock}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-[#666666]">
                    {selectedVariant.variantStock} available
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.variantStock === 0}
                  className="w-full bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_100%)] text-white py-4 hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{selectedVariant.variantStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                
                {selectedVariant.variantStock > 0 && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full border border-[#1a1a1a] text-[#1a1a1a] py-4 hover:bg-[#f9f7f3] transition-colors"
                  >
                    Buy Now
                  </button>
                )}

                <div className="flex gap-2 pt-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex-1 border border-[#eae2d6] py-3 hover:bg-[#f9f7f3] transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-[#666666]'}`} />
                    <span className="text-sm text-[#666666]">Wishlist</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 border border-[#eae2d6] py-3 hover:bg-[#f9f7f3] transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-[#666666]" />
                    <span className="text-sm text-[#666666]">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-white border border-[#eae2d6] p-6">
              <h3 className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-4">
                Product Description
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-[#666666] leading-relaxed">
                  {productData.longDescription}
                </p>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="border border-[#eae2d6] p-3">
                    <h4 className="text-xs font-medium text-[#666666] mb-1">Movement</h4>
                    <p className="text-sm text-[#1a1a1a]">Automatic</p>
                  </div>
                  <div className="border border-[#eae2d6] p-3">
                    <h4 className="text-xs font-medium text-[#666666] mb-1">Case Material</h4>
                    <p className="text-sm text-[#1a1a1a]">Stainless Steel</p>
                  </div>
                  <div className="border border-[#eae2d6] p-3">
                    <h4 className="text-xs font-medium text-[#666666] mb-1">Water Resistance</h4>
                    <p className="text-sm text-[#1a1a1a]">50m</p>
                  </div>
                  <div className="border border-[#eae2d6] p-3">
                    <h4 className="text-xs font-medium text-[#666666] mb-1">Diameter</h4>
                    <p className="text-sm text-[#1a1a1a]">42mm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Collection Badge */}
        {productData.featuredProduct && (
          <div className="mt-8 text-center">
            <span className="inline-flex items-center px-4 py-2 bg-[#d4af37] text-white text-xs font-medium">
              ★ Featured Collection
            </span>
          </div>
        )}
      </div>
    </div>
  );
}