'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Copy, Check } from 'lucide-react';
import { VoiceWave } from './voice-wave';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function Conversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: any) => {
      console.log('Received message:', message);
      // Handle both message formats from the API
      const messageText = message.message || message.text || '';
      const source = message.source || 'ai';
      
      if (messageText) {
        setMessages(prev => [...prev, {
          role: source === 'ai' ? 'assistant' : 'user',
          content: messageText,
          timestamp: new Date()
        }]);
      }
    },
    onError: (error: unknown) => console.error('Error:', error),
    onUserInput: (text: string) => {
      console.log('User input:', text);
      setMessages(prev => [...prev, {
        role: 'user',
        content: text,
        timestamp: new Date()
      }]);
    }
  });

  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch("/api/get-signed-url");
    if (!response.ok) {
      throw new Error(`Failed to get signed url: ${response.statusText}`);
    }
    const { signedUrl } = await response.json();
    return signedUrl;
  };

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const signedUrl = await getSignedUrl();

      // Start the conversation with your signed url
      await conversation.startSession({
        signedUrl,
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === 'connected';

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Controls area */}
      <div className="bg-[#1A1D1E] rounded-lg p-4">
        <div className="flex flex-col items-center gap-3">
          <VoiceWave isActive={isConnected && !conversation.isSpeaking} />

          <p className="text-sm text-gray-400">
            {isConnected 
              ? conversation.isSpeaking
                ? 'Assistant is speaking...'
                : 'Listening to you...'
              : 'Click to start conversation'}
          </p>

          <Button
            onClick={isConnected ? stopConversation : startConversation}
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
            {isConnected ? (
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
                    group
                    relative
                    ${
                      message.role === 'user'
                        ? 'bg-[#2A2D2E] text-white'
                        : 'bg-[#1E2122] text-gray-200'
                    }
                  `}
                >
                  <p className="text-sm break-words pr-6">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy response"
                      >
                        {copiedMessageId === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
