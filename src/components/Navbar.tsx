"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Gestalts
              </span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                <Link
                  href="/coach"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    pathname === '/coach'
                      ? theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Coach
                </Link>
                <Link
                  href="/analyzer"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    pathname === '/analyzer'
                      ? theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Analyzer
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors duration-200 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'focus:ring-gray-700 focus:ring-offset-gray-900'
                      : 'focus:ring-indigo-500 focus:ring-offset-white'
                  }`}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className={`h-8 w-8 rounded-full ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-600'
                  } flex items-center justify-center`}>
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className={`px-4 py-2 text-sm border-b ${
                      theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'
                    }`}>
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 