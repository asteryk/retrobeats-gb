import React from "react";
import { Song } from "../types";

interface PlaylistProps {
  playlist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  onPlayTrack: (index: number) => void;
}

export const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  currentSongIndex,
  isPlaying,
  onPlayTrack,
}) => {
  return (
    <div className="hidden md:block w-[300px] h-[600px] bg-[#1a1a1a] ml-10 rounded-xl border border-[#333] shadow-2xl p-6 overflow-hidden flex flex-col">
      <h2 className="text-[#8bac0f] font-retro text-sm mb-4 pb-2 border-b border-[#333] flex justify-between items-center">
        <span>PLAYLIST</span>
        <span className="text-xs text-[#777]">{playlist.length} SONGS</span>
      </h2>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {playlist.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#666] text-xs text-center gap-2">
            <div className="w-8 h-8 border-2 border-[#333] rounded-full flex items-center justify-center">
              <span className="text-lg">?</span>
            </div>
            <p>NO CARTRIDGE LOADED</p>
            <p className="text-[10px] opacity-50">Use SELECT on Player</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {playlist.map((song, index) => {
              const isActive = index === currentSongIndex;
              return (
                <li
                  key={song.id}
                  onClick={() => onPlayTrack(index)}
                  className={`
                    group flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all border
                    ${
                      isActive
                        ? "bg-[#0f380f] border-[#306230] text-[#9bbc0f]"
                        : "bg-[#222] border-transparent text-[#e0e0e0] hover:bg-[#2a2a2a] hover:text-white"
                    }
                  `}
                >
                  <div className="text-[10px] font-mono opacity-50 w-4 text-right">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[8px] mt-1 text-[#8bac0f] font-sans ${
                        isActive ? "font-bold" : ""
                      }`}
                    >
                      {song.name}
                    </div>
                    {isActive && isPlaying && (
                      <div className="text-[8px] mt-1 text-[#8bac0f] animate-pulse">
                        PLAYING...
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-[#9bbc0f] rounded-full shadow-[0_0_5px_#9bbc0f]"></div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#333] text-[10px] text-[#666] text-center font-sans uppercase tracking-wider">
        Macro Wave Audio System
      </div>
    </div>
  );
};
