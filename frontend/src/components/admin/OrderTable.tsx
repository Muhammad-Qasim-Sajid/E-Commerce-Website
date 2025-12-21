'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Order, OrderItem } from '../../lib/types';

type OrderTableProps = {
  orders: Order[];
};

const OrderTable = ({ orders }: OrderTableProps) => {
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
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Order deleted successfully (demo)');
        } else {
          alert('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
  };

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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order._id, order.trackingToken);
                        }}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-red-500 transition-colors cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderTable;




// 'use client';

// import { useState } from 'react';
// import { Edit, Trash2 } from 'lucide-react';
// import { Order, OrderItem } from '../../lib/types';

// type OrderTableProps = {
//   initialOrders?: Order[];
// };

// const OrderTable = ({ initialOrders = [] }: OrderTableProps) => {
//   const [orders, setOrders] = useState<Order[]>(initialOrders);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [cursor, setCursor] = useState<string | null>(null);

//   // Format date to match your dashboard style
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format price with PKR
//   const formatPrice = (price: number) => {
//     return `PKR ${price.toLocaleString('en-PK', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     })}`;
//   };

//   // Calculate total items in order
//   const getTotalItems = (items: OrderItem[]) => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   // Load more orders for pagination
//   const loadMoreOrders = async () => {
//     if (loading || !hasMore) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`/api/admin/orders?cursor=${cursor}`);
//       const data = await response.json();
      
//       if (data.success) {
//         setOrders(prev => [...prev, ...data.data.orders]);
//         setHasMore(data.data.hasMore);
//         setCursor(data.data.nextCursor);
//       }
//     } catch (error) {
//       console.error('Error loading more orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete order
//   const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
//     if (confirm(`Are you sure you want to delete order #${orderNumber}?`)) {
//       try {
//         const response = await fetch(`/api/admin/orders/${orderId}`, {
//           method: 'DELETE',
//         });
        
//         if (response.ok) {
//           setOrders(prev => prev.filter(order => order._id !== orderId));
//           alert('Order deleted successfully');
//         } else {
//           alert('Failed to delete order');
//         }
//       } catch (error) {
//         console.error('Error deleting order:', error);
//         alert('Error deleting order');
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
//         <div className="text-sm text-[#666666] tracking-tight text-center sm:text-left">
//           {orders.length} Orders total
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[800px] lg:min-w-0">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-[#f9f7f3]">
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Customer</th>
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Items</th>
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Date</th>
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Total</th>
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Payment</th>
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center">Status</th>
//                 <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#eae2d6]">
//               {orders.map((order) => (
//                 <tr 
//                   key={order._id} 
//                   className="hover:bg-[#f9f7f3]/50 cursor-pointer group"
//                   onClick={() => window.open(`/admin/orders/${order._id}`, '_blank')}
//                 >
//                   <td className="px-4 sm:px-6 py-4">
//                     <div className="text-center">
//                       <p className="font-['Playfair_Display'] font-medium text-[#1a1a1a] tracking-tight hover:text-[#d4af37] transition-colors">
//                         {order.customerName}
//                       </p>
//                       <p className="text-xs text-[#666666] mt-1">
//                         {order.customerEmail}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4">
//                     <div className="text-center">
//                       <p className="text-sm text-[#1a1a1a] tracking-tight">
//                         {getTotalItems(order.items)} item{getTotalItems(order.items) !== 1 ? 's' : ''}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-center">
//                     <p className="text-sm text-[#1a1a1a] tracking-tight">
//                       {formatDate(order.createdAt)}
//                     </p>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-center">
//                     <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">
//                       {formatPrice(order.totalPrice)}
//                     </p>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-center">
//                     <span className={`inline-flex items-center px-3 py-1 text-xs tracking-tight rounded-full ${
//                       order.paymentStatus === 'Paid' 
//                         ? 'text-green-600 border border-green-600'
//                         : order.paymentStatus === 'Failed'
//                         ? 'text-red-600 border border-red-600'
//                         : 'text-[#666666] border border-[#eae2d6]'
//                     }`}>
//                       {order.paymentStatus}
//                     </span>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4 text-center">
//                     <span className={`inline-flex items-center px-3 py-1 text-xs tracking-tight rounded-full ${
//                       order.orderStatus === 'Delivered' 
//                         ? 'text-[#d4af37] border border-[#d4af37]'
//                         : order.orderStatus === 'Confirmed'
//                         ? 'text-blue-600 border border-blue-600'
//                         : order.orderStatus === 'Shipped'
//                         ? 'text-[#1a1a1a] border border-[#1a1a1a]'
//                         : order.orderStatus === 'Cancelled'
//                         ? 'text-red-600 border border-red-600'
//                         : 'text-[#666666] border border-[#eae2d6]'
//                     }`}>
//                       {order.orderStatus}
//                     </span>
//                   </td>
//                   <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
//                     <div className="flex items-center justify-center gap-1 sm:gap-2">
//                       <a
//                         href={`/admin/orders/${order._id}/edit`}
//                         className="p-1 sm:p-2"
//                         title="Edit"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-[#d4af37] transition-colors" />
//                       </a>
//                       <button
//                         className="p-1 sm:p-2"
//                         title="Delete"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteOrder(order._id, order.trackingToken);
//                         }}
//                       >
//                         <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666] hover:text-red-500 transition-colors cursor-pointer" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination Load More */}
//       {hasMore && (
//         <div className="p-6 border-t border-[#eae2d6] text-center">
//           <button
//             onClick={loadMoreOrders}
//             disabled={loading}
//             className="px-6 py-3 border border-[#eae2d6] hover:bg-[#f9f7f3] text-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Loading...' : 'Load More Orders'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OrderTable;