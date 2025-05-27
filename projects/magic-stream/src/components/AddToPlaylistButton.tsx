
import React, { useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaylistItem, AddToPlaylistContext } from '@/components/PlaylistManager';

interface AddToPlaylistButtonProps {
  item: PlaylistItem;
  variant?: 'icon' | 'text';
}

const AddToPlaylistButton = ({ item, variant = 'icon' }: AddToPlaylistButtonProps) => {
  const { openAddToPlaylist } = useContext(AddToPlaylistContext);
  
  if (variant === 'icon') {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          openAddToPlaylist(item);
        }}
        className="p-2 text-media-silver hover:text-white hover:bg-media-light-gray/20 rounded-full"
      >
        <PlusCircle size={18} />
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        openAddToPlaylist(item);
      }}
      className="bg-transparent border-media-light-gray text-media-silver hover:text-white"
    >
      <PlusCircle size={14} className="mr-2" />
      Add to Playlist
    </Button>
  );
};

export default AddToPlaylistButton;
