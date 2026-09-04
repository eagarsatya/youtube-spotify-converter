import http from 'http';
import url from 'url';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Read .env.local to get client ID and secret
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Could not read .env.local. Make sure you are running this from the project root.');
}

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const CLIENT_ID = env.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not found in .env.local');
  console.error('Please add them before running this script.');
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');
const scope = 'playlist-modify-public playlist-modify-private user-read-private';

const authorizeUrl = new URL('https://accounts.spotify.com/authorize');
authorizeUrl.searchParams.append('response_type', 'code');
authorizeUrl.searchParams.append('client_id', CLIENT_ID);
authorizeUrl.searchParams.append('scope', scope);
authorizeUrl.searchParams.append('redirect_uri', REDIRECT_URI);
authorizeUrl.searchParams.append('state', state);

console.log('\n======================================================');
console.log('Spotify Bot Account Authorization');
console.log('======================================================\n');
console.log('1. Make sure you have added your "Bot Account" to your Spotify Developer Dashboard under "Users and Access".');
console.log('2. Make sure you added http://localhost:8888/callback to the Redirect URIs in your Spotify App settings.\n');
console.log('3. Open this URL in your browser to authorize:\n');
console.log('\x1b[36m%s\x1b[0m', authorizeUrl.toString()); // Cyan color
console.log('\nWaiting for callback on port', PORT, '...');

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/callback') {
    const code = reqUrl.query.code;
    const error = reqUrl.query.error;

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`Authorization failed: ${error}`);
      console.error('\n❌ Authorization failed:', error);
      process.exit(1);
    }

    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Success!</h1><p>You can close this window and check your terminal for the refresh token.</p>');

      try {
        console.log('\n✅ Got authorization code, exchanging for tokens...');
        
        const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
          },
          body: new URLSearchParams({
            code: code.toString(),
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
          }),
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        console.log('\n🎉 SUCCESS! Here is your Refresh Token:\n');
        console.log('\x1b[32m%s\x1b[0m', tokenData.refresh_token); // Green color
        console.log('\n👉 Add this to your .env.local file like this:\n');
        console.log(`SPOTIFY_BOT_REFRESH_TOKEN=${tokenData.refresh_token}\n`);
        
      } catch (err) {
        console.error('\n❌ Failed to get tokens:', err.message);
      } finally {
        server.close();
        process.exit(0);
      }
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT);
