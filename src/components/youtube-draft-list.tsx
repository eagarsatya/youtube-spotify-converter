'use client';

import { YouTubeDraftItem, YouTubeTrack } from '@/types';
import { YouTubeDraftCard } from './youtube-draft-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FaYoutube } from 'react-icons/fa';

interface YouTubeDraftListProps {
  items: YouTubeDraftItem[];
  onToggleItem: (id: string, selected: boolean) => void;
  onToggleAll: (selected: boolean) => void;
  onSelectCandidate: (id: string, track: YouTubeTrack) => void;
  onCreatePlaylist: () => void;
}

export function YouTubeDraftList({
  items,
  onToggleItem,
  onToggleAll,
  onSelectCandidate,
  onCreatePlaylist,
}: YouTubeDraftListProps) {
  if (items.length === 0) return null;

  const total = items.length;
  const matched = items.filter((i) => i.status === 'success' && i.selectedTrack).length;
  const notFound = total - matched;
  const selectedCount = items.filter((i) => i.selected && i.selectedTrack).length;
  const allMatchedSelected = selectedCount === matched && matched > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>Draft YouTube Playlist</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
              {total} Total Songs
            </Badge>
            <Badge variant="outline" className="border-red-500/30 text-[#FF0000] bg-red-500/10 font-normal">
              {matched} Matched
            </Badge>
            {notFound > 0 && (
              <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10 font-normal">
                {notFound} Not Found
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
            className="rounded-md text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] h-10 sm:h-9 px-6 bg-[#FF0000] hover:bg-[#d90000] text-white shadow-md w-full sm:w-auto flex items-center gap-2"
            disabled={selectedCount === 0}
            onClick={onCreatePlaylist}
          >
            <FaYoutube className="w-4 h-4" />
            Create Playlist ({selectedCount})
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Draft Song List */}
      <ScrollArea className="h-[60vh] min-h-[400px] rounded-md pr-4">
        <div className="space-y-3 pb-4 px-1 pt-1">
          {items.map((item) => (
            <YouTubeDraftCard
              key={item.id}
              item={item}
              onToggle={onToggleItem}
              onSelectCandidate={onSelectCandidate}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

