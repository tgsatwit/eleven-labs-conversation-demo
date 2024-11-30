'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Mic, MicOff, Loader2, Copy, Check, MessageSquare, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceWave } from './voice-wave';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function PlayAnalysis() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

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

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }]);

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const isConnected = conversation.status === 'connected';

  const handleSuggestionClick = async (suggestion: string) => {
    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: suggestion,
      timestamp: new Date()
    }]);

    if (isVoiceMode) {
      // For voice mode, make sure we're connected first
      if (conversation.status !== 'connected') {
        await startConversation();
      }
      // The message will be handled through the onMessage callback
      // that's already set up in useConversation
    } else {
      // For text mode
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: suggestion })
        });

        if (!response.ok) throw new Error('Failed to get AI response');

        const data = await response.json();
        
        // Add AI response
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Chat error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 lg:max-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          
          <h1 className="text-lg sm:text-xl font-semibold">Play Analzer</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVoiceMode(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                isVoiceMode ? 'bg-[#2A2D2E] text-white' : 'text-gray-400'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              Voice
            </button>
            <button
              onClick={() => setIsVoiceMode(false)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                !isVoiceMode ? 'bg-[#2A2D2E] text-white' : 'text-gray-400'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Text
            </button>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Suggested prompts */}
        <div className="relative">
          <button
            onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <span>Need suggestions?</span>
            {isSuggestionsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {isSuggestionsOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-[#1A1D1E] rounded-lg shadow-lg border border-gray-800 z-10">
              <div className="grid grid-cols-1 gap-2">
                {[
                  "How can I simplify my phrases?",
                  "Tips for following my child's lead",
                  "Ways to encourage echoing",
                  "Strategies for play-based learning",
                  "How to pause effectively"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      handleSuggestionClick(suggestion);
                      setIsSuggestionsOpen(false); // Close dropdown after selection
                    }}
                    className="text-left px-3 py-2 rounded-lg hover:bg-[#2A2D2E] text-sm text-gray-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls area */}
        <div className="bg-[#1A1D1E] rounded-lg p-3">
          <div className="flex items-center justify-center gap-3">
            {isVoiceMode ? (
              // Voice controls - horizontal layout with reversed order
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={isConnected ? stopConversation : startConversation}
                    className={`
                      h-12 w-12
                      rounded-full 
                      transition-all
                      duration-300
                      ${isConnected 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-white hover:bg-gray-100 text-gray-900'}
                      shadow-md
                    `}
                  >
                    {isConnected ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                  <p className="text-sm text-gray-400">
                    {isConnected 
                      ? conversation.isSpeaking
                        ? 'Assistant is speaking...'
                        : 'Listening to you...'
                      : 'Click to start conversation'}
                  </p>
                </div>
                <div className="flex-1 flex justify-end">
                  <VoiceWave 
                    isActive={isConnected && !conversation.isSpeaking}
                    isSpeaking={conversation.isSpeaking}
                    className={conversation.isSpeaking ? 'text-blue-400' : undefined}
                  />
                </div>
              </div>
            ) : (
              // Text input controls - more compact
              <form onSubmit={handleTextSubmit} className="w-full max-w-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-[#2A2D2E] text-white border border-gray-700 focus:outline-none focus:border-gray-500 text-left"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !inputText.trim()}
                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium min-w-[100px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Send'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Transcript area */}
        <div className="flex-1 min-h-[200px] bg-[#1A1D1E] rounded-lg p-3">
          <h2 className="text-gray-400 mb-3 text-sm">Transcript:</h2>
          <div className="h-[calc(100%-2rem)] overflow-y-auto space-y-3">
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
    </div>
  );
}
