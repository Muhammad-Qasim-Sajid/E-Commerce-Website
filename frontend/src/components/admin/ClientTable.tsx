'use client';

import { Mail, Phone } from 'lucide-react';

type Client = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
  totalOrders: number;
  firstOrder: string;
  lastOrder: string;
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

  // Function to truncate address and show it in 2 lines
  const formatAddress = (address: string) => {
    // If address is short, just return it
    if (address.length <= 40) return address;
    
    // Split address by commas for better truncation
    const parts = address.split(', ');
    
    // If we have multiple parts, try to show first 2 parts on first line, rest on second
    if (parts.length >= 3) {
      const firstLine = `${parts[0]}, ${parts[1]}`;
      const secondLine = parts.slice(2).join(', ');
      return (
        <>
          <span className="block">{firstLine},</span>
          <span className="block">{secondLine}</span>
        </>
      );
    }
    
    // For longer single-line addresses, split in the middle
    const middle = Math.floor(address.length / 2);
    // Try to find a space near the middle for better word break
    const breakPoint = address.lastIndexOf(' ', middle);
    if (breakPoint !== -1) {
      return (
        <>
          <span className="block">{address.substring(0, breakPoint)}</span>
          <span className="block">{address.substring(breakPoint + 1)}</span>
        </>
      );
    }
    
    return address;
  };

  return (
    <div>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#eae2d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f9f7f3]">
        <div className="text-sm text-[#666666] tracking-tight text-center sm:text-left">
          {clients.length} Clients total
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] lg:min-w-0">
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
                <th className="px-4 sm:px-6 py-4 text-xs font-medium text-[#1a1a1a] text-center whitespace-nowrap">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae2d6]">
              {clients.map((client) => (
                <tr key={client._id}>
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-3 h-3 text-[#666666] shrink-0" />
                        <p className="text-xs text-[#1a1a1a] tracking-tight break-all text-center">
                          {client.email}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-3 h-3 text-[#666666] shrink-0" />
                        <p className="text-xs text-[#1a1a1a] tracking-tight">
                          {client.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Address */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-center text-xs text-[#1a1a1a] wrap-words leading-tight max-w-[200px]">
                        {formatAddress(client.address)}
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