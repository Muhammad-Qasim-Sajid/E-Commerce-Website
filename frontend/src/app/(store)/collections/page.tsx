"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { productsApi } from '../../../lib/api/productsAPIs';
import Spinner from '../../../components/Spinner';

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

export default function Collections() {
  const [collections, setCollections] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await productsApi.getAllProducts();
      
      if (data.success) {
        const sortedCollections = [...data.data].sort((a, b) => {
          if (a.featuredProduct && !b.featuredProduct) return -1;
          if (!a.featuredProduct && b.featuredProduct) return 1;
          return 0;
        });
        
        setCollections(sortedCollections);
      } else {
        setError(data.message || 'Failed to load collections');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error ) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={fetchCollections}
            className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center text-center pt-0 sm:pt-6">
            <AnimatedSection>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight px-4 font-['Playfair_Display'] italic">
                - Masterpieces of Time -
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Collections List */}
      <section className="pb-30 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          {/* Collections Grid */}
          <div className="space-y-50">
            {collections.map((collection) => (
              <AnimatedSection key={collection._id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Left Column - Text */}
                  <div className="order-2 lg:order-1 pb-12">
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-light mb-1 tracking-tight">
                        {collection.name}
                      </h2>
                      <p className="text-gray-600 mb-6 text-sm">
                        {collection.smallDescription}
                      </p>

                      {/* Variants List */}
                      <div className="space-y-4 mb-8">
                        {collection.variants.map((variant: Variant, index: number) => (
                          <div
                            key={index}
                            className="border border-[#1a1a1a]/20 p-4"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p>{variant.variantName}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm font-light">
                                    PKR {variant.variantPrice.toLocaleString()}
                                  </span>
                                  {variant.variantPreviousPrice && (
                                    <span className="text-gray-500 line-through text-xs mt-0.5">
                                      PKR{" "}
                                      {variant.variantPreviousPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {variant.variantStock > 10 ? (
                                    <span className="text-gray-500">
                                      In Stock ({variant.variantStock})
                                    </span>
                                  ) : variant.variantStock > 0 ? (
                                    <span className="text-gray-500">
                                      Limited Stock ({variant.variantStock})
                                    </span>
                                  ) : (
                                    <span className="text-red-600">
                                      Out of Stock
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`/collections/collection/${collection._id}`}
                        className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column - Image */}
                  <div className="order-1 lg:order-2">
                    <div className="relative aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={collection.variants[0].variantImage}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
                    </div>

                    {/* Thumbnails for other variants */}
                    {collection.variants.length > 1 && (
                      <div className="flex gap-2 mt-4">
                        {collection.variants.slice(1).map((variant: Variant, index: number) => (
                          <div
                            key={index}
                            className="w-20 h-20 overflow-hidden border border-[#1a1a1a]/20"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={variant.variantImage}
                              alt={variant.variantName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes heroWatch {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: translateY(10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes heroTagline {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }
          40% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}