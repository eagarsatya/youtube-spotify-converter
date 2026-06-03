'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play, Search, Loader2 } from 'lucide-react';
import { extractVideoId, extractPlaylistId } from '@/lib/url-parser';

interface UrlInputProps {
  onProcess: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onProcess, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const isVideo = extractVideoId(url);
    const isPlaylist = extractPlaylistId(url);

    if (!isVideo && !isPlaylist) {
      setError('Invalid YouTube URL. Please provide a valid video or playlist link.');
      return;
    }

    onProcess(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Play className="absolute left-4 w-6 h-6 text-muted-foreground fill-current" />
          <Input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste a YouTube video or playlist link here..."
            className="pl-12 pr-32 py-6 text-lg rounded-full bg-background border-2 shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="absolute right-2 rounded-full px-6 h-10"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Converting...' : 'Convert'}
          </Button>
        </div>
        {error && (
          <p className="text-destructive text-sm mt-2 ml-4 font-medium">{error}</p>
        )}
      </form>
    </div>
  );
}
