import { CurrentTrackInfo } from './components/CurrentTrackInfo';
import { SpotifyAuth } from './components/SpotifyAuth';

function App() {
  return (
    <div className="dark group relative flex min-h-screen select-none justify-center rounded-lg bg-black/60">
      <main
        className="flex w-full items-center gap-2 p-2"
        data-tauri-drag-region
      >
        <SpotifyAuth>
          <CurrentTrackInfo />
        </SpotifyAuth>
      </main>
    </div>
  );
}

export default App;
