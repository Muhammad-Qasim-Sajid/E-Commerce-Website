'use client';

import { useState } from 'react';
import { Truck, CreditCard, Package } from 'lucide-react';

export default function OrderEdit() {
  
  const [order, setOrder] = useState({
    _id: '1',
    customerName: 'Alexander Rothschild',
    orderStatus: 'Processing',
    paymentStatus: 'Paid',
    shippingTrackingNumber: 'TRK123456789',
    trackingToken: 'GW-2024-7890',
    totalPrice: 3199.98,
    createdAt: '2024-01-15T10:30:00Z'
  });

  const [saving, setSaving] = useState({
    orderStatus: false,
    paymentStatus: false,
    shippingTracking: false
  });

  // Order status options
  const orderStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Refunded', label: 'Refunded' }
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Refunded', label: 'Refunded' },
    { value: 'Partially Refunded', label: 'Partially Refunded' }
  ];

  const handleSaveOrderStatus = () => {
    setSaving({ ...saving, orderStatus: true });
    // Add your API call here
    setTimeout(() => {
      setSaving({ ...saving, orderStatus: false });
    }, 1000);
  };

  const handleSavePaymentStatus = () => {
    setSaving({ ...saving, paymentStatus: true });
    // Add your API call here
    setTimeout(() => {
      setSaving({ ...saving, paymentStatus: false });
    }, 1000);
  };

  const handleSaveShippingTracking = () => {
    setSaving({ ...saving, shippingTracking: true });
    // Add your API call here
    setTimeout(() => {
      setSaving({ ...saving, shippingTracking: false });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight mb-2">
                Edit Order #{order._id}
              </p>
              <div className="text-[#666666]">
                <span className="text-sm">Client: {order.customerName}</span>
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
                    onChange={(e) => setOrder({...order, orderStatus: e.target.value})}
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
                  className="flex items-center gap-2 px-6 py-3 sm:text-sm text-xs bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onChange={(e) => setOrder({...order, paymentStatus: e.target.value})}
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
                  className="flex items-center gap-2 px-6 py-3 sm:text-sm text-xs bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    value={order.shippingTrackingNumber}
                    onChange={(e) => setOrder({...order, shippingTrackingNumber: e.target.value})}
                    className="w-full sm:text-base text-sm border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors"
                    placeholder="Enter tracking number"
                  />
                </div>
                <button
                onClick={handleSaveShippingTracking}
                disabled={saving.shippingTracking}
                className="flex items-center gap-2 px-6 py-3 sm:text-sm text-xs bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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