import Link from "next/link";

interface Variant {
  variantName: string;
  variantImage: string;
  variantPrice: number;
  variantPreviousPrice?: number;
  variantOrder: number;
  variantStock: number;
}

interface CollectionCardProps {
  collection: {
    _id: string;
    name: string;
    smallDescription: string;
    variants: Variant[];
  };
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const firstVariant = collection.variants[0];
  
  return (
    <Link href={`/collections/collection/${collection._id}`} className="group block">
      <div className="relative overflow-hidden aspect-square mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={firstVariant?.variantImage || "/placeholder-watch.jpg"}
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <p className="text-center text-xl font-light group-hover:text-[#d4af37] transition-colors font-['Playfair_Display'] tracking-tight">
        {collection.name}
      </p>
    </Link>
  );
};

export default CollectionCard;