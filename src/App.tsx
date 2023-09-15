import { CurrentTrackInfo } from './components/CurrentTrackInfo';
import { SpotifyAuth } from './components/SpotifyAuth';

function App() {
  return (
    <div className="rounded-lg group relative dark select-none bg-black/60 min-h-screen flex justify-center">
      <main
        className="gap-2 p-2 flex items-center w-full"
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
