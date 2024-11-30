'use client';

import { Conversation } from './components/conversation';
import RightSidebar from './components/ai-right-sidebar';

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0D0F10] text-white overflow-x-hidden">
      {/* Main content area */}
        {/* Conversation component */}
        <Conversation />
      {/* Right sidebar */} 
      <RightSidebar />
    </div>
  );
}
