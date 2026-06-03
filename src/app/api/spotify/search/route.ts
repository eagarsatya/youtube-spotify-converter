import { NextResponse } from 'next/server';
import { getClientCredentialsToken, searchTrack } from '@/lib/spotify';
import { cleanYouTubeTitle } from '@/lib/title-cleaner';
import { YouTubeTrack, SpotifyMatch, ConversionResult } from '@/types';

// Simple delay function to prevent hitting rate limits too hard
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function POST(request: Request) {
  try {
    const { tracks } = await request.json() as { tracks: YouTubeTrack[] };

    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json({ error: 'Tracks array is required' }, { status: 400 });
    }

    // Use Client Credentials flow since we only need to search (no user context needed)
    const token = await getClientCredentialsToken();
    const results: ConversionResult[] = [];

    // We process sequentially to avoid rate limiting
    // In a production app, we might want to batch these or use a background queue
    for (const track of tracks) {
      const cleaned = cleanYouTubeTitle(track.title, track.channel);
      
      try {
        const match = await searchTrack(cleaned.title, cleaned.artist, token);
        
        results.push({
          youtubeTrack: track,
          spotifyMatch: match,
          status: match.id ? 'success' : 'error',
          selected: !!match.id, // Auto-select if we found a match
        });

        // Add a small delay between requests to be nice to the Spotify API
        await delay(100);
      } catch (err) {
        console.error(`Error searching for track ${track.title}:`, err);
        results.push({
          youtubeTrack: track,
          spotifyMatch: null,
          status: 'error',
          selected: false,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Spotify Search API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search Spotify' },
      { status: 500 }
    );
  }
}
