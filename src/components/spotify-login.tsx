'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export function SpotifyLogin() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm hidden sm:block">
          <span className="text-muted-foreground">Signed in as </span>
          <span className="font-medium text-foreground">{session.user.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      className="bg-[#1DB954] text-black hover:bg-[#1ed760] hover:text-black font-semibold"
      onClick={() => signIn('spotify')}
    >
      <LogIn className="w-4 h-4 mr-2" />
      Connect Spotify
    </Button>
  );
}
