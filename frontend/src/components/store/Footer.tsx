import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#eeeceb] border-t border-[#1a1a1a]/15">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center lg:text-left">
            <div className="text-center items-center justify-center lg:justify-start mb-1">
              <span className="text-3xl font-['Playfair_Display']">
                GREATNESS
              </span>
              <p className="text-xs text-gray-500">
                Crafting greatness since 2025
              </p>
            </div>
          </div>

          {/* Minimal Links */}
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-[#d4af37] transition-colors"
            >
              About
            </Link>
            <Link
              href="/faqs"
              className="text-sm text-gray-500 hover:text-[#d4af37] transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 hover:text-[#d4af37] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-500 tracking-tight">
              © {new Date().getFullYear()} GREATNESS
            </p>
            <p className="text-xs text-gray-500 mt-0.5">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;