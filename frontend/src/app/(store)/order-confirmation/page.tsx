"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
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

const orderData = {
  orderId: "ORDER123456789",
  customerName: "Ahmed Khan",
  totalPrice: 23498,
  paymentStatus: "Paid",
  orderStatus: "Confirmed",
  estimatedDelivery: "5-7 business days"
};

export default function OrderConfirmation() {
  const [order] = useState(orderData);
  const orderDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
      <section className="pb-26 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-4">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-[#d4af37]" />
              </div>
              <p className="font-['Playfair_Display'] italic text-5xl mb-6">
                  Order Confirmed
              </p>
              <p className="font-['Playfair_Display'] text-[#d4af37] mb-10">
                  Your order has been confirmed. We have sent you a confirmation email too.
              </p>
              <div className="space-y-6 mb-12">
                <div className="border border-[#1a1a1a]/20 sm:p-6 p-3 max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between sm:text-sm text-[10px]">
                      <span className="text-gray-500">Order ID</span>
                      <span>{order.orderId}</span>
                    </div>
                    <div className="flex justify-between sm:text-sm text-[10px]">
                      <span className="text-gray-500">Order Date</span>
                      <span>{orderDate}</span>
                    </div>
                    <div className="flex justify-between sm:text-sm text-[10px]">
                      <span className="text-gray-500">Order Total</span>
                      <span>PKR {order.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between sm:text-sm text-[10px]">
                      <span className="text-gray-500">Status</span>
                      <span>{order.orderStatus}</span>
                    </div>
                    <div className="flex justify-between sm:text-sm text-[10px]">
                      <span className="text-gray-500">Estimated Delivery</span>
                      <span>{order.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/order-tracking"
                  className="group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
                >
                  <span>Track Your Order</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link
                  href="/collections"
                  className="group inline-flex items-center justify-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
                >
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}