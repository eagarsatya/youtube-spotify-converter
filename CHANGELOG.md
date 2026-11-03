# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Additional playlist export formats (CSV / JSON export)
- Direct Spotify to YouTube reverse playlist conversion

---

## [1.1.1] - 2026-11-02

### Fixed
- **Production Serverless YouTube Search**: Fixed `MODULE_NOT_FOUND` error (`Cannot find module 'cheerio'`) on `/api/youtube/search` in production by externalizing `yt-search` and `cheerio` in `next.config.ts`.
- **Dependency Inclusion**: Added `cheerio` directly to `package.json` dependencies to ensure inclusion in serverless deployment artifacts.
- **Dynamic Search Fallback**: Switched `yt-search` to dynamic import within a protected try-catch block, ensuring seamless fallback to YouTube Data API v3 without route-level crashes.

---

## [1.1.0] - 2026-11-02

### Added
- **Song List to YouTube Playlist Mode**: Convert arbitrary text lists of songs (e.g. from notes, Spotify track dumps, or festival lineups) directly into a YouTube playlist.
- **Interactive Candidate Selector**: Search returns top 3 YouTube candidates per query line with thumbnails, duration, channel name, and clickable previews so users can pick the exact match before creating the playlist.
- **Google OAuth & YouTube Data API v3 Integration**: Automated playlist creation with title, description, and privacy settings (Public, Unlisted, Private).
- **Navigation Mode Switcher**: Seamlessly toggle between "YouTube to Spotify" and "Song List to YouTube" modes with state preservation.
- **In-App Changelog & Versioning**: Interactive release notes modal and version badge indicator in the header and footer.

### Changed
- Refactored playlist saving and OAuth token handling for smoother user authorization.
- Enhanced dark and light mode UI styling and responsive layouts for mobile and desktop screens.

---

## [1.0.1] - 2026-06-08

### Added
- **Interactive Tutorial Section**: Step-by-step visual guide explaining how to retrieve YouTube URLs, convert tracks, and export to Spotify.
- **Donation Support**: Added Saweria creator support button in header.
- **GitHub Repository Link**: Added quick-access link to the open-source repository.

### Fixed
- Fixed TypeScript build and type definitions for external API responses.
- Adjusted theme provider to default to light mode with smooth system transition.

---

## [1.0.0] - 2026-06-04

### Added
- **YouTube to Spotify Converter Core**:
  - Convert single YouTube videos or entire playlists into Spotify tracks.
  - Smart title cleaner that strips noise such as `[Official Music Video]`, `(Lyrics)`, `4K`, `HD`, and audio tags.
  - Chunked Spotify API search with confidence matching (`Exact`, `Partial`, `Not Found`).
  - Interactive track checklist allowing users to include or exclude specific songs.
  - One-click Spotify playlist creation via client-side OAuth.
- **Modern UI**:
  - Built with Next.js App Router, Tailwind CSS v4, Base UI, and Lucide icons.
  - Dark / Light mode toggle with smooth transitions.
  - Real-time conversion progress indicators and toasts with Sonner.
