'use client';

import CreateTakeout from './create-takeout';
import PastCoachSessions from './past-coach-sessions';
import { useTheme } from '@/context/ThemeContext';

export default function RightSidebar() {
  const { theme } = useTheme();

  const OverlayMessage = () => (
    <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center
      ${theme === 'dark' ? 'bg-gray-900/70' : 'bg-white/70'}`}
    >
      <div className={`text-sm text-center px-6 py-3 rounded-xl backdrop-blur-sm animate-fade-in shadow-lg
        ${theme === 'dark' ? 'bg-indigo-600/90 text-white' : 'bg-indigo-500/90 text-white'}`}
      >
        Only available in full application, not in this demo.
      </div>
    </div>
  );

  return (
    <div className={`lg:w-80 border-t lg:border-t-0 lg:border-l p-3 sm:p-4 transition-colors duration-200
      ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
    >
      <div className="flex flex-col gap-2">
        <div className="relative">
          <PastCoachSessions />
          <OverlayMessage />
        </div>
        <div className="relative">
          <CreateTakeout />
          <OverlayMessage />
        </div>
      </div>
    </div>
  );
}
