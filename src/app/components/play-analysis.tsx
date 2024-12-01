'use client';

import { useState } from 'react';
import { Settings, Copy, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionInput } from './session-input';
import { SessionDisplay } from './session-display';

interface Analysis {
  content: string;
  timestamp: Date;
  isFollowUp?: boolean;
}

interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  speaker?: string;
}

interface Transcription {
  text: string;
  segments: TranscriptionSegment[];
}

interface Session {
  analysis: Analysis;
  transcription: Transcription;
}

export function PlayAnalysis() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingFollowUp, setIsRecordingFollowUp] = useState(false);

  const handleSessionReady = async (file: File) => {
    setIsLoading(true);
    try {
      // First, get the transcription
      const formData = new FormData();
      formData.append('file', file);

      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { transcription } = await transcriptionResponse.json();

      // Format the transcription for analysis
      const formattedTranscript = transcription.segments
        .map((segment: TranscriptionSegment) => `${segment.speaker || 'Speaker'}: ${segment.text}`)
        .join('\n');

      // Prepare analysis message based on whether this is a follow-up
      let analysisMessage = isRecordingFollowUp && sessions.length > 0
        ? `This is a follow-up session to implement previous feedback. 
           
           Previous session transcript:
           ${sessions[sessions.length - 1].transcription.segments
             .map(segment => `${segment.speaker || 'Speaker'}: ${segment.text}`)
             .join('\n')}
           
           Previous analysis and feedback:
           ${sessions[sessions.length - 1].analysis.content}
           
           New session transcript:
           ${formattedTranscript}
           
           Please analyze this follow-up session, specifically:
           1. What feedback from the previous session was implemented?
           2. How did the child respond to these changes?
           3. What worked particularly well?
           4. What new opportunities for growth were observed?
           5. Provide specific suggestions for the next session.`
        : `Please analyze this play session transcript:\n\n${formattedTranscript}\n\nProvide feedback on the interaction patterns and language development opportunities observed.`;

      // Send the transcription for analysis
      const analysisResponse = await fetch('/api/play-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: analysisMessage })
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get analysis');
      }

      const data = await analysisResponse.json();
      
      const newSession = {
        analysis: {
          content: data.message,
          timestamp: new Date(),
          isFollowUp: isRecordingFollowUp
        },
        transcription
      };

      setSessions(prev => [...prev, newSession]);
      setIsRecordingFollowUp(false);

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startFollowUpSession = () => {
    setIsRecordingFollowUp(true);
  };

  const handleTranscriptUpdate = (text: string, isComplete: boolean) => {
    if (!isComplete) {
      setLiveTranscript(prev => prev + ' ' + text);
    }
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
    if (!recording) {
      // Clear live transcript when recording stops
      setLiveTranscript('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 lg:max-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">
            Play Session Analysis
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Recording Interface */}
        {(!sessions.length || isRecordingFollowUp) && (
          <div className="bg-[#1A1D1E] rounded-lg p-4">
            <SessionInput 
              onSessionReady={handleSessionReady}
              onTranscriptUpdate={handleTranscriptUpdate}
              onRecordingStateChange={handleRecordingStateChange}
              isLoading={isLoading}
            />
            {isRecording && liveTranscript && (
              <div className="mt-4">
                <h2 className="text-gray-400 text-sm mb-3">Live Transcription:</h2>
                <div className="text-sm text-gray-200">
                  {liveTranscript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session History */}
        <div className="flex flex-col gap-4">
          {sessions.map((session, index) => (
            <SessionDisplay
              key={index}
              title={index === 0 ? "First Interaction" : `Follow-up Interaction ${index}`}
              session={session}
            />
          ))}
        </div>

        {/* Follow-up Button */}
        {sessions.length > 0 && !isRecordingFollowUp && (
          <Button
            onClick={startFollowUpSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
          >
            Record Follow-up Session
          </Button>
        )}
      </div>
    </div>
  );
}
