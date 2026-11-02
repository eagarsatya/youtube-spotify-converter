export interface ChangeEntry {
  type: 'feat' | 'improvement' | 'fix' | 'refactor';
  text: string;
}

export interface ReleaseVersion {
  version: string;
  releaseDate: string;
  title: string;
  description: string;
  isLatest?: boolean;
  changes: ChangeEntry[];
}

export const CURRENT_VERSION = '1.1.1';

export const CHANGELOG_DATA: ReleaseVersion[] = [
  {
    version: '1.1.1',
    releaseDate: 'November 2, 2026',
    title: 'Serverless YouTube Search Hotfix',
    description: 'Fixed serverless runtime module resolution for cheerio and externalized yt-search for Vercel production deployments.',
    isLatest: true,
    changes: [
      {
        type: 'fix',
        text: 'Resolved production crash ("Cannot find module cheerio") on /api/youtube/search by externalizing yt-search and cheerio in Next.js Turbopack configuration.',
      },
      {
        type: 'fix',
        text: 'Added direct dependency on cheerio to guarantee deployment inclusion on Vercel and AWS Lambda.',
      },
      {
        type: 'improvement',
        text: 'Made YouTube search module loading lazy/dynamic with graceful fallback to YouTube Data API v3.',
      },
    ],
  },
  {
    version: '1.1.0',
    releaseDate: 'November 2, 2026',
    title: 'Song List to YouTube Playlist Mode & Versioning',
    description: 'Added support for converting plain text song lists directly into YouTube playlists with multi-candidate match selection and integrated release tracking.',
    changes: [
      {
        type: 'feat',
        text: 'Song List to YouTube: Convert raw text track lists (from notes, Spotify, festivals) into YouTube playlists.',
      },
      {
        type: 'feat',
        text: 'Interactive Candidate Selector: Preview top 3 YouTube matches with channels, durations, and thumbnails before saving.',
      },
      {
        type: 'feat',
        text: 'YouTube Playlist Export: Create Public, Unlisted, or Private playlists directly in your Google account.',
      },
      {
        type: 'feat',
        text: 'Interactive Versioning & Changelog modal directly accessible from the header and footer.',
      },
      {
        type: 'improvement',
        text: 'Dual-mode switcher with seamless tab transitions and preserved draft state.',
      },
      {
        type: 'improvement',
        text: 'Enhanced responsive layouts and improved theme contrast for light and dark modes.',
      },
    ],
  },
  {
    version: '1.0.1',
    releaseDate: 'June 8, 2026',
    title: 'Tutorial Guide & Support Links',
    description: 'Added educational tutorial section and developer support links.',
    changes: [
      {
        type: 'feat',
        text: 'Step-by-step interactive Tutorial Section for new users.',
      },
      {
        type: 'feat',
        text: 'Saweria creator donation button and official GitHub repository link in header.',
      },
      {
        type: 'fix',
        text: 'Resolved TypeScript compilation and build errors in external API response types.',
      },
      {
        type: 'refactor',
        text: 'Refactored playlist saving mechanism and client-side OAuth handling.',
      },
    ],
  },
  {
    version: '1.0.0',
    releaseDate: 'June 4, 2026',
    title: 'Initial Release: YouTube to Spotify Converter',
    description: 'First public release of the Playlist Converter featuring YouTube to Spotify playlist migration.',
    changes: [
      {
        type: 'feat',
        text: 'YouTube URL parsing supporting both individual videos and full playlists.',
      },
      {
        type: 'feat',
        text: 'Smart Title Cleaner stripping music video noise, tags, and formatting artifacts.',
      },
      {
        type: 'feat',
        text: 'Batch Spotify search with match confidence indicators (Exact, Partial, Not Found).',
      },
      {
        type: 'feat',
        text: 'Direct Spotify playlist creator dialog with customizable name and privacy settings.',
      },
      {
        type: 'feat',
        text: 'Dark and Light mode support with automatic system preference detection.',
      },
    ],
  },
];
