'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Watch } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      router.push('/admin/dashboard');
    } else {
      setError('Please enter valid credentials');
    }
  }

  return (
    <div className="min-h-screen bg-[#eeeceb] flex flex-col">
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center gap-2 tracking-tight">
                <Watch className="w-10 h-10 text-[#d4af37]" />
                <p className="font-['Playfair_Display'] text-4xl text-[#1a1a1a">
                  GREATNESS
                </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs text-[#1a1a1a] mb-1 ml-0.5">
                      Admin Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-colors placeholder-gray-400"
                      placeholder="administrator@greatness.com"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-xs text-[#1a1a1a] mb-1 ml-0.5">
                      Security Key
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors placeholder-gray-400"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-center text-sm text-red-700">{error}</p>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_100%)] text-white py-4 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 group cursor-pointer tracking-tight"
                  >
                    <span>Authenticate & Access</span>
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="shrink-0">
        <div className="px-6 py-3">
          <p className="text-[10px] text-[#a0a0a0] text-center">© {new Date().getFullYear()} GREATNESS</p>
          <p className="text-[9px] text-[#666666] text-center mt-0.5">All rights reserved</p>
        </div>
      </div>
    </div>
  );
}