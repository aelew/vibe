import './App.css';

function App() {
  return (
    <div className="rounded-lg group relative dark select-none bg-black/10">
      <main className="gap-2 p-2 flex">
        <img
          src="https://i.scdn.co/image/ab67616d0000b2731775c272fc6322fa8a92c721?width=0&height=0"
          data-tauri-drag-region
          className="rounded-md"
          draggable={false}
          height={64}
          width={64}
        />
        <div>
          <h1 className="font-semibold leading-4">Song name</h1>
          <p className="text-sm text-slate-300">
            by <span className="text-white">Artist</span>
          </p>
          <hr />
        </div>
      </main>
      {/* <div className="group-hover:bg-black/25 transition-colors rounded absolute w-full h-full top-0 pointer-events-none" /> */}
    </div>
  );
}

export default App;
