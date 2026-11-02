'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListMusic, Search, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface SongListInputProps {
  onProcess: (songs: string[]) => void;
  isLoading: boolean;
}

export function SongListInput({ onProcess, isLoading }: SongListInputProps) {
  const [text, setText] = useState('');

  // Clean lines: strip numbers like "1. ", bullets like "- ", "* ", timestamps "[03:45]"
  const parsedSongs = text
    .split('\n')
    .map((line) =>
      line
        .replace(/^[\s\d]+[.)\]-]\s*/, '') // Numbers like 1. or 1)
        .replace(/^[-*•]\s*/, '') // Bullets like - or •
        .replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]|\(\d{1,2}:\d{2}(?::\d{2})?\)/g, '') // Timestamps
        .trim()
    )
    .filter((line) => line.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedSongs.length === 0 || isLoading) return;
    onProcess(parsedSongs);
  };

  const handleInsertSample = () => {
    const sample = [
      'Queen - Bohemian Rhapsody',
      'The Beatles - Hey Jude',
      'Michael Jackson - Billie Jean',
      'Nirvana - Smells Like Teen Spirit',
      'Eagles - Hotel California',
    ].join('\n');
    setText(sample);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-4 sm:p-6 shadow-md border-border/80 bg-card/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#FF0000]" />
            <h3 className="font-semibold text-base sm:text-lg">Paste Song List</h3>
          </div>
          <div className="flex items-center gap-2">
            {text && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={isLoading}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleInsertSample}
              disabled={isLoading}
              className="h-8 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Example
            </Button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder={`Enter or paste your songs here (one song per line):\n\n1. Queen - Bohemian Rhapsody\n2. Michael Jackson - Billie Jean\n3. The Weeknd - Blinding Lights\n...`}
            rows={7}
            className="w-full rounded-xl border border-input bg-background/90 px-4 py-3 text-sm font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:opacity-50 transition-all resize-y leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2.5 py-1 text-xs font-normal">
              {parsedSongs.length} {parsedSongs.length === 1 ? 'song detected' : 'songs detected'}
            </Badge>
            {parsedSongs.length > 50 && (
              <span className="text-xs text-amber-500 font-medium">
                (Instant queue works best up to 50 songs per batch)
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || parsedSongs.length === 0}
            className="rounded-full px-6 h-10 font-bold bg-[#FF0000] hover:bg-[#d90000] text-white shadow-sm transition-transform active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching YouTube...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find on YouTube
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

