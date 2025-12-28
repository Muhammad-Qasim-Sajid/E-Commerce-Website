'use client';

import { useState, useEffect } from 'react';
import { Truck, CreditCard, Package } from 'lucide-react';
import { useParams } from 'next/navigation';
import { orderApi } from '../../../../../lib/api/orderAPIs';

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

type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  shippingPrice: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingTrackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderEdit() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState({
    orderStatus: false,
    paymentStatus: false,
    shippingTracking: false
  });

  const orderStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const paymentStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Failed', label: 'Failed' }
  ];

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

  const handleSaveOrderStatus = async () => {
    if (!order) return;
    try {
      setSaving({ ...saving, orderStatus: true });
      const data = await orderApi.updateOrderStatus(order._id, order.orderStatus);
      if (data.success) {
        alert('Order status updated successfully');
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Failed to update order status');
    } finally {
      setSaving({ ...saving, orderStatus: false });
    }
  };

  const handleSavePaymentStatus = async () => {
    if (!order) return;
    try {
      setSaving({ ...saving, paymentStatus: true });
      const data = await orderApi.updatePaymentStatus(order._id, order.paymentStatus);
      if (data.success) {
        alert('Payment status updated successfully');
      } else {
        alert(data.message || 'Failed to update payment status');
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Failed to update payment status');
    } finally {
      setSaving({ ...saving, paymentStatus: false });
    }
  };

  const handleSaveShippingTracking = async () => {
    if (!order) return;
    try {
      setSaving({ ...saving, shippingTracking: true });
      const data = await orderApi.updateShippingTracking(
        order._id, 
        order.shippingTrackingNumber || ''
      );
      if (data.success) {
        alert('Shipping tracking updated successfully');
      } else {
        alert(data.message || 'Failed to update shipping tracking');
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Failed to update shipping tracking');
    } finally {
      setSaving({ ...saving, shippingTracking: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
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
              className="px-4 py-2 bg-[#1a1a1a] text-white hover:opacity-90 transition-opacity cursor-pointer mr-2"
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
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2 break-all">
                Edit Order <span className='italic'>#{order._id}</span>
              </p>
              <div className="text-[#666666] text-xl italic tracking-tight font-['Playfair_Display']">
                {order.customerName}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Status Section */}
          <div className="bg-white border border-[#eae2d6]">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                    <Package className="w-4 h-4 text-[#666666]" />
                  </div>
                  <div>
                    <p className="font-['Playfair_Display'] sm:text-xl text-lg tracking-tight text-[#1a1a1a]">
                      Order Status
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => setOrder({...order, orderStatus: e.target.value as OrderStatus})}
                    className="sm:text-base text-sm w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none"
                  >
                    {orderStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSaveOrderStatus}
                  disabled={saving.orderStatus}
                  className="flex items-center gap-2 px-6 py-3 sm:text-sm text-xs bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving.orderStatus ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Status Section */}
          <div className="bg-white border border-[#eae2d6]">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                    <CreditCard className="w-4 h-4 text-[#666666]" />
                  </div>
                  <div>
                    <p className="font-['Playfair_Display'] sm:text-xl text-lg tracking-tight text-[#1a1a1a]">
                      Payment Status
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => setOrder({...order, paymentStatus: e.target.value as PaymentStatus})}
                    className="sm:text-base text-sm w-full border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none"
                  >
                    {paymentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSavePaymentStatus}
                  disabled={saving.paymentStatus}
                  className="flex items-center gap-2 px-6 py-3 sm:text-sm text-xs bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving.paymentStatus ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Tracking Section */}
          <div className="bg-white border border-[#eae2d6]">
            <div className="p-6 border-b border-[#eae2d6] bg-[#f9f7f3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f9f7f3] border border-[#eae2d6] p-2">
                    <Truck className="w-4 h-4 text-[#666666]" />
                  </div>
                  <div>
                    <p className="font-['Playfair_Display'] sm:text-xl text-lg leading-tight tracking-tight text-[#1a1a1a]">
                      Shipping Tracking Number
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    value={order.shippingTrackingNumber || ''}
                    onChange={(e) => setOrder({...order, shippingTrackingNumber: e.target.value})}
                    className="w-full sm:text-base text-sm border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors"
                    placeholder="Enter tracking number"
                  />
                </div>
                <button
                  onClick={handleSaveShippingTracking}
                  disabled={saving.shippingTracking}
                  className="flex items-center gap-2 px-6 py-3 sm:text-sm text-xs bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving.shippingTracking ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}