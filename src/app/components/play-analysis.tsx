'use client';

import { useState, useEffect } from 'react';
import { Settings, Copy, Check, ArrowRight, Save, Share2, Users, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SessionInput } from './session-input';
import { SessionDisplay } from './session-display';
import { useTheme } from '@/context/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

interface Analysis {
  content: string;
  timestamp: Date;
  isFollowUp?: boolean;
}

interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  speaker?: string;
}

interface Transcription {
  text: string;
  segments: TranscriptionSegment[];
}

interface Interaction {
  id: string;
  analysis: Analysis;
  transcription: Transcription;
  timestamp: Date;
  isFollowUp: boolean;
  title?: string;
}

interface SessionMetadata {
  name: string;
  isPublic: boolean;
  createdAt: Date;
}

interface SavedSession {
  metadata: SessionMetadata;
  interactions: Interaction[];
}

interface ShareOption {
  id: string;
  label: string;
  description: string;
}

const shareOptions: ShareOption[] = [
  {
    id: 'private',
    label: 'Private',
    description: 'Only you can access this session'
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Share with your team members'
  },
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone with the link can access'
  }
];

type ShareOptionId = 'private' | 'team' | 'public';

interface SessionToSave {
  name: string;
  shareOption: ShareOptionId;
}

export function PlayAnalysis() {
  const { theme } = useTheme();
  const [currentInteractions, setCurrentInteractions] = useState<Interaction[]>([]);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingFollowUp, setIsRecordingFollowUp] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [isPublic, setIsPublic] = useState(false);
  const [showSaveSessionDialog, setShowSaveSessionDialog] = useState(false);
  const [sessionToSave, setSessionToSave] = useState<SessionToSave>({
    name: '',
    shareOption: 'private'
  });
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [activeSessionIndex, setActiveSessionIndex] = useState<number | null>(null);
  const [showNewSessionPrompt, setShowNewSessionPrompt] = useState(false);
  const [showDeleteCurrentDialog, setShowDeleteCurrentDialog] = useState(false);

  const generateDefaultSessionName = () => {
    const now = new Date();
    return `Play Session - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem('savedSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  }, []);

  const handleSessionReady = async (file: File) => {
    setIsLoading(true);
    try {
      // First, get the transcription
      const formData = new FormData();
      formData.append('file', file);

      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { transcription } = await transcriptionResponse.json();

      // Format the transcription for analysis
      const formattedTranscript = transcription.segments
        .map((segment: TranscriptionSegment) => `${segment.speaker || 'Speaker'}: ${segment.text}`)
        .join('\n');

      // Prepare analysis message based on whether this is a follow-up
      let analysisMessage = isRecordingFollowUp && currentInteractions.length > 0
        ? `This is a follow-up session to implement previous feedback. 
           
           Previous session transcript:
           ${currentInteractions[currentInteractions.length - 1].transcription.segments
             .map(segment => `${segment.speaker || 'Speaker'}: ${segment.text}`)
             .join('\n')}
           
           Previous analysis and feedback:
           ${currentInteractions[currentInteractions.length - 1].analysis.content}
           
           New session transcript:
           ${formattedTranscript}
           
           Please analyze this follow-up session, specifically:
           1. What feedback from the previous session was implemented?
           2. How did the child respond to these changes?
           3. What worked particularly well?
           4. What new opportunities for growth were observed?
           5. Provide specific suggestions for the next session.`
        : `Please analyze this play session transcript:\n\n${formattedTranscript}\n\nProvide feedback on the interaction patterns and language development opportunities observed.`;

      // Send the transcription for analysis
      const analysisResponse = await fetch('/api/play-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: analysisMessage })
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get analysis');
      }

      const data = await analysisResponse.json();
      
      const newInteraction = {
        id: crypto.randomUUID(),
        analysis: {
          content: data.message,
          timestamp: new Date(),
          isFollowUp: isRecordingFollowUp
        },
        transcription,
        timestamp: new Date(),
        isFollowUp: isRecordingFollowUp,
        title: `Interaction ${currentInteractions.length + 1}`
      };

      setCurrentInteractions(prev => [...prev, newInteraction]);
      setIsRecordingFollowUp(false);

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSession = () => {
    if (currentInteractions.length === 0) return;

    const newSession: SavedSession = {
      metadata: {
        name: sessionName || generateDefaultSessionName(),
        isPublic,
        createdAt: new Date(),
      },
      interactions: currentInteractions,
    };

    const updatedSessions = [...savedSessions, newSession];
    setSavedSessions(updatedSessions);
    localStorage.setItem('savedSessions', JSON.stringify(updatedSessions));
    
    // Reset current session
    setCurrentInteractions([]);
    setSessionName('');
    setIsPublic(false);
    setShowSaveDialog(false);
  };

  const startFollowUpSession = () => {
    setIsRecordingFollowUp(true);
  };

  const handleTranscriptUpdate = (text: string, isComplete: boolean) => {
    if (!isComplete) {
      setLiveTranscript(prev => prev + ' ' + text);
    }
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
    if (!recording) {
      setLiveTranscript('');
    }
  };

  const handleSaveEntireSession = async () => {
    try {
      // Here we'll save the session data including audio clips
      // This will be implemented when we add Firebase integration
      const sessionData = {
        name: sessionToSave.name || generateDefaultSessionName(),
        shareOption: sessionToSave.shareOption,
        interactions: currentInteractions,
        savedAt: new Date()
      };

      // For now, just save to localStorage
      const savedSessions = JSON.parse(localStorage.getItem('savedSessions') || '[]');
      savedSessions.push(sessionData);
      localStorage.setItem('savedSessions', JSON.stringify(savedSessions));

      // Reset the form
      setSessionToSave({
        name: '',
        shareOption: 'private'
      });
      setShowSaveSessionDialog(false);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleRenameInteraction = (interactionId: string, newTitle: string) => {
    setCurrentInteractions(prev =>
      prev.map(interaction =>
        interaction.id === interactionId
          ? { ...interaction, title: newTitle }
          : interaction
      )
    );
  };

  const handleDeleteInteraction = (interactionId: string) => {
    setCurrentInteractions(prev =>
      prev.filter(interaction => interaction.id !== interactionId)
    );
  };

  const handleDeleteSession = (sessionIndex: number) => {
    const updatedSessions = savedSessions.filter((_, idx) => idx !== sessionIndex);
    setSavedSessions(updatedSessions);
    localStorage.setItem('savedSessions', JSON.stringify(updatedSessions));
    setSessionToDelete(null);
  };

  const startNewSession = () => {
    if (currentInteractions.length > 0) {
      setShowNewSessionPrompt(true);
    } else {
      setCurrentInteractions([]);
      setActiveSessionIndex(null);
    }
  };

  const handleSaveAndStartNew = () => {
    setShowSaveSessionDialog(true);
    setShowNewSessionPrompt(false);
  };

  const handleDiscardAndStartNew = () => {
    setCurrentInteractions([]);
    setActiveSessionIndex(null);
    setShowNewSessionPrompt(false);
  };

  const continueSession = (sessionIndex: number) => {
    setActiveSessionIndex(sessionIndex);
    setCurrentInteractions(savedSessions[sessionIndex].interactions);
  };

  const handleDeleteCurrentSession = () => {
    setCurrentInteractions([]);
    setActiveSessionIndex(null);
    setShowDeleteCurrentDialog(false);
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 lg:max-w-[800px]">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">
            {activeSessionIndex !== null 
              ? savedSessions[activeSessionIndex].metadata.name
              : "Play Session Analysis"
            }
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {currentInteractions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startNewSession}
              className={theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-400' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
            >
              New Session
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className={theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-400' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {currentInteractions.length === 0 && (
          <div className={`rounded-lg p-4 transition-colors duration-200
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
          >
            <SessionInput 
              onSessionReady={handleSessionReady}
              onTranscriptUpdate={handleTranscriptUpdate}
              onRecordingStateChange={handleRecordingStateChange}
              isLoading={isLoading}
            />
            {isRecording && liveTranscript && (
              <div className="mt-4">
                <h2 className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Live Transcription:
                </h2>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  {liveTranscript}
                </div>
              </div>
            )}
          </div>
        )}

        {currentInteractions.length > 0 && (
          <div className={`rounded-lg p-4 transition-colors duration-200
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Current Session</h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  variant="ghost"
                  size="icon"
                  className={theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-400' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setShowDeleteCurrentDialog(true)}
                  variant="ghost"
                  size="icon"
                  className={theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-400' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {currentInteractions.map((interaction, index) => (
                <div key={interaction.id} className="space-y-4">
                  <SessionDisplay
                    title={interaction.title || `Interaction ${index + 1}`}
                    interaction={interaction}
                    onRename={(newTitle) => handleRenameInteraction(interaction.id, newTitle)}
                    onDelete={() => handleDeleteInteraction(interaction.id)}
                  />
                  {isRecordingFollowUp && index === currentInteractions.length - 1 && (
                    <div className={`border-l-2 border-blue-500 pl-4 ml-4 transition-colors duration-200
                      ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50'}`}
                    >
                      <div className="text-sm text-blue-400 mb-2">Recording Follow-up Interaction</div>
                      <SessionInput 
                        onSessionReady={handleSessionReady}
                        onTranscriptUpdate={handleTranscriptUpdate}
                        onRecordingStateChange={handleRecordingStateChange}
                        isLoading={isLoading}
                      />
                      {isRecording && liveTranscript && (
                        <div className="mt-4">
                          <h2 className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Live Transcription:
                          </h2>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            {liveTranscript}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className={`rounded-lg p-6 max-w-md w-full transition-colors duration-200
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className="text-lg font-semibold mb-4">Save Session</h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Session Name
                  </label>
                  <input
                    type="text"
                    placeholder={generateDefaultSessionName()}
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border transition-colors duration-200
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-400'}`}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className={`text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Make this session visible to others
                  </label>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSaveDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Sessions */}
        {savedSessions.map((session, sessionIndex) => (
          <div key={sessionIndex} className={`rounded-lg p-4 transition-colors duration-200
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{session.metadata.name}</h2>
              <div className="flex items-center gap-2">
                {session.metadata.isPublic && (
                  <span className="text-sm text-gray-400">Public</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => continueSession(sessionIndex)}
                  className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  disabled={activeSessionIndex === sessionIndex}
                >
                  {activeSessionIndex === sessionIndex ? 'Current Session' : 'Continue Session'}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => setSessionToDelete(sessionIndex)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {session.interactions.map((interaction, interactionIndex) => (
                <SessionDisplay
                  key={interaction.id}
                  title={interaction.title || `Interaction ${interactionIndex + 1}`}
                  interaction={interaction}
                  onRename={(newTitle) => {
                    const updatedSessions = savedSessions.map((s, idx) =>
                      idx === sessionIndex
                        ? {
                            ...s,
                            interactions: s.interactions.map(i =>
                              i.id === interaction.id ? { ...i, title: newTitle } : i
                            ),
                          }
                        : s
                    );
                    setSavedSessions(updatedSessions);
                    localStorage.setItem('savedSessions', JSON.stringify(updatedSessions));
                  }}
                  onDelete={() => {
                    const updatedSessions = savedSessions.map((s, idx) =>
                      idx === sessionIndex
                        ? {
                            ...s,
                            interactions: s.interactions.filter(i => i.id !== interaction.id),
                          }
                        : s
                    );
                    setSavedSessions(updatedSessions);
                    localStorage.setItem('savedSessions', JSON.stringify(updatedSessions));
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Follow-up Button */}
        {currentInteractions.length > 0 && !isRecordingFollowUp && (
          <Button
            onClick={startFollowUpSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
          >
            Record Follow-up Session
          </Button>
        )}

        {/* Delete Session Confirmation Dialog */}
        <AlertDialog open={sessionToDelete !== null} onOpenChange={() => setSessionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this session? This action cannot be undone.
                All interactions within this session will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => sessionToDelete !== null && handleDeleteSession(sessionToDelete)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* New Session Prompt Dialog */}
        <AlertDialog open={showNewSessionPrompt} onOpenChange={setShowNewSessionPrompt}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Current Session?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved interactions in your current session. Would you like to save them before starting a new session?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDiscardAndStartNew}>
                Discard and Start New
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveAndStartNew}>
                Save First
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Update the Save Session Dialog */}
        <Dialog open={showSaveSessionDialog} onOpenChange={setShowSaveSessionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Session Name
                </label>
                <input
                  type="text"
                  placeholder={generateDefaultSessionName()}
                  value={sessionToSave.name}
                  onChange={(e) => setSessionToSave(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-md text-sm border transition-colors duration-200
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-400'}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Share With
                </label>
                <Select
                  value={sessionToSave.shareOption}
                  onValueChange={(value: ShareOptionId) => setSessionToSave(prev => ({ ...prev, shareOption: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shareOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center gap-2">
                          {option.id === 'private' && <Users className="h-4 w-4" />}
                          {option.id === 'team' && <Users className="h-4 w-4" />}
                          {option.id === 'public' && <Share2 className="h-4 w-4" />}
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                By saving this session, you consent to this information being stored on your profile.
                This data will be used in accordance with our privacy policy.
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowSaveSessionDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEntireSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Delete Current Session Dialog */}
        <AlertDialog open={showDeleteCurrentDialog} onOpenChange={setShowDeleteCurrentDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Current Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the current session? This action cannot be undone.
                All current interactions will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCurrentSession}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
