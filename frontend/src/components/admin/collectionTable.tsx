'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { getCsrfToken } from '../../lib/utils';

interface Variant {
  variantName: string;
  variantImage: string;
  variantPrice: number;
  variantPreviousPrice?: number;
  variantOrder: number;
  variantStock: number;
}

interface Product {
  _id: string;
  name: string;
  smallDescription: string;
  longDescription: string;
  featuredProduct: boolean;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

const CollectionTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/get-all-products`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load products');
      }

      const data: ApiResponse<Product[]> = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      setDeletingId(id);

      const csrfToken = getCsrfToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/delete-product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken })
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as { message?: string };
        throw new Error(errorData.message || 'Failed to delete product');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-[#1a1a1a] text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#666666]">No collections found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
        <div className="text-sm text-[#666666] tracking-tight text-center sm:text-left">
          {products.length} Collections total
        </div>
      </div>

      {/* Collections Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f7f3]">
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Image</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Collection</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Variant</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Price</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Stock</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae2d6]">
              {products.map((product) => {
                const firstVariant = product.variants[0];
                const totalStock = product.variants.reduce((sum, variant) => sum + variant.variantStock, 0);
                
                return (
                  <tr 
                    key={product._id} 
                    className="hover:bg-[#f9f7f3]/50 cursor-pointer group"
                    onClick={() => window.open(`/collections/collection/${product._id}`, '_blank')}
                  >
                    <td className="px-4 sm:px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#eeeceb] overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={firstVariant?.variantImage || '/placeholder-image.jpg'}
                            alt={product.name}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight hover:text-[#d4af37] transition-colors text-center text-sm sm:text-base">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-center">
                        <span className="px-2 py-1 text-xs sm:text-sm tracking-tight text-center">
                          {firstVariant?.variantName || 'No variant'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-[#1a1a1a] tracking-tight text-center text-sm sm:text-base">
                        <span className="font-['Playfair_Display']">PKR {firstVariant?.variantPrice.toFixed(2) || '0.00'}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm">
                      <span className={`${totalStock > 10 ? 'text-green-600' : 'text-red-600'} tracking-tight`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Link
                          href={`/admin/collections/${product._id}/edit`}
                          className="p-1 sm:p-2"
                          title="Edit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-[#d4af37] transition-colors" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product._id);
                          }}
                          disabled={deletingId === product._id}
                          className="p-1 sm:p-2 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-red-500 transition-colors cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CollectionTable;