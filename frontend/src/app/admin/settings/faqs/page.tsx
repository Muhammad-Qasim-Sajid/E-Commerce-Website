'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function EditFAQsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [faqData, setFaqData] = useState({
    _id: 'faqs',
    faqs: [
      {
        question: 'What is the warranty period for your watches?',
        answer: 'All our watches come with a 5-year international warranty covering manufacturing defects.'
      },
      {
        question: 'Do you offer custom engraving?',
        answer: 'Yes, we offer complimentary custom engraving on the case back for a personal touch.'
      },
      {
        question: 'How long does shipping take?',
        answer: 'International shipping takes 7-14 business days. Express shipping is available for an additional fee.'
      },
      {
        question: 'Can I visit your workshop?',
        answer: 'We offer private tours of our Geneva workshop by appointment only for serious collectors.'
      },
      {
        question: 'Do you provide authentication certificates?',
        answer: 'Yes, each watch comes with a numbered certificate of authenticity and detailed documentation.'
      }
    ]
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Add your API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqData({ ...faqData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setFaqData({
      ...faqData,
      faqs: [...faqData.faqs, { question: '', answer: '' }]
    });
  };

  const removeFaq = (index: number) => {
    if (faqData.faqs.length <= 1) {
      alert('At least 1 FAQ is required');
      return;
    }
    const updatedFaqs = faqData.faqs.filter((_, i) => i !== index);
    setFaqData({ ...faqData, faqs: updatedFaqs });
  };

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2">
                Edit FAQs
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <div className="flex items-center justify-between">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                  Frequently Asked Questions
                </p>
                <button
                  onClick={addFaq}
                  className="flex items-center gap-2 text-sm text-[#1a1a1a] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {faqData.faqs.map((faq, index) => (
                <div key={index} className="border border-[#eae2d6] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium tracking-tight text-[#1a1a1a]">
                      FAQ {index + 1}
                    </p>
                    {faqData.faqs.length > 1 && (
                      <button
                        onClick={() => removeFaq(index)}
                        className="p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-[#666666] hover:text-red-500 transition-colors" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                        placeholder="Enter question"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        rows={4}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors resize-none text-sm"
                        placeholder="Enter answer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-sm bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}