'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { UrlInput } from '@/components/url-input';
import { ConversionProgress } from '@/components/conversion-progress';
import { TrackList } from '@/components/track-list';
import { PlaylistCreator } from '@/components/playlist-creator';
import { ConversionResult, ConversionProgress as ProgressType, YouTubeTrack } from '@/types';
import { toast } from 'sonner';
import { FaYoutube, FaSpotify } from 'react-icons/fa';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [playlistDefaultName, setPlaylistDefaultName] = useState('Converted Playlist');

  const handleProcessUrl = async (url: string) => {
    setIsLoading(true);
    setProgress(null);
    setResults([]);

    try {
      // 1. Fetch YouTube Metadata
      const ytRes = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const ytData = await ytRes.json();

      if (!ytRes.ok) {
        throw new Error(ytData.error || 'Failed to fetch YouTube data');
      }

      const tracks: YouTubeTrack[] = ytData.tracks;
      
      if (ytData.type === 'playlist') {
        // Just a nice touch: use the first track's channel or generic name
        setPlaylistDefaultName('Converted YouTube Playlist');
      } else {
        setPlaylistDefaultName(tracks[0].title);
      }

      // 2. Search Spotify
      setProgress({ total: tracks.length, completed: 0, currentTrack: tracks[0].title });

      // We send all tracks to the backend to process, but we simulate progress updates
      // by doing it in chunks or relying on the backend to be fast.
      // For a truly real-time progress bar, we'd use Server-Sent Events (SSE) or WebSockets.
      // Since this is MVP, we just do it in one big request and show an indeterminate/fake progress
      // Or we can chunk it from the frontend to show real progress! Let's chunk from frontend.
      
      const newResults: ConversionResult[] = [];
      const chunkSize = 5; // Process 5 at a time from the frontend

      for (let i = 0; i < tracks.length; i += chunkSize) {
        const chunk = tracks.slice(i, i + chunkSize);
        
        if (chunk.length > 0) {
          setProgress(prev => prev ? { ...prev, currentTrack: chunk[0].title } : null);
        }

        const spotRes = await fetch('/api/spotify/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tracks: chunk }),
        });

        const spotData = await spotRes.json();

        if (!spotRes.ok) {
          throw new Error(spotData.error || 'Failed to search Spotify');
        }

        newResults.push(...spotData.results);
        
        setProgress(prev => prev ? { 
          total: prev.total, 
          completed: Math.min(prev.completed + chunk.length, prev.total) 
        } : null);

        // Update the UI as results stream in
        setResults([...newResults]);
      }

      toast.success(`Found matches for ${newResults.filter(r => r.spotifyMatch).length} tracks!`);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  const handleToggleTrack = (id: string, selected: boolean) => {
    setResults(prev => prev.map(r => 
      r.youtubeTrack.id === id ? { ...r, selected } : r
    ));
  };

  const handleToggleAll = (selected: boolean) => {
    setResults(prev => prev.map(r => 
      // Only select if it actually has a spotify match ID
      r.spotifyMatch?.id ? { ...r, selected } : r
    ));
  };

  const handleCreatePlaylist = () => {
    const selectedTracks = results.filter(r => r.selected && r.spotifyMatch);
    if (selectedTracks.length === 0) {
      toast.error("Please select at least one track to add to the playlist");
      return;
    }
    setIsCreatorOpen(true);
  };

  const selectedUris = results
    .filter(r => r.selected && r.spotifyMatch)
    .map(r => r.spotifyMatch!.uri);

  const hasStarted = isLoading || progress !== null || results.length > 0;

  return (
    <>
      <Header />
      
      <main className={`flex-1 container mx-auto px-4 flex flex-col transition-all duration-700 ease-in-out ${hasStarted ? 'justify-start pt-8 pb-24' : 'justify-center items-center pb-[15vh]'}`}>
        
        <div className={`w-full mx-auto transition-all duration-700 ease-in-out ${hasStarted ? 'max-w-4xl' : 'max-w-3xl'}`}>
          {/* Hero Section */}
          <div className={`text-center mx-auto space-y-6 transition-all duration-700 ${hasStarted ? 'mb-6 scale-95 opacity-90 hidden md:block' : 'mb-12 scale-100 opacity-100'}`}>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Seamlessly port your music from <br className="hidden md:block" />
              <span className="text-[#FF0000] inline-flex items-center gap-1 mx-2"><FaYoutube className="w-[0.9em] h-[0.9em]" />YouTube</span> to <span className="text-[#1DB954] inline-flex items-center gap-1 mx-2"><FaSpotify className="w-[0.9em] h-[0.9em]" />Spotify</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Paste a link to any YouTube video or playlist, and we'll instantly find the tracks on Spotify and bundle them up for you.
            </p>
          </div>

          <UrlInput onProcess={handleProcessUrl} isLoading={isLoading} />
        </div>

        {progress && (
          <div className="mt-12">
            <ConversionProgress progress={progress} />
          </div>
        )}

        <TrackList 
          results={results} 
          onToggleTrack={handleToggleTrack} 
          onToggleAll={handleToggleAll}
          onCreatePlaylist={handleCreatePlaylist}
        />

      </main>

      <PlaylistCreator 
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        trackUris={selectedUris}
        defaultName={playlistDefaultName}
      />
    </>
  );
}
