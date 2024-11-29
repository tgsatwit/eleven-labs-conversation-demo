'use client';

import { Conversation } from './components/conversation';
import { Settings, Calendar, FileText, PlusCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
  const [sessions, setSessions] = useState<Session[]>([
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

        {/* Try asking suggestions */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Try asking:</h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              "Tell me a joke",
              "What's the weather like?",
              "Set a timer for 5 minutes",
              "Translate 'Hello' to Spanish"
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

      {/* Right sidebar - responsive */}
      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-[#1A1D1E] p-3 sm:p-4">
        <div className="max-w-3xl mx-auto lg:max-w-none flex flex-col gap-4 sm:gap-6">
          {/* Past Sessions Section */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                Past Sessions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSessionClick(session.id)}
                  className="w-full p-2 sm:p-3 rounded-lg bg-[#1A1D1E] hover:bg-[#2A2D2E] text-left group transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-medium mb-1 truncate">{session.title}</h3>
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-400">
                        <span>{session.date}</span>
                        <span className="mx-2">•</span>
                        <span>{session.messages} messages</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full p-1.5 sm:p-2 rounded-lg bg-[#1A1D1E] hover:bg-[#2A2D2E] text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
              View All Sessions
            </button>
          </div>

          {/* Create Takeout Section */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Create Takeout
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
              {[
                {
                  type: 'journal' as const,
                  title: 'Create Journal Entry',
                  description: 'Save this conversation to your journal',
                  icon: FileText
                },
                {
                  type: 'task' as const,
                  title: 'Add Task',
                  description: 'Create a new task from this conversation',
                  icon: FileText
                },
                {
                  type: 'appointment' as const,
                  title: 'Add to Appointment',
                  description: 'Add notes to a scheduled appointment',
                  icon: Calendar
                }
              ].map((item) => (
                <button 
                  key={item.type}
                  onClick={() => handleCreateTakeout(item.type)}
                  className="w-full p-2 sm:p-3 rounded-lg bg-[#1A1D1E] hover:bg-[#2A2D2E] text-left group transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate">{item.title}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {takeoutItems.length > 0 && (
              <div className="mt-2 sm:mt-4 space-y-2">
                <h3 className="text-xs sm:text-sm text-gray-400">Recent Takeouts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
                  {takeoutItems.map(item => (
                    <div 
                      key={item.id}
                      className="p-2 rounded-lg bg-[#1A1D1E] text-xs sm:text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400 ml-2">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
