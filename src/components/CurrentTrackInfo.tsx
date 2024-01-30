import type { Episode, PlaybackState, Track } from '@spotify/web-api-ts-sdk';
import { MusicIcon } from 'lucide-react';
import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import { match } from 'ts-pattern';

import { useInterval } from '../hooks/useInterval';
import { useSpotify } from '../hooks/useSpotify';

const POLLING_INTERVAL = 1000;

export function CurrentTrackInfo() {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null
  );
  const spotify = useSpotify();

  useInterval(() => {
    if (spotify) {
      spotify.player
        .getCurrentlyPlayingTrack(undefined, 'episode')
        .then(setPlaybackState);
    }
  }, POLLING_INTERVAL);

  const trackName = playbackState
    ? match(playbackState.currently_playing_type)
        .with('track', () => playbackState.item.name)
        .with('episode', () => playbackState.item.name)
        .with('unknown', () => 'Unknown')
        .with('ad', () => 'Advertisement')
        .otherwise(() => '--')
    : '--';

  const artistName = playbackState
    ? match(playbackState.currently_playing_type)
        .with(
          'track',
          () =>
            (playbackState.item as Track).album.artists
              .map((artist) => artist.name)
              .join(', ') ?? '--'
        )
        .with('episode', () => (playbackState.item as Episode).show.name)
        .otherwise(() => '')
    : '';

  return (
    <>
      <div className="shrink-0">
        {playbackState &&
          match(playbackState.currently_playing_type)
            .with('track', () => (
              <a
                href={playbackState.item.external_urls.spotify}
                target="_blank"
              >
                <img
                  src={(playbackState.item as Track).album.images[0].url}
                  draggable={false}
                  height={36}
                  width={36}
                />
              </a>
            ))
            .with('episode', () => (
              <a
                href={playbackState.item.external_urls.spotify}
                target="_blank"
              >
                <img
                  src={(playbackState.item as Episode).images[0].url}
                  draggable={false}
                  height={36}
                  width={36}
                />
              </a>
            ))
            .otherwise(() => (
              <div
                className="flex h-9 w-9 items-center justify-center bg-[#282828]"
                data-tauri-drag-region
              >
                <MusicIcon className="h-4 w-4" data-tauri-drag-region />
              </div>
            ))}
      </div>
      <div className="flex w-[80%] flex-col">
        <div className="-mb-1 pb-1 text-sm font-semibold leading-4">
          {trackName.length > 22 ? (
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
