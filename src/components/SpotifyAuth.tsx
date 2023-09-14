import { useEffect, type PropsWithChildren, useState } from 'react';
import { authorize, fetchTokens } from '../lib/spotify';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { store } from '../lib/store';

export function SpotifyAuth({ children }: PropsWithChildren) {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    store.get('spotify_token').then((value) => {
      if (!value) {
        invoke('start_server');
        authorize();
      } else {
        setLocked(false);
      }
    });
    store.onKeyChange('spotify_token', (value) => {
      if (value) {
        setLocked(false);
      }
    });
  }, []);

  useEffect(() => {
    const unlisten = listen('spotify-auth-cb', ({ payload: code }) => {
      console.log('🔑 Received Spotify authorization code: ' + code);
      fetchTokens(code as string);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  if (typeof localStorage === 'undefined') {
    return 'Loading';
  }

  if (locked) {
    return 'Authentication required';
  }

  return children;
}
