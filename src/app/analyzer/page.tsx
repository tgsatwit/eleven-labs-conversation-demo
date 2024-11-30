'use client';

import { PlayAnalysis } from '../components/play-analysis';
import RightSidebar from '../components/ai-right-sidebar';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PlayAnalyzer() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0D0F10] text-white overflow-x-hidden">
      {/* Main content area with navigation */}
      <div className="flex-1 flex flex-col">
        {/* Navigation bar */}
        <div className="p-4 border-b border-gray-800">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* PlayAnalysis component */}
        <PlayAnalysis />
      </div>
      
      {/* Right sidebar */} 
      <RightSidebar />
    </div>
  );
}
