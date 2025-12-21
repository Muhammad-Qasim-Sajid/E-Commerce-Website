'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function EditOurStoryPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [storyData, setStoryData] = useState({
    _id: 'ourStory',
    tagline: 'A Legacy of Timekeeping Excellence Since 1895',
    founderQuotes: {
      founderName: 'Henri Dubois',
      quotesOfFounder: 'Time is the ultimate luxury. We don\'t just measure it; we celebrate it.'
    },
    headPara: [
      {
        heading: 'The Beginning',
        paragraph: 'In the heart of Geneva, 1895, a young watchmaker named Henri Dubois established a small atelier with a singular vision: to create timepieces that would transcend generations.'
      },
      {
        heading: 'The Craftsmanship',
        paragraph: 'Each watch is a testament to centuries-old techniques, with every component meticulously hand-finished by master artisans who have dedicated their lives to the craft.'
      },
      {
        heading: 'The Innovation',
        paragraph: 'While honoring tradition, we continually innovate, integrating cutting-edge technology with timeless design to create watches that are both historically significant and forward-looking.'
      },
      {
        heading: 'The Legacy',
        paragraph: 'Today, our watches are cherished by collectors worldwide, each piece carrying forward the legacy of excellence that began over a century ago.'
      }
    ]
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Add your API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateHeadPara = (index: number, field: 'heading' | 'paragraph', value: string) => {
    const updatedHeadPara = [...storyData.headPara];
    updatedHeadPara[index] = { ...updatedHeadPara[index], [field]: value };
    setStoryData({ ...storyData, headPara: updatedHeadPara });
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
  };

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
                onChange={(e) => setStoryData({ ...storyData, tagline: e.target.value })}
                className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                placeholder="Enter page tagline"
              />
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
                  onChange={(e) => setStoryData({
                    ...storyData,
                    founderQuotes: { ...storyData.founderQuotes, founderName: e.target.value }
                  })}
                  className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                  placeholder="Enter founder name"
                />
              </div>
              
              <div>
                <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                  Quote
                </label>
                <textarea
                  value={storyData.founderQuotes.quotesOfFounder}
                  onChange={(e) => setStoryData({
                    ...storyData,
                    founderQuotes: { ...storyData.founderQuotes, quotesOfFounder: e.target.value }
                  })}
                  rows={3}
                  className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                  placeholder="Enter founder's quote"
                />
              </div>
            </div>
          </div>

          {/* Story Sections */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <div className="flex items-center justify-between">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                  Story Sections (Minimum 3 Required)
                </p>
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
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                        placeholder="Enter section heading"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Paragraph
                      </label>
                      <textarea
                        value={section.paragraph}
                        onChange={(e) => updateHeadPara(index, 'paragraph', e.target.value)}
                        rows={4}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none"
                        placeholder="Enter section paragraph"
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