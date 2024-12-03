'use client';

import { Calendar, FileText, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface TakeoutItem {
  id: string;
  type: 'journal' | 'task' | 'appointment';
  title: string;
  date: string;
  completed?: boolean;
}

export default function CreateTakeout() {
  const { theme } = useTheme();
  const [takeoutItems, setTakeoutItems] = useState<TakeoutItem[]>([]);

  const handleCreateTakeout = (type: 'journal' | 'task' | 'appointment') => {
    const newItem: TakeoutItem = {
      id: Date.now().toString(),
      type,
      title: `New ${type}`,
      date: new Date().toLocaleDateString(),
    };
    setTakeoutItems(prev => [newItem, ...prev]);
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="flex items-center justify-between">
        <h2 className={`text-base sm:text-lg font-semibold flex items-center gap-2
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
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
            className={`w-full p-2 sm:p-3 rounded-lg text-left group transition-colors duration-200
              ${theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50 shadow-sm'}`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <item.icon className={`h-4 w-4 sm:h-5 sm:w-5
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
              />
              <div className="flex-1 min-w-0">
                <h3 className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate
                  ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                >
                  {item.title}
                </h3>
                <p className={`text-[10px] sm:text-xs truncate
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {takeoutItems.length > 0 && (
        <div className="mt-2 sm:mt-4 space-y-2">
          <h3 className={`text-xs sm:text-sm
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Recent Takeouts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
            {takeoutItems.map(item => (
              <div 
                key={item.id}
                className={`p-2 rounded-lg text-xs sm:text-sm transition-colors duration-200
                  ${theme === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-white shadow-sm'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    {item.title}
                  </span>
                  <span className={`text-[10px] sm:text-xs ml-2
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
