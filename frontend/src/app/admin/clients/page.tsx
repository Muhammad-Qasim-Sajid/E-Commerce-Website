import ClientTable from '../../../components/admin/ClientTable';

const clientsData = [
  {
    _id: '1',
    name: 'Alexander Rothschild',
    email: 'alex@email.com',
    phone: '+1234567890',
    address: '123 Luxury Street, Manhattan, New York, NY 10001',
    totalSpent: 3199.98,
    totalOrders: 1,
    firstOrder: '2024-01-15T10:30:00Z',
    lastOrder: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Emma Chen',
    email: 'emma.chen@email.com',
    phone: '+1234567891',
    address: '456 Business Ave, Financial District, San Francisco, CA 94111',
    totalSpent: 5599.95,
    totalOrders: 2,
    firstOrder: '2023-12-05T14:20:00Z',
    lastOrder: '2024-01-20T09:15:00Z'
  },
  {
    _id: '3',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1234567892',
    address: '789 Heritage Lane, Boston, MA 02108',
    totalSpent: 2799.99,
    totalOrders: 1,
    firstOrder: '2024-02-10T16:45:00Z',
    lastOrder: '2024-02-10T16:45:00Z'
  },
  {
    _id: '4',
    name: 'Sophia Martinez',
    email: 'sophia.m@email.com',
    phone: '+1234567893',
    address: '101 Artisan Road, Miami Beach, FL 33139',
    totalSpent: 8399.97,
    totalOrders: 3,
    firstOrder: '2023-11-20T11:10:00Z',
    lastOrder: '2024-01-28T13:30:00Z'
  },
  {
    _id: '5',
    name: 'Michael Tanaka',
    email: 'm.tanaka@email.com',
    phone: '+1234567894',
    address: '222 Modern Tower, Los Angeles, CA 90012',
    totalSpent: 1399.99,
    totalOrders: 1,
    firstOrder: '2024-02-15T15:00:00Z',
    lastOrder: '2024-02-15T15:00:00Z'
  }
];

export default function AdminClients() {
  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight text-center sm:text-left">
            Clients
          </p>
        </div>
        <div className="bg-white">
          <ClientTable clients={clientsData}/>
        </div>
      </div>
    </div>
  );
}