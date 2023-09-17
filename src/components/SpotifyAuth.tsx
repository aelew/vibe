import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { useEffect, useState, type PropsWithChildren } from 'react';

import { authorize, fetchTokens } from '../lib/spotify';
import { store } from '../lib/store';
import { SpotifyIcon } from './SpotifyIcon';

export function SpotifyAuth({ children }: PropsWithChildren) {
  const [locked, setLocked] = useState(true);

  const startOauthProcess = () => {
    invoke('start_server');
    authorize();
  };

  useEffect(() => {
    store.get('spotify').then((value) => {
      if (value) {
        setLocked(false);
      } else {
        startOauthProcess();
      }
    });

    store.onKeyChange('spotify', (value) => {
      setLocked(!value);
    });

    const unlisten = listen('spotify-auth-cb', ({ payload: code }) => {
      console.log('🔑 Received Spotify authorization code: ' + code);
      fetchTokens(code as string);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  if (locked) {
    return (
      <button
        className="mx-auto flex items-center gap-2 transition-colors hover:text-[#1DB954]"
        onClick={startOauthProcess}
        data-tauri-drag-region
      >
        <SpotifyIcon className="h-4 w-4" />
        <span
          className="text-xs font-bold uppercase tracking-wide"
          data-tauri-drag-region
        >
          Connect to Spotify
        </span>
      </button>
    );
  }

  return children;
}
