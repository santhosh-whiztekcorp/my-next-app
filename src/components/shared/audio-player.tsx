'use client';

import * as React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Repeat, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  coverArt?: string;
  className?: string;
  autoPlay?: boolean;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export function AudioPlayer({
  src,
  title = 'Unknown Track',
  artist = 'Unknown Artist',
  coverArt,
  className,
  autoPlay = false,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.8);
  const [isMuted, setIsMuted] = React.useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  return (
    <div className={cn('bg-background border-border w-full max-w-2xl rounded-3xl border p-6', className)}>
      <div className="flex items-center gap-6">
        {/* Cover Art / Icon */}
        <div className="group relative">
          <div
            className={cn(
              'flex size-24 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500',
              isPlaying && 'ring-primary/20 scale-105 ring-4',
            )}
          >
            {coverArt ? (
              <Image src={coverArt} alt={title} fill className="object-cover" unoptimized />
            ) : (
              <Music className={cn('size-10', isPlaying && 'animate-bounce')} />
            )}
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold tracking-tight">{title}</h3>
            <p className="text-muted-foreground line-clamp-1 text-sm font-medium">{artist}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="text-muted-foreground flex justify-between text-[11px] font-bold tracking-widest uppercase tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground size-9">
                <Shuffle className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-9">
                <SkipBack className="size-5 fill-current" />
              </Button>
              <Button
                onClick={togglePlay}
                size="icon"
                className="size-12 rounded-full transition-transform hover:scale-110 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="size-6 fill-current" />
                ) : (
                  <Play className="size-6 translate-x-0.5 fill-current" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="size-9">
                <SkipForward className="size-5 fill-current" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground size-9">
                <Repeat className="size-4" />
              </Button>
            </div>

            <div className="group/volume flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary size-9 transition-colors"
                onClick={() => {
                  const newMute = !isMuted;
                  setIsMuted(newMute);
                  if (audioRef.current) audioRef.current.muted = newMute;
                }}
              >
                {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </Button>
              <div className="w-20 transition-all group-hover:w-28">
                <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
