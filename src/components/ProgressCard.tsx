'use client';

import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface ProgressCardProps {
    progress?: number; // 0 à 1
    className?: string;
}

/**
 * ProgressCard - Barre de progression dessinée à la main
 * 
 * Avec hachures et style cahier.
 */
export const ProgressCard: React.FC<ProgressCardProps> = ({
    progress = 0.65,
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
            fill: '#f8f6f0', // Fond blanc/papier
            fillStyle: 'solid',
            roughness: 1,
            stroke: '#222',
            strokeWidth: 2,
            bowing: 1.5
        });

        // --- Configuration de la barre ---
        const barX = 25;
        const barY = 70; // Plus bas pour centrer avec le texte au-dessus
        const barWidth = width - 50;
        const barHeight = 25;
        const cornerRadius = 8;

        // --- Styles Rough.js ---
        const outlineStyle = {
            stroke: '#222',
            strokeWidth: 2,
            roughness: 1.2,
            bowing: 1,
            fill: 'none'
        };

        const fillStyle = {
            stroke: 'none',
            fill: '#333',
            fillStyle: 'hachure' as const,
            hachureGap: 3,
            hachureAngle: 60,
            roughness: 2
        };

        const decorStyle = { stroke: '#d0c0a0', strokeWidth: 1.5, roughness: 0.8 };

        // Fonction pour rectangle arrondi SVG
        const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
            return `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} z`;
        };

        // --- DESSIN ---

        // 2. Décors (Lignes de cahier)
        // Fond de la barre (track)
        rc.path(roundedRectPath(barX, barY, barWidth, barHeight, cornerRadius), {
            fill: '#e8e0d4',
            fillStyle: 'solid',
            stroke: 'none'
        });

        // 3. Remplissage (la progression)
        const currentFillWidth = barWidth * progress;
        if (currentFillWidth > cornerRadius * 2) {
            // Fond solide jaune pour la partie remplie
            rc.path(roundedRectPath(barX, barY, currentFillWidth, barHeight, cornerRadius), {
                fill: '#e2cfa5',
                fillStyle: 'solid',
                stroke: 'none'
            });
            // Hachures par-dessus
            rc.path(roundedRectPath(barX, barY, currentFillWidth, barHeight, cornerRadius), fillStyle);
        }

        // 4. Contour de la barre complète
        rc.path(roundedRectPath(barX, barY, barWidth, barHeight, cornerRadius), outlineStyle);

    }, [progress]);

    const percentText = `${Math.round(progress * 100)}%`;

    return (
        <div className={`progress-card-wrapper ${className}`}>
            <canvas ref={canvasRef} className="progress-canvas" />
            <div className="progress-content-overlay flex flex-col items-center justify-start pt-3">
                <div className="flex items-center gap-3">
                    <span className="text-xl text-[#3a3530]" style={{ fontFamily: "'Special Elite', system-ui" }}>PROGRESS:</span>
                    <span className="text-2xl font-bold text-[#3a3530]" style={{ fontFamily: "'Special Elite', system-ui" }}>{percentText}</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressCard;
