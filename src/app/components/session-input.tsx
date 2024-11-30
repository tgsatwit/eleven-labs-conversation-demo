'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Upload, Loader2, StopCircle, Circle } from 'lucide-react';

interface SessionInputProps {
  onSessionReady: (file: File) => void;
  onTranscriptUpdate?: (text: string, isComplete: boolean) => void;
  onRecordingStateChange?: (recording: boolean) => void;
  isLoading: boolean;
}

export function SessionInput({ 
  onSessionReady, 
  onTranscriptUpdate, 
  onRecordingStateChange, 
  isLoading 
}: SessionInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcriptionTimeoutRef = useRef<NodeJS.Timeout>();

  // Add useEffect to manage the timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setRecordingTime(0); // Reset timer
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Handle data as it comes in
      mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          
          // Create a blob from the latest chunk
          const audioBlob = new Blob([e.data], { type: 'audio/webm' });
          const file = new File([audioBlob], 'chunk.webm', { type: 'audio/webm' });

          // Send for transcription
          try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const { transcription } = await response.json();
              onTranscriptUpdate?.(transcription.text, false);
            }
          } catch (error) {
            console.error('Chunk transcription error:', error);
          }
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        onSessionReady(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording in chunks
      mediaRecorder.start(5000);
      setIsRecording(true);
      onRecordingStateChange?.(true);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setRecordingTime(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange?.(false);
      setRecordingTime(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSessionReady(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transcriptionTimeoutRef.current) {
        clearTimeout(transcriptionTimeoutRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="flex flex-col gap-4">
      {/* Recording status indicator */}
      {isRecording && (
        <div className="flex items-center justify-center gap-2 p-2 bg-red-500/10 rounded-lg">
          <Circle className="h-3 w-3 fill-red-500 animate-pulse" />
          <span className="text-red-500 font-medium">Recording in progress</span>
          <span className="text-red-400">({formatTime(recordingTime)})</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={isLoading || isRecording}
        />
        <label htmlFor="file-upload">
          <Button
            variant="outline"
            className={`cursor-pointer transition-all duration-200 ${
              isRecording ? 'opacity-50' : 'hover:bg-[#2A2D2E]'
            }`}
            disabled={isLoading || isRecording}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Recording
          </Button>
        </label>
        
        <span className="text-gray-400">or</span>

        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "outline"}
          disabled={isLoading}
          className={`transition-all duration-200 ${
            isRecording ? '' : 'hover:bg-[#2A2D2E]'
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-blue-500 font-medium">Processing recording...</span>
        </div>
      )}
    </div>
  );
} 