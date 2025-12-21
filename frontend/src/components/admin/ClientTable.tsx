'use client';

import { Mail, Phone, Package, Calendar } from 'lucide-react';

type Client = {
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
  orderCount: number;
  firstOrderDate: string;
  lastOrderDate: string;
};

type ClientTableProps = {
  clients: Client[];
};

const ClientTable = ({ clients }: ClientTableProps) => {
  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
        <div className="text-sm text-[#666666] tracking-tight text-center sm:text-left">
          {clients.length} {clients.length === 1 ? 'client' : 'clients'} total
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[900px] lg:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f7f3]">
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center whitespace-nowrap">
                  Client
                </th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center whitespace-nowrap">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center whitespace-nowrap">
                  Address
                </th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] border-r border-[#eae2d6] text-center whitespace-nowrap">
                  Orders & Last Order
                </th>
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] text-center whitespace-nowrap">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae2d6]">
              {clients.map((client, index) => (
                <tr key={index}>
                  {/* Client Name */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-center">
                      <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight wrap-words">
                        {client.name}
                      </p>
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-3 h-3 text-[#666666] shrink-0" />
                        <p className="text-[11px] text-[#1a1a1a] tracking-tight break-all">
                          {client.email}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-3 h-3 text-[#666666] shrink-0" />
                        <p className="text-[11px] text-[#1a1a1a] tracking-tight">
                          {client.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Address */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-center text-[11px] text-[#1a1a1a] leading-tight max-w-[200px] mx-auto">
                      {client.address}
                    </div>
                  </td>
                  
                  {/* Orders & Last Order */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <Package className="w-3 h-3 text-[#666666] shrink-0" />
                        <p className="text-[11px] text-[#1a1a1a] tracking-tight">
                          {client.orderCount} order{client.orderCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-3 h-3 text-[#666666] shrink-0" />
                        <p className="text-[11px] text-[#1a1a1a] tracking-tight">
                          {formatDate(client.lastOrderDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Total Spent */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-center">
                      <p className="font-['Playfair_Display'] text-[#1a1a1a] tracking-tight">
                        {formatPrice(client.totalSpent)}
                      </p>
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
};

export default ClientTable;