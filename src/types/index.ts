export interface YouTubeTrack {
  id: string;
  title: string;
  channel: string;
  duration?: string;
  thumbnail?: string;
}

export type MatchConfidence = 'Exact' | 'Partial' | 'Not Found';

export interface SpotifyMatch {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt?: string;
  uri: string;
  confidence: MatchConfidence;
}

export interface ConversionResult {
  youtubeTrack: YouTubeTrack;
  spotifyMatch: SpotifyMatch | null;
  status: 'pending' | 'success' | 'error';
  selected: boolean; // Whether the user wants to include this in the playlist
}

export interface ConversionProgress {
  total: number;
  completed: number;
  currentTrack?: string;
}

export type AppMode = 'yt-to-spotify' | 'text-to-yt';

export interface YouTubeDraftItem {
  id: string; // Unique row ID
  query: string; // Cleaned song query from textbox
  selectedTrack: YouTubeTrack | null; // Defaults to candidates[0]
  candidates: YouTubeTrack[]; // Top 3 results from search
  status: 'pending' | 'success' | 'error';
  selected: boolean; // Checked by default when candidates.length > 0
}
