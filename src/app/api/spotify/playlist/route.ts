import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { createPlaylist, addTracksToPlaylist } from '@/lib/spotify';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session as any).accessToken) {
      return NextResponse.json({ error: 'Unauthorized. Please log in with Spotify.' }, { status: 401 });
    }

    // @ts-ignore
    const token = session.accessToken;
    // NextAuth doesn't expose provider account id easily in session unless configured, 
    // but the access token allows us to call /me to get the user ID.
    // Let's fetch the user ID using the token.
    const meRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!meRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 401 });
    }
    
    const me = await meRes.json();
    const userId = me.id;

    const { name, trackUris, isPublic = false } = await request.json();

    if (!name || !trackUris || !Array.isArray(trackUris) || trackUris.length === 0) {
      return NextResponse.json({ error: 'Playlist name and track URIs are required' }, { status: 400 });
    }

    // 1. Create the playlist
    const playlist = await createPlaylist(name, isPublic, userId, token);

    // 2. Add tracks to the playlist
    await addTracksToPlaylist(playlist.id, trackUris, token);

    return NextResponse.json({
      success: true,
      playlistUrl: playlist.external_urls.spotify,
      playlistId: playlist.id,
    });
  } catch (error: any) {
    console.error('Spotify Playlist Creation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
