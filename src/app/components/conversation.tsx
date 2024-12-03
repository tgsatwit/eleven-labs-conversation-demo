'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Mic, MicOff, Loader2, Copy, Check, MessageSquare, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceWave } from './voice-wave';
import { useTheme } from '@/context/ThemeContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function Conversation() {
  const { theme } = useTheme();
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
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className={`text-lg sm:text-xl font-semibold
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Gestalt Language Assistant
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVoiceMode(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors duration-200 ${
                isVoiceMode 
                  ? theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-900'
                  : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              Voice
            </button>
            <button
              onClick={() => setIsVoiceMode(false)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors duration-200 ${
                !isVoiceMode 
                  ? theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-900'
                  : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Text
            </button>
          </div>
        </div>
      </div>

      {/* Main content area with flex-1 to take remaining space */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Suggestions */}
        <div className="relative mb-4">
          <button
            onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
            className={`flex items-center gap-2 text-xs sm:text-sm transition-colors duration-200
              ${theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>Need suggestions?</span>
            {isSuggestionsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {isSuggestionsOpen && (
            <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-lg shadow-lg border z-10
              transition-colors duration-200
              ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'}`}
            >
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
                      setIsSuggestionsOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200
                      ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls area */}
        <div className={`mb-4 rounded-lg p-3 transition-colors duration-200
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
        >
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

            <form onSubmit={handleTextSubmit} className="w-full">
              <div className={`flex items-stretch gap-2 p-2 rounded-lg transition-colors duration-200 w-full
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 min-w-0 bg-transparent border-0 focus:ring-0 text-sm px-3
                    ${theme === 'dark' ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'}`}
                />
                <Button 
                  type="submit" 
                  disabled={!inputText.trim() || isLoading}
                  className={`h-10 w-10 flex items-center justify-center rounded-md
                    ${theme === 'dark' 
                      ? 'bg-white hover:bg-gray-100 text-gray-900' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>
    
            )}
          </div>
        </div>

        {/* Transcript area - takes remaining height */}
        <div className={`flex-1 rounded-lg transition-colors duration-200 overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
        >
          <div className="h-full overflow-y-auto custom-scrollbar">
            {messages.length === 0 ? (
              <div className={`h-full flex flex-col items-center justify-center p-4 text-center
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">Start a conversation by speaking or typing your message.</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`group max-w-[80%] text-sm
                      ${message.role === 'assistant'
                        ? theme === 'dark'
                          ? 'bg-gray-700'
                          : 'bg-gray-100'
                        : theme === 'dark'
                          ? 'bg-indigo-600'
                          : 'bg-indigo-500'
                      } rounded-lg p-3`}
                    >
                      <div className={`mb-1 flex items-center gap-2
                        ${message.role === 'assistant'
                          ? theme === 'dark'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                          : 'text-white'}`}
                      >
                        <span className="font-medium">
                          {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                        </span>
                        <span className={`text-xs
                          ${message.role === 'assistant'
                            ? theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                            : 'text-indigo-100'}`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        <button
                          onClick={() => copyToClipboard(message.content, index)}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ml-auto
                            ${message.role === 'assistant'
                              ? theme === 'dark'
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-500 hover:text-gray-700'
                              : 'text-indigo-100 hover:text-white'}`}
                        >
                          {copiedMessageId === index ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className={message.role === 'assistant'
                        ? theme === 'dark'
                          ? 'text-gray-100'
                          : 'text-gray-800'
                        : 'text-white'}
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
