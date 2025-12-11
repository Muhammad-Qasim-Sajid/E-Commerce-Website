'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ProductFormProps {
  isEdit?: boolean;
}

const ProductForm = ({ isEdit = false }: ProductFormProps) => {
  const [images, setImages] = useState<string[]>([
    'https://via.placeholder.com/400x400',
    'https://via.placeholder.com/400x400',
    'https://via.placeholder.com/400x400',
  ]);

  const [formData, setFormData] = useState({
    name: 'Chronograph Pro',
    description: 'A premium chronograph watch with automatic movement.',
    category: 'watches',
    price: '1299.99',
    discount: '15',
    sku: 'CP-2024-PRO',
    stock: '42',
    status: 'published',
    specifications: {
      movement: 'Automatic',
      caseMaterial: 'Stainless Steel',
      waterResistance: '50m',
      diameter: '42mm',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages([...images, reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(isEdit ? 'Product updated!' : 'Product created!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Upload</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="watches">Watches</option>
              <option value="accessories">Accessories</option>
              <option value="straps">Straps</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
              required
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="input-field"
              required
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movement
            </label>
            <input
              type="text"
              value={formData.specifications.movement}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, movement: e.target.value }
              })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Material
            </label>
            <input
              type="text"
              value={formData.specifications.caseMaterial}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, caseMaterial: e.target.value }
              })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Resistance
            </label>
            <input
              type="text"
              value={formData.specifications.waterResistance}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, waterResistance: e.target.value }
              })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diameter
            </label>
            <input
              type="text"
              value={formData.specifications.diameter}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, diameter: e.target.value }
              })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm;