import { NextResponse } from 'next/server';
import { getBotAccessToken, getBotUserId, createPlaylist, addTracksToPlaylist } from '@/lib/spotify';

export async function POST(request: Request) {
  try {
    const { name, trackUris } = await request.json();

    if (!name || !trackUris || !Array.isArray(trackUris) || trackUris.length === 0) {
      return NextResponse.json({ error: 'Playlist name and track URIs are required' }, { status: 400 });
    }

    // 1. Get bot token and user ID
    const token = await getBotAccessToken();
    const userId = await getBotUserId(token);

    // 2. Create the public playlist on the bot account
    const playlist = await createPlaylist(name, true, userId, token);

    // 3. Add tracks to the playlist
    await addTracksToPlaylist(playlist.id, trackUris, token);

    return NextResponse.json({
      success: true,
      playlistUrl: playlist.external_urls.spotify,
      playlistId: playlist.id,
      trackCount: trackUris.length,
    });
  } catch (error: any) {
    console.error('Spotify Playlist Creation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
