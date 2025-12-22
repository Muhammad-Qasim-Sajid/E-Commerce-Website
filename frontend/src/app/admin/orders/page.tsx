import OrderTable from '../../../components/admin/OrderTable';

export default function AdminOrders() {
  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight text-center sm:text-left">
            Orders
          </p>
        </div>
        <div className="bg-white">
          <OrderTable />
        </div>
      </div>
    </div>
  );
}