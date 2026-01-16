'use client';

import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import {
    drawRoundedCard,
    drawNotebookLines,
    drawSketchyUnderline,
    drawStartCircle,
    drawMiniGraph,
} from '@/lib/sketchy-shapes';

interface QuizCardProps {
    className?: string;
}

/**
 * QuizCard - Carte "Quiz Mode" avec rendu Canvas Rough.js
 */
export const QuizCard: React.FC<QuizCardProps> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 400;
        const height = 350;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);

        // 1. Fond arrondi
        drawRoundedCard(rc, width, height, 30);

        // 2. Lignes de cahier
        drawNotebookLines(rc, width, height);

        // 3. Soulignement du titre
        drawSketchyUnderline(rc, 100, 95, 300, 95);

        // 4. Cercle START
        drawStartCircle(rc, width / 2, height / 2 + 30, 55);

        // 5. Graphique (bas droite)
        drawMiniGraph(rc, 280, 220);

        // 6. Points d'interrogation avec le nouveau design (hachures)
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

        // Paths du point d'interrogation (référence: 500x600)
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

        // --- GRAND point d'interrogation (bas gauche) ---
        ctx.save();
        ctx.translate(20, 180);
        ctx.scale(0.22, 0.22);
        rc.path(qMarkBody, qStyle);
        rc.path(qMarkDot, qStyle);
        ctx.restore();

        // --- PETIT point d'interrogation 1 (haut droite, incliné) ---
        ctx.save();
        ctx.translate(310, 100);
        ctx.rotate(0.15);
        ctx.scale(0.12, 0.12);
        rc.path(qMarkBody, { ...qStyle, strokeWidth: 1.5, hachureGap: 4 });
        rc.path(qMarkDot, { ...qStyle, strokeWidth: 1.5, hachureGap: 4 });
        ctx.restore();

        // --- PETIT point d'interrogation 2 (plus haut à droite, autre inclinaison) ---
        ctx.save();
        ctx.translate(350, 85);
        ctx.rotate(-0.1);
        ctx.scale(0.10, 0.10);
        rc.path(qMarkBody, { ...qStyle, strokeWidth: 1.2, hachureGap: 3 });
        rc.path(qMarkDot, { ...qStyle, strokeWidth: 1.2, hachureGap: 3 });
        ctx.restore();

    }, []);

    return (
        <div className={`sketch-card-wrapper transition-all duration-300 hover:translate-y-[-4px] ${className}`}>
            <canvas ref={canvasRef} className="sketch-canvas" />
            <div className="card-content-overlay">
                <h1 className="quiz-title-sketch">QUIZ MODE</h1>
                <div className="start-btn-sketch-text">START</div>
            </div>
        </div>
    );
};

export default QuizCard;
