
import React, { useState, useEffect } from 'react';
import { 
  Folder, FolderPlus, Edit2, Trash2, List, X, Check, 
  Play, MoreVertical, Music, Film 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface PlaylistItem {
  id: string;
  title: string;
  thumbnail: string;
  type: 'audio' | 'video';
  artist?: string;
  src: string;
  duration?: string;
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
  type: 'audio' | 'video' | 'mixed';
  createdAt: number;
}

interface PlaylistManagerProps {
  type: 'audio' | 'video';
  mediaItems: PlaylistItem[];
  onPlayPlaylist: (playlist: Playlist, startIndex: number) => void;
}

const PlaylistManager = ({ type, mediaItems, onPlayPlaylist }: PlaylistManagerProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  
  // Load playlists from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('mediaPlaylists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);
  
  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mediaPlaylists', JSON.stringify(playlists));
  }, [playlists]);
  
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      items: [],
      type: type,
      createdAt: Date.now()
    };
    
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    toast.success(`Playlist "${newPlaylistName.trim()}" created`);
  };
  
  const deletePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
    toast.success("Playlist deleted");
  };
  
  const renamePlaylist = (playlistId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }
    
    setPlaylists(playlists.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, name: newName.trim() } 
        : playlist
    ));
    
    setEditingPlaylist(null);
    toast.success("Playlist renamed");
  };
  
  const addToPlaylist = (playlistId: string, mediaItem: PlaylistItem) => {
    // Find the playlist
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    // Check if the item is already in the playlist
    if (playlist.items.some(item => item.id === mediaItem.id)) {
      toast.info("This item is already in the playlist");
      return;
    }
    
    // Update the playlist's type if needed
    let playlistType = playlist.type;
    if (playlistType !== mediaItem.type && playlistType !== 'mixed') {
      playlistType = 'mixed';
    }
    
    // Add the item to the playlist
    setPlaylists(playlists.map(p => 
      p.id === playlistId 
        ? { 
            ...p, 
            items: [...p.items, mediaItem],
            type: playlistType
          } 
        : p
    ));
    
    toast.success(`Added to "${playlist.name}" playlist`);
  };
  
  const removeFromPlaylist = (playlistId: string, mediaItemId: string) => {
    setPlaylists(playlists.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, items: playlist.items.filter(item => item.id !== mediaItemId) } 
        : playlist
    ));
    
    toast.success("Item removed from playlist");
  };
  
  const moveItemInPlaylist = (playlistId: string, itemId: string, direction: 'up' | 'down') => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    const itemIndex = playlist.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const newItems = [...playlist.items];
    
    if (direction === 'up' && itemIndex > 0) {
      // Swap with previous item
      [newItems[itemIndex], newItems[itemIndex - 1]] = [newItems[itemIndex - 1], newItems[itemIndex]];
    } else if (direction === 'down' && itemIndex < newItems.length - 1) {
      // Swap with next item
      [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
    } else {
      return; // No move possible
    }
    
    setPlaylists(playlists.map(p => 
      p.id === playlistId 
        ? { ...p, items: newItems } 
        : p
    ));
  };
  
  const filteredPlaylists = playlists.filter(playlist => 
    playlist.type === type || playlist.type === 'mixed'
  );
  
  const typeLabel = type === 'audio' ? 'music' : 'video';
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Folder className="mr-2 text-media-silver" />
          Your Playlists
        </h2>
        
        {/* Create Playlist Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-transparent border-media-light-gray text-media-silver hover:text-white">
              <FolderPlus size={16} className="mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-media-dark-gray text-white border-media-light-gray">
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder={`My Favorite ${typeLabel === 'music' ? 'Tracks' : 'Videos'}`}
                className="bg-media-black border-media-light-gray text-white"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="text-media-silver">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button 
                  onClick={createPlaylist} 
                  disabled={!newPlaylistName.trim()}
                  className="bg-media-red hover:bg-media-red/90 text-white"
                >
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredPlaylists.length === 0 ? (
        <div className="bg-media-black/30 rounded-lg p-8 text-center">
          <Folder className="mx-auto text-media-silver mb-2" size={32} />
          <p className="text-media-silver">You don't have any playlists yet</p>
          <p className="text-media-silver/70 text-sm mt-1">
            Create a playlist to organize your favorite {typeLabel}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlaylists.map(playlist => (
            <div key={playlist.id} className="bg-media-black/30 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Playlist Cover */}
              <div 
                className="relative aspect-square cursor-pointer"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                {playlist.items.length > 0 ? (
                  /* Grid of thumbnails */
                  <div className="grid grid-cols-2 grid-rows-2 h-full">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="overflow-hidden">
                        {playlist.items[index] ? (
                          <img 
                            src={playlist.items[index].thumbnail} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-media-black flex items-center justify-center">
                            {playlist.type === 'audio' || playlist.type === 'mixed' ? (
                              <Music size={24} className="text-media-silver/30" />
                            ) : (
                              <Film size={24} className="text-media-silver/30" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full bg-media-black flex items-center justify-center">
                    {playlist.type === 'audio' ? (
                      <Music size={48} className="text-media-silver/30" />
                    ) : playlist.type === 'video' ? (
                      <Film size={48} className="text-media-silver/30" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Music size={36} className="text-media-silver/30" />
                        <Film size={36} className="text-media-silver/30 mt-2" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    disabled={playlist.items.length === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayPlaylist(playlist, 0);
                    }}
                    className="bg-media-red hover:bg-media-red/90 rounded-full w-14 h-14 flex items-center justify-center"
                  >
                    <Play size={24} className="text-white ml-1" />
                  </Button>
                </div>
              </div>
              
              {/* Playlist Info */}
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    {editingPlaylist?.id === playlist.id ? (
                      <div className="flex items-center">
                        <Input
                          value={editingPlaylist.name}
                          onChange={(e) => setEditingPlaylist({...editingPlaylist, name: e.target.value})}
                          className="text-white bg-transparent border-media-light-gray h-8 text-sm"
                        />
                        <div className="flex ml-2">
                          <button
                            onClick={() => renamePlaylist(playlist.id, editingPlaylist.name)}
                            className="text-media-green hover:text-media-green/80 mr-1"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingPlaylist(null)}
                            className="text-media-red hover:text-media-red/80"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-medium text-white truncate">{playlist.name}</h3>
                    )}
                    <p className="text-sm text-media-silver mt-1">
                      {playlist.items.length} {playlist.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 text-media-silver/70 hover:text-white rounded-full transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-media-dark-gray border-media-light-gray text-white">
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-media-light-gray/20"
                        onClick={() => setEditingPlaylist(playlist)}
                      >
                        <Edit2 size={14} className="mr-2" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-media-light-gray/20 text-media-red"
                        onClick={() => deletePlaylist(playlist.id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Playlist Details Dialog */}
      <Dialog open={!!selectedPlaylist} onOpenChange={(open) => !open && setSelectedPlaylist(null)}>
        <DialogContent className="bg-media-dark-gray text-white border-media-light-gray max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedPlaylist?.name}
              <span className="ml-2 text-sm text-media-silver/70">
                ({selectedPlaylist?.items.length} {selectedPlaylist?.items.length === 1 ? 'item' : 'items'})
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlaylist?.items.length === 0 ? (
            <div className="py-12 text-center">
              <List className="mx-auto text-media-silver mb-2" size={32} />
              <p className="text-media-silver">This playlist is empty</p>
              <p className="text-media-silver/70 text-sm mt-1">
                Add some {typeLabel} to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-media-light-gray/20">
              {selectedPlaylist?.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="py-2 flex items-center hover:bg-media-light-gray/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 text-center text-media-silver/70">
                    {index + 1}
                  </div>
                  
                  <div className="flex-shrink-0 w-12 h-12 mr-3">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-white truncate">{item.title}</h4>
                    {item.artist && (
                      <p className="text-sm text-media-silver truncate">{item.artist}</p>
                    )}
                  </div>
                  
                  {item.duration && (
                    <div className="flex-shrink-0 text-media-silver mr-4">
                      {item.duration}
                    </div>
                  )}
                  
                  <div className="flex-shrink-0 flex items-center space-x-1 mr-2">
                    <button 
                      onClick={() => moveItemInPlaylist(selectedPlaylist.id, item.id, 'up')}
                      disabled={index === 0}
                      className={cn(
                        "p-1.5 rounded-full transition-colors", 
                        index === 0 ? "text-media-silver/30" : "text-media-silver hover:text-white hover:bg-media-light-gray/20"
                      )}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3.5">
                        <path d="M7.5 3L2.5 8H12.5L7.5 3Z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveItemInPlaylist(selectedPlaylist.id, item.id, 'down')}
                      disabled={index === selectedPlaylist.items.length - 1}
                      className={cn(
                        "p-1.5 rounded-full transition-colors", 
                        index === selectedPlaylist.items.length - 1 ? "text-media-silver/30" : "text-media-silver hover:text-white hover:bg-media-light-gray/20"
                      )}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3.5">
                        <path d="M7.5 12L12.5 7H2.5L7.5 12Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      onPlayPlaylist(selectedPlaylist, index);
                      setSelectedPlaylist(null);
                    }}
                    className="flex-shrink-0 p-2 text-media-silver rounded-full hover:text-white hover:bg-media-light-gray/20 transition-colors mr-1"
                  >
                    <Play size={16} />
                  </button>
                  
                  <button
                    onClick={() => removeFromPlaylist(selectedPlaylist.id, item.id)}
                    className="flex-shrink-0 p-2 text-media-red/70 rounded-full hover:text-media-red hover:bg-media-light-gray/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-media-silver">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add to Playlist Menu Component */}
      <AddToPlaylistMenu 
        playlists={filteredPlaylists} 
        onAddToPlaylist={addToPlaylist} 
      />
    </div>
  );
};

// Context for the Add to Playlist functionality
interface AddToPlaylistContextType {
  openAddToPlaylist: (item: PlaylistItem) => void;
}

export const AddToPlaylistContext = React.createContext<AddToPlaylistContextType>({
  openAddToPlaylist: () => {},
});

interface AddToPlaylistMenuProps {
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, item: PlaylistItem) => void;
}

const AddToPlaylistMenu = ({ playlists, onAddToPlaylist }: AddToPlaylistMenuProps) => {
  const [selectedItem, setSelectedItem] = useState<PlaylistItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const openAddToPlaylist = (item: PlaylistItem) => {
    setSelectedItem(item);
    setIsOpen(true);
  };
  
  const handleAddToPlaylist = (playlistId: string) => {
    if (selectedItem) {
      onAddToPlaylist(playlistId, selectedItem);
      setIsOpen(false);
    }
  };
  
  const contextValue = {
    openAddToPlaylist
  };
  
  return (
    <AddToPlaylistContext.Provider value={contextValue}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-media-dark-gray text-white border-media-light-gray">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
          </DialogHeader>
          
          {playlists.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-media-silver">You don't have any playlists yet</p>
              <p className="text-media-silver/70 text-sm mt-1">
                Create a playlist first
              </p>
            </div>
          ) : (
            <div className="py-2 max-h-60 overflow-y-auto">
              {playlists.map(playlist => (
                <button 
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full flex items-center p-2 hover:bg-media-light-gray/20 rounded-md transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-media-black/50 rounded flex items-center justify-center mr-3">
                    <Folder size={16} className="text-media-silver" />
                  </div>
                  <span>{playlist.name}</span>
                  <span className="ml-2 text-sm text-media-silver/70">
                    ({playlist.items.length})
                  </span>
                </button>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-media-silver">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AddToPlaylistContext.Provider>
  );
};

export default PlaylistManager;
