import { useState, useEffect, useRef, useCallback } from 'react';
import { Song } from '../types';

export const useAudioPlayer = () => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const nextTrackRef = useRef<() => void>(() => {});

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
      // Stop if at the end of the playlist
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [playlist.length, currentSongIndex]);

  // Update ref when nextTrack changes so we don't need to re-run the setup effect
  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  // Initialize Audio Element and Context - Run ONCE on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume; // Initialize with current volume
    audioRef.current.crossOrigin = "anonymous";
    
    const handleEnded = () => {
      // Call the latest nextTrack function
      if (nextTrackRef.current) {
        nextTrackRef.current();
      }
    };
    
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
      }
      // Only close if it exists and is not already closed
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []); // Empty dependency array ensures this runs once

  // Sync volume when state changes
  useEffect(() => {
    if(audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  // Initialize Web Audio API on first user interaction
  const initAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const src = ctx.createMediaElementSource(audioRef.current);
      const ana = ctx.createAnalyser();
      ana.fftSize = 64; // Low for retro blocky look
      
      src.connect(ana);
      ana.connect(ctx.destination);
      
      sourceRef.current = src;
      setAnalyser(ana);
    } else if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newSongs: Song[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
      url: URL.createObjectURL(file),
      file
    }));

    setPlaylist(prev => {
      const updated = [...prev, ...newSongs];
      if (prev.length === 0 && newSongs.length > 0) {
        setCurrentSongIndex(0);
      }
      return updated;
    });
    
    initAudioContext();
  };

  useEffect(() => {
    if (currentSongIndex >= 0 && currentSongIndex < playlist.length && audioRef.current) {
      const song = playlist[currentSongIndex];
      if (audioRef.current.src !== song.url) {
        const wasPlaying = isPlaying;
        audioRef.current.src = song.url;
        if (wasPlaying) {
          audioRef.current.play().catch(e => console.error("Playback failed", e));
        }
      }
    }
  }, [currentSongIndex, playlist]);

  // Watch isPlaying state to actually play/pause the audio element
  useEffect(() => {
      if(!audioRef.current) return;
      if(isPlaying) {
          // Ensure context is running
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
             audioContextRef.current.resume();
          }
          audioRef.current.play().catch(e => console.error("Playback error", e));
      } else {
          audioRef.current.pause();
      }
  }, [isPlaying]);

  const togglePlay = () => {
    initAudioContext();
    if (playlist.length === 0) return;
    setIsPlaying(!isPlaying);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    setCurrentSongIndex(prev => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const playTrack = (index: number) => {
    initAudioContext();
    if (index >= 0 && index < playlist.length) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const adjustVolume = (delta: number) => {
    setVolume(prev => {
      const newVol = Math.max(0, Math.min(1, prev + delta));
      return newVol;
    });
  };

  return {
    playlist,
    currentSong: playlist[currentSongIndex] || null,
    currentSongIndex,
    isPlaying,
    volume,
    analyser,
    addFiles,
    togglePlay,
    nextTrack,
    prevTrack,
    adjustVolume,
    playTrack
  };
};