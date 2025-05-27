
import React, { useState, useEffect } from 'react';
import { musicData } from '@/lib/mediaUtils';
import MediaLibrary from '@/components/MediaLibrary';
import AudioPlayer from '@/components/AudioPlayer';
import Header from '@/components/Header';
import { useIsMobile, useIsIOS } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from 'sonner';

const Music = () => {
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [allMusic, setAllMusic] = useState(musicData);
  
  // Get uploaded music from localStorage
  useEffect(() => {
    const uploadedMusic = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
    setAllMusic([...musicData, ...uploadedMusic]);
  }, []);
  
  const selectedMusic = selectedMusicId 
    ? allMusic.find(music => music.id === selectedMusicId) 
    : null;
  const currentIndex = selectedMusic 
    ? allMusic.findIndex(music => music.id === selectedMusicId)
    : 0;
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle iOS-specific warnings
  useEffect(() => {
    if (isIOS) {
      toast.info("iOS detected. Tap to play audio (autoplay restrictions may apply).", {
        duration: 5000,
      });
    }
  }, [isIOS]);

  const handlePlayerClose = () => {
    setSelectedMusicId(null);
  };

  return (
    <div className="min-h-screen bg-media-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Modal for Music Player (Desktop) */}
        {!isMobile && selectedMusic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-3xl">
              <AudioPlayer
                src={selectedMusic.src}
                title={selectedMusic.title}
                artist={selectedMusic.artist || "Unknown Artist"}
                album={selectedMusic.album}
                coverArt={selectedMusic.thumbnail}
                onClose={handlePlayerClose}
                autoPlay
                currentIndex={currentIndex}
              />
            </div>
          </div>
        )}
        
        {/* Sheet for Music Player (Mobile) */}
        {isMobile && selectedMusic && (
          <Sheet open={!!selectedMusic} onOpenChange={(open) => !open && handlePlayerClose()}>
            <SheetContent side="bottom" className="h-[85vh] p-0 bg-media-black border-t border-media-light-gray rounded-t-xl">
              <div className="w-full h-full overflow-y-auto">
                <AudioPlayer
                  src={selectedMusic.src}
                  title={selectedMusic.title}
                  artist={selectedMusic.artist || "Unknown Artist"}
                  album={selectedMusic.album}
                  coverArt={selectedMusic.thumbnail}
                  onClose={handlePlayerClose}
                  autoPlay
                  currentIndex={currentIndex}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Music Library */}
        <div className="animate-slide-right">
          <MediaLibrary 
            title="Music Library"
            description="Browse, upload, and listen to your music collection"
            items={allMusic}
            onMediaSelect={setSelectedMusicId}
            type="audio"
          />
        </div>
      </main>
    </div>
  );
};

export default Music;
