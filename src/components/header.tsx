import { SpotifyLogin } from './spotify-login';
import { ThemeToggle } from './theme-toggle';
import { FaYoutube, FaSpotify, FaGithub } from 'react-icons/fa';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaYoutube className="w-8 h-8 text-[#FF0000]" />
          <span className="text-muted-foreground mx-1">→</span>
          <FaSpotify className="w-8 h-8 text-[#1DB954]" />
          <h1 className="font-bold text-lg hidden sm:block ml-2 tracking-tight">YouTube to Spotify</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
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
          <SpotifyLogin />
        </div>
      </div>
    </header>
  );
}
