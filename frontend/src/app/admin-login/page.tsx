'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Watch } from 'lucide-react';
import { adminLoginSchema, type AdminLoginData } from '../../lib/schemas';
import { adminLogin, isAdmin } from '../../lib/api/adminAPIs';
import Spinner from '../../components/spinner';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState<AdminLoginData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AdminLoginData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isAdmin();
        if (response.success) {
          router.push('/admin/dashboard');
        }
      } catch {} finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    if (errors[id as keyof AdminLoginData]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }

    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setSubmitError('');

    const result = adminLoginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AdminLoginData, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof AdminLoginData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await adminLogin(result.data);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || 'Something went wrong');
      } else {
        setSubmitError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeceb] flex flex-col">
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center gap-2 tracking-tight">
              <Watch className="w-10 h-10 text-[#d4af37]" />
              <p className="font-['Playfair_Display'] text-4xl text-[#1a1a1a]">
                GREATNESS
              </p>
            </div>
          </div>

          <div className="">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="email" className="block text-xs text-[#1a1a1a] ml-0.5">
                        Admin Email
                      </label>
                      {errors.email && (
                        <span className="text-xs text-red-600">{errors.email}</span>
                      )}
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-colors placeholder-gray-400 disabled:opacity-50`}
                      placeholder="administrator@greatness.com"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="password" className="block text-xs text-[#1a1a1a] ml-0.5">
                        Security Key
                      </label>
                      {errors.password && (
                        <span className="text-xs text-red-600">{errors.password}</span>
                      )}
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-white focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors placeholder-gray-400 disabled:opacity-50`}
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700 text-center">{submitError}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_100%)] text-white py-4 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 group cursor-pointer tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate & Access</span>
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="shrink-0">
        <div className="px-6 py-3">
          <p className="text-[10px] text-[#a0a0a0] text-center">© {new Date().getFullYear()} GREATNESS</p>
          <p className="text-[9px] text-[#666666] text-center mt-0.5">All rights reserved</p>
        </div>
      </div>
    </div>
  );
}