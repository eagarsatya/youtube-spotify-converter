import { google } from 'googleapis';
import { YouTubeTrack } from '@/types';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

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
