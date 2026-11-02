'use client';

import { useState } from 'react';
import { YouTubeDraftItem, YouTubeTrack } from '@/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, ChevronDown, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface YouTubeDraftCardProps {
  item: YouTubeDraftItem;
  onToggle: (id: string, selected: boolean) => void;
  onSelectCandidate: (id: string, track: YouTubeTrack) => void;
}

export function YouTubeDraftCard({ item, onToggle, onSelectCandidate }: YouTubeDraftCardProps) {
  const [showCandidates, setShowCandidates] = useState(false);
  const { id, query, selectedTrack, candidates, selected, status } = item;
  const isFound = status === 'success' && selectedTrack !== null;

  return (
    <Card className={`p-3 md:p-4 transition-all duration-200 ${selected ? 'border-primary/80 shadow-sm bg-primary/5' : ''}`}>
      <div className="flex items-start sm:items-center gap-3 md:gap-4">
        {/* Selection Checkbox */}
        <div className="pt-1 sm:pt-0 flex-shrink-0">
          <Checkbox
            checked={selected}
            disabled={!isFound}
            onCheckedChange={(checked) => onToggle(id, checked === true)}
            className="w-5 h-5 data-[state=checked]:bg-[#FF0000] data-[state=checked]:border-[#FF0000] data-[state=checked]:text-white"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4">
          {/* Query (User text) */}
          <div className="flex items-center min-w-0 pr-2">
            <div className="w-full">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block mb-0.5">
                Your Search
              </span>
              <p className="text-sm font-medium leading-snug break-words text-foreground" title={query}>
                {query}
              </p>
            </div>
          </div>

          {/* YouTube Matched Track */}
          <div className="flex flex-col justify-center">
            {isFound ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-10 md:w-16 md:h-11 flex-shrink-0 bg-muted rounded overflow-hidden shadow-xs">
                    {selectedTrack.thumbnail ? (
                      <Image
                        src={selectedTrack.thumbnail}
                        alt={selectedTrack.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <Play className="w-4 h-4 text-zinc-400 fill-current" />
                      </div>
                    )}
                    {selectedTrack.duration && (
                      <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-black/80 text-white px-1 rounded-xs font-mono">
                        {selectedTrack.duration}
                      </span>
                    )}
                  </div>

                  {/* Title & Channel */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate text-[#FF0000] leading-tight" title={selectedTrack.title}>
                      {selectedTrack.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5" title={selectedTrack.channel}>
                      {selectedTrack.channel}
                    </p>
                  </div>
                </div>

                {/* Actions: Candidate switcher & preview link */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {candidates.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCandidates(!showCandidates)}
                      className="h-8 px-2 text-xs font-medium gap-1"
                      title="Choose another match from top results"
                    >
                      Top {candidates.length}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCandidates ? 'rotate-180' : ''}`} />
                    </Button>
                  )}

                  <a
                    href={`https://www.youtube.com/watch?v=${selectedTrack.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    title="Watch on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive/80 py-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm italic">No matching video found on YouTube</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Swap Drawer / Dropdown */}
      {showCandidates && candidates.length > 1 && (
        <div className="mt-3 pt-3 border-t border-border/60 pl-8 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-semibold text-muted-foreground">Select alternative match:</p>
          <div className="grid grid-cols-1 gap-1.5">
            {candidates.map((candidate, idx) => {
              const isCurrent = candidate.id === selectedTrack?.id;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => {
                    onSelectCandidate(id, candidate);
                    setShowCandidates(false);
                  }}
                  className={`w-full flex items-center justify-between text-left p-2 rounded-md text-xs transition-colors border ${
                    isCurrent
                      ? 'bg-primary/10 border-primary/40 font-semibold text-foreground'
                      : 'hover:bg-muted/70 border-transparent text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <Badge variant="outline" className="text-[10px] h-4 px-1 shrink-0 font-mono">
                      #{idx + 1}
                    </Badge>
                    <span className="truncate">{candidate.title}</span>
                    <span className="text-[11px] opacity-75 shrink-0">({candidate.channel})</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {candidate.duration && (
                      <span className="font-mono text-[10px] text-muted-foreground">{candidate.duration}</span>
                    )}
                    {isCurrent && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

