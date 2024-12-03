'use client';

import CreateTakeout from './create-takeout';
import PastCoachSessions from './past-coach-sessions';
import { useTheme } from '@/context/ThemeContext';

export default function RightSidebar() {
  const { theme } = useTheme();

  return (
    <div className={`lg:w-80 border-t lg:border-t-0 lg:border-l p-3 sm:p-4 transition-colors duration-200
      ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
    >
      <div className="flex flex-col gap-2">
        <PastCoachSessions />
        <CreateTakeout />
      </div>
    </div>
  );
}
