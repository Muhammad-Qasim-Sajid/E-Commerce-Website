"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Spinner from "../../../components/Spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ourStoryApi = {
  getOurStory: async () => {
    const response = await fetch(`${API_URL}/our-story/get`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch our story data');
    }

    return response.json();
  }
};

interface OurStoryData {
  _id: string;
  tagline: string;
  founderQuotes: {
    founderName: string;
    quotesOfFounder: string;
  };
  headPara: Array<{
    heading: string;
    paragraph: string;
  }>;
}

interface headPara{
  heading: string;
  paragraph: string;
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

export default function About() {
  const [ourStoryData, setOurStoryData] = useState<OurStoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOurStoryData();
  }, []);

  const fetchOurStoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await ourStoryApi.getOurStory();

      if (data.success) {
        setOurStoryData(data.data);
      } else {
        setError(data.message || 'Failed to load our story data');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load our story data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error || !ourStoryData) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={fetchOurStoryData}
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
      {ourStoryData.founderQuotes && (
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
      )}

      {/* Story Sections */}
      {ourStoryData.headPara && ourStoryData.headPara.length > 0 && (
        <section className="pb-26 pt-18">
          <div className="container mx-auto lg:px-40 sm:px-20 px-10">
            <div className="space-y-20">
              {ourStoryData.headPara.map((section: headPara, index: number) => (
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
      )}

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