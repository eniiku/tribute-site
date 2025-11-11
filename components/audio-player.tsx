"use client"

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState([30]);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Remember mute state in localStorage
  useEffect(() => {
    const savedMute = localStorage.getItem("audioMuted");
    if (savedMute !== null) {
      setIsMuted(savedMute === "true");
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (isMuted) {
          setIsMuted(false);
          audioRef.current.muted = false;
          localStorage.setItem("audioMuted", "false");
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      localStorage.setItem("audioMuted", String(newMuted));
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      if (value[0] > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
        localStorage.setItem("audioMuted", "false");
      }
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-smooth",
        isVisible ? "animate-fade-in" : "opacity-0 pointer-events-none"
      )}
      role="region"
      aria-label="Audio player"
    >
      <div className="backdrop-blur-md bg-card/90 border border-border/50 rounded-full shadow-soft px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          className="h-10 w-10 rounded-full hover:bg-primary/10"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
          ) : (
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
          )}
        </Button>

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="h-10 w-10 rounded-full hover:bg-primary/10"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>

        <div className="w-20">
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            aria-label="Volume control"
            className="cursor-pointer"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        aria-label="Background music player"
      >
        <source src="/audio/memorial-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
