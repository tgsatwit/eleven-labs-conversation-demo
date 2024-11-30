'use client';

import CreateTakeout from './create-takeout';
import PastCoachSessions from './past-coach-sessions';

export default function Home() {

  return (
    <div className="flex flex-col lg:flex-row -screen bg-[#0D0F10] text-white overflow-x-hidden">
      {/* Right sidebar - responsive */}
      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-[#1A1D1E] p-3 sm:p-4">
        <div className="max-w-3xl mx-auto lg:max-w-none flex flex-col gap-4 sm:gap-6">
          {/* Past Coach Sessions Section */}
          <PastCoachSessions />
          {/* Create Takeout Section */}
          <CreateTakeout />
        </div>
      </div>
    </div>
  );
}
