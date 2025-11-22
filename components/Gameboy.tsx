import React, { useState, useRef } from "react";
import { Screen } from "./Screen";
import { ScreenMode, Song } from "../types";

interface GameboyProps {
  playlist: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  analyser: AnalyserNode | null;
  addFiles: (files: FileList | null) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  adjustVolume: (delta: number) => void;
}

export const Gameboy: React.FC<GameboyProps> = ({
  currentSong,
  isPlaying,
  volume,
  analyser,
  addFiles,
  togglePlay,
  nextTrack,
  prevTrack,
  adjustVolume,
}) => {
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode.INFO);
  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVolumeChange = (delta: number) => {
    adjustVolume(delta);
    setShowVolume(true);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = window.setTimeout(
      () => setShowVolume(false),
      1500
    );
  };

  const handleSelect = () => {
    fileInputRef.current?.click();
  };

  const handleStart = () => {
    togglePlay();
  };

  const ButtonBaseClass =
    "cursor-pointer select-none touch-manipulation transition-all duration-150";

  return (
    <div className="relative w-[380px] h-[640px] rounded-[20px] rounded-br-[60px] flex flex-col items-center p-6 overflow-hidden shadow-[25px_35px_60px_rgba(0,0,0,0.8)] z-10">
      {/* Main Chassis Styling - Dark Matte Black */}
      <div className="absolute inset-0 bg-[#252525] z-0">
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QYREiQ5r8uKqAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAGUlEQVQI12NgYGBgYGRkZGBiYmJgYmJiYgAAA+AAobw23eUAAAAASUVORK5CYII=')]"></div>
        {/* Gradient for curved surface */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] via-[#252525] to-[#1a1a1a]"></div>
      </div>

      {/* Chassis Edge Highlights */}
      <div className="absolute inset-0 border-t border-l border-white/10 rounded-[20px] rounded-br-[60px] pointer-events-none z-10"></div>
      <div className="absolute inset-0 border-r-4 border-b-8 border-black/40 rounded-[20px] rounded-br-[60px] pointer-events-none z-10 filter blur-[1px]"></div>

      {/* --- Screen Bezel Section --- */}
      <div className="w-full bg-[#111] rounded-t-[10px] rounded-b-[40px] px-8 pt-10 pb-8 shadow-[inset_0_5px_15px_rgba(0,0,0,0.5),0_5px_10px_rgba(0,0,0,0.3)] relative mb-6 z-20 group flex flex-col items-center">
        {/* Bezel Glass Shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-t-[10px] rounded-b-[40px]"></div>

        {/* Top Decorative Lines */}
        <div className="absolute top-4 left-8 right-8 h-[2px] flex justify-between items-center px-2 opacity-50">
          <div className="h-full w-[32%] bg-[#777]"></div>
          <div className="h-full w-[32%] bg-[#777]"></div>
        </div>

        {/* Dot Matrix Text */}
        <div className="absolute top-5 w-full text-center left-0">
          <span className="text-[9px] text-[#aaa] font-sans font-bold tracking-[0.2em] drop-shadow-sm">
            GAMEBOY-STYLE MUSIC PLAYER
          </span>
        </div>

        {/* Battery LED (Left Side) - No Text */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isPlaying
                ? "bg-[#ff3333] shadow-[0_0_8px_#ff0000] opacity-100"
                : "bg-[#330000] opacity-50"
            } border border-black transition-all duration-300`}
          ></div>
        </div>

        {/* Inner Screen Container - Centered */}
        <div className="bg-[#050505] p-1.5 rounded-sm shadow-[inset_0_0_5px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] mx-auto">
          <Screen
            mode={screenMode}
            currentSong={currentSong}
            isPlaying={isPlaying}
            analyser={analyser}
            volume={volume}
            showVolume={showVolume}
          />
        </div>
      </div>

      {/* --- Controls Section --- */}
      <div className="w-full flex-1 relative z-20">
        {/* D-PAD Container - Redesigned */}
        <div className="absolute top-0 left-4 w-32 h-32">
          {/* D-PAD Visual Structure */}
          <div className="absolute inset-0 pointer-events-none drop-shadow-[4px_5px_6px_rgba(0,0,0,0.7)]">
            {/* Horizontal Arm */}
            <div className="absolute top-1/3 h-1/3 left-0 w-full bg-[#181818] rounded-[2px] bg-gradient-to-b from-[#252525] to-[#111]"></div>
            {/* Vertical Arm */}
            <div className="absolute left-1/3 w-1/3 top-0 h-full bg-[#181818] rounded-[2px] bg-gradient-to-r from-[#252525] to-[#111]"></div>

            {/* Central Depression */}
            <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle_at_center,_#111_0%,_#222_100%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>

            {/* Grip Textures (Lines) */}
            {/* Top */}
            <div className="absolute top-[5%] left-1/3 w-1/3 h-[15%] flex flex-col justify-center items-center gap-[3px] opacity-30">
              <div className="w-[60%] h-[1px] bg-white/20"></div>
              <div className="w-[60%] h-[1px] bg-white/20"></div>
              <div className="w-[60%] h-[1px] bg-white/20"></div>
            </div>
            {/* Bottom */}
            <div className="absolute bottom-[5%] left-1/3 w-1/3 h-[15%] flex flex-col justify-center items-center gap-[3px] opacity-30">
              <div className="w-[60%] h-[1px] bg-white/20"></div>
              <div className="w-[60%] h-[1px] bg-white/20"></div>
              <div className="w-[60%] h-[1px] bg-white/20"></div>
            </div>
            {/* Left */}
            <div className="absolute left-[5%] top-1/3 h-1/3 w-[15%] flex justify-center items-center gap-[3px] opacity-30">
              <div className="h-[60%] w-[1px] bg-white/20"></div>
              <div className="h-[60%] w-[1px] bg-white/20"></div>
              <div className="h-[60%] w-[1px] bg-white/20"></div>
            </div>
            {/* Right */}
            <div className="absolute right-[5%] top-1/3 h-1/3 w-[15%] flex justify-center items-center gap-[3px] opacity-30">
              <div className="h-[60%] w-[1px] bg-white/20"></div>
              <div className="h-[60%] w-[1px] bg-white/20"></div>
              <div className="h-[60%] w-[1px] bg-white/20"></div>
            </div>
          </div>

          {/* Arrow Guides (Triangles) on chassis */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#555] text-[8px] opacity-50">
            ▲
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[#555] text-[8px] opacity-50">
            ▼
          </div>
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-[#555] text-[8px] opacity-50">
            ◀
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-[#555] text-[8px] opacity-50">
            ▶
          </div>

          {/* Interaction Zones (Invisible Buttons) */}
          <button
            className="absolute top-0 left-[33%] w-[34%] h-[33%] z-30 active:bg-white/5 rounded-t-sm outline-none"
            onClick={() => handleVolumeChange(0.1)}
            title="Volume Up"
          />
          <button
            className="absolute bottom-0 left-[33%] w-[34%] h-[33%] z-30 active:bg-white/5 rounded-b-sm outline-none"
            onClick={() => handleVolumeChange(-0.1)}
            title="Volume Down"
          />
          <button
            className="absolute left-0 top-[33%] w-[33%] h-[34%] z-30 active:bg-white/5 rounded-l-sm outline-none"
            onClick={prevTrack}
            title="Prev Track"
          />
          <button
            className="absolute right-0 top-[33%] w-[33%] h-[34%] z-30 active:bg-white/5 rounded-r-sm outline-none"
            onClick={nextTrack}
            title="Next Track"
          />
        </div>

        {/* A / B Buttons - Glossy Dark Cherry/Black */}
        <div className="absolute top-2 right-2 w-30 h-28 flex items-end gap-5 -rotate-[10deg]">
          <div className="flex flex-col items-center gap-2 group">
            <button
              className={`w-12 h-12 rounded-full bg-[#4a0e1e] bg-gradient-to-br from-[#6d152d] to-[#2b060f] shadow-[3px_5px_5px_rgba(0,0,0,0.6),inset_1px_1px_4px_rgba(255,255,255,0.2)] active:shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] active:translate-y-[2px] ${ButtonBaseClass}`}
              onClick={() => setScreenMode(ScreenMode.TAPE)}
            ></button>
            <span className="text-[#aaa] font-bold text-sm font-sans tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
              A
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 -mt-10 group">
            <button
              className={`w-12 h-12 rounded-full bg-[#4a0e1e] bg-gradient-to-br from-[#6d152d] to-[#2b060f] shadow-[3px_5px_5px_rgba(0,0,0,0.6),inset_1px_1px_4px_rgba(255,255,255,0.2)] active:shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] active:translate-y-[2px] ${ButtonBaseClass}`}
              onClick={() => setScreenMode(ScreenMode.INFO)}
            ></button>
            <span className="text-[#aaa] font-bold text-sm font-sans tracking-wider drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
              I
            </span>
          </div>
        </div>

        {/* Select / Start Buttons - Dark Rubber */}
        <div className="absolute bottom-5 left-1/4 -translate-x-1/4 flex gap-4">
          <div className="flex flex-col items-center gap-1 rotate-[-20deg]">
            <button
              className={`w-14 h-3.5 bg-[#444] rounded-full border border-[#333] shadow-[0_2px_3px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] active:bg-[#222] active:shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] active:translate-y-[1px] ${ButtonBaseClass}`}
              onClick={handleSelect}
            ></button>
            <span className="text-[#aaa] font-bold text-[10px] tracking-widest uppercase mt-2 font-sans drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
              Select
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rotate-[-20deg]">
            <button
              className={`w-14 h-3.5 bg-[#444] rounded-full border border-[#333] shadow-[0_2px_3px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] active:bg-[#222] active:shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] active:translate-y-[1px] ${ButtonBaseClass}`}
              onClick={handleStart}
            ></button>
            <span className="text-[#aaa] font-bold text-[10px] tracking-widest uppercase mt-2 font-sans drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
              {isPlaying ? "Pause" : "Start"}
            </span>
          </div>
        </div>

        {/* Speaker Grille - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex gap-3 -rotate-[20deg] opacity-60">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-16 bg-[#151515] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_0_rgba(255,255,255,0.05)]"
            ></div>
          ))}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="audio/*"
        multiple
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
};
