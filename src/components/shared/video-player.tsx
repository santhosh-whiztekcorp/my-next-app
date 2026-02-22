'use client';

import * as React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  title?: string;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = false,
  title,
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(muted);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const togglePlay = React.useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative aspect-video w-full overflow-hidden rounded-2xl bg-black transition-all',
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="size-full cursor-pointer"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        onClick={togglePlay}
        playsInline
      />

      {/* Overlays */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300',
          isPlaying ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div
          className="pointer-events-auto flex size-20 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
          onClick={togglePlay}
        >
          <Play className="ml-1 size-8 fill-current" />
        </div>
      </div>

      {/* Controls Container */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 transition-all duration-500',
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Progress Slider */}
          <div className="group/slider relative flex items-center">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={togglePlay}>
                {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="text-[13px] font-medium text-white/90 tabular-nums">
                {formatTime(currentTime)} <span className="text-white/40">/</span> {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {title && (
                <div className="mr-4 line-clamp-1 max-w-[200px] text-sm font-medium text-white/60">{title}</div>
              )}
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
