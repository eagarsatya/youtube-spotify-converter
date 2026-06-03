export function extractVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\S+)?/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function extractPlaylistId(url: string): string | null {
  const regex = /[?&]list=([\w-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function parseYouTubeUrl(url: string): { type: 'video' | 'playlist'; id: string } | null {
  const playlistId = extractPlaylistId(url);
  if (playlistId) {
    return { type: 'playlist', id: playlistId };
  }

  const videoId = extractVideoId(url);
  if (videoId) {
    return { type: 'video', id: videoId };
  }

  return null;
}
