'use client';

import { useState, useEffect } from 'react';
import ClientTable from '../../../components/admin/ClientTable';
import Spinner from '../../../components/Spinner';
import { getCsrfToken } from '@/lib/utils';

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

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const csrfToken = getCsrfToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/get`, {
        credentials: 'include',
        headers: {
              ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      
      if (data.success) {
        setClients(data.data.clients || []);
      } else {
        throw new Error(data.message || 'Failed to load clients');
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching clients:', error); // Debug log
      setError(error.message || 'An error occurred while loading clients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <Spinner />
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1a1a] tracking-tight text-center sm:text-left">
            Clients
          </p>
        </div>

        {error ? (
          <div className="bg-white p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchClients}
                className="px-4 py-2 bg-[#1a1a1a] text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white">
            <ClientTable clients={clients}/>
          </div>
        )}
      </div>
    </div>
  );
}