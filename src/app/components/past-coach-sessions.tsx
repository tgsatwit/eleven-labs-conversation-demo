'use client';

import { ChevronRight, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Session {
  id: string;
  title: string;
  date: string;
  messages: number;
}

export default function PastCoachSessions() {
  const { theme } = useTheme();
  const [sessions] = useState<Session[]>([
    { id: '1', title: "What is the meaning of life?", date: "19 Nov", messages: 4 },
    { id: '2', title: "Can you help me with my homework?", date: "18 Nov", messages: 6 },
    { id: '3', title: "Write a poem about spring", date: "17 Nov", messages: 3 }
  ]);

  const handleSessionClick = (sessionId: string) => {
    console.log('Loading session:', sessionId);
  };

  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex items-center justify-between">
        <h2 className={`text-base sm:text-lg font-semibold flex items-center gap-2
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
          Past Sessions
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => handleSessionClick(session.id)}
            className={`w-full p-2 rounded-lg text-left group transition-colors duration-200
              ${theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50 shadow-sm'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className={`text-xs sm:text-sm font-medium mb-1 truncate
                  ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                >
                  {session.title}
                </h3>
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

      <button
        className={`w-full p-1.5 rounded-lg text-xs sm:text-sm transition-colors duration-200
          ${theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
            : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-sm'}`}
      >
        View All Sessions
      </button>
    </div>
  );
}
