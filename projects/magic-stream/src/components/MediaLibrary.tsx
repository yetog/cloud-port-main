
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Upload, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';
import MediaCard, { MediaGrid, MediaItemProps } from './MediaCard';
import { Button } from '@/components/ui/button';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import MediaUpload from './MediaUpload';
import PlaylistManager, { Playlist, PlaylistItem } from './PlaylistManager';
import { toast } from 'sonner';

// Define a new interface for the items that don't have onClick yet
interface MediaItem {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  type: 'video' | 'audio';
  artist?: string;
  album?: string;
  year?: string;
  src: string;
  isUploaded?: boolean;
}

interface MediaLibraryProps {
  title: string;
  description?: string;
  items: MediaItem[];
  onMediaSelect: (id: string) => void;
  type: 'video' | 'audio';
}

const MediaLibrary = ({ 
  title, 
  description, 
  items, 
  onMediaSelect, 
  type 
}: MediaLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [allMedia, setAllMedia] = useState<MediaItem[]>(items);
  
  // Load uploaded media from localStorage
  useEffect(() => {
    const uploadedMediaKey = type === 'audio' ? 'uploadedMusic' : 'uploadedVideos';
    const uploadedMedia = JSON.parse(localStorage.getItem(uploadedMediaKey) || '[]');
    
    // Combine original items with uploaded items
    setAllMedia([...items, ...uploadedMedia]);
  }, [items, type]);
  
  const filteredItems = searchTerm 
    ? allMedia.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.album && item.album.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : allMedia;
  
  const handleMediaUpload = (newMedia: MediaItem) => {
    setAllMedia(prev => [...prev, newMedia]);
    
    // Update activeTab to library to show the newly added item
    setActiveTab('library');
  };
  
  const handlePlayPlaylist = (playlist: Playlist, startIndex: number) => {
    if (playlist.items.length === 0) return;
    
    // Play the first item in the playlist
    const firstItem = playlist.items[startIndex];
    
    // Find this item in our allMedia array to get its ID
    const mediaItem = allMedia.find(item => 
      item.src === firstItem.src && item.title === firstItem.title
    );
    
    if (mediaItem) {
      onMediaSelect(mediaItem.id);
      
      // In a real app, you'd store the full playlist and current position
      // for sequential playback
      localStorage.setItem('currentPlaylist', JSON.stringify(playlist));
      localStorage.setItem('currentPlaylistIndex', startIndex.toString());
      
      toast.success(`Playing ${firstItem.title} from playlist: ${playlist.name}`);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Tabs for Library/Playlists */}
      <Tabs 
        defaultValue="library" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-media-silver mt-2">{description}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <TabsList className="bg-media-black border border-media-light-gray/30 h-10">
              <TabsTrigger 
                value="library" 
                className="data-[state=active]:bg-media-red data-[state=active]:text-white"
              >
                Library
              </TabsTrigger>
              <TabsTrigger 
                value="playlists" 
                className="data-[state=active]:bg-media-red data-[state=active]:text-white"
              >
                Playlists
              </TabsTrigger>
            </TabsList>
            
            <MediaUpload 
              type={type}
              onMediaUpload={handleMediaUpload}
            />
          </div>
        </div>
        
        <TabsContent value="library" className="mt-0">
          {/* Header with search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center text-lg font-semibold text-white">
                  <ListMusic className="mr-2 text-media-silver" size={20} />
                  <span>
                    {type === 'audio' ? 'Music' : 'Videos'} ({filteredItems.length})
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {showSearch ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Search ${type === 'video' ? 'videos' : 'tracks'}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-8 py-2 bg-media-light-gray text-white rounded-full w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-media-red"
                      autoFocus
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-media-silver" />
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-media-silver hover:text-white"
                      onClick={() => {
                        setSearchTerm('');
                        setShowSearch(false);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      className="p-2 rounded-full bg-media-light-gray text-media-silver hover:text-white transition-colors"
                      onClick={() => setShowSearch(true)}
                    >
                      <Search size={20} />
                    </button>
                    <button className="p-2 rounded-full bg-media-light-gray text-media-silver hover:text-white transition-colors">
                      <Filter size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Search results count */}
          {searchTerm && (
            <div className="mb-4 text-media-silver">
              Found {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} for "{searchTerm}"
            </div>
          )}

          {/* Media Grid */}
          {filteredItems.length > 0 ? (
            <MediaGrid>
              {filteredItems.map((item) => (
                <MediaCard 
                  key={item.id} 
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  duration={item.duration}
                  type={item.type}
                  artist={item.artist}
                  album={item.album}
                  year={item.year}
                  src={item.src}
                  onClick={() => onMediaSelect(item.id)}
                />
              ))}
            </MediaGrid>
          ) : (
            <div className="text-center py-12">
              <p className="text-media-silver text-lg">No {type === 'video' ? 'videos' : 'tracks'} found</p>
              {searchTerm && (
                <p className="text-media-silver/70 mt-2">
                  Try a different search term or browse our library
                </p>
              )}
              {!searchTerm && (
                <div className="mt-4">
                  <p className="text-media-silver/70 mb-4">
                    Add some {type === 'video' ? 'videos' : 'music'} to your library
                  </p>
                  <MediaUpload 
                    type={type}
                    onMediaUpload={handleMediaUpload}
                  />
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="playlists" className="mt-0">
          <PlaylistManager 
            type={type}
            mediaItems={allMedia.map(item => ({
              id: item.id,
              title: item.title,
              thumbnail: item.thumbnail,
              type: item.type,
              artist: item.artist,
              src: item.src,
              duration: item.duration
            }))}
            onPlayPlaylist={handlePlayPlaylist}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
