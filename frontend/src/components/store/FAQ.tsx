// components/store/FAQ.tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all unworn watches in original condition with all packaging intact.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship worldwide with DHL Express. Shipping costs and delivery times vary by location.',
  },
  {
    question: 'How do I care for my watch?',
    answer: 'Avoid exposing your watch to extreme temperatures, chemicals, or magnetic fields. Clean with a soft, dry cloth.',
  },
  {
    question: 'What warranty do you provide?',
    answer: 'All our watches come with a 2-year manufacturer warranty covering mechanical defects.',
  },
  {
    question: 'Can I get my watch serviced?',
    answer: 'Yes, we offer professional servicing through authorized watchmakers worldwide.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Find answers to common questions about our products and services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 flex justify-between items-center text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ