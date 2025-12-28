"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Package, Truck, CheckCircle, MapPin, User } from "lucide-react";

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

interface OrderItem {
  productId: string;
  variantId: string;
  variantSnapshot: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  totalPrice: number;
}

interface OrderTrackingData {
  orderId: string;
  customerName: string;
  customerAddress: string;
  items: OrderItem[];
  shippingPrice: number;
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
  shippingTrackingNumber: string | null;
  createdAt: string;
}

export default function OrderTracking() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = searchParams.get("token");

        if (!token) {
          setError("No tracking token provided");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/track-order?token=${token}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order");
        }

        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch order");
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to load order tracking information");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
        <section className="pb-26 pt-0">
          <div className="container mx-auto lg:px-40 sm:px-20 px-10">
            <div className="text-center py-24">
              <div className="w-20 h-20 border border-[#1a1a1a]/20 flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8 text-[#1a1a1a]/40" />
              </div>
              <p className="font-['Playfair_Display'] italic text-2xl mb-8">
                {error || "Order not found"}
              </p>
              <Link
                href="/"
                className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] sm:px-8 px-6 sm:py-4 py-3 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
              >
                <span className="sm:text-base text-sm">Return to Home</span>
              </Link>
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
            <div className="flex sm:justify-between justify-center items-center mb-14">
              <div className="flex items-center gap-4">
                <p className="font-['Playfair_Display'] italic sm:text-5xl text-4xl">
                  Track Your Order
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-26 pt-0">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <div className="grid grid-cols-1 gap-12 lg:gap-20">
            {/* Left Column - Order Status & Items */}
            <div className="lg:col-span-2 space-y-12">
              <AnimatedSection>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-[#d4af37]" />
                    <p className="font-['Playfair_Display'] italic sm:text-2xl text-xl">
                      Order Status
                    </p>
                  </div>
                </div>

                <div className="border border-[#1a1a1a]/20 sm:p-6 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`sm:w-12 sm:h-12 w-10 h-10 rounded-full flex items-center justify-center ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-600"
                            : order.orderStatus === "Cancelled"
                            ? "bg-red-600"
                            : "bg-[#d4af37]"
                        }`}
                      >
                        {order.orderStatus === "Delivered" ? (
                          <CheckCircle className="sm:w-6 sm:h-6 w-5 h-5 text-white" />
                        ) : order.orderStatus === "Cancelled" ? (
                          <div className="text-white font-bold">X</div>
                        ) : (
                          <Package className="sm:w-6 sm:h-6 w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-light sm:text-xl text-lg">
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-light sm:text-lg text-base">
                        PKR {order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-gray-500 sm:text-sm text-xs">
                        Order Total
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Order Items */}
              <AnimatedSection>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-[#d4af37]" />
                    <p className="font-['Playfair_Display'] italic sm:text-2xl text-xl">
                      Order Details
                    </p>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <AnimatedText key={`${item.productId}-${item.variantId}`}>
                        <div className="border border-[#1a1a1a]/20 sm:p-6 p-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="sm:w-20 sm:h-20 w-16 h-16 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.variantSnapshot.image}
                                alt={item.variantSnapshot.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-light sm:text-sm mb-1">
                                {item.variantSnapshot.name}
                              </p>
                              <p className="font-light sm:text-sm mb-1">
                                Quantity: {item.quantity}
                              </p>
                              <p className="font-light sm:text-sm">
                                PKR {item.totalPrice.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AnimatedText>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column - Summary & Info */}
            <div>
              <AnimatedSection>
                <div className="border border-[#1a1a1a]/20 sm:p-6 p-4 sticky top-24">
                  {/* Order Info */}
                  <div className="space-y-6 mb-8">
                    <div>
                      <p className="font-['Playfair_Display'] italic sm:text-xl text-lg mb-4">
                        Order Information
                      </p>
                      <div className="space-y-4">
                        <div className="flex justify-between sm:text-sm text-xs">
                          <span className="text-gray-500">Order ID</span>
                          <span className="text-xs">{order.orderId}</span>
                        </div>
                        <div className="flex justify-between sm:text-sm text-xs">
                          <span className="text-gray-500">Payment</span>
                          <span className="text-xs">{order.paymentStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.shippingTrackingNumber && (
                      <div className="border-t border-[#1a1a1a]/20 pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Truck className="sm:w-5 sm:h-5 w-4 h-4 text-[#d4af37]" />
                          <p className="font-light sm:text-base text-sm">
                            Tracking Number
                          </p>
                        </div>
                        <p className="text-gray-500 sm:text-sm text-xs mb-2">
                          {order.shippingTrackingNumber}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Use this number to track your shipment.
                        </p>
                      </div>
                    )}

                    {/* Shipping Info */}
                    <div className="border-t border-[#1a1a1a]/20 pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="sm:w-5 sm:h-5 w-4 h-4 text-[#d4af37]" />
                        <p className="font-light sm:text-base text-sm">
                          Shipping Address
                        </p>
                      </div>
                      <p className="text-gray-500 sm:text-sm text-xs">
                        {order.customerAddress}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t border-[#1a1a1a]/20 pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="sm:w-4 sm:h-4 w-3 h-3 text-gray-400" />
                          <p className="text-gray-500 sm:text-sm text-xs">
                            {order.customerName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-[#1a1a1a]/20 pt-6">
                    <p className="font-light sm:text-base text-sm mb-4">
                      Order Summary
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Items Total</span>
                        <span>
                          PKR{" "}
                          {(
                            order.totalPrice - order.shippingPrice
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Shipping</span>
                        <span>PKR {order.shippingPrice.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-[#1a1a1a]/20 pt-3">
                        <div className="flex justify-between">
                          <span className="text-xs mt-1">Total</span>
                          <span className="sm:text-sm text-xs">
                            PKR {order.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Link */}
                  <div className="border-t border-[#1a1a1a]/20 pt-6 mt-6">
                    <p className="text-gray-500 sm:text-sm text-xs mb-3">
                      Need help with your order?
                    </p>
                    <Link
                      href="/contact"
                      className="sm:text-sm text-xs hover:text-[#d4af37] transition-colors duration-300"
                    >
                      Contact Support →
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}