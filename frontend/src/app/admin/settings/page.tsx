'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeIcon, BookOpen, HelpCircle, LogOut, ArrowRight, Truck, Save } from 'lucide-react';

export default function AdminSettings() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(500);
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [shippingEditMode, setShippingEditMode] = useState(false);

  const settingsOptions = [
    {
      id: 'home',
      title: 'Edit Home Page',
      description: 'Update hero section, tagline, features, and testimonials',
      icon: HomeIcon,
      href: '/admin/settings/home',
      color: 'text-[#d4af37]',
      borderColor: 'border-[#d4af37]'
    },
    {
      id: 'story',
      title: 'Edit Our Story Page',
      description: 'Update tagline, founder quotes, and story sections',
      icon: BookOpen,
      href: '/admin/settings/our-story',
      color: 'text-[#1a1a1a]',
      borderColor: 'border-[#1a1a1a]'
    },
    {
      id: 'faqs',
      title: 'Edit FAQs',
      description: 'Update frequently asked questions and answers',
      icon: HelpCircle,
      href: '/admin/settings/faqs',
      color: 'text-blue-600',
      borderColor: 'border-blue-600'
    }
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Add your logout logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/admin-login');
  };

  const handleSaveShippingPrice = async () => {
    setIsSavingShipping(true);
    // Add your API call here
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSavingShipping(false);
    setShippingEditMode(false);
  };

  return (
    <div className="min-h-screen bg-[#eeeceb]">
      <div className="p-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <p className="font-['Playfair_Display'] text-3xl text-[#1a1a1a] tracking-tight">
            Settings
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {settingsOptions.map((option) => (
            <a
              key={option.id}
              href={option.href}
              className="bg-white"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 border ${option.borderColor}`}>
                    <option.icon className={`w-5 h-5 ${option.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#666666]" />
                </div>
                <div>
                  <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] tracking-tight mb-2">
                    {option.title}
                  </p>
                  <p className="text-sm text-[#666666]">
                    {option.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Shipping Price Section */}
        <div className="bg-white mb-6">
          <div className="p-6 border-b border-[#eae2d6]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 border border-[#1a1a1a]">
                <Truck className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <div>
                <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] tracking-tight">
                  Shipping Price
                </p>
                <p className="text-sm text-[#666666]">
                  Update the standard shipping price for all orders
                </p>
              </div>
            </div>

            {shippingEditMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#666666] mb-2">
                    Shipping Price (PKR)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={shippingPrice}
                      onChange={(e) => setShippingPrice(Number(e.target.value))}
                      className="w-32 border border-[#eae2d6] bg-white px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-0.5 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] transition-colors text-sm"
                      
                      placeholder="Enter amount"
                    />
                    <span className="text-sm text-[#666666]">PKR</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveShippingPrice}
                    disabled={isSavingShipping}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1a1a1a] text-white hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    {isSavingShipping ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setShippingEditMode(false)}
                    className="px-4 py-2 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                  <p className="font-['Playfair_Display'] text-2xl text-[#1a1a1a]">
                    PKR {shippingPrice.toLocaleString('en-PK')}
                  </p>
                <button
                  onClick={() => setShippingEditMode(true)}
                  className="px-4 py-2 text-sm border border-[#eae2d6] text-[#666666] hover:bg-[#f9f7f3] transition-colors cursor-pointer"
                >
                  Edit Price
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Logout Section */}
        <div className="bg-white">
          <div className="p-6">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4 cursor-pointer" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}