import { useEffect, useState } from 'react';
import { SpotifyApi, type AccessToken } from '@spotify/web-api-ts-sdk';
import { SPOTIFY_CLIENT_ID, refreshAccessToken } from '../lib/spotify';
import { store } from '../lib/store';

export function useSpotify() {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null);

  const handleSdkSetup = (token: AccessToken) => {
    setSdk(
      SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, token, {
        fetch: async (req, init) => {
          let response = await fetch(req, init);
          if (response.status === 401) {
            await refreshAccessToken();
            response = await fetch(req, init);
          }
          return response;
        }
      })
    );
  };

  useEffect(() => {
    store.get('spotify_token').then((value) => {
      if (value) {
        handleSdkSetup(value as AccessToken);
      }
    });
    store.onKeyChange('spotify_token', (value) => {
      if (value) {
        handleSdkSetup(value as AccessToken);
      }
    });
  }, []);

  return sdk;
}
