export interface CleanedTitle {
  title: string;
  artist: string;
}

export function cleanYouTubeTitle(rawTitle: string, channelName: string): CleanedTitle {
  let title = rawTitle;

  // 1. Remove common noise tags
  const noisePatterns = [
    /\[[^\]]*\]/g, // anything in brackets, e.g., [Official Video], [Lyrics]
    /\([^\)]*(official|video|audio|lyric|live|remix|hd|4k)[^\)]*\)/gi, // (Official Video), etc.
    /\|.*official.*/gi, // | Official Music Video
    /["']/g, // Quotes around titles
    /m\/?v/gi, // MV or M/V
  ];

  for (const pattern of noisePatterns) {
    title = title.replace(pattern, '');
  }

  // 2. Normalize featuring tags
  // Replace " ft ", " ft. ", " feat. ", " featuring " with " feat. "
  title = title.replace(/\s+(ft|feat|featuring)\.?\s+/gi, ' feat. ');

  // 3. Attempt to split "Artist - Title" format
  let artist = channelName; // Fallback to channel name
  const splitDash = title.split(/\s+-\s+/);

  if (splitDash.length >= 2) {
    // Usually the first part is the artist, second part is the song
    artist = splitDash[0].trim();
    title = splitDash.slice(1).join(' ').trim(); // Re-join the rest just in case there are multiple dashes
  } else {
    // If there's no dash, channel name is often the artist (except VEVO)
    artist = artist.replace(/VEVO$/i, '').trim();
  }

  // 4. Clean up any remaining artifacts
  title = title.trim().replace(/\s{2,}/g, ' ');
  artist = artist.trim().replace(/\s{2,}/g, ' ');

  return { title, artist };
}
