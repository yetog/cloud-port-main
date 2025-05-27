
import React, { useState, useEffect } from 'react';
import { videoData } from '@/lib/mediaUtils';
import MediaLibrary from '@/components/MediaLibrary';
import VideoPlayer from '@/components/VideoPlayer';
import Header from '@/components/Header';
import { useIsMobile, useIsIOS } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from 'sonner';

const Videos = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [allVideos, setAllVideos] = useState(videoData);
  
  // Get uploaded videos from localStorage
  useEffect(() => {
    const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    setAllVideos([...videoData, ...uploadedVideos]);
  }, []);
  
  const selectedVideo = selectedVideoId 
    ? allVideos.find(video => video.id === selectedVideoId) 
    : null;
  
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Handle iOS-specific warnings
  useEffect(() => {
    if (isIOS) {
      toast.info("iOS detected. Tap to play video (autoplay restrictions may apply).", {
        duration: 5000,
      });
    }
  }, [isIOS]);
  
  const handlePlayerClose = () => {
    setSelectedVideoId(null);
  };

  return (
    <div className="min-h-screen bg-media-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Modal for Video Player (Desktop) */}
        {!isMobile && selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl">
              <VideoPlayer
                src={selectedVideo.src}
                title={selectedVideo.title}
                onClose={handlePlayerClose}
                autoPlay
              />
            </div>
          </div>
        )}
        
        {/* Sheet for Video Player (Mobile) */}
        {isMobile && selectedVideo && (
          <Sheet open={!!selectedVideo} onOpenChange={(open) => !open && handlePlayerClose()}>
            <SheetContent side="bottom" className="h-[85vh] p-0 bg-media-black border-t border-media-light-gray rounded-t-xl">
              <div className="w-full h-full overflow-y-auto">
                <VideoPlayer
                  src={selectedVideo.src}
                  title={selectedVideo.title}
                  onClose={handlePlayerClose}
                  autoPlay
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Video Library */}
        <div className="animate-slide-right">
          <MediaLibrary 
            title="Video Library"
            description="Browse, upload, and watch your video collection"
            items={allVideos}
            onMediaSelect={setSelectedVideoId}
            type="video"
          />
        </div>
      </main>
    </div>
  );
};

export default Videos;
