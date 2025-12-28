import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <p className="font-['Playfair_Display'] italic text-5xl mb-4">
          404 - Page not found
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
        >
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}