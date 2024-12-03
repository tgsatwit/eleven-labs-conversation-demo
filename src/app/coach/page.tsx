'use client';

import { Conversation } from '../components/conversation';
import RightSidebar from '../components/ai-right-sidebar';
import { useTheme } from '@/context/ThemeContext';

export default function Coach() {
  const { theme } = useTheme();
  
  return (
    <div className={`flex flex-col lg:flex-row w-full min-h-screen overflow-x-hidden
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
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
