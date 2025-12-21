'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import Spinner from '../../components/spinner';
import { isAdmin } from '../../lib/api/adminAPIs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isAdmin();
        if (response.success) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          router.push('/admin-login');
        }
      } catch {
        router.push('/admin-login');
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}