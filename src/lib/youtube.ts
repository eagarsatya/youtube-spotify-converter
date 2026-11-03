import { google } from 'googleapis';
import { YouTubeTrack } from '@/types';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function searchYouTubeVideos(query: string, limit = 3): Promise<YouTubeTrack[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const ytSearchModule: any = await import('yt-search');
    const ytSearch = ytSearchModule.default || ytSearchModule;
    const searchResult = await ytSearch(cleanQuery);
    const videos = searchResult.videos || [];

    if (videos.length > 0) {
      return videos.slice(0, limit).map((video: any) => ({
        id: video.videoId,
        title: video.title,
        channel: video.author?.name || 'Unknown Channel',
        duration: video.timestamp || undefined,
        thumbnail: video.thumbnail || undefined,
      }));
    }
  } catch (ytError) {
    console.warn(`yt-search failed for query "${cleanQuery}", trying API fallback if configured:`, ytError);
  }

  // Fallback to official YouTube API if YOUTUBE_API_KEY is configured
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const res: any = await youtube.search.list({
        part: ['snippet'],
        q: cleanQuery,
        type: ['video'],
        maxResults: limit,
      });

      const items = res.data.items || [];
      return items.map((item: any) => ({
        id: item.id?.videoId || '',
        title: item.snippet?.title || 'Unknown Title',
        channel: item.snippet?.channelTitle || 'Unknown Channel',
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || undefined,
      })).filter((t: YouTubeTrack) => Boolean(t.id));
    } catch (apiError) {
      console.error('YouTube API search fallback failed:', apiError);
    }
  }

  return [];
}

/**
 * Builds YouTube instant queue URLs.
 * YouTube's watch_videos endpoint supports up to 50 video IDs per link.
 */
export function buildInstantYouTubePlaylistUrls(videoIds: string[]): string[] {
  if (videoIds.length === 0) return [];
  const chunkSize = 50;
  const urls: string[] = [];

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    urls.push(`https://www.youtube.com/watch_videos?video_ids=${chunk.join(',')}`);
  }

  return urls;
}

export async function getVideoDetails(videoId: string): Promise<YouTubeTrack | null> {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is missing');
  }

  try {
    const res: any = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: [videoId],
    });

    const item: any = res.data.items?.[0];
    if (!item) return null;

    return {
      id: item.id!,
      title: item.snippet?.title || 'Unknown Title',
      channel: item.snippet?.channelTitle || 'Unknown Channel',
      duration: item.contentDetails?.duration || undefined,
      thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || undefined,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}

export async function getPlaylistItems(playlistId: string): Promise<YouTubeTrack[]> {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is missing');
  }

  let tracks: YouTubeTrack[] = [];
  let nextPageToken: string | null | undefined = undefined;

  try {
    do {
      const res: any = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken || undefined,
      });

      const items = res.data.items || [];
      
      const pageTracks: YouTubeTrack[] = items.map((item: any) => ({
        id: item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || '',
        title: item.snippet?.title || 'Unknown Title',
        channel: item.snippet?.videoOwnerChannelTitle || 'Unknown Channel',
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || undefined,
      })).filter((t: YouTubeTrack) => t.id && t.title !== 'Private video' && t.title !== 'Deleted video');

      tracks = [...tracks, ...pageTracks];
      nextPageToken = res.data.nextPageToken;

    } while (nextPageToken);

    return tracks;
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    throw error;
  }
}
