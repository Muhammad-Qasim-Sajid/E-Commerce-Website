import CollectionForm from '../../../../../components/admin/CollectionForm';

export default function EditCollection() {
  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="sm:p-4 sm:pb-10 pb-6">
        <p className="mb-6 font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight">
          Edit Collection
        </p>
        <div className="bg-white">
          <CollectionForm isEdit={true} />
        </div>
      </div>
    </div>
  );
}