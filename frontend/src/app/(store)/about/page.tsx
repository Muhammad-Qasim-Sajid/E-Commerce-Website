"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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

const AnimatedText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(10px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const ourStoryData = {
  _id: "ourStory",
  tagline: "The Stroy of Greatness",
  founderQuotes: {
    founderName: "Henri Laurent",
    quotesOfFounder:
      "Time is not measured by clocks, but by moments of excellence. At GREATNESS, we don't just create watches; we craft heirlooms that will mark the milestones of generations to come.",
  },
  headPara: [
    {
      heading: "Our Genesis - 1995",
      paragraph:
        "GREATNESS was conceived in a small atelier overlooking the Swiss Alps, where master watchmaker Henri Laurent assembled his first timepiece by hand. With just three craftsmen and a vision to redefine horological excellence, we began our journey. The first collection, consisting of only 50 pieces, sold out within weeks to discerning collectors who recognized the unparalleled craftsmanship.",
    },
    {
      heading: "The Philosophy",
      paragraph:
        "Every GREATNESS timepiece begins as a single sketch, evolving through 200+ hours of meticulous craftsmanship. We believe true luxury lies in perfection, not pretension. Our watches are engineered to withstand the test of time, with movements assembled, tested, and regulated over 15 days before they ever leave our workshop. We work with only the finest materials: 904L stainless steel, sapphire crystals, and gold that we personally source and inspect.",
    },
    {
      heading: "Modern Renaissance",
      paragraph:
        "While honoring centuries-old techniques, we embrace innovation. Our atelier now houses state-of-the-art CNC machines alongside traditional watchmaking benches. Each watch undergoes rigorous testing, including 24-hour water resistance checks, temperature variations from -20°C to +60°C, and shock resistance assessments. Yet, the final assembly and finishing remains exclusively by human hands - a tradition we will never automate.",
    },
    {
      heading: "The Future Unfolds",
      paragraph:
        "Today, GREATNESS stands as a testament to what happens when obsession meets excellence. With workshops in Switzerland and showrooms in 15 countries, we remain committed to our founding principles. Limited to just 500 pieces annually, each watch is numbered, registered, and accompanied by its craftsman's signature. We continue to push boundaries, recently developing our proprietary anti-magnetic movement that maintains accuracy within -1/+1 second per day.",
    },
  ],
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center text-center pt-0 sm:pt-6">
            <p
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight px-4 font-['Playfair_Display'] italic"
              style={{
                animation: "heroTagline 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                animationFillMode: "both",
              }}
            >
              - {ourStoryData.tagline} -
            </p>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="pb-18 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="border border-[#1a1a1a] p-8">
                <svg
                  className="w-6 h-6 text-[#d4af37] mb-6"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8v8h8V8h-8zm14 0v8h8V8h-8zM10 22v8h8v-8h-8zm14 0v8h8v-8h-8z" />
                </svg>
                <p className="text-xl font-['Playfair_Display'] italic text-gray-700 mb-6 leading-relaxed">
                  {`"${ourStoryData.founderQuotes.quotesOfFounder}"`}
                </p>
                <div className="pt-6 border-t border-[#1a1a1a]/20">
                  <p className="text-lg font-light mb-1">
                    {ourStoryData.founderQuotes.founderName}
                  </p>
                  <p className="font-['Playfair_Display'] text-xs text-[#1a1a1a] tracking-wide">
                    Founder & Master Watchmaker
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Sections */}
      <section className="pb-26 pt-18">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <div className="space-y-20">
            {ourStoryData.headPara.map((section, index) => (
              <div key={index}>
                <AnimatedSection>
                  <div className="flex justify-center items-center">
                    <div>
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[#d4af37] text-4xl font-light">
                            0{index + 1}
                          </span>
                          <div className="w-12 h-px bg-[#d4af37]" />
                        </div>
                        <p className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-light mb-4">
                          - {section.heading} -
                        </p>
                        <AnimatedText>
                          <p className="text-gray-500 text-sm">
                            {section.paragraph}
                          </p>
                        </AnimatedText>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            ))}
          </div>

          {/* Closing Section */}
          <AnimatedSection>
            <div className="mt-28 pt-18 pb-2 border-t border-[#1a1a1a]/20">
              <div className="text-center max-w-3xl mx-auto">
                <p className="font-['Playfair_Display'] text-2xl md:text-3xl italic mb-8">
                  - The Journey Continues -
                </p>
                <p className="text-gray-500 mb-12 text-sm">
                  GREATNESS remains committed to its founding vision while
                  embracing the future. Our atelier continues to welcome new
                  apprentices, ensuring that the art of traditional watchmaking
                  is preserved for generations. We invite you to become part of
                  our story.
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 cursor-pointer"
                >
                  <span>Visit Our Atelier</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <style jsx global>{`
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