import React, { useEffect, useRef } from 'react';
import { ScreenMode, Song } from '../types';
import { Cassette } from './Cassette';

interface ScreenProps {
  mode: ScreenMode;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  analyser: AnalyserNode | null;
  showVolume: boolean; // Temporary volume overlay trigger
}

export const Screen: React.FC<ScreenProps> = ({ 
  mode, 
  currentSong, 
  isPlaying, 
  analyser, 
  volume,
  showVolume 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Visualizer Loop
  useEffect(() => {
    if (!canvasRef.current || !analyser || mode !== ScreenMode.TAPE) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const renderFrame = () => {
      animationId = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 16); // Draw 16 bars
      let x = 0;

      ctx.fillStyle = '#0f380f'; // Darkest GB color

      // We iterate a subset of the frequency to fit 16 bars
      for (let i = 0; i < 16; i++) {
        const dataIndex = Math.floor(i * (bufferLength / 24)); // Focus on lower freqs
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height;

        // Draw retro blocky bars
        const blockHeight = 4;
        const numBlocks = Math.floor(barHeight / blockHeight);

        for(let b = 0; b < numBlocks; b++) {
            ctx.fillRect(x + 1, canvas.height - (b * (blockHeight + 1)), barWidth - 2, blockHeight);
        }

        x += barWidth;
      }
    };

    renderFrame();

    return () => cancelAnimationFrame(animationId);
  }, [analyser, mode]);


  return (
    <div className="relative w-64 h-56 bg-[#8bac0f] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] p-4 flex flex-col items-center justify-between font-retro overflow-hidden rounded-sm">
      {/* Pixel Grid Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10 z-10"></div>

      {/* Volume Overlay */}
      {showVolume && (
         <div className="absolute top-2 right-2 z-20 bg-[#0f380f] text-[#9bbc0f] px-2 py-1 text-xs border border-[#306230]">
            VOL {Math.round(volume * 10)}
         </div>
      )}

      {/* Mode A: Text Info */}
      {mode === ScreenMode.INFO && (
        <div className="flex flex-col items-center justify-center h-full w-full text-[#0f380f] z-0 text-center gap-4">
          <div className="text-xs font-bold animate-pulse">
            {isPlaying ? 'NOW PLAYING:' : currentSong ? 'PAUSED' : 'INSERT CARTRIDGE'}
          </div>
          <div className="text-sm break-words w-full px-2 leading-snug">
            {currentSong ? currentSong.name.toUpperCase() : 'NO SELECT MUSIC'}
          </div>
          {!currentSong && <div className="text-[10px] mt-4">(PRESS SELECT)</div>}
        </div>
      )}

      {/* Mode B: Tape & Visualizer */}
      {mode === ScreenMode.TAPE && (
        <div className="flex flex-col justify-end h-full w-full z-0 gap-2">
            <div className="flex-1 flex items-center">
                <Cassette isPlaying={isPlaying} />
            </div>
            <div className="h-12 w-full border-t-2 border-[#306230] pt-1">
                <canvas ref={canvasRef} width={240} height={48} className="w-full h-full"></canvas>
            </div>
        </div>
      )}

    </div>
  );
};