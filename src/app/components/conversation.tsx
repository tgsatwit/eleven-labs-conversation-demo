'use client';

import { useConversation } from '@11labs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { VoiceWave } from './voice-wave';

export function Conversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsLoading(false);
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsLoading(false);
      setError(null);
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (err) => {
      console.error('Error:', err);
      setError(typeof err === 'string' ? err : 'Connection error occurred');
      setIsLoading(false);
    },
  });

  const startConversation = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Starting conversation...');
    
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

      // Get signed URL
      const response = await fetch('/api/get-signed-url');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get connection URL');
      }

      console.log('Starting session...');
      await conversation.startSession({
        signedUrl: data.signedUrl,
      });
      
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError(error instanceof Error ? error.message : 'Failed to start conversation');
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    setIsLoading(true);
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to stop conversation:', error);
      setError(error instanceof Error ? error.message : 'Failed to stop conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = conversation.status === 'connected';

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Background pulse effect */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                isConnected
                  ? 'bg-green-500/20 animate-pulse scale-110'
                  : 'bg-slate-100 scale-100'
              }`}
            />
            
            {/* Button */}
            <Button
              onClick={isConnected ? stopConversation : startConversation}
              disabled={isLoading}
              className={`
                h-16 w-16 rounded-full 
                relative z-10
                transition-transform
                hover:scale-105
                active:scale-95
              `}
              variant={isConnected ? "destructive" : "default"}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isConnected ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Voice wave animation */}
          <VoiceWave isActive={isConnected && !conversation.isSpeaking} />

          {/* Status text */}
          <p className="text-sm text-center font-medium">
            {isLoading 
              ? 'Connecting...' 
              : isConnected
                ? conversation.isSpeaking
                  ? 'Assistant is speaking...'
                  : 'Listening to you...'
                : 'Click to start conversation'}
          </p>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-md">
              {error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
