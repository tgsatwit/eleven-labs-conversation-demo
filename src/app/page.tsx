'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0D0F10] text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">Gestalt Language Assistant</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link href="/coach" className="group h-full">
            <div className="bg-[#1A1D1E] rounded-lg p-6 hover:bg-[#2A2D2E] transition-all duration-200 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Language Coach</h2>
              <p className="text-gray-400 text-sm">
                Have a real-time conversation with an AI assistant trained in Gestalt Language Processing.
                Get instant feedback and suggestions for supporting your child's language development.
              </p>
            </div>
          </Link>

          <Link href="/analyzer" className="group h-full">
            <div className="bg-[#1A1D1E] rounded-lg p-6 hover:bg-[#2A2D2E] transition-all duration-200 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Play Analyzer</h2>
              <p className="text-gray-400 text-sm">
                Upload recordings of play sessions for detailed analysis. 
                Receive structured feedback on interaction patterns and language development opportunities.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
