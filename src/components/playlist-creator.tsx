'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Loader2, ListMusic } from 'lucide-react';
import { toast } from 'sonner';

interface PlaylistCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  trackUris: string[];
  defaultName?: string;
}

export function PlaylistCreator({ isOpen, onClose, trackUris, defaultName = 'Converted Playlist' }: PlaylistCreatorProps) {
  const { data: session } = useSession();
  const [name, setName] = useState(defaultName);
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!session) {
      signIn('spotify');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    setIsCreating(true);
    setSuccessUrl(null);

    try {
      const res = await fetch('/api/spotify/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          isPublic,
          trackUris,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create playlist');
      }

      setSuccessUrl(data.playlistUrl);
      toast.success('Playlist created successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Reset state when modal is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setSuccessUrl(null);
        setName(defaultName);
        setIsPublic(false);
      }, 300);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ListMusic className="w-5 h-5 text-[#1DB954]" />
            Create Spotify Playlist
          </DialogTitle>
          <DialogDescription>
            You are about to create a playlist with {trackUris.length} tracks.
          </DialogDescription>
        </DialogHeader>

        {successUrl ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-[#1DB954] rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#1DB954] to-[#1ed760] text-black rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/20 border-4 border-background">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Playlist Ready!</h3>
              <p className="text-muted-foreground text-sm">Your tracks have been successfully ported over.</p>
            </div>
            
            <div className="w-full space-y-3 pt-2">
              <a 
                href={successUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12 px-8 w-full bg-[#1DB954] hover:bg-[#1ed760] text-black shadow-md"
              >
                Open in Spotify
                <ExternalLink className="w-5 h-5 ml-2 opacity-80" />
              </a>
              <Button variant="ghost" className="w-full rounded-full h-12 font-medium" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {!session ? (
              <div className="bg-muted/50 p-4 rounded-lg text-center space-y-4 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  You need to connect your Spotify account to create playlists.
                </p>
                <Button 
                  className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold w-full"
                  onClick={() => signIn('spotify')}
                >
                  Connect Spotify
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Playlist Name</Label>
                  <Input
                    id="playlist-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Awesome Playlist"
                    className="col-span-3 text-lg"
                    autoFocus
                  />
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 bg-muted/20">
                  <Checkbox 
                    id="public" 
                    checked={isPublic}
                    onCheckedChange={(checked) => setIsPublic(checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="public" className="font-medium">
                      Make it public
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Public playlists appear on your Spotify profile.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!successUrl && session && (
          <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating || !name.trim()}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold min-w-[120px]"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Playlist'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
