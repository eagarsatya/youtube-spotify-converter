import { ThemeToggle } from './theme-toggle';
import { FaYoutube, FaSpotify, FaGithub, FaCoffee } from 'react-icons/fa';
import { AppMode } from '@/types';
import { ListMusic, Sparkles } from 'lucide-react';
import { CURRENT_VERSION } from '@/data/changelog';

interface HeaderProps {
  activeMode?: AppMode;
  onModeChange?: (mode: AppMode) => void;
  onOpenChangelog?: () => void;
}

export function Header({ activeMode = 'yt-to-spotify', onModeChange, onOpenChangelog }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaYoutube className="w-7 h-7 text-[#FF0000]" />
          <span className="text-muted-foreground mx-0.5">↔</span>
          <FaSpotify className="w-7 h-7 text-[#1DB954]" />
          <h1 className="font-bold text-base sm:text-lg hidden md:block ml-2 tracking-tight">
            Playlist Converter
          </h1>
          {onOpenChangelog && (
            <button
              type="button"
              onClick={onOpenChangelog}
              className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer ml-1"
              title="View release notes & changelog"
            >
              v{CURRENT_VERSION}
            </button>
          )}
        </div>

        {/* Mode Switcher Navigation Pills */}
        {onModeChange && (
          <div className="flex items-center bg-muted/60 p-1 rounded-full border border-border/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onModeChange('yt-to-spotify')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${activeMode === 'yt-to-spotify'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <FaSpotify className="w-3.5 h-3.5 text-[#1DB954]" />
              <span className="hidden sm:inline">YouTube to</span> Spotify
            </button>

            <button
              type="button"
              onClick={() => onModeChange('text-to-yt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${activeMode === 'text-to-yt'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <ListMusic className="w-3.5 h-3.5 text-[#FF0000]" />
              <span className="hidden sm:inline">Song List to</span> YouTube
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2">
          {onOpenChangelog && (
            <button
              type="button"
              onClick={onOpenChangelog}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted cursor-pointer"
              title="What's new & Changelog"
            >
              <Sparkles className="w-5 h-5" />
              <span className="sr-only">What&apos;s new</span>
            </button>
          )}
          <a
            href="https://saweria.co/eagarsatya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-amber-500 transition-colors p-2 rounded-full hover:bg-amber-500/10"
            title="Support me on Saweria"
          >
            <FaCoffee className="w-5 h-5" />
            <span className="sr-only">Donate via Saweria</span>
          </a>
          <a
            href="https://github.com/eagarsatya/youtube-spotify-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
            title="View source on GitHub"
          >
            <FaGithub className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
