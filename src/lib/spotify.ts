import { AccessToken } from '@spotify/web-api-ts-sdk';
import { open } from '@tauri-apps/api/shell';
import { store } from './store';

export const SPOTIFY_CLIENT_ID = '9ceca747830f42f5afdbc54f307615e6';
const SPOTIFY_REDIRECT_URI = 'http://localhost:52855/cb';

export async function authorize() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  let params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: 'user-read-currently-playing',
    response_type: 'code',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });

  localStorage.setItem('code_verifier', codeVerifier);
  await open('https://accounts.spotify.com/authorize?' + params);
}

export async function fetchTokens(authCode: string) {
  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) {
    throw new Error('Missing `code_verifier`');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier,
      code: authCode
    })
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve access token');
  }

  const data = await response.json();
  await store.set('spotify', data);
  await store.save();
}

export async function refreshAccessToken() {
  const token = (await store.get('spotify')) as AccessToken | null;
  if (!token) {
    throw new Error('Not authenticated with Spotify.');
  }
  const response = await fetch('https://accounts.spotify.com/api/token', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: SPOTIFY_CLIENT_ID
    })
  });
  if (!response.ok) {
    console.warn('Failed to refresh access token, clearing token store...');
    await store.delete('spotify');
    await store.save();
    return;
  }

  const data = await response.json();
  console.log('refresh', data);
  await store.set('spotify', data);
  await store.save();
  return data.access_token;
}

async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let text = '';
  for (let i = 0; i < length; i++) {
    text += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return text;
}
