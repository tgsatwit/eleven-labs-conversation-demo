'use client';

import { Conversation } from '../components/conversation';
import RightSidebar from '../components/ai-right-sidebar';

export default function Coach() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0D0F10] text-white overflow-x-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Conversation component */}
        <Conversation />
      </div>
      
      {/* Right sidebar */} 
      <RightSidebar />
    </div>
  );
}
