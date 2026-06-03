import { NextResponse } from 'next/server';
import { parseYouTubeUrl } from '@/lib/url-parser';
import { getVideoDetails, getPlaylistItems } from '@/lib/youtube';
import { YouTubeTrack } from '@/types';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const parsed = parseYouTubeUrl(url);

    if (!parsed) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    let tracks: YouTubeTrack[] = [];

    if (parsed.type === 'video') {
      const video = await getVideoDetails(parsed.id);
      if (!video) {
        return NextResponse.json({ error: 'Video not found or is private' }, { status: 404 });
      }
      tracks = [video];
    } else if (parsed.type === 'playlist') {
      tracks = await getPlaylistItems(parsed.id);
      if (tracks.length === 0) {
        return NextResponse.json({ error: 'Playlist is empty, private, or not found' }, { status: 404 });
      }
    }

    return NextResponse.json({
      type: parsed.type,
      tracks,
    });
  } catch (error: any) {
    console.error('YouTube API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch YouTube data' },
      { status: 500 }
    );
  }
}
