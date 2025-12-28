'use client';

import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, Calendar, Receipt, ShoppingBag } from 'lucide-react';
import { getCsrfToken } from '../../../lib/utils';

interface DashboardData {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    ordersThisMonth: number;
    revenueThisMonth: number;
  };
  recentOrders: Array<{
    _id: string;
    customer: string;
    date: string;
    items: number;
    amount: number;
    status: string;
    paymentStatus: string;
  }>;
  topCollections: Array<{
    productId: string;
    name: string;
    variant: string;
    image: string;
    sales: number;
    revenue: number;
  }>;
  pendingOrders: Array<{
    _id: string;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    items: number;
    totalPrice: number;
    paymentStatus: string;
  }>;
  lowStockAlerts: Array<{
    productId: string;
    collection: string;
    variant: string;
    image: string;
    remaining: number;
  }>;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const csrfToken = getCsrfToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/get`, {
          credentials: 'include',
          headers: csrfToken ? { 'x-csrf-token': csrfToken } : {}
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setDashboardData(data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error); // Debug log
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-[#d4af37] border border-[#d4af37]';
      case 'Confirmed':
      case 'Processing':
        return 'text-blue-600 border border-blue-600';
      case 'Shipped':
        return 'text-[#1a1a1a] border border-[#1a1a1a]';
      case 'Cancelled':
        return 'text-red-600 border border-red-600';
      default:
        return 'text-[#666666] border border-[#eae2d6]';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600 border border-green-600';
      case 'Failed':
        return 'text-red-600 border border-red-600';
      default:
        return 'text-[#666666] border border-[#eae2d6]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="flex flex-col items-center animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#eeeceb] flex items-center justify-center">
        <p className="text-[#1a1a1a] font-['Playfair_Display'] italic text-3xl tracking-tight">No data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'This Month Revenue',
      value: formatPrice(dashboardData.stats.revenueThisMonth),
      icon: Calendar,
      color: 'text-[#d4af37]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#d4af37]',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(dashboardData.stats.totalRevenue),
      icon: DollarSign,
      color: 'text-[#d4af37]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#d4af37]',
    },
    {
      title: 'This Month Orders',
      value: dashboardData.stats.ordersThisMonth.toString(),
      icon: ShoppingBag,
      color: 'text-[#1a1a1a]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#1a1a1a]',
    },
    {
      title: 'Total Orders',
      value: dashboardData.stats.totalOrders.toString(),
      icon: Receipt,
      color: 'text-[#1a1a1a]',
      bgColor: 'bg-white',
      accentColor: 'border-l-3 border-[#1a1a1a]',
    },
  ];

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
          {/* Recent Orders */}
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
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order._id}>
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
                          <p className="text-sm text-[#1a1a1a] tracking-tight">{formatPrice(order.amount)}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 text-xs tracking-tight ${getStatusColor(order.status)}`}>
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
              <p className="font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">Top Collections <span className='text-xs tracking-normal'>(Paid)</span> </p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] lg:min-w-0 p-6">
                <div className="space-y-6">
                  {dashboardData.topCollections.map((collection) => (
                    <div key={collection.productId} className="flex items-center justify-between pb-4 border-b border-[#eae2d6] last:border-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">{collection.name}</p>
                        </div>
                        <p className="text-xs text-[#666666]">{collection.sales} pieces sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1a1a1a] tracking-tight">{formatPrice(collection.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PENDING ORDERS TABLE */}
        {dashboardData.pendingOrders.length > 0 && (
          <div className="mt-6 bg-white">
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
                    {dashboardData.pendingOrders.map((order) => (
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
                            {order.items} item{order.items !== 1 ? 's' : ''}
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
                          <span className={`inline-flex items-center px-3 py-1 text-xs tracking-tight ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        {dashboardData.lowStockAlerts.length > 0 && (
          <div className="mt-6 bg-white p-6">
            <p className="mb-6 font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">Low Stock Alerts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.lowStockAlerts.map((alert, index) => (
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
        )}

        {dashboardData.lowStockAlerts.length === 0 && (
          <div className="mt-6 bg-white p-6">
            <p className="mb-6 font-['Playfair_Display'] text-xl tracking-tight text-[#1a1a1a]">Low Stock Alerts</p>
            <p className="text-[#666666] text-center">No low stock alerts at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}