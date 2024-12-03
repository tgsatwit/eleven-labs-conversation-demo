"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
      setError('');
    } catch (err) {
      setError('Failed to reset password');
      setMessage('');
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
            Reset your password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          {message && (
            <div className="text-green-500 text-center">{message}</div>
          )}
          <div>
            <input
              type="email"
              required
              className={`appearance-none rounded relative block w-full px-3 py-2 border
                border-gray-300 placeholder-gray-500 focus:outline-none
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

          <div className="text-sm text-center">
            <Link
              href="/auth/login"
              className={`font-medium transition-colors duration-200
                ${theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-indigo-600 hover:text-indigo-500'
                }`}
            >
              Back to sign in
            </Link>
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
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 