'use client';

import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { collections } from '../../data/collections';

const CollectionTable = () => {
  // Get only the first variant for each collection
  const collectionsWithFirstVariant = collections.map(collection => {
    const firstVariant = collection.variants[0]; // Get first variant only
    return {
      collectionId: collection.id,
      collectionName: collection.name,
      collectionImage: collection.images[0]?.url,
      collectionDiscount: collection.discount,
      basePrice: collection.price,
      variant: firstVariant, // Include the first variant
      stock: collection.stock, // Use collection stock instead of variant stock
    };
  });

  return (
    <div>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
        <div className="text-sm text-[#666666] tracking-tight text-center sm:text-left">
          {collections.length} Collections total
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
              {collectionsWithFirstVariant.map((item) => (
                <tr 
                  key={item.collectionId} 
                  className="hover:bg-[#f9f7f3]/50 cursor-pointer group"
                  onClick={() => window.open(`/collection/${item.collectionId}`, '_blank')}
                >
                  <td className="px-4 sm:px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#eeeceb] overflow-hidden">
                        <img
                          src={item.collectionImage || '/placeholder-image.jpg'}
                          alt={item.collectionName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight hover:text-[#d4af37] transition-colors text-center text-sm sm:text-base">
                      {item.collectionName}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex justify-center">
                      <span className="px-2 py-1 text-xs sm:text-sm tracking-tight text-center">
                        {item.variant?.name || 'No variant'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-[#1a1a1a] tracking-tight text-center text-sm sm:text-base">
                      <span className="font-['Playfair_Display']">PKR {item.variant?.price.toFixed(2) || item.basePrice.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm">
                    <span className={`${item.stock > 10 ? 'text-green-600' : 'text-red-600'} tracking-tight`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <Link
                        href={`/admin/collections/${item.collectionId}/edit`}
                        className="p-1 sm:p-2"
                        title="Edit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-[#d4af37] transition-colors" />
                      </Link>
                      <button
                        className="p-1 sm:p-2"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-red-500 transition-colors cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CollectionTable;