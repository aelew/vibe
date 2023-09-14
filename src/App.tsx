import { CogIcon } from 'lucide-react';
import { CurrentTrackInfo } from './components/CurrentTrackInfo';
import { SpotifyAuth } from './components/SpotifyAuth';

function App() {
  return (
    <div className="rounded-lg group relative dark select-none bg-black/60">
      <main className="gap-2 p-2 flex items-center">
        <SpotifyAuth>
          <CurrentTrackInfo />
        </SpotifyAuth>
        <div className="ml-auto pr-2">
          <button>
            <CogIcon className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
