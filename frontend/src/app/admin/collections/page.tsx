import Link from 'next/link';
import { Plus } from 'lucide-react';
import CollectionTable from '../../../components/admin/collectionTable';

export default function AdminCollections() {
  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight text-center sm:text-left">
            Collections
          </p>
          <Link
            href="/admin/collections/create"
            className="bg-white hover:bg-[#f9f7f3] text-[#1a1a1a] px-4 py-3 flex items-center justify-center gap-2 transition-colors group cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collection</span>
          </Link>
        </div>
        
        <div className="bg-white">
          <CollectionTable />
        </div>
      </div>
    </div>
  );
}