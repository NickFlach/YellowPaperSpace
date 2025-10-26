import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MuteControlProps {
  isMuted: boolean;
  isPlaying: boolean;
  onToggle: () => void;
  unlockAudio: () => void;
}

export function MuteControl({ isMuted, isPlaying, onToggle, unlockAudio }: MuteControlProps) {
  const handleClick = () => {
    unlockAudio();
    onToggle();
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      aria-label={isMuted ? "Unmute alert sounds" : "Mute alert sounds"}
      className={`
        relative
        ${isPlaying && !isMuted ? "animate-pulse-glow" : ""}
      `}
      data-testid="button-mute-toggle"
    >
      {isMuted ? (
        <VolumeX 
          className="w-5 h-5 text-muted-foreground" 
        />
      ) : (
        <Volume2 
          className={`
            w-5 h-5 
            ${isPlaying ? "text-neon-cyan" : "text-neon-green"}
          `}
          style={
            isPlaying 
              ? { filter: "drop-shadow(0 0 8px hsl(var(--neon-cyan)))" } 
              : undefined
          }
        />
      )}
    </Button>
  );
}
