"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(20px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
      }}
    >
      {children}
    </div>
  );
};

const AnimatedText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(10px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const cartItems = [
  {
    id: 1,
    collectionId: 1,
    collectionName: "Legacy Series 1895",
    variantName: "Rose Gold & Black Dial",
    image: "/1.png",
    price: 12999,
    quantity: 1,
    stock: 15,
  },
  {
    id: 2,
    collectionId: 2,
    collectionName: "Horizon Collection",
    variantName: "Silver Dial Steel",
    image: "/3.png",
    price: 8999,
    quantity: 1,
    stock: 22,
  },
  {
    id: 3,
    collectionId: 4,
    collectionName: "Aether Series",
    variantName: "Titanium Skeleton",
    image: "/2.png",
    price: 18999,
    quantity: 1,
    stock: 7,
  },
];

export default function Cart() {
  const [items, setItems] = useState(cartItems);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = items.find((item) => item.id === id);
    if (item && newQuantity > item.stock) return;

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 1500;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Proceeding to checkout...");
      setIsProcessing(false);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
        <section className="pb-26 pt-14">
          <div className="container mx-auto lg:px-40 sm:px-20 px-10">
            <AnimatedSection>
              <div className="text-center py-24">
                <div className="w-20 h-20 border border-[#1a1a1a]/20 flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-8 h-8 text-[#1a1a1a]/40" />
                </div>
                <p className="font-['Playfair_Display'] italic text-2xl mb-8">
                  Your Cart is Empty
                </p>
                <Link
                  href="/collections"
                  className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] sm:px-8 px-6 sm:py-4 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
                >
                  <span className="sm:text-base text-sm">Explore Collections</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
      {/* Header */}
      <section className="pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <AnimatedSection>
            <div className="flex sm:justify-between justify-center items-center">
              <p className="font-['Playfair_Display'] italic text-5xl mb-1">
                Your Cart
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cart Items & Summary */}
      <section className="pb-26 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="space-y-8">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#1a1a1a]/20 sm:p-6 p-4"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Item Image */}
                        <div className="md:w-32 md:h-32 w-full aspect-square">
                          <div className="relative w-full h-full overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.variantName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-light mb-1 sm:text-base text-sm">
                                {item.collectionName}
                              </p>
                              <p className="text-gray-500 sm:text-sm text-[11px] mb-1">
                                {item.variantName}
                              </p>
                              <p className="text-lg font-light">
                                PKR {item.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors duration-300 h-fit cursor-pointer"
                            >
                              <Trash2 className="sm:w-5 sm:h-5 w-4 h-4" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center border border-[#1a1a1a]/20">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="sm:p-3 p-2 hover:bg-[#1a1a1a]/5 transition-colors duration-300 disabled:opacity-30 cursor-pointer"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="sm:w-4 sm:h-4 w-3 h-3" />
                              </button>
                              <span className="sm:px-4 sm:py-3 px-3 py-2 min-w-[60px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="sm:p-3 p-2 hover:bg-[#1a1a1a]/5 transition-colors duration-300 disabled:opacity-30 cursor-pointer"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="sm:w-4 sm:h-4 w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-gray-500 sm:text-sm text-xs">
                              PKR{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Cart Actions */}
              <AnimatedText>
                <div className="flex flex-col sm:flex-row gap-4 mt-12">
                  <Link
                    href="/collections"
                    className="flex-1 group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 text-center"
                  >
                    <ArrowRight className="sm:w-5 sm:h-5 w-4 h-4 rotate-180" />
                    <span className="sm:text-base text-sm">Continue Exploring</span>
                  </Link>
                  <button
                    onClick={() => setItems([])}
                    className="flex-1 group inline-flex items-center justify-center gap-1.5 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-red-600 hover:text-red-600 transition-all duration-300 cursor-pointer"
                  >
                    <Trash2 className="sm:w-5 sm:h-5 w-4 h-4" />
                    <span className="sm:text-base text-sm">Clear All</span>
                  </button>
                </div>
              </AnimatedText>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <AnimatedSection>
                <div className="border border-[#1a1a1a]/20 p-6 sticky top-24">
                  <p className="font-['Playfair_Display'] italic text-xl mb-6">
                    Order Summary
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between sm:text-sm text-[12px]">
                      <span className="text-gray-500">Subtotal</span>
                      <span>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between sm:text-sm text-[12px]">
                      <span className="text-gray-500">Shipping</span>
                      <span>
                        {shipping === 0
                          ? "Free"
                          : `PKR ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="border-t border-[#1a1a1a]/20 pt-4">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="sm:text-lg text-base">
                          PKR {total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] sm:py-4 px-4 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                  >
                    <span className="sm:text-base text-sm">
                      {isProcessing ? "Processing" : "Proceed to Checkout"}
                    </span>
                  </button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}