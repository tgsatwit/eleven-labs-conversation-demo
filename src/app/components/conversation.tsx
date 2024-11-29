'use client';

import { useConversation } from '@11labs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { VoiceWave } from './voice-wave';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Updated interface to match the expected format
interface ConversationMessage {
  message: string;
  source: 'user' | 'ai';
}

export function Conversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
    onMessage: (props: { message: string; source: 'user' | 'ai' }) => {
      console.log('Received message:', props);
      setMessages(prev => [...prev, {
        role: props.source === 'ai' ? 'assistant' : 'user',
        content: props.message,
        timestamp: new Date()
      }]);
    },
    onError: (err: unknown) => {
      console.error('Error:', err);
      setError(typeof err === 'string' ? err : 'Connection error occurred');
      setIsLoading(false);
    },
    onUserInput: (text: string) => {
      console.log('User input:', text);
      setMessages(prev => [...prev, {
        role: 'user',
        content: text,
        timestamp: new Date()
      }]);
    }
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
    <div className="flex-1 flex flex-col gap-4">
      {/* Controls area */}
      <div className="bg-[#1A1D1E] rounded-lg p-4">
        <div className="flex flex-col items-center gap-3">
          {/* Voice wave */}
          <VoiceWave isActive={isConnected && !conversation.isSpeaking} />

          {/* Status text */}
          <p className="text-sm text-gray-400">
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
            <p className="text-sm text-red-400 bg-red-900/20 px-4 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* Microphone button */}
          <Button
            onClick={isConnected ? stopConversation : startConversation}
            disabled={isLoading}
            className={`
              h-14 w-14
              rounded-full 
              transition-all
              duration-300
              ${isConnected 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-[#2A2D2E] hover:bg-[#3A3D3E]'}
            `}
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
      </div>

      {/* Transcript area */}
      <div className="flex-1 min-h-[300px] bg-[#1A1D1E] rounded-lg p-4">
        <h2 className="text-gray-400 mb-4">Transcript:</h2>
        <div className="h-[calc(100%-2rem)] overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">
              Start a conversation to see messages here
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`
                    max-w-[85%] sm:max-w-[80%] 
                    px-4 py-2 
                    rounded-lg
                    text-sm
                    ${
                      message.role === 'user'
                        ? 'bg-[#2A2D2E] text-white'
                        : 'bg-[#1E2122] text-gray-200'
                    }
                  `}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
