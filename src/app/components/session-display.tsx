'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

interface Interaction {
  id: string;
  analysis: {
    content: string;
    timestamp: Date;
  };
  transcription: {
    segments: Array<{
      text: string;
      start: number;
      end: number;
      speaker?: string;
    }>;
  };
  timestamp: Date;
  title?: string;
}

interface SessionDisplayProps {
  title: string;
  interaction: Interaction;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}

export function SessionDisplay({ title, interaction, onRename, onDelete }: SessionDisplayProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(interaction.analysis.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(newTitle);
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewTitle(title);
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden transition-colors duration-200
      ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      <div className={`w-full p-4 flex items-center justify-between text-left transition-colors
        ${theme === 'dark' 
          ? 'hover:bg-gray-700' 
          : 'hover:bg-gray-100'}`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1"
        >
          <div className="flex items-center gap-2">
            {isRenaming ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                className={`px-2 py-1 rounded text-sm transition-colors duration-200
                  ${theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'}`}
                autoFocus
              />
            ) : (
              <h2 className={`text-sm font-medium
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}
              >
                {title}
              </h2>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          ) : (
            <ChevronDown className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          )}
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={`w-[160px] border transition-colors duration-200
              ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'}`}
          >
            <DropdownMenuItem 
              onClick={() => setIsRenaming(true)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer
                ${theme === 'dark'
                  ? 'hover:bg-gray-700 focus:bg-gray-700'
                  : 'hover:bg-gray-100 focus:bg-gray-100'}`}
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm">Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className={`flex items-center gap-2 px-3 py-2 text-red-500 cursor-pointer
                ${theme === 'dark'
                  ? 'hover:bg-gray-700 focus:bg-gray-700'
                  : 'hover:bg-gray-100 focus:bg-gray-100'}`}
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && (
        <div className={`p-4 border-t transition-colors duration-200
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        >
          {/* Transcription */}
          <div className="mb-4">
            <h3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              Transcription:
            </h3>
            <div className="space-y-2 text-sm">
              {interaction.transcription.segments.map((segment, index) => (
                <div key={index} className="flex gap-2">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {new Date(segment.start * 1000).toISOString().substr(14, 5)}
                  </span>
                  <span className="text-blue-500 min-w-[80px]">
                    {segment.speaker || 'Speaker'}:
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                    {segment.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                Analysis:
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className={`whitespace-pre-wrap text-sm
              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
            >
              {interaction.analysis.content}
            </div>
            <p className={`text-[10px] mt-2
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {new Date(interaction.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 