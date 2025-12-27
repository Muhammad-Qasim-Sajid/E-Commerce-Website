'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import Spinner from '../../../../components/Spinner';
import { getCsrfToken } from '../../../../lib/utils';
import { FAQsData, faqsSchema } from '../../../../lib/schemas';

export default function EditFAQsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [faqData, setFaqData] = useState<FAQsData>({
    _id: 'faqs',
    faqs: [
      { question: '', answer: '' }
    ]
  });

  useEffect(() => {
    const loadFAQsData = async () => {
      try {
        setIsLoading(true);
        setValidationErrors({});

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs/get`, {
          credentials: 'include',
        });

        if (response.status === 404) {
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to load FAQs data');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const faqsPageData = data.data;

          const faqsData = [...faqsPageData.faqs];
          if (faqsData.length === 0) {
            faqsData.push({ question: '', answer: '' });
          }
          
          setFaqData({
            _id: faqsPageData._id || 'faqs',
            faqs: faqsData
          });
        }
      } catch (error) {
        console.error('Error loading FAQs data:', error); // Debug log
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQsData();
  }, []);

  const validateForm = () => {
    try {
      faqsSchema.parse(faqData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);

        const firstError = Object.values(errors)[0];
        if (firstError) {
          alert(firstError);
        }
      }
      return false;
    }
  };

  const handleSave = async () => {
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      const csrfToken = getCsrfToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'x-csrf-token': csrfToken }),
        },
        credentials: 'include',
        body: JSON.stringify(faqData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save FAQs');
      }

      const data = await response.json();
      
      if (data.success) {
        alert(data.message || 'FAQs saved successfully!');
      }
    } catch (error) {
      console.error('Error saving FAQs:', error); // Debug log
      alert(error instanceof Error ? error.message : 'Failed to save FAQs. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqData({ ...faqData, faqs: updatedFaqs });
    
    if (validationErrors[`faqs.${index}.${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`faqs.${index}.${field}`];
      setValidationErrors(newErrors);
    }
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
    
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`faqs.${index}.`)) {
        delete newErrors[key];
      } else if (key.startsWith('faqs.') && parseInt(key.split('.')[1]) > index) {
        const parts = key.split('.');
        const oldIndex = parseInt(parts[1]);
        const newKey = `faqs.${oldIndex - 1}.${parts.slice(2).join('.')}`;
        newErrors[newKey] = newErrors[key];
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  if (isLoading) {
    return <Spinner />;
  }

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
                <div>
                  <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                    Frequently Asked Questions
                  </p>
                  {validationErrors.faqs && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.faqs}</p>
                  )}
                </div>
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
                        className={`w-full border ${validationErrors[`faqs.${index}.question`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                        placeholder="Enter question"
                      />
                      {validationErrors[`faqs.${index}.question`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`faqs.${index}.question`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        rows={3}
                        className={`w-full border ${validationErrors[`faqs.${index}.answer`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors resize-none text-sm`}
                        placeholder="Enter answer"
                      />
                      {validationErrors[`faqs.${index}.answer`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`faqs.${index}.answer`]}</p>
                      )}
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
              disabled={isSaving}
              className="px-6 py-3 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-sm bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}