"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/');
    } catch {
      setError('Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg transition-colors duration-200
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm transition-colors duration-200
                  ${theme === 'dark'
                    ? 'bg-gray-700 text-white focus:ring-gray-500 focus:border-gray-500'
                    : 'bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm transition-colors duration-200
                  ${theme === 'dark'
                    ? 'bg-gray-700 text-white focus:ring-gray-500 focus:border-gray-500'
                    : 'bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/reset-password"
                className={`font-medium transition-colors duration-200
                  ${theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-indigo-600 hover:text-indigo-500'
                  }`}
              >
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm">
              <Link
                href="/auth/signup"
                className={`font-medium transition-colors duration-200
                  ${theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-indigo-600 hover:text-indigo-500'
                  }`}
              >
                No account? Sign up
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2
                focus:ring-offset-2 transition-colors duration-200
                ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                }`}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 