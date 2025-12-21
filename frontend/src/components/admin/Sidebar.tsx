'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronLeft, Watch, Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/collections', icon: Package, label: 'Collections' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/clients', icon: Users, label: 'Clients' },
    { href: '/admin/inbox', icon: Inbox, label: 'Inbox' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-65 bg-[#1a1a1a] text-white transition-transform duration-300 lg:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#413f3f] shrink-0">
          <div className="flex items-center gap-3">
              <Watch className="w-8 h-8 text-[#d4af37]" />
            <div>
              <h2 className="font-['Playfair_Display'] text-xl tracking-tight">GREATNESS</h2>
              <p className="text-[10px] text-[#a0a0a0] font-light">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden cursor-pointer p-1 hover:bg-[#2d2d2d] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 transition-all duration-300',
                      isActive
                        ? 'text-white border-l-3 border-[#d4af37] bg-linear-to-r from-[#2d2d2d] to-transparent'
                        : 'hover:bg-[#2d2d2d] border-l-3 border-transparent'
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-[#d4af37]" : "text-[#a0a0a0]"
                    )} />
                    <span className={cn(
                      "text-sm",
                      isActive ? "font-medium" : "font-normal text-[#a0a0a0]"
                    )}>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-[#413f3f] shrink-0">
          <div className="px-6 py-3">
            <p className="text-[10px] text-[#a0a0a0] text-center">© {new Date().getFullYear()} GREATNESS</p>
            <p className="text-[9px] text-[#666666] text-center mt-0.5">All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;