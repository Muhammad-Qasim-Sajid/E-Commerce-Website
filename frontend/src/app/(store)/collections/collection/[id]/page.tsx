"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { productsApi } from '../../../../../lib/api/productsAPIs';
import { addToCart } from '../../../../../lib/utils';

export interface Variant {
  variantName: string;
  variantImage: string;
  variantPrice: number;
  variantPreviousPrice?: number;
  variantOrder: number;
  variantStock: number;
  _id: string;
}

export interface Product {
  _id: string;
  name: string;
  variants: Variant[];
  smallDescription: string;
  longDescription: string;
  featuredProduct: boolean;
}

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(20px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
      }}
    >
      {children}
    </div>
  );
};

export default function CollectionDetail() {
  const params = useParams();
  const [collection, setCollection] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await productsApi.getProduct(params.id as string);

      if (data.success) {
        setCollection(data.data);
      } else {
        setError(data.message || 'Failed to load collection');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleAddToCart = () => {
    if (!collection) return;
    
    const variant = collection.variants[selectedVariant];
    if (variant.variantStock <= 0) return;
    
    setAddingToCart(true);
    setCartMessage(null);

    try {
      const variantId = variant._id;
      addToCart(collection._id, variantId);
      
      setCartMessage("Added to cart successfully!");

      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    } catch {
      setCartMessage("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-3xl font-['Playfair_Display'] tracking-tight italic mb-4">
            Collection not found
          </p>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const variant = collection.variants[selectedVariant];

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-25">
      {/* Product Detail */}
      <section className="sm:p-30 p-4 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column - Image */}
            <AnimatedSection>
              <div>
                <div className="relative aspect-square overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={variant.variantImage}
                    alt={variant.variantName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Variant Thumbnails */}
                {collection.variants.length > 1 && (
                  <div className="flex gap-3">
                    {collection.variants.map((v: Variant, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`w-20 h-20 overflow-hidden transition-all duration-300 cursor-pointer ${
                          selectedVariant === index ? "scale-115" : "scale-90"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.variantImage}
                          alt={v.variantName}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Right Column - Details */}
            <AnimatedSection>
              <div>
                <p className="text-2xl md:text-3xl tracking-tight font-['Playfair_Display'] italic font-light mb-1">
                  {collection.name}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {collection.smallDescription}
                </p>

                {/* Variant Selector */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-1">Select Variant</p>
                  <div className="space-y-2">
                    {collection.variants.map((v: Variant, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`w-full text-left p-4 border transition-all duration-300 cursor-pointer ${
                          selectedVariant === index ? "opacity-100 border-[#1a1a1a]/75" : "border-[#1a1a1a]/50 opacity-30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="sm:text-base text-sm">{v.variantName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="sm:text-sm text-xs font-light">
                                PKR {v.variantPrice.toLocaleString()}
                              </span>
                              {v.variantPreviousPrice && (
                                <span className="text-gray-500 line-through sm:text-xs text-[11px] mt-0.5">
                                  PKR{" "}
                                  {v.variantPreviousPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="sm:text-xs text-[11px] text-gray-500">
                              {v.variantStock > 10 ? (
                                <span className="text-gray-500">
                                  In Stock ({v.variantStock})
                                </span>
                              ) : v.variantStock > 0 ? (
                                <span className="text-gray-500">
                                  Limited Stock ({v.variantStock})
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  Out of Stock
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="border border-[#1a1a1a] p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xl font-light">
                        PKR {variant.variantPrice.toLocaleString()}
                      </p>
                      {variant.variantPreviousPrice && (
                        <p className="text-gray-500 line-through">
                          PKR {variant.variantPreviousPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Stock</p>
                      <p
                        className={`text-sm ${
                          variant.variantStock > 10
                            ? "text-gray-500"
                            : variant.variantStock > 0
                            ? "text-gray-500"
                            : "text-red-600"
                        }`}
                      >
                        {variant.variantStock} available
                      </p>
                    </div>
                  </div>

                  {/* Cart Message */}
                  {cartMessage && (
                    <div className={`mb-4 p-3 text-sm ${cartMessage.includes("successfully") ? "text-green-600 border border-green-600" : "text-red-600 border border-red-600"}`}>
                      {cartMessage}
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={variant.variantStock === 0 || addingToCart}
                    className="w-full group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:opacity-50 transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {addingToCart ? "Adding..." : 
                       variant.variantStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </span>
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Long Description */}
          <AnimatedSection>
            <div className="mt-16 mb-16 sm:mb-0 pt-18 border-t border-[#1a1a1a]/20">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl italic mb-4">
                - Craftsmanship & Details -
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {collection.longDescription}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}