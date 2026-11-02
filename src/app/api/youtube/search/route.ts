import { NextResponse } from 'next/server';
import { searchYouTubeVideos } from '@/lib/youtube';
import { YouTubeDraftItem } from '@/types';

export async function POST(request: Request) {
  try {
    const { queries } = await request.json();

    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return NextResponse.json({ error: 'Song queries list is required' }, { status: 400 });
    }

    // Limit batch size to protect resources
    const safeQueries = queries.slice(0, 100);

    const results: YouTubeDraftItem[] = await Promise.all(
      safeQueries.map(async (query: string, index: number) => {
        const cleaned = typeof query === 'string' ? query.trim() : '';
        if (!cleaned) {
          return {
            id: `draft-${Date.now()}-${index}`,
            query: '',
            selectedTrack: null,
            candidates: [],
            status: 'error',
            selected: false,
          } as YouTubeDraftItem;
        }

        try {
          const candidates = await searchYouTubeVideos(cleaned, 3);
          const topMatch = candidates.length > 0 ? candidates[0] : null;

          return {
            id: `draft-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
            query: cleaned,
            selectedTrack: topMatch,
            candidates,
            status: candidates.length > 0 ? 'success' : 'error',
            selected: candidates.length > 0,
          } as YouTubeDraftItem;
        } catch (err) {
          console.error(`Failed to search YouTube for: ${cleaned}`, err);
          return {
            id: `draft-${Date.now()}-${index}`,
            query: cleaned,
            selectedTrack: null,
            candidates: [],
            status: 'error',
            selected: false,
          } as YouTubeDraftItem;
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('YouTube Search Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search YouTube' },
      { status: 500 }
    );
  }
}

