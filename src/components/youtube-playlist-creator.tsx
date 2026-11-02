'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Copy, Check, Info, Sparkles, Lock } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { toast } from 'sonner';

interface YouTubePlaylistCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  videoIds: string[];
  defaultName?: string;
}

export function YouTubePlaylistCreator({
  isOpen,
  onClose,
  videoIds,
  defaultName = 'My YouTube Playlist',
}: YouTubePlaylistCreatorProps) {
  const [playlistName, setPlaylistName] = useState(defaultName);
  const [hasCopied, setHasCopied] = useState(false);

  // Instant Queue Link generation (splits if > 50 videos)
  const chunkSize = 50;
  const instantLinks: string[] = [];
  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    instantLinks.push(`https://www.youtube.com/watch_videos?video_ids=${chunk.join(',')}`);
  }

  const primaryLink = instantLinks[0] || '';

  const handleCopyLink = (linkToCopy: string) => {
    navigator.clipboard.writeText(linkToCopy);
    setHasCopied(true);
    toast.success('Playlist link copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FaYoutube className="w-6 h-6 text-[#FF0000]" />
            Create YouTube Playlist
          </DialogTitle>
          <DialogDescription>
            Generate an instant YouTube queue playlist ready to play or save to your YouTube library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Playlist Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="yt-playlist-name" className="text-xs font-semibold uppercase text-muted-foreground">
              Playlist Title
            </Label>
            <Input
              id="yt-playlist-name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="My YouTube Playlist"
            />
          </div>

          {/* Instant Queue Option (Active Now) */}
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-foreground">Instant Playlist Queue</span>
                  <span className="text-[10px] uppercase font-bold bg-[#FF0000] text-white px-1.5 py-0.2 rounded-full">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Immediately opens {videoIds.length} {videoIds.length === 1 ? 'song' : 'songs'} in YouTube as a synchronized playlist queue without requiring account login or Google permissions.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center rounded-lg text-sm font-bold h-11 px-4 bg-[#FF0000] hover:bg-[#d90000] text-white shadow-md transition-all active:scale-[0.98]"
              >
                Open in YouTube
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleCopyLink(primaryLink)}
                className="h-11 px-4 text-xs font-semibold"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            {instantLinks.length > 1 && (
              <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground space-y-1">
                <p className="font-medium">
                  Note: YouTube queues are limited to 50 videos per link. Here are your batches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {instantLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#FF0000] underline font-medium hover:opacity-80"
                    >
                      Part {idx + 1} ({Math.min(50, videoIds.length - idx * 50)} tracks)
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User OAuth Option Placeholder (Architecture ready for Google OAuth) */}
          <div className="p-3.5 rounded-xl border border-dashed border-border/70 bg-muted/30 opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Save Directly to Google Account</span>
              </div>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                OAuth (Coming soon)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Sign in with your Google account to create a private/public playlist directly on your personal YouTube channel without having to save the queue manually.
            </p>
          </div>

          <Alert className="bg-muted/40 border-border/40 py-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-xs text-muted-foreground ml-2">
              Tip: When the YouTube queue opens, click the <strong className="text-foreground">+ (Save Playlist)</strong> button in YouTube to permanently keep it in your YouTube library!
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="rounded-md">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

