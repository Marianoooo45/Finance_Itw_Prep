'use client';

import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { filledSketchStyle } from '@/lib/sketchy-shapes';

interface QuestionMarkProps {
    width?: number;
    height?: number;
    className?: string;
    variant?: 'large' | 'medium' | 'small';
}

/**
 * QuestionMark - Point d'interrogation dessiné à la main
 * 
 * Utilise Rough.js pour un rendu "croquis" avec hachures.
 * Trois tailles disponibles: large, medium, small.
 */
export const QuestionMark: React.FC<QuestionMarkProps> = ({
    width = 80,
    height = 100,
    className = '',
    variant = 'medium',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);

        // Style avec hachures
        const style = {
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

        // Paths adaptés selon la taille
        let bodyPath: string;
        let dotPath: string;
        let scale: number;

        switch (variant) {
            case 'large':
                // Grande version (référence: 500x600 canvas)
                scale = Math.min(width / 500, height / 600);
                ctx.scale(scale, scale);
                bodyPath = `
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
                dotPath = `M 220 380 L 270 380 L 270 430 L 220 430 Z`;
                break;

            case 'small':
                // Petite version simple
                bodyPath = `M ${width * 0.3} ${height * 0.5} Q ${width * 0.2} ${height * 0.25} ${width * 0.5} ${height * 0.1} Q ${width * 0.8} ${height * 0.1} ${width * 0.8} ${height * 0.35} Q ${width * 0.8} ${height * 0.5} ${width * 0.5} ${height * 0.55} L ${width * 0.5} ${height * 0.7}`;
                dotPath = `M ${width * 0.45} ${height * 0.8} L ${width * 0.55} ${height * 0.8} L ${width * 0.55} ${height * 0.9} L ${width * 0.45} ${height * 0.9} Z`;
                style.strokeWidth = 1.5;
                style.hachureGap = 3;
                break;

            case 'medium':
            default:
                // Version medium
                scale = Math.min(width / 100, height / 120);
                ctx.scale(scale, scale);
                bodyPath = `
          M 25 50 
          C 25 30, 35 15, 50 15 
          C 65 15, 75 30, 75 45 
          C 75 60, 60 68, 55 78 
          L 55 88 
          L 45 88 
          L 45 78 
          C 48 68, 62 60, 62 48 
          C 62 38, 56 28, 50 28 
          C 44 28, 38 38, 38 50 
          Z
        `;
                dotPath = `M 45 95 L 55 95 L 55 105 L 45 105 Z`;
                break;
        }

        rc.path(bodyPath, style);
        rc.path(dotPath, style);

    }, [width, height, variant]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width, height }}
        />
    );
};

export default QuestionMark;
