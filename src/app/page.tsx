'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import rough from 'roughjs';
import { RevisionCard, ProgressCard, DailyStreakCard, QuizCard } from '@/components';
import LayoutDecorations from '@/components/LayoutDecorations';
import { checkAndUpdateStreak, getProgressPercentage } from '@/lib/user-stats';
import { REVISION_SHEETS } from '@/data/sheets';



const WobblyDecoration = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 12" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M2 6 Q15 2 30 6 Q45 10 60 6 Q75 2 90 6 Q105 10 118 6" />
  </svg>
);

// --- Audio Globals (Persist across navigation) ---
let globalPencilAudio: HTMLAudioElement | null = null;
let globalPaperAudio: HTMLAudioElement | null = null;

// --- Composant Principal ---

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Initial streak check
    const currentStreak = checkAndUpdateStreak();
    setStreak(currentStreak);

    // 2. Initial progress check
    const totalSheets = REVISION_SHEETS.length;
    setProgress(getProgressPercentage(totalSheets));

    // 3. Listen for progress updates
    const handleProgressUpdate = () => {
      setProgress(getProgressPercentage(totalSheets));
    };

    window.addEventListener('progress-updated', handleProgressUpdate);

    // 4. Preload Sounds (Lazy Init)
    if (typeof window !== 'undefined') {
      if (!globalPencilAudio) {
        globalPencilAudio = new Audio('/music/sound effects/stylo.m4a');
        globalPencilAudio.volume = 0.5;
        globalPencilAudio.load();
      }
      if (!globalPaperAudio) {
        globalPaperAudio = new Audio('/music/sound effects/papier froissement.m4a');
        globalPaperAudio.volume = 0.5;
        globalPaperAudio.load();
      }
    }

    return () => window.removeEventListener('progress-updated', handleProgressUpdate);
  }, []);

  const playPencil = () => {
    if (globalPencilAudio) {
      globalPencilAudio.currentTime = 0; // Instant replay
      globalPencilAudio.play().catch(() => { });
    }
  };

  const playPaper = () => {
    if (globalPaperAudio) {
      globalPaperAudio.currentTime = 0; // Instant replay
      globalPaperAudio.play().catch(() => { });
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10 lg:p-12 relative overflow-hidden"
      style={{
        background: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at center top, #2d2b2b 0%, #1f1d1d 40%, #161515 100%)
        `,
        backgroundColor: '#1a1918',
      }}
    >
      {/* Effet poussière de craie */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.015) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.01) 0%, transparent 40%)
          `,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* HEADER */}
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl tracking-wide mb-4 whitespace-nowrap"
            style={{
              fontFamily: "'Cabin Sketch', sans-serif",
              fontWeight: 700,
              color: '#e2d1a6',
              textShadow: `
                1px 1px 0px #1a1a1a,
                2px 2px 0px rgba(0,0,0,0.5),
                0px 0px 8px rgba(226, 209, 166, 0.2)
              `,
            }}
          >
            FINANCE INTERVIEW PREP
          </h1>
          <div className="flex justify-center">
            <WobblyDecoration className="w-64 md:w-96 text-[#e2d1a6] opacity-80" />
          </div>
          <div className="flex justify-center mt-[-4px]">
            <WobblyDecoration className="w-56 md:w-[28rem] text-[#e2d1a6] opacity-50" />
          </div>
        </header>

        {/* CONTAINER GRILLE AVEC DÉCORATIONS */}
        <div className="relative w-full max-w-5xl mx-auto">
          <LayoutDecorations />

          {/* GRILLE PRINCIPALE - Ligne 1 */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 items-start justify-center">
            {/* Carte 1: Revision Sheets (Plus large - 60%) */}
            <div className="w-full md:w-[60%]">
              <Link
                href="/revision-sheets"
                className="block w-full h-full"
                onMouseDown={playPencil}
              >
                <RevisionCard />
              </Link>
            </div>

            {/* Carte 2: QUIZ MODE (Plus carré - 40%) */}
            <div className="w-full md:w-[40%] cursor-pointer" onMouseDown={playPaper}>
              <QuizCard />
            </div>
          </div>

          {/* SECTION STATS - Ligne 2 (Alignement sous les cartes du haut) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Daily Streak */}
            <div className="w-full md:w-[40%]">
              <DailyStreakCard streak={streak} />
            </div>

            {/* Progress */}
            <div className="w-full md:w-[60%]">
              <ProgressCard progress={progress / 100} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}