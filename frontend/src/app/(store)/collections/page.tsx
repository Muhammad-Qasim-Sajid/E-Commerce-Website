"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  {
    id: 2,
    name: "Horizon Collection",
    smallDescription: "Minimalist design meets technical perfection",
    longDescription:
      "The Horizon Collection represents the pinnacle of minimalist watchmaking. With dials no thicker than 8.5mm, these timepieces are engineered for understated elegance. The ultra-thin caliber is protected by a scratch-resistant sapphire crystal with anti-reflective coating. Every component is individually tested for 15 days before assembly, ensuring precision within -2/+2 seconds per day.",
    featuredProduct: false,
    variants: [
      {
        variantName: "Silver Dial Steel",
        variantImage: "/3.png",
        variantPrice: 8999,
        variantPreviousPrice: 9999,
        variantOrder: 1,
        variantStock: 22,
      },
      {
        variantName: "Black Dial Titanium",
        variantImage: "/2.png",
        variantPrice: 10999,
        variantPreviousPrice: null,
        variantOrder: 2,
        variantStock: 12,
      },
    ],
  },
  {
    id: 3,
    name: "Monarch Edition",
    smallDescription: "Limited edition masterpiece for true collectors",
    longDescription:
      "Limited to 50 pieces worldwide, the Monarch Edition represents the ultimate expression of watchmaking art. Each dial is hand-engraved by a single artisan over 40 hours, creating unique guilloché patterns. The movement is visible through a sapphire case back, revealing the hand-bevelled bridges and polished screw heads. This timepiece comes with a custom presentation box made from sustainably sourced walnut.",
    featuredProduct: true,
    variants: [
      {
        variantName: "Limited Edition #001-050",
        variantImage: "/1.png",
        variantPrice: 24999,
        variantPreviousPrice: null,
        variantOrder: 1,
        variantStock: 18,
      },
    ],
  },
  {
    id: 4,
    name: "Aether Series",
    smallDescription: "Futuristic design with heritage mechanics",
    longDescription:
      "The Aether Series combines avant-garde design with traditional Swiss watchmaking. The skeletonized dial reveals the intricate mechanics within, while the case is crafted from aerospace-grade titanium for strength and lightness. The movement features a flying tourbillon that completes one rotation per minute, counteracting the effects of gravity on accuracy. Water resistant to 100 meters despite its complex construction.",
    featuredProduct: false,
    variants: [
      {
        variantName: "Titanium Skeleton",
        variantImage: "/2.png",
        variantPrice: 18999,
        variantPreviousPrice: 21999,
        variantOrder: 1,
        variantStock: 7,
      },
      {
        variantName: "Carbon Fiber Black",
        variantImage: "/1.png",
        variantPrice: 21999,
        variantPreviousPrice: null,
        variantOrder: 2,
        variantStock: 4,
      },
    ],
  },
];

export default function Collections() {
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
              <AnimatedSection key={collection.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Left Column - Text */}
                  <div className="order-2 lg:order-1">
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-light mb-1 tracking-tight">
                        {collection.name}
                      </h2>
                      <p className="text-gray-600 mb-6 text-sm">
                        {collection.smallDescription}
                      </p>

                      {/* Variants List */}
                      <div className="space-y-4 mb-8">
                        {collection.variants.map((variant, index) => (
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
                        href={`/collection/${collection.id}`}
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
                        {collection.variants.slice(1).map((variant, index) => (
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