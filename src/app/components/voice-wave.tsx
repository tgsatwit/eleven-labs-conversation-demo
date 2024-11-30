'use client';

interface VoiceWaveProps {
  isActive: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export function VoiceWave({ isActive, isSpeaking, className }: VoiceWaveProps) {
  return (
    <div className={`flex items-center gap-1 h-6 pr-4 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            w-2 rounded-full
            transition-all duration-300
            ${isActive || isSpeaking
              ? 'animate-voice-wave bg-current' 
              : 'h-2 bg-gray-600 animate-none'}
            animation-delay-${i}
          `}
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
} 