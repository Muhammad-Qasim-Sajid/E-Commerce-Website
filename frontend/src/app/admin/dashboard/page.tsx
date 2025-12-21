'use client';

import { DollarSign, AlertTriangle, Calendar, Receipt, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'This Month Revenue',
      value: 'PKR 45,800',
      icon: Calendar,
      color: 'text-[#d4af37]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#d4af37]',
    },
    {
      title: 'Total Revenue',
      value: 'PKR 245,800',
      icon: DollarSign,
      color: 'text-[#d4af37]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#d4af37]',
    },
    {
      title: 'This Month Orders',
      value: '4',
      icon: ShoppingBag,
      color: 'text-[#1a1a1a]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#1a1a1a]',
    },
    {
      title: 'Total Orders',
      value: '89',
      icon: Receipt,
      color: 'text-[#1a1a1a]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#1a1a1a]',
    },
  ]

  const recentOrders = [
    { id: 'GW-2024-7890', customer: 'Alexander Rothschild', date: '15 Jan 2024', amount: 'PKR 12,500', items: 2, status: 'Delivered' },
    { id: 'GW-2024-7889', customer: 'Victoria Chen', date: '14 Jan 2024', amount: 'PKR 8,900', items: 1, status: 'Processing' },
    { id: 'GW-2024-7888', customer: 'James Vanderbilt', date: '13 Jan 2024', amount: 'PKR 21,500', items: 3, status: 'Shipped' },
    { id: 'GW-2024-7887', customer: 'Isabella Rossi', date: '12 Jan 2024', amount: 'PKR 7,500', items: 1, status: 'Delivered' },
  ]

  const topCollections = [
    { name: 'Grand Complication', sales: 14, revenue: 'PKR 284,000', variant: 'Masterpiece' },
    { name: 'Tourbillon Master', sales: 9, revenue: 'PKR 178,000', variant: 'Haute Horlogerie' },
    { name: 'Perpetual Calendar', sales: 7, revenue: 'PKR 201,000', variant: 'Complex' },
    { name: 'Minute Repeater', sales: 4, revenue: 'PKR 252,000', variant: 'Masterpiece' },
  ]

  const lowStockAlerts = [
    { collection: 'Chronograph Classic', variant: 'Rose Gold', remaining: 2, minRequired: 5 },
    { collection: 'Diver Professional', variant: 'Steel Blue', remaining: 3, minRequired: 6 },
    { collection: 'Heritage Limited', variant: 'Platinum', remaining: 1, minRequired: 3 },
  ]

  // PENDING ORDERS DATA
  const pendingOrders = [
    {
      _id: '1',
      customerName: 'Michael Johnson',
      customerEmail: 'm.johnson@email.com',
      customerPhone: '+923001234567',
      customerAddress: '123 Luxury Lane, DHA Phase 6, Karachi, Pakistan',
      items: [
        {
          productId: '1',
          variantId: '1',
          variantSnapshot: {
            name: 'Silver / Black',
            price: 1299.99,
            image: '/1.png'
          },
          quantity: 1,
          totalPrice: 1299.99
        }
      ],
      shippingPrice: 500,
      totalPrice: 1799.99,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      shippingTrackingNumber: '',
      trackingToken: 'GW-2024-7891',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      _id: '2',
      customerName: 'Sarah Williams',
      customerEmail: 's.williams@email.com',
      customerPhone: '+923001234568',
      customerAddress: '456 Business Street, Gulberg, Lahore, Pakistan',
      items: [
        {
          productId: '2',
          variantId: '2',
          variantSnapshot: {
            name: 'Rose Gold / Brown',
            price: 1399.99,
            image: '/2.png'
          },
          quantity: 2,
          totalPrice: 2799.98
        },
        {
          productId: '3',
          variantId: '3',
          variantSnapshot: {
            name: 'Stainless Steel / Blue',
            price: 899.99,
            image: '/3.png'
          },
          quantity: 1,
          totalPrice: 899.99
        }
      ],
      shippingPrice: 500,
      totalPrice: 4199.97,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      shippingTrackingNumber: '',
      trackingToken: 'GW-2024-7892',
      createdAt: '2024-01-19T14:20:00Z'
    },
    {
      _id: '3',
      customerName: 'Robert Chen',
      customerEmail: 'r.chen@email.com',
      customerPhone: '+923001234569',
      customerAddress: '789 Heritage Road, F-7, Islamabad, Pakistan',
      items: [
        {
          productId: '4',
          variantId: '4',
          variantSnapshot: {
            name: 'Platinum / Black',
            price: 2499.99,
            image: '/4.png'
          },
          quantity: 1,
          totalPrice: 2499.99
        }
      ],
      shippingPrice: 500,
      totalPrice: 2999.99,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      shippingTrackingNumber: '',
      trackingToken: 'GW-2024-7893',
      createdAt: '2024-01-18T09:15:00Z'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const getTotalItems = (items: any[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
          <p className="mb-6 font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight">Dashboard</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.title} 
              className={`${stat.accentColor} ${stat.bgColor} p-6`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#666666] uppercase mb-2">{stat.title}</p>
                  <p className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a1a] mb-1">{stat.value}</p>
                </div>
                <div>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders - Updated */}
          <div className="bg-white pb-3">
            <p className="px-6 py-5 font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">Recent Orders</p>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] lg:min-w-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9f7f3]">
                      <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Client</th>
                      <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Items</th>
                      <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Amount</th>
                      <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eae2d6]">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight">{order.customer}</p>
                            <p className="text-[10px] text-[#666666]">{order.date}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-sm text-[#1a1a1a] tracking-tight">
                            {order.items} item{order.items !== 1 ? 's' : ''}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-sm text-[#1a1a1a] tracking-tight">{order.amount}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 text-xs tracking-tight ${
                            order.status === 'Delivered' 
                              ? 'text-[#d4af37] border border-[#d4af37]'
                              : order.status === 'Confirmed'
                              ? 'text-blue-600 border border-blue-600'
                              : order.status === 'Shipped'
                              ? 'text-[#1a1a1a] border border-[#1a1a1a]'
                              : order.status === 'Cancelled'
                              ? 'text-red-600 border border-red-600'
                              : 'text-[#666666] border border-[#eae2d6]'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Top Collections */}
          <div className="bg-white pb-3">
            <div className="px-6 py-5 border-b border-[#eae2d6]">
                <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">Top Collections</p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] lg:min-w-0 p-6">
                <div className="space-y-6">
                  {topCollections.map((collection) => (
                    <div key={collection.name} className="flex items-center justify-between pb-4 border-b border-[#eae2d6] last:border-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">{collection.name}</p>
                          <span className="text-xs px-2 py-0.5 tracking-tight bg-[#f9f7f3] text-[#666666] border border-[#eae2d6]">
                            {collection.variant}
                          </span>
                        </div>
                        <p className="text-xs text-[#666666]">{collection.sales} pieces sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1a1a1a] tracking-tight">{collection.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PENDING ORDERS TABLE  */}
        {pendingOrders && <div className="mt-6 bg-white">
          <div className="px-6 py-5 border-b border-[#eae2d6] bg-[#f9f7f3]">
            <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">
              Pending Orders
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] lg:min-w-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f9f7f3]">
                    <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Client</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Items</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Date</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Amount</th>
                    <th className="px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae2d6]">
                  {pendingOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-[#666666] mt-1">
                            {order.customerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm text-[#1a1a1a] tracking-tight">
                          {getTotalItems(order.items)} item{getTotalItems(order.items) !== 1 ? 's' : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-xs text-[#1a1a1a] tracking-tight">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 text-xs tracking-tight ${
                          order.paymentStatus === 'Paid' 
                            ? 'text-green-600 border border-green-600'
                            : order.paymentStatus === 'Failed'
                            ? 'text-red-600 border border-red-600'
                            : 'text-[#666666] border border-[#eae2d6]'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>}

        {/* Low Stock Alerts */}
        <div className="mt-6 bg-white p-6">
            <p className="mb-6 font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">Low Stock Alerts</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className="border border-[#eae2d6] p-4">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-[#1a1a1a] mb-1.5 text-center tracking-tight">{alert.collection}</p>
                <p className="text-xs text-[#666666] mb-2 text-center tracking-tight">{alert.variant} variant</p>
                <p className="text-xs text-red-600 text-center">Only {alert.remaining} remaining</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}