"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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

const faqData = [
  {
    id: 1,
    category: "Craftsmanship & Materials",
    questions: [
      {
        id: "cm1",
        question: "What materials are used in GREATNESS timepieces?",
        answer:
          "We exclusively use 904L stainless steel (superior to the industry-standard 316L), scratch-resistant sapphire crystals with anti-reflective coating, and precious metals sourced from certified ethical suppliers. All leather straps are from French tanneries, hand-selected for their quality and patina development.",
      },
      {
        id: "cm2",
        question: "How many hours of craftsmanship go into each watch?",
        answer:
          "A standard GREATNESS timepiece requires between 200-300 hours of handcrafting. Limited editions and complications can take up to 500 hours. This includes 40 hours for movement assembly, 60 hours for case finishing, and 100+ hours for dial hand-finishing alone.",
      },
      {
        id: "cm3",
        question: "What makes your movements different?",
        answer:
          "Our proprietary movements feature silicon escapements for enhanced accuracy, 72-hour power reserves, and are tested for 15 days in six positions. Each movement is assembled by a single watchmaker who stamps their personal identification number on the bridge.",
      },
    ],
  },
  {
    id: 2,
    category: "Purchasing & Ownership",
    questions: [
      {
        id: "po1",
        question: "What is your production volume?",
        answer:
          "We strictly limit production to 500 pieces annually worldwide. Each watch is numbered and registered. This exclusivity ensures the highest quality control and maintains the value of every GREATNESS timepiece as a future heirloom.",
      },
      {
        id: "po2",
        question: "Do your watches appreciate in value?",
        answer:
          "While we cannot guarantee appreciation, historical data shows our limited editions have averaged 15-25% annual appreciation at auction. All timepieces come with full documentation and a unique registration number that tracks its provenance in our archives.",
      },
      {
        id: "po3",
        question: "What payment methods do you accept?",
        answer:
          "We accept bank transfers, major credit cards, and installment plans through our financial partners. For purchases above $20,000, we offer private banking arrangements and asset-based financing. All transactions are conducted through secure, encrypted channels.",
      },
    ],
  },
  {
    id: 3,
    category: "Service & Warranty",
    questions: [
      {
        id: "sw1",
        question: "What does your warranty cover?",
        answer:
          "All GREATNESS timepieces come with a 5-year international warranty covering manufacturing defects, movement performance (-2/+2 seconds per day), and water resistance. The warranty is transferable to subsequent owners, maintaining the timepiece's value.",
      },
      {
        id: "sw2",
        question: "How often should I service my watch?",
        answer:
          "We recommend a complete service every 5-7 years, depending on usage. Our service includes complete disassembly, ultrasonic cleaning, replacement of worn components, re-lubrication, and 10-day accuracy testing. Service typically takes 6-8 weeks.",
      },
      {
        id: "sw3",
        question: "Can I service my watch locally?",
        answer:
          "For optimal results, we strongly recommend all service be performed at our Swiss atelier or authorized service centers. Unauthorized service voids the warranty and can affect water resistance and accuracy. We offer complimentary shipping for service requests.",
      },
    ],
  },
  {
    id: 4,
    category: "Shipping & Customs",
    questions: [
      {
        id: "sc1",
        question: "How are watches shipped and insured?",
        answer:
          "All timepieces are shipped via our exclusive luxury logistics partner. They travel in armored, temperature-controlled vehicles with GPS tracking. Each shipment is insured for 150% of its value. You'll receive real-time tracking and must personally sign for delivery.",
      },
      {
        id: "sc2",
        question: "What about customs and import duties?",
        answer:
          "We handle all customs documentation and prepay duties where possible. For countries where duties cannot be prepaid, we provide detailed estimates and documentation. The final price includes all import fees for destinations where we can legally prepay them.",
      },
      {
        id: "sc3",
        question: "What is your return policy?",
        answer:
          "We offer a 14-day return period for unworn watches with all original packaging and documentation. Custom and limited edition pieces are final sale. Returns must be initiated through your personal client advisor and shipped via our arranged courier service.",
      },
    ],
  },
];

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
            <p className="font-light text-sm">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
      <section className="pb-26 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <div className="space-y-24">
            {faqData.map((category, categoryIndex) => (
              <div key={category.id}>
                <AnimatedSection>
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[#d4af37] text-4xl font-light">
                        0{categoryIndex + 1}
                      </span>
                      <div className="w-12 h-px bg-[#d4af37]" />
                    </div>
                    <p className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-light -mb-3">
                      - {category.category} -
                    </p>
                  </div>
                </AnimatedSection>

                <div className="space-y-4">
                  {category.questions.map((item) => (
                    <AnimatedSection key={item.id}>
                      <FAQItem
                        question={item.question}
                        answer={item.answer}
                        isOpen={!!openItems[item.id]}
                        onToggle={() => toggleItem(item.id)}
                      />
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            ))}
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