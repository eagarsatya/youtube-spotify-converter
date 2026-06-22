# YouTube to Spotify Converter 🎵

Seamlessly port your music from YouTube playlists and videos directly to Spotify! Paste a YouTube URL, review the matched tracks, and instantly generate a new Spotify playlist. 

**No Spotify user login required!** This app uses a single "Bot Account" to bypass Spotify's restrictive 25-user Development Mode limits. It creates public playlists that anyone can save to their own library.

## Features
- 🤖 **Bot Account Architecture**: Zero login required for end-users. Bypasses the 25-user development limit.
- 🎥 **Dual Support**: Works with both individual YouTube video links and full playlist links.
- 🧹 **Smart Title Cleaning**: Automatically strips out noise like `(Official Video)` or `[Lyrics]` to ensure accurate Spotify searches.
- ⚡ **Real-time Status**: Watch the progress bar as the app searches Spotify for your tracks in real-time.
- 🎨 **Modern UI**: Built with Next.js 15, Tailwind CSS, and ShadCN UI for a sleek, dark-mode native experience.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
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
3. Set the Redirect URI to: `http://localhost:8888/callback` (Required for the bot authorization script)
4. Copy the Client ID and Client Secret into `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

### 3. Authorize the Bot Account (One-Time Setup)
Since this app uses a central Bot Account to create playlists, you need to authorize it once.

1. Ensure your Spotify App is in Development Mode.
2. Go to **Users and Access** in the Spotify Dashboard and add the Spotify account you want to use as the bot (this can be your personal account or a dedicated one).
3. Run the auth script:
```bash
node scripts/get-refresh-token.mjs
```
4. Click the link provided in your terminal, log in with the Bot Account, and authorize the app.
5. Copy the generated **Refresh Token** from your terminal into your `.env.local` as `SPOTIFY_BOT_REFRESH_TOKEN`.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## License
MIT
