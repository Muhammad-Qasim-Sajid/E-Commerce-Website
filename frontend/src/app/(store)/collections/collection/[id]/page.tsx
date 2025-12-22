"use client";

import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { ShoppingCart } from "lucide-react";

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

const collections = [
  {
    id: 1,
    name: "Legacy Series 1895",
    smallDescription:
      "Inspired by 19th-century pocket watches, reimagined for the modern wrist",
    longDescription:
      "The Legacy Series 1895 pays homage to the golden age of horology while embracing contemporary aesthetics. Each piece undergoes 300 hours of meticulous hand-finishing by our master craftsmen in Switzerland. The movement features a proprietary 72-hour power reserve with a silicon escapement for enhanced accuracy and durability. The case is carved from a single block of 904L stainless steel, polished to mirror perfection.",
    featuredProduct: true,
    variants: [
      {
        variantName: "Rose Gold & Black Dial",
        variantImage: "/1.png",
        variantPrice: 12999,
        variantPreviousPrice: 14999,
        variantOrder: 1,
        variantStock: 15,
      },
      {
        variantName: "White Gold & Silver Dial",
        variantImage: "/2.png",
        variantPrice: 13999,
        variantPreviousPrice: 15999,
        variantOrder: 2,
        variantStock: 8,
      },
      {
        variantName: "Platinum & Blue Dial",
        variantImage: "/3.png",
        variantPrice: 18999,
        variantPreviousPrice: null,
        variantOrder: 3,
        variantStock: 5,
      },
    ],
  },
];

export default function CollectionDetail() {
  const params = useParams();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const collection = collections.find((c) => c.id.toString() === params.id);

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] flex items-center justify-center">
        <p className="text-center text-3xl font-['Playfair_Display'] tracking-tight italic mb-4">
          Collection not found
        </p>
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
                    {collection.variants.map((v, index) => (
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
                    {collection.variants.map((v, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`w-full text-left p-4 border transition-all duration-300 cursor-pointer ${
                          selectedVariant === index ? "opacity-100 border-[#1a1a1a]/75" : "border-[#1a1a1a]/50 opacity-30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="sm:text-base text-sm">{variant.variantName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="sm:text-sm text-xs font-light">
                                PKR {variant.variantPrice.toLocaleString()}
                              </span>
                              {variant.variantPreviousPrice && (
                                <span className="text-gray-500 line-through sm:text-xs text-[11px] mt-0.5">
                                  PKR{" "}
                                  {variant.variantPreviousPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="sm:text-xs text-[11px] text-gray-500">
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
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="border border-[#1a1a1a] p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xl font-light">
                        ${variant.variantPrice.toLocaleString()}
                      </p>
                      {variant.variantPreviousPrice && (
                        <p className="text-gray-500 line-through">
                          ${variant.variantPreviousPrice.toLocaleString()}
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

                  <button
                    className="w-full group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:opacity-50 transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    disabled={variant.variantStock === 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {variant.variantStock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
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