'use client';

import { Conversation } from './components/conversation';
import { Settings, Calendar, FileText, PlusCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import RightSidebar from './components/ai-right-sidebar';

interface Session {
  id: string;
  title: string;
  date: string;
  messages: number;
}

interface TakeoutItem {
  id: string;
  type: 'journal' | 'task' | 'appointment';
  title: string;
  date: string;
  completed?: boolean;
}

export default function Home() {
  const [sessions] = useState<Session[]>([
    { id: '1', title: "What is the meaning of life?", date: "19 Nov", messages: 4 },
    { id: '2', title: "Can you help me with my homework?", date: "18 Nov", messages: 6 },
    { id: '3', title: "Write a poem about spring", date: "17 Nov", messages: 3 }
  ]);

  const [takeoutItems, setTakeoutItems] = useState<TakeoutItem[]>([]);

  const handleSessionClick = (sessionId: string) => {
    console.log('Loading session:', sessionId);
    // Implement session loading logic
  };

  const handleCreateTakeout = (type: 'journal' | 'task' | 'appointment') => {
    const newItem: TakeoutItem = {
      id: Date.now().toString(),
      type,
      title: `New ${type}`,
      date: new Date().toLocaleDateString(),
    };
    setTakeoutItems(prev => [newItem, ...prev]);
    console.log(`Created new ${type}:`, newItem);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0D0F10] text-white overflow-x-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 lg:max-w-[800px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">🎙️</span>
            <h1 className="text-lg sm:text-xl font-semibold">Voice Assistant</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Try asking suggestions - Updated for Gestalt Language Coach context */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Try asking:</h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              "How can I simplify my phrases?",
              "Tips for following my child's lead",
              "Ways to encourage echoing",
              "Strategies for play-based learning",
              "How to pause effectively"
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1A1D1E] hover:bg-[#2A2D2E] text-xs sm:text-sm text-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation component */}
        <Conversation />
      </div>
      {/* Right sidebar */} 
      <RightSidebar />
    </div>
  );
}
