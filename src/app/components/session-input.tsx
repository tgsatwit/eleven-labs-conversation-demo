'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Upload, Loader2, StopCircle } from 'lucide-react';

interface SessionInputProps {
  onSessionReady: (file: File) => void;
  isLoading: boolean;
}

export function SessionInput({ onSessionReady, isLoading }: SessionInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        onSessionReady(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
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

  return (
    <div className="flex flex-col gap-4">
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
            className="cursor-pointer"
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
        >
          {isRecording ? (
            <>
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Recording ({formatTime(recordingTime)})
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
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing session...
        </div>
      )}
    </div>
  );
} 