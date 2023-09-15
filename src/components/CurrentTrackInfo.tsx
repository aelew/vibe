import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { useSpotify } from '../hooks/useSpotify';
import type { PlaybackState, Track } from '@spotify/web-api-ts-sdk';
import { MusicIcon } from 'lucide-react';
import { match } from 'ts-pattern';
import Marquee from 'react-fast-marquee';

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

  const trackName = playbackState
    ? match(playbackState.currently_playing_type)
        .with('track', () => playbackState.item.name)
        .with('episode', () => 'Episode')
        .with('unknown', () => 'Unknown')
        .with('ad', () => 'Advertisement')
        .otherwise(() => '--')
    : '--';

  const artistName =
    playbackState?.currently_playing_type === 'track'
      ? (playbackState.item as Track | undefined)?.album.artists
          .map((artist) => artist.name)
          .join(', ') ?? '--'
      : '';

  return (
    <>
      <div className="shrink-0">
        {playbackState?.currently_playing_type === 'track' &&
        (playbackState.item as Track).album.images.length ? (
          <img
            src={(playbackState.item as Track).album.images[0].url}
            data-tauri-drag-region
            className="rounded-md"
            draggable={false}
            height={36}
            width={36}
          />
        ) : (
          <div
            className="w-9 h-9 rounded-md bg-[#282828] flex items-center justify-center"
            data-tauri-drag-region
          >
            <MusicIcon className="h-4 w-4" data-tauri-drag-region />
          </div>
        )}
      </div>
      <div className="flex flex-col w-[80%]">
        <div className="font-semibold text-sm leading-4 pb-1 -mb-1">
          {trackName.length > 25 ? (
            <Marquee speed={25}>
              <h1 className="mr-3" data-tauri-drag-region>
                {trackName}
              </h1>
            </Marquee>
          ) : (
            <h1 data-tauri-drag-region>{trackName}</h1>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {artistName.length > 25 ? (
            <Marquee speed={25}>
              <p className="mr-3" data-tauri-drag-region>
                {artistName}
              </p>
            </Marquee>
          ) : (
            <p data-tauri-drag-region>{artistName}</p>
          )}
        </div>
      </div>
    </>
  );
}
