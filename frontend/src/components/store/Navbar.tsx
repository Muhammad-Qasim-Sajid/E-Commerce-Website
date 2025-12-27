"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { getCart } from '../../lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const pathname = usePathname();

  const leftLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
  ];

  const rightLinks = [
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const cart = getCart();
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(totalItems);
    }, 0);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'greatness-cart') {
        const cart = getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemsCount(totalItems);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleCartUpdate = () => {
      const cart = getCart();
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(totalItems);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleBodyScroll = (open: boolean) => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    toggleBodyScroll(newState);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    toggleBodyScroll(false);
  };

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#eeeceb] font-[Inter] ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-20 lg:h-25 relative">
          {/* Left Links - Desktop */}
          <div className="hidden lg:flex items-center absolute left-10 top-1/2 -translate-y-1/2">
            <div className="flex items-center space-x-8">
              {leftLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-[#d4af37]"
                        : "text-[#1a1a1a] hover:text-[#d4af37]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-3xl tracking-tight">
              GREATNESS
            </span>
          </div>

          {/* Right Links & Actions - Desktop */}
          <div className="hidden lg:flex items-center absolute right-10 top-1/2 -translate-y-1/2">
            <div className="flex items-center space-x-8">
              {rightLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-[#d4af37]"
                        : "text-[#1a1a1a] hover:text-[#d4af37]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/cart"
                className={`relative transition-colors duration-300 group ${
                  isActiveLink("/cart")
                    ? "text-[#d4af37]"
                    : "text-[#1a1a1a] hover:text-[#d4af37]"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#d4af37] text-black text-[10px] flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2">
            <button
              className="cursor-pointer"
              onClick={handleMenuToggle}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Menu
                  className={`absolute w-6 h-6 transition-all duration-500 ease-out ${
                    isMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`absolute w-6 h-6 transition-all duration-500 ease-out ${
                    isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black transition-all duration-700 ease-in-out ${
            isMenuOpen
              ? "opacity-50 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={handleMenuClose}
        />

        {/* Mobile Menu Content */}
        <div
          className={`lg:hidden fixed top-20 right-0 w-full max-w-sm bg-[#eeeceb] shadow-2xl transition-all duration-500 ease-in-out transform ${
            isMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <div className="flex flex-col p-8 space-y-6 h-[calc(100vh-5rem)] overflow-y-auto">
            {[...leftLinks, ...rightLinks].map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 transition-colors duration-300 ${
                    isActive
                      ? "text-[#d4af37]"
                      : "text-[#1a1a1a] hover:text-[#d4af37]"
                  }`}
                  onClick={handleMenuClose}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-8 mt-4 border-t border-[#666666]">
              <Link
                href="/cart"
                className={`flex items-center justify-between group transition-colors duration-300 ${
                  isActiveLink("/cart")
                    ? "text-[#d4af37]"
                    : "text-[#1a1a1a] hover:text-[#d4af37]"
                }`}
                onClick={handleMenuClose}
              >
                <div className="flex items-center gap-4">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </div>
                {cartItemsCount > 0 && (
                  <span className="w-6 h-6 bg-[#d4af37] text-black text-xs flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;