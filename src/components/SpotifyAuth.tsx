import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { useState, type PropsWithChildren } from 'react';

import { useEffectOnce } from '../hooks/useEffectOnce';
import { authorize, fetchTokens } from '../lib/spotify';
import { store } from '../lib/store';
import { SpotifyIcon } from './SpotifyIcon';

export function SpotifyAuth({ children }: PropsWithChildren) {
  const [locked, setLocked] = useState(true);

  const startOauthProcess = () => {
    invoke('start_server');
    authorize();
  };

  // Special hook for preventing the auth window from opening twice in dev
  useEffectOnce(() => {
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
  });

  if (locked) {
    return (
      <button
        className="mx-auto flex items-center gap-2 transition-colors hover:text-[#1DB954]"
        onClick={startOauthProcess}
        data-tauri-drag-region
      >
        <SpotifyIcon />
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
