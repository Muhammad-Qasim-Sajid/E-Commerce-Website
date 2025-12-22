"use client"

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Link from "next/link";
import { ArrowRight, Watch } from "lucide-react";
import CollectionCard from "../../components/store/CollectionCard";
import { collections } from "../../data/collections";

const homePageData = {
  tagline: "Greatness at its Peak",
  heroImage: "/hero-watch.jpg",
  whyUs: [
    {
      heading: "Unparalleled Craftsmanship",
      description: "Each timepiece is hand-assembled by master watchmakers with decades of experience.",
    },
    {
      heading: "Timeless Investment",
      description: "Our watches appreciate in value, becoming heirlooms for generations to come.",
    },
    {
      heading: "Exclusive Heritage",
      description: "Founded in 1995, we blend centuries-old techniques with contemporary innovation.",
    },
  ],
  ourStoryShort: "GREATNESS was born from a singular vision: to create timepieces that transcend trends and become enduring symbols of excellence. For nearly three decades, our atelier has been the silent heartbeat behind the world's most discerning collections.",
  whatOurClientsSay: [
    {
      nameOfClient: "Alexander von Habsburg",
      roleOfClient: "Collector & Connoisseur",
      quotesOfClient: "The weight of history in every tick. A masterpiece that speaks without words.",
    },
    {
      nameOfClient: "Isabella Conti",
      roleOfClient: "Luxury Brand Director",
      quotesOfClient: "In a world of mass production, GREATNESS reminds us what true craftsmanship means.",
    },
    {
      nameOfClient: "James Wellington III",
      roleOfClient: "Investment Banker",
      quotesOfClient: "This isn't just a watch. It's a statement of legacy. The most sound investment I've made.",
    },
  ],
};

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(20px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
      }}
    >
      {children}
    </div>
  )
}

const AnimatedText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(10px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.5s ease-out"
      }}
    >
      {children}
    </div>
  )
}

const AnimatedTestimonial = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(30px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.7s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s"
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const featuredCollections = collections.filter((c) => c.isFeatured);

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a]">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-20 lg:pt-25">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center text-center pt-0 sm:pt-6">
            <div
              style={{
                animation: "heroWatch 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                animationFillMode: "both"
              }}
            >
              <Watch className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 text-[#1a1a1a]" />
            </div>
            <p 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight tracking-tight px-4 font-['Playfair_Display'] sm:-mt-4 mt-0 italic"
              style={{
                animation: "heroTagline 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
                animationFillMode: "both"
              }}
            >
              {`- ${homePageData.tagline} -`}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="pb-26 pt-18 border-t border-b border-[#1a1a1a]/20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="font-['Playfair_Display'] italic text-center mb-24 text-4xl md:text-6xl font-light tracking-tight">
              - Featured Collections -
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCollections.map((collection) => (
              <AnimatedSection key={collection.id}>
                <CollectionCard collection={collection} />
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection>
            <div className="mt-16 text-center">
              <Link
                href="/collections"
                className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
              >
                <span>View All Collections</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Us - Features */}
      <section className="pb-26 pt-18 border-b border-[#1a1a1a]/20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="font-['Playfair_Display'] text-center mb-22 text-4xl md:text-6xl tracking-tight italic">
              - Why Choose GREATNESS -
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {homePageData.whyUs.map((feature, index) => (
              <AnimatedSection key={index}>
                <div className="text-center">
                  <div className="mb-6">
                    <span className="text-[#d4af37] text-5xl font-light">
                      0{index + 1}
                    </span>
                  </div>
                  <AnimatedText>
                    <p className="text-2xl font-light mb-4">{feature.heading}</p>
                  </AnimatedText>
                  <AnimatedText>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </AnimatedText>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="pb-24 pt-18 border-b border-[#1a1a1a]/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <p className="font-['Playfair_Display'] text-center mb-10 text-4xl md:text-6xl font-light tracking-tight italic">
                - A Legacy of Excellence -
              </p>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="prose prose-lg mx-auto mb-12">
                <p className="text-gray-700 text-center sm:text-base text-xs">
                  {homePageData.ourStoryShort}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-26 pt-18">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="font-['Playfair_Display'] italic text-center text-4xl md:text-6xl font-light tracking-tight mb-22">
              - Voices of Distinction -
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {homePageData.whatOurClientsSay.map((testimonial, index) => (
              <AnimatedTestimonial key={index}>
                <div className="relative p-8 border border-[#1a1a1a]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-8 h-8 bg-[#d4af37] flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <svg className="w-6 h-6 text-[#d4af37] mb-4" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M10 8v8h8V8h-8zm14 0v8h8V8h-8zM10 22v8h8v-8h-8zm14 0v8h8v-8h-8z" />
                    </svg>
                    <p className="text-[#1a1a1a] italic">
                      {`"${testimonial.quotesOfClient}"`}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-[#1a1a1a]/20">
                    <h4 className="text-lg font-light mb-1">
                      {testimonial.nameOfClient}
                    </h4>
                    <p className="font-['Playfair_Display'] text-xs text-[#1a1a1a] tracking-wide">
                      {testimonial.roleOfClient}
                    </p>
                  </div>
                </div>
              </AnimatedTestimonial>
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}