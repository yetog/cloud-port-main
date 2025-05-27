
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Film, Music, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { videoData, musicData } from '@/lib/mediaUtils';
import Header from '@/components/Header';
import MediaCard, { MediaGrid } from '@/components/MediaCard';
import VideoPlayer from '@/components/VideoPlayer';
import AudioPlayer from '@/components/AudioPlayer';

const Index = () => {
  // Get a subset of media for the homepage
  const featuredVideos = videoData.slice(0, 4);
  const featuredMusic = musicData.slice(0, 4);
  
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  
  const selectedVideo = selectedVideoId 
    ? videoData.find(video => video.id === selectedVideoId) 
    : null;
  
  const selectedMusic = selectedMusicId 
    ? musicData.find(music => music.id === selectedMusicId) 
    : null;

  return (
    <div className="min-h-screen bg-media-black text-media-silver">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop" 
            alt="Media Streaming" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-media-black/80 via-media-black/50 to-media-black"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-media-red/90 text-white mb-4">Premium Media Experience</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Your Personal <br className="hidden md:block" />
              <span className="text-media-red">Media Experience</span>
            </h1>
            <p className="max-w-lg text-lg md:text-xl text-media-silver/90 mb-8">
              Stream your favorite videos and music with a premium interface designed for the ultimate media experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/videos" 
                className="inline-flex items-center px-6 py-3 rounded-lg bg-media-red hover:bg-media-red/90 text-white font-medium transition-colors duration-200"
              >
                <Film size={20} className="mr-2" />
                Browse Videos
              </Link>
              <Link 
                to="/music" 
                className="inline-flex items-center px-6 py-3 rounded-lg bg-transparent border border-media-gold text-media-gold hover:bg-media-gold/10 font-medium transition-colors duration-200"
              >
                <Music size={20} className="mr-2" />
                Explore Music
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Modal for Video Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl">
            <VideoPlayer
              src={selectedVideo.src}
              title={selectedVideo.title}
              onClose={() => setSelectedVideoId(null)}
              autoPlay
            />
          </div>
        </div>
      )}

      {/* Modal for Music Player */}
      {selectedMusic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl">
            <AudioPlayer
              src={selectedMusic.src}
              title={selectedMusic.title}
              artist={selectedMusic.artist || "Unknown Artist"}
              album={selectedMusic.album}
              coverArt={selectedMusic.thumbnail}
              onClose={() => setSelectedMusicId(null)}
              autoPlay
            />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Videos Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Videos</h2>
              <p className="text-media-silver mt-1">Watch your favorite videos in high quality</p>
            </div>
            <Link 
              to="/videos" 
              className="flex items-center text-media-red hover:text-media-red/80 transition-colors group"
            >
              <span>View All</span>
              <ChevronRight size={18} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <MediaGrid>
            {featuredVideos.map((video) => (
              <MediaCard 
                key={video.id} 
                {...video} 
                onClick={(id) => setSelectedVideoId(id)}
              />
            ))}
          </MediaGrid>
        </section>

        {/* Featured Music Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Music</h2>
              <p className="text-media-silver mt-1">Listen to your favorite tracks anytime</p>
            </div>
            <Link 
              to="/music" 
              className="flex items-center text-media-red hover:text-media-red/80 transition-colors group"
            >
              <span>View All</span>
              <ChevronRight size={18} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <MediaGrid>
            {featuredMusic.map((music) => (
              <MediaCard 
                key={music.id} 
                {...music} 
                onClick={(id) => setSelectedMusicId(id)}
              />
            ))}
          </MediaGrid>
        </section>

        {/* App Features Section */}
        <section className="py-16 border-t border-media-dark-gray">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Premium Media Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="High Quality Streaming" 
              description="Enjoy your media in the highest quality with smooth playback on any device."
              icon={
                <div className="w-12 h-12 rounded-full bg-media-red/10 flex items-center justify-center text-media-red mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M15 12L10 15.4641V8.5359L15 12Z" fill="currentColor" />
                  </svg>
                </div>
              }
            />
            <FeatureCard 
              title="Smart Organization" 
              description="Keep your media library organized with smart categorization and easy search."
              icon={
                <div className="w-12 h-12 rounded-full bg-media-gold/10 flex items-center justify-center text-media-gold mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              }
            />
            <FeatureCard 
              title="Cross-Device Sync" 
              description="Your media follows you across devices with seamless synchronization."
              icon={
                <div className="w-12 h-12 rounded-full bg-media-red/10 flex items-center justify-center text-media-red mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 7L12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              }
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-media-black/80 border-t border-media-dark-gray py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-media-red">
              <span className="text-white font-semibold">M</span>
            </div>
            <span className="text-white font-semibold text-xl ml-2">MediaStream</span>
          </div>
          <p className="text-center text-media-silver/70 max-w-xl mx-auto">
            Your personal media streaming platform. Designed for an exceptional viewing and listening experience.
          </p>
          <div className="flex justify-center space-x-8 mt-8">
            <Link to="/" className="text-media-silver hover:text-white transition-colors">Home</Link>
            <Link to="/videos" className="text-media-silver hover:text-white transition-colors">Videos</Link>
            <Link to="/music" className="text-media-silver hover:text-white transition-colors">Music</Link>
          </div>
          <div className="mt-8 text-center text-media-silver/60 text-sm">
            &copy; {new Date().getFullYear()} MediaStream. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center p-6 glassmorphism rounded-xl animate-fade-in-up">
    {icon}
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-media-silver">{description}</p>
  </div>
);

export default Index;
