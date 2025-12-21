'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload } from 'lucide-react';

export default function EditHomePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [homeData, setHomeData] = useState({
    _id: 'homePage',
    tagline: 'Where Time Becomes Art',
    heroImage: '/hero-watch.jpg',
    whyUs: [
      {
        heading: 'Swiss Precision',
        description: 'Every timepiece is crafted with meticulous Swiss precision and attention to detail.'
      },
      {
        heading: 'Legacy Craftsmanship',
        description: 'Generations of watchmaking expertise passed down through master artisans.'
      },
      {
        heading: 'Timeless Investment',
        description: 'Each watch is not just an accessory but a legacy piece that appreciates over time.'
      }
    ],
    ourStoryShort: 'Founded in 1895, our atelier has been dedicated to creating timepieces that transcend generations, blending traditional craftsmanship with innovative design.',
    whatOurClientsSay: [
      {
        nameOfClient: 'Alexander Rothschild',
        roleOfClient: 'Collector & Investor',
        quotesOfClient: 'The craftsmanship is unparalleled. Each watch tells a story of heritage and excellence.'
      },
      {
        nameOfClient: 'Emma Chen',
        roleOfClient: 'Luxury Connoisseur',
        quotesOfClient: 'A perfect blend of tradition and innovation. These watches are heirlooms.'
      },
      {
        nameOfClient: 'James Vanderbilt',
        roleOfClient: 'CEO, Heritage Group',
        quotesOfClient: 'The attention to detail is extraordinary. True masterpieces of horology.'
      }
    ]
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Add your API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateWhyUs = (index: number, field: 'heading' | 'description', value: string) => {
    const updatedWhyUs = [...homeData.whyUs];
    updatedWhyUs[index] = { ...updatedWhyUs[index], [field]: value };
    setHomeData({ ...homeData, whyUs: updatedWhyUs });
  };

  const updateTestimonial = (index: number, field: 'nameOfClient' | 'roleOfClient' | 'quotesOfClient', value: string) => {
    const updatedTestimonials = [...homeData.whatOurClientsSay];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    setHomeData({ ...homeData, whatOurClientsSay: updatedTestimonials });
  };

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8"> 
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2">
                Edit Home Page
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Hero Section
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Tagline */}
              <div>
                <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                  Tagline
                </label>
                <input
                  type="text"
                  value={homeData.tagline}
                  onChange={(e) => setHomeData({ ...homeData, tagline: e.target.value })}
                  className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                  placeholder="Enter tagline"
                />
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                  Hero Image URL
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={homeData.heroImage}
                    onChange={(e) => setHomeData({ ...homeData, heroImage: e.target.value })}
                    className="w-full border border-[#eae2d6] bg-white sm:px-4 px-2 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                    placeholder="Enter image URL"
                  />
                  <button className="flex items-center gap-2 px-4 py-3 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Why Us Section */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Why Choose Us (3 Features Required)
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {homeData.whyUs.map((feature, index) => (
                <div key={index} className="border border-[#eae2d6] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-[#1a1a1a]">
                      Feature {index + 1}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={feature.heading}
                        onChange={(e) => updateWhyUs(index, 'heading', e.target.value)}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                        placeholder="Enter heading"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Description
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateWhyUs(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none"
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Story Short */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Our Story (Short Version)
              </p>
            </div>
            
            <div className="p-6">
              <textarea
                value={homeData.ourStoryShort}
                onChange={(e) => setHomeData({ ...homeData, ourStoryShort: e.target.value })}
                rows={4}
                className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none"
                placeholder="Enter short story description"
              />
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Client Testimonials (3 Testimonials Required)
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {homeData.whatOurClientsSay.map((testimonial, index) => (
                <div key={index} className="border border-[#eae2d6] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-[#1a1a1a]">
                      Testimonial {index + 1}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={testimonial.nameOfClient}
                        onChange={(e) => updateTestimonial(index, 'nameOfClient', e.target.value)}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                        placeholder="Enter client name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Client Role
                      </label>
                      <input
                        type="text"
                        value={testimonial.roleOfClient}
                        onChange={(e) => updateTestimonial(index, 'roleOfClient', e.target.value)}
                        className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                        placeholder="Enter client role"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Quote
                    </label>
                    <textarea
                      value={testimonial.quotesOfClient}
                      onChange={(e) => updateTestimonial(index, 'quotesOfClient', e.target.value)}
                      rows={3}
                      className="w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none"
                      placeholder="Enter client quote"
                    />
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