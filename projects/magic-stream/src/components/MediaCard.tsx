
import React from 'react';
import { Play, Clock, MoreVertical, Plus, Volume2, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import AddToPlaylistButton from './AddToPlaylistButton';
import { PlaylistItem } from './PlaylistManager';

export interface MediaItemProps {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  type: 'video' | 'audio';
  artist?: string;
  album?: string;
  year?: string;
  src: string;
  onClick: (id: string) => void;
}

const MediaCard = ({ 
  id, 
  title, 
  thumbnail, 
  duration, 
  type, 
  artist, 
  album, 
  year, 
  src,
  onClick 
}: MediaItemProps) => {
  const playlistItem: PlaylistItem = {
    id,
    title,
    thumbnail,
    type,
    artist,
    src,
    duration
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
      onClick={() => onClick(id)}
    >
      {/* Thumbnail with overlay */}
      <div className="relative aspect-video md:aspect-square overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Dark overlay that gets darker on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* Play button that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-media-red/90 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>

        {/* Media type indicator */}
        <div className="absolute top-2 left-2 bg-black/60 rounded-md p-1">
          {type === 'audio' ? (
            <Volume2 size={14} className="text-media-silver" />
          ) : (
            <Film size={14} className="text-media-silver" />
          )}
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded-md text-xs font-medium text-media-silver flex items-center space-x-1">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 glassmorphism">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-white truncate">{title}</h3>
            {type === 'audio' && artist && (
              <p className="text-sm text-media-silver mt-1 truncate">{artist}</p>
            )}
            {type === 'audio' && album && (
              <p className="text-xs text-media-silver/70 mt-0.5 truncate">{album} {year ? `• ${year}` : ''}</p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 text-media-silver/70 hover:text-white rounded-full transition-colors">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-media-dark-gray border-media-light-gray text-white" align="end">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-media-light-gray/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(id);
                }}
              >
                <Play size={14} className="mr-2" />
                <span>Play</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer hover:bg-media-light-gray/20 focus:bg-transparent"
              >
                <AddToPlaylistButton item={playlistItem} variant="text" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

// Grid layout for media cards
export const MediaGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
      className
    )}>
      {children}
    </div>
  );
};

export default MediaCard;
