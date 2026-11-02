'use client';

import { FaYoutube, FaSpotify, FaGithub, FaCoffee } from 'react-icons/fa';
import { Sparkles, GitBranch } from 'lucide-react';
import { CURRENT_VERSION } from '@/data/changelog';

interface FooterProps {
  onOpenChangelog: () => void;
}

export function Footer({ onOpenChangelog }: FooterProps) {
  return (
    <footer className="border-t bg-background/50 text-muted-foreground mt-auto transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Version Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <FaYoutube className="w-4 h-4 text-[#FF0000]" />
              <span>↔</span>
              <FaSpotify className="w-4 h-4 text-[#1DB954]" />
              <span>Playlist Converter</span>
            </div>

            <button
              type="button"
              onClick={onOpenChangelog}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition-all cursor-pointer"
              title="View release notes & changelog"
            >
              <GitBranch className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span>v{CURRENT_VERSION}</span>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-0.5">
                • What&apos;s new
              </span>
            </button>
          </div>

          {/* Social / Support Links */}
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={onOpenChangelog}
              className="hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Changelog</span>
            </button>

            <span className="text-border">•</span>

            <a
              href="https://saweria.co/eagarsatya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
            >
              <FaCoffee className="w-3.5 h-3.5 text-amber-500" />
              <span>Donate</span>
            </a>

            <span className="text-border">•</span>

            <a
              href="https://github.com/eagarsatya/youtube-spotify-converter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/40 text-center sm:text-left text-[11px] text-muted-foreground/80 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            An open-source tool for seamless playlist migration. Not affiliated with Google, YouTube, or Spotify.
          </p>
          <p>© {new Date().getFullYear()} Playlist Converter. Free & open source.</p>
        </div>
      </div>
    </footer>
  );
}
