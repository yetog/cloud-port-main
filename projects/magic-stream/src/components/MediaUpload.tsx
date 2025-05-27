
import React, { useState, useRef } from 'react';
import { Upload, X, FileAudio, FileVideo, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { generateId } from '@/lib/mediaUtils';
import { toast } from 'sonner';

interface MediaUploadProps {
  type: 'audio' | 'video';
  onMediaUpload: (newMedia: any) => void;
}

const MediaUpload = ({ type, onMediaUpload }: MediaUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Try to extract title from filename (remove extension)
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setTitle(fileName);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setThumbnailFile(selectedFile);
      setThumbnailUrl(URL.createObjectURL(selectedFile));
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setArtist('');
    setAlbum('');
    setThumbnailUrl(null);
    setThumbnailFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a URL for the media file
    const mediaUrl = URL.createObjectURL(file);
    
    // Determine duration (in a real app, you would extract actual duration)
    let mediaDuration = "0:00";
    
    if (type === 'audio') {
      const audio = new Audio();
      audio.src = mediaUrl;
      audio.onloadedmetadata = () => {
        // Format duration
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        mediaDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        completeUpload(mediaUrl, mediaDuration);
      };
      audio.onerror = () => {
        toast.error("Failed to load audio file");
        setIsUploading(false);
      };
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.src = mediaUrl;
      video.onloadedmetadata = () => {
        // Format duration
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        mediaDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        completeUpload(mediaUrl, mediaDuration);
      };
      video.onerror = () => {
        toast.error("Failed to load video file");
        setIsUploading(false);
      };
    }
  };

  const completeUpload = (mediaUrl: string, duration: string) => {
    // Create thumbnail URL or use a default one
    const thumbUrl = thumbnailUrl || (
      type === 'audio' 
        ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop'
    );
    
    // Create new media item
    const newMedia = {
      id: generateId(),
      title: title || 'Untitled',
      artist: artist || undefined,
      album: album || undefined,
      thumbnail: thumbUrl,
      duration: duration,
      type: type,
      src: mediaUrl,
      year: new Date().getFullYear().toString(),
      isUploaded: true
    };
    
    // Add to the library
    onMediaUpload(newMedia);
    
    // Save to local storage (we'll implement this later)
    saveToLocalStorage(type, newMedia);
    
    // Show success toast
    toast.success(`${type === 'audio' ? 'Track' : 'Video'} uploaded successfully!`);
    
    // Reset form
    setIsUploading(false);
    resetForm();
  };

  const saveToLocalStorage = (mediaType: string, media: any) => {
    // Get existing uploaded media from localStorage
    const uploadedMediaKey = mediaType === 'audio' ? 'uploadedMusic' : 'uploadedVideos';
    const existingMedia = JSON.parse(localStorage.getItem(uploadedMediaKey) || '[]');
    
    // Add new media
    existingMedia.push(media);
    
    // Save back to localStorage
    localStorage.setItem(uploadedMediaKey, JSON.stringify(existingMedia));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-media-red hover:bg-media-red/90 text-white">
          <Upload size={16} className="mr-2" />
          Upload {type === 'audio' ? 'Music' : 'Video'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-media-dark-gray text-white border-media-light-gray">
        <DialogHeader>
          <DialogTitle>Upload {type === 'audio' ? 'Music' : 'Video'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-media-light-gray rounded-lg p-12 text-center cursor-pointer hover:border-media-red transition-colors"
            >
              {type === 'audio' ? (
                <FileAudio size={48} className="mx-auto mb-4 text-media-silver" />
              ) : (
                <FileVideo size={48} className="mx-auto mb-4 text-media-silver" />
              )}
              <p className="text-media-silver mb-2">Click to select a {type} file</p>
              <p className="text-media-silver/70 text-sm">or drag and drop it here</p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange} 
                accept={type === 'audio' ? 'audio/*' : 'video/*'}
              />
            </div>
          ) : (
            <div className="bg-media-black/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {type === 'audio' ? (
                    <FileAudio size={24} className="mr-2 text-media-silver" />
                  ) : (
                    <FileVideo size={24} className="mr-2 text-media-silver" />
                  )}
                  <div className="truncate">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-media-silver">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-media-light-gray/20 rounded-full transition-colors"
                >
                  <X size={16} className="text-media-silver" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-media-silver mb-1 block">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-media-black border-media-light-gray text-white"
                    placeholder="Enter title"
                  />
                </div>
                
                {type === 'audio' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-media-silver mb-1 block">Artist</label>
                      <Input
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className="bg-media-black border-media-light-gray text-white"
                        placeholder="Enter artist name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-media-silver mb-1 block">Album</label>
                      <Input
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                        className="bg-media-black border-media-light-gray text-white"
                        placeholder="Enter album name"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-sm font-medium text-media-silver mb-1 block">Thumbnail (optional)</label>
                  {thumbnailUrl ? (
                    <div className="relative w-full h-32 bg-media-black rounded-md overflow-hidden">
                      <img 
                        src={thumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => setThumbnailUrl(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById('thumbnail-input')?.click()}
                      className="w-full h-24 border border-dashed border-media-light-gray rounded-md flex items-center justify-center cursor-pointer hover:border-media-red transition-colors"
                    >
                      <p className="text-sm text-media-silver">Click to select a thumbnail image</p>
                      <input 
                        id="thumbnail-input"
                        type="file" 
                        className="hidden" 
                        onChange={handleThumbnailChange} 
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" className="text-media-silver">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="bg-media-red hover:bg-media-red/90 text-white"
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUpload;
