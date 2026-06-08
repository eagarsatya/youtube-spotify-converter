'use client';

import { ConversionResult } from '@/types';
import { TrackCard } from './track-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface TrackListProps {
  results: ConversionResult[];
  onToggleTrack: (id: string, selected: boolean) => void;
  onToggleAll: (selected: boolean) => void;
  onCreatePlaylist: () => void;
}

export function TrackList({ results, onToggleTrack, onToggleAll, onCreatePlaylist }: TrackListProps) {
  if (results.length === 0) return null;

  const total = results.length;
  const matched = results.filter(r => r.spotifyMatch?.id).length;
  const notFound = total - matched;
  const selectedCount = results.filter(r => r.selected).length;
  const allMatchedSelected = selectedCount === matched && matched > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Conversion Results</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
              {total} Total Tracks
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/10 font-normal">
              {matched} Found
            </Badge>
            {notFound > 0 && (
              <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10 font-normal">
                {notFound} Missing
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onToggleAll(!allMatchedSelected)}
            disabled={matched === 0}
            className="w-full sm:w-auto h-10 sm:h-9 text-xs font-medium"
          >
            {allMatchedSelected ? 'Deselect All' : 'Select All Matched'}
          </Button>
          
          <Button 
            className="rounded-md text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] h-10 sm:h-9 px-6 bg-[#1DB954] hover:bg-[#1ed760] text-black shadow-md w-full sm:w-auto"
            disabled={selectedCount === 0}
            onClick={onCreatePlaylist}
          >
            Create Playlist ({selectedCount})
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Track List */}
      <ScrollArea className="h-[60vh] min-h-[400px] rounded-md pr-4">
        <div className="space-y-3 pb-4 px-1 pt-1">
          {results.map((result) => (
            <TrackCard 
              key={result.youtubeTrack.id} 
              result={result} 
              onToggle={onToggleTrack} 
            />
          ))}
        </div>
      </ScrollArea>
      
    </div>
  );
}
