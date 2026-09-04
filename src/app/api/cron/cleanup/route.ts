import { NextResponse } from 'next/server';
import { getBotAccessToken, getBotUserId, getBotPlaylists, unfollowPlaylist } from '@/lib/spotify';

// Expiration time in milliseconds (1 day)
const EXPIRATION_MS = 24 * 60 * 60 * 1000; 

export async function GET(request: Request) {
  try {
    // Basic security: only allow requests with a specific authorization header if configured.
    // Vercel Cron sends a `CRON_SECRET` header that matches the environment variable.
    const authHeader = request.headers.get('authorization');
    const cronSecretHeader = request.headers.get('CRON_SECRET');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret) {
      if (
        authHeader !== `Bearer ${expectedSecret}` && 
        cronSecretHeader !== expectedSecret
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const token = await getBotAccessToken();
    const userId = await getBotUserId(token);
    const playlists = await getBotPlaylists(userId, token);

    let deletedCount = 0;
    const now = Date.now();

    for (const playlist of playlists) {
      // Only check playlists created by the bot
      if (playlist.owner.id !== userId) continue;
      
      const description = playlist.description || '';
      const match = description.match(/Created:\s*(\d+)/);
      
      if (match) {
        const createdAt = parseInt(match[1], 10);
        const age = now - createdAt;
        
        if (age > EXPIRATION_MS) {
          // Playlist is older than 1 day, delete it
          await unfollowPlaylist(playlist.id, token);
          deletedCount++;
          // Add a small delay to avoid hitting rate limits when deleting many playlists
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron job completed. Deleted ${deletedCount} expired playlists.`,
      deletedCount,
      totalChecked: playlists.length
    });

  } catch (error: any) {
    console.error('Playlist cleanup cron error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to run cleanup' },
      { status: 500 }
    );
  }
}
