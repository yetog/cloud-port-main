
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, 
  MoreHorizontal, Heart, Share2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { musicData } from '@/lib/mediaUtils';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist: string;
  album?: string;
  coverArt: string;
  onClose?: () => void;
  autoPlay?: boolean;
  currentIndex?: number;
}

const AudioPlayer = ({ 
  src, 
  title, 
  artist, 
  album, 
  coverArt, 
  onClose, 
  autoPlay = false,
  currentIndex = 0
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(currentIndex);

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play().catch(() => setIsPlaying(false));
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNext();
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [autoPlay, isRepeat, src]);

  // Play/Pause function
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // Volume functions
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle next track
  const handleNext = () => {
    if (isShuffle) {
      // Play a random track
      const randomIndex = Math.floor(Math.random() * musicData.length);
      if (onClose) {
        // In modal mode, we close and let parent component handle the change
        setIsPlaying(false);
        onClose();
        // We would typically pass the new track ID back to the parent
        // but for simplicity, we're just closing the modal
        toast.info("Next track would play (Shuffle mode)");
      } else {
        // Direct mode - we handle the change
        setCurrentMusicIndex(randomIndex);
        // This would require changing src, but we're just showing a toast
        toast.info("Next random track would play");
      }
    } else {
      // Play the next track in sequence
      const nextIndex = (currentMusicIndex + 1) % musicData.length;
      if (onClose) {
        // In modal mode
        setIsPlaying(false);
        onClose();
        toast.info("Next track would play");
      } else {
        // Direct mode
        setCurrentMusicIndex(nextIndex);
        toast.info("Next track would play");
      }
    }
  };

  // Handle previous track
  const handlePrevious = () => {
    const prevIndex = (currentMusicIndex - 1 + musicData.length) % musicData.length;
    if (onClose) {
      // In modal mode
      setIsPlaying(false);
      onClose();
      toast.info("Previous track would play");
    } else {
      // Direct mode
      setCurrentMusicIndex(prevIndex);
      toast.info("Previous track would play");
    }
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this song: ${title} by ${artist}`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => {
        console.error("Error sharing:", error);
        toast.error("Couldn't share the song");
      });
    } else {
      // Fallback if Web Share API is not available
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Couldn't copy the link"));
    }
  };

  return (
    <div className="w-full bg-media-dark-gray rounded-xl overflow-hidden shadow-lg animate-fade-in">
      <audio ref={audioRef} src={src}></audio>

      <div className="flex flex-col md:flex-row">
        {/* Cover Art Section */}
        <div className="relative w-full md:w-1/3 aspect-square overflow-hidden">
          <img 
            src={coverArt} 
            alt={`${title} by ${artist}`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isPlaying ? "scale-105" : ""
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Mobile Track Info (visible on small screens) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-media-silver">{artist}</p>
            {album && <p className="text-xs text-media-silver/70 mt-1">{album}</p>}
          </div>
        </div>

        {/* Player Controls Section */}
        <div className="p-5 flex flex-col w-full md:w-2/3 bg-gradient-to-br from-media-black to-media-dark-gray">
          {/* Track Info (hidden on small screens) */}
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
                <p className="text-media-silver">{artist}</p>
                {album && <p className="text-sm text-media-silver/70 mt-1">{album}</p>}
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isLiked ? "text-media-red" : "text-media-silver hover:text-white"
                  )}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button 
                  className="p-2 text-media-silver hover:text-white rounded-full transition-colors"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                </button>
                <button className="p-2 text-media-silver hover:text-white rounded-full transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group mb-4"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-media-red rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-xs text-media-silver mb-5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button 
              onClick={() => setIsShuffle(!isShuffle)}
              className={cn(
                "text-media-silver p-2 rounded-full transition-colors",
                isShuffle ? "text-media-gold" : "hover:text-white"
              )}
            >
              <Shuffle size={20} />
            </button>
            <button 
              onClick={handlePrevious}
              className="text-media-silver hover:text-white p-2 rounded-full transition-colors"
            >
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center bg-media-red rounded-full shadow-lg transform transition-transform hover:scale-105 text-white"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-media-silver hover:text-white p-2 rounded-full transition-colors"
            >
              <SkipForward size={24} />
            </button>
            <button 
              onClick={() => setIsRepeat(!isRepeat)}
              className={cn(
                "text-media-silver p-2 rounded-full transition-colors",
                isRepeat ? "text-media-gold" : "hover:text-white"
              )}
            >
              <Repeat size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center mt-auto">
            <button 
              onClick={toggleMute}
              className="text-media-silver hover:text-white mr-2"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full max-w-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
