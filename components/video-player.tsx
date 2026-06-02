"use client";

import { useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function VideoPlayer({ src, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setIsPlaying(true);
      video.play().catch(() => setIsPlaying(false));
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  function seek(value: string) {
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  async function openFullscreen() {
    const video = videoRef.current;
    if (!video?.parentElement || !document.fullscreenEnabled) return;
    await video.parentElement.requestFullscreen();
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden bg-bg-subtle",
        className,
      )}
    >
      <video
        key={src}
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        className="h-full w-full object-cover"
        onClick={togglePlay}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setCurrentTime(0);
          setIsPlaying(false);
        }}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {!isPlaying ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-text/25 text-text shadow-(--shadow-md) backdrop-blur transition-colors hover:bg-text/35 focus-visible:shadow-(--focus-ring)"
        >
          <Play className="h-6 w-6 fill-current" />
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-bg/90 via-bg/55 to-transparent px-3 pb-3 pt-10 opacity-100 transition-opacity duration-200 sm:px-4 group-hover:opacity-100">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-text-secondary">
          <span className="tabular-nums text-text">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(event) => seek(event.target.value)}
            aria-label="Seek video"
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-surface-raised accent-text"
            style={{
              background: `linear-gradient(to right, var(--text) ${progress}%, var(--surface-raised) ${progress}%)`,
            }}
          />
          <span className="tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-text ring-1 ring-border transition-colors hover:bg-surface-raised focus-visible:shadow-(--focus-ring)"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-text ring-1 ring-border transition-colors hover:bg-surface-raised focus-visible:shadow-(--focus-ring)"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={openFullscreen}
            aria-label="Open fullscreen"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-text ring-1 ring-border transition-colors hover:bg-surface-raised focus-visible:shadow-(--focus-ring)"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
