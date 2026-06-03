import { SpotifyMatch, MatchConfidence } from '@/types';

export async function getClientCredentialsToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify client credentials are not configured.');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    cache: 'no-store', // Important so we don't cache stale tokens
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Spotify token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function searchTrack(title: string, artist: string, token: string): Promise<SpotifyMatch> {
  // Try with both track and artist first
  const query = `track:${encodeURIComponent(title)} artist:${encodeURIComponent(artist)}`;
  let searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;
  
  let response = await fetch(searchUrl, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Spotify Rate Limit Exceeded');
    }
    return createNotFoundMatch();
  }

  let data = await response.json();

  // If no results, try just the track name (fallback)
  if (!data.tracks?.items?.length) {
    const fallbackQuery = `${encodeURIComponent(title)}`;
    searchUrl = `https://api.spotify.com/v1/search?q=${fallbackQuery}&type=track&limit=1`;
    
    response = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      data = await response.json();
    }
  }

  const item = data.tracks?.items?.[0];
  
  if (!item) {
    return createNotFoundMatch();
  }

  return {
    id: item.id,
    name: item.name,
    artist: item.artists.map((a: any) => a.name).join(', '),
    album: item.album.name,
    albumArt: item.album.images?.[0]?.url,
    uri: item.uri,
    // Just a naive confidence check for now. We can improve this!
    confidence: item.name.toLowerCase() === title.toLowerCase() ? 'Exact' : 'Partial',
  };
}

export async function createPlaylist(name: string, isPublic: boolean, userId: string, token: string): Promise<any> {
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description: 'Converted from YouTube using YouTube-to-Spotify Converter',
      public: isPublic,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create playlist');
  }

  return await response.json();
}

export async function addTracksToPlaylist(playlistId: string, trackUris: string[], token: string): Promise<void> {
  // Spotify limits to 100 tracks per request. We need to chunk.
  const chunkSize = 100;
  for (let i = 0; i < trackUris.length; i += chunkSize) {
    const chunk = trackUris.slice(i, i + chunkSize);
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: chunk,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to add tracks chunk ${i / chunkSize}`);
    }
  }
}

function createNotFoundMatch(): SpotifyMatch {
  return {
    id: '',
    name: '',
    artist: '',
    album: '',
    uri: '',
    confidence: 'Not Found',
  };
}
