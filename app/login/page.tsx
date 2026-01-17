'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { setAuth, clearAuth } from '@/lib/auth';
import { useZodForm } from '@/hooks/useZodForm';
import { loginSchema, type LoginInput } from '@/lib/validations';

export default function LoginPage() {
  const router = useRouter();
  const isSubmitting = useRef(false);

  const {
    register,
    onSubmit,
    isSubmitting: loading,
    submitError: error,
    setSubmitError: setError,
    getFieldError,
    formState: { errors },
  } = useZodForm<LoginInput>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
    onSubmit: async (data) => {
      // Prevent double submit
      if (isSubmitting.current) return;
      isSubmitting.current = true;

      try {
        const response = await authAPI.login(data.email, data.password);
        const { token, user, csrfToken } = response.data;
        
        // Clear old auth first
        clearAuth();
        
        // Save to sessionStorage (CSRF token will be stored in memory via setAuth)
        setAuth(token, user, csrfToken);
        
        // KASIR hanya bisa akses POS, role lain ke dashboard
        if (user.role === 'KASIR') {
          router.push('/pos');
        } else {
          router.push('/dashboard');
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Email atau password salah. Silakan coba lagi.';
        throw new Error(errorMsg);
      } finally {
        isSubmitting.current = false;
      }
    },
    onError: (err) => {
      isSubmitting.current = false;
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-slate-600 dark:bg-slate-700 rounded-full mb-3 md:mb-4">
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pelaris.id Login
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 md:mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-800 dark:text-red-300 px-4 py-3 rounded shadow-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="font-semibold">Login Gagal</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                autoComplete="email"
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-slate-500 dark:focus:border-slate-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base ${
                  errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="email@example.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                autoComplete="current-password"
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-slate-500 dark:focus:border-slate-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base ${
                  errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-600 dark:bg-slate-700 text-white py-2 md:py-3 px-4 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-4 md:mt-6">
          © 2026 Pelaris.id | Omnichannel System
        </p>
      </div>
    </div>
  );
}
