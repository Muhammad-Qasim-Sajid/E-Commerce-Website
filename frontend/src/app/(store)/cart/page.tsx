"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart } from "lucide-react";
import { getCart, removeFromCart, clearCart } from '../../../lib/utils';
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

interface CartProduct {
  _id: string;
  name: string;
  variants: Array<{
    _id: string;
    variantName: string;
    variantImage: string;
    variantPrice: number;
    variantPreviousPrice?: number;
    variantOrder: number;
    variantStock: number;
  }>;
}

interface CartItemDisplay {
  id: string;
  productId: string;
  variantId: string;
  collectionName: string;
  variantName: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [updatingQuantities, setUpdatingQuantities] = useState<Set<string>>(new Set());
  const [shippingPrice, setShippingPrice] = useState(0);

  useEffect(() => {
    fetchCartData();

    const handleCartUpdate = () => {
      fetchCartData();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const loadShippingPrice = async () => {
      try {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping-price/get`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load shipping price');
        }

        const data = await response.json();

        if (data.success && data.data) {
          setShippingPrice(data.data.shippingPrice);
        }
      } catch (error) {
        console.error('Error loading shipping price:', error); // Debug log
        setError("Something went wrong. Try Again");
      }
    };

    loadShippingPrice();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cart = getCart();
      
      if (cart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const productIds = [...new Set(cart.map(item => item.productId))];

      const productsResponse = await productsApi.getProductsByIds(productIds);

      if (!productsResponse.success) {
        throw new Error(productsResponse.message || 'Failed to fetch products');
      }

      const products: CartProduct[] = productsResponse.data;

      const cartItemsData: CartItemDisplay[] = cart.map(cartItem => {
        const product = products.find(p => p._id === cartItem.productId);

        if (!product) {
          throw new Error(`Product ${cartItem.productId} not found`);
        }

        const variant = product.variants.find(v => v._id === cartItem.variantId);

        if (!variant) {
          throw new Error(`Variant ${cartItem.variantId} not found in product ${product._id}`);
        }

        return {
          id: `${cartItem.productId}-${cartItem.variantId}`,
          productId: cartItem.productId,
          variantId: cartItem.variantId,
          collectionName: product.name,
          variantName: variant.variantName,
          image: variant.variantImage,
          price: variant.variantPrice,
          quantity: cartItem.quantity,
          stock: variant.variantStock
        };
      });

      setCartItems(cartItemsData);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(item => item.productId === productId && item.variantId === variantId);
    if (item && newQuantity > item.stock) return;

    const itemId = `${productId}-${variantId}`;
    setUpdatingQuantities(prev => new Set(prev).add(itemId));

    try {
      removeFromCart(productId, variantId);

      const cart = getCart();
      const existingItemIndex = cart.findIndex(item => 
        item.productId === productId && item.variantId === variantId
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity = newQuantity;
      } else {
        cart.push({
          productId,
          variantId,
          quantity: newQuantity
        });
      }

      localStorage.setItem('greatness-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));

      setCartItems(prev => 
        prev.map(item => 
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error); // Debug log
    } finally {
      setUpdatingQuantities(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = (productId: string, variantId: string) => {
    removeFromCart(productId, variantId);
    setCartItems(prev => 
      prev.filter(item => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingPrice;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Proceeding to checkout...");
      setIsProcessing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error ) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={fetchCartData}
            className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
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
                  {cartItems.map((item) => {
                    const itemId = `${item.productId}-${item.variantId}`;
                    const isUpdating = updatingQuantities.has(itemId);
                    
                    return (
                      <div
                        key={itemId}
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
                                onClick={() => removeItem(item.productId, item.variantId)}
                                className="text-gray-400 hover:text-red-600 transition-colors duration-300 h-fit cursor-pointer"
                                disabled={isUpdating}
                              >
                                <Trash2 className="sm:w-5 sm:h-5 w-4 h-4" />
                              </button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-6">
                              <div className="flex items-center border border-[#1a1a1a]/20">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.variantId, item.quantity - 1)
                                  }
                                  className="sm:p-3 p-2 hover:bg-[#1a1a1a]/5 transition-colors duration-300 disabled:opacity-30 cursor-pointer"
                                  disabled={item.quantity <= 1 || isUpdating}
                                >
                                  <Minus className="sm:w-4 sm:h-4 w-3 h-3" />
                                </button>
                                <span className="sm:px-4 sm:py-3 px-3 py-2 min-w-[60px] text-center">
                                  {isUpdating ? '...' : item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.variantId, item.quantity + 1)
                                  }
                                  className="sm:p-3 p-2 hover:bg-[#1a1a1a]/5 transition-colors duration-300 disabled:opacity-30 cursor-pointer"
                                  disabled={item.quantity >= item.stock || isUpdating}
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
                    );
                  })}
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
                    onClick={handleClearCart}
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
                      <span>`PKR {shippingPrice.toLocaleString()}</span>
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