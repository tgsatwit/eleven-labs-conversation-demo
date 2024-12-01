'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionDisplayProps {
  title: string;
  session: {
    analysis: {
      content: string;
      timestamp: Date;
      isFollowUp?: boolean;
    };
    transcription: {
      segments: Array<{
        text: string;
        start: number;
        end: number;
        speaker?: string;
      }>;
    };
  };
}

export function SessionDisplay({ title, session }: SessionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(session.analysis.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="bg-[#1A1D1E] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#2A2D2E] transition-colors"
      >
        <h2 className="text-sm font-medium text-gray-200">{title}</h2>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-800">
          {/* Transcription */}
          <div className="mb-4">
            <h3 className="text-gray-400 text-sm mb-3">Transcription:</h3>
            <div className="space-y-2 text-sm text-gray-200">
              {session.transcription.segments.map((segment, index) => (
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

          {/* Analysis */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm">Analysis:</h3>
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
              {session.analysis.content}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              {session.analysis.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 