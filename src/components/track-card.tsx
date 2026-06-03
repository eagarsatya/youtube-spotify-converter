'use client';

import { ConversionResult } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Music, ExternalLink, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface TrackCardProps {
  result: ConversionResult;
  onToggle: (id: string, selected: boolean) => void;
}

export function TrackCard({ result, onToggle }: TrackCardProps) {
  const { youtubeTrack, spotifyMatch, status, selected } = result;

  const isMatched = status === 'success' && spotifyMatch;

  return (
    <Card className={`p-4 transition-all duration-200 ${selected ? 'border-primary shadow-sm bg-primary/5' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <Checkbox 
            checked={selected} 
            disabled={!isMatched}
            onCheckedChange={(checked) => onToggle(youtubeTrack.id, checked === true)}
            className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>

        {/* Content Area */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow items-center">
          
          {/* YouTube Side */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-12 flex-shrink-0 bg-muted rounded overflow-hidden">
              {youtubeTrack.thumbnail ? (
                <Image 
                  src={youtubeTrack.thumbnail} 
                  alt={youtubeTrack.title} 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <Play className="w-6 h-6 text-zinc-500 fill-current" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" title={youtubeTrack.title}>
                {youtubeTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate" title={youtubeTrack.channel}>
                {youtubeTrack.channel}
              </p>
            </div>
          </div>

          {/* Arrow (Desktop only) */}
          <div className="hidden md:flex items-center justify-center text-muted-foreground/40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            →
          </div>

          {/* Spotify Side */}
          <div className="flex items-center justify-between md:pl-8">
            {isMatched ? (
              <div className="flex items-center gap-3 w-full">
                <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden shadow-sm">
                  {spotifyMatch.albumArt ? (
                    <Image 
                      src={spotifyMatch.albumArt} 
                      alt={spotifyMatch.album} 
                      fill 
                      className="object-cover" 
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                      <Music className="w-6 h-6 text-[#1DB954]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate text-[#1DB954]" title={spotifyMatch.name}>
                      {spotifyMatch.name}
                    </p>
                    {spotifyMatch.confidence === 'Exact' ? (
                      <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-green-500/30 text-green-500 bg-green-500/10">Exact</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-yellow-500/30 text-yellow-500 bg-yellow-500/10">Partial</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate" title={spotifyMatch.artist}>
                    {spotifyMatch.artist}
                  </p>
                </div>
                <a 
                  href={`https://open.spotify.com/track/${spotifyMatch.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                  title="Open in Spotify"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground py-2 md:py-0 w-full">
                <AlertCircle className="w-4 h-4 text-destructive/80" />
                <span className="text-sm italic text-destructive/80">No match found on Spotify</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </Card>
  );
}
