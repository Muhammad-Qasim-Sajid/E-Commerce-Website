'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { orderApi } from '../../lib/api/orderAPIs';
import Spinner from '../Spinner';

type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
type Order = {
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
  trackingToken: string;
  createdAt: string;
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
  product?: {
    name: string;
  };
}

type OrderTableProps = {
  initialOrders?: Order[];
};

const OrderTable = ({ initialOrders = [] }: OrderTableProps) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(!initialOrders.length);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!initialOrders.length) {
      fetchOrders();
    }
  }, [initialOrders.length]);

  const fetchOrders = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await orderApi.getAllOrders(cursor);

      if (data.success) {
        if (cursor) {
          setOrders(prev => [...prev, ...data.data.orders]);
        } else {
          setOrders(data.data.orders);
        }
        setHasMore(data.data.hasMore);
        setNextCursor(data.data.nextCursor);
      } else {
        setError(data.message || 'Failed to load orders');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to delete order #${orderNumber}?`)) {
      try {
        setDeletingId(orderId);
        
        const data = await orderApi.deleteOrder(orderId);
        
        if (data.success) {
          alert('Order deleted successfully');
          setOrders(orders.filter(order => order._id !== orderId));
        } else {
          alert(data.message || 'Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error); // Debug log
        alert('Error deleting order');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleLoadMore = () => {
    if (nextCursor && hasMore) {
      fetchOrders(nextCursor);
    }
  };

  if (loading && !orders.length) {
    return <Spinner />;
  }

  if (error && !orders.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={() => fetchOrders()}
          className="px-4 py-2 bg-[#1a1a1a] text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
        <div className="text-sm text-[#666666] tracking-tight text-center sm:text-left">
          {orders.length} Orders total
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] lg:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f7f3]">
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Client</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Items</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Date</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Amount</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Payment</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Status</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae2d6]">
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-[#f9f7f3]/50 cursor-pointer group"
                  onClick={() => window.open(`/admin/orders/${order._id}`, '_blank')}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-center">
                      <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight hover:text-[#d4af37] transition-colors">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-[#666666] mt-1">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-center">
                      <p className="text-sm text-[#1a1a1a] tracking-tight">
                        {getTotalItems(order.items)} item{getTotalItems(order.items) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <p className="text-sm text-[#1a1a1a] tracking-tight">
                      {formatDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-0.5 text-xs tracking-tight ${
                      order.paymentStatus === 'Paid' 
                        ? 'text-green-600 border border-green-600'
                        : order.paymentStatus === 'Failed'
                        ? 'text-red-600 border border-red-600'
                        : 'text-[#666666] border border-[#eae2d6]'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-0.5 text-xs tracking-tight ${
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
                  </td>
                  <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <a
                        href={`/admin/orders/${order._id}/edit`}
                        className="p-1 sm:p-2"
                        title="Edit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-[#d4af37] transition-colors" />
                      </a>
                      <button
                        className="p-1 sm:p-2"
                        title="Delete"
                        disabled={deletingId === order._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order._id, order._id);
                        }}
                      >
                        <Trash2 className={`w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-red-500 transition-colors cursor-pointer ${
                          deletingId === order._id ? 'opacity-50' : ''
                        }`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-[#eae2d6]">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full py-3 text-sm border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Loading...' : 'Load More Orders'}
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderTable;