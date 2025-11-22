import React from 'react';

interface CassetteProps {
  isPlaying: boolean;
}

export const Cassette: React.FC<CassetteProps> = ({ isPlaying }) => {
  return (
    <div className="w-full h-24 flex items-center justify-center relative">
      {/* Tape Body */}
      <div className="w-40 h-24 bg-[#0f380f] border-4 border-[#306230] rounded-md relative overflow-hidden flex flex-col items-center p-2">
        
        {/* Label Area */}
        <div className="w-full h-4 bg-[#9bbc0f] mb-1 rounded-sm opacity-80"></div>
        
        {/* Window */}
        <div className="w-full flex-1 bg-[#8bac0f] rounded-sm border-2 border-[#306230] flex items-center justify-center gap-4 relative">
            
            {/* Left Spool */}
            <div className={`w-8 h-8 rounded-full border-4 border-[#0f380f] flex items-center justify-center ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                <div className="w-full h-1 bg-[#0f380f] absolute"></div>
                <div className="h-full w-1 bg-[#0f380f] absolute"></div>
                <div className="w-2 h-2 bg-[#0f380f] rounded-full z-10"></div>
            </div>

            {/* Tape connecting spools (fake) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-[#306230] opacity-50"></div>

            {/* Right Spool */}
            <div className={`w-8 h-8 rounded-full border-4 border-[#0f380f] flex items-center justify-center ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                <div className="w-full h-1 bg-[#0f380f] absolute"></div>
                <div className="h-full w-1 bg-[#0f380f] absolute"></div>
                <div className="w-2 h-2 bg-[#0f380f] rounded-full z-10"></div>
            </div>

        </div>
        
        {/* Bottom holes */}
        <div className="w-full h-3 mt-1 flex justify-between px-2">
            <div className="w-2 h-2 bg-[#306230] rounded-full"></div>
            <div className="w-2 h-2 bg-[#306230] rounded-full"></div>
            <div className="w-2 h-2 bg-[#306230] rounded-full"></div>
            <div className="w-2 h-2 bg-[#306230] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};