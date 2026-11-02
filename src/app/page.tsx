'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { UrlInput } from '@/components/url-input';
import { SongListInput } from '@/components/song-list-input';
import { ConversionProgress } from '@/components/conversion-progress';
import { TrackList } from '@/components/track-list';
import { YouTubeDraftList } from '@/components/youtube-draft-list';
import { PlaylistCreator } from '@/components/playlist-creator';
import { YouTubePlaylistCreator } from '@/components/youtube-playlist-creator';
import { TutorialSection } from '@/components/tutorial-section';
import {
  AppMode,
  ConversionResult,
  ConversionProgress as ProgressType,
  YouTubeTrack,
  YouTubeDraftItem,
} from '@/types';
import { toast } from 'sonner';
import { FaYoutube, FaSpotify } from 'react-icons/fa';
import { ListMusic } from 'lucide-react';

export default function Home() {
  const [activeMode, setActiveMode] = useState<AppMode>('yt-to-spotify');

  // YouTube -> Spotify State
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [playlistDefaultName, setPlaylistDefaultName] = useState('Converted Playlist');

  // Text -> YouTube State
  const [ytDraftLoading, setYtDraftLoading] = useState(false);
  const [ytDraftItems, setYtDraftItems] = useState<YouTubeDraftItem[]>([]);
  const [isYtCreatorOpen, setIsYtCreatorOpen] = useState(false);

  // Switch modes and clear temporary states
  const handleModeChange = (mode: AppMode) => {
    setActiveMode(mode);
    setProgress(null);
  };

  // ----------------------------------------------------
  // MODE 1: YouTube -> Spotify
  // ----------------------------------------------------
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
        setPlaylistDefaultName('Converted YouTube Playlist');
      } else {
        setPlaylistDefaultName(tracks[0].title);
      }

      // 2. Search Spotify in chunks
      setProgress({ total: tracks.length, completed: 0, currentTrack: tracks[0].title });

      const newResults: ConversionResult[] = [];
      const chunkSize = 5;

      for (let i = 0; i < tracks.length; i += chunkSize) {
        const chunk = tracks.slice(i, i + chunkSize);

        if (chunk.length > 0) {
          setProgress((prev) => (prev ? { ...prev, currentTrack: chunk[0].title } : null));
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

        setProgress((prev) =>
          prev
            ? {
                total: prev.total,
                completed: Math.min(prev.completed + chunk.length, prev.total),
              }
            : null
        );

        setResults([...newResults]);
      }

      toast.success(`Found matches for ${newResults.filter((r) => r.spotifyMatch).length} tracks!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  const handleToggleSpotifyTrack = (id: string, selected: boolean) => {
    setResults((prev) =>
      prev.map((r) => (r.youtubeTrack.id === id ? { ...r, selected } : r))
    );
  };

  const handleToggleAllSpotify = (selected: boolean) => {
    setResults((prev) =>
      prev.map((r) => (r.spotifyMatch?.id ? { ...r, selected } : r))
    );
  };

  const handleCreateSpotifyPlaylist = () => {
    const selectedTracks = results.filter((r) => r.selected && r.spotifyMatch);
    if (selectedTracks.length === 0) {
      toast.error('Please select at least one track to add to the playlist');
      return;
    }
    setIsCreatorOpen(true);
  };

  // ----------------------------------------------------
  // MODE 2: Song List -> YouTube
  // ----------------------------------------------------
  const handleProcessSongList = async (songs: string[]) => {
    setYtDraftLoading(true);
    setProgress(null);
    setYtDraftItems([]);

    try {
      setProgress({ total: songs.length, completed: 0, currentTrack: songs[0] });

      const accumulatedDrafts: YouTubeDraftItem[] = [];
      const chunkSize = 5;

      for (let i = 0; i < songs.length; i += chunkSize) {
        const chunk = songs.slice(i, i + chunkSize);

        if (chunk.length > 0) {
          setProgress((prev) => (prev ? { ...prev, currentTrack: chunk[0] } : null));
        }

        const res = await fetch('/api/youtube/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queries: chunk }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to search YouTube');
        }

        accumulatedDrafts.push(...data.results);

        setProgress((prev) =>
          prev
            ? {
                total: prev.total,
                completed: Math.min(prev.completed + chunk.length, prev.total),
              }
            : null
        );

        setYtDraftItems([...accumulatedDrafts]);
      }

      const matchCount = accumulatedDrafts.filter((item) => item.status === 'success' && item.selectedTrack).length;
      toast.success(`Found YouTube matches for ${matchCount} songs!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setYtDraftLoading(false);
      setProgress(null);
    }
  };

  const handleToggleDraftItem = (id: string, selected: boolean) => {
    setYtDraftItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected } : item))
    );
  };

  const handleToggleAllDraft = (selected: boolean) => {
    setYtDraftItems((prev) =>
      prev.map((item) => (item.selectedTrack ? { ...item, selected } : item))
    );
  };

  const handleSelectCandidate = (id: string, track: YouTubeTrack) => {
    setYtDraftItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedTrack: track, selected: true } : item))
    );
  };

  const handleCreateYouTubePlaylist = () => {
    const selectedVideos = ytDraftItems.filter((i) => i.selected && i.selectedTrack);
    if (selectedVideos.length === 0) {
      toast.error('Please select at least one song for the YouTube playlist');
      return;
    }
    setIsYtCreatorOpen(true);
  };

  // Computed states
  const hasStartedYtToSpotify = isLoading || results.length > 0;
  const hasStartedTextToYt = ytDraftLoading || ytDraftItems.length > 0;
  const hasStarted = activeMode === 'yt-to-spotify' ? hasStartedYtToSpotify : hasStartedTextToYt;

  const selectedSpotifyUris = results
    .filter((r) => r.selected && r.spotifyMatch)
    .map((r) => r.spotifyMatch!.uri);

  const selectedYtVideoIds = ytDraftItems
    .filter((i) => i.selected && i.selectedTrack)
    .map((i) => i.selectedTrack!.id);

  return (
    <>
      <Header activeMode={activeMode} onModeChange={handleModeChange} />

      <main
        className={`flex-1 container mx-auto px-4 flex flex-col transition-all duration-700 ease-in-out ${
          hasStarted ? 'justify-start pt-8 pb-24' : 'justify-center items-center pb-[12vh]'
        }`}
      >
        <div className={`w-full mx-auto transition-all duration-700 ease-in-out ${hasStarted ? 'max-w-4xl' : 'max-w-3xl'}`}>
          {/* Hero Section */}
          <div
            className={`text-center mx-auto space-y-4 transition-all duration-700 ${
              hasStarted ? 'mb-6 scale-95 opacity-90 hidden md:block' : 'mb-10 scale-100 opacity-100'
            }`}
          >
            {activeMode === 'yt-to-spotify' ? (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Seamlessly port your music from <br className="hidden md:block" />
                  <span className="text-[#FF0000] inline-flex items-center gap-1 mx-2">
                    <FaYoutube className="w-[0.9em] h-[0.9em]" />
                    YouTube
                  </span>
                  to
                  <span className="text-[#1DB954] inline-flex items-center gap-1 mx-2">
                    <FaSpotify className="w-[0.9em] h-[0.9em]" />
                    Spotify
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Paste a link to any YouTube video or playlist, and we&apos;ll instantly find the tracks on Spotify and bundle them up for you.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Turn your text song list into a <br className="hidden md:block" />
                  <span className="text-[#FF0000] inline-flex items-center gap-1.5 mx-2">
                    <FaYoutube className="w-[0.9em] h-[0.9em]" />
                    YouTube Playlist
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Paste your song list, draft and fine-tune your favorite matches, and create an instant YouTube queue playlist in seconds.
                </p>
              </>
            )}
          </div>

          {/* Active Input Component */}
          {activeMode === 'yt-to-spotify' ? (
            <UrlInput onProcess={handleProcessUrl} isLoading={isLoading} />
          ) : (
            <SongListInput onProcess={handleProcessSongList} isLoading={ytDraftLoading} />
          )}
        </div>

        {!hasStarted && <TutorialSection mode={activeMode} />}

        {progress && (
          <div className="mt-8">
            <ConversionProgress progress={progress} />
          </div>
        )}

        {/* Results Sections */}
        {activeMode === 'yt-to-spotify' ? (
          <TrackList
            results={results}
            onToggleTrack={handleToggleSpotifyTrack}
            onToggleAll={handleToggleAllSpotify}
            onCreatePlaylist={handleCreateSpotifyPlaylist}
          />
        ) : (
          <YouTubeDraftList
            items={ytDraftItems}
            onToggleItem={handleToggleDraftItem}
            onToggleAll={handleToggleAllDraft}
            onSelectCandidate={handleSelectCandidate}
            onCreatePlaylist={handleCreateYouTubePlaylist}
          />
        )}
      </main>

      {/* Spotify Playlist Creator Dialog */}
      <PlaylistCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        trackUris={selectedSpotifyUris}
        defaultName={playlistDefaultName}
      />

      {/* YouTube Playlist Creator Dialog */}
      <YouTubePlaylistCreator
        isOpen={isYtCreatorOpen}
        onClose={() => setIsYtCreatorOpen(false)}
        videoIds={selectedYtVideoIds}
        defaultName="My YouTube Playlist"
      />
    </>
  );
}
