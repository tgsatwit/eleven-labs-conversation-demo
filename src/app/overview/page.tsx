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
          The Gestalt Language Coach is a comprehensive digital platform designed to assist parents, specialists, 
          and caregivers in supporting and enhancing a childs language development through targeted guidance, 
          collaborative tools, and advanced AI-driven insights.
        </p>
      </div>

      <Section title="Core Motivation">
        <div className="space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Our platform addresses the critical need for accessible, continuous, and individualized support 
            in language development for children, especially those with unique learning needs. Parents often 
            struggle to provide consistent language development activities between specialist sessions, and 
            traditional resources can be difficult to navigate without expert guidance.
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            By leveraging AI-driven insights, curated resources, and a robust progress tracking system, 
            we empower parents and specialists to foster meaningful communication and promote positive 
            developmental trajectories for children.
          </p>
        </div>
      </Section>

      <Section title="Core Features">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">AI-Driven Coaching and Analysis</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              The AI Coach provides on-demand, personalized recommendations through text, speech-to-text, 
              or interactive chat. Using context from a childs profile and progress history, it offers 
              actionable, expert-backed suggestions at your fingertips.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Comprehensive Progress Tracking</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Create detailed child profiles, set personalized goals, and track progress with visual insights. 
              Monitor developmental achievements, celebrate milestones, and make informed adjustments to 
              strategies as your child progresses.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Interactive Activity Library</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Access curated activities aligned with developmental stages and specific language goals. 
              The Play Analyzer enhances this by recording and analyzing interactions, generating insights 
              into how activities impact development.
            </p>
          </div>
        </div>
      </Section>

      <Section title="User Journeys">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Primary Parent Journey</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Start by creating detailed child profiles and development plans. Engage with the AI Coach 
              for real-time guidance, manage daily tasks, and track progress through visual reports. 
              Connect with specialists and other parents through our community features for additional support.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Specialist Journey</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Access comprehensive client profiles and progress data to inform sessions. Create tailored 
              tasks, set milestones, and provide expert guidance. Collaborate with parents and other 
              specialists through integrated communication tools.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Support Network Journey</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Additional caregivers can participate in task completion, view progress updates, and 
              contribute to the childs development journey. Stay connected through the messaging 
              system and community features while maintaining appropriate access levels.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Value Proposition">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Personalized Support</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Receive tailored guidance and support between specialist sessions, with tools to actively 
              participate in and influence your childs progress in meaningful ways.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Collaborative Environment</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with qualified specialists, share experiences with other parents, and maintain 
              a coordinated approach to supporting your childs language development.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Data-Driven Progress</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Track development through comprehensive analytics and visual reports, helping you make 
              informed decisions and celebrate progress along your childs unique journey.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
} 