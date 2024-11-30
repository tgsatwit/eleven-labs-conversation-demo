'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Copy, Check } from 'lucide-react';
import { SessionInput } from './session-input';

interface Analysis {
  content: string;
  timestamp: Date;
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

export function PlayAnalysis() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
      setTranscription(transcription);

      // Format the transcription for analysis
      const formattedTranscript = transcription.segments
        .map((segment: TranscriptionSegment) => `${segment.speaker || 'Speaker'}: ${segment.text}`)
        .join('\n');

      // Send the transcription for analysis
      const analysisResponse = await fetch('/api/play-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Please analyze this play session transcript:\n\n${formattedTranscript}\n\nProvide feedback on the interaction patterns and language development opportunities observed.`
        })
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get analysis');
      }

      const data = await analysisResponse.json();
      setAnalysis({
        content: data.message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 lg:max-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">Play Session Analysis</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Session Input */}
        <div className="bg-[#1A1D1E] rounded-lg p-4">
          <SessionInput 
            onSessionReady={handleSessionReady}
            isLoading={isLoading}
          />
        </div>

        {/* Transcription Display */}
        {transcription && (
          <div className="flex-1 bg-[#1A1D1E] rounded-lg p-4">
            <h2 className="text-gray-400 text-sm mb-3">Transcription:</h2>
            <div className="space-y-2 text-sm text-gray-200">
              {transcription.segments.map((segment, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-gray-400 min-w-[80px]">
                    {new Date(segment.start * 1000).toISOString().substr(14, 5)}
                  </span>
                  <span className="text-blue-400 min-w-[80px]">
                    {segment.speaker || 'Speaker'}:
                  </span>
                  <span>{segment.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Display */}
        {analysis && (
          <div className="flex-1 bg-[#1A1D1E] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-400 text-sm">Analysis Results:</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="whitespace-pre-wrap text-sm text-gray-200">
              {analysis.content}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              {analysis.timestamp.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
