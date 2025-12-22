'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, Mail, Phone, MapPin, Package, Truck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { orderApi } from '../../../../lib/api/orderAPIs';
import Spinner from '../../../../components/Spinner';

export interface OrderItem {
  productId: string;
  variantId: string;
  variantSnapshot: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  totalPrice: number;
  product?: {
    name: string;
  };
}

export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  shippingPrice: number;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingTrackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await orderApi.getOrder(orderId);
      
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Failed to load order');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#eeeceb]">
        <div className="p-4 pb-8">
          <div className="bg-white p-8 text-center">
            <p className="text-red-600 mb-2">{error || 'Order not found'}</p>
            <button
              onClick={fetchOrder}
              className="px-4 py-2 bg-[#1a1a1a] text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="sm:p-4 p-0 pb-8">
        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2 break-all">
                Order <span className='italic'>#{order._id}</span>
              </p>
              <div className="flex items-center gap-2 text-[#666666]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center px-4 py-2 text-xs tracking-tight ${
                order.paymentStatus === 'Paid' 
                  ? 'text-green-600 border border-green-600'
                  : order.paymentStatus === 'Failed'
                  ? 'text-red-600 border border-red-600'
                  : 'text-[#666666] border border-[#eae2d6]'
              }`}>
                Payment: {order.paymentStatus}
              </span>
              <span className={`inline-flex items-center px-4 py-2 text-xs tracking-tight ${
                order.orderStatus === 'Delivered' 
                  ? 'text-[#d4af37] border border-[#d4af37]'
                  : order.orderStatus === 'Confirmed'
                  ? 'text-blue-600 border border-blue-600'
                  : order.orderStatus === 'Shipped'
                  ? 'text-[#1a1a1a] border border-[#1a1a1a]'
                  : order.orderStatus === 'Cancelled'
                  ? 'text-red-600 border border-red-600'
                  : 'text-[#666666] border border-[#eae2d6]'
              }`}>
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-[#eae2d6]">
              <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                  Order Items
                </p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto -mx-6 px-6 pb-6 sm:mx-0 sm:px-0 sm:overflow-visible">
                  <div className="min-w-[600px] sm:min-w-0">
                    <div className="space-y-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 pb-6 border-b border-[#eae2d6] last:border-0 last:pb-0">
                          <div className="w-24 h-24 bg-[#eeeceb] overflow-hidden border border-[#eae2d6] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.variantSnapshot.image}
                              alt={item.product?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 mt-1">
                            <div>
                              <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-sm text-[#666666] mt-1">{item.variantSnapshot.name}</p>
                              <div className="mt-2">
                                <div className="text-sm text-[#666666]">
                                  Quantity: <span className="text-[#1a1a1a] font-medium">{item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <div className="mb-4">
                              <p className="text-sm text-[#666666] -mb-0.1">Unit Price</p>
                              <p className="font-['Playfair_Display'] text-[#1a1a1a]">
                                {formatPrice(item.variantSnapshot.price)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-[#666666] -mb-0.1">Item Total</p>
                              <p className="font-['Playfair_Display'] text-lg text-[#1a1a1a]">
                                {formatPrice(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white border border-[#eae2d6]">
              <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                  Customer Information
                </p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                        <User className="w-4 h-4 text-[#666666]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#666666]">Name</p>
                        <p className="text-sm text-[#1a1a1a] tracking-tight leading-tight">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                        <Mail className="w-4 h-4 text-[#666666]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#666666]">Email</p>
                        <p className="text-sm text-[#1a1a1a] tracking-tight leading-tight">{order.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                        <Phone className="w-4 h-4 text-[#666666]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#666666]">Phone</p>
                        <p className="text-sm text-[#1a1a1a] tracking-tight leading-tight">{order.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                      <MapPin className="w-4 h-4 text-[#666666]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#666666] mb-1">Shipping Address</p>
                      <p className="text-sm text-[#1a1a1a] tracking-tight leading-tight">
                        {order.customerAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-[#eae2d6]">
              <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                  Order Summary
                </p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto space-y-3 text-sm">
                  <div className="flex justify-between text-[#666666]">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.items.reduce((sum, item) => sum + item.totalPrice, 0))}</span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shippingPrice)}</span>
                  </div>
                  <div className="pt-3 border-t border-[#eae2d6]">
                    <div className="flex justify-between items-center">
                      <span className="font-['Playfair_Display'] text-base text-[#1a1a1a]">Total</span>
                      <span className="font-['Playfair_Display'] text-lg text-[#1a1a1a]">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border border-[#eae2d6]">
              <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
                  Shipping Information
                </p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto space-y-4">
                  {order.shippingTrackingNumber ? (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2 rounded">
                        <Truck className="w-4 h-4 text-[#666666]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#666666] mb-0.5">Tracking Number</p>
                        <p className="text-sm text-[#1a1a1a] tracking-tight leading-tight">{order.shippingTrackingNumber}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2 rounded">
                        <Package className="w-4 h-4 text-[#666666]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#666666]">Status</p>
                        <p className="text-sm text-[#1a1a1a] tracking-tight leading-tight">Preparing for shipment</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}