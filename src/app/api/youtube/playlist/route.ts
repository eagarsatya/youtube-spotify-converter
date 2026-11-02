import { NextResponse } from 'next/server';
import { buildInstantYouTubePlaylistUrls } from '@/lib/youtube';

export async function POST(request: Request) {
  try {
    const { videoIds, name } = await request.json();

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json({ error: 'Video IDs list is required' }, { status: 400 });
    }

    const playlistUrls = buildInstantYouTubePlaylistUrls(videoIds);

    return NextResponse.json({
      success: true,
      instantUrl: playlistUrls[0],
      playlistUrls,
      name: name || 'Custom YouTube Playlist',
      totalVideos: videoIds.length,
      // OAuth placeholder indicator to inform the client of future capability
      oauthSupported: false,
    });
  } catch (error: any) {
    console.error('YouTube Playlist Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}

