'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { getCsrfToken } from '../../lib/utils';
import { productSchema } from '../../lib/schemas';

interface VariantFormData {
  variantName: string;
  variantPrice: string;
  variantPreviousPrice: string;
  variantOrder: string;
  variantStock: string;
}

interface FormData {
  name: string;
  smallDescription: string;
  longDescription: string;
  featuredProduct: boolean;
  variants: VariantFormData[];
}

interface ImageData {
  file: File | null;
  preview: string;
  variantIndex: number;
  variantName: string;
  isExistingImage?: boolean;
}

interface BackendVariant {
  variantName: string;
  variantImage: string;
  variantPrice: number;
  variantPreviousPrice?: number;
  variantOrder: number;
  variantStock: number;
}

interface BackendProduct {
  _id: string;
  name: string;
  smallDescription: string;
  longDescription: string;
  featuredProduct: boolean;
  variants: BackendVariant[];
  createdAt: string;
  updatedAt: string;
}

interface CollectionFormProps {
  isEdit?: boolean;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const RECOMMENDED_DIMENSIONS = '1200 x 1200 pixels';

const CollectionForm = ({ isEdit = false }: CollectionFormProps) => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    smallDescription: '',
    longDescription: '',
    featuredProduct: false,
    variants: [
      {
        variantName: '',
        variantPrice: '',
        variantPreviousPrice: '',
        variantOrder: '1',
        variantStock: '0',
      },
    ],
  });

  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [totalFeaturedProducts, setTotalFeaturedProducts] = useState(0);
  const [hasImagesBeenTouched, setHasImagesBeenTouched] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fetchFeaturedCount = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/get-all-products`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data: ApiResponse<BackendProduct[]> = await response.json();
          if (data.success) {
            const featuredCount = data.data.filter(product => product.featuredProduct).length;
            setTotalFeaturedProducts(featuredCount);
          }
        }
      } catch {}
    };

    fetchFeaturedCount();
  }, []);

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/get-product/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load product');
      }

      const data: ApiResponse<BackendProduct> = await response.json();
      
      if (data.success && data.data) {
        const product = data.data;
        setFormData({
          name: product.name,
          smallDescription: product.smallDescription,
          longDescription: product.longDescription,
          featuredProduct: product.featuredProduct || false,
          variants: product.variants.map((variant, index) => ({
            variantName: variant.variantName,
            variantPrice: variant.variantPrice?.toString() || '',
            variantPreviousPrice: variant.variantPreviousPrice?.toString() || '',
            variantOrder: variant.variantOrder?.toString() || (index + 1).toString(),
            variantStock: variant.variantStock?.toString() || '0',
          })),
        });

        setImageData(product.variants.map((variant, index) => ({
          file: null,
          preview: variant.variantImage || '',
          variantIndex: index,
          variantName: variant.variantName,
          isExistingImage: true,
        })));
      } else {
        throw new Error(data.message || 'Failed to load product');
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Failed to load collection');
      router.push('/admin/collections');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (isEdit && id) {
      fetchProductData();
    }
  }, [isEdit, id, fetchProductData]);

  const validateImageFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `Image size should not exceed 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file (JPEG, PNG, etc.)';
    }

    return null;
  };

  const handleVariantImageUpload = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validationError = validateImageFile(file);
      if (validationError) {
        alert(validationError);
        e.target.value = '';
        return;
      }

      const preview = URL.createObjectURL(file);

      const newImageData = [...imageData];
      const imageIndex = newImageData.findIndex(img => img.variantIndex === variantIndex);
      
      if (imageIndex !== -1) {
        newImageData[imageIndex] = {
          ...newImageData[imageIndex],
          file,
          preview,
          isExistingImage: false,
        };
      } else {
        newImageData.push({
          file,
          preview,
          variantIndex,
          variantName: formData.variants[variantIndex]?.variantName || `Variant ${variantIndex + 1}`,
          isExistingImage: false,
        });
      }

      setImageData(newImageData);
      setHasImagesBeenTouched(true);

      const errorKey = `variantImage_${variantIndex}`;
      if (formErrors[errorKey]) {
        const newErrors = { ...formErrors };
        delete newErrors[errorKey];
        setFormErrors(newErrors);
      }
    }
  };

  const removeVariantImage = (variantIndex: number) => {
    const newImageData = [...imageData];
    const imageIndex = newImageData.findIndex(img => img.variantIndex === variantIndex);

    if (imageIndex !== -1) {
      newImageData[imageIndex] = {
        ...newImageData[imageIndex],
        file: null,
        preview: '',
        isExistingImage: false,
      };

      setImageData(newImageData);
      setHasImagesBeenTouched(true);

      const input = fileInputRefs.current[variantIndex];
      if (input) input.value = '';
    }
  };

  const addVariant = () => {
    const newVariant: VariantFormData = {
      variantName: '',
      variantPrice: '',
      variantPreviousPrice: '',
      variantOrder: (formData.variants.length + 1).toString(),
      variantStock: '0',
    };

    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });

    setHasImagesBeenTouched(true);
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      const updatedVariants = newVariants.map((variant, idx) => ({
        ...variant,
        variantOrder: (idx + 1).toString(),
      }));

      const newImageData = imageData
        .filter(img => img.variantIndex !== index)
        .map(img => ({
          ...img,
          variantIndex: img.variantIndex > index ? img.variantIndex - 1 : img.variantIndex,
        }));
      
      setFormData({ ...formData, variants: updatedVariants });
      setImageData(newImageData);
      setHasImagesBeenTouched(true);

      const newErrors = { ...formErrors };
      Object.keys(newErrors).forEach(key => {
        if (key.includes(`variants[${index}]`) || key.includes(`variantImage_${index}`)) {
          delete newErrors[key];
        }
      });
      setFormErrors(newErrors);
    }
  };

  const handleVariantChange = (index: number, field: keyof VariantFormData, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });

    if (field === 'variantName') {
      const newImageData = [...imageData];
      const imageIndex = newImageData.findIndex(img => img.variantIndex === index);
      if (imageIndex !== -1) {
        newImageData[imageIndex].variantName = value;
        setImageData(newImageData);
      }
    }

    const errorKey = `variants[${index}].${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleInputChange = (field: keyof Omit<FormData, 'variants'>, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });

    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const validateForm = () => {
    try {
      const validationData = {
        name: formData.name,
        smallDescription: formData.smallDescription,
        longDescription: formData.longDescription,
        featuredProduct: formData.featuredProduct,
        variants: formData.variants.map(variant => ({
          variantName: variant.variantName,
          variantPrice: parseFloat(variant.variantPrice) || 0,
          variantPreviousPrice: variant.variantPreviousPrice ? parseFloat(variant.variantPreviousPrice) : undefined,
          variantOrder: parseInt(variant.variantOrder) || 1,
          variantStock: parseInt(variant.variantStock) || 0,
        }))
      };

      productSchema.parse(validationData);

      const errors: Record<string, string> = {};
      
      if (!isEdit) {
        formData.variants.forEach((_, index) => {
          const image = imageData.find(img => img.variantIndex === index);
          if (!image?.file) {
            errors[`variantImage_${index}`] = 'Variant image is required';
          }
        });
      } else {
        if (hasImagesBeenTouched) {
          formData.variants.forEach((_, index) => {
            const image = imageData.find(img => img.variantIndex === index);
            if (!image?.file) {
              errors[`variantImage_${index}`] = 'All variant images must be re-uploaded when making changes';
            }
          });
        }
      }

      if (formData.featuredProduct && totalFeaturedProducts >= 5) {
        const currentProductIsFeatured = isEdit ? formData.featuredProduct : false;
        if (!currentProductIsFeatured) {
          errors.featuredProduct = 'Only 5 products can be featured. Maximum limit reached.';
        }
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();
    
    formDataToSend.append('name', formData.name);
    formDataToSend.append('smallDescription', formData.smallDescription);
    formDataToSend.append('longDescription', formData.longDescription);
    formDataToSend.append('featuredProduct', formData.featuredProduct.toString());
    
    const variantsWithoutImages = formData.variants.map((variant) => ({
      variantName: variant.variantName,
      variantPrice: parseFloat(variant.variantPrice) || 0,
      variantPreviousPrice: variant.variantPreviousPrice ? parseFloat(variant.variantPreviousPrice) : undefined,
      variantOrder: parseInt(variant.variantOrder) || 1,
      variantStock: parseInt(variant.variantStock) || 0,
    }));
    
    formDataToSend.append('variants', JSON.stringify(variantsWithoutImages));
    
    imageData
      .filter(img => img.file)
      .sort((a, b) => a.variantIndex - b.variantIndex)
      .forEach(img => {
        if (img.file) {
          formDataToSend.append('variantImages', img.file);
        }
      });
    
    return formDataToSend;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);
      const formDataToSend = prepareFormData();
      
      const csrfToken = getCsrfToken();
      const url = isEdit && id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/edit-product/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products/add-product`;
      
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as { message?: string };
        throw new Error(errorData.message || 'Operation failed');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        alert(isEdit ? 'Collection updated successfully!' : 'Collection created successfully!');
        router.push('/admin/collections');
        router.refresh();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      const error = err as Error;
      console.error('Submission error:', error); // Debug log
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      router.push('/admin/collections');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="sm:p-6 p-4">
      {/* Collection Basic Information */}
      <div className="mb-8 pb-8 border-b border-[#eae2d6]">
        <p className="mb-6 font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
          Basic Information
        </p>
        <div className="space-y-6">
          <div>
            <label className="block text-xs text-[#666666] mb-1 ml-0.5">
              Collection Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full text-sm px-4 py-3 border ${
                formErrors.name ? 'border-red-500' : 'border-[#eae2d6]'
              } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors`}
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs text-[#666666] mb-1 ml-0.5">
              Small Description *
            </label>
            <textarea
              value={formData.smallDescription}
              onChange={(e) => handleInputChange('smallDescription', e.target.value)}
              maxLength={100}
              rows={3}
              className={`w-full text-sm px-4 py-3 border ${
                formErrors.smallDescription ? 'border-red-500' : 'border-[#eae2d6]'
              } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none`}
              required
            />
            <div className="flex justify-between">
              <div className="text-xs text-red-500 mt-1">
                {formErrors.smallDescription}
              </div>
              <div className="text-right text-xs text-[#666666] mt-1">
                {formData.smallDescription.length}/100 characters
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-[#666666] mb-1 ml-0.5">
              Long Description *
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => handleInputChange('longDescription', e.target.value)}
              rows={6}
              className={`w-full text-sm px-4 py-3 border ${
                formErrors.longDescription ? 'border-red-500' : 'border-[#eae2d6]'
              } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none`}
              required
            />
            <div className="flex justify-between">
              <div className="text-xs text-red-500 mt-1">
                {formErrors.longDescription}
              </div>
              <div className={`text-right text-xs mt-1 ${
                formData.longDescription.length >= 300 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.longDescription.length}/300 characters
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="flex items-start mt-1.5">
              <input
                type="checkbox"
                id="featuredProduct"
                checked={formData.featuredProduct}
                onChange={(e) => handleInputChange('featuredProduct', e.target.checked)}
                disabled={totalFeaturedProducts >= 5 && !formData.featuredProduct}
                className="w-4 h-4 text-[#d4af37] border-[#eae2d6] focus:ring-[#d4af37] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="featuredProduct" className="cursor-pointer tracking-tight text-sm text-[#1a1a1a]">
                Mark as Featured Collection
              </label>
              <p className="text-xs text-[#666666]">
                {totalFeaturedProducts >= 5 && !formData.featuredProduct && (
                  <span className="text-red-600 block mt-0.5">
                    Maximum limit of 5 featured products reached. You cannot add more.
                  </span>
                )}
              </p>
              {formErrors.featuredProduct && (
                <p className="text-xs text-red-500 mt-1">{formErrors.featuredProduct}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section - Forms Only */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
            Variants
          </p>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-4 py-2 border border-[#eae2d6] hover:bg-[#f9f7f3] text-[#1a1a1a] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        {formErrors.variants && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{formErrors.variants}</p>
          </div>
        )}

        <div className="space-y-6">
          {formData.variants.map((variant, index) => (
            <div key={index} className="p-4 sm:p-6 border border-[#eae2d6] bg-[#f9f7f3]/50">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <p className="font-['Playfair_Display'] text-[#1a1a1a] text-sm sm:text-base">
                  Variant {index + 1}
                </p>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </button>
                )}
              </div>
              
              {/* Variant Errors Summary */}
              {(formErrors[`variants[${index}].variantName`] || 
                formErrors[`variants[${index}].variantPrice`] || 
                formErrors[`variants[${index}].variantPreviousPrice`] || 
                formErrors[`variants[${index}].variantOrder`] || 
                formErrors[`variants[${index}].variantStock`]) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200">
                  {formErrors[`variants[${index}].variantName`] && (
                    <p className="text-xs text-red-600">• {formErrors[`variants[${index}].variantName`]}</p>
                  )}
                  {formErrors[`variants[${index}].variantPrice`] && (
                    <p className="text-xs text-red-600">• {formErrors[`variants[${index}].variantPrice`]}</p>
                  )}
                  {formErrors[`variants[${index}].variantPreviousPrice`] && (
                    <p className="text-xs text-red-600">• {formErrors[`variants[${index}].variantPreviousPrice`]}</p>
                  )}
                  {formErrors[`variants[${index}].variantOrder`] && (
                    <p className="text-xs text-red-600">• {formErrors[`variants[${index}].variantOrder`]}</p>
                  )}
                  {formErrors[`variants[${index}].variantStock`] && (
                    <p className="text-xs text-red-600">• {formErrors[`variants[${index}].variantStock`]}</p>
                  )}
                </div>
              )}
              
              {/* Variant Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    value={variant.variantName}
                    onChange={(e) => handleVariantChange(index, 'variantName', e.target.value)}
                    className={`w-full text-sm px-3 py-2 border ${
                      formErrors[`variants[${index}].variantName`] ? 'border-red-500' : 'border-[#eae2d6]'
                    } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                    required
                  />
                  {formErrors[`variants[${index}].variantName`] && (
                    <p className="mt-1 text-xs text-red-500">{formErrors[`variants[${index}].variantName`]}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={variant.variantPrice}
                      onChange={(e) => handleVariantChange(index, 'variantPrice', e.target.value)}
                      className={`w-full text-sm px-3 py-2 border ${
                        formErrors[`variants[${index}].variantPrice`] ? 'border-red-500' : 'border-[#eae2d6]'
                      } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                      required
                    />
                    {formErrors[`variants[${index}].variantPrice`] && (
                      <p className="mt-1 text-xs text-red-500">{formErrors[`variants[${index}].variantPrice`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Previous Price (PKR)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={variant.variantPreviousPrice}
                      onChange={(e) => handleVariantChange(index, 'variantPreviousPrice', e.target.value)}
                      className={`w-full text-sm px-3 py-2 border ${
                        formErrors[`variants[${index}].variantPreviousPrice`] ? 'border-red-500' : 'border-[#eae2d6]'
                      } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                      placeholder="Optional"
                    />
                    {formErrors[`variants[${index}].variantPreviousPrice`] && (
                      <p className="mt-1 text-xs text-red-500">{formErrors[`variants[${index}].variantPreviousPrice`]}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={variant.variantOrder}
                      readOnly
                      className="w-full text-sm px-3 py-2 bg-gray-50 text-[#666666] cursor-not-allowed"
                    />
                    <p className="text-xs text-[#666666] mt-1">Order is automatically assigned based on position</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={variant.variantStock}
                      onChange={(e) => handleVariantChange(index, 'variantStock', e.target.value)}
                      className={`w-full text-sm px-3 py-2 border ${
                        formErrors[`variants[${index}].variantStock`] ? 'border-red-500' : 'border-[#eae2d6]'
                      } bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                      required
                      min="0"
                    />
                    {formErrors[`variants[${index}].variantStock`] && (
                      <p className="mt-1 text-xs text-red-500">{formErrors[`variants[${index}].variantStock`]}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images Section - Separate from forms */}
      <div className="mb-8">
        <div className="mb-6">
          <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a] mb-1">
            Variant Images
          </p>
          <div className={`p-3 mb-3 border ${
            hasImagesBeenTouched ? 'border-yellow-200 bg-yellow-50' : 'border-[#eae2d6] bg-[#f9f7f3]'
          }`}>
            <p className={`text-xs ${
              hasImagesBeenTouched ? 'text-yellow-700' : 'text-[#666666]'
            }`}>
              {isEdit ? (
                <>
                  <strong>Important:</strong> When editing a collection, if you change any image or add/remove a variant, 
                  you must upload all images again. This is a system requirement.
                  {hasImagesBeenTouched && (
                    <span className="block text-red-600 mt-1">
                      <strong>Warning:</strong> You have made changes that require re-uploading all variant images.
                    </span>
                  )}
                </>
              ) : (
                'Upload images for each variant. All images are required for new collections.'
              )}
            </p>
            <p className="text-xs text-[#666666] mt-2">
              <strong>Image Requirements:</strong> Max size: 2MB | Recommended dimensions: {RECOMMENDED_DIMENSIONS}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.variants.map((variant, index) => {
            const image = imageData.find(img => img.variantIndex === index);
            const preview = image?.preview || '';
            const isExistingImage = image?.isExistingImage;
            
            return (
              <div key={index} className="border border-[#eae2d6] bg-[#f9f7f3]/50 p-4">
                <div className="mb-3">
                  <p className="font-['Playfair_Display'] text-sm text-[#1a1a1a]">
                    Variant {index + 1}: {variant.variantName || 'Unnamed Variant'}
                  </p>
                  <p className="text-xs text-[#666666] mt-1">
                    {isEdit ? (
                      hasImagesBeenTouched ? (
                        <span className="text-red-600">Image required (all must be re-uploaded)</span>
                      ) : isExistingImage ? (
                        <span className="text-green-600">Existing image (no change needed)</span>
                      ) : (
                        <span className="text-red-600">Image required</span>
                      )
                    ) : (
                      <span className="text-red-600">Image required</span>
                    )}
                  </p>
                </div>
                
                <div className="relative">
                  {preview ? (
                    <>
                      <div className="w-full aspect-square bg-[#eeeceb] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt={`Variant ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Always show X button */}
                      <button
                        type="button"
                        onClick={() => removeVariantImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-red-700 transition-colors shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="w-full aspect-square border-2 border-dashed border-[#eae2d6] flex flex-col items-center justify-center hover:border-[#1a1a1a] transition-colors">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-1">
                          <Upload className="w-4 h-4 text-[#666666]" />
                        </div>
                        <span className="text-xs text-[#666666]">Upload Image</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleVariantImageUpload(index, e)}
                      />
                    </label>
                  )}
                </div>
                {formErrors[`variantImage_${index}`] && (
                  <p className="mt-1 text-xs text-red-500">{formErrors[`variantImage_${index}`]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-[#eae2d6]">
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          className="px-6 py-3 border border-[#eae2d6] hover:bg-[#f9f7f3] text-[#1a1a1a] transition-colors text-xs sm:text-base disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_100%)] text-white hover:opacity-95 transition-opacity text-xs sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEdit ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEdit ? 'Update Collection' : 'Create Collection'
          )}
        </button>
      </div>
    </form>
  );
}

export default CollectionForm;