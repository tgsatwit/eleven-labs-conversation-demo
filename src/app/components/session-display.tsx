'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
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
    <div className="bg-[#1A1D1E] rounded-lg overflow-hidden">
      <div className="w-full p-4 flex items-center justify-between text-left hover:bg-[#2A2D2E] transition-colors">
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
                className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                autoFocus
              />
            ) : (
              <h2 className="text-sm font-medium text-gray-200">{title}</h2>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] bg-[#1A1D1E] border border-gray-800">
            <DropdownMenuItem 
              onClick={() => setIsRenaming(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm">Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-800">
          {/* Transcription */}
          <div className="mb-4">
            <h3 className="text-gray-400 text-sm mb-3">Transcription:</h3>
            <div className="space-y-2 text-sm text-gray-200">
              {interaction.transcription.segments.map((segment, index) => (
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
              {interaction.analysis.content}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              {new Date(interaction.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 