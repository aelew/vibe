import { type PropsWithChildren, useState } from 'react';
import { authorize, fetchTokens } from '../lib/spotify';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { store } from '../lib/store';
import { SpotifyIcon } from './SpotifyIcon';
import { useEffectOnce } from '../hooks/useEffectOnce';

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
        className="mx-auto flex items-center gap-2 hover:text-[#1DB954] transition-colors"
        onClick={startOauthProcess}
        data-tauri-drag-region
      >
        <SpotifyIcon />
        <span
          className="text-xs uppercase tracking-wide font-bold"
          data-tauri-drag-region
        >
          Connect to Spotify
        </span>
      </button>
    );
  }

  return children;
}
