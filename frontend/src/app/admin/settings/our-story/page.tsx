'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { getCsrfToken } from '../../../../lib/utils';
import { OurStoryData, ourStorySchema } from '../../../../lib/schemas';

export default function EditOurStoryPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [storyData, setStoryData] = useState<OurStoryData>({
    _id: 'ourStory',
    tagline: '',
    founderQuotes: {
      founderName: '',
      quotesOfFounder: ''
    },
    headPara: [
      { heading: '', paragraph: '' },
      { heading: '', paragraph: '' },
      { heading: '', paragraph: '' }
    ]
  });

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        setIsLoading(true);
        setValidationErrors({});

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/our-story/get`, {
          credentials: 'include',
        });

        if (response.status === 404) {
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to load story data');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const storyPageData = data.data;
          
          const headParaData = [...storyPageData.headPara];
          while (headParaData.length < 3) {
            headParaData.push({ heading: '', paragraph: '' });
          }
          
          setStoryData({
            _id: storyPageData._id || 'ourStory',
            tagline: storyPageData.tagline || '',
            founderQuotes: storyPageData.founderQuotes || { founderName: '', quotesOfFounder: '' },
            headPara: headParaData
          });
        }
      } catch (error) {
        console.error('Error loading story data:', error); // Debug log
      } finally {
        setIsLoading(false);
      }
    };

    loadStoryData();
  }, []);

  const validateForm = () => {
    try {
      ourStorySchema.parse(storyData);
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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/our-story/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'x-csrf-token': csrfToken }),
        },
        credentials: 'include',
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save story page');
      }

      const data = await response.json();
      
      if (data.success) {
        alert(data.message || 'Story page saved successfully!');
      }
    } catch (error) {
      console.error('Error saving story page:', error); // Debug log
      alert(error instanceof Error ? error.message : 'Failed to save story page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateHeadPara = (index: number, field: 'heading' | 'paragraph', value: string) => {
    const updatedHeadPara = [...storyData.headPara];
    updatedHeadPara[index] = { ...updatedHeadPara[index], [field]: value };
    setStoryData({ ...storyData, headPara: updatedHeadPara });
    
    if (validationErrors[`headPara.${index}.${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`headPara.${index}.${field}`];
      setValidationErrors(newErrors);
    }
  };

  const addHeadPara = () => {
    setStoryData({
      ...storyData,
      headPara: [...storyData.headPara, { heading: '', paragraph: '' }]
    });
  };

  const removeHeadPara = (index: number) => {
    if (storyData.headPara.length <= 3) {
      alert('At least 3 story sections are required');
      return;
    }
    const updatedHeadPara = storyData.headPara.filter((_, i) => i !== index);
    setStoryData({ ...storyData, headPara: updatedHeadPara });
    
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`headPara.${index}.`)) {
        delete newErrors[key];
      } else if (key.startsWith('headPara.') && parseInt(key.split('.')[1]) > index) {
        const parts = key.split('.');
        const oldIndex = parseInt(parts[1]);
        const newKey = `headPara.${oldIndex - 1}.${parts.slice(2).join('.')}`;
        newErrors[newKey] = newErrors[key];
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  };

  const updateField = (field: keyof OurStoryData, value: string) => {
    setStoryData({ ...storyData, [field]: value });
    
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const updateFounderQuotes = (field: 'founderName' | 'quotesOfFounder', value: string) => {
    setStoryData({
      ...storyData,
      founderQuotes: { ...storyData.founderQuotes, [field]: value }
    });
    
    if (validationErrors[`founderQuotes.${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`founderQuotes.${field}`];
      setValidationErrors(newErrors);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2">
                Edit Our Story Page
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="max-w-6xl mx-auto">
          {/* Tagline */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Page Tagline
              </p>
            </div>
            
            <div className="p-6">
              <input
                type="text"
                value={storyData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                className={`w-full border ${validationErrors.tagline ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                placeholder="Enter page tagline"
              />
              {validationErrors.tagline && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.tagline}</p>
              )}
            </div>
          </div>

          {/* Founder Quotes */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                {`Founder's Quote`}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                  Founder Name
                </label>
                <input
                  type="text"
                  value={storyData.founderQuotes.founderName}
                  onChange={(e) => updateFounderQuotes('founderName', e.target.value)}
                  className={`w-full border ${validationErrors['founderQuotes.founderName'] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                  placeholder="Enter founder name"
                />
                {validationErrors['founderQuotes.founderName'] && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors['founderQuotes.founderName']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                  Quote
                </label>
                <textarea
                  value={storyData.founderQuotes.quotesOfFounder}
                  onChange={(e) => updateFounderQuotes('quotesOfFounder', e.target.value)}
                  rows={3}
                  className={`w-full border ${validationErrors['founderQuotes.quotesOfFounder'] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                  placeholder="Enter founder's quote"
                />
                {validationErrors['founderQuotes.quotesOfFounder'] && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors['founderQuotes.quotesOfFounder']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Story Sections */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                    Story Sections (Minimum 3 Required)
                  </p>
                  {validationErrors.headPara && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.headPara}</p>
                  )}
                </div>
                <button
                  onClick={addHeadPara}
                  className="flex items-center gap-2 text-sm text-[#1a1a1a] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {storyData.headPara.map((section, index) => (
                <div key={index} className="border border-[#eae2d6] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-[#1a1a1a]">
                      Section {index + 1}
                    </p>
                    {storyData.headPara.length > 3 && (
                      <button
                        onClick={() => removeHeadPara(index)}
                        className="p-1"
                      >
                        <Trash2 className="w-4 h-4 text-[#666666] hover:text-red-500 transition-colors cursor-pointer" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateHeadPara(index, 'heading', e.target.value)}
                        className={`w-full border ${validationErrors[`headPara.${index}.heading`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                        placeholder="Enter section heading"
                      />
                      {validationErrors[`headPara.${index}.heading`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`headPara.${index}.heading`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Paragraph
                      </label>
                      <textarea
                        value={section.paragraph}
                        onChange={(e) => updateHeadPara(index, 'paragraph', e.target.value)}
                        rows={4}
                        className={`w-full border ${validationErrors[`headPara.${index}.paragraph`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none`}
                        placeholder="Enter section paragraph"
                      />
                      {validationErrors[`headPara.${index}.paragraph`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`headPara.${index}.paragraph`]}</p>
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