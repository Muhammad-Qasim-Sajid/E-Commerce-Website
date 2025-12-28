"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";
import { getCart, clearCart } from '../../../lib/utils';
import { orderApi } from '../../../lib/api/orderAPIs';
import { productsApi } from '../../../lib/api/productsAPIs';
import Spinner from '../../../components/Spinner';

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

interface Variant {
  variantName: string;
  variantImage: string;
  variantPrice: number;
  variantPreviousPrice?: number;
  variantOrder: number;
  variantStock: number;
  _id: string;
}
interface Product {
  _id: string;
  name: string;
  variants: Variant[];
  smallDescription: string;
  longDescription: string;
  featuredProduct: boolean;
}
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export default function Checkout() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const cart = getCart();
        if (cart.length === 0) {
          setError("Your cart is empty. Please add items to proceed.");
          setLoading(false);
          return;
        }
        
        setCartItems(cart);

        try {
          const shippingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping-price/get`, {
            credentials: 'include',
          });

          if (shippingResponse.ok) {
            const shippingData = await shippingResponse.json();
            if (shippingData.success && shippingData.data) {
              const shippingPrice = shippingData.data.shippingPrice;
              await calculateTotal(cart, shippingPrice);
            }
          }
        } catch (shippingError) {
          console.error('Error loading shipping price:', shippingError); // Debug log
          setError("Something went wrong");
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateTotal = async (cart: CartItem[], shipping: number) => {
    try {
      if (cart.length === 0) {
        setTotal(0);
        return;
      }

      const productIds = [...new Set(cart.map(item => item.productId))];
      const productsResponse = await productsApi.getProductsByIds(productIds);

      if (!productsResponse.success) {
        throw new Error(productsResponse.message || 'Failed to fetch products');
      }

      const products = productsResponse.data;

      let subtotal = 0;
      cart.forEach(cartItem => {
        const product = products.find((p: Product) => p._id === cartItem.productId);
        if (product) {
          const variant = product.variants.find((v: Variant) => v._id === cartItem.variantId);
          if (variant) {
            subtotal += variant.variantPrice * cartItem.quantity;
          }
        }
      });

      const calculatedTotal = subtotal + shipping;
      setTotal(calculatedTotal);
    } catch (error) {
      console.error('Error calculating total:', error); // Debug log
      setTotal(0);
    }
  };

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
    
    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        }))
      };

      const response = await orderApi.placeOrder(orderData);
      
      if (response.success) {
        clearCart();
        
        alert("Order placed successfully! A confirmation email has been sent with your order details and tracking information.");

        router.push("/");
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
        <section className="pb-26 pt-14">
          <div className="container mx-auto lg:px-40 sm:px-20 px-10">
            <div className="text-center py-24">
              <div className="w-20 h-20 border border-[#1a1a1a]/20 flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-[#1a1a1a]/40" />
              </div>
              <p className="font-['Playfair_Display'] italic text-2xl mb-8">
                {error}
              </p>
              <button
                onClick={() => router.push("/collections")}
                className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] sm:px-8 px-6 sm:py-4 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 cursor-pointer"
              >
                <span className="sm:text-base text-sm">Explore Collections</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
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
                Checkout
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto lg:px-40 sm:px-20 px-10 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm">
            {error}
          </div>
        </div>
      )}

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
                            disabled={isProcessing}
                            className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={isProcessing}
                              className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={isProcessing}
                              className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={isProcessing}
                            className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Right Column - Order Total */}
              <div className="w-full max-w-md mx-auto">
                <AnimatedSection>
                  <div className="border border-[#1a1a1a]/20 p-6 sticky top-24">
                    <p className="font-['Playfair_Display'] italic text-2xl text-center mb-4">
                      Order Total
                    </p>
                    <p className="text-center text-2xl font-semibold tracking-tight mb-6">
                      PKR {total.toLocaleString()}
                    </p>

                    {/* Submit */}
                    <AnimatedText>
                      <div className="flex flex-col gap-4">
                        <button
                          type="submit"
                          disabled={isProcessing || cartItems.length === 0}
                          className="w-full flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] py-3 sm:py-4 px-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                        >
                          <span className="sm:text-sm text-xs">
                            {isProcessing ? "Processing..." : "Complete Purchase"}
                          </span>
                          <ArrowRight className="sm:w-5 sm:h-5 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>

                        <p className="text-center text-gray-500 text-xs mt-2">
                          You will be redirected to JazzCash for secure payment
                        </p>
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