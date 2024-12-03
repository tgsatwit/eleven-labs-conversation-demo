'use client';

import { useTheme } from '@/context/ThemeContext';

export default function Overview() {
  const { theme } = useTheme();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Full Application Overview</h1>
      
      <div className={`p-4 mb-8 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          This demo showcases only the AI-powered features of the full Gestalts Language Coach platform.
          Below is an overview of the complete application&apos;s capabilities and features.
        </p>
      </div>

      <Section title="Core Features">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">AI-Driven Coaching and Analysis</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Personalized AI coaching provides real-time guidance and analysis of play sessions,
              offering actionable insights for supporting child language development.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Progress Tracking & Development Plans</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive tracking tools for monitoring milestones, setting goals, and visualizing progress
              over time with detailed reporting and insights.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Specialist Integration</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with speech therapists and language specialists, share progress data, and maintain
              continuity between sessions.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Additional Modules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Resource Center</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Curated library of articles, videos, and training materials for parents and caregivers.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Community Forum</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with other parents, share experiences, and get support from the community.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Task Management</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Create and track development activities, set reminders, and manage daily interventions.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Specialist Booking</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Find and book sessions with qualified specialists, manage appointments, and track session history.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Target Users">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Parents & Caregivers</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Primary users who manage child profiles, track progress, and implement daily language support strategies.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Specialists</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Speech therapists and language specialists who provide professional guidance and monitor progress.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Support Network</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Additional caregivers and family members who contribute to the child's development journey.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
} 