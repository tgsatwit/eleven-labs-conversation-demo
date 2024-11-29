'use client';

interface VoiceWaveProps {
  isActive: boolean;
}

export function VoiceWave({ isActive }: VoiceWaveProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            w-1.5 
            rounded-full 
            transition-all 
            duration-300 
            ${isActive 
              ? 'bg-green-500 animate-voice-wave' 
              : 'h-1 bg-muted-foreground/20'
            }
          `}
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
} 