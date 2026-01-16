'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import rough from 'roughjs';
import { RevisionCard, ProgressCard, DailyStreakCard } from '@/components';
import LayoutDecorations from '@/components/LayoutDecorations';
import { checkAndUpdateStreak, getProgressPercentage } from '@/lib/user-stats';
import { REVISION_SHEETS } from '@/data/sheets';

// --- Composants Utilitaires ---

const RoughElement = ({
  draw,
  width,
  height,
  className = ""
}: {
  draw: (rc: any) => any[];
  width: number;
  height: number;
  className?: string
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Nettoyage
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }
      const rc = rough.svg(svgRef.current);
      const nodes = draw(rc);

      // Gestion tableau ou élément unique
      if (Array.isArray(nodes)) {
        nodes.forEach(node => svgRef.current?.appendChild(node));
      } else if (nodes) {
        svgRef.current.appendChild(nodes);
      }
    }
  }, [draw]);

  return <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} />;
};

const QuizCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Début du code de dessin ---
    const width = 400;
    const height = 350;

    // Gestion du Retina/DPR
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;
    ctx.scale(dpr, dpr);

    const rc = rough.canvas(canvas);
    const r = 30; // Rayon des coins

    // 1. Fond blanc/beige avec coins arrondis (Path au lieu de rectangle)
    const cardPath = `
      M ${5 + r} 5 
      L ${width - 5 - r} 5 
      Q ${width - 5} 5 ${width - 5} ${5 + r} 
      L ${width - 5} ${height - 5 - r} 
      Q ${width - 5} ${height - 5} ${width - 5 - r} ${height - 5} 
      L ${5 + r} ${height - 5} 
      Q 5 ${height - 5} 5 ${height - 5 - r} 
      L 5 ${5 + r} 
      Q 5 5 ${5 + r} 5 
      Z
    `;

    rc.path(cardPath, {
      fill: "#fffbf0",
      fillStyle: "solid",
      roughness: 1.2,
      stroke: "#333",
      strokeWidth: 2,
      bowing: 1.5,
      disableMultiStroke: true,
    });

    // 2. Lignes de cahier
    const lineHeight = 35;
    const startY = 80;
    for (let y = startY; y < height - 20; y += lineHeight) {
      rc.line(15, y, width - 15, y, {
        stroke: "#d1d1d1",
        strokeWidth: 1,
        roughness: 0.5,
        bowing: 1,
      });
    }

    // 3. Soulignement du titre (sketchy lines)
    rc.line(100, 95, 300, 95, { stroke: "#333", roughness: 2, strokeWidth: 1.5 });
    rc.line(110, 102, 290, 100, { stroke: "#333", roughness: 2, strokeWidth: 1.5 });

    // 4. Cercle START (Fini les hachures)
    const centerX = width / 2;
    const centerY = height / 2 + 30;
    const radius = 55;
    rc.circle(centerX, centerY, radius * 2, {
      fill: "#e2cfa5",
      fillStyle: "solid",
      stroke: "#333",
      strokeWidth: 3,
      roughness: 1.5,
      bowing: 1.2
    });

    // 5. Graphique (bas droite)
    const chartX = 280;
    const chartY = 220;
    // Axes
    rc.path(`M${chartX} ${chartY} L${chartX} ${chartY + 50} L${chartX + 60} ${chartY + 50}`, { strokeWidth: 2, stroke: "#333" });

    // Barres zigzag
    rc.rectangle(chartX + 10, chartY + 35, 10, 15, { fill: "#333", fillStyle: "zigzag", stroke: "none" });
    rc.rectangle(chartX + 25, chartY + 20, 10, 30, { fill: "#333", fillStyle: "zigzag", stroke: "none" });
    rc.rectangle(chartX + 40, chartY + 10, 10, 40, { fill: "#333", fillStyle: "zigzag", stroke: "none" });

    // Flèche du graphique
    rc.path(`M${chartX + 5} ${chartY + 45} L${chartX + 55} ${chartY + 15}`, { strokeWidth: 2, stroke: "#333" });
    rc.path(`M${chartX + 50} ${chartY + 20} L${chartX + 55} ${chartY + 15} L${chartX + 60} ${chartY + 20}`, { strokeWidth: 2, stroke: "#333" });

    // 6. Points d'interrogation avec hachures
    const qStyle = {
      roughness: 2.8,
      bowing: 1.5,
      stroke: '#000000',
      strokeWidth: 2,
      fill: '#000000',
      fillStyle: 'hachure' as const,
      fillWeight: 1,
      hachureAngle: 65,
      hachureGap: 5,
    };

    const qMarkBody = `
      M 130 200 
      C 130 110, 170 70, 250 70 
      C 320 70, 350 110, 350 170 
      C 350 230, 290 250, 270 280 
      L 270 340 
      L 220 340 
      L 220 280 
      C 240 250, 290 230, 290 180 
      C 290 150, 270 120, 240 120 
      C 210 120, 190 150, 190 200 
      Z
    `;
    const qMarkDot = `M 220 380 L 270 380 L 270 430 L 220 430 Z`;

    // GRAND point d'interrogation (bas gauche)
    ctx.save();
    ctx.translate(20, 175);
    ctx.scale(0.22, 0.22);
    rc.path(qMarkBody, qStyle);
    rc.path(qMarkDot, qStyle);
    ctx.restore();

    // PETIT point d'interrogation 1 (haut droite)
    ctx.save();
    ctx.translate(305, 95);
    ctx.rotate(0.12);
    ctx.scale(0.13, 0.13);
    rc.path(qMarkBody, { ...qStyle, strokeWidth: 1.5, hachureGap: 4 });
    rc.path(qMarkDot, { ...qStyle, strokeWidth: 1.5, hachureGap: 4 });
    ctx.restore();

    // PETIT point d'interrogation 2 (plus petit, à droite)
    ctx.save();
    ctx.translate(355, 85);
    ctx.rotate(-0.08);
    ctx.scale(0.09, 0.09);
    rc.path(qMarkBody, { ...qStyle, strokeWidth: 1.2, hachureGap: 3 });
    rc.path(qMarkDot, { ...qStyle, strokeWidth: 1.2, hachureGap: 3 });
    ctx.restore();


  }, []);

  return (
    <div className="sketch-card-wrapper transition-all duration-300 hover:translate-y-[-4px]">
      <canvas ref={canvasRef} className="sketch-canvas" />
      <div className="card-content-overlay">
        <h1 className="quiz-title-sketch">QUIZ MODE</h1>
        <div className="start-btn-sketch-text">START</div>
      </div>
    </div>
  );
};

const WobblyDecoration = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 12" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M2 6 Q15 2 30 6 Q45 10 60 6 Q75 2 90 6 Q105 10 118 6" />
  </svg>
);

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
    return () => window.removeEventListener('progress-updated', handleProgressUpdate);
  }, []);

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
              <Link href="/revision-sheets" className="block w-full h-full">
                <RevisionCard />
              </Link>
            </div>

            {/* Carte 2: QUIZ MODE (Plus carré - 40%) */}
            <div className="w-full md:w-[40%]">
              <QuizCard />
            </div>
          </div>

          {/* SECTION STATS - Ligne 2 (Alignement sous les cartes du haut) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Daily Streak */}
            <div className="w-full md:w-[60%]">
              <DailyStreakCard streak={streak} />
            </div>

            {/* Progress */}
            <div className="w-full md:w-[40%]">
              <ProgressCard progress={progress / 100} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}