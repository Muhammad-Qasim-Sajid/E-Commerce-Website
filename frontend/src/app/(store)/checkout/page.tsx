"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";

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
    collectionName: "Legacy Series 1895",
    variantName: "Rose Gold & Black Dial",
    price: 12999,
    quantity: 1,
  },
  {
    id: 2,
    collectionName: "Horizon Collection",
    variantName: "Silver Dial Steel",
    price: 8999,
    quantity: 1,
  },
];

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Pakistan",
    postalCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Redirecting to JazzCash payment gateway...");
    setIsProcessing(false);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 1500;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
      {/* Header */}
      <section className="pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <AnimatedSection>
            <div className="flex sm:justify-between justify-center items-center">
              <p className="font-['Playfair_Display'] italic text-5xl mb-1">
                Checkout
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Checkout Form & Summary */}
      <section className="pb-26 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
              {/* Left Column - Contact & Shipping */}
              <div className="lg:col-span-2 space-y-12">
                {/* Contact Information */}
                <AnimatedSection>
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-px bg-[#d4af37]" />
                      <p className="font-['Playfair_Display'] italic text-2xl">
                        Contact Information
                      </p>
                    </div>

                    <div className="space-y-6">
                      <AnimatedText>
                        <div>
                          <label className="block text-xs mb-0.5 ml-0.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm"
                            placeholder="Your full name"
                          />
                        </div>
                      </AnimatedText>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatedText>
                          <div>
                            <label className="block text-xs mb-0.5 ml-0.5">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm"
                              placeholder="your@email.com"
                            />
                          </div>
                        </AnimatedText>

                        <AnimatedText>
                          <div>
                            <label className="block text-xs mb-0.5 ml-0.5">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm"
                              placeholder="+92 300 1234567"
                            />
                          </div>
                        </AnimatedText>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Shipping Address */}
                <AnimatedSection>
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-px bg-[#d4af37]" />
                      <p className="font-['Playfair_Display'] italic text-2xl">
                        Shipping Address
                      </p>
                    </div>

                    <div className="space-y-6">
                      <AnimatedText>
                        <div>
                          <label className="block text-xs mb-0.5 ml-0.5">
                            Complete Address *
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 resize-none text-sm"
                            placeholder="House no 11, Phase 1 Shadman town Sahiwal, Tehsil & DIstrict Sahiwal, Punjab - Pakistan"
                          />
                        </div>
                      </AnimatedText>
                    </div>
                  </div>
                </AnimatedSection>

                {/* JazzCash Payment Section */}
                <AnimatedSection>
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-px bg-[#d4af37]" />
                      <p className="font-['Playfair_Display'] italic text-2xl">
                        Payment Method
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* JazzCash Option */}
                      <AnimatedText>
                        <div className="border border-[#1a1a1a]/20 p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-[#d4af37]/10 flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-[#d4af37]" />
                            </div>
                            <div>
                              <p className="font-light">JazzCash</p>
                              <p className="text-gray-500 text-xs">Pay via JazzCash Wallet</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10">
                              <p className="text-sm font-light mb-2">How to pay with JazzCash:</p>
                              <ol className="text-[11px] text-gray-500 space-y-1.5">
                                <li>{`1. Click "Complete Purchase" below`}</li>
                                <li>2. You will be redirected to JazzCash payment gateway</li>
                                <li>3. Enter your JazzCash account details</li>
                                <li>4. Confirm the payment</li>
                                <li>5. You will be redirected back with payment confirmation</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </AnimatedText>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right Column - Order Summary */}
              <div>
                <AnimatedSection>
                  <div className="border border-[#1a1a1a]/20 p-6 pb-8 sticky top-24">
                    <p className="font-['Playfair_Display'] italic text-xl mb-6">
                      Order Summary
                    </p>

                    {/* Order Items */}
                    <div className="space-y-4 mb-8">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <p className="font-light text-xs">{item.collectionName}</p>
                            <p className="text-gray-500 text-[10px]">{item.variantName}</p>
                            <p className="text-gray-500 text-[10px]">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-[11px]">PKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}

                      <div className="border-t border-[#1a1a1a]/20 pt-4 space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Subtotal</span>
                          <span>PKR {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Shipping</span>
                          <span>
                            {shipping === 0
                              ? "Free"
                              : `PKR ${shipping.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="border-t border-[#1a1a1a]/20 pt-4">
                          <div className="flex justify-between">
                            <span className="text-sm">Total</span>
                            <span className="">PKR {total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <AnimatedText>
                      <div className="space-y-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] sm:py-4 px-4 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                        >
                          <span className="sm:text-sm text-xs">
                            {isProcessing ? "Processing..." : "Complete Purchase"}
                          </span>
                          <ArrowRight className="sm:w-5 sm:h-5 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                        
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mt-4">
                            You will be redirected to JazzCash for secure payment
                          </p>
                        </div>
                      </div>
                    </AnimatedText>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}