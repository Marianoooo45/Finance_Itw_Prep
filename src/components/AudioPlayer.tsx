'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Zap, Coffee } from 'lucide-react';

// 🎵 LISTE DES PISTES
const PLAYLISTS = {
    troll: [
        { title: "ARRÊTEZ", artist: "Mastu & Théodort", src: "/music/Mastu & Théodort - ARRÊTEZ ( remix ).mp3" },
        { title: "TOP 1", artist: "Squeezie", src: "/music/SQUEEZIE - TOP 1.mp3" },
        { title: "Dans ma folie", artist: "Pidi", src: "/music/PIDI - Dans ma folie (Clip Officiel).mp3" },
        { title: "ATM", artist: "Kameto ft. Naskid", src: "/music/ATM - Kameto (ft. Naskid).mp3" },
        { title: "GUERRIER", artist: "Doigby", src: "/music/Doigby - GUERRIER (clip officiel).mp3" },
        { title: "MILI MILI", artist: "Inoxtag", src: "/music/INOXTAG - MILI MILI (clip officiel).mp3" },
        { title: "Dans La Zone", artist: "Inoxtag", src: "/music/Inoxtag - Dans La Zone (Clip Officiel).mp3" },
        { title: "Ça va aller", artist: "Pidi", src: "/music/PIDI - Ça va aller (Clip Officiel).mp3" },
    ],
    focus: [
        // Placeholder relax music
        { title: "Lofi Study", artist: "Focus Chill", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Deep Work", artist: "Ambient Flow", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "Rain Sounds", artist: "Nature", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    ]
};

type PlaylistType = keyof typeof PLAYLISTS;

export default function AudioPlayer() {
    const [activePlaylist, setActivePlaylist] = useState<PlaylistType>('troll');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playlist = PLAYLISTS[activePlaylist];
    const currentTrack = playlist[currentTrackIndex];

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = val;
            setProgress(val);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        let newIndex = (currentTrackIndex + 1) % playlist.length;
        setCurrentTrackIndex(newIndex);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        let newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        setCurrentTrackIndex(newIndex);
        setIsPlaying(true);
    };

    // Switch Playlist Logic
    const togglePlaylist = () => {
        const newPlaylist = activePlaylist === 'troll' ? 'focus' : 'troll';
        setActivePlaylist(newPlaylist);
        setCurrentTrackIndex(0);
        setIsPlaying(false); // Pause on switch to avoid abrupt blast
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            setTimeout(() => {
                audioRef.current?.play().catch(() => { });
            }, 100);
        }
    }, [currentTrackIndex, activePlaylist]);

    const formatTime = (t: number) => {
        if (isNaN(t)) return "00:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="fixed bottom-4 left-0 w-full flex justify-center md:w-auto md:left-auto md:bottom-auto md:top-4 md:right-4 z-[100] font-sketch">
            <div className="flex flex-col items-center md:items-end gap-0">
                <audio
                    ref={audioRef}
                    src={currentTrack.src}
                    onEnded={nextTrack}
                    onTimeUpdate={handleTimeUpdate}
                    muted={isMuted}
                />

                {/* SKETCHY PLAYER BAR */}
                <div
                    className="
            flex items-center gap-3 bg-[#e2d1a6] text-[#1a1918]
            border-2 border-[#1a1918] px-5 py-3 
            shadow-[3px_3px_0px_rgba(0,0,0,1)] 
            transition-all duration-300 relative z-20
        "
                    style={{
                        borderRadius: '50px 255px 40px 225px / 255px 30px 225px 40px',
                        transform: 'rotate(-2deg)'
                    }}
                >

                    {/* Controls */}
                    <div className="flex items-center gap-1">
                        <button onClick={prevTrack} className="p-1 hover:text-[#d35400] transition-colors">
                            <SkipBack className="w-5 h-5 stroke-[3]" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="
                    w-8 h-8 flex items-center justify-center 
                    border-2 border-[#1a1918] rounded-full mx-1
                    hover:bg-[#1a1918] hover:text-[#e2d1a6] transition-colors
                "
                            style={{ borderRadius: '50% 40% 60% 50% / 50% 60% 40% 50%' }}
                        >
                            {isPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
                        </button>

                        <button onClick={nextTrack} className="p-1 hover:text-[#d35400] transition-colors">
                            <SkipForward className="w-5 h-5 stroke-[3]" />
                        </button>
                    </div>

                    {/* Separator */}
                    <div className="w-[2px] h-8 bg-[#1a1918]/20 mx-1 rotate-3 rounded-full"></div>

                    {/* Track Info & Progress */}
                    <div className="flex flex-col w-32 md:w-40 justify-center">
                        <span className="text-xs font-bold truncate max-w-full leading-tight">
                            {currentTrack.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider truncate max-w-full opacity-80 -mt-0.5">
                            {currentTrack.artist}
                        </span>

                        <div className="flex items-center gap-2 w-full mt-1">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={progress}
                                onChange={handleProgressChange}
                                className="
                        w-full h-1.5 bg-[#1a1918]/10  appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1a1918]
                        [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#e2d1a6]
                    "
                                style={{ borderRadius: '4px' }}
                            />
                            <span className="text-[9px] font-mono w-7 text-right opacity-60">
                                {formatTime(progress)}
                            </span>
                        </div>
                    </div>

                    {/* Mute Only */}
                    <div className="w-[2px] h-8 bg-[#1a1918]/20 mx-1 -rotate-2 rounded-full"></div>

                    <button onClick={() => setIsMuted(!isMuted)} className="text-[#1a1918]/70 hover:text-red-500" title="Mute/Unmute">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                </div>

                {/* Playlist Switcher Tag (Dangling Button) */}
                <button
                    onClick={togglePlaylist}
                    className="
            mt-[-10px] mr-10 z-10 
            bg-[#1a1918] text-[#e2d1a6] 
            px-4 py-1.5 pt-3
            text-[10px] font-bold uppercase tracking-widest
            border-x-2 border-b-2 border-[#e2d1a6] rounded-b-xl
            hover:bg-[#e2d1a6] hover:text-[#1a1918] transition-all
            flex items-center gap-2 shadow-lg hover:pt-4
        "
                    style={{ transform: 'rotate(1deg)' }}
                >
                    {activePlaylist === 'troll' ? (
                        <>
                            <Zap className="w-3 h-3" />
                            <span> PLAYLIST TROLL</span>
                        </>
                    ) : (
                        <>
                            <Coffee className="w-3 h-3" />
                            <span> PLAYLIST CHILL</span>
                        </>
                    )}
                </button>

            </div>
        </div>
    );
}
