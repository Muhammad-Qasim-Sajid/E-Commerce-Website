'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, X } from 'lucide-react';
import { z } from 'zod';
import { getCsrfToken } from '../../../../lib/utils';
import { HomeData, homePageSchema } from '../../../../lib/schemas';

export default function EditHome() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [homeData, setHomeData] = useState<HomeData>({
    _id: 'homePage',
    tagline: '',
    heroImage: '',
    whyUs: [
      { heading: '', description: '' },
      { heading: '', description: '' },
      { heading: '', description: '' }
    ],
    ourStoryShort: '',
    whatOurClientsSay: [
      { nameOfClient: '', roleOfClient: '', quotesOfClient: '' },
      { nameOfClient: '', roleOfClient: '', quotesOfClient: '' },
      { nameOfClient: '', roleOfClient: '', quotesOfClient: '' }
    ]
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const blobUrls = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      blobUrls.current.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        setValidationErrors({});

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-home`, {
          credentials: 'include',
        });

        if (response.status === 404) {
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to load home page data');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const homePageData = data.data;

          const whyUsData = [...homePageData.whyUs];
          while (whyUsData.length < 3) {
            whyUsData.push({ heading: '', description: '' });
          }

          const testimonialsData = [...homePageData.whatOurClientsSay];
          while (testimonialsData.length < 3) {
            testimonialsData.push({ nameOfClient: '', roleOfClient: '', quotesOfClient: '' });
          }
          
          setHomeData({
            _id: homePageData._id || 'homePage',
            tagline: homePageData.tagline || '',
            heroImage: homePageData.heroImage || '',
            whyUs: whyUsData.slice(0, 3),
            ourStoryShort: homePageData.ourStoryShort || '',
            whatOurClientsSay: testimonialsData.slice(0, 3)
          });
        }
      } catch (error) {
        console.error('Error loading home page data:', error); // Debug log
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WebP)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      if (heroImageFile) {
        const oldBlobUrl = homeData.heroImage;
        if (oldBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(oldBlobUrl);
          blobUrls.current = blobUrls.current.filter(url => url !== oldBlobUrl);
        }
      }
      
      setHeroImageFile(file);
      
      const tempUrl = URL.createObjectURL(file);
      blobUrls.current.push(tempUrl);
      setHomeData({ ...homeData, heroImage: tempUrl });
    }
  };

  const removeImage = () => {
    if (homeData.heroImage.startsWith('blob:')) {
      URL.revokeObjectURL(homeData.heroImage);
      blobUrls.current = blobUrls.current.filter(url => url !== homeData.heroImage);
    }
    
    setHeroImageFile(null);
    setHomeData({ ...homeData, heroImage: '' });
  };

  const validateForm = () => {
    try {
      homePageSchema.parse(homeData);
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

    if (!homeData.heroImage && !heroImageFile) {
      alert('Hero image is required');
      return;
    }

    setIsSaving(true);
    
    try {
      const csrfToken = getCsrfToken();
      const formData = new FormData();
      
      formData.append('tagline', homeData.tagline);
      formData.append('ourStoryShort', homeData.ourStoryShort);
      formData.append('whyUs', JSON.stringify(homeData.whyUs));
      formData.append('whatOurClientsSay', JSON.stringify(homeData.whatOurClientsSay));
      
      if (heroImageFile) {
        formData.append('heroImage', heroImageFile);
      } else if (homeData.heroImage && !homeData.heroImage.startsWith('blob:')) {
        formData.append('existingHeroImage', homeData.heroImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/edit-home`, {
        method: 'POST',
        headers: {
          ...(csrfToken && { 'x-csrf-token': csrfToken }),
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save home page');
      }

      const data = await response.json();
      
      if (data.success) {
        alert(data.message || 'Home page saved successfully!');
        
        if (data.data?.heroImage) {
          if (homeData.heroImage.startsWith('blob:')) {
            URL.revokeObjectURL(homeData.heroImage);
            blobUrls.current = blobUrls.current.filter(url => url !== homeData.heroImage);
          }

          setHomeData(prev => ({ ...prev, heroImage: data.data.heroImage }));
        }
        
        setHeroImageFile(null);
      }
    } catch (error) {
      console.error('Error saving home page:', error); // Debug log
      alert(error instanceof Error ? error.message : 'Failed to save home page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateWhyUs = (index: number, field: 'heading' | 'description', value: string) => {
    const updatedWhyUs = [...homeData.whyUs];
    updatedWhyUs[index] = { ...updatedWhyUs[index], [field]: value };
    setHomeData({ ...homeData, whyUs: updatedWhyUs });

    if (validationErrors[`whyUs.${index}.${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`whyUs.${index}.${field}`];
      setValidationErrors(newErrors);
    }
  };

  const updateTestimonial = (index: number, field: 'nameOfClient' | 'roleOfClient' | 'quotesOfClient', value: string) => {
    const updatedTestimonials = [...homeData.whatOurClientsSay];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    setHomeData({ ...homeData, whatOurClientsSay: updatedTestimonials });

    if (validationErrors[`whatOurClientsSay.${index}.${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`whatOurClientsSay.${index}.${field}`];
      setValidationErrors(newErrors);
    }
  };

  const updateField = (field: keyof HomeData, value: string) => {
    setHomeData({ ...homeData, [field]: value });

    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
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
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className={`w-full border ${validationErrors.tagline ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                  placeholder="Enter tagline"
                />
                {validationErrors.tagline && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.tagline}</p>
                )}
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                  Hero Image
                </label>
                
                {/* Image Status Display */}
                <div className="mb-4">
                  {homeData.heroImage ? (
                    <div className="flex items-center justify-between p-3 px-4 border border-[#eae2d6] bg-[#f9f7f3]">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {heroImageFile ? 'New Image Selected' : 'Image Uploaded'}
                          </p>
                          <p className="text-xs text-[#666666]">
                            {heroImageFile ? heroImageFile.name : 'Existing image from backend'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-dashed border-[#eae2d6] bg-[#f9f7f3] text-center">
                      <p className="text-sm text-[#666666] mb-2">
                        No hero image selected
                      </p>
                      <p className="text-xs text-[#888888]">
                        Please upload an image for the hero section
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Upload/Change Button */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-3 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {homeData.heroImage ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Guidelines */}
                <div className="mt-4 p-3 bg-[#f9f7f3] border border-[#eae2d6]">
                  <p className="text-xs font-medium text-[#1a1a1a] mb-1">
                    Image Guidelines:
                  </p>
                  <ul className="text-xs text-[#666666] space-y-0.5">
                    <li>• Max file size: 2MB</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                    <li>• Recommended dimensions: 1920x1080px</li>
                    <li>• Aspect ratio: 16:9 (landscape)</li>
                  </ul>
                </div>
                
                {validationErrors.heroImage && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.heroImage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Why Us Section */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Why Choose Us (3 Features Required)
              </p>
              {validationErrors.whyUs && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.whyUs}</p>
              )}
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
                        className={`w-full border ${validationErrors[`whyUs.${index}.heading`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                        placeholder="Enter heading"
                      />
                      {validationErrors[`whyUs.${index}.heading`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`whyUs.${index}.heading`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Description
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateWhyUs(index, 'description', e.target.value)}
                        rows={3}
                        className={`w-full border ${validationErrors[`whyUs.${index}.description`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none`}
                        placeholder="Enter description"
                      />
                      {validationErrors[`whyUs.${index}.description`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`whyUs.${index}.description`]}</p>
                      )}
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
                onChange={(e) => updateField('ourStoryShort', e.target.value)}
                rows={4}
                className={`w-full border ${validationErrors.ourStoryShort ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none`}
                placeholder="Enter short story description"
              />
              {validationErrors.ourStoryShort && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.ourStoryShort}</p>
              )}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white border border-[#eae2d6] mb-6">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                Client Testimonials (3 Testimonials Required)
              </p>
              {validationErrors.whatOurClientsSay && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.whatOurClientsSay}</p>
              )}
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
                        className={`w-full border ${validationErrors[`whatOurClientsSay.${index}.nameOfClient`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                        placeholder="Enter client name"
                      />
                      {validationErrors[`whatOurClientsSay.${index}.nameOfClient`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`whatOurClientsSay.${index}.nameOfClient`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Client Role
                      </label>
                      <input
                        type="text"
                        value={testimonial.roleOfClient}
                        onChange={(e) => updateTestimonial(index, 'roleOfClient', e.target.value)}
                        className={`w-full border ${validationErrors[`whatOurClientsSay.${index}.roleOfClient`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm`}
                        placeholder="Enter client role"
                      />
                      {validationErrors[`whatOurClientsSay.${index}.roleOfClient`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`whatOurClientsSay.${index}.roleOfClient`]}</p>
                      )}
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
                      className={`w-full border ${validationErrors[`whatOurClientsSay.${index}.quotesOfClient`] ? 'border-red-500' : 'border-[#eae2d6]'} bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm resize-none`}
                      placeholder="Enter client quote"
                    />
                    {validationErrors[`whatOurClientsSay.${index}.quotesOfClient`] && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors[`whatOurClientsSay.${index}.quotesOfClient`]}</p>
                    )}
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