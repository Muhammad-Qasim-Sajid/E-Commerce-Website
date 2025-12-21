'use client';

import { useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';

interface Variant {
  variantName: string;
  variantImage: string;
  variantPrice: string;
  variantPreviousPrice: string;
  variantOrder: string;
  variantStock: string;
}

interface CollectionFormProps {
  isEdit?: boolean;
}

const CollectionForm = ({ isEdit = false }: CollectionFormProps) => {
  const [formData, setFormData] = useState({
    name: 'Chronograph Pro',
    smallDescription: 'A premium chronograph watch with automatic movement.',
    longDescription: 'A premium chronograph watch with automatic movement, featuring a stainless steel case and sapphire crystal. Perfect for both casual and formal occasions. This exquisite timepiece combines traditional craftsmanship with modern technology, offering precision timekeeping with elegant aesthetics. The watch features a scratch-resistant sapphire crystal, luminous hands, and a date window at 3 o\'clock position.',
    featuredProduct: false,
    variants: [
      {
        variantName: 'Silver / Black',
        variantImage: 'https://via.placeholder.com/400x400',
        variantPrice: '1299.99',
        variantPreviousPrice: '1499.99',
        variantOrder: '1',
        variantStock: '25',
      },
      {
        variantName: 'Rose Gold / Brown',
        variantImage: 'https://via.placeholder.com/400x400',
        variantPrice: '1399.99',
        variantPreviousPrice: '',
        variantOrder: '2',
        variantStock: '12',
      },
    ],
  });

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newVariants = [...formData.variants];
        newVariants[index].variantImage = reader.result as string;
        setFormData({ ...formData, variants: newVariants });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVariantImage = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants[index].variantImage = '';
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    const newVariant: Variant = {
      variantName: '',
      variantImage: '',
      variantPrice: '',
      variantPreviousPrice: '',
      variantOrder: (formData.variants.length + 1).toString(),
      variantStock: '0',
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      const updatedVariants = newVariants.map((variant, idx) => ({
        ...variant,
        variantOrder: (idx + 1).toString(),
      }));
      setFormData({ ...formData, variants: updatedVariants });
    }
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isEdit ? 'Collection updated!' : 'Collection created!');
  };

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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm px-4 py-3 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs text-[#666666] mb-1 ml-0.5">
              Small Description *
            </label>
            <textarea
              value={formData.smallDescription}
              onChange={(e) => setFormData({ ...formData, smallDescription: e.target.value })}
              maxLength={100}
              rows={3}
              className="w-full text-sm px-4 py-3 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
              required
            />
            <div className="text-right text-xs text-[#666666] mt-1">
              {formData.smallDescription.length}/100 characters
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-[#666666] mb-1 ml-0.5">
              Long Description *
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={6}
              className="w-full text-sm px-4 py-3 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
              required
            />
            <div className={`text-right text-xs mt-1 ${
              formData.longDescription.length >= 300 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formData.longDescription.length}/300 characters
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredProduct"
              checked={formData.featuredProduct}
              onChange={(e) => setFormData({ ...formData, featuredProduct: e.target.checked })}
              className="w-4 h-4 text-[#d4af37] border-[#eae2d6] focus:ring-[#d4af37] cursor-pointer"
            />
            <label htmlFor="featuredProduct" className="cursor-pointer ml-2 tracking-tight text-sm text-[#1a1a1a]">
              Mark as Featured Collection
            </label>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
            Variants
          </p>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-4 py-2 border border-[#eae2d6] hover:bg-[#f9f7f3] text-[#1a1a1a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

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
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Mobile: Image above form */}
              <div className="lg:hidden space-y-4">
                {/* Variant Image for mobile */}
                <div>
                  <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                    Variant Image *
                  </label>
                  <div>
                    {variant.variantImage ? (
                      <div className="relative inline-block">
                        <div className="w-45 h-45 sm:w-72 sm:h-72 bg-[#eeeceb] overflow-hidden">
                          <img
                            src={variant.variantImage}
                            alt={`Variant ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariantImage(index)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-block">
                        <div className="w-45 h-45 sm:w-72 sm:h-72 border-2 border-dashed border-[#eae2d6] flex flex-col items-center justify-center hover:border-[#1a1a1a] transition-colors">
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
                </div>
                
                {/* Variant Form for mobile */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Variant Name *
                    </label>
                    <input
                      type="text"
                      value={variant.variantName}
                      onChange={(e) => handleVariantChange(index, 'variantName', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Price (PKR) *
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={variant.variantPrice}
                        onChange={(e) => handleVariantChange(index, 'variantPrice', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        required
                      />
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
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Display Order *
                      </label>
                      <input
                        type="number"
                        value={variant.variantOrder}
                        onChange={(e) => handleVariantChange(index, 'variantOrder', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={variant.variantStock}
                        onChange={(e) => handleVariantChange(index, 'variantStock', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Image beside form */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                {/* Variant Image for desktop */}
                <div className="lg:col-span-1">
                  <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                    Variant Image *
                  </label>
                  <div>
                    {variant.variantImage ? (
                      <div className="relative inline-block">
                        <div className="w-full aspect-square bg-[#eeeceb] overflow-hidden">
                          <img
                            src={variant.variantImage}
                            alt={`Variant ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariantImage(index)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-block w-full">
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
                </div>
                
                {/* Variant Form for desktop */}
                <div className="space-y-3 lg:col-span-2">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                      Variant Name *
                    </label>
                    <input
                      type="text"
                      value={variant.variantName}
                      onChange={(e) => handleVariantChange(index, 'variantName', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                      required
                    />
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
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        required
                      />
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
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Display Order *
                      </label>
                      <input
                        type="number"
                        value={variant.variantOrder}
                        onChange={(e) => handleVariantChange(index, 'variantOrder', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#666666] mb-1 ml-0.5">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={variant.variantStock}
                        onChange={(e) => handleVariantChange(index, 'variantStock', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-[#eae2d6] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-[#eae2d6]">
        <button
          type="button"
          className="px-6 py-3 border border-[#eae2d6] hover:bg-[#f9f7f3] text-[#1a1a1a] transition-colors text-xs sm:text-base"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_100%)] text-white hover:opacity-95 transition-opacity text-xs sm:text-base"
        >
          {isEdit ? 'Update Collection' : 'Create Collection'}
        </button>
      </div>
    </form>
  )
}

export default CollectionForm;