import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { useSpotify } from '../hooks/useSpotify';
import type { PlaybackState, Track } from '@spotify/web-api-ts-sdk';

const POLLING_INTERVAL = 1000;

export function CurrentTrackInfo() {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null
  );
  const spotify = useSpotify();

  useInterval(() => {
    if (spotify) {
      spotify.player.getCurrentlyPlayingTrack().then(setPlaybackState);
    }
  }, POLLING_INTERVAL);

  return (
    <>
      <div className="shrink-0">
        <img
          src={
            (playbackState?.item as Track | undefined)?.album.images[0].url ??
            'https://i.scdn.co/image/ab67616d0000b2731775c272fc6322fa8a92c721?width=0&height=0'
          }
          className="rounded-md hover:opacity-75 transition-opacity"
          data-tauri-drag-region
          draggable={false}
          height={36}
          width={36}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <h1 className="font-semibold text-sm leading-4 truncate pb-1 -mb-1">
          {playbackState?.item.name ?? '--'}
        </h1>
        <p className="text-xs text-slate-400 truncate">
          {(playbackState?.item as Track | undefined)?.album.artists
            .map((a) => a.name)
            .join(', ') ?? '--'}
        </p>
      </div>
    </>
  );
}
