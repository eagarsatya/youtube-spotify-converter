# YouTube to Spotify Converter 🎵

Seamlessly port your music from YouTube playlists and videos directly to Spotify! Paste a YouTube URL, review the matched tracks, and instantly generate a new Spotify playlist.

## Features
- 🎥 **Dual Support**: Works with both individual YouTube video links and full playlist links.
- 🧹 **Smart Title Cleaning**: Automatically strips out noise like `(Official Video)` or `[Lyrics]` to ensure accurate Spotify searches.
- ⚡ **Real-time Status**: Watch the progress bar as the app searches Spotify for your tracks in real-time.
- 🎨 **Modern UI**: Built with Next.js 15, Tailwind CSS, and ShadCN UI for a sleek, dark-mode native experience.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Authentication**: NextAuth.js (Spotify Provider)
- **APIs**: YouTube Data API v3 & Spotify Web API

## Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd youtube-spotify-converter
npm install
```

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

You will need to fill in the following keys in your `.env.local`:

#### YouTube API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project and enable the **YouTube Data API v3**
3. Generate an API Key and paste it as `YOUTUBE_API_KEY`

#### Spotify API Credentials
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an App
3. Set the Redirect URI to: `http://localhost:3000/api/auth/callback/spotify`
4. Copy the Client ID and Client Secret into `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

#### NextAuth Secret
Generate a random secret string (e.g., `openssl rand -base64 32`) and paste it as `NEXTAUTH_SECRET`.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Important Note on Spotify API Limits
By default, Spotify apps are in "Development Mode" which strictly limits the app to **25 specific users** that you must manually whitelist in the Spotify Developer Dashboard. 
If you want anyone to be able to use the app, you must submit a request for "Extended Quota Mode" on your app's dashboard.

## License
MIT
