import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestalts Language Coach",
  description: "Gestalts Language Coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen transition-colors duration-200 dark:bg-gray-900 bg-gray-50">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="dark:text-gray-100 text-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
