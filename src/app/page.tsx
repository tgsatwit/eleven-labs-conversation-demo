'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-6">
          <Image
            src="/logo512.png"
            alt="Gestalt Language Assistant Logo"
            width={128}
            height={128}
            className="rounded-xl"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">Gestalts Language Coach Demo</h1>
        <p className={`text-center max-w-2xl mb-8 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          This demo showcases the AI-powered features of our platform. Try out the Language Coach for
          real-time guidance or the Play Analyzer for session feedback. For a full overview of the
          complete application's capabilities, visit our overview page.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link href="/coach" className="group h-full">
            <div className={`rounded-lg p-6 transition-all duration-200 h-full flex flex-col
              ${theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50 shadow-md'}`}
            >
              <h2 className="text-xl font-semibold mb-4">Language Coach</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Have a real-time conversation with an AI assistant trained in Gestalt Language Processing.
                Get instant feedback and suggestions for supporting your child's language development.
              </p>
            </div>
          </Link>

          <Link href="/analyzer" className="group h-full">
            <div className={`rounded-lg p-6 transition-all duration-200 h-full flex flex-col
              ${theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50 shadow-md'}`}
            >
              <h2 className="text-xl font-semibold mb-4">Play Analyzer</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Live record or upload recordings of play sessions for detailed analysis. 
                Receive structured feedback on interaction patterns and language development opportunities.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
