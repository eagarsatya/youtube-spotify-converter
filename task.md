# YouTube → Spotify Converter — Task List

---

## Phase 1: Project Scaffolding
- [x] Initialize Next.js project (`create-next-app` with TypeScript, Tailwind, App Router, src dir)
- [x] Initialize ShadCN UI (`npx shadcn@latest init`)
- [x] Install ShadCN components (button, input, card, dialog, scroll-area, toast, progress, badge, skeleton, separator, alert)
- [x] Install project dependencies (`googleapis`, `next-auth`)
- [x] Create `.env.example` with placeholder values
- [x] Create `.env.local` (gitignored) with instructions
- [x] Update `.gitignore` to ensure `.env.local` is excluded

---

## Phase 2: Core Architecture
- [x] Define TypeScript interfaces (`src/types/index.ts`)
  - [x] `YouTubeTrack` — video ID, title, channel, duration, thumbnail
  - [x] `SpotifyMatch` — track ID, name, artist, album, album art, URI, match confidence
  - [x] `ConversionResult` — YouTube track + Spotify match + status
  - [x] `ConversionProgress` — total, completed, current track
- [x] Create providers wrapper (`src/components/providers.tsx`)
  - [x] SessionProvider (NextAuth)
  - [x] Toaster (ShadCN toast)
- [x] Update root layout (`src/app/layout.tsx`)
  - [x] Add providers
  - [x] Add Google Font (Inter or similar)
  - [x] Set metadata (title, description, favicon)

---

## Phase 3: API Layer (Libraries)
- [x] YouTube URL parser (`src/lib/url-parser.ts`)
  - [x] `extractVideoId(url)` — regex for all YouTube URL formats
  - [x] `extractPlaylistId(url)` — regex for playlist URLs
  - [x] `parseYouTubeUrl(url)` — returns `{ type, id }` or error
- [x] YouTube API helpers (`src/lib/youtube.ts`)
  - [x] `getVideoDetails(videoId)` — fetch single video metadata
  - [x] `getPlaylistItems(playlistId)` — paginated fetch of all playlist videos
- [x] Title cleaner (`src/lib/title-cleaner.ts`)
  - [x] Strip common noise: `(Official Video)`, `[Lyrics]`, `(Audio)`, `[HD]`, `[4K]`, `| Official Music Video`
  - [x] Split `"Artist - Song Title"` format
  - [x] Normalize featuring tags (`ft.`, `feat.`, `featuring`)
  - [x] Remove extra whitespace and special characters
- [x] Spotify API helpers (`src/lib/spotify.ts`)
  - [x] `getClientCredentialsToken()` — server-side token for search
  - [x] `searchTrack(title, artist, token)` — search Spotify, return best match
  - [x] `createPlaylist(name, description, isPublic, userId, token)` — create playlist
  - [x] `addTracksToPlaylist(playlistId, trackUris, token)` — batch add tracks (max 100/request)
- [x] NextAuth config (`src/lib/auth-options.ts`)
  - [x] Spotify OAuth provider setup
  - [x] Scopes: `playlist-modify-public`, `playlist-modify-private`, `user-read-private`
  - [x] JWT callback to persist access token & refresh token
  - [x] Session callback to expose access token to client

---

## Phase 4: API Routes
- [x] NextAuth route (`src/app/api/auth/[...nextauth]/route.ts`)
  - [x] Export GET and POST handlers
- [x] YouTube route (`src/app/api/youtube/route.ts`)
  - [x] `POST` — accept `{ url }`, parse, fetch metadata, return tracks
  - [x] Error handling: invalid URL, private playlist, API quota exceeded
- [x] Spotify search route (`src/app/api/spotify/search/route.ts`)
  - [x] `POST` — accept `{ tracks }`, search each on Spotify using Client Credentials
  - [x] Return match results with confidence levels
  - [x] Implement rate-limiting / throttling (2-3 req/sec to Spotify)
- [x] Spotify playlist route (`src/app/api/spotify/playlist/route.ts`)
  - [x] `POST` — accept `{ name, trackUris }`, requires user auth
  - [x] Create playlist + add tracks
  - [x] Return playlist URL
  - [x] Error handling: auth expired, API errors

---

## Phase 5: UI Components & Page
- [x] Header component (`src/components/header.tsx`)
  - [x] App logo / title
  - [x] Spotify login/logout button with session state
- [x] URL Input component (`src/components/url-input.tsx`)
  - [x] Large input field with placeholder text
  - [x] Real-time URL validation (visual feedback)
  - [x] "Convert" button with loading spinner
  - [x] Support for video and playlist URLs
- [x] Track Card component (`src/components/track-card.tsx`)
  - [x] YouTube title display
  - [x] Spotify match display (name, artist, album art)
  - [x] Match confidence badge (`Exact`, `Partial`, `Not Found`)
  - [x] Checkbox for selection
  - [x] Link to open matched track in Spotify
- [x] Track List component (`src/components/track-list.tsx`)
  - [x] Scrollable list of TrackCards
  - [x] Summary stats bar (X matched, Y partial, Z not found)
  - [x] Select All / Deselect All controls
  - [x] "Create Spotify Playlist" CTA button
- [x] Conversion Progress component (`src/components/conversion-progress.tsx`)
  - [x] Progress bar (ShadCN Progress)
  - [x] Current status text ("Searching track 3 of 50...")
  - [x] Animated/pulsing state
- [x] Playlist Creator component (`src/components/playlist-creator.tsx`)
  - [x] Dialog/modal with playlist name input
  - [x] Public/private toggle
  - [x] Track count confirmation
  - [x] Loading state during creation
  - [x] Success state with "Open in Spotify" link
- [x] Spotify Login component (`src/components/spotify-login.tsx`)
  - [x] "Connect with Spotify" button (styled green)
  - [x] Signed-in state showing user name/avatar
- [x] Main Page (`src/app/page.tsx`)
  - [x] Hero section with app title + description
  - [x] URL input section
  - [x] Results section (conditionally rendered)
  - [x] State management for conversion flow

---

## Phase 6: Polish & UX
- [x] Dark mode as default (Spotify-like dark theme)
- [x] Custom color palette (Spotify green + YouTube red accents)
- [x] Loading skeletons for track cards
- [x] Toast notifications for errors and success
- [x] Smooth transitions / animations on results appearing
- [x] Responsive design (mobile-first)
- [x] Error boundary / fallback UI
- [x] Favicon and meta tags
- [x] README.md with setup instructions

---

## Phase 7: Additional Features
- [ ] Reverse conversion: Spotify → YouTube
- [ ] Support for YouTube Music links
- [ ] Manual search override when match is wrong
- [ ] Export as CSV / text list
- [ ] Conversion history (localStorage)
- [ ] Share conversion results via link
