import { useCallback, useEffect, useState, useRef } from "react";

type AlertType = "warning" | "critical";

export function useAlertAudio() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const stored = localStorage.getItem("alert-audio-muted");
    return stored === "true";
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem("alert-audio-muted", isMuted.toString());
  }, [isMuted]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const unlockAudio = useCallback(async () => {
    const audioContext = getAudioContext();
    
    // Check if already unlocked (running state)
    if (audioContext.state === "running") {
      setIsUnlocked(true);
      return;
    }

    try {
      await audioContext.resume();
      setIsUnlocked(true);
    } catch (error) {
      console.warn("Failed to unlock audio context:", error);
    }
  }, [getAudioContext]);

  const playAlert = useCallback((type: AlertType) => {
    if (isMuted) return;

    const audioContext = getAudioContext();
    
    // Clear any existing timeout to prevent overlapping isPlaying bugs
    if (playingTimeoutRef.current !== null) {
      clearTimeout(playingTimeoutRef.current);
      playingTimeoutRef.current = null;
    }
    
    const frequency = type === "warning" ? 800 : 1200;
    const duration = type === "warning" ? 0.3 : 0.5;
    const volume = type === "warning" ? 0.15 : 0.25;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    const now = audioContext.currentTime;
    const fadeInTime = 0.02;
    const fadeOutTime = 0.05;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + fadeInTime);
    gainNode.gain.setValueAtTime(volume, now + duration - fadeOutTime);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);

    setIsPlaying(true);
    playingTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(false);
      playingTimeoutRef.current = null;
    }, duration * 1000);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }, [isMuted, getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    playAlert,
    isMuted,
    toggleMute,
    isPlaying,
    unlockAudio,
    isUnlocked,
  };
}
