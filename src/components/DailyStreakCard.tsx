'use client';

import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { Flame } from 'lucide-react';

interface DailyStreakCardProps {
    streak?: number;
    className?: string;
}

/**
 * DailyStreakCard - Carte "Daily Streak" avec rendu Canvas Rough.js
 * 
 * Style identique au ProgressCard (carte jaune, coins arrondis, lignes de cahier).
 */
export const DailyStreakCard: React.FC<DailyStreakCardProps> = ({
    streak = 5,
    className = ''
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 400;
        const height = 120; // Plus haut

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);
        const rc = rough.canvas(canvas);

        // --- 1. FOND DE LA CARTE (Jaune/Beige) ---
        const r = 10;
        rc.path(`
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
        `, {
            fill: '#f8f6f0',
            fillStyle: 'solid',
            roughness: 1,
            stroke: '#222',
            strokeWidth: 2,
            bowing: 1.5
        });

        // --- 2. DÉCORS (Lignes de cahier) ---
        const decorStyle = { stroke: '#d0c0a0', strokeWidth: 1.5, roughness: 0.8 };
        // Ligne verticale marge
        rc.line(10, 0, 10, height, decorStyle);
        // Ligne horizontale texte
        rc.line(0, 80, width, 80, decorStyle); // Ajusté pour 120px de haut

    }, []);

    const daysText = `${streak} DAYS`;

    return (
        <div className={`streak-card-wrapper ${className}`}>
            <canvas ref={canvasRef} className="streak-canvas" />
            <div className="streak-content-overlay">
                <div className="streak-content-inner">
                    <div className="streak-label-group">
                        <Flame className="streak-icon" strokeWidth={2.5} />
                        <span className="streak-label">DAILY STREAK:</span>
                    </div>
                    <span className="streak-value">{daysText}</span>
                </div>
            </div>
        </div>
    );
};

export default DailyStreakCard;
