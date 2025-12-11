'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { orders } from '../../data/orders';
import StatusBadge from './StatusBadge';

const OrderTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-medium text-primary-600 hover:underline"
                >
                  {order.id}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-500">{order.customer.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">{order.createdAt}</td>
              <td className="px-6 py-4 font-medium text-gray-900">
                ${(order.total + order.shippingCost + order.tax).toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => alert('Print invoice')}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Invoice
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;