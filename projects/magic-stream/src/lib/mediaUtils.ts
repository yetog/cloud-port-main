
// Sample media data for videos and music
// In a real app, this would come from a database or API

// Helper function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Sample video data
export const videoData = [
  {
    id: generateId(),
    title: "Mountain Sunrise Timelapse",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    duration: "2:45",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Aerial Ocean Views",
    thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop",
    duration: "3:12",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Urban Night Drive",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop",
    duration: "4:30",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Desert Wildlife Documentary",
    thumbnail: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop",
    duration: "12:18",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Northern Lights Spectacle",
    thumbnail: "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?w=800&auto=format&fit=crop",
    duration: "5:42",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Cityscape Drone Footage",
    thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop",
    duration: "3:55",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Underwater Coral Reef Tour",
    thumbnail: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=800&auto=format&fit=crop",
    duration: "8:24",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: generateId(),
    title: "Forest Canopy Exploration",
    thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop",
    duration: "6:15",
    type: "video" as const,
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  }
];

// Sample music data
export const musicData = [
  {
    id: generateId(),
    title: "Solar Echoes",
    artist: "Ethereal Mind",
    album: "Cosmic Journeys",
    year: "2023",
    thumbnail: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&auto=format&fit=crop",
    duration: "4:12",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: generateId(),
    title: "Midnight Rain",
    artist: "Urban Echo",
    album: "City Lights",
    year: "2022",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    duration: "3:45",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: generateId(),
    title: "Electronic Dreams",
    artist: "Digital Wave",
    album: "Future Pulse",
    year: "2023",
    thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&auto=format&fit=crop",
    duration: "5:28",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: generateId(),
    title: "Acoustic Memories",
    artist: "Wooden String",
    album: "Natural Harmonies",
    year: "2021",
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop",
    duration: "4:05",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: generateId(),
    title: "Ambient Flow",
    artist: "Calm Current",
    album: "Peaceful Waves",
    year: "2022",
    thumbnail: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=800&auto=format&fit=crop",
    duration: "6:32",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: generateId(),
    title: "Jazz Improv Session",
    artist: "Smooth Quartet",
    album: "Late Night Sessions",
    year: "2020",
    thumbnail: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&auto=format&fit=crop",
    duration: "5:17",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: generateId(),
    title: "Classical Symphony No. 4",
    artist: "Philharmonic Orchestra",
    album: "Concert Hall Recordings",
    year: "2019",
    thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop",
    duration: "8:44",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: generateId(),
    title: "Rock Anthem",
    artist: "Electric Pulse",
    album: "Guitar Heroes",
    year: "2021",
    thumbnail: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&auto=format&fit=crop",
    duration: "4:51",
    type: "audio" as const,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

// Find media by ID
export const findMediaById = (id: string) => {
  const video = videoData.find(v => v.id === id);
  if (video) return video;
  
  const music = musicData.find(m => m.id === id);
  if (music) return music;
  
  return null;
};
