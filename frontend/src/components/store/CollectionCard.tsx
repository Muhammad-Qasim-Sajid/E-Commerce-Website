import Link from "next/link";

interface Collection {
  id: number;
  name: string;
  description: string;
  images: { url: string }[];
  price: number;
  discount?: number;
  isFeatured?: boolean;
}

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link href={`/collection/${collection.id}`} className="group block">
      <div className="relative overflow-hidden aspect-square mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collection.images[0]?.url || "/placeholder-watch.jpg"}
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <p className="text-center text-xl font-light group-hover:text-[#d4af37] transition-colors">
        {collection.name}
      </p>
    </Link>
  );
};

export default CollectionCard;