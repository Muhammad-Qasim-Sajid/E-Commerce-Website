"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Spinner from '../../../components/Spinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getFaqs = async (): Promise<FAQResponse> => {
  const response = await fetch(`${API_URL}/faqs/get`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch FAQs");
  }

  return response.json();
};

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
export interface FAQData {
  _id: string;
  faqs: FAQItem[];
}
export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQData;
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

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}
const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border border-[#1a1a1a]/20">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-[#1a1a1a]/5 transition-all duration-300 cursor-pointer"
      >
        <span className="font-light pr-8">{question}</span>
        <div className="shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5 text-[#d4af37]" />
          ) : (
            <Plus className="w-5 h-5 text-[#1a1a1a]" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-[#1a1a1a]/10">
            <p className="text-xs">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const [faqData, setFaqData] = useState<FAQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getFaqs();

      if (data.success) {
        setFaqData(data.data);
      } else {
        setError(data.message || 'Failed to load FAQs');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error || !faqData) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={fetchFaqs}
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
              - Question Answered -
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      {faqData.faqs && faqData.faqs.length > 0 && (
        <section className="pb-26 pt-8">
          <div className="container mx-auto lg:px-40 sm:px-20 px-10">
            <div className="space-y-24">
              <div>
                <div className="space-y-4">
                  {faqData.faqs.map((item: FAQItem, index: number) => {
                    // Use question as ID or create a unique ID
                    const itemId = `faq-${index}-${item.question.substring(0, 10).replace(/\s+/g, '-').toLowerCase()}`;
                    
                    return (
                      <AnimatedSection key={itemId}>
                        <FAQItem
                          question={item.question}
                          answer={item.answer}
                          isOpen={!!openItems[itemId]}
                          onToggle={() => toggleItem(itemId)}
                        />
                      </AnimatedSection>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Help Section */}
            <AnimatedSection>
              <div className="mt-28 pt-18 pb-2 border-t border-[#1a1a1a]/20">
                <div className="text-center max-w-3xl mx-auto">
                  <p className="font-['Playfair_Display'] text-2xl md:text-3xl italic mb-8">
                    - Still Have Questions? -
                  </p>
                  <p className="text-gray-500 mb-14 text-sm">
                    Our personal client advisors are available to answer any
                    questions not covered here. Whether you are considering your
                    first GREATNESS timepiece or need assistance with an existing
                    collection, we provide dedicated support throughout your
                    ownership journey.
                  </p>
                  <div className="space-y-6">
                    <div className="border border-[#1a1a1a]/20 p-6">
                      <p className="font-light mb-2">For Inquiries</p>
                      <p className="text-gray-500 sm:text-sm text-[11px]">
                        contact@greatnesswatches.com
                      </p>
                      <p className="text-gray-500 sm:text-sm text-[11px]">
                        +41 22 123 4567
                      </p>
                    </div>
                  </div>
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