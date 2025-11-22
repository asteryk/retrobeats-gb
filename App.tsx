import React from "react";
import { Gameboy } from "./components/Gameboy";
import { Playlist } from "./components/Playlist";
import { useAudioPlayer } from "./hooks/useAudioPlayer";

function App() {
  const audioPlayer = useAudioPlayer();

  return (
    <div className="min-h-screen w-full bg-[#111111] flex flex-col md:flex-row items-center justify-center p-6 overflow-hidden relative">
      {/* Dark background texture */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#222_0%,_#050505_100%)]"></div>

      {/* Gameboy Unit */}
      <div className="relative z-10 scale-90 md:scale-100 transition-transform">
        <Gameboy {...audioPlayer} />
      </div>

      {/* Desktop Playlist - Passed audio control props */}
      <Playlist
        playlist={audioPlayer.playlist}
        currentSongIndex={audioPlayer.currentSongIndex}
        isPlaying={audioPlayer.isPlaying}
        onPlayTrack={audioPlayer.playTrack}
      />

      {/* Footer Instructions */}
      <div className="fixed bottom-4 left-0 right-0 text-[#aaa] text-[10px] font-sans text-center opacity-30 pointer-events-none z-0">
        <p className="hidden md:block">
          DESKTOP MODE ACTIVE • USE D-PAD TO GO TO PREVIOUS/NEXT TRACK AND TURN
          UP/DOWN THE VOLUME • SELECT TO LOAD MUSIC
        </p>
        <p className="md:hidden">
          USE D-PAD TO PREV/NEXT and VOL UP/DOWN • SELECT TO LOAD MUSIC
        </p>
      </div>
    </div>
  );
}

export default App;
